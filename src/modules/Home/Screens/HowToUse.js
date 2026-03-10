import React, { useEffect } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import { font, fontValue, width } from '../../../utils/Responsive';
import { Card, Title } from '../../../components';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTranslation } from "react-i18next";
import Colors from '../../../constants/Colors';
import IconAntDesign from 'react-native-vector-icons/AntDesign'


const HowToUse = ({ navigation }) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"
     const url = lang === "english" ? 'https://www.regards.sa/info'  : "https://www.regards.sa/ar/info";

     return (
          <View style={styles.container}>  
               <Card pushUp={ Platform.OS === "ios" ? "7" : "1"} flexDirection={ lang === "english" ? 'row' : "row-reverse"} style={styles.containerHead}>
                    <View style={{ width : '100%',  alignItems : lang === "english" ? 'flex-start' : 'flex-end', paddingHorizontal : "4%" }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.containerIconBack(lang)}>
                            <AntDesign color={Colors.standardColor} name={ lang === "english" ? "left" : "right" } size={font('18')}/>
                            <Title style={{ textAlign : "center", paddingHorizontal : "5%" }} size="1.4" fontWeight="500" text={lang === "english" ? "Back to Main Page" : "الرجوع للصفحة الرئيسية"}/>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ justifyContent : "center", alignItems : "center", width : "55%" }}>
                         <Title style={{ textAlign : "center"}} size="1.8" fontWeight="500" text={lang === "english" ? "How To Use" : "كيف يعمل"}/>
                    </View> */}
                    {/* <Card style={styles.containerIcons(lang)} flexDirection={ lang === "english" ? 'row' : "row-reverse"}>
                        <TouchableOpacity onPress={() => setSort(!sort)}>
                            <Icon style={styles.iocn(lang)} name='sort' size={font('20')} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <IconAntDesign style={styles.iocn(lang)} name='filter' size={font('20')}/>
                        </TouchableOpacity>
                    </Card> */}
                </Card>
               <WebView 
                    source={{ uri: 'https://www.regards.sa/info', headers : {
                         "Accept-Language": `ar`,

                    } }} 
                    automaticallyAdjustContentInsets={true}
                    showsVerticalScrollIndicator={false}
                    style={styles.containerWebView}
                    allowsBackForwardNavigationGestures
               />
          </View> 
     )
}

const styles = StyleSheet.create({
     container : {
          backgroundColor : "#fff",
          flex : 1,
     },    
     containerWebView : {
          marginHorizontal : width("5%"),
     },
     containerIconBack : (lang) => ({
          width : '40%',
          justifyContent : 'center',
          alignItems : "center",
          bottom : font('2.5'),
          flexDirection :  lang === "english" ? "row" : "row-reverse"
          // backgroundColor :  '#999'
     }),
     containerIcons : (lang) => ({
          width : '22.5%',
          justifyContent : 'center',
          alignItems : 'center',
          alignSelf : 'center',
          bottom : font('2.5'),
          // backgroundColor :  '#999'
      }),
     iocn: (lang) => ({
         color : "#fff",
         // color: Colors.standardColor,
         paddingRight: lang === "english" ? font('10') : null,
         paddingLeft: lang === "arabic" ? font('10') : null,
         top: font('4')
     }),
})

export default HowToUse