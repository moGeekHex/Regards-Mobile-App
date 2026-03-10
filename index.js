import { AppRegistry, I18nManager } from 'react-native';
import i18n from './src/translations/i18n';
import App from './App';
import {name as appName} from './app.json';
import messaging from "@react-native-firebase/messaging"
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import PushNotification from "react-native-push-notification";

try {
     I18nManager.allowRTL(false);
     I18nManager.forceRTL(false);
     I18nManager.swapLeftAndRightInRTL(true);
   } catch (e) {
     console.log(e);
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);