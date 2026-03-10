import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, Platform, TouchableOpacity } from 'react-native'
import { Title, InputEmail, InputPassword, Card, ProductButton, Input, Button } from "../../../components"
import { font, fontValue, height, width } from '../../../utils/Responsive'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next'
import AntDesign from 'react-native-vector-icons/AntDesign'

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { loginCorporate } from "../State/actions/AuthCorporateAction"

const CorporateLogin = ({ navigation }) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     const [email, setEmail] = useState(false);
     const [emailVaild, setEmailVaild] = useState(false);
     const [password, setPassword] = useState(false);

     const dispatch = useDispatch();
     const { errorLoginCorporate } = useSelector(state=>state.authCorporate)     

     const secondTextInput = useRef();

     const validateEmail = (email) => {
          let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
          if (reg.test(email) === false) {
            Regards("Email is Not Correct");
            setEmailVaild(false)
            setEmail(email)
            return false;
          }
          else {
               setEmailVaild(true)
               setEmail(email)
          }
     }


     _handleLogin = () => {
          dispatch(loginCorporate(email, password))
     }

     return (
          <ImageBackground
               style={styles.tinyLogo}
               source={Platform.OS === "ios" ? require('../../../assets/images/WelcomeIOS.png') : require('../../../assets/images/WelcomeAndroid.png') }
          >
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.containerBack(lang)}>
                    <AntDesign 
                         name={ lang === "english" ? "left" : "right"} 
                         size={fontValue("16")} 
                         color="#fff"
                    />
               </TouchableOpacity>

               <KeyboardAwareScrollView
                    keyboardDismissMode={"on-drag"} 
                    showsVerticalScrollIndicator={false} 
                    enableResetScrollToCoords={false}
                    keyboardOpeningTime={0}
                    extraScrollHeight={  Platform.OS === "ios" ? fontValue("13") : 0 }
                    extraHeight={ fontValue("60") }
                    persistentScrollbar = {true} 
                    keyboardShouldPersistTaps={ Platform.OS === "ios" ? "always" : "handled" }
                    contentContainerStyle={{flexGrow: 1}}
                    enableOnAndroid={false}
                    onScrollAnimationEnd={true}
                    scrollEnabled={true}
                    bounces={false}
               >
                    <View style={{ height : "95%", justifyContent : "flex-end" }}>
                         <View style={styles.modelCard}>
                              <Card pushUp="3" pushDown="2">
                                   <Title text={ lang === "arabic" ? "تسجيل الدخول" : "Login" } size="1.65" fontWeight="400"/>
                              </Card>
                              <Card pushUp="0"  pushDown="2">
                                        <InputEmail
                                             wide="63%"
                                             value={email}
                                             returnKeyType="next"
                                             onSubmitEditing={() => secondTextInput.current.focus()}
                                             handleChange={(value => validateEmail(value))}
                                             // error={phoneOtp.length === 0 || phoneOtp.startsWith("5") && phoneOtp.length <= 9 ? false : true}
                                        />
                              </Card>
                              <Card>
                                   <InputPassword
                                        wide="63%"
                                        value={password}
                                        handleChange={(value => setPassword(value))}
                                        forwardedRef={secondTextInput}
                                        // error={phoneOtp.length === 0 || phoneOtp.startsWith("5") && phoneOtp.length <= 9 ? false : true}
                                   />
                              </Card>
                              {
                                   errorLoginCorporate
                                   ?
                                        <Card pushUp="2" pushDown="0">
                                             <Title text={ lang === "arabic" ? "البريد الألكتروني او كلمة المرور خطاء" : "Login" } size="1.4" fontWeight="400" color="#f00"/>
                                        </Card>
                                   :
                                        null
                              }
                              <Card pushUp="2" pushDown="3">
                                   <ProductButton
                                        title={lang === "arabic" ? "التالي" : "Next" }
                                        handlePress={() => _handleLogin()}
                                        width={width('75%')}
                                        disabled={emailVaild && password.length > 7 ? false : true}
                                   />
                              </Card>
                         </View>
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
     containerBack : (lang) => ({
          flexDirection : lang === "english" ? "row" : "row-reverse",
          width : "96%",
          top : fontValue("45"),
          marginHorizontal : "2%",
          zIndex : 99999
     }),
     modelCard : {
          backgroundColor : "#fff",
          width : "90%",
          // top : Platform.OS === "ios" ? height("65") : height("65"),
          borderRadius : fontValue("10"),
          alignItems : "center",
          alignContent : 'center',
          alignSelf : 'center',
          paddingHorizontal : width("7%"),
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

export default CorporateLogin
