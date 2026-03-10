import React,{ useEffect, useState, memo, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from '@react-native-vector-icons/ionicons'
import ImageOverlay from './ImageOverlay'
import { font, height, width } from '../../../utils/Responsive'
import Title from '../../Title'
import Card from '../../Card'
import { useTranslation } from "react-i18next";
import Colors from '../../../constants/Colors'
import UniversalImage from '../../UniversalImage'
const PopularProduct = ({
    data, 
    onPress, 
    onPressLike, 
    large, 
    like,
    mylike, 
    style
}) => {
    const { t, i18n } = useTranslation();

    const lang = i18n.language === "english" ? "english" : "arabic"

    const [saleWork, setSaleWork] = useState(false);

    // const handlePrice = () => {
    //     if(data){
    //         const saleValidData = new Date(data?.saleValidData).toISOString().split('T')[0]

    //             const currentDate = new Date().toISOString().split('T')[0];

    //             if(saleValidData >= currentDate && data?.isSale)
    //             {   
    //                 setSaleWork(true)
    //             } else {        
    //                 setSaleWork(false)
    //             }
    //     }
    // }


    const discountPercentage = useMemo(() => 100 - ((data?.salePrice * 100) / data?.price ),[])

    return (
        <TouchableOpacity onPress={onPress} style={[styles.root(large, like),style]} activeOpacity={1}>
            <View style={styles.containerImage(large)}>
                <ImageOverlay 
                    source={{uri: data?.thumbnail}} 
                    discountPercentage={discountPercentage} 
                    showPercentage={saleWork}
                    categoryName={data?.categories[0]}
                    sellerLogo={data?.vendor?.thumbnail}
                />
            </View> 
            <View style={styles.containerDetails}>
                {
                    saleWork
                    ?
                        <View style={styles.containerPrice(lang)}>
                            <Title color="#000" size={ lang === "english" ? "1.8" : "1.8"} fontWeight="600" text={ lang === "english" ? `${data?.salePrice}` : `${data?.salePrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` } style={styles.price(lang)}/>
                            <Title color="#000" size={ lang === "english" ? "1.45" : "1.6"} fontWeight="400" text={ lang === "english" ? ` SAR ` : ` ر.س ` } style={styles.price}/>

                            <Card flexDirection={ lang === "english" ? "row" : "row-reverse" } style={{ paddingHorizantal : 2}}>
                                <Title color="#777" size="1.45" fontWeight="600" text={ lang === "english" ? `${data?.price}` : ` ${data?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ` }  style={styles.discound}/>
                                <Title color="#777" size="1.40" fontWeight="400" text={ lang === "english" ? `SAR` : `ر.س` } style={styles.discound}/>
                            </Card>
                        </View>
                    :
                        <View style={styles.containerPrice(lang)}>
                            <Title color="#000" size={ lang === "english" ? "1.5" : "1.5"} fontWeight="600" text={ lang === "english" ? `${data?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : `${data?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` } style={styles.price(lang)}/>
                            <UniversalImage
                                source={require('../../../assets/images/sar.svg').default} 
                                style={styles.sarStyle} 
                            />
                        </View>
                }
                <Card style={styles.containerDescription}>
                    <Title 
                        color="#000" 
                        size="1.5" 
                        fontWeight="400" 
                        text={ lang === "english" ? data?.nameEn.replace(`\n`," ") : data?.nameAr } 
                        style={styles.description(lang)}
                    />
                </Card>
                {/* <Card style={styles.containerDescription}> */}
                    <Title 
                        color="#000" 
                        size="1.5" 
                        fontWeight="600" 
                        text={ lang === "english" ? data?.vendor?.S_nameEn : data?.vendor?.S_nameAr  } 
                        // text="padel starter Package Subscription PADEL UP"
                        style={styles.description(lang)}
                    />
                {/* </Card> */}
                
                <View style={styles.containerLikes(lang)}>
                    {
                        like
                        ?

                            <Title 
                                color={ like ? Colors.standardColor : "#000" } 
                                size="1.4" 
                                fontWeight="300" 
                                text={ lang === "english" ? `Liked` : `اعجبني` } 
                            />
                        :
                            <Title 
                                color={ like ? Colors.standardColor : "#000" } 
                                size="1.4" fontWeight="300" 
                                text={ lang === "english" ? ` ${ data?.likes ?  data.likes  : 0 } likes` :   `${ data?.likes ?  data.likes  : 0 } اعجاب` } 
                            />
                    }
                    <TouchableOpacity onPress={onPressLike}>
                        <Ionicons size={font('19.5')}  name={ like ? "heart" : "heart-outline"} color={ like ? "#4F008E" : "#00000082" }/>
                    </TouchableOpacity>

                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root : (large , like) => ({
        width : large ? width('43.7%') : font('130'),
        marginHorizontal : width('2%'),
        marginBottom : large ? font('12') : null,
        // backgroundColor : like ? 'rgba(102, 64, 137, 0.08)' : '#F9F9F9',
        borderRadius : font('12'),
        overflow: 'hidden',
        // borderWidth : .25,
        borderColor : "#F9F9F9",
        // borderColor : '#ccc',
        ...Platform.select({
             ios : {
                shadowColor: "#000",
                shadowOffset: {
                    width: 3,
                    height: 6,
                },
                shadowOpacity: 0.45,
                shadowRadius: 13,
        
                elevation: 13,
             },
             android: {
                  borderWidth : 1,
                  shadowColor: "#333",
                  shadowOffset: {
                       width: 2,
                       height: 2,
                  },
                  shadowOpacity: 0.20,
                  shadowRadius: 1.41,
                  elevation: 0
             }
        })   
    }),
    containerImage : (large) =>  ({
        width : '100%',
        maxHeight : large ? font('110') : font('105'),
    }),
    containerDetails : {
        borderRadius : font('12'),
    },
    containerPrice : (lang) => ({
        paddingTop : font('10'),
        paddingHorizontal : font('6.5'),
        alignItems : 'center',
        flexDirection : "row-reverse",
        justifyContent : lang === "arabic" ? "flex-start" : "flex-end"
    }),
    price : (lang) => ({
        paddingLeft :  lang === "arabic" ? font('3') : font('3'),
    }),
    sarStyle : {
        width : font("11"), 
        height : font("11"),
    },
    discound : {
        textDecorationLine : 'line-through',
    },
    description : (lang) => ({
        width : '100%',
        flexDirection : 'column',
        textAlign : lang === "english" ? "left" : 'right',
        paddingTop : font('4'),
        paddingHorizontal : font('6.5'),
        
    }),
    containerDescription : {
        minHeight : font('30')
    },
    containerLikes : (lang) => ({
        flexDirection : lang === "english" ? "row" : "row-reverse",
        // width : '92.5%',
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingTop : font('6'),
        // paddingHorizontal : font('6.5'),
        paddingLeft : lang === "english" ? font("4.5") : font('6.5'),
        paddingRight : lang === "english" ? font("20") : font("7"),
        paddingBottom : font('10')
    })
})

export default memo(PopularProduct);