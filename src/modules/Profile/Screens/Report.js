import React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { Head, Card, Title, Input, ItemHistory, ButtonApp } from '../../../components';
import SelectDropdown from 'react-native-select-dropdown'
import Entypo from 'react-native-vector-icons/Entypo'
import { font, height } from '../../../utils/Responsive';
import Colors from '../../../constants/Colors';
import { useTranslation } from "react-i18next";

const Report = ({ route, navigation}) => {

    const countriesEn = ["Financial Issue","Technical Issue","Admin Issue","Others"]
    const countriesAr = ["اخرى", "مشكلة إدارية", "مشكلة تقنية", "مشكلة مالية"]

    const { t, i18n } = useTranslation();
    const lang = i18n.language

    return (
        <View style={styles.root}>
            <Head 
                handlePress={() => navigation.goBack()}
                handlePressEnd={() => navigation.navigate('EditProfile') }
                title={ lang === "english" ? "Report Order" : "ابلاغ عن مشكلة" }
            />
            <ScrollView  style={styles.screen} showsVerticalScrollIndicator={false}>
                <Card pushUp="3">
                        <Title 
                            style={styles.center} 
                            text={ lang === "english" ? "Email" : "البريد الالكتروني" }
                            size="1.7" 
                            color="#3D3644"
                        />
                </Card>   
                <Card pushUp="1">                      
                        <Input placeholder={ lang === "english" ? "Email" : "البريد الالكتروني" }/>
                </Card>
                <Card pushUp="6">
                        <Title 
                            style={styles.center} 
                            text={ lang === "english" ? "What is the issue about?" : "ماهو موضوع المشكلة" }
                            size="1.7" 
                            color="#3D3644"
                        />
                </Card>
                <Card pushUp="1">
                <SelectDropdown
                    defaultButtonText={ lang === "english" ? "Select" : "اختار" }
                    data={lang === "english" ? countriesEn : countriesAr}
                    onSelect={(selectedItem, index) => {
                    }}
                    buttonTextStyle={{ fontSize : font('12') }}
                    buttonStyle={{ backgroundColor : '#eee', width : '100%',borderRadius : font('18'), height : height('6') }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    renderDropdownIcon={() => {
                        return (
                            <Entypo 
                                name="chevron-thin-down" 
                                style={{ position : 'absolute', left : lang === "english" ? '10%' : null, right : lang === "arabic" ? '10%' : null }} 
                                color={Colors.standardColor} size={font('16')} 
                            />
                        );
                      }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                />
                </Card>
                <Card pushUp="2.5">
                        <Title style={styles.center} text={ lang === "english" ? "Message" : "رسالة" } size="1.7" color="#3D3644"/>
                </Card>  
                <Card pushUp="1" pushDown="17"  style={styles.center}>
                    <Input
                        placeholder={ lang === "english" ? "Enter Message" : "أدخل رسالتك" }
                        multiline={true}
                        heightInput="20"
                    />
                </Card>
                <Card pushUp="2">
                        <Title style={styles.center} text={ lang === "english" ? "The order" : "الطلب" } size="1.7" color="#3D3644"/>
                </Card>   
                <Card pushUp="1">
                    <ItemHistory
                        reportOrder
                        data={route.params?.order}
                    />
                </Card>
                <Card pushUp="3.5" pushDown="5">
                        <ButtonApp 
                            title={ lang === "english" ? "SUBMIT" : "إرسال" }
                            onPress={ () => { 
                                setSuccessOrder(true) 
                                successOrder ? navigation.navigate('Thanks')  : null
                            }}
                        />
                </Card>
            </ScrollView>

        </View>
    )
}
const styles = StyleSheet.create({
    root : {
        flex : 1,
        backgroundColor : '#fff',
    },
    screen : {
        paddingHorizontal : '5%',
        // alignItems : 'center'   
    },
    containerImageProfileUpload : {
        paddingTop : '10%',
        position : 'relative',
        alignItems : 'center' 
    },
    center : {
        alignItems : 'center' ,
        textAlign : 'center' 
    },
    containerUploadImage : {
        backgroundColor : '#F5F6F9',
        justifyContent : 'center',
        alignItems : 'center',
        width : font('35'),
        height : font('35'),
        borderRadius : font('40'),
        borderWidth: 2,
        borderColor : '#fff',
        position : 'absolute',
        top : '100%',
        right : '32%'
    },
    containerMultiInput : {
        justifyContent : 'space-between'
    },
    hafeInput : {
        width : '49%',
        justifyContent : 'center',
        alignItems : 'center'
    },
})

export default Report