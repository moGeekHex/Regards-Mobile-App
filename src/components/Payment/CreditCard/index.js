import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MaskedTextInput } from "react-native-mask-text";
import { height, fontPercent } from '../../../utils/Responsive'

const CreditCard = ({ onChangeText, mask, placeholder }) => {
     return (
          <MaskedTextInput
               type="custom"
               mask={mask}
               onChangeText={onChangeText}
               keyboardType="numeric"
               style={styles.input}
               placeholder={placeholder}
          />
     )
}

const styles = StyleSheet.create({
     input: {
          height : height('6'),
          width : '100%',
          backgroundColor : '#eee',
          borderWidth : 0,
          borderRadius:  fontPercent('3'),
          textAlign : 'center'
     }
})

export default CreditCard