import React,{ useEffect, useRef, useState } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { Card, PopularProduct, Title, ProductButton, InputPhone, InputSearch, Button, CardPhone  } from '../../../components';
import Colors from '../../../constants/Colors';
import { height, fontPercent, width, font, fontValue } from '../../../utils/Responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import BackgroundTimer from 'react-native-background-timer';
import AwesomeLoading from 'react-native-awesome-loading';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getProductsByEvent } from '../../Search/State/action/ProductByEventAction'
import { getProductsByCategories } from '../../Search/State/action/ProductByCategoryAction';
import { getProductsBySeller } from '../../Search/State/action/ProductBySellerAction';
import { sendOtp, checkOtp, reSendOtp } from '../../../store/State/actions/AuthAction';
import { addFavourite, getFavourites, deleteFavourite } from '../../Likes/State/action/FavouritesProductAction';
import { getProfile } from '../../Profile/State/actions/ProfileAction';
const Deawer = ({ route, navigation }) => {

     const scrollCategoriesRef = useRef();
     const scrollToEnd = () => scrollRef.current.scrollToEnd({ animated: false });

     const { t, i18n } = useTranslation();
     const lang = i18n.language;

     const [isModalVisible, setModalVisible] = useState(false);
     const [isModalVisibleCode, setModalVisibleCode] = useState(false);
     const [myFavouritesState, setMyFavouritesState] = useState([]);
     const [timeLeft, setTimeLeft] = useState(40);
     const [sort, setSort] = useState(false);
     const [secondsLeft, setSecondsLeft] = useState(60);

     //search
     const [searchText, setSearchText] = useState('');
     const [openSearch, setOpenSearch] = useState(null);

     //state check loadig
     const [productsBySellerDetails, setProductsBySellerDetails] = useState(null);
     const [productsByCategoryDetails, setProductsByCategoryDetails] = useState(null);
     const [productsByEventDetails, setProductsByEventDetails] = useState(null);

     //params event 
     const eventID = route?.params?.eventID;
     const eventName = route?.params?.eventName;
     
     //params category
     const categoryID = route?.params?.categoryID;
     const categoryName = route?.params?.categoryName;

     //params seller
     const sellerID = route?.params?.sellerID;
     const sellerName = route?.params?.sellerName;

     const minPriceFilter = route?.params?.minPriceFilter;
     const maxPriceFilter = route?.params?.maxPriceFilter; 

     const itemName = eventName ?  eventName : categoryName ? categoryName : sellerName ? sellerName : route?.params?.itemName;;
     const itemID = eventID ?  eventID : categoryID ? categoryID : sellerID ? sellerID : null;

     //Redux
     const dispatch = useDispatch();
     const { productsBySeller } = useSelector(state=>state.productBySeller)
     const { productsByCategory } = useSelector(state=>state.productByCategory)
     const { productsByEvent } = useSelector(state=>state.productByEvent)
     const { status, otp, phone, resend } = useSelector(state=>state.auth)
     const { favourites, deleteItem, addItem } = useSelector(state=>state.favouritesProduct)
     const { profile } = useSelector(state=>state.profile)

     const handleGetProductByFilter = () => {
          if(route.params?.eventID)
          {
               dispatch(getProductsByEvent(route.params?.eventID, minPriceFilter, maxPriceFilter, sort ));
          }

          if(route.params?.categoryID)
          {
               dispatch(getProductsByCategories(route.params?.categoryID, minPriceFilter, maxPriceFilter, sort ));
          }

          if(route.params?.sellerID)
          {
               dispatch(getProductsBySeller(route.params?.sellerID, minPriceFilter, maxPriceFilter, sort ));
          }
     }

      //phone number otp
    const [phoneOtp, setPhoneOtp] = useState(phone);

    //pin code
    const [pin1, setPin1] = useState("");
    const [pin2, setPin2] = useState("");
    const [pin3, setPin3] = useState("");
    const [pin4, setPin4] = useState("");
    const [pin5, setPin5] = useState("");
    const [pin6, setPin6] = useState("");

    const pin1Ref =  useRef(null);
    const pin2Ref =  useRef(null);
    const pin3Ref =  useRef(null);
    const pin4Ref =  useRef(null);
    const pin5Ref =  useRef(null);
    const pin6Ref =  useRef(null);

    const handleSendOtp = () => {
        dispatch(sendOtp(phoneOtp));
    }

     handleReSendOtp = () => {
          dispatch(reSendOtp(phoneOtp))
     }

     const handleCheckOtp = () => {

          const code = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;

          dispatch(checkOtp(phoneOtp, code))
     }

     const checkAuthLike = (id, like) => {
          try {
               const user = AsyncStorage.getItem('user')
               if(user)
               {
                    if(like && profile)
                    {
                         dispatch(deleteFavourite(id))
                    }else if(!like && profile) {            
                         dispatch(addFavourite(id))
                    }else { 
                         setModalVisible(true)
                         setModalVisibleCode(false)
                         setPin1(false)
                         setPin2(false)
                         setPin3(false)
                         setPin4(false)
                         setPin5(false)
                         setPin6(false)
                    }
               }else { 
                    setModalVisible(true)
                    setModalVisibleCode(false)
                    setPin1(false)
                    setPin2(false)
                    setPin3(false)
                    setPin4(false)
                    setPin5(false)
                    setPin6(false)
               }
          } catch(e) {
          }
     }

     const searchFilterFunction = () => {
          // Check if searched text is not blank
          // productsBySellerDetails
          // productsByCategoryDetails
          // productsByEventDetails
          if(categoryID)
          {
               if (searchText) {
                    // Inserted text is not blank
                    // Filter the masterDataSource
                    // Update FilteredDataSource
                    const newData = productsByCategoryDetails.filter(
                         function (item) {
                              const itemData = item.nameAr ? item.nameAr.toUpperCase() : ''.toUpperCase();
                              const textData = searchText.toUpperCase();
                              return itemData.indexOf(textData) > -1;
                         }
                    );
                    setProductsByCategoryDetails(newData);
               } else {
                    // Inserted text is blank
                    // Update FilteredDataSource with masterDataSource
                    setProductsByCategoryDetails(productsByCategory)
               }
          }else if(eventID)
          {
               if (searchText) {
                    // Inserted text is not blank
                    // Filter the masterDataSource
                    // Update FilteredDataSource
                    const newData = productsByEvent.filter(
                         function (item) {
                              const itemData = item.nameAr ? item.nameAr.toUpperCase() : ''.toUpperCase();
                              const textData = searchText.toUpperCase();
                              return itemData.indexOf(textData) > -1;
                         }
                    );
                    setProductsByEventDetails(newData);
               } else {
                    // Inserted text is blank
                    // Update FilteredDataSource with masterDataSource
                    setProductsByEventDetails(productsByEvent)
               }
          }else if(sellerID)
          {
               if (searchText) {
                    // Inserted text is not blank
                    // Filter the masterDataSource
                    // Update FilteredDataSource
                    const newData = productsBySeller.filter(
                         function (item) {
                              const itemData = item.nameAr ? item.nameAr.toUpperCase() : ''.toUpperCase();
                              const textData = searchText.toUpperCase();
                              return itemData.indexOf(textData) > -1;
                         }
                    );
                    setProductsBySellerDetails(newData);
               } else {
                    // Inserted text is blank
                    // Update FilteredDataSource with masterDataSource
                    setProductsBySellerDetails(productsBySeller)
               }
          }
     };

     const reomveFilter = () => {
          setProductsByCategoryDetails(productsByCategory);
          setSearchText(null)
     }

     const getInit = () => {
          dispatch(getProfile());
          setMyFavouritesState([]);
     }

     const getInitFavourites = () => {
          dispatch(getFavourites());
     }

     // useEffect(() => {
     //      getInitFavourites();
     //      if(route.params?.eventID)
     //      {
     //           dispatch(getProductsByEvent(route.params?.eventID, minPriceFilter, maxPriceFilter, sort ));
     //      }

     //      if(route.params?.categoryID)
     //      {
     //           dispatch(getProductsByCategories(route.params?.categoryID, minPriceFilter, maxPriceFilter, sort ));
     //      }

     //      if(route.params?.sellerID)
     //      {
     //           dispatch(getProductsBySeller(route.params?.sellerID, minPriceFilter, maxPriceFilter, sort ));
     //      }

     // },[deleteItem, addItem, otp, profile])

     // useEffect(() => {
     //      getInit()
     // },[otp])

     // useEffect(() => {
     //      if(profile)
     //      {
     //           getInitFavourites();            
     //      }
     // },[profile])

     // useEffect(() => {
     //      const myFavourites = [];
     //      if(favourites)
     //      {
     //           favourites.map(favourite => {
     //                myFavourites.push(favourite.id)
     //           })
     //      }
     //      setMyFavouritesState(myFavourites)
     // },[favourites])


     // useEffect(() => {
     //      if(otp)
     //      {
     //           setModalVisible(false)
     //      }
     // },[otp])

     // useEffect(() => {
     //      if(status)
     //      {
     //           setModalVisibleCode(true)
     //      }
     // },[status])

     const handleEditPhone = () => {
          setModalVisibleCode(false)
     }

     // useEffect(() => {
     //      handleGetProductByFilter()
     // },[minPriceFilter,maxPriceFilter])

     useEffect(() => {
          handleGetProductByFilter()
     },[route.params?.eventID,route.params?.categoryID,route.params?.sellerID])

     useEffect(() => {
          setProductsBySellerDetails(productsBySeller)
     },[productsBySeller])

     useEffect(() => {
          setProductsByCategoryDetails(productsByCategory)
     },[productsByCategory])

     useEffect(() => {
          setProductsByEventDetails(productsByEvent)
     },[productsByEvent])

     //  useEffect(() => {
     //      if(secondsLeft === 0)
     //      {
     //          BackgroundTimer.stopBackgroundTimer();
     //      }
     //  },[secondsLeft]);
  
     // startTimer = () => {

     //      setSecondsLeft(60)

     //      BackgroundTimer.runBackgroundTimer(() => {
     //           setSecondsLeft((secs) => {
     //                if(secs > 0) return secs -1;
     //                else return 0
     //           });
     //      },1000);
     // };

    return (
          <View style={styles.root}>
               <View style={styles.screen}>
                    {
                         productsBySellerDetails && sellerID || productsByCategoryDetails && categoryID || productsByEventDetails && eventID
                         ?
                              <>
                                   <Card pushUp={ Platform.OS === "ios" ? "6" : "1" } flexDirection={ lang === "english" ? 'row' : "row-reverse"}  pushDown="2" style={styles.containerHead}>
                                        <View style={{ width : '22.5%',  alignItems : lang === "english" ? 'flex-start' : 'flex-end' }}>
                                             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.containerIconBack(lang)}>
                                                  <AntDesign color={Colors.standardColor} name={ lang === "english" ? "left" : "right" } size={font('18')}/>
                                             </TouchableOpacity>
                                        </View>
                                        <Title size="1.8" fontWeight="500" text={ itemName }/>

                                        <Card style={styles.containerIcons(lang)} flexDirection={ lang === "english" ? 'row' : "row-reverse"}>
                                             <TouchableOpacity onPress={() => setSort(!sort)} disabled={true}>
                                                  <Icon style={styles.iocn(lang)} name='sort' size={font('20')} />
                                             </TouchableOpacity>
                                             <TouchableOpacity 
                                                  disabled={true}
                                                  onPress={() => navigation.navigate('FilterSearch',{ 
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
                                   {/* <Card pushDown="3" style={{ flexDirection: lang === "english" ? 'row' :'row-reverse', alignItems: 'center' }}>
                                        <InputSearch
                                             width={'100%'}
                                             placeholder={ i18n.language === "english" ? `Search in ${itemName}`  : `البحث في ${itemName}` }
                                             handleChange={(value) => { setSearchText(value), setOpenSearch(true) }}
                                             value={searchText}
                                             leftIconName={ lang === "english" ? "search1" : "close" }   
                                             leftIconPress={ () => lang === "arabic" ? reomveFilter() : searchFilterFunction() } 
                                             rightIconName={ lang === "arabic" ? "search1" : "close" }    
                                             rightIconPress={ () => lang === "english" ? reomveFilter() : searchFilterFunction() } 
                                             onSubmitEditing={() => searchFilterFunction()}
                                        />
                                   </Card> */}
                                   <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={styles.containerPopularProducts(lang)}>

                                             {
                                                  sellerID && productsBySeller
                                                  ?
                                                       productsBySellerDetails.map((productBySeller) => {
                                                            return (
                                                                 <PopularProduct 
                                                                      large 
                                                                      data={productBySeller}
                                                                      // text={ lang === "english" ? productByEvent.nameEn : productByEvent.nameAr }
                                                                      source={{ url : productBySeller.thumbnail }}
                                                                      onPress={ () => navigation.navigate('Product',{
                                                                           screen : "Product",
                                                                           params : {
                                                                                id : productBySeller.id
                                                                           }
                                                                      })}  
                                                                      onPressLike={() => checkAuthLike(productBySeller.id, myFavouritesState.includes(productBySeller.id))}
                                                                      like={ profile ? myFavouritesState.includes(productBySeller.id) : null}
                                                                 />
                                                            )
                                                       })
                                                  : 
                                                  categoryID && productsByCategory
                                                  ?
                                                       productsByCategoryDetails.map((productByCategory) => {
                                                            return (
                                                                 <PopularProduct 
                                                                      large 
                                                                      data={productByCategory}
                                                                      // text={ lang === "english" ? productByEvent.nameEn : productByEvent.nameAr }
                                                                      source={{ url : productByCategory.thumbnail }}
                                                                      onPress={ () => navigation.navigate('Product',{
                                                                           screen : "Product",
                                                                           params : {
                                                                                id : productByCategory.id
                                                                           }
                                                                      })}  
                                                                      onPressLike={() => checkAuthLike(productByCategory.id, myFavouritesState.includes(productByCategory.id))}
                                                                      like={ profile ? myFavouritesState.includes(productByCategory.id) : null}
                                                                 />
                                                            )
                                                       })
                                                  :
                                                  eventID && productsByEvent
                                                  ?
                                                       productsByEventDetails.map((productByEvent) => {
                                                            return (
                                                                 <PopularProduct 
                                                                      large 
                                                                      data={productByEvent}
                                                                      // text={ lang === "english" ? productByEvent.nameEn : productByEvent.nameAr }
                                                                      source={{ url : productByEvent.thumbnail }}
                                                                      onPress={ () => navigation.navigate('Product',{
                                                                           screen : "Product",
                                                                           params : {
                                                                                id : productByEvent.id
                                                                           }
                                                                      })}  
                                                                      onPressLike={() => checkAuthLike(productByEvent.id, myFavouritesState.includes(productByEvent.id))}
                                                                      like={ profile ? myFavouritesState.includes(productByEvent.id) : null}
                                                                 />
                                                            )
                                                       })
                                                  :
                                                       null

                                             }

                                        </View>
                                        
                                   </ScrollView>
                              </>
                         :
                         <AwesomeLoading indicatorId={7} size={50} isActive={true} text="loading" />
                    }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : Colors.backgroundColor,
     }, 
     screen : {
     },
     containerPopularProducts : (lang) => ({
          paddingTop : '4.5%',
          flexWrap : 'wrap',
          flexDirection : lang === "english" ? 'row' : "row-reverse",
          justifyContent : "space-between",
          paddingHorizontal : "2%",
          marginBottom :  height("18"),
     }),
     containerHead : {
          justifyContent : 'space-between',
          alignItems : 'center'
     },
     containerIcons : (lang) => ({
          width : '22.5%',
          justifyContent : 'center',
          alignItems : 'center',
          alignSelf : 'center',
          bottom : font('2.5'),
          // backgroundColor :  '#999'
     }),
     containerIconBack : (lang) => ({
          width : '70%',
          justifyContent : 'center',
          alignItems : lang === "english" ? 'flex-start' : 'flex-end',
          paddingHorizontal : '15%',
          bottom : font('2.5'),
          // backgroundColor :  '#999'
     }),
     iocn : (lang) => ({
          // color : Colors.standardColor,
          color : "#fff",
          paddingRight : lang === "english" ? font('10') : null ,
          paddingLeft : lang === "arabic" ? font('10') : null ,
          top : font('4')
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
})
     
export default Deawer