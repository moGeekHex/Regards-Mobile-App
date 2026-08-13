import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import type {PropsWithChildren} from 'react';
import Navigation from './src/routes/Navigation';
import { requestUserPermission, NotificationListner, subscribeTopic } from "./src/utils/PushNotification"  
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import Toast from 'react-native-toast-message'
import messaging from '@react-native-firebase/messaging';
//Redux
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { legacy_createStore as createStore , applyMiddleware } from 'redux';
import store from './src/store';

import { Adjust, AdjustConfig } from "react-native-adjust";
//Snapchat CAPI
import { snapchatInstallEvent, snapchatOpenAppEvent } from "./src/events/snapchatEvents";
//Check Update
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): JSX.Element {

  useEffect(() => {
    requestUserPermission();
    NotificationListner();
    subscribeTopic("all")

    // Snapchat CAPI. APP_INSTALL de-duplicates itself against AsyncStorage, so
    // it reports once per device install and APP_OPEN reports every launch.
    snapchatInstallEvent();
    snapchatOpenAppEvent();
  },[])

  // A cold start is not the only session. Report APP_OPEN when the app returns
  // to the foreground too, throttled so a quick task-switch is not a session.
  const lastOpenReport = useRef(Date.now());
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState !== 'active') return;
      if (Date.now() - lastOpenReport.current < 30 * 60 * 1000) return;
      lastOpenReport.current = Date.now();
      snapchatOpenAppEvent();
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage)
      Toast.show({
        type: 'info',
        text1: remoteMessage?.notification?.title,
        text2: remoteMessage?.notification?.body
      });
      // Alert.alert(JSON.stringify(remoteMessage.notification.title), JSON.stringify(remoteMessage.notification.body));
    });

    return unsubscribe;
  }, []);

  //Reqired Update App Version
  // const inAppUpdates = new SpInAppUpdates(
  //   true // isDebug
  // );

  // // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
  // inAppUpdates.checkNeedsUpdate({ curVersion: '1.13.23' }).then((result) => {
  //   if (result.shouldUpdate) {
      
  //     const updateOptions: StartUpdateOptions = Platform.select({
  //       ios: {
  //         title: 'Update available',
  //         message: "There is a new version of the app available on the App Store, do you want to update it?",
  //         buttonUpgradeText: 'Update',
  //         country: 'sa', // 👈🏻 the country code for the specific version to lookup for (optional)
  //         forceUpgrade: true,
  //         bundleId : 'com.regards',
  //       },
  //       android: {
  //         updateType: IAUUpdateKind.IMMEDIATE,
  //       },
  //     });


  //     if (Platform.OS === 'android') {
  //       // android only, on iOS the user will be promped to go to your app store page
  //       updateOptions = {
  //         updateType: IAUUpdateKind.FLEXIBLE,
  //       };
  //     }
  //     inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
  //   }
  // })

  Adjust.getSdkVersion(function(sdkVersion) {
    console.log("Adjust SDK versions: " + sdkVersion);
  });

  const adjustConfig = new AdjustConfig("cpwpp5dwedxc", AdjustConfig.EnvironmentProduction);
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);   // enable all logging
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelDebug);     // enable more logging
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelInfo);      // the default
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelWarn);      // disable info logging
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelError);     // disable warnings as well
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelAssert);    // disable errors as well
  // adjustConfig.setLogLevel(AdjustConfig.LogLevelSuppress);  // disable all logging

  adjustConfig.disableDeferredDeeplinkOpening();

  adjustConfig.setDeferredDeeplinkCallback(function (deeplink) {

    console.log("Deferred deep link URL content: " + deeplink.deeplink);

  });
  Adjust.initSdk(adjustConfig);

  return (
    <SafeAreaProvider>
      <Provider store={createStore(store, {}, composeWithDevTools(applyMiddleware(thunk)) )}>
        <Navigation/>
      </Provider>
      <Toast/>
    </SafeAreaProvider>
  );
};

export default App;