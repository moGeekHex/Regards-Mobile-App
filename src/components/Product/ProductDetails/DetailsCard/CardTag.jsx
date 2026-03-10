import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTranslation } from "react-i18next";
import { font, fontValue } from '../../../../utils/Responsive'
import Title from '../../../Title'
import Colors from '../../../../constants/Colors';

const CardTag = ({ title }) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     return (
          <View style={styles.root(lang)}> 
               <Title size="1.3" style={{ textAlign : "center" }} color="#000" text={title}/>
          </View>
     )
}

const styles = StyleSheet.create({
     root : (lang) => ({
          justifyContent : "center", 
          alignItems : "center", 
          height  : font('20'),
          // minWidth : font('70'),
          backgroundColor : "#eee",
          borderRadius : font('16'),
          marginRight : lang === "english" ? font('8') : null,
          marginLeft : lang === "arabic" ? font('8') : null,
          marginVertical : 3,
          paddingHorizontal : fontValue("12")
     })
})    

export default CardTag