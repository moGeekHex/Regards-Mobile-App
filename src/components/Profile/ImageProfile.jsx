import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { font, fontValue } from '../../utils/Responsive'

const ImageProfile = ({source, styleProfile, styleImage}) => {
     return (
          <View style={[styles.root,styleProfile]}>
               <Image style={[styles.image, styleImage]} source={source}/>
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          width : fontValue('95'),
          height : fontValue('95'),
     },
     image : {
          width : '100%',
          height : '100%',
          borderRadius : font('100'),
     }
})

export default ImageProfile