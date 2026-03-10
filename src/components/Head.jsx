import React from 'react'
import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native'
import { useTranslation } from "react-i18next";
import { font, width, height, fontValue } from '../utils/Responsive';
import AntDesign from '@react-native-vector-icons/ant-design'
import Colors from '../constants/Colors'
import Title from './Title';

const Head = ({ title , handlePress, handlePressEnd, endIconName, endIconSize = 0, endIconColor, style, userRole }) => {
    const { t, i18n } = useTranslation();
    const moreDot = title ? title.length > 31 ? '...' : '' : 0; 
    return (
        <View style={[styles.root,{ flexDirection: i18n.language === "english" ? 'row' : 'row-reverse' },style]}>
            <TouchableOpacity style={styles.containerArrowWidth(i18n.language)} onPress={handlePress}>
                <AntDesign name={ i18n.language === "english" ? "left" : "right" } size={font('18')} color={Colors.standardColor} />
            </TouchableOpacity>
            <Title 
                size="1.8" 
                fontWeight="500" 
                textAlign="center"
                text={ title ?  title.substring(0, 31).replace(/(\r\n|\n|\r)/gm, " ") + moreDot: null}
            />
            {

                    <TouchableOpacity style={styles.containerIconWidth(i18n.language)}>
                        <AntDesign onPress={handlePressEnd} name={endIconName} size={font(endIconSize)} color={endIconColor} />
                    </TouchableOpacity>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        paddingBottom: height('0.5'),
        justifyContent: 'space-between',
        alignItems: 'center',
        width : '100%',
        height : "100%",
        ...Platform.select({
            ios : {
                paddingTop: height('6'),
                height : fontValue('65'),
            },
            android : {
                paddingTop: height('0'),
                height : fontValue('50'),
            }
        })
    },
    containerArrowWidth : (lang) => ({
        width : '20%',
        height : "100%",
        justifyContent : 'center',
        alignItems : lang === "arabic" ? 'flex-end' : 'flex-start',
        paddingHorizontal : font("10"),
    }),
    containerIconWidth : (lang) => ({
        width : '20%',
        height : "100%",
        justifyContent : 'center',
        alignItems : lang === "arabic" ? 'flex-start' : 'flex-end',
        paddingHorizontal : font("10"),
        // backgroundColor : "#777"
    })
})

export default Head