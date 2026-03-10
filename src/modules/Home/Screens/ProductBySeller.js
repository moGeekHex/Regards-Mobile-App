import React,{ useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Button as ButtonRn, FlatList, ActivityIndicator } from 'react-native'
import { Card, PopularProduct, Title, InputSearch, ProductButton, Button, Input, InputPhone } from '../../../components';
import Colors from '../../../constants/Colors';
import { height, fontPercent, width, font, fontValue } from '../../../utils/Responsive';
import AntDesign from '@react-native-vector-icons/ant-design'
import IconAntDesign from '@react-native-vector-icons/ant-design'
import { useTranslation } from "react-i18next";
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import AwesomeLoading from 'react-native-awesome-loading';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getProductsByEvent } from '../../Search/State/action/ProductByEventAction';
import { getProductsByCategories } from '../../Search/State/action/ProductByCategoryAction';
import { getProductsBySeller } from '../../Search/State/action/ProductBySellerAction';
import { getProductBySearch } from '../../Search/State/action/SearchAction';
import { checkOtp, reSendOtp, sendOtp } from '../../../store/State/actions/AuthAction';
import { addFavourite, getFavourites, deleteFavourite } from '../../Likes/State/action/FavouritesProductAction';
import { getProfile } from '../../Profile/State/actions/ProfileAction';
//Adjust

