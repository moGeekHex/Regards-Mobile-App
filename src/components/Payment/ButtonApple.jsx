import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { font } from '../../utils/Responsive'
import Title from '../Title'
import Card from '../Card'

const ButtonApple = ({ onPress, title }) => {
     return (
          <TouchableOpacity style={styles.root} onPress={onPress}>
               <Card flexDirection="row" style={styles.container}>
                    <AntDesign name="apple1" color="#fff" size={font(20)} style={styles.icon} />
                    <Title text={title} color="#fff" size="1.9" fontWeight="600"/>
               </Card>
          </TouchableOpacity>
     )
}

const styles = StyleSheet.create({
     root : {
          justifyContent : 'center',
          alignItems : 'center',
          backgroundColor : '#000',
          padding : font('12'),
          borderRadius : font('18')
     },
     container : {
          justifyContent : 'center',
          alignItems : 'center'
     },
     icon : {
          paddingHorizontal : font('6')
     }
})

export default ButtonApple