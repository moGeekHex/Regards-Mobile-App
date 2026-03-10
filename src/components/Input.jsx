import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { font, fontPercent, height } from '../utils/Responsive'
// import TextInput from './TextInput'

const Input = ({ 
     placeholder, 
     multiline, 
     heightInput, 
     width, 
     inputContainerStyle,
     value, 
     handleChange, 
     keyboardType,
     autoFocus,
     textContentType,
     returnKeyType,
     onSubmitEditing,
     blurOnSubmit,
     ref,
     backgroundColor,
     ...restProps
}) => {
  return (
     <TextInput
          rootStyle={styles.root(width)}
          style={[styles.inputContainerStyle(heightInput, width, backgroundColor),inputContainerStyle]}
          inputStyle={[styles.inputStyle(heightInput, width)]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onChangeText={handleChange}
          keyboardType={keyboardType}
          value={value}
          ref={ref}
          allowFontScaling={false}
          multiline={multiline}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          textContentType={textContentType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          {...restProps}
     />
  )
}

const styles = StyleSheet.create({
     root : (width) => ({
          width : width ? width : '100%',
     }),
     inputContainerStyle : (heightInput, width, backgroundColor) => ({
          width : width ? width : '100%',  textAlign : 'center',
          height : heightInput ? height(heightInput) : height('5'),
          backgroundColor : backgroundColor ? backgroundColor : "#eee",
          borderWidth : 0,
          borderRadius:  fontPercent('3'),
          alignItems : heightInput ? 'flex-start' : 'center',
          paddingTop : heightInput ? font('9') : null,
          fontSize : font("11"),
          color : "#000",
          textAlign : 'center',
     }),
     inputStyle : (heightInput , width) => ({
          width : width ? width : '100%',
          height : heightInput ? height(heightInput) : height('3'),
          // height : heightInput ? height(heightInput - 3) : height('6'),
     })
})

export default Input