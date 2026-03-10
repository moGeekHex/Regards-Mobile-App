import React, { useRef } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Card from './Card'
import Title from './Title'
import TextInput from './TextInput'
import { font, fontPercent, fontValue, height, width } from '../utils/Responsive'
import Colors from '../constants/Colors'
import Icon from '@react-native-vector-icons/ant-design'
import { Input } from '@rneui/themed';
import { useTranslation } from 'react-i18next'

const InputEmail = ({ 
     wide, 
     handleChange, 
     value, 
     inputRootStyle, 
     returnKeyType, 
     onSubmitEditing, 
     maxLength, 
     editable, 
     error,
     autoFocus,
     errorMessage,
     borderColor,
     inputStyle,
     textContentType,
     blurOnSubmit,
     forwardedRef,
     inputContainerStyle,
     emailVaild
}) => {
     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     return (
          <Card flexDirection="row" style={styles.root(error)}>
               <Input
                    value={value}
                    placeholder={ lang === "english" ? "E-mail" : "البريد الالكتروني" }
                    labelStyle={styles.labelStyle}
                    style={[styles.inputStyle,inputStyle]}
                    containerStyle={[styles.containerStyle]}
                    inputContainerStyle={[styles.inputContainerStyle, inputContainerStyle,{ borderColor : borderColor }]}
                    onChangeText={handleChange}
                    keyboardType="email-address"
                    scrollEnabled={false}
                    multiline={false}
                    returnKeyType={returnKeyType}
                    textContentType={textContentType}
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit={blurOnSubmit}
                    ref={forwardedRef}
                    autoCorrect={false}
                    leftIcon={
                         lang === "english" 
                         ?
                              <Card flexDirection="row" style={styles.containerCodeNumber}>
                                   <Icon name="mail" color="#333" size={font('18')} iconType="light"/>
                              </Card>
                         :
                              <View style={{ width : width("6"), backgroundColor : "#f00" }}/>
                    }  
                    rightIcon={
                         lang === "arabic"
                         ? 
                              <Card flexDirection="row" style={styles.containerCodeNumber}>
                                   <Icon name="mail" color="#333" size={font('18')} iconType="light"/>
                              </Card>
                         :
                         <View style={{ width : width("6"), backgroundColor : "#f00" }}/>
                    }            
               />
          </Card>
     )
}

const styles = StyleSheet.create({
     root : (error) => ({
          height : height('6.2'),
          backgroundColor : '#F6F6F6',
          borderColor : error ? "#f00" : "#F6F6F6",
          borderWidth : 1,
          borderRadius : font('18'),
     }),
     containerCodeNumber : {
     },
     labelStyle : {
          color : "#f00",
          backgroundColor : "#000",
          textAlign : "center"
     },
      inputStyle : {
          fontSize : Platform.OS === 'ios' ? fontValue('10.5') : fontValue('11'),
          height :  Platform.OS === 'ios' ? fontValue('26') : fontValue('26'),
          textAlign : "center",
          alignItems : "center",
          width : "100%"
      },
      containerStyle : {
          paddingHorizontal : width("5"),
          width : "100%"        
      },
      inputContainerStyle : {
          // height :  Platform.OS === 'ios' ? height('6.6') : height('6.6'),
          backgroundColor : '#fff', 
          // paddingHorizontal: fontPercent('2'),
          paddingVertical: Platform.OS === 'ios' ? fontValue('4.5') : fontValue('4.5'),
          borderRadius:  fontPercent('1.5'),
          borderWidth : 0,
          borderBottomWidth:0,
          backgroundColor : '#F6F6F6',
          height : height('5.7'),
          borderRadius : font('18'),
          alignItems : "center",
          width : "100%"
     },
      errorStyle : {
          fontSize : font('11'),
          paddingHorizontal: width('2'),
          textAlign : 'center'
      }
})

export default InputEmail