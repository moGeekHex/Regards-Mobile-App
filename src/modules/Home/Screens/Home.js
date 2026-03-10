import React,{ useState, useRef, useEffect } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl, FlatList, StatusBar, Image, TouchableOpacity, KeyboardAvoidingView, Animated, Dimensions,Easing, Platform } from 'react-native'
import { useScrollToTop } from '@react-navigation/native';
import { HeaderHome, CategoryEgde, Card, CarouselSimple, Title, PopularProduct, PopularItem, Gifts, InputSearch, InputPhone, ProductButton, Button, Input, CardService } from '../../../components';
import { font, fontPercent, fontValue, height, width } from '../../../utils/Responsive';
import { useTranslation } from "react-i18next";
import Colors from '../../../constants/Colors';
import Modal from "react-native-modal";
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons'
import AntDesign from '@react-native-vector-icons/ant-design'
import GetLocation from 'react-native-get-location'
import Geocoder from '@timwangdev/react-native-geocoder';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { initSlider } from '../State/actions/HomeAction';
import { initCategories } from '../State/actions/CategoryAction';
import { initPopularProduct } from '../State/actions/PopularProductAction';
import { initPopularEvent } from '../State/actions/PopularEventAction';
import { getPopularSellerByHome } from '../../Search/State/action/SellerSearchAction';
import { initGift } from '../State/actions/GiftAction';
import { addFavourite, getFavourites, deleteFavourite } from '../../Likes/State/action/FavouritesProductAction';
import { getProfile } from '../../Profile/State/actions/ProfileAction';
import { checkOtp, reSendOtp, sendOtp } from '../../../store/State/actions/AuthAction';
import { addLocation } from "../../../store/State/actions/LocationAction"
import BackgroundTimer from 'react-native-background-timer';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Home = ({ navigation }) => {

    const [myFavouritesState, setMyFavouritesState] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [showListCity, setShowListCity] = React.useState(false);

    const [showOtp, setShowOtp] = useState(false);
    const [codeOtp, setCodeOtp] = useState(false);
    const [signUp, setSignUp] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleCode, setModalVisibleCode] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(120);
    const [phoneOtp, setPhoneOtp] = useState("");

    const [searchText, setSearchText] = useState(null);
    const [openSearch, setOpenSearch] = useState(null);
    const [selectedSearch, setSelectedSearch] = useState(0);

    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"


    //Redux
    const dispatch = useDispatch();

    const { sliderData } = useSelector(state=>state.home)
    const { categories, loadingCategory } = useSelector(state=>state.categories)
    const { profile, deleteProfile } = useSelector(state=>state.profile)
    const { popularProduct } = useSelector(state=>state.popularProduct)
    const { popularEvent, allEvents } = useSelector(state=>state.popularEvent)
    const { homeSeller } = useSelector(state=>state.sellersSearch)
    const { gifts } = useSelector(state=>state.gift)
    const { favourites, deleteItem, addItem } = useSelector(state=>state.favouritesProduct)
    const { status, otp, phone, resend, error } = useSelector(state=>state.auth)

    //Scroll
    const scrollUpScreen = React.useRef(null);
    useScrollToTop(scrollUpScreen);
    flatList = useRef();


    // Animating COntent...
    const contentTransition = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const welcomeOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setTimeout(() => {
            // Parallel Animation...
            Animated.parallel([
                Animated.timing(
                    contentOpacity,
                    {
                        // Scaling to 0.8
                        toValue: 1,
                        useNativeDriver: true,
                        easing: Easing.in(Easing.cubic),
                        duration : 500
                    }
                ),
                Animated.timing(
                    welcomeOpacity,
                    {
                        // Scaling to 0.8
                        toValue: 0,
                        useNativeDriver: true,
                        easing: Easing.out(Easing.circle),
                        // delay : 1000,
                        duration : 400
                    }
                ),
                Animated.timing(
                    contentTransition,
                    {
                        toValue: 0,
                        useNativeDriver: true,
                        easing: Easing.out(Easing.cubic),
                        duration : 1000
                    }
                )
            ]).start();
        }, 1000);
    }, [])

    //end animation

    const getInit = () => {
        setMyFavouritesState([]);
        dispatch(initSlider());
        dispatch(initPopularProduct());
        dispatch(getPopularSellerByHome(10));
        dispatch(initPopularEvent())
        dispatch(initGift());
        dispatch(getProfile());
        dispatch(getFavourites());
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getInit()
        dispatch(getFavourites());
        wait(250).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        getInit()
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
        })
        .then(async location => {
            const rePosition = await Geocoder.geocodePosition({
                lat: location.latitude, lng: location.longitude
            },{
                apiKey: "AIzaSyCi1BvVSk5sVhC13EFzWxq6wosNeXXQtfo",
                locale : "ar"
            });
           
            dispatch(addLocation(location?.latitude,location?.longitude,rePosition[0]?.country,rePosition[0]?.locality,rePosition[0]?.formattedAddress))
            console.log("location ", location)
            console.log("rePosition ", rePosition[0])
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
    },[])

    useEffect(() => {
        if(deleteItem || addItem)
        {
            dispatch(getFavourites());
        }
        // dispatch(initPopularProduct());
    },[deleteItem, addItem])

    useEffect(() => {
        const myFavourites = [];
        if(favourites)
        {
            favourites.map(favourite => {
                myFavourites.push(favourite.id)
            })
        }
        setMyFavouritesState(myFavourites)
    },[favourites])

    const checkAuthLike = async (id, like) => {
        if(like && profile)
        {
            await dispatch(deleteFavourite(id))
        }else if(!like && profile) {            
            await dispatch(addFavourite(id))
        }else{
            setModalVisible(true)
        }
    }

    //Login OTP

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

    useEffect(() => {
        if(secondsLeft === 0)
        {
            BackgroundTimer.stopBackgroundTimer();
        }
    },[secondsLeft]);

    useEffect(() => {
        if(status)
        {
            setModalVisibleCode(true)
        }
    },[status])

    useEffect(() => {
        if(otp)
        {
            getInit()
            setModalVisible(false)
            setModalVisibleCode(false)
            setPhoneOtp("")
            setCodeOtp("")

            // var adjustEvent = new AdjustEvent("eew8tu");
            // Adjust.trackEvent(adjustEvent);
        }
    },[otp])

    startTimer = () => {

        setSecondsLeft(120)

        BackgroundTimer.runBackgroundTimer(() => {
            setSecondsLeft((secs) => {
                if(secs > 0) return secs -1;
                else return 0
            });
        },1000);
    };

    handleReSendOtp = () => {
        dispatch(reSendOtp(phoneOtp))
   }

    const handleSendOtp = () => {
        startTimer()
        dispatch(sendOtp(phoneOtp));
    }

    const handleCheckOtp = () => {
        dispatch(checkOtp(phoneOtp, codeOtp))
    }  

    const handleEditPhone = () => {
        setModalVisibleCode(false)
    }


    let minutes = Math.floor((secondsLeft / 60));
    let seconds = Math.floor((secondsLeft % 60));

    return (
        <>
            <View style={styles.root}>
                <StatusBar
                    animated={true}
                    backgroundColor="#fff"
                    barStyle="dark-content"
                    hidden={false} 
                />  

                <Modal 
                    isVisible={showListCity}
                    onBackdropPress={() => setShowListCity(false)}
                    onSwipeComplete={() => setShowListCity(false)}
                    swipeDirection="down"
                    statusBarTranslucent
                    useNativeDriverForBackdrop={true}
                    style={{ width : width('100%'), paddingHorizontal : 0, marginHorizontal : 0, marginBottom : 0, paddingBottom : 0  }}
                >
                    <View style={styles.containerModelChangeCity}>
                        <AntDesign name="minus" size={fontValue("50")} color={Colors.standardColor}/>
                        <Card>
                            <Title size="2" fontWeight="500" text={lang === "arabic" ? "اختر المدينة" : "Select City"}/>
                        </Card>
                        <Card pushUp="2">
                            <TouchableOpacity onPress={() => { setShowListCity(false)}} style={{ alignItems : "center", flexDirection : lang === "arabic" ?  "row-reverse" : "row" , width : width("90") , borderWidth : 2, paddingHorizontal : fontValue("12"), paddingVertical : fontValue("10"), borderColor : Colors.standardColor, borderRadius : fontValue("8") }}>
                                <View style={{ width : fontValue("25"), height : fontValue("20") }}>
                                    <Image source={require("../../../assets/images/flag-400.png")} style={{ width : "100%", height : "100%" }}/>
                                </View>
                                <Title style={{ paddingHorizontal : fontValue("10") }} size="1.7" fontWeight="600" text={lang === "arabic" ? "الرياض" : "Riyadh"}/>
                            </TouchableOpacity>
                        </Card>
                    </View>
                </Modal>
                <Card pushUp="1.5" pushRight="2" pushLeft="2" pushDown="0.7">
                    <HeaderHome
                        // imageProfile={profile?.thumbnail}
                        imageProfile={profile?.thumbnail ? { uri: profile?.thumbnail } : require("../../../assets/images/ph.png")}
                        logo={ lang === "english" ? require('../../../assets/images/LogoEN.png') : require('../../../assets/images/LogoAR.png') }
                        onPressProfile={() => navigation.navigate("user",{
                            screen : "Profile",
                            initial: true
                        }) }
                        imageHowToUse={ require("../../../assets/images/HTU.png")}
                        // onPressHowToUse={() => Linking.openURL("https://www.regards.sa/ar/info")}
                        onPressHowToUse={() => navigation.navigate("HowToUse")}
                    />
                </Card>
                    <>
                    <ScrollView 
                        ref={scrollUpScreen} 
                        showsVerticalScrollIndicator={false} 
                        style={styles.screen}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        nestedScrollEnabled={true}
                        keyboardDismissMode="interactive"
                        keyboardShouldPersistTaps={
                            Platform.OS === 'ios' ? 'handled' : 'always'
                        }
                    >
                        <View style={{ flexDirection : lang === "english" ? "row" : "row-reverse", justifyContent : "space-between", alignItems : "center", paddingBottom : fontPercent("2"), paddingTop : fontPercent("0"), paddingHorizontal : "2%" }}  pushLeft="3">
                            <Card style={{ flexDirection: lang === "english" ? 'row' :'row-reverse' }}>
                                {/* <Title style={{ paddingTop : fontPercent("1") }} text={ lang === "arabic" ? "المدينة :" : "City :" } size="1.4" fontWeight="500" color={"#333"}/>     */}
                                <TouchableOpacity 
                                    activeOpacity={1}
                                    style={{ 
                                        justifyContent : "center", 
                                        alignItems : "center", 
                                        flexDirection : lang === "arabic" ? "row-reverse" : "row", 
                                        paddingTop : fontPercent("1"),
                                        marginHorizontal : "1%",
                                        justifyContent : "space-around",
                                    }}
                                    onPress={() => setShowListCity(true)}
                                >
                                    <View style={{ paddingHorizontal : fontValue('3') }}>
                                        <Title text={lang === "arabic" ? "الرياض" : "Riyadh" } size="1.4" fontWeight="500" color={Colors.standardColor}/>    
                                    </View>
                                    <SimpleLineIcons size={fontValue("10")} name={ showListCity ? "arrow-up" : "arrow-down" } color={Colors.standardColor}/>
                                </TouchableOpacity>  
                            </Card>
                            <Card widthCard="82.5%" style={{ flexDirection: lang === "english" ? 'row' :'row-reverse', alignItems: 'center' }}>
                                <InputSearch
                                    type="home"
                                    width={'100%'}
                                    inputContainerStyle={{ height : height("3.3") }}
                                    placeholder={ i18n.language === "english" ? "Search for gift" : "ابحث عن هدية ..." }
                                    handleChange={(value) => { setSearchText(value), setOpenSearch(true) }}
                                    value={searchText}
                                    leftIconName={ lang === "english" ? "search" : searchText ? "close" : null }   
                                    leftIconPress={ () => lang === "arabic" ? setSearchText(null) : searchText ? navigation.navigate('Result',{ searchText : searchText }) : null } 
                                    rightIconName={ lang === "arabic" ? "search" : searchText ? "close" : null  }    
                                    rightIconPress={ () => lang === "english" ? setSearchText(null) : searchText ? navigation.navigate('Result',{ searchText : searchText }) : null } 
                                    onSubmitEditing={() => navigation.navigate('Result',{ searchText : searchText })}
                                />
                            </Card> 
                        </View>
                        <Card pushUp="0">
                            <FlatList
                                data={categories}
                                keyExtractor={item => item.id}
                                renderItem={(event, key) => {
                                        return ( <CategoryEgde
                                            key={key}
                                            size={1.4}
                                            text={ lang === "english" ? event?.item?.nameEn : event?.item?.nameAr }
                                            source={{uri: event?.item?.thumbnail}}
                                            onPress={() => navigation.navigate('ProductByCategory',{ 
                                                    categoryID : event?.item?.id,
                                                    categoryName : lang === "english" ? event?.item?.nameEn : event?.item?.nameAr
                                            })}
                                        /> )
                                }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                snapToEnd
                                inverted={lang === "arabic" ? true : false}
                                pagingEnabled={false}
                                disableVirtualization
                                nestedScrollEnabled={true}
                            />
                        </Card>
                        <View style={{ justifyContent : "center", alignItems : "center", alignContent : "center", alignSelf : "center" }}>
                        <Animated.View style={{   
                                position : "absolute",
                                opacity : welcomeOpacity, 
                                height : "100%"                               
                        }}>
                            <View style={{   
                                width : font("85"),
                                height : font("85"),
                                alignItems : "center", 
                                justifyContent : "center", 
                            }}>
                                <Image
                                    style ={{ width: "100%", height:"100%", resizeMode : "contain", justifyContent : "center",alignItems : "center", top : "185%"}}
                                    source={require("../../../assets/images/animate/Splash_App.png")}
                                />
                            </View>
                        </Animated.View>
                        </View>

                        {
                        sliderData && popularProduct && gifts
                        ?
                            <>
                            <Animated.View style={{
                                left: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                zIndex: 0,
                                position : "relative",
                                opacity : contentOpacity
                                }}
                            >
                                <View style={{ marginTop : "3%",borderRadius : font("9") }}>
                                    <CarouselSimple data={sliderData}/> 
                                </View>

                                {
                                    allEvents ?
                                        <FlatList
                                            data={allEvents}
                                            keyExtractor={item => item.id}
                                            renderItem={({ item, key }) => (
                                                <CardService
                                                    data={item}
                                                    onPress={() => navigation.navigate('ProductByEvent',{ 
                                                        eventID : item.id,
                                                        eventName : lang === "english" ? item.nameEn : item.nameAr,
                                                        eventNameEn : item.nameEn
                                                    })}
                                                    key={key}
                                                    style={{ marginHorizontal : width("2") }}
                                                />
                                            )}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            snapToEnd
                                            inverted={lang === "arabic" ? true : false}
                                            pagingEnabled={false}
                                            nestedScrollEnabled={true}
                                            disableVirtualization
                                            style={{ marginTop : "5%" }}
                                        />
                                    :
                                        null
                                }

                                <Card pushUp="2" pushDown="1" flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushRight="2.5" pushLeft="2.5">
                                    <Title size="2" fontWeight="500" text={t('homeTitlePopularWeek')}/>
                                </Card>
                                <FlatList
                                    data={popularProduct}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item, key }) => (
                                        <PopularProduct
                                            data={item}
                                            onPress={() => navigation.navigate('Product',{
                                                screen : "Product",
                                                params : {
                                                    id : item.id
                                                }
                                            })}
                                            key={key}
                                            onPressLike={() =>  checkAuthLike(item.id, myFavouritesState.includes(item.id))}
                                            like={ profile ? myFavouritesState.includes(item.id) : null}
                                            likeCount={item?.likes ? item?.likes  :  item?.likes }
                                            style={{ marginHorizontal : width("2") }}
                                        />
                                    )}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    snapToEnd
                                    inverted={lang === "arabic" ? true : false}
                                    pagingEnabled={false}
                                    nestedScrollEnabled={true}
                                    disableVirtualization
                                />

                                <Card pushUp="2" widthCard="100%" flexDirection={i18n.language === "english" ? "row" : "row-reverse" } pushDown="1" pushRight="2.5" pushLeft="2.5">
                                    <View style={{ justifyContent : "space-between", alignItems : "center", flexDirection : i18n.language === "english" ? "row" : "row-reverse", width : "100%" }}>
                                        <Title size="2" fontWeight="500" text={t('searchTitlePopularCategories')}/>
                                        <TouchableOpacity 
                                            style={{ alignItems : "center", justifyContent : "center" }} 
                                            onPress={() => navigation.navigate("Search",{
                                                screen : 'Search',
                                                params : {
                                                    idSelector : 0
                                                }
                                            })}
                                        >
                                            <Title size="1.4" fontWeight="500" color={Colors.standardColor} text={i18n.language === "english" ? "Show All" : "مشاهدة المزيد"}/>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                                <FlatList
                                    data={categories}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item, key }) => (
                                        <PopularItem 
                                            source={{uri: item?.thumbnail}} 
                                            text={ lang === "english"? item.nameEn : item.nameAr}
                                            onPress={() => navigation.navigate('ProductByCategory',{ 
                                                categoryID : item.id,
                                                categoryName : lang === "english" ? item.nameEn : item.nameAr
                                            })}
                                            key={key}

                                        />
                                    )}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    snapToEnd
                                    inverted={lang === "arabic" ? true : false}
                                    pagingEnabled={false}
                                    nestedScrollEnabled={true}
                                    disableVirtualization
                                />
                                <Card pushUp="2" widthCard="100%" flexDirection={i18n.language === "english" ? "row" : "row-reverse" } pushDown="1" pushRight="2.5" pushLeft="2.5">
                                    <View style={{ justifyContent : "space-between", alignItems : "center", flexDirection : i18n.language === "english" ? "row" : "row-reverse", width : "100%" }}>
                                        <Title size="2" fontWeight="500" text={t('searchTitlePopularSeller')}/>
                                        <TouchableOpacity 
                                            style={{ alignItems : "center", justifyContent : "center" }} 
                                            onPress={() => navigation.navigate("Search",{
                                                screen : 'Search',
                                                params : {
                                                    idSelector : 2
                                                }
                                            })}
                                        >
                                            <Title size="1.4" fontWeight="500" color={Colors.standardColor} text={i18n.language === "english" ? "Show All" : "مشاهدة المزيد"}/>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                                <FlatList
                                    data={homeSeller}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item, key }) => (
                                        <PopularItem 
                                            source={{uri: item?.thumbnail}} 
                                            key={key}
                                            text={ lang === "english"? item.S_nameEn : item.S_nameAr}
                                            onPress={() => navigation.navigate('ProductBySeller',{ 
                                                sellerID : item.id,
                                                itemName : lang === "english" ? item.S_nameEn : item.S_nameAr
                                            })}
                                        />
                                    )}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    snapToEnd
                                    inverted={lang === "arabic" ? true : false}
                                    pagingEnabled={false}
                                    nestedScrollEnabled={true}
                                    disableVirtualization
                                />
                                <Card pushUp="2" flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushDown="1" pushRight="2.5" pushLeft="2.5">
                                    <Title 
                                        size="2" 
                                        fontWeight="500" 
                                        text={t("homegift")}
                                    />
                                </Card>
                                <View style={styles.containerGifts(lang)}> 
                                    {
                                        gifts 
                                        ?
                                            gifts.map((gift, key) => {
                                                return (
                                                    <Gifts 
                                                        key={key}
                                                        onPress={() => navigation.navigate('ResultHome', {giftId : gift.id, giftName : lang === "english" ? gift.nameEn : gift.nameAr })}
                                                        source={{ uri : gift?.thumbnail }} 
                                                    />
                                                )
                                            })
                                        :
                                            null
                                    }
                                </View>   
                            </Animated.View>
                        
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
                                                            <Title text="Verification code has been SENT to this number" size="1.7" fontWeight="400"/>
                                                            <Card pushUp="1" flexDirection="row">
                                                                    <Title text={`+966${phoneOtp ? phoneOtp : phone ? phone : ''}`}  size="1.7" fontWeight="400"/>
                                                            </Card>
                                                        </>
                                                    :
                                                        <>
                                                            <Card flexDirection="row-reverse">
                                                                    <Title text="تم إرسال رمز التحقق الى الرقم" size="1.7" fontWeight="400"/>
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
                                                        // resend
                                                        // ?
                                                        //     <>
                                                        //         <Title text={ lang === "english" ? "Resend Code" : "تم اعادة ارسال رمز التأكيد" } size="1.7" color="#000" fontWeight="600"/>
                                                        //         {/* <Title text={ lang === "arabic" ? ` ${secondsLeft} ثانية ` : null } size="1.7" color="#000" fontWeight="600"/> */}
                                                        //     </>
                                                        secondsLeft === 0 ?
                                                            <Button 
                                                                type="text"     
                                                                handlePress={() =>  { handleReSendOtp(), startTimer() }}
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
                                                        disabled={codeOtp.length === 4 ? false : true}
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
                            </>
                            :
                                null
                            // <Animated.View style={{    
                            //     justifyContent : "center",
                            //     alignItems : "center",
                            //     opacity : 1,
                            //     height : height("100"),
                            //     width : width("100"),
                            //     bottom : "20%"
                            // }}>
                            //     <Image
                            //         style ={{ width: "100%", height:"100%", resizeMode : "contain", justifyContent : "center",alignItems : "center", alignContent : "center"}}
                            //         source={require("../../../assets/images/animate/Splash_App.png")}
                            //     />
                            // </Animated.View>
                            // <AwesomeLoading indicatorId={7} size={50} isActive={true} text="loading" />
                    }
                    </ScrollView>
                </>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    root : {
        flex : 1,
        marginBottom : Platform.OS === "ios" ? height("8") : height("6"),
        marginTop : height(".3"),
        backgroundColor : Colors.backgroundColor,
    }, 
    screen : {
        paddingBottom : Platform.OS === "ios" ? '9%' : "5%",
        backgroundColor : Colors.backgroundColor,

    },
    containerGifts : (lang) => ({
        flexDirection : lang === "english" ? "row" : "row-reverse",
        flexWrap : 'wrap',
        justifyContent : 'space-around',
        alignItems : 'center',
        paddingHorizontal : '1%',
        marginBottom : "5%"
    }),
    containerAddQuantity : {
        position : 'absolute',
        backgroundColor : '#fff',
        width : '95%',
        height : font('80'),
        zIndex : 99999,
        bottom : '100%',
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
        top : '80%',
        height : fontValue('300'),
        zIndex : 999999,
        width : '100%', 
        backgroundColor : '#fff', 
        alignItems : 'center',
        borderTopEndRadius : font('18'),
        borderTopStartRadius : font('18'),
        paddingVertical : '5%',
    },
    statusBarStyle : {
        color : "#000"
    },
    containerModelChangeCity : {
        top : '10%',
        height : "90%",
        zIndex : 999999,
        width : '100%', 
        backgroundColor : '#fff', 
        alignItems : 'center',
        borderTopEndRadius : font('18'),
        borderTopStartRadius : font('18'),
        // paddingVertical : '5%',
    }
})

export default Home
