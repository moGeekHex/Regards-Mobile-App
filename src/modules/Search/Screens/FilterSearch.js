import React,{ useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Head, Title, Card, ButtonApp } from '../../../components';
import Colors from '../../../constants/Colors'
import { useTranslation } from "react-i18next";
import { appEvents } from '../../../events/appEvents';
// import RangeSlider from '@jesster2k10/react-native-range-slider';

const FilterSearch = ({ route, navigation }) => {

     const selectedMinPriceFilter = route.params.selectedMinPriceFilter;
     const selectedMaxPriceFilter = route.params.selectedMaxPriceFilter;   
     const itemName = route.params?.itemName;
     const sellerID = route.params?.sellerID;
     const categoryID = route.params?.categoryID;
     const eventID = route.params?.eventID;

     const [minPriceFilter, setMinPriceFilter] = useState(0);
     const [maxPriceFilter, setMaxPriceFilter] = useState(0);

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     const onChange = (min, max) => {
          setMinPriceFilter(min)
          setMaxPriceFilter(max)
     }   
     
     return (
          <View style={styles.root}>
               <Head 
                    title={ lang === "english" ? "Filter" : "فلتر"}
                    handlePress={() => navigation.goBack()}
               />
               <View style={styles.screen}>
                    <Card pushUp="3" flexDirection={ lang === "english" ? "row" : "row-reverse" }>
                         <Title
                              text={ lang === "english" ? "Price Range" : "السعر" }
                              size="2"
                              fontWeight="600"
                         />
                    </Card>
                    <View style={{ width : '100%' }}>
                         <Card pushUp="4" flexDirection={ lang === "english" ? "row" : "row" } style={{ justifyContent : 'space-between' }} widthCard="100%">
                              <Title
                                   text={ lang === "english" ? `Min: SAR 0` :`الحد الأدني : 0 ر.س ` }
                                   size="1.6"
                                   fontWeight="400"
                                   color="#999"
                              />
                              <Title
                                   text={ lang === "english" ? `Max: SAR 100,000+` : `الحد الأقصي : 100,000 ر.س ` }
                                   size="1.6"
                                   fontWeight="400"
                                   color="#999"
                              />
                         </Card>
                         <Card pushUp="2" style={{ width : '96.5%', alignItem : 'center', justifyContent : 'center' }}>
                              {/* <RangeSlider
                                   type="range" // ios only
                                   min={0}
                                   max={100000}
                                   selectedMinimum={selectedMinPriceFilter ? selectedMinPriceFilter : 0}
                                   selectedMaximum={selectedMaxPriceFilter ? selectedMaxPriceFilter : 100000}  
                                   tintColor="#333333"
                                   handleColor="#4F008E"
                                   handlePressedColor="#4F008E"
                                   tintColorBetweenHandles="#4F008E"
                                   lineBorderColor="#EEEEEE"
                                   lineHeight={2.5}
                                   lineBorderWidth={100}
                                   onChange={ (min,max) => onChange(min,max)}
                                   suffix={ lang === "english" ? " SAR " : " ريال " }
                                   // style={styles.rangeSlider(lang)}                   
                              /> */}
                         </Card>
                    </View>

                    <Card pushUp="58">
                         <ButtonApp 
                              title={ lang === "english" ? "SAVE" : "حفظ" }
                               onPress={ () => {
                                    try {
                                         appEvents({
                                              eventName: "filter_applied",
                                              payload: {
                                                   min_price: minPriceFilter,
                                                   max_price: maxPriceFilter
                                              }
                                         });
                                    } catch(e) {}
                                    navigation.navigate('SearchDetails',{
                                         minPriceFilter : minPriceFilter,
                                         maxPriceFilter : maxPriceFilter,
                                         itemName : itemName,
                                         sellerID : sellerID,
                                         categoryID : categoryID,
                                         eventID : eventID
                                    })
                               }}
                         />
                    </Card>
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
          paddingHorizontal : '3%',
     },
     rangeSlider : (lang) => ({
          // transform: lang == "arabic" ? [{scaleX: -1}] : [{scaleX: 1}]
     })
})

export default FilterSearch
