import React from 'react'
import { StyleSheet, View, TextInput, Platform } from 'react-native'
import { font, width } from '../../../utils/Responsive'

const CardPhone = ({ 
     value, 
     onChangeText, 
     returnKeyType,
     backgroundColor,
     autoFocus,
     onSubmitEditing,
     forwardedRef
}) => {
     return (
          <View style={styles.root}>
               <TextInput
                    style={styles.inputContainerStyle(backgroundColor)}
                    autoFocus = {autoFocus}
                    placeholder="-"
                    placeholderTextColor="#777"
                    maxLength={1}
                    ref={forwardedRef}
                    onSubmitEditing={onSubmitEditing}
                    keyboardType='numeric'
                    onChangeText={onChangeText}
                    returnKeyType={returnKeyType}
                    scrollEnabled={false}
                    value={value}
                    multiline={Platform.OS === "ios" ? false : true} 
               />
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          flexGrow: 1, 
          marginHorizontal: width('.75%'),
     },
     inputStyle : {
          textAlign: 'center',
          borderRadius : font('20')
     },
     inputContainerStyle : (backgroundColor) => ({
          height : font('43'),
          borderRadius : font('15'),
          borderBottomWidth: 0,
          borderWidth : 0,
          textAlign: 'center',
          backgroundColor : backgroundColor ? backgroundColor : null,
          color : "#000"
     })
})

export default CardPhone