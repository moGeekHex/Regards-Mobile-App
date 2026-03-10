import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import TextInput from '../TextInput'
import { fontPercent, fontValue, height } from '../../utils/Responsive'
import { useTranslation } from "react-i18next";
import Colors from '../../constants/Colors';


const InputSearch = ({ 
     placeholder, 
     handleChange, 
     width, 
     leftIconName, 
     leftIconPress, 
     rightIconName, 
     rightIconPress, 
     value, 
     onSubmitEditing,
     type
}) => {

     const { t, i18n } = useTranslation();

     return (
          <View style={styles.root(width,type)}>
               {
                    i18n.language === "english" ? 
                         <TextInput 
                              placeholder={placeholder}
                              autoCapitalize="none"
                              inputStyle={[styles.inputStyle(type),{ textAlign : 'left' }]}
                              inputContainerStyle={styles.inputContainerStyle(type)}
                              leftIconName={leftIconName}
                              leftIconPress={leftIconPress}
                              rightIconName={rightIconName}
                              rightIconPress={rightIconPress}
                              iconSize={ type === "home" ? "2.5" : "2.5"}
                              iconColor="#9B9B9B"
                              handleChange={handleChange}
                              returnKeyType="search"
                              value={value}
                              allowFontScaling={false}
                              onSubmitEditing={onSubmitEditing}
                         />
                    :
                         <TextInput 
                              placeholder={placeholder}
                              autoCapitalize="none"
                              inputStyle={[styles.inputStyle(type),{ textAlign : 'right' }]}
                              inputContainerStyle={styles.inputContainerStyle(type)}
                              leftIconName={leftIconName}
                              leftIconPress={leftIconPress}
                              rightIconName={rightIconName}
                              rightIconPress={rightIconPress}
                              iconSize={ type === "home" ? "2.5" : "2.5"}
                              iconColor="#9B9B9B"
                              handleChange={handleChange}
                              returnKeyType="search"
                              value={value}
                              allowFontScaling={false}
                              onSubmitEditing={onSubmitEditing}
                         />
               }
          </View>
     )
}

const styles = StyleSheet.create({
     root : (width,type) => ({
          width : width ? width : '90%',
          paddingHorizontal : type === "home" ? 0 : '5%',
      }),
     inputContainerStyle : (type) => ({
          height :  Platform.OS === 'ios' ? type === "home" ? height("4.3") : height('4.5') : height('5'),
          borderWidth : 0,
          backgroundColor : type === "home" ? Colors.blackShadow : '#C4C4C42E',
          borderRadius:  fontPercent('3'),
          paddingHorizontal: type === "home" ? fontPercent("1") : fontPercent('1.5'),
          paddingBottom : 0,
          paddingVertical : 0,
          borderBottomWidth : 0
     }),
     inputStyle : (type) => ({
          paddingHorizontal: fontPercent('1.25'),
          fontSize : type === "home" ? fontPercent("1.4") : null,
          paddingBottom : 0,
          paddingVertical : 0,
          borderBottomWidth : 0
     })
})

export default InputSearch