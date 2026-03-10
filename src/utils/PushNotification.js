import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

export async function requestUserPermission() {
     const authStatus = await messaging().requestPermission();
     const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

     if (enabled) {
          GetFCMToke()
     }
}

async function GetFCMToke(){
     let fcmtoken = await AsyncStorage.getItem('fcmtoken')
     if(!fcmtoken){
          try {
               // await messaging().registerDeviceForRemoteMessages();
               await messaging().requestPermission();    // IMPORTANT!
               await messaging().registerDeviceForRemoteMessages();    // IMPORTANT!
               const fcmtoken = await messaging().getToken();
               console.log(fcmtoken, "new token");

               if(fcmtoken){                    
                    await AsyncStorage.setItem("fcmtoken", fcmtoken)
               }
          } catch(error) {
          }
     }
}

export const NotificationListner = () => {
     messaging().onNotificationOpenedApp(remoteMessage => { 
          console.log('Notification caused app to open from background state: ',remoteMessage.notification);
     });

     messaging()
     .getInitialNotification()
     .then(remoteMessage => {
          if (remoteMessage) {
               console.log('Notification caused app to open from quit state:', remoteMessage.notification);
          }
     });

     messaging().onMessage(async remoteMessage => {
          console.log("notification on froground state......", remoteMessage);
     })   
    
}

export const subscribeTopic = async (topic) => {
     messaging()
     .subscribeToTopic(topic)
     .then(() => console.log("Subscribed to topic:", topic))
     .catch((e) => {
          console.log(e);
     });
};