const ProductBySeller = ({ route, navigation }) => {
     const { t, i18n } = useTranslation();
     const lang = i18n.language;

     const [myFavouritesState, setMyFavouritesState] = useState([]);
     const [sort, setSort] = useState(false);
     //phone number otp

     //handle check found product
     // const [productsBySellerDetails, setProductsBySellerDetails] = useState(null);
     // const [productsByCategoryDetails, setProductsByCategoryDetails] = useState(null);

     //search
     const [searchText, setSearchText] = useState('');
     const [openSearch, setOpenSearch] = useState(null);
     const [page, setPage] = useState(1);

     //OTP
    const [showOtp, setShowOtp] = useState(false);
    const [codeOtp, setCodeOtp] = useState(false);
    const [signUp, setSignUp] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleCode, setModalVisibleCode] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(120);
    const [phoneOtp, setPhoneOtp] = useState("");

     //params event 
     const eventID = route.params.eventID;
     const eventName = route.params.eventName;
     
     //params category
     const categoryID = route.params.categoryID;
     const categoryName = route.params.categoryName;

     //params seller
     const sellerID = route.params.sellerID;
     const sellerName = route.params.sellerName;

     const minPriceFilter = route.params?.minPriceFilter;
     const maxPriceFilter = route.params?.maxPriceFilter; 

     const itemName = eventName ?  eventName : categoryName ? categoryName : sellerName ? sellerName : route.params.itemName;;
     // const itemID = eventID ?  eventID : categoryID ? categoryID : sellerID ? sellerID : null;

     
     //Redux 
     const dispatch = useDispatch();
     const { productsBySeller, moreLoading, isListEnd, loadingData } = useSelector(state=>state.productBySeller)
     // const { productsByCategory, loadingProductByCategory } = useSelector(state=>state.productByCategory)
     // const { productsByEvent } = useSelector(state=>state.productByEvent)
     const { favourites, deleteItem, addItem } = useSelector(state=>state.favouritesProduct)
     const { profile } = useSelector(state=>state.profile)
     const { status, otp, phone, resend } = useSelector(state=>state.auth)

     
     const handleGetProductByFilter = () => {
          if(route.params?.sellerID)
          {
               dispatch(getProductsBySeller(route.params?.sellerID, page ));
          }
     }

     const FilterId = ( itemArray, id ) => 
          itemArray?.filter(product => {
               return product.id === id
          })

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

     // const searchFilterFunction = () => {
     //      // Check if searched text is not blank
     //      if (searchText) {
     //           // Inserted text is not blank
     //           // Filter the masterDataSource
     //           // Update FilteredDataSource
               
     //           const newData = productsByCategory.filter(
     //                function (item) {
     //                     const itemDataAr = item.nameAr ? item.nameAr.toUpperCase() : ''.toUpperCase();
     //                     const itemDataEn = item.nameAr ? item.nameEn.toUpperCase() : ''.toUpperCase();
     //                     const textData = searchText.toUpperCase();

                         
     //                     if(lang === "english"){
     //                          return itemDataEn.indexOf(textData) > -1 ;
     //                     }else{
     //                          return itemDataAr.indexOf(textData) > -1 ; 
     //                     }
     //                }
     //           );
     //           setProductsByCategoryDetails(newData);
     //      } else {
     //           // Inserted text is blank
     //           // Update FilteredDataSource with masterDataSource
     //           setProductsByCategoryDetails(productsByCategory)
     //      }
     // };

     // const reomveFilter = () => {
     //      setProductsByCategoryDetails(productsByCategory);
     //      setSearchText(null)
     // }

     useEffect(() => {
          // dispatch(getFavourites());
          if(route.params?.eventID)
          {
               dispatch(getProductsByEvent(route.params?.eventID, minPriceFilter, maxPriceFilter, sort ));
          }

          if(route.params?.categoryID)
          {
               dispatch(getProductsByCategories(route.params?.categoryID, page ));
          }

          if(route.params?.sellerID)
          {
               dispatch(getProductsBySeller(route.params?.sellerID, page ));
          }

     },[page])

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

     // useEffect(() => {
     //      handleGetProductByFilter()
     // },[minPriceFilter,maxPriceFilter])

     // useEffect(() => {
     //      handleGetProductByFilter()
     // },[sort])

     // useEffect(() => {
     //      setProductsBySellerDetails(productsBySeller)
     // },[productsBySeller])

     // useEffect(() => {
     //      setProductsByCategoryDetails(productsByCategory)
     // },[productsByCategory])

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

     // useEffect(() => {
     //      if(otp)
     //      {
     //           dispatch(getProfile())
     //           handleGetProductByFilter()
     //           setModalVisible(false)
     //           setModalVisibleCode(false)
     //           setPhoneOtp("")
     //           var adjustEvent = new AdjustEvent("eew8tu");
     //           Adjust.trackEvent(adjustEvent);
     //      }
     // },[otp])

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

     const onEndReached = () => {
          if(!isListEnd){
               setPage(page + 1)
               console.log("add page")
          }
      }

     const renderEmpty = () => (
          <View style={styles.containerEmpty}>
              <Title text={ lang === "english" ? "No Data at the moment" : "لا يوجود بيانات بالوقت الحالي"} size={1.5}/>
              <ButtonRn onPress={() => handleGetProductByFilter()} title={ lang === "english" ? "Refresh" : "تحديث" } size="large"/>
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
                         <Card pushUp={ Platform.OS === "ios" ? "6" : "1"} flexDirection={ lang === "english" ? 'row' : "row-reverse"}  pushDown="2" style={styles.containerHead}>
                              <View style={{ width : '22.5%',  alignItems : lang === "english" ? 'flex-start' : 'flex-end' }}>
                                   <TouchableOpacity onPress={() => navigation.goBack()} style={styles.containerIconBack(lang)}>
                                        <AntDesign color={Colors.standardColor} name={ lang === "english" ? "left" : "right" } size={font('18')}/>
                                   </TouchableOpacity>
                              </View>
                              <Title size="1.8" fontWeight="500" text={ itemName }/>

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
                         <View style={styles.containerPopularProducts(lang)}>
                              {
                                   productsBySeller && sellerID ?
                                        <FlatList
                                             data={productsBySeller}
                                             keyExtractor={(item, index) => String(index)}
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
                                   :
                                        null
                              }
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

                         {/* </ScrollView> */}
                    </>
                    // :
                    // <AwesomeLoading indicatorId={7} size={50} isActive={true} text="loading" />
               }
        </View>
    )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : Colors.backgroundColor,
          marginBottom : height("8"),
     },
     containerPopularProducts : (lang) => ({
          paddingTop : '2%',
          paddingHorizontal : "2%",
     }),
     containerGifts : {
          flexDirection : 'row',
          flexWrap : 'wrap',
          justifyContent : 'space-around',
          alignItems : 'center',
          paddingHorizontal : '1%'
     },
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
          color : "#fff",
          // color : Colors.standardColor,
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
     
export default ProductBySeller