import React from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { font } from '../../../../utils/Responsive'

const LogoTag = ({ source, style }) => {
  return (
     <View style={[styles.root, style ]}>
          <Image style={styles.image} source={source}/>
     </View>
  )
}

const styles = StyleSheet.create({
     root : {
          width : font('45'),
          height : font('45'),
     },
     image : {
          width : '100%',
          height : '100%',
          borderColor : "#999",
          borderWidth : .2,
          borderRadius : font('45'),
     }
})

export default LogoTag