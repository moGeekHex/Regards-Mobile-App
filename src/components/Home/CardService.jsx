import React, { useEffect } from 'react';
import { View, StyleSheet , TouchableOpacity, Image, Platform } from 'react-native';
import { Logo, Card, Title } from '..';
import Colors from "../../constants/Colors";
import { font, fontValue, width } from '../../utils/Responsive';
import { useTranslation } from "react-i18next";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FastImage from 'react-native-fast-image';

const CardService = ({
    data,
    onPress
}) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    useEffect(() => {
        console.log(data)
    },[])

    return ( 
        <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.container}>
            <View style={styles.containerImage}>
                <FastImage
                    source={{ uri : data.thumbnail }}
                    style={{ height: "100%", width: "100%", resizeMode: 'contain', borderRadius : font("9") }}
                />
            </View>
            {/* <Title text={data?.nameAr} size={1.7}/> */}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        justifyContent : 'center',
        alignItems : "center"
    },
    containerImage : {
        width : font("62.5"),
        height : font("60"),
        marginHorizontal : width("1"),
        marginRight : width("2")
    }
});


export default CardService;