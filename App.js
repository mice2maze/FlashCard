import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, ImageBackground,SafeAreaView,Modal, ScrollView, Button, Dimensions } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
//import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import card_database from "./assets/data/card_database.json";
import * as Speech from 'expo-speech';
import {Audio} from 'expo-av';
import bgImg from "./assets/images/background.jpg";

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

  const [itemSeq, setItemSeq] = useState(0);
  const [showTranslate, setShowTranslate] = useState(1);
  const [showPronoun, setShowPronoun] = useState(1);
  // about page
  const [aboutVisible, setAboutVisible] = useState(false);

  // const [swipeDirection, setSwipeDirection] = useState('');
  const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_DOWN, SWIPE_UP} = swipeDirections;
  const [menuVisible, setMenuVisible] = useState(false);

  //Tts.setDefaultLanguage('en-IE');
  // Tts.addEventListener('tts-start', event => console.log('start', event));
  // Tts.addEventListener('tts-finish', event => console.log('finish', event));
  // Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
  
  async function readWord( theWord ) {
    //Tts.stop();
    //Tts.speak(theWord)
    // Speech.speak(theWord, {language:'ja-JP'});
    // try {
    //   await Audio.setAudioModeAsync({
    //     allowsRecordingIOS: true,
    //     playsInSilentModeIOS: true
    //   })
    //     const {sound} = await Audio.Sound.createAsync(require('./assets/beep.mp3'));
    //     await sound.playAsync();
    // } catch (error) {
    //   console.error('Failed to play sound', error);
    // }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true, // Ensures playback in silent mode
      });

    // Play a short silent sound to initialize the audio session
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/1-second-of-silence.mp3') // Add a silent MP3 file to your assets
    );
    await sound.playAsync();
    await sound.unloadAsync();      

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
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true, // Ensures playback in silent mode
        });
      Speech.speak(Sample_in_JP,{language:'ja-JP'} );
    } catch (error) {
      console.error('Error in readSample configuring audio mode:', error);
    }
  }

  function nextCard() {
    if (itemSeq < card_database.length-1) {
      setItemSeq(itemSeq+1);
    } else {
      setItemSeq(1);
    }
    //console.log("items ", itemSeq,card_database.length )
  }

  function prevCard() {
    if (itemSeq >= 1) {
      setItemSeq(itemSeq-1);
    } else {
      setItemSeq(card_database.length-1)
    }
    //console.log("items ", itemSeq,card_database.length )

  }
  function randomCard() {
    setItemSeq( Math.floor(Math.random() * (card_database.length-1)) );
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
        <Text>            </Text>
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
              <Modal visible={aboutVisible} animationType="slide">
          <ScrollView contentContainerStyle={styles.aboutContainer}>

            <Text style={styles.title}>FlashCard - Japanese N5 Vocabulary</Text>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.text}>
              FlashCard is a simple tool for learning Japanese N5 vocabulary I built for preparing N5 test. 
              Swipe through cards, listen to pronunciations, and refresh your knowledge with example sentences.
              Please enjoy it!
            </Text>
            <Text style={styles.sectionTitle}>Features</Text>

            <Text style={styles.text}>
              • <Image style={[{width:20},{height:20}, {opacity:(1)}]} source={require(prevButtonImg) }/>
          <Image style={[{width:20},{height:20},,{opacity:(1)}]} source={require(nextButtonImg)}/> Swipe to navigate cards{'\n\n'}  
              • <Image style={[{width:15},{height:15}, {opacity:(1)}]} source={(showPronoun===1?require(showPronounImg):require(noPronounImg))}/> Toggle to Japanese pronunciation{'\n\n'}
              
              • <Image style={[{width:20},{height:20},{opacity:(1)}]} source={require(translateImg) }/> View translations in Chinese and English{'\n\n'}
              
              • <Image style={[{width:20},{height:20}, {opacity:(1)}]} source={require(randomImg)}/> Shows randomly{'\n\n'}
            </Text>
            <Button title="Close" onPress={() => setAboutVisible(false)} />
          </ScrollView>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    top:'10%',
    //alignItems: 'top',
    marginTop:30,
    //justifyContent: 'center',
  },
  mainView: {
    //marginLeft:"5%",
    //marginRight:"5%",
    width: '90%',
    height: screenHeight * 0.3,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop:15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    //shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.32)', //'snow',
  },
  barView: {
    marginVertical:"3%",
    marginLeft:"8%",
    marginRight:"8%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  middleVew:{
    marginVertical:"2%",
    marginLeft:"8%",
    marginRight:"8%",
//    flexDirection: 'row',
    height: screenHeight * 0.4,

    alignItems: 'center',
    height:"25%",
    justifyContent: 'space-evenly',
  },
  lowerVew:{
    marginVertical:"2%",
    marginLeft:"8%",
    marginRight:"8%",
    flexDirection: 'row',
    alignItems: 'center',
    height:"5%",
    justifyContent: 'space-evenly',
  },
  buttonImg:{
    width: 64,
    height: 24,
  },
  translateImgSize:{
    width: 28,
    height: 28,
  },
  noPronounImgSize:{
    width: 28,
    height: 28,
  },
  speakerImg:{
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
  },
  pronoun: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 20,
  },
  blank: {
    fontSize: 10,
  },
  img: { 
    width:"100%",
    height:"100%",
  }, 
  heading: {
    fontSize: 20,
    justifyContent:'center',
    alignItems: 'center',
  },
  footer: {
    justifyContent:'center',
    alignItems:'center',
  },
  bottomText: {
    fontSize:9,
    fontStyle:'italic',
  },
  aboutContainer: {
  marginTop:"25%",
  alignItems: 'center',
  padding: 24,
  backgroundColor: 'snow',
  flexGrow: 1,
},
version: {
  marginTop:"5%",
  fontSize: 14,
  color: 'gray',
  marginBottom: 16,
},
sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 18,
  marginBottom: 6,
  alignSelf: 'flex-start',
},
text: {
  fontSize: 16,
  marginBottom: 8,
  textAlign: 'left',
  alignSelf: 'flex-start',
},
aboutTitle: {
  fontSize: 16, // smaller
  fontWeight: 'bold',
  fontFamily: 'Cochin', // fancy font
  marginTop: 18,
  marginBottom: 6,
  alignSelf: 'flex-start',
  color: '#333',
},
aboutButton: {
  backgroundColor: '#eee',
  paddingHorizontal: 24,
  paddingVertical: 1,
  borderRadius: 20,
  marginVertical: 0.5,
},
});
