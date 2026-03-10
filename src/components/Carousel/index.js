import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import ImageCarousel from './ImageCarousel';

export default function index({data, onPress}) {
     return (
          <View style={styles.container}>
               {/* <ScrollView> */}
                    <ImageCarousel data={data} onPress={onPress}/>
               {/* </ScrollView> */}
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          backgroundColor: '#fff',
     },
     title: {
          color: 'white',
          // marginTop: 40,
          marginBottom: 5,
     },
});