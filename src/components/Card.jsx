//import liraries
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { fontValue , width, height } from '../utils/Responsive';

// create a component
const Card = ({ 
    flexDirection = "column" , 
    children, 
    pushUp = 0, 
    pushDown = 0, 
    pushRight = 0, 
    pushLeft = 0, 
    widthCard = null , 
    direction,
    style ,
    onPress
}) => {
    return (
        <View onPress={onPress} style={[styles.root(pushUp, pushDown, pushRight, pushLeft, widthCard, flexDirection),style]} direction={direction}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    root : (pushUp, pushDown, pushRight, pushLeft, widthCard, flexDirection) => ({
        paddingTop : Platform.OS === 'ios' ? height(pushUp) : height(pushUp - .25),
        paddingBottom: height(pushDown),
        paddingRight: width(pushRight),
        paddingLeft: width(pushLeft),
        width : widthCard,
        flexDirection: flexDirection,
    })
})

export default Card;