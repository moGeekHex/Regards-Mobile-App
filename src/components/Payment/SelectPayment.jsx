import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { font } from '../../utils/Responsive'
import Title from '../Title'
import { useTranslation } from "react-i18next";
import Card from '../Card';

const SelectPayment = ({ onPressApplePay, applePay, onPressPayOthers, otherCard, appleTitle, otherTitle }) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     return (
          <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.root}>
               <TouchableOpacity onPress={onPressApplePay} style={styles.applePayLeft(applePay, lang)}>
                    <Title text={appleTitle} color={ applePay ? '#4F008E' : "#433C4A"} size="1.7" fontWeight={applePay ? '700' : '400'}/>
               </TouchableOpacity>
               <TouchableOpacity onPress={onPressPayOthers} style={styles.otherPayRight(otherCard,lang)}>
                    <Title text={otherTitle} color={ otherCard ? '#4F008E' : "#433C4A"} size="1.7" fontWeight={otherCard ? '700' : '400'}/>
               </TouchableOpacity>
          </Card>
     )
}

const styles = StyleSheet.create({
     root : {
          height : font('40'),
          borderColor : '#ddd',
          borderWidth : 1,
          borderRadius : font('18')
     },
     applePayLeft : (applePay, lang) => ({
          width : '50%',
          height : '100%',
          justifyContent : 'center',
          alignItems : 'center',
          borderBottomLeftRadius : lang === "english" ? font('18') : null,
          borderTopLeftRadius : lang === "english" ? font('18') : null,
          borderBottomRightRadius : lang === "arabic" ? font('18') : null,
          borderTopRightRadius : lang === "arabic" ? font('18') : null,
          backgroundColor : applePay ? '#F6F4F8' : '#fff'
     }),
     otherPayRight : (otherCard,lang) => ({
          width : '50%',
          height : '100%',
          justifyContent : 'center',
          alignItems : 'center',
          borderBottomLeftRadius : lang === "arabic" ? font('18') : null,
          borderTopLeftRadius : lang === "arabic" ? font('18') : null,
          borderBottomRightRadius : lang === "english" ? font('18') : null,
          borderTopRightRadius : lang === "english" ? font('18') : null,
          backgroundColor : otherCard ? '#F6F4F8' : '#fff'
     })
})

export default SelectPayment