import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Linking, Image, Platform } from 'react-native'
import { Head, Card, ImageProfile, ItemProfile, ProductButton, Title, InputPhone, Hr, Button, Input, UniversalImage  } from '../../../components';
import { font, width, height, fontValue, fontPercent } from '../../../utils/Responsive';
import { useTranslation } from "react-i18next";
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import BackgroundTimer from 'react-native-background-timer';
import Colors from '../../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Icon
import Icon from "react-native-vector-icons/FontAwesome"
import Ionicons from '@react-native-vector-icons/ionicons'
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from '../State/actions/ProfileImageAction';
import { getProfile, clearProfile } from '../State/actions/ProfileAction';
import { sendOtp, checkOtp, reSendOtp, logoutAction } from '../../../store/State/actions/AuthAction';
import { cleanUpLoginCorporate } from '../../Auth/State/actions/AuthCorporateAction';
import { clearWallet, getMyWallet } from "../../../store/State/actions/MyWalletAction"
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }) => {

    //Redux init
    const dispatch = useDispatch();
    const { imageUpdate } = useSelector(state=>state.updateImage)
    const { profile, deleteProfile } = useSelector(state=>state.profile)
    const { status, otp, phone, resend, error } = useSelector(state=>state.auth)
    const { myWallet } = useSelector(state=>state.myWallet)

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleCode, setModalVisibleCode] = useState(false);
    const [myProfile, setMyProfile] = useState();
    const [secondsLeft, setSecondsLeft] = useState(120);
    const [userRole, setUserRole] = useState(null);
    const [codeOtp, setCodeOtp] = useState(false);

    //phone number otp
    const [phoneOtp, setPhoneOtp] = useState("");

    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    const insets = useSafeAreaInsets();

    useEffect(() => {
        if(imageUpdate)
        {
            dispatch(getProfile())
        }
    },[imageUpdate])

    useEffect(() => {
        setMyProfile(profile)
    },[profile, deleteProfile])

    useEffect(() => {
        if(otp)
        {
            setModalVisible(false)
            setModalVisibleCode(false)
            setPhoneOtp("")
            setCodeOtp("")
        }
    },[otp])

    useEffect(() => {
        if(status)
        {
            setModalVisibleCode(true)
        }
    },[status])

    useEffect(() => {
        if(profile)
        {
            _handleGetUser()
            dispatch(getMyWallet())
        }
    },[]);

    const imagePicker = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            multiple: false,
            compressImageQuality : .5,
            mediaType : "photo"
        }).then(image => {
            dispatch(uploadImage(image))
        });
    }

    const _handleGetUser = async () => {
        try {
            const user = await AsyncStorage.getItem('user')
            const userParse = JSON.parse(user)
            if(userParse)
                await setUserRole(userParse?.user?.role)
        } catch(e) {
        }
    }

    const handleLogout = async () => {
        try {
            AsyncStorage.removeItem('user').then(() => {
                dispatch(clearProfile())
                dispatch(logoutAction())
                dispatch(clearWallet())
                dispatch(cleanUpLoginCorporate())
            })
        } catch (e) {
    
        }
    }

    const checkAuth = async () => {
        try {
            const user = await AsyncStorage.getItem('user')
            if(user)
            {
                return navigation.navigate('EditProfile');
            }else { 
                setModalVisible(true)
                // if(secondsLeft !== 0){
                //     setModalVisible(true)
                //     dispatch(logoutAction())
                //     setModalVisibleCode(false)
                //}
            }
        } catch(e) {
        }
    }

    const handleSendOtp = () => {
        startTimer()
        dispatch(sendOtp(phoneOtp));
    }

    const handleCheckOtp = () => {
        dispatch(checkOtp(phoneOtp, codeOtp))
    }  

    const handleReSendOtp = () => {
        startTimer()
        dispatch(reSendOtp(phoneOtp))
    }

    const handleEditPhone = () => {
        setModalVisibleCode(false)
    }

    useEffect(() => {
        if(secondsLeft === 0)
        {
            BackgroundTimer.stopBackgroundTimer();
        }
    },[secondsLeft]);

    startTimer = () => {

        BackgroundTimer.setInterval(() => {
            setSecondsLeft((secs) => {
                if(secs > 0) return secs -1;
                else return 0
            });
        },1000);
    };

    const _handleNumberPhone = (number) => {  
        const filterDecode = (str) => {
            return str = str.replace(/[\u202d-\uF8FF\u202c]/g, '');
        }

        var
        persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
        arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
        fixNumbers = function(str)
        {
             if(typeof str === 'string'){
                  for(var i=0; i<10; i++)
                  {
                       str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
                  }
             }
             return str;
        };

        const decodeNumber = filterDecode(number);
        const replaceNumber = Platform.OS === "ios" ? fixNumbers(decodeNumber).replaceAll(' ', '') : fixNumbers(decodeNumber)
        if(replaceNumber.startsWith("+966"))
        {    
             return replaceNumber.toString().substring(4);
        }else if(replaceNumber.startsWith("05")) {
             return replaceNumber.toString().substring(1);
        }else if(replaceNumber.startsWith("00966")){
             return replaceNumber.toString().substring(5);
        }

        return replaceNumber.replace(/[^0-9]/g, '');
   }

    const callPhone = () => {
        // Linking.openURL(`tel:${920016692}`)
        phonecall(920016692,true)
    }

    const phonecall = function(phoneNumber, prompt) {
    
            let url;
    
            if(Platform.OS !== 'android') {
                url = prompt ? 'telprompt:' : 'tel:';
            }
            else {
                url = 'tel:';
            }
    
            url += phoneNumber;
    
            LaunchURL(url);
    }

    const LaunchURL = function(url) {
        Linking.canOpenURL(url).then(supported => {
            if(!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                Linking.openURL(url)
                .catch(err => {
                    if(url.includes('telprompt')) {
                        // telprompt was cancelled and Linking openURL method sees this as an error
                        // it is not a true error so ignore it to prevent apps crashing
                        // see https://github.com/anarchicknight/react-native-communications/issues/39
                    } else {
                        console.warn('openURL error', err)
                    }
                });
            }
        }).catch(err => console.warn('An unexpected error happened', err));
    };

    return (
        <View style={styles.root}>
            <ScrollView 
                style={styles.screen} 
                contentContainerStyle={{ paddingBottom: insets.bottom }} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={
                    Platform.OS === 'ios' ? 'handled' : 'always'
                }
            >
                {
                    userRole === "company"
                    ?
                        <Card pushUp="7" pushDown="4">
                            <View style={styles.containerImageProfileUpload}>
                                <ImageProfile styleProfile={{ width : "100%", height : fontValue("140") }} styleImage={{borderRadius : 0, resizeMode : "contain" }} source={profile?.thumbnail ? { uri: profile?.thumbnail } : require("../../../assets/images/ph.png")} />
                            </View>
                        </Card>
                    :

                        <Card pushUp="8">
                            <View style={styles.containerImageProfileUpload}>
                                <ImageProfile styleImage={{ resizeMode : "cover" }} source={profile?.thumbnail ? { uri: profile?.thumbnail } : require("../../../assets/images/ph.png")} />
                            </View>
                        </Card>
                }

                {/* <View style={styles.containerImageProfileUpload}>
                         <ImageProfile
                              source={ myProfile?.thumbnail ? { uri : myProfile.thumbnail } : require('../../../assets/images/ph.png') }
                         />
                         {
                              myProfile && userRole === "client"
                              ? 
                                   <TouchableOpacity style={styles.containerUploadImage} onPress={() => imagePicker()}>
                                        <SimpleLineIcons name="camera" color="#222" size={font('17')}/>
                                   </TouchableOpacity>
                              :
                                   null
                         }
                </View> */}
                {
                    userRole === "company"
                    ?
                        null
                    :
                        <Card pushUp="4.5" style={styles.center} pushDown="3">
                            {
                                myProfile 
                                ?
                                    <Title text={ myProfile?.firstName || myProfile?.lastName ? `${ myProfile?.firstName } ${ myProfile ?.lastName }` : ""} fontWeight="500" size={2} color="#352E3C"/>
                                :
                                    <Button
                                        type="text"
                                        title={t('cardModelContinueLogin')}
                                        handlePress={() => checkAuth()}
                                    />
                            }
                        </Card>
                }
                { 
                    myWallet?.map((wallet, key) => {
                        return (    
                            <Card pushUp="1" key={key}>
                                <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.containerWallet}>
                                    <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "center", alignItems : "center" }}>
                                        <Ionicons name="wallet" size={fontValue("20")} color="#fff"/>
                                        <Title style={{ paddingHorizontal : fontValue("5") }} color="#fff" size="1.6" fontWeight="600" text={ lang === "english" ? wallet?.type == "PRIVATE" ? "Wallet Balance" : "Wallet Corporate" : wallet?.type == "PRIVATE" ? "رصيد المحفظة" : "رصيد محفظة الشركات"}/>
                                    </View>
                                    <View style={{ justifyContent : "center", alignItems : "center",flexDirection : "row-reverse" }}>
                                        <Title color="#fff" style={{ paddingHorizontal : fontValue("2") }} size="1.8" fontWeight="600" text={ lang === "english" ? wallet ? `${wallet?.amount?.toLocaleString("en",{ minimumFractionDigits: 0,maximumFractionDigits: 2 })}` : `0 ` : myWallet ? `${wallet?.amount?.toLocaleString("en",{ minimumFractionDigits: 0,maximumFractionDigits: 2 })}` : `0` }/>
                                        <UniversalImage
                                            source={require('../../../assets/images/sarblack.svg').default} 
                                            style={styles.sarStyle} 
                                        />
                                    </View>
                                </Card>
                            </Card>
                        )
                    })
                }
                <Card pushUp="1">
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile') }>
                        {
                            userRole === "company" || !myProfile
                            ?
                                null
                            :
                                    <ItemProfile 
                                        title={t('EditProfile')}
                                        iconName="user"
                                        typeIcon="AntDesign"
                                    />
                        }
                    </TouchableOpacity>
                </Card>
                {
                    myProfile
                    ?
                        <Card pushUp="1">
                            <TouchableOpacity onPress={() => navigation.navigate('History') }>
                                <ItemProfile 
                                    title={t("itemOrder")}
                                    iconName="newspaper-outline"
                                />
                            </TouchableOpacity>
                        </Card>
                    :
                        null
                }
                <Card pushUp="1">
                    <TouchableOpacity onPress={() => navigation.navigate('Language') }>
                        <ItemProfile 
                            title={ useTranslation().i18n.language === "english" ? "Language" : "اللغة" }
                            iconName="language" 
                            lang={ useTranslation().i18n.language === "english" ?  "English" : "العربية"}
                        />
                    </TouchableOpacity>        
                </Card>
                <Card pushUp="1">
                    <TouchableOpacity onPress={() => navigation.navigate('TermsAndConditions') }>
                        <ItemProfile 
                            title={ useTranslation().i18n.language === "english" ? "Terms And Conditions" : "الشروط و الأحكام" }
                            iconName="reader-outline" 
                        />
                    </TouchableOpacity>
                </Card>
                <Card pushUp="1">
                    <TouchableOpacity onPress={() => navigation.navigate('Privacy') }>
                        <ItemProfile 
                            title={ useTranslation().i18n.language === "english" ? "Privacy Policy" : "سياسة الخصوصية" }
                            iconName="shield-half-outline" 
                        />
                    </TouchableOpacity>
                </Card>
                <Card pushUp="1">
                    <TouchableOpacity onPress={() => callPhone() }>
                        <ItemProfile 
                            title={ useTranslation().i18n.language === "english" ? "Call Us" : "اتصل بنا" }
                            iconName="phone" 
                            typeIcon="AntDesign"
                        />
                    </TouchableOpacity>
                </Card>

                <Card pushUp="2.5" flexDirection="row" style={{ alignItems : "center", justifyContent : "center" }}>
                    <TouchableOpacity 
                        style={{ justifyContent : "center", alignItems : "center", paddingHorizontal : "2%", width : font("29"), height : font("29") }} 
                        onPress={() => Linking.openURL("https://wa.me/966920016692") }
                    >
                        <Image source={require("../../../assets/images/social/whatsapp.png")} style={{ width : "100%", height : "100%", resizeMode : "contain" }} color="#25D366"/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={{ justifyContent : "center", alignItems : "center", width : font("32"), height : font("32")  }} 
                        onPress={() => Linking.openURL("https://twitter.com/regards_sa") }
                    >
                        <Image source={require("../../../assets/images/social/twitter-x.png")} style={{ width : "100%", height : "100%", resizeMode : "contain" }} color="#25D366"/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={{ justifyContent : "center", alignItems : "center", paddingHorizontal : "2%", width : font("27"), height : font("27")  }} 
                        onPress={() => Linking.openURL("https://www.tiktok.com/@regards_sa") }
                    >
                        <Image source={require("../../../assets/images/social/tiktok.png")} style={{ width : "100%", height : "100%", resizeMode : "contain" }} color="#25D366"/>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={{ justifyContent : "center", alignItems : "center", paddingHorizontal : "2%", width : font("29"), height : font("29")  }} 
                        onPress={() => Linking.openURL("https://instagram.com/regards_sa") }
                    >
                        <Image source={require("../../../assets/images/social/insta.png")} style={{ width : "100%", height : "100%", resizeMode : "contain" }} color="#25D366"/>
                    </TouchableOpacity>
                </Card>

                <View>
                    {
                        myProfile
                        ?
                            <Card style={{ justifyContent :  'center', alignItems : 'center' }} pushUp="3">      
                                <TouchableOpacity onPress={() => handleLogout()}>
                                    <Title size="1.4" color="#352E3C" text={ lang === "english" ? "Sign out" : "تسجيل الخروج" }/>
                                </TouchableOpacity> 
                            </Card>
                        :
                            null
                    }
                </View>
                
                <Card pushUp="2">
                    <Hr/>
                </Card>
                <Card pushUp="2"style={{ justifyContent : "center", alignItems : "center" }}>
                    <Title size="1.3" fontWeight="300" color="#352E3C" text="MADE WITH ♥️ IN 🇸🇦"/>
                </Card>  
                <Card pushUp=".5"style={{ justifyContent : "center", alignItems : "center" }}>
                    <Title size="1.3" fontWeight="300" color="#352E3C" text="Version 1.18.4"/>
                </Card>            
                
                <Modal 
                    isVisible={isModalVisible}
                    onBackdropPress={() => setModalVisible(false)}
                    onSwipeComplete={() => setModalVisible(false)}
                    swipeDirection="down"
                    statusBarTranslucent
                    keyboardShouldPersistTaps={"always"}
                    style={{ width : width('100%'), paddingHorizontal : 0, marginHorizontal : 0, marginBottom : 0, paddingBottom : 0  }}
                >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "position" : "position"}
                            keyboardVerticalOffset={Platform.OS === "ios" ? font('200') : fontValue('200')}
                            
                        >
                        {
                            isModalVisibleCode 
                            ?
                                        <View style={styles.containerModelPin}>
                                            {
                                            lang === "english" 
                                            ?
                                                  <>
                                                       <Title text="VERIFICATION CODE HAS BEEN SENT TO" size="1.7" fontWeight="400"/>
                                                       <Card pushUp="1" flexDirection="row">
                                                            <Title text={`+966${phoneOtp ? phoneOtp : phone ? phone : ''}`}  size="1.7" fontWeight="400"/>
                                                       </Card>
                                                  </>
                                            :
                                                  <>
                                                       <Card flexDirection="row-reverse">
                                                            <Title text="تم ارسال رمز التحقق الي" size="1.7" fontWeight="400"/>
                                                            <Title text={`+966${phoneOtp ? phoneOtp : phone ? phone : ''}`} size="1.7" fontWeight="600" style={{ paddingHorizontal : '1%' }}/>
                                                       </Card>
                                                  </>
                                            }
                                            <Card pushUp="2" style={{ width : "100%", alignItems : "center" }}>
                                                <Title text={t('enterCode')} size="1.65" fontWeight="300"/>
                                                <Card pushUp="1" style={{ width : "90%", alignItems : "center" }}>
                                                    <Input 
                                                        placeholder={ lang === "english" ? "OTP CODE" : "رمز التفعيل" }
                                                        keyboardType="numeric"
                                                        autoFocus={true}
                                                        value={codeOtp}
                                                        handleChange={value  => { 
                                                                const number = _handleNumberPhone(value)
                                                                if (number.length <= 4) {
                                                                    setCodeOtp(number)
                                                                }
                                                        }}
                                                        textContentType="oneTimeCode"
                                                    />
                                                </Card>
                                            </Card>
                                             
                                             <Card pushUp="2" flexDirection={ lang === "english" ? "row" : "row-reverse"}>
                                             <Title text={ lang === "english" ? ` ${secondsLeft} sec ` : null } size="1.7" fontWeight="600"/>

                                            {
                                                secondsLeft === 0 ?
                                                    <Button 
                                                        type="text"     
                                                        handlePress={() =>  { handleReSendOtp() }}
                                                        titleWeight={ lang === "english" ? "500" : "700" }
                                                        title={ lang === "english" ? "Resend Code" : `أعد ارسال رمز التأكيد` } 
                                                    />
                                                :
                                                    <>
                                                        <Title text={ lang === "arabic" ? ` ${secondsLeft} ثانية ` : null } size="1.7" color="#000" fontWeight="600"/>
                                                    </>
                                             }
                                             </Card>
                                             <Card pushUp="5">
                                             <ProductButton 
                                                  title={t('cardModelContinueLogin')}
                                                  handlePress={() => { handleCheckOtp() }}
                                                  width={width('90%')}
                                             />
                                             </Card>
                                        </View>
                            :
                                   <View style={styles.containerModel}>
                                        <Title text={t('cardModelContainueShopping')} size="1.65" fontWeight="400"/>
                                        <Card pushUp="4">
                                             <Title text={t('phoneNumber')} size="1.65" fontWeight="300"/>
                                        </Card>
                                        <Card pushUp="2" style={{ width : "90%", alignItems : "center" }}>
                                            <InputPhone
                                                handleChange={value  => { 
                                                    const number = _handleNumberPhone(value)
                                                    if (number.length <= 9) {
                                                            setPhoneOtp(number)
                                                    }
                                                }}
                                                value={phoneOtp}
                                            />
                                        </Card>
                                        {
                                            phoneOtp?.length === 0 || phoneOtp?.startsWith("5") && phoneOtp?.length <= 9 
                                            ?
                                                null
                                            :
                                                <Card pushUp="2">
                                                    <Title 
                                                            text={lang === "english" ? "Invalid Phone Number" : "رقم الهاتف غير صحيح!"} 
                                                            size={1.3}
                                                            color="#ff0033"
                                                    />
                                                </Card>
                                        }
                                        <Card pushUp="4">
                                            <ProductButton 
                                                title={t('cardModelContinueLogin')}
                                                handlePress={() => { handleSendOtp() }}
                                                width={width('90%')}
                                                disabled={phoneOtp.startsWith("5") && phoneOtp.length === 9 ? false : true}
                                            />
                                        </Card>
                                   </View>
                         }
                         </KeyboardAvoidingView>
                </Modal>

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
        marginBottom : '18%'
        // alignItems : 'center'   
    },
    containerImageProfileUpload : {
        position : 'relative',
        alignItems : 'center',
        // width : "100%"
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
        top : '70%',
        right : '32%'
    },
    containerWallet : {
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingTop : fontValue("12"),
        paddingBottom : fontValue("12"),
        paddingLeft : fontValue("10"),
        paddingRight : fontValue("10"),
        backgroundColor : Colors.standardColor,
        borderRadius : font("20")
    },
    containerModel : {
        top : '75%',
        height : fontValue('300'),
        zIndex : 999999,
        width : '100%', 
        backgroundColor : '#fff', 
        alignItems : 'center',
        borderTopEndRadius : font('18'),
        borderTopStartRadius : font('18'),
        paddingVertical : '5%',
    },
    containerModelPin : {
        top : '71%',
        height : fontValue('300'),
        zIndex : 999999,
        width : '100%', 
        backgroundColor : '#fff', 
        alignItems : 'center',
        borderTopEndRadius : font('18'),
        borderTopStartRadius : font('18'),
        paddingVertical : '5%',
    },
    sarStyle : {
        width : font("11"), 
        height : font("11"), 
   }
})

export default Profile
