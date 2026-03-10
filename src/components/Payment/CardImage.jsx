import { StyleSheet, Image, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { font } from '../../utils/Responsive'
import Card from '../Card'
import Title from '../Title'

const CardImage = ({ source, onPress }) => {
  return (
     <TouchableOpacity  onPress={onPress} style={styles.root}>
          {/* <View style={styles.containerImage}> */}
               <Image source={source} style={styles.image}/>
          {/* </View> */}
     </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
     root : {
          width : '49%',
          height : font('145'),
          borderColor : '#ccc',
          backgroundColor: "#F8F8F9",
          justifyContent : 'center',
          alignItems : 'center',
          resizeMode : 'cover'
     },
     containerImage : {
          width : font('130'),
          height : '100%'
     },
     image : {
          width : '100%',
          height : '100%',
     },
     cycle : {
          width : font('4'),
          height : font('4'),
          borderRadius : font('10'),
          backgroundColor : '#4F008E'
     }
})

export default CardImage