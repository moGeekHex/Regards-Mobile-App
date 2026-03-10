import React,{ useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Keyboard, Animated, Easing } from 'react-native'
import { Card, Title, Input, Head, Button } from '../../../components'
import { useTranslation } from 'react-i18next'
import { fontValue, width } from '../../../utils/Responsive'
import BackgroundTimer from 'react-native-background-timer';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

//action
import { useDispatch, useSelector } from 'react-redux';
import { cleanUpOtpPayWallet, createOtpOrderWallet } from '../State/action/OtpPayWalletAction'
import { createOrderWallet, cleanUpPayWallet } from "../State/action/PayWalletAction"

const CheckOtp = ({ route, navigation }) => {

     const [codeOtp, setCodeOtp] = useState(false);
     const [secondsLeft, setSecondsLeft] = useState(120);
     const [shakeAnimation, setShakeAnimation] = useState(new Animated.Value(0));

     //redux
     const dispatch = useDispatch()
     const { otpPayWallet, errorOtpPayWallet } = useSelector(state=>state.otpPayWallet)
     const { payWallet, errorPayWallet } = useSelector(state=>state.payWallet)

     useEffect(() => {
          dispatch(cleanUpPayWallet())
     },[])

     useEffect(() => {
          if(otpPayWallet)
          {
               startTimer()
               setCodeOtp(false)
               return () => dispatch(cleanUpOtpPayWallet()) // resetData will call controller.abort() that was saved in state
          }
     },[otpPayWallet])

     useEffect(() => {
          if(secondsLeft === 0)
          {
              BackgroundTimer.stopBackgroundTimer();
          }
     },[secondsLeft]);

     useEffect(() => {
          if(payWallet)
          {
               navigation.navigate("Thanks",{ paymentDetails : payWallet })
               return () => dispatch(cleanUpPayWallet()) // resetData will call controller.abort() that was saved in state
          }
     },[payWallet])  

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     const productId = route?.params?.productId;
     const quantity = route?.params?.quantity;
     const giftHolderName = route?.params?.giftHolderName;
     const giftHolderPhone = route?.params?.giftHolderPhone;
     const giftSenderName = route?.params?.giftSenderName;
     const message = route?.params?.message;
     const type = route?.params?.type;
     const contactPhone = route?.params?.contactPhone;

     const _handleCreateOrderWallet = () => {
          walletType = "CORPORATE"
          dispatch(createOrderWallet(productId, quantity, giftHolderName, giftHolderPhone, giftSenderName, message, type, codeOtp, walletType))
     }

     useEffect(() => {
          if(codeOtp?.length === 4 )
          {
               _handleCreateOrderWallet()
          }else if( errorPayWallet && codeOtp ){
               dispatch(cleanUpPayWallet())
          }
     },[codeOtp])

     useEffect(() => {
          setCodeOtp(false)
          setTimeout(() => {
               dispatch(cleanUpPayWallet())               
          },1500)
     },[errorPayWallet])

     useEffect(() => {
          if(errorPayWallet && codeOtp.length === 4)
          {
               startShake()
          }
     },[errorPayWallet])

     startShake = () => {
          Animated.sequence([
               Animated.timing(shakeAnimation, { toValue: 10, duration: 250, useNativeDriver: true }),
               Animated.timing(shakeAnimation, { toValue: -10, duration: 250, useNativeDriver: true }),
               Animated.timing(shakeAnimation, { toValue: 7.5, duration: 150, useNativeDriver: true }),
               Animated.timing(shakeAnimation, { toValue: -7.5, duration: 150, useNativeDriver: true }),               
               Animated.timing(shakeAnimation, { toValue: 5, duration: 75, useNativeDriver: true }),
               Animated.timing(shakeAnimation, { toValue: -5, duration: 75, useNativeDriver: true }),
               Animated.timing(shakeAnimation, { toValue: 0, duration: 40, useNativeDriver: true })
          ]).start();
     }

     startTimer = () => {

          setSecondsLeft(120)
  
          BackgroundTimer.runBackgroundTimer(() => {
              setSecondsLeft((secs) => {
                  if(secs > 0) return secs -1;
                  else return 0
              });
          },1000);
     };

     let minutes = Math.floor((secondsLeft / 60));
     let seconds = Math.floor((secondsLeft % 60));

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

     const _handleSendOtpOrderWallet = () => {
          dispatch(createOtpOrderWallet())
     }

  return (
     <View style={styles.root}>
          <Head 
               title={ lang === "english" ? "Gift Request Approval" : "لتعميد طلب الإهداء" }
               handlePress={() => navigation.goBack()}
          />
          <View style={styles.containerNumber}>
               <Title 
                    text={ lang === "english" 
                         ? 
                              `Enter the approval code sent to the number ending in 0${contactPhone?.slice(0, 1) + contactPhone?.slice(2)?.replace(/.(?=...)/g, '*')}` 
                         : 
                              `ادخل رمز التعميد المرسل على الرقم المنتهي ب ${contactPhone?.slice(1, 0) + contactPhone?.slice(1)?.replace(/.(?=...)/g, '*')}`} size="1.6" fontWeight="400" color="#555"/>
          </View>

          <Animated.View style={{ transform: [{translateX: shakeAnimation}] }}>  
          <Card style={{ justifyContent : "space-evenly", width : "70%" }} pushUp="5.5" pushDown="1" flexDirection={lang === "english" ? "row" : "row-reverse"}>
               <View style={{ backgroundColor : errorPayWallet ? "#f00" : codeOtp?.length >= 1 ? "#4CBB17" : "#ddd", width : fontValue("12"), height : fontValue("12"), borderRadius : fontValue("12"), justifyContent : "center", alignItems : "center" }}>
                    {
                         codeOtp?.length >= 1   
                         ?
                              null
                         :
                              <View style={{ backgroundColor : "#fff", width : fontValue("7"), height : fontValue("7"), borderRadius : fontValue("7") }}>
                              </View>
                    }
               </View>
               <View style={{ backgroundColor : errorPayWallet ? "#f00" : codeOtp?.length >= 2 ? "#4CBB17" : "#ddd", width : fontValue("12"), height : fontValue("12"), borderRadius : fontValue("12"), justifyContent : "center", alignItems : "center" }}>
                    {
                         codeOtp?.length >= 2
                         ?
                              null
                         :
                              <View style={{ backgroundColor : "#fff", width : fontValue("7"), height : fontValue("7"), borderRadius : fontValue("7") }}>
                              </View>
                    }
               </View>
               <View style={{ backgroundColor : errorPayWallet ? "#f00" : codeOtp?.length >= 3 ? "#4CBB17" : "#ddd", width : fontValue("12"), height : fontValue("12"), borderRadius : fontValue("12"), justifyContent : "center", alignItems : "center" }}>
                    {
                         codeOtp?.length >= 3  
                         ?
                              null
                         :
                              <View style={{ backgroundColor : "#fff", width : fontValue("7"), height : fontValue("7"), borderRadius : fontValue("7") }}>
                              </View>
                    }
               </View>
               <View style={{ backgroundColor : errorPayWallet ? "#f00" : codeOtp?.length >= 4 ? "#4CBB17" : "#ddd", width : fontValue("12"), height : fontValue("12"), borderRadius : fontValue("12"), justifyContent : "center", alignItems : "center" }}>
                         {
                         codeOtp?.length >= 4 
                         ?
                              null
                         :
                              <View style={{ backgroundColor : "#fff", width : fontValue("7"), height : fontValue("7"), borderRadius : fontValue("7") }}>
                              </View>
                    }
               </View>
          </Card>
          </Animated.View>
          <Card pushUp="5">
               <SimpleLineIcons name={"lock"} size={fontValue("120")} color={ errorPayWallet ? "#f00" : "#ddd"} />
          </Card>

          {
               secondsLeft !== 0 
               ?
                    <Card pushUp="8" pushDown="1" style={{ justifyContent : "center", alignItems : "center" }}>
                         <Title text={ lang === "arabic" ? ` ${minutes} : ${seconds} ` : ` ${minutes} : ${seconds} ` } size="1.4" color="#000" fontWeight="600"/>
                         <Card pushUp="1" pushDown="1">
                              <Title text={ lang === "arabic" ? ` أعد ارسال رمز التأكيد` : "Resend OTP" } size="1.4" color="#777" fontWeight="600"/>
                         </Card>
                    </Card>
               :
                    <Card pushUp="8.5" pushDown="1.5" style={{ width : "100%", alignItems : "center", justifyContent : "center" }} >
                         <Title text={ lang === "arabic" ? `لم يصلك الرمز ؟` : "Didn't receive the code ?" } size="1.4" color="#777" fontWeight="600"/>
                         <Card pushUp="1" pushDown="1">
                              <Button 
                                   type="text"     
                                   handlePress={() => { _handleSendOtpOrderWallet() }}
                                   titleSize="1.4"
                                   titleWeight={ lang === "english" ? "500" : "500" }
                                   title={ lang === "english" ? "Resend Code" : `أعادة ارسال رمز التأكيد` } 
                              />
                         </Card>
                    </Card>
          }
          <View style={{width:0,height:0}}>
               <TextInput
                    style={styles.hiddenInput}
                    autoFocus={true}
                    onChangeText={value  => { 
                         const number = _handleNumberPhone(value)
                         if (number.length <= 4) {
                              setCodeOtp(number)
                         }
                    }}
                    keyboardType="numeric"
                    value={codeOtp}
                    textContentType="oneTimeCode"
               />
          </View>
     </View>
  )
}

export default CheckOtp

const styles = StyleSheet.create({
     root : {
          flex : 1,
          alignItems : "center",
          backgroundColor : "#fff"
     },
     hiddenInput: {
          width: 0,
          height: 0,
     },
     box: {
          backgroundColor: "tomato",
          width:150,
          height:150,
      },
     containerNumber : {
          backgroundColor : "#f5f5f5",
          width : "100%",
          justifyContent : "center",
          alignItems : "center",
          paddingVertical : fontValue("20"),
          borderTopWidth : 1,
          borderColor : "#ddd",
     },
     modelCard : {
          // backgroundColor : "#fff",
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
     }
})