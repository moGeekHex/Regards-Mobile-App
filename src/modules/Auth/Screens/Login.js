import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, Platform, StatusBar, KeyboardAvoidingView, Dimensions } from 'react-native'
import { Title, InputPhone, Card, ProductButton, Input, Button } from "../../../components"
import { font, fontValue, height, width } from '../../../utils/Responsive'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackgroundTimer from 'react-native-background-timer';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../../../constants/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import analytics from '@react-native-firebase/analytics';
import { appEvents } from "../../../events/appEvents"
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, reSendOtp, checkOtp } from '../../../store/State/actions/AuthAction';


const Login = ({ navigation }) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     const [showOtp, setShowOtp] = useState(false);
     const [codeOtp, setCodeOtp] = useState(false);
     const [signUp, setSignUp] = useState(true);

     const [secondsLeft, setSecondsLeft] = useState(120);
     const [phoneOtp, setPhoneOtp] = useState("");

     const dispatch = useDispatch();
     const { status, otp, phone, error} = useSelector(state=>state.auth)

     const _handleNumberPhone = (number) => {  
          const filterDecode = (str) => {
              return str = str.replace(/[\u202d-\uF8FF\u202c]/g, '');
          }

          var
          persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
          arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
          fixNumbers = function(str)
          {
               if(typeof str === 'string'){
                    for(var i=0; i<10; i++)
                    {
                         str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
                    }
               }
               return str;
          };

          const decodeNumber = filterDecode(number);
          const replaceNumber = Platform.OS === "ios" ? fixNumbers(decodeNumber).replaceAll(' ', '') : fixNumbers(decodeNumber)
          if(replaceNumber.startsWith("+966"))
          {    
               return replaceNumber.toString().substring(4);
          }else if(replaceNumber.startsWith("05")) {
               return replaceNumber.toString().substring(1);
          }else if(replaceNumber.startsWith("00966")){
               return replaceNumber.toString().substring(5);
          }

          return replaceNumber.replace(/[^0-9]/g, '');
     }

     useEffect(() => {
          if(secondsLeft === 0)
          {
              BackgroundTimer.stopBackgroundTimer();
          }
      },[secondsLeft]);

     useEffect(() => {
          setShowOtp(true)
     },[status])

     useEffect(() => {
          setShowOtp(false)
     },[])

     useEffect(() => {
          if(otp)
          {
               // var adjustEvent = new AdjustEvent("eew8tu");
               // Adjust.trackEvent(adjustEvent);
               navigation.navigate("App")
               setPhoneOtp("")
               setCodeOtp("")
          }
     },[otp])

     const startTimer = () => {

          setSecondsLeft(120)
  
          BackgroundTimer.runBackgroundTimer(() => {
              setSecondsLeft((secs) => {
                  if(secs > 0) return secs -1;
                  else return 0
              });
          },1000);
     };

     const handleSendOtp = () => {
          startTimer()
          dispatch(sendOtp(phoneOtp));
     }

     const handleCheckOtp = () => {
          dispatch(checkOtp(phoneOtp, codeOtp))
          try{
               appEvents({
                    eventName : "login",
                    payload : {
                         method: "SMS"
                    }
               })
          } catch (error) {

          }
     }  

     let minutes = Math.floor((secondsLeft / 60));
     let seconds = Math.floor((secondsLeft % 60));

     return (
               <ImageBackground
                    style={styles.tinyLogo}
                    source={Platform.OS === "ios" ? require('../../../assets/images/WelcomeIOS.png') : require('../../../assets/images/WelcomeAndroid.png') }
               >
                    <Card pushDown="2" style={styles.containerCorporateLogin(lang)}>
                         <Button 
                              type="text"     
                              titleColor="#fafafa"
                              titleSize="1.4"
                              handlePress={() => { navigation.navigate("CorporateLogin")}}
                              titleWeight={ lang === "english" ? "500" : "700" }
                              title={ lang === "english" ? "CORPORATE LOGIN" : `تسجيل دخول الشركات` } 
                         />
                    </Card>
                    <KeyboardAwareScrollView
                         keyboardDismissMode={"on-drag"} 
                         showsVerticalScrollIndicator={false} 
                         enableResetScrollToCoords={false}
                         keyboardOpeningTime={0}
                         extraScrollHeight={  Platform.OS === "ios" ? fontValue("110") : 0 }
                         extraHeight={ 0 }
                         keyboardShouldPersistTaps={ Platform.OS === "ios" ? "always" : "handled" }
                         contentContainerStyle={{flexGrow: 1}}
                         enableOnAndroid={false}
                         onScrollAnimationEnd={true}
                         scrollEnabled={true}
                         bounces={false}
                    >
                         <View style={{ height : "95%", justifyContent : "flex-end" }}>
                              {
                                   !showOtp
                                   ?
                                        <View style={styles.modelCard}>
                                             <Card style={styles.containerLoginSkip(lang)} pushUp="2" pushDown="2">
                                                  <TouchableOpacity onPress={() => navigation.navigate("App")} style={styles.onPressSkipe}>
                                                       <Title color={Colors.standardColor} text={ lang === "arabic" ? "تخطي" : "Skip" } size="1.65" fontWeight="400"/>
                                                  </TouchableOpacity>
                                                  <Title text={ lang === "arabic" ? "ادخل رقم الجوال" : "Enter Mobile Number" } size="1.65" fontWeight="400"/>
                                                  <Title text={ " " } style={styles.onPressSkipe}/>
                                             </Card>

                                             <Card pushUp="2">
                                                  <InputPhone
                                                       wide="63%"
                                                       value={phoneOtp}
                                                       handleChange={value  => { 
                                                            const number = _handleNumberPhone(value)
                                                            if (number.length <= 9) {
                                                                 setPhoneOtp(number)
                                                            }
                                                       }}
                                                       error={phoneOtp.length === 0 || phoneOtp.startsWith("5") && phoneOtp.length <= 9 ? false : true}
                                                  />
                                             </Card>
                                             {
                                                  phoneOtp.length === 0 || phoneOtp.startsWith("5") && phoneOtp.length <= 9 
                                                  ?
                                                      null
                                                  :
                                                       <Card pushUp="2">
                                                            <Title 
                                                                 text={lang === "english" ? "Invalid Phone Number" : "رقم الهاتف غير صحيح!"} 
                                                                 size={1.3}
                                                                 color="#ff0033"
                                                            />
                                                       </Card>
                                             }
                                             <Card pushUp={ phoneOtp.length === 0 || phoneOtp.startsWith("5") && phoneOtp.length <= 9 ? "5" : "2" } pushDown="3">
                                                  <ProductButton
                                                       title={lang === "arabic" ? "التالي" : "Next" }
                                                       handlePress={() => { handleSendOtp() }}
                                                       width={width('75%')}
                                                       disabled={phoneOtp.startsWith("5") && phoneOtp.length === 9 ? false : true}
                                                  />
                                             </Card>
                                        </View>
                                   :
                                        <View style={styles.modelCard}>
                                             <Card flexDirection={ lang === "english" ? "row" : "row-reverse"} pushUp="2">
                                                  <Title text={ lang === "english" ? "Verification Code Sent To" : "تم ارسال رمز التحقق إلى"} size="1.7" fontWeight="400"/>
                                                  <Title text={`+966${phoneOtp ? phoneOtp : phone ? phone : ''}`} size="1.7" fontWeight="600" style={{ paddingHorizontal : '1%' }}/>
                                             </Card>
                                             <Card pushUp="1.9" style={{ width : "100%", alignItems : "center" }}>
                                                  <Input 
                                                       placeholder={ lang === "english" ? "OTP CODE" : "رمز التفعيل" }
                                                       keyboardType="numeric"
                                                       autoFocus={true}
                                                       value={codeOtp}
                                                       handleChange={value  => { 
                                                            const number = _handleNumberPhone(value)
                                                            if (number.length <= 4) {
                                                                 setCodeOtp(number)
                                                            }
                                                       }}
                                                       textContentType="oneTimeCode"
                                                  />
                                             </Card>

                                             {
                                                  error
                                                  ?
                                                       <Card pushUp="1.9">
                                                            <Title 
                                                                 text={lang === "english" ? "Invalid Verification Code" : "كود التحقق غير صحيح"} 
                                                                 size={1.3}
                                                                 color="#ff0033"
                                                            />
                                                       </Card>
                                                  :
                                                       null
                                             }
                                             {
                                                  secondsLeft !== 0 
                                                  ?
                                                       <Card pushUp="2" pushDown="1" flexDirection={ lang === "english" ? "row" : "row-reverse"}>
                                                            <Title text={ lang === "arabic" ? ` ${secondsLeft} ` : ` ${secondsLeft} ` } size="1.4" color="#000" fontWeight="600"/>
                                                       </Card>
                                                  :
                                                      <Card pushUp="1.5" pushDown="1.5" style={{ width : "100%", alignItems : "center" }}>
                                                            <Button 
                                                                 type="text"     
                                                                 handlePress={() => { handleSendOtp() }}
                                                                 titleWeight={ lang === "english" ? "500" : "700" }
                                                                 title={ lang === "english" ? "Resend Code" : `أعد ارسال رمز التأكيد` } 
                                                            />
                                                      </Card>
                                             }
                                             <Card pushUp="1" pushDown="3">
                                                  <ProductButton
                                                       title={lang === "arabic" ? "التالي" : "Next" }
                                                       handlePress={ async () => { handleCheckOtp() }}
                                                       width={width('75%')}
                                                       disabled={codeOtp.length === 4 ? false : true}
                                                  />
                                             </Card>
                                        </View>
                              }
                         </View>
                    </KeyboardAwareScrollView>
               </ImageBackground>
     )
}

const styles = StyleSheet.create({
     tinyLogo :{
          flex : 1,
          width : width("100%"),
          height : height("100%"),
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
     },
     containerCorporateLogin : (lang) => ({
          top : fontValue("45"),
          right : 0,
          marginHorizontal : "2%",
          position : "absolute",
          zIndex : 999   
     }),
     modelCard : {
          backgroundColor : "#fff",
          width : "90%",
          // top : Platform.OS === "ios" ? height("65") : height("65"),
          borderRadius : fontValue("10"),
          alignItems : "center",
          alignContent : 'center',
          alignSelf : 'center',
          paddingHorizontal : width("5"),
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,
          elevation: 12,
          zIndex : 999
     },
     containerLoginSkip : (lang) => ({
          width : width("90"),
          flexDirection : lang === "english" ? "row" : "row-reverse",
          justifyContent : "space-between",
          alignItems : "center"
     }),
     onPressSkipe : {
          justifyContent : "center",
          alignItems : "center",
          width : width("15"),
          height : font("25"),
          left : 0,
          position : "relative"
     }
})

export default Login