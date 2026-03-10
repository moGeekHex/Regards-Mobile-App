import React, { memo, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Image from 'react-native-fast-image'
import { useTranslation } from "react-i18next";
import Colors from '../../../constants/Colors'
import { font, fontValue } from '../../../utils/Responsive'
import Title from '../../Title'
import FastImage from 'react-native-fast-image'

const ImageOverlay = ({
     source,
     discountPercentage,
     showPercentage,
     categoryName,
     sellerLogo
}) => {
     const { t, i18n } = useTranslation();
     const lang = i18n.language === "english" ? "english" : "arabic"
     return (
          <View>
               <Image style={styles.image} source={source}>
                    <View style={styles.containerCateTitle(lang)}>
                         <Title fontWeight="600" style={{ textAlign : "center" }} text={lang === "arabic" ? categoryName?.nameAr : categoryName?.nameEn} color="#333" size=".9"/>
                    </View>
                    {/* <View style={styles.containerCateImage(lang)}>
                         <FastImage
                              source={{ uri : sellerLogo }}
                              style={styles.cateImage}
                         />
                    </View> */}
               </Image>
               {
                    showPercentage
                    ?
                         <View style={[styles.text, i18n.language === "english" ? styles.left : styles.right ]}>
                              <Title color="#fff" size="1.1" fontWeight="500" text={ i18n.language === "english" ? `SAVE ${Math.floor(discountPercentage)}%` : `وفر  ${Math.floor(discountPercentage)}%`}/>
                         </View>
                    :
                         null
               }
          </View>
     )
}

const styles = StyleSheet.create({
     image : {
          width : '100%',
          height : '100%',
          borderRadius : font('12'),
          position : 'relative'
     },
     text : {
          position : 'absolute',
          top : '78%',
          padding : font('4'),
          backgroundColor : Colors.standardColor,
          borderRadius : font('4'),
     },
     left : {
          left : '5%',
     },
     right : {
          right : '5%'
     },
     containerCateTitle : (lang) => ({
          width: fontValue("40"), 
          height: fontValue("17"), 
          backgroundColor : "#fff",
          position : "absolute",
          right : lang === "arabic" ? 0 : null,
          left : lang === "english" ? 0 : null,
          top : "14%",
          justifyContent : "center",
          alignItems : "center",
          borderTopLeftRadius : lang === "arabic" ? 4 : 0,
          borderBottomLeftRadius : lang === "arabic" ? 4 : 0,
          borderTopRightRadius : lang === "english" ? 4 : 0,
          borderBottomRightRadius : lang === "english" ? 4 : 0,
          opacity : .8
     }),
     containerCateImage : (lang) => ({
          width: fontValue("27.5"),
          height: fontValue("27.5"),
          borderRadius: fontValue("50"),
          position : "absolute",
          left : lang === "arabic" ? "3.9%" : null,
          right : lang === "english" ? "3.9%" : null,
          bottom : "5.8%",
          justifyContent : "center",
          alignItems : "center"
     }),
     cateImage : {
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
          borderRadius: fontValue("50"),
      }
})

export default memo(ImageOverlay)