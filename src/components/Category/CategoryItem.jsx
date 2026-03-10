import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Image from 'react-native-fast-image'
import React from 'react'
import { font, fontValue, width } from '../../utils/Responsive'
import Title from '../Title'

const CategoryItem = ({source, text, handlePress}) => {

     return (
          <TouchableOpacity style={styles.root} onPress={handlePress} activeOpacity={1}>
               <View style={styles.containerImage}>
                    <Image style={styles.image} source={source}/>
               </View>
               <View style={styles.containerText}>
                    <Title size="1.5" fontWeight="300" text={ text.slice(0,20) }/>
               </View>
          </TouchableOpacity>
     )
}

const styles = StyleSheet.create({
     root : {
          justifyContent : 'center',
          alignItems : 'center',
          marginHorizontal : "1.8%",
          marginBottom : font('12'),
          borderWidth : .5,
          borderRadius : font('12'),
          borderColor : '#efefef',
          shadowColor: "#333",
          ...Platform.select({
               ios : {
                    shadowOffset: {
                         width: 0,
                         height: 1.2,
                    },
                    shadowOpacity: 0.14,
                    shadowRadius: 1.41,
                    elevation: 2,
               },
               android: {
                    borderWidth : .7,
                    // shadowOffset: {
                    //      width: 0,
                    //      height: .1,
                    // },
                    // shadowOpacity: 0.14,
                    // shadowRadius: 1.41,
                    // elevation: 1,
               }
          })   
     },
     containerImage : {
          width : width("44"),
          height : fontValue('80'),
          // width : 173,
          // height : 100,
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
          paddingHorizontal : font('0'),
     }
})

export default CategoryItem