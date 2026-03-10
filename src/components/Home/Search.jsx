import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Logo, Card } from '..';
import Colors from "../../constants/Colors";
import { font, fontValue } from '../../utils/Responsive';
import { useTranslation } from "react-i18next";
import EvilIcons from "@react-native-vector-icons/evil-icons";

const Search = ({
    imageProfile,
    logo,
    onPressProfile,
    imageHowToUse,
    onPressHowToUse
}) => (
    <View style={styles.container}>
        <EvilIcons name="search" size={font("16")} color={"#fff"}/>
        <TextInput 
            style={styles.searchInput} 
            placeholder="ابحث بين افضل التجارب"
            placeholderTextColor="rgba(255, 255, 255, 0.80)"
            placeholderStyle={styles.placeholderStyle}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor : "rgba(255, 255, 255, 0.09)",
        justifyContent : 'center',
        flexDirection : "row-reverse",
        paddingVertical : font("8"),
        borderRadius : font(16)
    },
    searchInput : {
        width : "88%",
        color : "rgba(255, 255, 255, 0.80)",
        textAlign : "center",
        fontSize : font("10.5"),
        fontWeight : "500"
    },
    placeholderStyle : {
        fontSize : font("5")
    }
});


export default Search;