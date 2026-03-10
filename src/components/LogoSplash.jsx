import React from 'react';
import { Image , StyleSheet } from 'react-native';
import { fontPercent, fontValue } from '../utils/Responsive';

// create a component
const Logo = ({ width, height }) => {
    return (
        <Image style={styles.root(width, height)} source={require('../assets/images/RegardsLogo.png')}/>
    );
};


const styles = StyleSheet.create({
    root : (width, height) => ({
        resizeMode: 'contain',
        width : fontValue(width),
        height : fontValue(height)
    })
})

//make this component available to the app
export default Logo;