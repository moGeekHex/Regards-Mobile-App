import { isIphoneX } from "react-native-iphone-x-helper";

import { Platform, StatusBar, Dimensions , PixelRatio} from "react-native";

let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const standardLength = SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT;

const offset = SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

const deviceHeight = isIphoneX() || Platform.OS === "android" ? standardLength : standardLength;

//Width
const width = widthPercent => {

  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);

  return PixelRatio.roundToNearestPixel(SCREEN_WIDTH * elemWidth / 100);
};

//Height
const height = heightPercent => {

  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);

  return PixelRatio.roundToNearestPixel(SCREEN_HEIGHT * elemHeight / 100);
};

//Font
const scale = SCREEN_WIDTH / 320;

const font = fontSizeScreen => {
  
  var elemFont = typeof fontSizeScreen === "number" ? fontSizeScreen : parseFloat(fontSizeScreen);
  
  const newSize = elemFont * scale 
  
  if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else if(Platform.OS === 'android') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) 
  }
};


function fontPercent(percent) {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}

// guideline height for standard 5" device screen is 680
function fontValue(fontSize, standardScreenHeight = 680) {
  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
}

export { width , height , font , fontPercent , fontValue };