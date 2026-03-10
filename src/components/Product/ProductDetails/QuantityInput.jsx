import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Title from '../../Title'
import { font, width } from '../../../utils/Responsive'
import { useTranslation } from "react-i18next";

const QuantityInput = ({ title, handleChange, onSubmit, style }) => {

     onSendTitlePressed = () => {
          onSubmit(title);
      }

     return (
          <TouchableOpacity 
               onPress={onSendTitlePressed} 
               style={[styles.root,{ transform : useTranslation().i18n.language === "english" ? [{ scaleX: 1 }] : [{ scaleX: -1 }] },style]}
          >
               <Title text={title}  size="2" color="#000"/>
          </TouchableOpacity>
     )
}

const styles = StyleSheet.create({
     root : {
          height : font('40'),
          width : font('40'),
          justifyContent : 'center',
          alignItems : 'center',
          alignSelf : "center",
          borderColor : '#eee',
          borderWidth : 1,
          borderRadius : font('100'),
          marginHorizontal: font('4.5')
     },

})

export default QuantityInput