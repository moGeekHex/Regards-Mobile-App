import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import Image from 'react-native-fast-image'
import React from 'react'
import { font } from '../../utils/Responsive'
import Title from '../Title'

const Gifts = ({source, text, onPress}) => {
  return (
     <TouchableOpacity onPress={onPress} style={styles.root} activeOpacity={1}>
          <View style={styles.containerImage}>
               <Image style={styles.image} source={source}/>
          </View>
          <View style={styles.containerText}>
               <Title style={styles.text} size="1.5" color="#fff" fontWeight="700" text={text}/>
          </View>
     </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
     root : {
          borderRadius : font('12'),
          position : 'relative',
          marginBottom : '3%',
          borderWidth : .5,
          borderRadius : font('12'),
          borderColor : '#efefef',
          ...Platform.select({
               ios : {
                    shadowColor: "#333",
                    shadowOffset: {
                         width: 0,
                         height: 1.2,
                    },
                    shadowOpacity: 0.14,
                    shadowRadius: 1.41,
                    elevation: 2
               },
               android: {
                    borderWidth : 1,
                    shadowColor: "#333",
                    shadowOffset: {
                         width: 2,
                         height: 2,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,
                    elevation: 0
               }
          }) 
     },
     containerImage : {
          width : font('140'),
          height : font('100'),
          borderRadius : font('12'),
     },
     image : {
          width : '100%',
          height : '100%',
          borderRadius : font('12'),
          resizeMode : 'cover',
     },
     containerText : {
          position : 'absolute',
          width : '100%',
          height : font('105'),
          borderRadius : font('12'),
          justifyContent : 'center',
          alignItems : 'center',
          alignContent : 'center',
          // padding : font('12'),
     },
     text : {
          textAlign : 'center'
     }
})

export default Gifts