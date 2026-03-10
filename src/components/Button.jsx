import React, { memo } from 'react';
import {  Text, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import Icons from '@react-native-vector-icons/fontawesome6';
import { fontPercent , width, font, fontValue } from '../utils/Responsive';
import Colors from '../constants/Colors';

// create a component
const Button = ({ 
    handlePress, 
    title, 
    titleSize = 0, 
    titleWeight,
    buttonStyle, 
    buttonColor,
    titleStyle, 
    titleColor,
    type='button',
    iconName,
    iconSize = 0,
    iconColor,
    containerColor,
    disabled
}) => {
    return (
        <TouchableOpacity 
            onPress={handlePress} 
            style={[ type == 'button' ? styles.rootButton(buttonColor,type) : styles.rootText ,buttonStyle]}
            disabled={disabled}
        >
            {
                iconName 
                ? 
                    containerColor 
                    ?
                        <View style={styles.containerColor(containerColor)}>
                            <Icons name={iconName} color={iconColor} size={font(iconSize)}/> 
                        </View>
                    :
                        <Icons style={styles.icon} name={iconName} color={iconColor} size={font(iconSize)}/> 
                : 
                    null
            }
            <Text style={[styles.title(type, titleSize, titleWeight,titleColor),titleStyle]} allowFontScaling={false}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    rootButton : (buttonColor, type) => ({
        backgroundColor : type == 'button' ? buttonColor ? buttonColor : Colors.standardColor : null,
        width : type == 'button' ? width('92.5%') : null,
        // height : font('7'),
        paddingVertical : Platform.OS === 'ios' ? fontValue('11') : fontValue('11'),
        borderRadius : font('25'),
        alignItems:  'center',
        justifyContent:  'center',
        flexDirection: 'row',
        shadowColor: Colors.standardColor,
        shadowOffset: {
            width: 1,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 3.84,
        elevation: 5,
    }),
    rootText : {
        alignItems:  'center',
        justifyContent: 'center'
    },
    title : (type, titleSize, titleWeight, titleColor) => ({
        color : type == 'button' ? Colors.white : titleColor ? titleColor : Colors.standardColor,
        fontSize : titleSize ? fontPercent(titleSize) : Platform.OS === 'ios' ? fontPercent('1.6') : fontPercent('1.6'),
        fontWeight : titleWeight ? titleWeight : '400',
        paddingHorizontal : fontPercent('1')
    }),
    containerColor : (containerColor) => ({
        backgroundColor : containerColor,
        width : fontPercent('6'),
        height : fontPercent('6'),
        justifyContent : 'center',
        alignItems : 'center',
        alignSelf : 'center',
        alignContent : 'center',
        borderRadius : fontPercent('4'),
    }),
    icon : {
        paddingHorizontal: font('16'),
    }
});

export default memo(Button);