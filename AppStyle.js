import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    top: '10%',
    marginTop: 30,
  },
  mainView: {
    width: '100%',
    height: screenHeight * 0.5,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 5,
    backgroundColor: 'rgba(217, 212, 212, 0.18)',
  },
  barView: {
    marginVertical: '1%',
    marginLeft: '8%',
    marginRight: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    
  },
  japaneseContainer: {
    marginVertical: '1%',
    width: '98%',
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //borderRadius: 20,
    //paddingVertical: 16,
    paddingHorizontal: 16,
    //backgroundColor: 'rgba(84, 156, 238, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonView: {
    marginVertical: '3%',
    marginLeft: '3%',
    marginRight: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 999,             // rounded-full
    paddingVertical: 8,            // p-2
    paddingHorizontal: 16,         // px-4    
    backgroundColor: 'rgba(88, 82, 82, 0.2)', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',    
  },  
  pronounBox: {
    flexDirection: 'row',       // Aligns Image and Text horizontally
    alignItems: 'center',       // Centers items vertically within the box
    backgroundColor: '#4F46E5', // Light grey background
    paddingVertical: 8,         // Space inside top/bottom
    paddingHorizontal: 16,      // Space inside left/right
    borderRadius: 25,           // The "Round" factor (tweak as needed)
    borderWidth: 1,             // Optional: thin border
    borderColor: '#D3D3D3',     // Optional: border color
    //alignSelf: 'flex-start',    // Prevents the box from stretching full-width
    //marginVertical: 10,         // Space outside the box
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered        
  },
  pronoun: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#ffffff',
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered
  },  
  middleView: {
    marginVertical: '2%',
    marginLeft: '8%',
    marginRight: '8%',
    height: screenHeight * 0.25,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 1,
  },
  lowerVew: {
    marginVertical: '2%',
    marginLeft: '8%',
    marginRight: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    height: '5%',
    justifyContent: 'space-evenly',
  },
  buttonImg: {
    width: 28,
    height: 28,
  },
  translateImgSize: {
    width: 20,
    height: 20,
  },
  noPronounImgSize: {
    width: 28,
    height: 28,
  },
  speakerImg: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 30,
    //alignItems: 'center',
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered    
  },
  subtitle: {
    fontSize: 20,
    color: 'grey',
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered
  },
  showWordType: {
    fontSize: 20,
    color: 'grey',
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered
  },  
  sampleTitle: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered  
  },

  description: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'grey',
    marginTop: 0,
    textAlign: 'center',
    alignSelf: 'center',  
  },
  sample_text1: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    //marginTop: -15,
    marginBottom:2,
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered
  },
  sample_text2: {
    fontSize: 20,
    lineHeight: 20,
    color: 'grey',
    //marginTop: -60,
    marginBottom:2,
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered
  },
  sample_text3: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'grey',
    //marginTop: -30,
    marginBottom: 2,
    width: '100%',              // Spans full parent container width
    textAlign: 'center',        // Centers each line of text
    alignSelf: 'center',        // Ensures text block itself is centered
  },    
  blank: {
    fontSize: 10,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  cardSeq: {
    marginTop: '3%',
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  heading: {
    fontSize: 20,
    color: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  aboutContainer: {
    marginTop: '25%',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'snow',
    flexGrow: 1,
  },
  version: {
    marginTop: '5%',
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
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'Cochin', android: 'serif' }),
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
  submitAnswerButton: {
     width: '100%',
     padding: 10,
     borderRadius: 8,
     marginVertical: 6,
     alignItems: 'center',
     borderWidth: 1,
     borderColor: '#eee'
  },
});