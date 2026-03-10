import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { font } from '../../../../utils/Responsive'
import Title from '../../../Title'

const Quantity = ({ handlePress, title, qun }) => {
  return (
     <TouchableOpacity onPress={handlePress} style={styles.root}>
          <Title size="1.5" text={title} fontWeight="600" color="#555"/>
          <Title size="1.7" text={qun} fontWeight="800"/>
     </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
     root : {
          justifyContent : 'center',
          alignItems : 'center',
          width : font('40'),
          height : font('40'),
          paddingTop : font('3'),
          borderWidth : 1,
          borderColor : '#eee',
          borderRadius : font('60'),
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,
          
          elevation: 0,
     }
})

export default Quantity