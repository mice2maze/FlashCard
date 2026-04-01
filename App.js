import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable, ImageBackground,Modal, ScrollView, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { MaterialIcons } from '@expo/vector-icons';
// import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
// import card_database from "./assets/data/card_database.json";
import * as Speech from 'expo-speech';
import {setAudioModeAsync,createAudioPlayer} from 'expo-audio';
import bgImg from "./assets/images/background.jpg";
import styles from './AppStyle';
import ShowLetters from './ShowLetters';

import * as XLSX from 'xlsx';
import { Asset } from 'expo-asset'; 

//import Tts from 'react-native-tts';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

let card_database = [];

export default function App() {

  // const card_database = "./assets/data/card_database.csv";
  const nextButtonImg = "arrow-circle-right";
  const prevButtonImg = "arrow-circle-left";
  const showPronounImg = "volume-up";
  const noPronounImg = "volume-off";
  const translateImg = "speaker-notes";
  const noTranslateImg = "speaker-notes-off";
  const kanjiImg = "comment";
  const noKanjiImg = "comments-disabled";
  const randomImg = "casino";
  const quizImg = "quiz";

  const [itemSeq, setItemSeq] = useState(0);
  const [showTranslate, setShowTranslate] = useState(1);
  const [showKanji, setShowKanji] = useState(1);
  const [showPronoun, setShowPronoun] = useState(1);
  // about page
  const [aboutVisible, setAboutVisible] = useState(false);
  // Japanese Letter Chart page
  const [JapLetterVisible, setJapLetterVisible] = useState(false);

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

// Menu Language state
const [menuLanguage, setMenuLanguage] = useState('en'); // 'en' or 'zh'

// load Excel file and convert to JSON - this runs once when the app starts
const [dataLoaded, setDataLoaded] = useState(false);
const [loadError, setLoadError] = useState(null);

// Load Excel file on app start
useEffect(() => {
    async function loadExcel() {
      try {
      console.log('Creating asset');  // Debug
      const asset = Asset.fromModule(require('./assets/data/card_database.xlsx'));
      console.log('Asset created:', asset);  // Debug
      
      await asset.downloadAsync();  // Download to local storage
      console.log('Download complete');  // Debug
      const response = await fetch(asset.localUri || asset.uri);  // Fetch the downloaded file
      console.log('Fetch complete, status:', response.status);  // Debug
      const arrayBuffer = await response.arrayBuffer();
      console.log('ArrayBuffer created');  // Debug
 

        // Parse the Excel file
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        card_database = data;
        console.log('Excel file loaded successfully:', card_database.length, 'cards');
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading Excel file:', error);
        setLoadError(error.message);
      }
    }

    loadExcel();
  }, []);

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

  // Show loading screen while data loads
  if (!dataLoaded) {
    return (
      <SafeAreaView style={styles.mainView}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{loadError ? `Error: ${loadError}` : 'Loading cards...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
    //console.log("items ", itemSeq,card_database[itemSeq] )
  }

  function prevCard() {
    if (itemSeq >= 1) {
      setItemSeq(itemSeq-1);
    } else {
      setItemSeq(card_database.length-1)
    }
    //console.log("items ", itemSeq,card_database[itemSeq] )

  }
  function randomCard() {
    setItemSeq( Math.floor(Math.random() * (card_database.length-1)) );
    //console.log("items ", itemSeq,card_database[itemSeq] )

  }
  function showOnOff() {
    setShowTranslate(showTranslate===0?1:0);
  }
  function kanjiOnOff() {
    setShowKanji(showKanji===1?0:1);
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
  function renderTranslation(card) {
    if (!card || !showTranslate) return null;

    return (
      <>
        <Text style={styles.blank} />
        <Text style={[styles.description, { opacity: showTranslate }]}>
          {menuLanguage === 'en' ? card.English : card.Chinese}
        </Text>
        <Text style={[styles.description, { opacity: showTranslate }]} />
      </>
    );
  }
  
  function renderPronunciation(card) {
    if (!card || !showPronoun) return null;

    return (
      <>
        <Pressable style={styles.pronounBox} 
              onPress={()=>readWord(card)}>
              <MaterialIcons name={showPronoun===1?showPronounImg:""} size={24} color="#333" />
            <Text style={[styles.pronoun,{opacity:showPronoun}]}>  {card.Pronoun}</Text>
        </Pressable>
      </>
    );
  }

  function renderKanji(card) {
    if (!card || !showKanji) return null;
    return (
      <>
        <Text style={[styles.subtitle,{opacity:showKanji}]}>{card.Subtitle === "" ? "": "(" + card.Subtitle + ")"}</Text>
        <Text style={styles.blank}></Text>
      </>
    );
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
            <Text style={{fontSize: 22, fontFamily: 'Cochin', marginBottom: 18}}>{menuLanguage === 'en' ? 'Menu' : '選單'}</Text>
            <Pressable onPress={() => { setMenuLanguage(menuLanguage === 'en' ? 'zh' : 'en'); }}>
              <Text style={{fontSize: 18, marginVertical: 8}}> {menuLanguage === 'en' ? '中文' : 'English'}</Text>
            </Pressable>
            <Pressable onPress={() => { setJapLetterVisible(true); setMenuVisible(false); }}>
              <Text style={{fontSize: 18, marginVertical: 8}}> {menuLanguage === 'en' ? 'Letter Charts' : '五十音表'}</Text>
            </Pressable>
            <Pressable onPress={() => {setMenuVisible(false); setAboutVisible(true);}}>
              <Text style={{fontSize: 18, marginVertical: 8}}>{menuLanguage === 'en' ? 'About' : '關於'}</Text>
            </Pressable>
            <Pressable onPress={() => setMenuVisible(false)}>
              <Text style={{fontSize: 18, marginVertical: 8, color: 'gray'}}>{menuLanguage === 'en' ? 'Close' : '關閉'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      <View style={styles.heading}> 
        <Text style={styles.heading}>{menuLanguage === 'en' ? 'Japanese N5 Vocabulary' : '日文N5單字'}</Text>
      </View>
      <GestureRecognizer
        onSwipe={(direction) => onSwipe(direction,card_database[itemSeq])}
      >
      <View style={styles.mainView}>
        <Text style={styles.title}>{card_database[itemSeq].Title}</Text>
        {renderKanji(card_database[itemSeq])}
        {renderPronunciation(card_database[itemSeq])}
        {renderTranslation(card_database[itemSeq])}

        <Text style={[styles.sampleTitle]}>{menuLanguage === 'en' ? 'Example' : '例文'}</Text>
        <Pressable style={styles.barView} 
              onPress={()=>readSample(card_database[itemSeq].Sample_JP)}>
        <Text style={[styles.sample_text1]}>{card_database[itemSeq].Sample_JP}</Text>
        </Pressable>
        <Pressable style={styles.barView} 
              onPress={()=>readSample(card_database[itemSeq].Sample_KJ)}>
        <Text style={[styles.sample_text2,{opacity:showKanji}]}>{card_database[itemSeq].Sample_KJ}</Text>
        </Pressable>        
        <Text style={[styles.sample_text3,{opacity:showTranslate}]}>{menuLanguage === 'en' ? card_database[itemSeq].Sample_En : card_database[itemSeq].Sample_Zh}</Text>


        <StatusBar style="auto"/>
      </View>
      </GestureRecognizer>

      <View style={{width: '80%', alignSelf: 'center', height: 1, backgroundColor: '#bbb', marginVertical: 10}} />



      <View style={styles.buttonView}>
        <Pressable onPress={showOnOff}>
          <MaterialIcons name={(showTranslate===1?translateImg:noTranslateImg)} size={28} />
        </Pressable>
        <Text>   </Text>
         <Pressable onPress={kanjiOnOff}>
          <MaterialIcons name={(showKanji===1?kanjiImg:noKanjiImg)} size={28} />
         </Pressable>
         <Text>   </Text>
        <Pressable onPress={pronounOnOff}>
          <MaterialIcons name={(showPronoun===1?showPronounImg:noPronounImg)} size={28} />
        </Pressable>
        <Text>   </Text>
        <Pressable onPress={randomCard}>
          <MaterialIcons name={randomImg} size={28} />
        </Pressable>
        <Text>  　</Text>
        <Pressable onPress={startQuiz}>
          <MaterialIcons name={quizImg} size={28} />
        </Pressable>
        <Text>   </Text>
        <Pressable onPress={prevCard}>
          <MaterialIcons name={prevButtonImg} size={28} color={itemSeq===0?"#ccc":"#333"} />
        </Pressable>
        <Text> {itemSeq + 1} / {card_database.length}  </Text>
        <Pressable onPress={nextCard}>
          <MaterialIcons name={nextButtonImg} size={28} color={itemSeq+1 === card_database.length ?"#ccc":"#333"} />
        </Pressable>

      </View>

      <View style={styles.lowerVew}>
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.aboutButton} onPress={() => setAboutVisible(true)}>
          <Text>{menuLanguage === 'en' ? 'About' : '關於'}</Text>
        </Pressable>
        <Text>   </Text>
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

     <Modal visible={JapLetterVisible} animationType="slide">
          <ShowLetters />
          <Button title="Close" onPress={() => setJapLetterVisible(false)} />
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
              • <MaterialIcons name={prevButtonImg} size={20} /><MaterialIcons name={nextButtonImg} size={20} /> Swipe to navigate cards{'\n\n'}  
              • <MaterialIcons name={showPronounImg} size={20} /> Toggle to Japanese pronunciation{'\n\n'}              
              • <MaterialIcons name={translateImg} size={20} /> View translations{'\n\n'}
              • <MaterialIcons name={kanjiImg} size={20} /> Toggle kanji{'\n\n'}              
              • <MaterialIcons name={randomImg} size={20} /> Shows randomly{'\n\n'}
              • <MaterialIcons name={quizImg} size={20} /> Simple test{'\n\n'}
            </Text>
            <Button title="Close" onPress={() => setAboutVisible(false)} />
          </ScrollView>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

