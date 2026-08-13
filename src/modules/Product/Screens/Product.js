import React,{ useState, useEffect, useCallback, useRef } from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Animated, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import { Head, SliderImage, Card, ProductButton, DetailsCard, Quantity, Hr, Title, QuantityInput, Input, InputPhone, Button, ButtonGroup } from '../../../components';
import { font, fontValue, height, width } from '../../../utils/Responsive'
import Colors from '../../../constants/Colors'
import { useTranslation } from "react-i18next";
import AwesomeLoading from 'react-native-awesome-loading';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../State/actions/ProductAction';
import { checkOtp, reSendOtp, sendOtp } from '../../../store/State/actions/AuthAction';
import { addFavourite, getFavourites, deleteFavourite } from '../../Likes/State/action/FavouritesProductAction';
import { getProfile } from '../../Profile/State/actions/ProfileAction';
import { appEvents } from '../../../events/appEvents';
import BackgroundTimer from 'react-native-background-timer';
import SimpleLineIcons from '@react-native-vector-icons/simple-line-icons'
//Snapchat CAPI
import { snapchatViewContentEvent, snapchatStartCheckoutEvent } from '../../../events/snapchatEvents';

const Product = ({ route, navigation }) => {

    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    //Redux
    const dispatch = useDispatch();
    const { product, loadingData } = useSelector(state=>state.product)
    const { favourites, deleteItem, addItem } = useSelector(state=>state.favouritesProduct)
    const { profile } = useSelector(state=>state.profile)
     const { status, otp, phone, resend } = useSelector(state=>state.auth)
    
    const [myFavouritesState, setMyFavouritesState] = useState([]);
    const [selection, setSelection] = useState(0);

    const [showQuantity, setShowQuantity] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [productDetails, setProductDetails] = useState(null);

    //OTP
    const [showOtp, setShowOtp] = useState(false);
    const [codeOtp, setCodeOtp] = useState(false);
    const [signUp, setSignUp] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleCode, setModalVisibleCode] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(120);
    const [phoneOtp, setPhoneOtp] = useState("");

    const getInit = () => {
        if(route.params?.id)
        {
            dispatch(getProductById(route.params?.id));
        }
    }
    

    useEffect(() => {
        getInit()
    },[route.params?.id])  

    useEffect(() => {
        setProductDetails(product)
        if(product && product.id) {
             try {
                  appEvents({
                       eventName: "view_item",
                       payload: {
                            currency: "SAR",
                            value: product.price,
                            items: [{
                                 item_id: product.id,
                                 item_name: product.nameEn || product.nameAr || "unknown",
                                 price: product.price
                            }]
                       }
                  });
             } catch(e) {}

             snapchatViewContentEvent({
                  itemId: product.id,
                  price: product.price,
                  currency: "SAR"
             });
        }
    },[product])


    const updateSelectedDetails = selected => {
        setSelection(selected)
    }

    const checkAuth = async () => {

        try {
            const user = await AsyncStorage.getItem('user')
            if(user)
            {
                try {
                     appEvents({
                          eventName: "begin_checkout",
                          payload: {
                               currency: "SAR",
                               value: product.price * quantity,
                               items: [{
                                    item_id: product.id,
                                    item_name: product.nameEn || product.nameAr || "unknown",
                                    price: product.price,
                                    quantity: quantity
                               }]
                          }
                     });
                } catch(e) {}

                // Snapchat START_CHECKOUT. No ADD_CART here: the app goes
                // straight from product to payment, so emitting both on the
                // same tap would collapse the funnel into one instant.
                snapchatStartCheckoutEvent({
                     itemId: product.id,
                     price: product.price * quantity,
                     currency: "SAR",
                     numberOfItems: quantity
                });

                navigation.push('Payment',{ 
                    screen : "Payment",
                    params : {
                        productName : lang === "english" ? product.nameEn : product.nameAr , 
                        productId : route.params?.id ,
                        quantity : quantity, 
                        price : product.price, 
                        vat : product.vat,
                        sku : product.sku
                    }                
                });
            }else{
                setModalVisible(true)
            }
        } catch(e) {
        }
    }

    const checkAuthLike = async (id, like) => {
        if(like && profile)
        {
            productDetails.likes--
            favourites.pop()
            setMyFavouritesState(favourites)
            await dispatch(deleteFavourite(id))

            try {
                 appEvents({
                      eventName: "remove_from_wishlist",
                      payload: {
                           currency: "SAR",
                           value: product.price,
                           items: [{ item_id: product.id, item_name: product.nameEn || product.nameAr || "unknown", price: product.price }]
                      }
                 });
            } catch(e) {}
        }else if(!like && profile) { 
            productDetails.likes++
            const myFavourites = [];
            myFavourites.push(product.id)
            setMyFavouritesState(myFavourites)

            await dispatch(addFavourite(id))

            try {
                 appEvents({
                      eventName: "add_to_wishlist",
                      payload: {
                           currency: "SAR",
                           value: product.price,
                           items: [{ item_id: product.id, item_name: product.nameEn || product.nameAr || "unknown", price: product.price }]
                      }
                 });
            } catch(e) {}
        }else{
            setModalVisible(true)
        }
    }

    handleFavourites = useCallback(() => {
        const myFavourites = [];
        if(favourites)
        {
            favourites.map(favourite => {
                myFavourites.push(favourite.id)
            })
        }
        setMyFavouritesState(myFavourites)
    })

    useEffect(() => {
        handleFavourites()
    },[])

    const QuantityScroll = useCallback(() => {

        var output=[];
        for (i = 1; i <= 6; i++) {
            var item = (
                <QuantityInput 
                    id={i}
                    title={i}
                    style={{ borderColor : quantity === i ? Colors.standardColor : '#eee' }}
                    onSubmit={(title) => { setQuantity(title), setShowQuantity(false) }}
                />
            )
            output[i] = (item);
        }
        return (
            <>
                {output}
            </>
        )
    },[])   
    
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
            dispatch(getProfile())            
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

    const Header_Max_Height = 150;
    const Header_Min_Height = 0;
    const Scroll_Distance = Header_Max_Height - Header_Min_Height;

    const scrollOffsetY = useRef(new Animated.Value(0)).current;
    const DynamicHeader = ({value}) => {
        const animatedHeaderHeight = value.interpolate({
            inputRange: [200, 500],
            outputRange: [Header_Min_Height, Header_Max_Height],
            extrapolate: 'extend',
        });

        const animatedHeaderColor = value.interpolate({
            inputRange: [0, Scroll_Distance],
            outputRange: ['#fff', '#fff'],
            extrapolate: 'extend',
        });

        return (
            <Animated.View
                style={[
                    styles.header,
                    {
                    opacity: animatedHeaderHeight ,
                    height : animatedHeaderHeight,
                    maxHeight : font("70"),
                    minHeight : 0,
                    backgroundColor: animatedHeaderColor,
                    justifyContent : "flex-end",
                    alignItems : "center",
                    width : "100%",
                
                    },
                ]}
            >
                  {/* <Title 
                        style={styles.titleDetails(lang)} 
                        fontWeight="400" size="1.8" 
                        text={ lang === "english" ? product?.nameEn : product?.nameAr }
                    /> */}
            </Animated.View>
        );
    };

    return (
        <>
            <StatusBar hidden/>
            <View style={styles.root}>
                <DynamicHeader value={scrollOffsetY} />
                <TouchableOpacity onPress={() => navigation.goBack() } style={styles.containerback(lang)}>
                    <SimpleLineIcons 
                        name={ lang === "arabic" ? 'arrow-right' : "arrow-left" } 
                        size={font("15")} 
                        color={Colors.standardColor}
                        style={{
                            left : lang === "arabic" ? font("1") : null,
                            right : lang === "english" ? font("1") : null
                        }}
                    />
                </TouchableOpacity>
                {
                    // productDetails.length === 1
                    productDetails 
                    ?
                        <>
                            {/* <Head 
                                title={ i18n.language === "english" ? product?.nameEn : product?.nameAr }
                                handlePress={() => navigation.goBack()}
                            /> */}
                            <ScrollView 
                                scrollEventThrottle={5}
                                showsVerticalScrollIndicator={false}
                                onScroll={Animated.event(
                                    [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
                                    {
                                        useNativeDriver: false,
                                    },
                                )}
                                style={styles.screen}
                            >

                                <Card>
                                {
                                    product?.photos
                                    ?
                                        <SliderImage 
                                            data={[{ thumbnail : product?.thumbnail},...product?.photos]}
                                            category={product.categories[0]}
                                            logo={product.vendor.thumbnail}
                                        />
                                    :
                                        null
                                }
                                </Card>
                                <Card pushUp="0" pushDown="2" pushRight="2.5" pushLeft="2.5">
                                    <DetailsCard 
                                        data={productDetails}
                                        like={ profile ? myFavouritesState.includes(product?.id) : null}
                                        onPressLike={() => checkAuthLike(product?.id, myFavouritesState.includes(product.id))}
                                        handlerPressProvider={() => navigation.push('ProviderScreen',{
                                
                                                sellerID : product?.vendor?.id,
                                                sellerName : lang === "english" ? product?.vendor?.S_nameEn : product?.vendor?.S_nameAr
                                        
                                        })}
                                    />
                                    <Card pushUp="1">
                                        <ButtonGroup
                                            buttons={[t('productOverview'),t('productAdditionalDetails')]}
                                            onPress={updateSelectedDetails}
                                            selectedIndex={selection}
                                            key={[1,2]}
                                        />
                                    </Card>
                                    <Card pushDown="0">
                                        <Hr />
                                    </Card>
                                </Card>
                                <Card pushDown="4"> 
                                {
                                    selection == 0
                                    ?
                                        <Card pushDown="2" pushRight="2.5" pushLeft="2.5">
                                            <Title 
                                                size="1.6" 
                                                // lineHeight={30}
                                                fontWeight="300" 
                                                // letterSpacingText={.5}
                                                style={ lang === "arabic" ? { textAlign : 'right' } : null }
                                                text={ lang === "english" ? product?.overViewEn : product?.overViewAr}
                                            />
                                        </Card>
                                    : selection == 1
                                    ?           
                                        <Card pushDown="2" pushRight="2.5" pushLeft="2.5">
                                            <Title 
                                                size="1.6" 
                                                lineHeight={30}
                                                fontWeight="300" 
                                                // letterSpacingText={.5}
                                                style={ lang === "arabic" ? { textAlign : 'right' } : null }
                                                text={ lang === "english" ? product?.additionalDetailsEn : product?.additionalDetailsAr}
                                            />
                                        </Card>     
                                    :
                                        null
                                }
                                </Card>
                            </ScrollView>
                            
                            <Card style={styles.containerQuantityFixed}>
                                {
                                    showQuantity 
                                    ?
                                        // <Card pushUp="1" style={styles.containerAddQuantity}>
                                        <>
                                            {/* <Card style={styles.containerAddQuantity} pushDown="2" pushLeft="2" flexDirection={lang === "english" ? "row" : "row-reverse"}>
                                                <Title size="1.7" fontWeight="500" text={t('productQuantity')}/>
                                            </Card> */}
                                            <ScrollView  
                                                horizontal={true}
                                                style={{ transform: lang === "arabic" ? [{ scaleX: -1 }] : [{ scaleX: 1 }], paddingHorizontal : "2.7%" }}
                                                showsHorizontalScrollIndicator={false}  
                                                contentContainerStyle={{ flexGrow: 1, paddingTop : 10 }}
                                            >  
                                                {QuantityScroll()}
                                            </ScrollView>
                                        </>
                                        // </Card>
                                    :
                                        null
                                }
                                <Card pushUp=".5" flexDirection={lang === "english" ? "row" : "row-reverse"} style={styles.containerQuantity}>
                                    {/* <Quantity title={t('productQTY')} qun={quantity} handlePress={() => setShowQuantity(!showQuantity)}/> */}
                                    <ProductButton 
                                        title={  product?.stockCount >= quantity ? t('productPurchaseGift') : t('outOfStock') } 
                                        handlePress={() => { checkAuth() }}
                                        disabled={ product?.stockCount >= quantity ? false : true }                          
                                    />
                                </Card>
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
                                                        <Button 
                                                                type="text" 
                                                                title="EDIT PHONENUMBER" 
                                                                titleWeight="500"
                                                                handlePress={() => handleEditPhone()}
                                                        />
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
                        <AwesomeLoading indicatorId={7} size={50} isActive={true} text="loading" />
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    root : {
        flex : 1,
        // paddingTop : height("0.8"),
        paddingBottom: height("6"),
        backgroundColor : Colors.backgroundColor,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        paddingTop: 0,  
    },
    titleDetails : (lang) => ({
        justifyContent : "flex-end",
        shadowColor: "#000",
        shadowOffset: {
             width: 0,
             height: 5,
        },
        shadowOpacity: 0.8,
        shadowRadius: 10.00,

        elevation: 24,
    }),
    containerback: (lang) => ({
        width : width(9),
        height : width(9),
        position : "absolute",
        right : lang === "arabic" ? "2%" :  null,
        left : lang === "english" ? "2%" : null,
        top : "6%",
        zIndex : 999,
        backgroundColor : "#fff",
        borderRadius : 200,
        justifyContent : "center",
        alignItems : "center",
        alignContent: 'center',

    }),
    containerQuantityFixed : {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#fff',
        zIndex : 999999,
        width : '100%',
        // paddingBottom : '2.5%',
    },
    containerViewPhoto: {
        paddingHorizontal: '4%',
        width: '100%',
        height: font('230'),
    },
    viewPhoto: {
        borderRadius: font('10'),
        width: '100%',
        height: '100%',
    },
    containerQuantity : {
        justifyContent : 'space-between',
        width : '92%',
        paddingTop : font('10'),
        paddingBottom : "5%",
        backgroundColor : "#fff",
        position : 'relative',
    }, 
    containerAddQuantity : {
        position : 'absolute',
        backgroundColor : '#fff',
        width : '95%',
        height : font('30'),
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
    containerQuantityInput : {
        marginHorizontal : '7%'
    }
})

export default Product