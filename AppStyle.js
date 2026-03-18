import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    top: '10%',
    marginTop: 30,
  },
  mainView: {
    width: '90%',
    height: screenHeight * 0.5,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  barView: {
    marginVertical: '1%',
    marginLeft: '8%',
    marginRight: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    
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
    backgroundColor: '#c9c5d2', // Light grey background
    paddingVertical: 8,         // Space inside top/bottom
    paddingHorizontal: 16,      // Space inside left/right
    borderRadius: 25,           // The "Round" factor (tweak as needed)
    borderWidth: 1,             // Optional: thin border
    borderColor: '#D3D3D3',     // Optional: border color
    //alignSelf: 'flex-start',    // Prevents the box from stretching full-width
    marginVertical: 10,         // Space outside the box
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
    width: 28,
    height: 28,
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
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: 'grey',
  },
  sampleTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  pronoun: {
    fontSize: 20,
    fontStyle: 'italic',
    //color: '#7560f1',
  },
  description: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'grey',
    marginTop: 0,
  },
  sample_text1: {
    fontSize: 20,
    lineHeight: 24,
    color: '#333',
    //marginTop: -15,
    marginBottom:2,
  },
  sample_text2: {
    fontSize: 20,
    lineHeight: 20,
    color: 'grey',
    //marginTop: -60,
    marginBottom:2,
  },
  sample_text3: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'grey',
    //marginTop: -30,
    marginBottom: 2,
  },    
  blank: {
    fontSize: 10,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: 20,
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
});