import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable, ImageBackground,Modal, ScrollView, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { MaterialIcons } from '@expo/vector-icons';
//import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import card_database from "./assets/data/card_database.json";
import * as Speech from 'expo-speech';
import {setAudioModeAsync,createAudioPlayer} from 'expo-audio';
import bgImg from "./assets/images/background.jpg";
import styles from './AppStyle';


//import Tts from 'react-native-tts';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  // const card_database = "./assets/data/card_database.csv";
  const nextButtonImg = "./assets/images/next-64.png";
  const prevButtonImg = "./assets/images/previous-64.png";
  const speakerImg = "./assets/images/foreign-language-sound-64.png";
  const translateImg = "./assets/images/translation-50.png";
  const noPronounImg = "./assets/images/no-audio-50.png";
  const showPronounImg = "./assets/images/speaker-50.png";
  const randomImg = "./assets/images/dice-80.png";
  const quizImg = "./assets/images/test.png";

  const [itemSeq, setItemSeq] = useState(0);
  const [showTranslate, setShowTranslate] = useState(1);
  const [showPronoun, setShowPronoun] = useState(1);
  // about page
  const [aboutVisible, setAboutVisible] = useState(false);

  // const [swipeDirection, setSwipeDirection] = useState('');
  const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_DOWN, SWIPE_UP} = swipeDirections;
  const [menuVisible, setMenuVisible] = useState(false);

 // Quiz state
 const [quizVisible, setQuizVisible] = useState(false);
 const [quizQuestion, setQuizQuestion] = useState(null);
 const [quizOptions, setQuizOptions] = useState([]);
 const [quizAnswerIndex, setQuizAnswerIndex] = useState(null);
 const [quizResult, setQuizResult] = useState(null);
 const [quizCorrect, setQuizCorrect] = useState(0);
 const [quizTotal, setQuizTotal] = useState(0);
 
