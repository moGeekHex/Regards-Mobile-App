import React from 'react';
import { View, StyleSheet ,TouchableOpacity, Image, Platform } from 'react-native';
import { Logo, Card } from '..';
import Colors from "../../constants/Colors";
import { font, fontValue } from '../../utils/Responsive';
import { useTranslation } from "react-i18next";
// import Image from 'react-native-fast-image'

const HeaderHome = ({
    imageProfile,
    logo,
    onPressProfile,
    imageHowToUse,
    onPressHowToUse
}) => (
    <View style={styles.container}>
        <Card pushUp={ Platform.OS === "ios" ? "4" : "0"} widthCard="100%" style={styles.containerImage} flexDirection={ useTranslation().i18n.language === "english" ? "row" : "row-reverse"}>
            <Logo 
                width="155" 
                height="35"
                source={logo}
            />
            <View style={{ flexDirection : useTranslation().i18n.language === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center" }}>
                {/* <TouchableOpacity onPress={onPressProfile}>
                    <Feather name="menu" size={font("18")}/>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={onPressProfile}>
                    <View style={styles.cricle}>
                        <Image style={styles.image} source={imageProfile}/>
                    </View>
                </TouchableOpacity>
            </View>
        </Card>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.backgroundColor,
        justifyContent : 'center',
        width : "100%"
    },
    containerImage : {
        justifyContent : 'space-between',
        alignItems : 'center',
        alignContent : 'center',
        alignSelf : 'center'
    },
    containerIconNotification : {
        justifyContent : 'center',
        alignItems : 'center',
        width : fontValue('45'),
        height : fontValue('45'),
        borderRadius : fontValue('45'),
    },
    cricle :  {
        width : fontValue('30'),
        height : fontValue('30'),
    },
    image : {
        width : '100%',
        height : '100%',
        resizeMode : 'cover',
        borderRadius : font('8')
    },
    containerHowToUse : {
        width : fontValue('75'),
        height : fontValue('14'),
        marginHorizontal : fontValue("10")
        // paddingVertical : fontValue("10"),
    },
    imageHowToUse : {
        width : '100%',
        height : '100%',
        resizeMode : 'cover',
    }
});


export default HeaderHome;