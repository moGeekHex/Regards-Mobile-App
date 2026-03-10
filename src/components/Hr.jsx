import { View, StyleSheet } from 'react-native'
import React from 'react'

const Hr = () => {
  return (
    <View style={styles.root}/>
  )
}

const styles = StyleSheet.create({
     root : {
          width : '100%',
          borderWidth : .4,
          borderColor : '#ddd'
     },
})

export default Hr