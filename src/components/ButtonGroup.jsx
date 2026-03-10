import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Title from './Title';
import Card from './Card';
import { useTranslation } from "react-i18next";
import { font } from '../utils/Responsive';

const ButtonGroup = ({ buttons, selectedIndex, onPress }) => {

     const { t, i18n } = useTranslation();

     return (
          <Card style={styles.btnGroup} flexDirection={ i18n.language === "english" ? "row" : "row-reverse" }>
               {
                    buttons.map((button, index ) => {
                         return (
                              <TouchableOpacity style={[styles.btn, selectedIndex === index ? styles.btnActive : null]} onPress={() => onPress(index)}>
                                   <Title style={styles.btnText} color={ selectedIndex === index ? "#fff" : null } text={button} size={1.8} fontWeight="500"/>
                              </TouchableOpacity>
                         )
                    })
               }
          </Card>
     );
}

const styles = StyleSheet.create({
    btnGroup: {
        alignItems: "center",
        marginHorizontal : "2.5%",
        backgroundColor : "#fff"
    },
    btn: {
        flex: 1,
    },
    btnActive : {
     backgroundColor : Colors.standardColor,
     borderTopLeftRadius : font("10"),
     borderTopRightRadius : font("10"),
    },
    btnText: {
        textAlign: 'center',
        paddingVertical: 10,  
     }
});

export default ButtonGroup;