// existing state and helpers …
// initialise the audio mode once
  useEffect(() => {
    async function initAudioMode() {
      try {
        await setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
      } catch (err) {
        // this is where you were seeing “Error readWord configuring audio mode”
        // – it isn’t fatal, just log it once.
        console.warn('audio mode initialization failed:', err);
      }
    }
    initAudioMode();
  }, []);

  // speak the current card whenever it becomes visible
  useEffect(() => {
    if (showPronoun === 1) {
      const card = card_database[itemSeq];
      if (card) {
        readWord(card);
        setTimeout(() => {readSample(card.Sample_JP);}, 2000);
      }
    }
  }, [itemSeq, showPronoun]);

 function startQuiz() {
   // pick random question
   const qIdx = Math.floor(Math.random() * card_database.length);
   const question = card_database[qIdx];
 
   // build options array (correct  3 distinct distractors)
   const options = [question];
   while (options.length < 4) {
     const idx = Math.floor(Math.random() * card_database.length);
     const candidate = card_database[idx];
     if (!options.find(o => o.Title === candidate.Title)) options.push(candidate);
   }
   // shuffle
   for (let i = options.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [options[i], options[j]] = [options[j], options[i]];
   }
   setQuizQuestion(question);
   setQuizOptions(options);
   setQuizAnswerIndex(null);
   setQuizResult(null);
   setQuizCorrect(0);
   setQuizTotal(0);
   setQuizVisible(true);
 }
 
  function nextQuestion() {
   // pick random question without resetting marks
   const qIdx = Math.floor(Math.random() * card_database.length);
   const question = card_database[qIdx];
 
   // build options array (correct  3 distinct distractors)
   const options = [question];
   while (options.length < 4) {
     const idx = Math.floor(Math.random() * card_database.length);
     const candidate = card_database[idx];
     if (!options.find(o => o.Title === candidate.Title)) options.push(candidate);
   }
   // shuffle
   for (let i = options.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [options[i], options[j]] = [options[j], options[i]];
   }
   setQuizQuestion(question);
   setQuizOptions(options);
   setQuizAnswerIndex(null);
   setQuizResult(null);
 }

 function submitAnswer(idx) {
   if (quizAnswerIndex !== null) return;
   const correct = quizOptions[idx].Title === quizQuestion.Title;
   setQuizAnswerIndex(idx);
   setQuizResult(correct);
   setQuizTotal(quizTotal + 1);
   if (correct) {
     setQuizCorrect(quizCorrect + 1);
   }
  // after showing result, advance to next question after 1 second
  setTimeout(() => {
    if (quizVisible) nextQuestion();
  }, 1000);
 }
 

  //Tts.setDefaultLanguage('en-IE');
  // Tts.addEventListener('tts-start', event => console.log('start', event));
  // Tts.addEventListener('tts-finish', event => console.log('finish', event));
  // Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
  
  async function readWord( theWord ) {
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true, // Ensures playback in silent mode
      });

    // Play a short silent sound to initialize the audio session
    try {
      const result = createAudioPlayer(require('./assets/1-second-of-silence.mp3'));
      const sound = result && result.sound ? result.sound : null;
      if (sound && typeof sound.playAsync === 'function') {
        await sound.playAsync();
        await sound.unloadAsync();
      }
    } catch (err) {
      console.error('Error playing init sound:', err);
    }

      if (showPronoun === 1) {
        Speech.speak((theWord.Subtitle === "" ? theWord.Title:theWord.Subtitle), {language:'ja-JP', rate:0.8});
      }
    } catch (error) {

      console.error('Error readWord configuring audio mode:', error);
    }

  }

  async function readSample ( Sample_in_JP ) {
    try {
        // Configure audio mode to play in silent mode
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true, // Ensures playback in silent mode
        });
        Speech.speak(Sample_in_JP,{language:'ja-JP'} );
    } catch (error) {
      console.error('Error in readSample configuring audio mode:', error);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    
    if (error.nativeStackIOS) {
      console.error("Native iOS Stack:", error.nativeStackIOS);
    }
    }
  }

  function nextCard() {
    if (itemSeq < card_database.length-1) {
      setItemSeq(itemSeq+1);
    } else {
      setItemSeq(1);
    }
    console.log("items ", itemSeq,card_database[itemSeq] )
  }

  function prevCard() {
    if (itemSeq >= 1) {
      setItemSeq(itemSeq-1);
    } else {
      setItemSeq(card_database.length-1)
    }
    console.log("items ", itemSeq,card_database[itemSeq] )

  }
  function randomCard() {
    setItemSeq( Math.floor(Math.random() * (card_database.length-1)) );
    console.log("items ", itemSeq,card_database[itemSeq] )

  }
  function showOnOff() {
    setShowTranslate(showTranslate===0?1:0);
  }

  function pronounOnOff() {
    setShowPronoun(showPronoun===0?1:0);
  }

  function onSwipe(gestureName, currentWord){
   // setSwipeDirection(gestureName);
    switch (gestureName) {
      case SWIPE_LEFT:
        nextCard();
        break;
      case SWIPE_RIGHT:
        prevCard();           
        break;
      case SWIPE_UP:
        readWord(currentWord);
        break;
      case SWIPE_DOWN:
        randomCard();
        break;
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.img} source={bgImg} resizeMode='cover'>     
      
      <Pressable style={{position: 'absolute', top: 40, left: 20, zIndex: 10}} onPress={() => setMenuVisible(true)}>
        <Text style={{fontSize: 28}}>☰</Text>
      </Pressable>
      
      <Modal visible={menuVisible} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            width: 260,
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center'
          }}>
            <Text style={{fontSize: 22, fontFamily: 'Cochin', marginBottom: 18}}>Menu</Text>
            <Pressable onPress={() => { setMenuVisible(false); /* go to home */ }}>
              <Text style={{fontSize: 18, marginVertical: 8}}>Home</Text>
            </Pressable>
            <Pressable onPress={() => { setMenuVisible(false); startQuiz(); }}>
            
             <Text style={{fontSize: 18, marginVertical: 8}}>Quiz</Text>
           </Pressable>
            <Pressable onPress={() => { setMenuVisible(false); randomCard(); }}>
              <Text style={{fontSize: 18, marginVertical: 8}}>Random Card</Text>
            </Pressable>
            <Pressable onPress={() => { setMenuVisible(false); showOnOff(); }}>
              <Text style={{fontSize: 18, marginVertical: 8}}>Toggle Translation</Text>
            </Pressable>
            <Pressable onPress={() => { setMenuVisible(false); pronounOnOff(); }}>
              <Text style={{fontSize: 18, marginVertical: 8}}>Toggle Pronunciation</Text>
            </Pressable>
            <Pressable onPress={() => { setMenuVisible(false); setAboutVisible(true); }}>
              <Text style={{fontSize: 18, marginVertical: 8}}>About</Text>
            </Pressable>
            <Pressable onPress={() => setMenuVisible(false)}>
              <Text style={{fontSize: 18, marginVertical: 8, color: 'gray'}}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      <View style={styles.heading}> 
        <Text style={styles.heading}>日文N5單字</Text>
        <Text style={styles.heading}>Japanese N5 Vocabulary</Text>
      </View>
      <GestureRecognizer
        onSwipe={(direction) => onSwipe(direction,card_database[itemSeq])}
      >
      <View style={styles.mainView}>
        <Text style={styles.title}>{card_database[itemSeq].Title}</Text>
        <Text style={styles.subtitle}>{card_database[itemSeq].Subtitle === "" ? "": "(" + card_database[itemSeq].Subtitle + ")"}</Text>
        <Text style={styles.blank}></Text>
        <Pressable style={styles.barView} 
              onPress={()=>readWord(card_database[itemSeq])}>
            <Image style={[styles.speakerImg,{opacity:showPronoun}]} source={require(speakerImg) }/>
            <Text style={[styles.pronoun,{opacity:showPronoun}]}>  {card_database[itemSeq].Pronoun}</Text>
        </Pressable>
        <Text style={styles.blank}></Text>
        <Text style={[styles.description,{opacity:showTranslate}]}>{card_database[itemSeq].Chinese}</Text>
        <Text style={[styles.description,{opacity:showTranslate}]}>{card_database[itemSeq].English}</Text>
        <StatusBar style="auto"/>
      </View>
      </GestureRecognizer>

      <View style={{width: '80%', alignSelf: 'center', height: 1, backgroundColor: '#bbb', marginVertical: 10}} />

      <View style={styles.middleVew}>        
        <Text style={[styles.subtitle]}>Example 例文</Text>
        <Pressable style={styles.barView} 
              onPress={()=>readSample(card_database[itemSeq].Sample_JP)}>
        <Text style={[styles.description]}>{card_database[itemSeq].Sample_JP}</Text>
        </Pressable>
        <Pressable style={styles.barView} 
              onPress={()=>readSample(card_database[itemSeq].Sample_KJ)}>
        <Text style={[styles.description]}>{card_database[itemSeq].Sample_KJ}</Text>
        </Pressable>        
        <Text style={[styles.description,{opacity:showTranslate}]}>{card_database[itemSeq].Sample_En}</Text>

      </View>


      <View style={styles.barView}>
        <Pressable onPress={showOnOff}>
          <Image style={[styles.translateImgSize,{opacity:(showTranslate===1?1:0.1)}]} source={require(translateImg) }/>
        </Pressable>
        <Text>    </Text>
        <Pressable onPress={pronounOnOff}>
          <Image style={[styles.noPronounImgSize,{opacity:(showPronoun===1?1:0.5)}]} source={(showPronoun===1?require(showPronounImg):require(noPronounImg))}/>
        </Pressable>
        <Text>    </Text>
        <Pressable onPress={randomCard}>
          <Image style={styles.noPronounImgSize} source={require(randomImg)}/>
        </Pressable>
        <Text>   　</Text>
        <Pressable onPress={startQuiz}>
          <Image style={styles.noPronounImgSize} source={require(quizImg)}/>
        </Pressable>
        <Text>    </Text>
        <Pressable onPress={prevCard}>
          <Image style={[styles.buttonImg, {opacity:(itemSeq===0?0.1:1)}]} source={require(prevButtonImg) }/>
        </Pressable>
        <Text>    </Text>
        <Pressable onPress={nextCard}>
          <Image style={[styles.buttonImg,{opacity:(itemSeq+1 === card_database.length ?0.1:1)}]} source={require(nextButtonImg)}/>
        </Pressable>

      </View>

      <View style={styles.lowerVew}>
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.aboutButton} onPress={() => setAboutVisible(true)}>
          <Text style={styles.aboutTitle}>About</Text>
        </Pressable>
        <Text style={styles.bottomText}> presented by MikeChan@Kosaon</Text>
      </View>
     {/* Quiz Modal - fixed size with answers in boxed scroll area */}
     <Modal visible={quizVisible} transparent animationType="slide">
       <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.35)', justifyContent:'center', alignItems:'center'}}>
         <View style={{width: 320, height: 420, backgroundColor:'white', borderRadius:12, padding:12}}>
           <Pressable onPress={() => setQuizVisible(false)} style={{position:'absolute', top:8, right:8, zIndex:10, padding:6}}>
             <MaterialIcons name="close" size={20} color="#333" />
           </Pressable>
           <Text style={{fontSize:20, fontFamily:'Cochin', marginBottom:8, color:'#2A3D8F', textAlign:'center'}}>Quiz</Text>
           {quizTotal > 0 && (
             <Text style={{fontSize:14, marginBottom:6, fontWeight:'bold', color:'#555', textAlign:'center'}}>Marks: {quizCorrect}/{quizTotal}</Text>
           )}
           {quizQuestion && (
             <View style={{flex:1, width:'100%'}}>
               <View style={{padding:8, alignItems:'center'}}>
                 <Text style={{fontSize:16, marginBottom:6, textAlign:'center'}}>
                   The Meaning of {" "}
                   <Text style={{fontWeight:'bold'}}>{quizQuestion.Title}</Text>?
                 </Text>
               </View>

               <View style={{flex:1, borderWidth:1, borderColor:'#e0e0e0', borderRadius:8, padding:8, backgroundColor:'#fafafa'}}>
                 {/** compute correct index once */}
                 {(() => {
                   const correctIdx = quizOptions.findIndex(o => o.Title === quizQuestion.Title);
                   return (
                     <ScrollView contentContainerStyle={{paddingVertical:4}}>
                       {quizOptions.map((opt, i) => {
                         const isSelected = quizAnswerIndex !== null && i === quizAnswerIndex;
                         let bg = '#fff';
                         if (quizAnswerIndex !== null) {
                           if (isSelected) bg = quizResult ? '#dff0d8' : '#f8d7da';
                         }
                         return (
                           <Pressable
                             key={i}
                             onPress={() => submitAnswer(i)}
                             style={{
                               width: '100%',
                               backgroundColor: bg,
                               padding: 10,
                               borderRadius: 8,
                               marginVertical: 6,
                               alignItems: 'center',
                               borderWidth: 1,
                               borderColor: '#eee'
                             }}
                           >
                             <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                               <Text style={{fontSize:16}}>
                                 {opt.English} {opt.Chinese ? ` / ${opt.Chinese}` : ''}
                               </Text>
                               {isSelected && (
                                 <MaterialIcons name={quizResult ? 'check-circle' : 'cancel'} size={20} color={quizResult ? '#2e7d32' : '#c62828'} style={{marginLeft:8}} />
                               )}
                             </View>
                           </Pressable>
                         );
                       })}
                     </ScrollView>
                   );
                 })()}
               </View>

               {/* When wrong, show the correct answer at the bottom */}
               {quizAnswerIndex !== null && quizResult === false && (
                 <View style={{marginTop:10, padding:8, borderRadius:8, backgroundColor:'#e8f5e9', borderWidth:1, borderColor:'#c8e6c9', alignItems:'center'}}>
                   <View style={{flexDirection:'row', alignItems:'center'}}>
                     <MaterialIcons name="check-circle" size={18} color="#2e7d32" style={{marginRight:6}} />
                   </View>
                   {(() => {
                     const correctIdx = quizOptions.findIndex(o => o.Title === quizQuestion.Title);
                     const correctOpt = quizOptions[correctIdx] || {};
                     return (
                       <Text style={{marginTop:6}}>{correctOpt.English} {correctOpt.Chinese ? ` / ${correctOpt.Chinese}` : ''}</Text>
                     );
                   })()}
                 </View>
               )}
{/* 
               <View style={{flexDirection:'row', justifyContent:'center', marginTop:12}}>
                 <Pressable
                   onPress={() => { quizAnswerIndex !== null ? nextQuestion() : setQuizVisible(false); }}
                   style={{padding:10, backgroundColor:'#2A3D8F', borderRadius:8, marginHorizontal:6}}>
                  <Text style={{color:'white', fontWeight:'bold'}}>{quizAnswerIndex !== null ? 'Next' : ''}</Text> 
                 </Pressable>
               </View> 
*/}
             </View>
          )}
         </View>
       </View>
     </Modal>



      <Modal visible={aboutVisible} animationType="slide">
          <ScrollView contentContainerStyle={styles.aboutContainer}>

            <Text style={styles.title}>FlashCard - Japanese N5 Vocabulary</Text>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.text}>
              Hey there! 👋 FlashCard is a fun and simple tool I created to help me master Japanese N5 vocabulary and prepare for the JLPT N5 exam.  I can swipe through the cards at my own pace, tap to hear clear pronunciations, and dive into helpful example sentences that show how each word is used in real life. It’s perfect for my quick review sessions or deeper study whenever I have a few minutes to spare!  
I hope you enjoy using it as much as I enjoyed building it. Ganbatte (good luck), and have fun learning! 🌸
            </Text>
            <Text style={styles.sectionTitle}>Features</Text>

            <Text style={styles.text}>
              • <Image style={[{width:20},{height:20}, {opacity:(1)}]} source={require(prevButtonImg) }/>
          <Image style={[{width:20},{height:20},,{opacity:(1)}]} source={require(nextButtonImg)}/> Swipe to navigate cards{'\n\n'}  
              • <Image style={[{width:15},{height:15}, {opacity:(1)}]} source={(showPronoun===1?require(showPronounImg):require(noPronounImg))}/> Toggle to Japanese pronunciation{'\n\n'}
              
              • <Image style={[{width:20},{height:20},{opacity:(1)}]} source={require(translateImg) }/> View translations in Chinese and English{'\n\n'}
              
              • <Image style={[{width:20},{height:20}, {opacity:(1)}]} source={require(randomImg)}/> Shows randomly{'\n\n'}

            • <Image style={[{width:20},{height:20}, {opacity:(1)}]} source={require(quizImg)}/> Simple test{'\n\n'}
            </Text>
            <Button title="Close" onPress={() => setAboutVisible(false)} />
          </ScrollView>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

