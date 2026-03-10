import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Head, Card, Title } from '../../../components';
import { font, width, height } from '../../../utils/Responsive';
import Ionicons from '@react-native-vector-icons/ionicons'
import Colors from '../../../constants/Colors';
import { useTranslation } from "react-i18next";

const Privacy = ({navigation}) => {

     const [langApp, setLang] = useState("en");
     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     return (
          <View style={styles.root}>
               <Head 
                    handlePress={() => navigation.goBack()}
                    handlePressEnd={() => navigation.navigate('EditProfile') }
                    title={ i18n.language === "english" ? "Language" : "اللغة" }
               />
               <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity disabled={i18n.language === "arabic" ? true : false } style={{ width : '100%', justifyContent : 'center',  alignItems : 'center' }} onPress={() => { navigation.navigate("Home"), i18n.changeLanguage("arabic") }}>
                         <Card style={styles.centerArabic(lang)} flexDirection={ i18n.language === "english" ? "row" : "row" }>
                              {
                                   i18n.language === "arabic"
                                   ?
                                        <View style={styles.containerIcon}>
                                             <Ionicons name="checkmark" size={font('22')} color={Colors.standardColor}/>
                                        </View>
                                   :
                                        <View style={styles.containerIcon}/>
                              }
                              <TouchableOpacity disabled={i18n.language === "arabic" ? true : false } onPress={() => { i18n.changeLanguage("arabic"), navigation.navigate("Home") }}>
                                   <Title style={styles.title} text={ i18n.language === "english" ? "العربية" : "العربية" } size="1.8"/>
                              </TouchableOpacity>
                         </Card>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={i18n.language === "english" ? true : false }  style={{ width : '100%', justifyContent : 'center', alignItems : 'center', paddingTop : font('5') }} onPress={() => {  navigation.navigate("Home") , i18n.changeLanguage("english") }}>
                         <Card style={styles.centerEnglish(lang)} flexDirection={ i18n.language === "english" ? "row" : "row" }>
                              {
                                   i18n.language === "english"
                                   ?
                                        <View style={styles.containerIcon}>
                                             <Ionicons name="checkmark" size={font('22')} color={Colors.standardColor}/>
                                        </View>                              
                                   :
                                        <View style={styles.containerIcon}/>
                              }                       
                              <TouchableOpacity onPress={() => { i18n.changeLanguage("english"),navigation.navigate("Home") }} disabled={i18n.language === "english" ? true : false }>
                                   <Title style={styles.title} text="English" size="1.8"/>
                              </TouchableOpacity>
                         </Card>
                    </TouchableOpacity>
               </ScrollView>
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : '#fff',
     },
     screen : {
          paddingHorizontal : '4%',
          paddingTop : '5%'
     },
     containerIcon : {
          width : font('20'),
     },
     centerArabic : (lang) => ({
          backgroundColor : lang === "arabic" ? "#F6F6F6" : null,
          width : font('120'),
          alignItems : 'center',
          justifyContent : 'center',
          height : font('40'),
          paddingHorizontal : '2%',
          borderRadius : 20
     }),
     centerEnglish : (lang) => ({
          backgroundColor : lang === "english" ? "#F6F6F6" : null,
          width : font('120'),
          alignItems : 'center',
          justifyContent : 'center',
          height : font('40'),
          paddingHorizontal : '2%',
          borderRadius : 20
     }),
     title : {
          paddingHorizontal : '4%'
     }
})

export default Privacy