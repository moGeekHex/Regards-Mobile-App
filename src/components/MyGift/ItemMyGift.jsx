import React, { useEffect } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTranslation } from "react-i18next";
import { font } from '../../utils/Responsive'
import Card from '../Card'
import Title from '../Title'
import mement from "moment"

const ItemMyGift = ({ handleTrack, reportOrder, data, handleRepurchase, handleInvoice }) => {

     const { t, i18n } = useTranslation();
     const lang = i18n.language

     return (
          <View style={styles.root}>
               <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.containerCardOne}>
                    <View style={styles.containerImage}>
                         <Image style={styles.image} source={{uri : data?.product?.thumbnail ? data?.product.thumbnail : null}}/>
                    </View>
                    <Card style={styles.containerOrder}>
                         <Card pushUp=".25" pushDown=".25" flexDirection={ lang === "english" ? "row" : "row-reverse" }>
                              <Title color="#444" size="1.65" text={ lang === "english" ? "Order ID" : "رقم الطلب" }/>
                         </Card>
                         <Card style={{justifyContent : 'center' }} pushUp=".25" pushDown=".25" flexDirection={ lang === "english" ? "row" : "row-reverse" }>
                              <Title color="#352E3C" fontWeight="600" size="1.7" text={`#`+ mement(data?.createdAt).format("DD")+`${data?.id}`+mement(data?.createdAt).format("MM")}/>
                         </Card>
                    </Card>
                    <Card style={{ justifyContent  : "center", alignItems : "center" }}>
                         <TouchableOpacity style={styles.ButtonTrack(lang)} disabled={true}>
                              <Title 
                                   size="1.5" 
                                   color="#4F008E" 
                                   fontWeight="600" 
                                   text={ 
                                        lang === "english" && data?.status === "PROCESSING" 
                                        ? 
                                             "PROCESSING" 
                                        : 
                                        lang === "arabic" && data?.status === "PROCESSING" 
                                        ?
                                             "قيد التنفيذ"
                                        :
                                        lang === "english" && data?.status === "COMPLETED" 
                                        ?
                                             "COMPLETED"
                                        :    
                                        lang === "arabic" && data?.status === "COMPLETED"
                                        ?
                                             "اكتمل الطلب"
                                        :    
                                             lang === "english" ? "Processing"  : "قيد التنفيذ"
                                   }
                              />
                         </TouchableOpacity>
                         {/* <TouchableOpacity style={styles.ButtonInvoice(lang)} onPress={handleInvoice} >
                              <Title 
                                   size="1.7" 
                                   color="#4F008E" 
                                   fontWeight="600" 
                                   text={ lang === "english" ? "View Vat Invoice" : "الفاتورة الضريبية"}
                                   style={{ textDecorationLine: 'underline' }}
                              />
                         </TouchableOpacity> */}
                    </Card>
                    
               </Card>

               <Card pushUp="2" flexDirection={ lang === "english" ? "row" : "row-reverse" } style={styles.containerDesc}>
                    <Title 
                         size="2.3" 
                         fontWeight="300" 
                         text={ lang === "english" ? data?.product.nameEn : data?.product.nameAr }
                         style={styles.description(lang)}
                    />
                    {/* <Card style={{ width : "35%" }}>
                         <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={{ alignItems : 'center', justifyContent : "center" }}>
                              <Title size="2.7" fontWeight="500" text={data?.cost}/>
                              <Title size="1.9" fontWeight="500" text={ lang === "english" ? " SAR" : " ر.س" } style={{ top : '4%' }}/>
                         </Card>
                    </Card> */}
               </Card>
               <Card pushUp="1" flexDirection={ lang === "english" ? "row" : "row-reverse" } style={{ alignItems : 'center' }}>
                    <Title size="1.4" fontWeight="400" color="#555" text={mement(data?.createdAt).format("DD-MM-YYYY")}/>
                    <View style={styles.cycle}/>
                    <Title size="1.4" fontWeight="400" color="#555" text={mement(data?.createdAt).format('hh:mm A')}/>
               </Card>
          </View>
     )
}

const styles = StyleSheet.create({
     root : {
          width : '100%',
          backgroundColor : '#F9F9F9',
          paddingHorizontal : '7%',
          paddingVertical : font('16'),
          borderRadius : font('12'),
     },
     containerCardOne : {
          alignItems : 'center'
     },
     containerImage : {
          width : font('70'),
          height : font('55'),
     },
     image : {
          width : '100%',
          height : '100%',
          borderRadius : font('8')
     },
     containerOrder : {
          marginHorizontal : '5%',
          marginVertical : font('8'),
          justifyContent : 'space-evenly'
     },
     ButtonTrack : (lang) => ({
          alignItems : "center",
          backgroundColor : '#E6E6E6',
          paddingHorizontal : font('8'),
          paddingVertical : font('7'),
          borderRadius : font(14),
          marginVertical : font("5"),
          marginLeft : lang === "english" ? '8.5%' : null,
          marginRight : lang === "arabic" ? '8.5%' : null

     }),
     ButtonInvoice : (lang) => ({
          alignItems : "center",
          // paddingHorizontal : font('9'),
          paddingVertical : font('6.5'),
          borderRadius : font(14),
          marginVertical : font("5"),
          marginLeft : lang === "english" ? '8.5%' : null,
          marginRight : lang === "arabic" ? '8.5%' : null
     }),
     description : (lang) => ({
          width : '65%',
          textAlign : lang === "english" ? 'left' : "right"
     }),
     containerDesc : {
          justifyContent : 'space-between',
     },
     discound : {
          textDecorationLine : 'line-through'
     },
     cycle : {
          width : font('3'),
          height : font('3'),
          borderRadius : font('3'),
          backgroundColor : '#555',
          marginHorizontal : '2.5%',
          top : '.5%'
     },
     Button : {
          borderWidth : 1,
          borderColor : '#ccc',
          borderRadius : font('20'),
          width : font('117'),
          paddingVertical : font('12'),
          backgroundColor : '#fff',
          justifyContent : 'center',
          alignItems : 'center'
     },
     ButtonMove : (disabledRepurchase) => ({
          borderWidth : 1,
          borderColor : '#ccc',
          borderRadius : font('20'),
          width : font('117'),
          paddingVertical : font('12'),
          backgroundColor : disabledRepurchase ? "#777" : '#4F008E',
          justifyContent : 'center',
          alignItems : 'center'
     })
})

export default ItemMyGift