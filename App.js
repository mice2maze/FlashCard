import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, ImageBackground,SafeAreaView } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
//import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import card_database from "./assets/data/card_database.json";
import * as Speech from 'expo-speech';
//import {Audio} from 'expo-av';
import bgImg from "./assets/images/background.jpg";

//import Tts from 'react-native-tts';

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

  // const [swipeDirection, setSwipeDirection] = useState('');
  const {SWIPE_LEFT, SWIPE_RIGHT, SWIPE_DOWN, SWIPE_UP} = swipeDirections;


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
    if (showPronoun === 1) {
      Speech.speak((theWord.Subtitle === "" ? theWord.Title:theWord.Subtitle), {language:'ja-JP'});
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

      <View style={styles.barView}>
        <Pressable onPress={showOnOff}>
          <Image style={[styles.translateImgSize,{opacity:(showTranslate===1?1:0.1)}]} source={require(translateImg) }/>
        </Pressable>
        <Text>    </Text>
        <Pressable onPress={pronounOnOff}>
          <Image style={[styles.noPronounImgSize,{opacity:(showPronoun===1?1:0.1)}]} source={(showPronoun===1?require(showPronounImg):require(noPronounImg))}/>
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
      <View style={styles.middleVew}>
        <Text style={[styles.description,{opacity:showTranslate}]}>{card_database[itemSeq].Category}</Text>
      </View>
      <View style={styles.lowerVew}></View>
      <View style={styles.footer}>
        <Text style={styles.bottomText}> presented by Kosaon @2024</Text>
      </View>
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
    marginLeft:"5%",
    marginRight:"5%",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    marginTop:30,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    //shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'snow',
  },
  barView: {
    marginVertical:"2%",
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
    flexDirection: 'row',
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
    height:"10%",
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
    fontSize: 40,
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
});
