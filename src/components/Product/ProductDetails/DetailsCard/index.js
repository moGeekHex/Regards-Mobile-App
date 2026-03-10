import React,{ memo, useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useTranslation } from "react-i18next";
import Ionicons from '@react-native-vector-icons/ionicons'
import { font, fontValue, width } from '../../../../utils/Responsive';
import Card from '../../../Card';
import Title from '../../../Title';
import CardTag from './CardTag';
import LogoTag from './LogoTag';
import Colors from '../../../../constants/Colors';
import UniversalImage from '../../../UniversalImage'

const DetailsCard = ({
     data,
     like,
     onPressLike,
     handlerPressProvider,
}) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"

     const tags = data?.tags

     const [saleWork, setSaleWork] = useState(false);

     return (
          <View style={styles.root}>
               <Card flexDirection={ i18n.language === "english" ? 'row' : 'row-reverse' } style={styles.rootContainer} pushUp="3">
                    <Card style={{ width : '80%' }}>
                         <Card flexDirection={lang === "english" ?'row' : 'row-reverse' } style={styles.containerPriceHeart}>
                              {
                                   saleWork
                                   ?
                                        <>
                                             <Card flexDirection={ i18n.language === "english" ? 'row' : 'row-reverse' } style={styles.containerPriceDiscount(lang)}>
                                                  <Title size="2.3" fontWeight="600" text={data?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                                                  <Title 
                                                       size= { i18n.language === "english" ? "1.6" : "1.8" } 
                                                       fontWeight="400" 
                                                       text={ i18n.language === "english" ? " SAR" : " ر.س" }
                                                  />
                                             </Card>
                                             <Title style={styles.priceDiscound(lang)} size="1.8" text={ i18n.language === "english" ? `${data?.salePrice + " SAR"}` : `${data?.salePrice + " ر.س"}` }/>
                                        </>
                                   :
                                        <Card flexDirection={ i18n.language === "english" ? 'row' : 'row-reverse' } style={styles.containerPriceDiscount(lang)}>
                                             <View style={{ flexDirection : 'row-reverse', alignItems : "center" }}>
                                                  <Title size="2" fontWeight="600" text={data?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                                                  <UniversalImage
                                                       source={require('../../../../assets/images/sar.svg').default} 
                                                       style={styles.sarStyle(lang)} 
                                                  />
                                             </View>
                                             <TouchableOpacity onPress={handlerPressProvider} style={{ backgroundColor : "#eee", borderRadius : fontValue("10"), paddingVertical: fontValue("3"), paddingHorizontal : fontValue("5") }}>
                                                  <Title size="1.3" color={Colors.black}  fontWeight="600" text={i18n.language === "english" ? data?.vendor?.S_nameEn : data?.vendor?.S_nameAr}/>
                                             </TouchableOpacity>
                                        </Card>
                              }
                         </Card>
                         <Card flexDirection="column" pushUp="1.5" pushDown=".5">
                              <Title 
                                   style={styles.titleDetails(lang)} 
                                   fontWeight="500" size="2.2" 
                                   text={ i18n.language === "english" ? data?.nameEn : data?.nameAr }
                              />
                         </Card>
                         <Card pushUp="2" flexDirection={ i18n.language === "english" ? 'row' : 'row-reverse' } style={styles.containerTagLogo}>
                              <Card flexDirection={i18n.language === "english" ? 'row' : 'row-reverse'} style={{  width: '100%', flexWrap : 'wrap' }}>
                                   {
                                        tags && tags.length
                                        ?    
                                             tags.map(tag => {
                                                  return <CardTag title= { i18n.language === "english" ? tag.nameEn : tag.nameAr }/>
                                             })
                                        :
                                             null
                                   }
                              </Card>
                         </Card>
                    </Card>
                    <Card style={styles.containerHeartLogo}>
                         <TouchableOpacity style={styles.containerHeart} onPress={onPressLike}>
                              {
                                   like 
                                   ?
                                        <>
                                             <Ionicons size={font('24')} color={Colors.standardColor} name="heart"/>
                                             <Card pushUp=".5">
                                                  <Title size="1.4" fontWeight="500" text={data?.likes ? data?.likes : 0}/>
                                             </Card>
                                        </>
                                   :
                                        <>
                                             <Ionicons size={font('24')} color="#00000082" name="heart-outline"/>
                                             <Card pushUp=".5">
                                                  <Title size="1.4" fontWeight="500" text={data?.likes ? data?.likes : 0}/>
                                             </Card>
                                        </>
                              }
                         </TouchableOpacity>
                         <TouchableOpacity onPress={handlerPressProvider} >
                              <Card pushUp="3">
                                   <LogoTag
                                        source={{ uri : data?.vendor?.thumbnail }}
                                        style={styles.logoTag}
                                   />
                              </Card>
                         </TouchableOpacity>
                    </Card>
               </Card>
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          marginHorizontal : '1%',
     },
     rootContainer : {
          justifyContent : "space-evenly",
     },
     containerPriceHeart : {
          alignItems : 'baseline',
          width : '100%',
     },
     priceDiscound : (lang) => ({
          textDecorationLine : 'line-through',
          color : '#777',
          marginHorizontal : lang === "english" ? font('7') : null
     }),
     containerPriceDiscount : (lang) => ({
          alignItems : 'center',
          justifyContent : 'space-between',
          width : "100%",
          marginRight : lang === "arabic" ? font('10') : null,
          // shadowColor: "#000",
          // shadowOffset: {
          //      width: 0,
          //      height: 12,
          // },
          // shadowOpacity: 0.3,
          // shadowRadius: 9.00,

          // elevation: 24,
     }),
     sarStyle : (lang) => ({
          width : font("11.5"), 
          height : font("11.5"),
          marginRight : lang === "arabic" ? font("3") : font("3")
     }),
     containerHeart : {
          paddingHorizontal : '4.25%',
          hight : '100%',
          // top : '2.5%',
          justifyContent : 'center',
          alignItems : 'center',
          // width : '20%'
     },   
     titleDetails : (lang) => ({
          textAlign : lang === "english" ? "left" : "right",
          // width : '83%',
          marginLeft :  lang === "english" ? null : '17%',
          shadowColor: "#000",
          shadowOffset: {
               width: 0,
               height: 5,
          },
          shadowOpacity: 0.8,
          shadowRadius: 10.00,

          elevation: 24,
     }),
     containerHeartLogo : {
          justifyContent : 'center',
          alignItems : 'center',
          width : '20%',
     },   
     containerTagLogo : {
          alignItems : 'center',
          justifyContent : 'space-between',
     },
     logoTag : {
          justifyContent : 'center',
          alignItems : 'center',
     }
})

export default memo(DetailsCard)