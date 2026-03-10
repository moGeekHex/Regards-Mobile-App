import React from 'react';
import { View, StyleSheet ,TouchableOpacity, Image, Platform } from 'react-native';
import { Logo, Card, Title } from '..';
import Colors from "../../constants/Colors";
import { font, fontValue } from '../../utils/Responsive';
import { useTranslation } from "react-i18next";
import FontAwesome from "@react-native-vector-icons/fontawesome6";

const Header = ({
    imageProfile,
    logo,
    onPressProfile,
    imageHowToUse,
    onPressHowToUse
}) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    return <View style={styles.container}>
        <Card pushUp={ Platform.OS === "ios" ? "4" : "0"} widthCard="100%" style={styles.containerImage} flexDirection={ useTranslation().i18n.language === "english" ? "row" : "row-reverse"}>
            <View>
                <Logo 
                    width="125" 
                    height="30"
                    source={logo}
                />
            </View>
            <TouchableOpacity 
                onPress={onPressProfile}
                style={styles.regions(lang)}
            >
                <View style={styles.bodyRegions}>
                    <Title text="الرياض" size="1.5" color={"#fff"}/>
                </View>
                <View style={styles.bodyRegions}>
                    <FontAwesome name="caret-down" size={font("14")} color={"#fff"}/>
                </View>
            </TouchableOpacity>
        </Card>
    </View>
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.standardColor,
        justifyContent : 'center',
    },
    containerImage : {
        justifyContent : 'space-between',
        alignItems : 'center',
        alignContent : 'center',
        alignSelf : 'center'
    },
    regions : (lang) => ({
        flexDirection : useTranslation().i18n.language === "english" ? "row" : "row-reverse", 
        justifyContent : "space-evenly", 
        alignItems : "center",
        paddingHorizontal: font("10"),
        backgroundColor : "rgba(255, 255, 255, 0.09)",
        paddingVertical: font("5.5"),
        borderRadius : font("11"),
        width : font("60"),
    }),
    bodyRegions : {
        flexWrap: "wrap"
    }
});


export default Header;