import React from 'react';
import { View, StyleSheet } from 'react-native';
import Image from 'react-native-fast-image'
import { fontValue } from '../utils/Responsive';

const ImageCricle = ({
     source,
     dimensions
}) => (
    <View style={styles.root(dimensions)}>
        <Image style={styles.image} source={source}/>
    </View>
);

const styles = StyleSheet.create({
    root : (dimensions) =>  ({
        width : dimensions ? fontValue(dimensions) : fontValue('30'),
        height : dimensions ? fontValue(dimensions) : fontValue('20'),
    }),
    image : {
        width : '100%',
        height : '100%',
        borderRadius : fontValue('6'),
    }
})

export default ImageCricle;