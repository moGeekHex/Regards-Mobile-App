import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Ionicons from '@react-native-vector-icons/ionicons'
import AntDesign from '@react-native-vector-icons/ant-design'
import Card from '../Card'
import { font } from '../../utils/Responsive'
import Title from '../Title'
import { useTranslation } from "react-i18next";

const ItemProfile = ({ title, iconName, typeIcon, lang }) => {
    return (
        <View style={[styles.root, {  flexDirection : useTranslation().i18n.language === "english" ? "row" : "row-reverse" }]}>
            <Card flexDirection={ useTranslation().i18n.language === "english" ? "row" : "row-reverse" } style={styles.containerIconTitle}>
                {
                    typeIcon === 'AntDesign'
                    ?
                        <AntDesign size={font('18')} color="#4F008E" name={iconName}/>
                    :
                        <Ionicons size={font('18')} color="#4F008E" name={iconName}/>

                }
                <Title size="1.8" color="#352E3C" text={title} style={styles.titleItem}/>
            </Card>       
            <Card flexDirection={ useTranslation().i18n.language === "english" ? "row" : "row-reverse" } style={styles.containerBack}>
                {
                    useTranslation().i18n.language
                    ?
                        <Title size="1.5" color="#352E3C" text={lang} style={styles.titleLang}/>
                    :
                        null

                }
                <AntDesign size={font('18')} color="#4F008E" name={ useTranslation().i18n.language === "english" ? "right" : "left" }/>
            </Card>           
        </View>
    )
}

const styles = StyleSheet.create({
    root : {
        backgroundColor : '#F6F6F6',
        justifyContent : 'space-between',
        paddingHorizontal : '4.5%',
        paddingVertical : font('12'),
        borderRadius : font('20'),
        alignItems : 'center'
    },
    containerIconTitle  : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    titleItem : {
        paddingHorizontal : '2.5%',
    },
    titleLang : {
        color : '#999',
        paddingHorizontal : '3%'
    },
    containerBack :{
        justifyContent : 'center',
        alignItems : 'center'
    }
})

export default ItemProfile