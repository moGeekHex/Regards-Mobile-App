import React from 'react';
import {  View, Image, StyleSheet } from 'react-native';
import { font, fontPercent, fontValue } from '../utils/Responsive';

// create a component
const Logo = ({ width, height, source }) => {
    return (
        <View style={styles.root(width, height)}>
            <Image style={styles.image} source={source}/>
        </View>
    );
};


const styles = StyleSheet.create({
    root : (width, height) => ({
        width : font(width),
        height : font(height)
    }),
    image : {
        width : '100%',
        height : '100%',
        resizeMode: 'contain',
    }
})

//make this component available to the app
export default Logo;