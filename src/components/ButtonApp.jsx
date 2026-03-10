import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icons from '@react-native-vector-icons/feather'
import { font, fontPercent, fontValue } from '../utils/Responsive'
import Title from './Title'
import Card from './Card'
import { useTranslation } from 'react-i18next'

const ButtonApp = ({ onPress, title, lite, disabled, iconName, iconSize = 2, iconColor }) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     return (
          <TouchableOpacity onPress={onPress} style={styles.root(lite, disabled)} disabled={disabled}>
               <Card flexDirection={ lang === "arabic" ? "row" : "row-reverse"} style={styles.container}>
                    {
                         iconName 
                         ?
                              <Icons name={iconName} size={fontPercent(iconSize)} color={iconColor} style={styles.icon}/>
                         :
                              null
                    }
                    <Title text={title} color={ lite ? '#4F008E' : "#fff" } size="1.6" fontWeight="600"/>
               </Card>
          </TouchableOpacity>
     )
}

const styles = StyleSheet.create({
     root : (lite, disabled) => ({
          justifyContent : 'center',
          alignItems : 'center',
          backgroundColor : lite ? '#fff'  :  disabled ? "#ccc" : '#4F008E',
          padding : fontValue('13'),
          borderWidth : 1,
          borderColor : '#ddd',         
          borderRadius : font('22'),
          width : "100%"
     }),
     container : {
          justifyContent : 'center',
          alignItems : 'center',
     },
     icon : {
          paddingHorizontal : "2%"
     }
})

export default ButtonApp