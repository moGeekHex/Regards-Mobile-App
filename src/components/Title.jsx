//import liraries
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { fontValue, font, fontPercent } from '../utils/Responsive';
import Colors from '../constants/Colors';
import fontFamily from '../constants/Fonts';

// create a component for title
const Title = ({text, size = 3, color, fontWeight, lineHeight, style, children, sizePercent, letterSpacingText, textAlign }) => {
    return (
        <Text 
            style={[styles.title(size, sizePercent, color, fontWeight, lineHeight, letterSpacingText, textAlign),style]} 
            allowFontScaling={false}
        >
            {text}
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    title : (size, sizePercent, color, fontWeight, lineHeight, letterSpacingText, textAlign) => ({
        fontSize : sizePercent ? fontPercent(sizePercent) : fontPercent(size),
        color : color || Colors.black,
        fontFamily: fontFamily,
        fontWeight : fontWeight,
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight : lineHeight,
        letterSpacing : letterSpacingText,
        textAlign : textAlign
    })
});

//make this component available to the app
export default Title;