import React from 'react'
import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import { font, fontValue } from '../../../../utils/Responsive'
import Title from '../../../Title'

const ProductButton = ({ handlePress, title , width, disabled }) => {
  return (
     <TouchableOpacity onPress={handlePress} style={styles.root(width, disabled)} disabled={disabled}>
          <Title size="1.65" text={title} color="#fff" fontWeight="600"/>
     </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
     root : ( width, disabled ) => ({
          width : width ? width : '100%',
          alignItems : 'center',
          justifyContent : 'center',
          padding : fontValue('13'),
          borderRadius : fontValue('20'),
          backgroundColor : disabled ? "#777" : "#4F008E"
     })
})

export default ProductButton