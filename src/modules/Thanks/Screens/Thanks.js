import React, { useEffect } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ImageBackground, Share, Platform } from 'react-native'
import { Title, Card, ButtonApp } from '../../../components'
import AntDesign from '@react-native-vector-icons/ant-design'
import { font, height } from '../../../utils/Responsive'
import { useTranslation } from "react-i18next";
import Clipboard from '@react-native-clipboard/clipboard';
//action
import { useDispatch, useSelector } from 'react-redux';
import { cleanUpPayment } from "../../Payment/State/action/PayAction"
import Colors from '../../../constants/Colors'
import { appEvents } from '../../../events/appEvents';
const Thanks = ({ route, navigation }) => {

     const dispatch = useDispatch();

     const paymentDetails = route.params?.paymentDetails;

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     // const clearReduxPayment = () => {
     //      dispatch(cleanUpPayment());
     // }



     useEffect(() => {   

          console.log("print data ", paymentDetails)

          dispatch(cleanUpPayment());
     },[])

     const copyToClipboard = () => {
          Clipboard.setString(paymentDetails?.[0]?.[0] ? paymentDetails?.[0]?.[0]?.link : paymentDetails[0]?.link);
     };

     const url = paymentDetails?.[0]?.[0] ? paymentDetails?.[0]?.[0]?.link : paymentDetails[0]?.link ;
     const title = lang === "english" ? "get your gift": "احصل  علي هديتك";
     const message = lang === "english" 
     ? 
         `To complete your invitation contact : ${url}`
     : 
         `لإستكمال بيانات الدعوة الخاصة بك : ${url}`;

     const options = {
          url,
          title,
          message
     };

     const share = async (customOptions = options) => {
          try {
            await Share.share(customOptions);
            try { appEvents({ eventName: "share", payload: { method: "native", content_type: "link" } }); } catch(e){}
          } catch (err) {
            console.log(err);
          }
     };

     return (
          <View style={styles.root}>
               <View style={styles.containerClose}>
                    <TouchableOpacity onPress={() => navigation.navigate('App')}>
                         <AntDesign size={font(20)} name="close" color="#3D3644"/>
                    </TouchableOpacity>
               </View>   
               <ImageBackground style={styles.containerBackground} source={require('../../../assets/images/PatternSuccess.png')}>
                    <View style={styles.containerImage}>
                         <Image style={styles.image} source={require('../../../assets/images/SuccessIcon.png')}/>
                    </View>
               </ImageBackground>
               <Card pushUp="7" style={styles.center}>
               {
                    paymentDetails[0]?.type === "Link" && paymentDetails[0]?.link || paymentDetails[0][0]?.type === "Link" && paymentDetails[0][0]?.link 
                    ?
                         <Title 
                              color="#352E3C" 
                              text={ lang === "english" ? "Successfully Paid" : "تمت عملية الشراء بنجاح" } 
                              fontWeight="600"
                              size="2.5"
                         />
                    :
                         <Title 
                              color="#352E3C" 
                              text={ lang === "english" ? "Successfully Sent" : "تمت عملية الشراء بنجاح" } 
                              fontWeight="600"
                              size="2.5"
                         />
               }
               </Card>
               {
                    paymentDetails[0]?.type === "Link" && paymentDetails[0]?.link || paymentDetails[0][0]?.type === "Link" && paymentDetails[0][0]?.link 
                    ?
                         <>
                              <Card pushUp="3" style={[styles.center, styles.padding]}>
                                   <Title 
                                        style={styles.center} 
                                        size={1.75} 
                                        color="#352E3C" 
                                        text={ lang === "english" 
                                             ? 
                                                  "The link to enter the mobile number has been created! Copy the link to share it with the gift recipient so he/she can enter mobile number to receive the gift card and the appointment request link via WhatsApp."
                                             : 
                                                  "تم إنشاء الرابط الخاص بإدخال رقم الجوال! انسخ الرابط لمشاركته مع مستلم الهدية ليقوم بإدخال رقم الجوال الخاص به لإرسال بطاقة الإهداء و رابط طلب حجز الموعد عن طريق WhatsApp"
                                        } 
                                        fontWeight="400"
                                   />
                              </Card>
                         </>
                    :
                         <>
                              <Card pushUp="4" style={[styles.center, styles.padding]}>
                                   <Title 
                                        style={styles.center} 
                                        size={1.75} 
                                        color="#352E3C" 
                                        text={ lang === "english" 
                                             ? 
                                                  "Thank you for using Regards. We have sent the gift card and the appointment request link to the gift recipient via WhatsApp."
                                             :
                                                  "شكراً لاستخدامك ريجاردز، لقد قمنا بإرسال بطاقة الإهداء و رابط طلب حجز الموعد لمستلم الهدية عن طريق WhatsApp"
                                        } 
                                        fontWeight="400"
                                   />
                              </Card>
                         </>
               }
               {
                    paymentDetails[0]?.type === "Link" && paymentDetails[0]?.link || paymentDetails[0][0]?.type === "Link" && paymentDetails[0][0]?.link 
               
                    ?  
                         <> 
                              <Card pushUp="5" style={styles.padding}>
                                   <ButtonApp 
                                        lite
                                        title={ lang === "english" ? "COPY LINK" : "نسخ الرابط" }
                                        onPress={copyToClipboard}
                                        iconName="copy"
                                        iconSize="2"
                                        iconColor={Colors.standardColor}
                                   />
                              </Card>
                              <Card pushUp="1.5" pushDown="5" style={styles.padding}>
                                   <ButtonApp 
                                        title={ lang === "english" ? "SHARE LINK" : "مشاركة الرابط" }
                                        onPress={async () => {
                                             await share();
                                        }}
                                        iconName="share"
                                        iconSize="2"
                                        iconColor="#fff"
                                   />
                              </Card>
                              <Card pushUp="0" style={[styles.center, styles.padding]}>
                                   <Title style={styles.center} fontWeight="400" size={1.75} color="#352E3C" text={ 
                                        lang === "english" 
                                        ? 
                                             "You can find the gift link from your profile." 
                                        : 
                                             "يمكنك العثور على رابط الهدية من ملفك الشخصي" }
                                   />
                              </Card>
                         </>
                    :
                         <Card pushUp="18" style={styles.padding}>
                              <ButtonApp 
                                   title={ lang === "english" ? "BACK TO HOME" : "الصفحة الرئيسية" }
                                   onPress={() => navigation.navigate('App')}
                                   iconName="home"
                                   iconSize="2"
                                   iconColor="#fff"
                              />
                         </Card>              
               }
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : '#fff'
     },
     containerClose : {
          paddingHorizontal : '5%',
          alignItems : 'flex-end',
          width : '100%',
          ...Platform.select({
               android : {
                    top : '3%'
               },
               ios : ({
                    top : '6%'
               })
          }),
     },
     containerBackground : {
          marginTop : '20%',
          width : '100%',
          height : height('37'),
          justifyContent : 'center',
          alignItems : 'center',
          resizeMode : 'stretch'
     },
     containerImage : {
          width : font('180'),
          height : font('180'),
          justifyContent : 'center',
          alignItems : 'center'
     },
     image : {
          width : '100%',
          height : '100%',
          top : height('5')
     },
     center : {
          justifyContent : 'center',
          alignItems : 'center',
          textAlign : 'center'
     },
     padding : {
          marginHorizontal : '5%'
     }
})

export default Thanks