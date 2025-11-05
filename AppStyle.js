import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    top: '10%',
    marginTop: 30,
  },
  mainView: {
    width: '90%',
    height: screenHeight * 0.3,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  barView: {
    marginVertical: '3%',
    marginLeft: '8%',
    marginRight: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  middleVew: {
    marginVertical: '2%',
    marginLeft: '8%',
    marginRight: '8%',
    height: screenHeight * 0.25,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
    width: 64,
    height: 24,
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