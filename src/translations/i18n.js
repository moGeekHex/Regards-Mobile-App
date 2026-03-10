import { NativeModules } from 'react-native'
import i18next from "i18next";
import english from "./english.json";
import arabic from "./arabic.json";
import { initReactI18next } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from "react-native-localize";

const LANGUAGES = {
     english,
     arabic
};

const LANGUAGE_DETECTOR = {
     type: 'languageDetector',
     async: true,
     detect: callback => {
          AsyncStorage.getItem('user-language', (err, language) => {
               // if error fetching stored data or no language was stored
               // display errors when in DEV mode as console statements
               if (err || !language) {
                    if (err) {
                    // console.log('Error fetching Languages from asyncstorage ', err);
                    } else {
                    // console.log('No language is set, choosing English as fallback');
                    }
                    // const findBestAvailableLanguage = RNLocalize.findBestAvailableLanguage(LANG_CODES);
                    const deviceLanguage = Platform.OS === 'ios'
                         ? NativeModules.SettingsManager.settings?.AppleLocale ||
                         NativeModules.SettingsManager.settings?.AppleLanguages[0] //iOS 13
                         : NativeModules.I18nManager.localeIdentifier;
              
                    console.info(deviceLanguage," deviceLanguage deviceLanguage deviceLanguage deviceLanguage"); //en_US   
                                  
                    callback( deviceLanguage === "en_US" ? "english" : "arabic" );
                    
                    return;
               }
         callback(language);
       });
     },
     init: () => {},
     cacheUserLanguage: language => {
       AsyncStorage.setItem('user-language', language);
     }
};

i18next
     .use(LANGUAGE_DETECTOR)
     .use(initReactI18next)
     .init({
          compatibilityJSON: 'v3',
          resources: LANGUAGES,
          react: {
               useSuspense: false
          },
          interpolation: {
               escapeValue: false
          }
     })

export default i18next