//import liraries
import React,{ memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { fontValue, font, fontPercent } from '../../utils/Responsive';
import Colors from '../../constants/Colors'
import { Card, ImageCricle, Title } from '..';
import { useTranslation } from "react-i18next";

// create a component 
const CategoryEgde = ({text, source, size, onPress}) => {
    return (
          <TouchableOpacity style={styles.root} onPress={onPress} activeOpacity={1}>
               <Card style={styles.container} flexDirection={ useTranslation().i18n.language === "english" ? "row" : "row-reverse"}>
               {/* <ImageCricle source={source} dimensions="23"/> */}
               <ImageCricle source={source} />
               <Title text={text} size={size} color="#352E3C" style={styles.text}/>
               </Card>
          </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
     root : {
          // minWidth : '20%',
          // height : font('35'),
          backgroundColor : Colors.blackShadow,
          paddingHorizontal: font('3'),
          paddingVertical: font('3'),
          borderRadius : fontValue('9'),
          marginHorizontal: font('3'),
          // borderWidth : .2,
          // borderColor : "#999"
     },
     container : {
          alignItems : 'center'     
     },
     text : {
          paddingHorizontal: font('3'),
     }
});

//make this component available to the app
export default memo(CategoryEgde);