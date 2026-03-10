import React, { useRef, useState } from 'react'
import { Platform, StyleSheet, Image } from 'react-native'
import Card from './Card'
import Title from './Title'
import TextInput from './TextInput'
import { font, fontPercent, fontValue, height, width } from '../utils/Responsive'
import Colors from '../constants/Colors'
import Icon from '@react-native-vector-icons/ant-design'
import Entypo from '@react-native-vector-icons/entypo'
import { Input } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'

const InputPassword = ({ 
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
     inputContainerStyle,
     forwardedRef,
     ref
}) => {
     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     const [showPassword, setShowPassword] = useState(false);


     return (
          <Card flexDirection="row" style={styles.root(error)}>
               <Input
                    value={value}
                    placeholder={ lang === "english" ? "Password" : "كلمة المرور" }
                    labelStyle={styles.labelStyle}
                    style={[styles.inputStyle,inputStyle]}
                    containerStyle={[styles.containerStyle]}
                    inputContainerStyle={[styles.inputContainerStyle(lang), inputContainerStyle,{ borderColor : borderColor }]}
                    onChangeText={handleChange}
                    keyboardType="ascii-capable"
                    scrollEnabled={false}
                    multiline={false}
                    ref={forwardedRef}
                    autoCorrect={false}
                    leftIcon={
                         <Card flexDirection="row" style={styles.containerCodeNumber}>
                              <Icon name="lock" color="#333" size={font('20')}/>
                         </Card>
                    }
                    rightIcon={
                         <TouchableOpacity style={styles.containerShowCode} onPress={() => setShowPassword(!showPassword)}>
                              <Entypo name={ showPassword ? "eye-with-line" : "eye"} color="#333" size={font('18')}/>
                         </TouchableOpacity>
                    }
                    secureTextEntry={ !showPassword}
               />
          </Card>
     )
}

const styles = StyleSheet.create({
     root : (error) => ({
          height : height('6.2'),
          backgroundColor : '#F6F6F6',
          width : '100%',
          borderColor : error ? "#f00" : "#F6F6F6",
          borderWidth : 1,
          borderRadius : font('18'),
     }),
     labelStyle : {
          color : "#f00",
          backgroundColor : "#000",
          textAlign : "center"
     },
      inputStyle : {
          fontSize : Platform.OS === 'ios' ? fontValue('10.5') : fontValue('11'),
          height :  Platform.OS === 'ios' ? fontValue('26') : fontValue('26'),
          textAlign : "center",
      },
      containerStyle : {
          paddingHorizontal : width("5"),
      },
      inputContainerStyle : (lang) => ({
          // height :  Platform.OS === 'ios' ? height('6.6') : height('6.6'),
          backgroundColor : '#fff', 
          // paddingHorizontal: fontPercent('2'),
          paddingVertical: Platform.OS === 'ios' ? fontValue('4.5') : fontValue('4.5'),
          borderRadius:  fontPercent('1.5'),
          borderWidth : 0,
          borderBottomWidth:0,
          backgroundColor : '#F6F6F6',
          height : height('5.7'),
          width : '100%',
          borderRadius : font('18'),
          alignItems : "center",
          width : "100%",
          flexDirection : lang === "arabic" ? "row-reverse" : "row"
     }),
      errorStyle : {
          fontSize : font('11'),
          width : '100%',
          paddingHorizontal: width('2'),
          textAlign : 'center'
      }
})

export default InputPassword