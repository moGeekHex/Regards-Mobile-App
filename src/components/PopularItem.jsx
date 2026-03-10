import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native'
import Image from 'react-native-fast-image'
import React, { memo } from 'react'
import { font } from '../utils/Responsive'
import Title from './Title'

const PopularItem = ({source, text, onPress }) => {
     return (
     <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.root}>
               <View style={styles.containerImage}>
                    <Image style={styles.image} source={source}/>
               </View>
               <View style={styles.containerText}>
                    <Title size="1.5" fontWeight="300" text={ text.slice(0,20)}/>
               </View>
     </TouchableOpacity>
     )
}

const styles = StyleSheet.create({
     root : {
          backgroundColor : "#fff",
          justifyContent : 'center',
          alignItems : 'center',
          marginHorizontal : font('5'),
          borderWidth : .25,
          borderRadius : font('12'),
          borderColor : '#ccc',
        
     },
     containerImage : {
          width : font('137'),
          height : font('80'),
          // width : 167,
          // height : 99,
          borderColor : '#ccc',
          ...Platform.select({
               ios : {
                    shadowColor: "#000",
                    shadowOffset: {
                         width: 0,
                         height: 3,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 1.65,
                    
                    elevation: 7,
               },
               android: {
                    // shadowColor: "#000",
                    // shadowOffset: {
                    //      width: 0,
                    //      height: 3,
                    // },
                    // shadowOpacity: 0.1,
                    // shadowRadius: 1.65,
                    
                    // elevation: 7,
               }
          })     
     },
     image : {
          width : '100%',
          height : '100%',
          borderTopLeftRadius : font('12'),
          borderTopRightRadius : font('12'),
     },
     containerText : {
          justifyContent : 'center',
          alignItems : 'center',
          padding : font('12'),
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.00,

          elevation: 24,
     }
})

export default memo(PopularItem)