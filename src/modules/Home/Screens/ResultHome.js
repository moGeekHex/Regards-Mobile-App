import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, TouchableOpacity,FlatList, Button as ButtonRn, ActivityIndicator } from 'react-native'
import { useScrollToTop } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, PopularProduct, InputSearch, InputPhone, ProductButton, Button, Input  } from '../../../components';
import Colors from '../../../constants/Colors';
import { height, font, width, fontValue, fontPercent } from '../../../utils/Responsive';
import IconAntDesign from '@react-native-vector-icons/ant-design'
import { useTranslation } from "react-i18next";
import AntDesign from '@react-native-vector-icons/ant-design'
import AwesomeLoading from 'react-native-awesome-loading';
import Modal from "react-native-modal";
import BackgroundTimer from 'react-native-background-timer';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { checkOtp, reSendOtp, sendOtp } from '../../../store/State/actions/AuthAction';
import { getGiftProduct, getGiftProductByFilter } from '../State/actions/GiftSearchAction';
import { addFavourite, getFavourites, deleteFavourite } from '../../Likes/State/action/FavouritesProductAction';
import { getProfile } from '../../Profile/State/actions/ProfileAction';
// import { getProfile } from '../../Profile/State/actions/ProfileAction';

const ResultHome = ({ route ,navigation }) => {

    //Redux
    const dispatch = useDispatch();

    const { favourites, deleteItem, addItem } = useSelector(state=>state.favouritesProduct)
    const { giftProducts, giftProductsByFilter, loadingData, moreLoading , isListEnd } = useSelector(state=>state.giftSearch)
    const { profile } = useSelector(state=>state.profile)
    const { status, otp, phone, resend, error } = useSelector(state=>state.auth)

    //OTP
    const [showOtp, setShowOtp] = useState(false);
    const [codeOtp, setCodeOtp] = useState(false);
    const [signUp, setSignUp] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleCode, setModalVisibleCode] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(120);
    const [phoneOtp, setPhoneOtp] = useState("");
    const [page, setPage] = useState(1);

    //params
    const search = route.params.search;
    const giftId = route.params.giftId;
    const giftName = route.params.giftName;
    const minPriceFilter = route.params.minPriceFilter;
    const maxPriceFilter = route.params.maxPriceFilter;
    //Scroll
    const scrollUpScreen = React.useRef(null);
    useScrollToTop(scrollUpScreen);

    //lang
    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    const [searchText, setSearchText] = useState(search);
    const [openSearch, setOpenSearch] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [sort, setSort] = useState(false);
    const [myFavouritesState, setMyFavouritesState] = useState([]);
    const [giftProductsDetails, setGiftProductsDetails] = useState(null);
    const [giftProductsByFilterDetails, setGiftProductsByFilterDetails] = useState(null);

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

    // const checkAuthLike = async (id, like) => {
    //     if(like && profile)
    //     {
    //         giftProducts.likes--
    //         const myFavourites = myFavouritesState;
    //         const index = myFavourites.indexOf(id);
    //         if (index > -1) { // only splice array when item is found
    //             myFavourites.splice(index, 1); // 2nd parameter means remove one item only
    //         }

    //         setMyFavouritesState(myFavourites)
    //         await dispatch(deleteFavourite(id))

    //     }else if(!like && profile) { 
    //         giftProducts.likes++
    //         const myFavourites = myFavouritesState;
    //         myFavourites.push(id)

    //         setMyFavouritesState(myFavourites)
    //         await dispatch(addFavourite(id))
    //     }else{
    //         setModalVisible(true)
    //     }
    // }

    const getInit = () => {
        dispatch(getProfile());
        dispatch(getFavourites());
        dispatch(getGiftProduct( giftId, page ));
        setMyFavouritesState([]);
    }

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

    useEffect(() => {
        if(deleteItem || addItem)
        {
            dispatch(getFavourites());
        }
        // dispatch(initPopularProduct());
    },[deleteItem, addItem])

    const onPressSearch = () => {
        if(searchText)
        {
            dispatch(getGiftProductByFilter(searchText, minPriceFilter, maxPriceFilter, lang, sort ))
        }
    }

    const handleGetGiftProduct = () => {
        if(giftId) 
        {
            dispatch(getGiftProduct( giftId, page ));
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


  const searchFilterFunction = () => {
    // Check if searched text is not blank
    if (searchText) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = giftProducts.filter(
        function (item) {
            const itemDataAr = item.nameAr ? item.nameAr.toUpperCase() : ''.toUpperCase();
            const itemDataEn = item.nameAr ? item.nameEn.toUpperCase() : ''.toUpperCase();
            // const itemDataTagAr = item.nameAr ? item.tags.nameAr.toUpperCase() : ''.toUpperCase();
            // const itemDataTagEn = item.nameAr ? item.tags.nameEn.toUpperCase() : ''.toUpperCase();
            const textData = searchText.toUpperCase();

            if(lang === "english"){
                return itemDataEn.indexOf(textData) > -1 ;
            }else{
                return itemDataAr.indexOf(textData) > -1 ; 
            }
      });
      setGiftProductsDetails(newData);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setGiftProductsDetails(giftProducts)
    }
  };

  const reomveFilter = () => {
    setGiftProductsDetails(giftProducts);
    setSearchText(null)
  }

    useEffect(() => {
        handleGetGiftProduct()
    },[giftId, page])

    useEffect(() => {
        setGiftProductsDetails(giftProducts)
    },[giftProducts])

    useEffect(() => {
        setGiftProductsByFilterDetails(giftProductsByFilter)
    },[giftProductsByFilter])

    useEffect(() => {
        onPressSearch()
    },[sort])

    const onEndReached = () => {
        if(!isListEnd){
            setPage(page + 1)
        }
    }

    const renderEmpty = () => (
        <View style={styles.containerEmpty}>
            <Title text={ lang === "english" ? "No Data at the moment" : "لا يوجود بيانات بالوقت الحالي"} size={1.5}/>
            <ButtonRn onPress={() => handleGetGiftProduct()} title={ lang === "english" ? "Refresh" : "تحديث" } size="large"/>
        </View>
    )

    const renderFooter = () => (
        <View style={styles.containerEmpty}>
            { moreLoading &&  <ActivityIndicator/> }
            { isListEnd &&  <Title text={ lang === "english" ? "No More" : ""} size={1.5}/>}
        </View>
    )

    return (
        <View style={styles.root}>
            {
            loadingData ?

                <AwesomeLoading indicatorId={7} size={50} isActive={true} text="loading" />

            :
                <>
                <Card pushUp={ Platform.OS === "ios" ? "6" : "1"} flexDirection={ lang === "english" ? 'row' : "row-reverse"}  pushDown="1" style={styles.containerHead}>
                    <View style={{ width : '22.5%',  alignItems : lang === "english" ? 'flex-start' : 'flex-end' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.containerIconBack(lang)}>
                            <AntDesign color={Colors.standardColor} name={ lang === "english" ? "left" : "right" } size={font('18')}/>
                        </TouchableOpacity>
                    </View>
                    <Title size="1.8" fontWeight="500" text={ giftName }/>

                    <Card style={styles.containerIcons(lang)} flexDirection={ lang === "english" ? 'row' : "row-reverse"}>
                        <TouchableOpacity onPress={() => setSort(!sort)} disabled={true}>
                            {/* <Icon style={styles.iocn(lang)} name='sort' size={font('20')} /> */}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            disabled={true}
                           onPress={() => navigation.navigate('Filter',{ 
                                selectedMinPriceFilter : minPriceFilter,
                                selectedMaxPriceFilter : maxPriceFilter,
                                itemName : itemName,
                                sellerID : sellerID,
                                categoryID : categoryID,
                                eventID : eventID
                           })}
                        >
                            <IconAntDesign style={styles.iocn(lang)} name='filter' size={font('20')}/>
                        </TouchableOpacity>
                    </Card>
                </Card>
                <View style={styles.containerPopularProducts}>

                    <FlatList
                        data={giftProductsDetails}
                        keyExtractor={item => item.id}
                        renderItem={({ item, key }) => (
                            <PopularProduct
                                data={item}
                                large
                                onPress={() => navigation.navigate('Product', {
                                    screen : "Product",
                                    params : {
                                        id : item.id
                                    }
                                })}   
                                key={key}   
                                auth={profile}       
                                like={ profile ? myFavouritesState.includes(item.id) : null}
                                onPressLike={() => checkAuthLike(item.id, myFavouritesState.includes(item.id))}
                                likeCount={item?.likes ? item?.likes  :  item?.likes }
                            />
                        )}
                        style={{ marginBottom : fontPercent("10") }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        ListEmptyComponent={ loadingData ? renderEmpty : null}
                        ListFooterComponent={renderFooter}
                        numColumns={2}
                        columnWrapperStyle={{ flexDirection : "row-reverse" }}
                   />

                    {/* <FlatList
                        data={giftProductsByFilter}
                        keyExtractor={item => item.id}
                        renderItem={({ item, key }) => (
                            <PopularProduct
                                data={item}
                                large
                                onPress={() => navigation.navigate('Product', {
                                    screen : "Product",
                                    params : {
                                        id : item.id
                                    }
                                })}  
                                key={key}      
                                auth={profile}        
                                onPressLike={() => checkAuthLike(item.id, myFavouritesState.includes(item.id))}
                                like={ profile ? myFavouritesState.includes(item.id) : null}
                            />

                        )}
                        style={{ marginBottom : fontPercent("10") }}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                    /> */}
                </View>
                
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
                                                // resend
                                                // ?
                                                //     <>
                                                //         <Title text={ lang === "english" ? "Resend Code" : "تم اعادة ارسال رمز التأكيد" } size="1.7" color="#000" fontWeight="600"/>
                                                //         {/* <Title text={ lang === "arabic" ? ` ${secondsLeft} ثانية ` : null } size="1.7" color="#000" fontWeight="600"/> */}
                                                //     </>
                                                // :   
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
            }
        </View>
    )
}

const styles = StyleSheet.create({
     root: {
          backgroundColor: Colors.backgroundColor,
          marginBottom : height("8"),
          flex: 1,
     },

    containerPopularProducts : {
        justifyContent : "space-between",
        paddingHorizontal : "2%",
    },
    containerIconBack : (lang) => ({
        width : '70%',
        justifyContent : 'center',
        alignItems : lang === "english" ? 'flex-start' : 'flex-end',
        paddingHorizontal : '15%',
        bottom : font('2.5'),
        // backgroundColor :  '#999'
   }),
   containerIcons : (lang) => ({
        width : '22.5%',
        justifyContent : 'center',
        alignItems : 'center',
        alignSelf : 'center',
        bottom : font('2.5'),
        // backgroundColor :  '#999'
    }),
    containerHead : {
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    iocn: (lang) => ({
        color : "#fff",
        // color: Colors.standardColor,
        paddingRight: lang === "english" ? font('10') : null,
        paddingLeft: lang === "arabic" ? font('10') : null,
        top: font('4')
    }),
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
    flatList: {
        flexDirection: 'column-reverse',
    },
    containerEmpty : {
        justifyContent : "center",
        alignItems : "center"
    }
})

export default ResultHome