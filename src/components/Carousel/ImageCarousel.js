import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useTranslation } from "react-i18next";
import {SimplePaginationDot} from './component';
import Title from '../Title';

import { useNavigation } from '@react-navigation/native';
import { font } from '../../utils/Responsive';

const {width: windowWidth} = Dimensions.get('window');

export default function ImageCarousel({data, onPress}) {

  const { t, i18n } = useTranslation();
  const lang = i18n.language === "english" ? "english" : "arabic"
  const navigation = useNavigation();
  
  const INITIAL_INDEX =  useTranslation().i18n.language === "english" ? 0 : 0;

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);

  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }

  const onPressHandle = (titleEn, titleAr, clickable, type, typeId) => {

    if(type === "PRODUCT")
    {
      return navigation.navigate("Product",{
        screen : type === "PRODUCT" ? "Product" : type === "EVENT" ? null : "",
        params : {
          id : typeId,
          eventID : typeId,
          eventName : lang === "english" ? titleEn : titleAr
        }
      })
    }else if(type === "EVENT"){
      return navigation.navigate("PopularDetails",{
          eventID : typeId,
          eventName : lang === "english" ? titleEn : titleAr
      })
    }else if(type === "SELLER"){
      return navigation.navigate("PopularDetails",{
          sellerID : typeId,
          sellerName : lang === "english" ? titleEn : titleAr
      })
    }
  }

  function renderItem({item, index}) {
    const {image, titleEn, titleAr, clickable, type, typeId} = item;

    return (
      <TouchableOpacity
        disabled={!clickable}
        activeOpacity={clickable ? .7 : 1 }
        style={styles.item}
        onPress={() => onPressHandle(titleEn, titleAr, clickable, type, typeId)}
      >
        <Image source={{uri: image}} style={styles.imageBackground}/>
        <View style={styles.overlay}/>
        <Title text={lang === "english" ? titleEn : titleAr } size="2.3" fontWeight="600" color="#fff" style={styles.titleNumberImage}/>
        {/* <Title text="Discounts" size="3.5" color="#fff" style={styles.titleImage}/> */}
      </TouchableOpacity>
    );
  }

  return (
    <View onPress={onPress} style={styles.container}>
      <Carousel
        loop
        width={windowWidth}
        height={windowWidth / 2}
        autoPlay={true}
        style={styles.carousel}
        data={data}
        // scrollAnimationDuration={1000}
        autoPlayInterval={4000}
        
        // separatorWidth="-60"
        // initialIndex={currentIndex}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.88,
          parallaxScrollingOffset: 110,
        }}
        pagingEnabled={true}
        snapEnabled={true}
        // itemWidth={1 * windowWidth}
        // inActiveOpacity={0.25}
        // containerWidth={windowWidth}
        // onScrollEnd={handleCarouselScrollEnd}
        // ref={carouselRef}
        // minScrollDistance={.01}
        // useExperimentalSnap={true}
        // inverted={lang === "arabic" ? true : false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', 
    // paddingTop: font("10"),
    flex :1,
    justifyContent : 'center',
  },
  carousel: {
    backgroundColor: '#fff',
    aspectRatio: 2,
    marginBottom: 3,
  },
  item: {
    marginHorizontal : '8.5%',
    borderRadius: 20,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    borderColor: 'white',
    elevation: 3,
  },
  imageBackground: {
      flex: 1,
    // width : 325,
    // height : 200,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    position : 'relative',
    borderColor: 'white',
    borderRadius: 25,
  },
  overlay : {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    position : 'absolute',
    borderRadius: 25,
  },
  titleNumberImage : {
    position : 'absolute',
    top : '65%',
    alignSelf : 'center',
    textAlign : 'center'
    // fontFamily : 'Architects Daughter'
  },
  titleImage : {
    position : 'absolute',
    top : '65%',
    alignSelf : 'center',
    fontFamily : 'Architects Daughter'
  },
  rightTextContainer: {
    marginLeft: 'auto',
    marginRight: -2,
    padding: 3,
    marginTop: 3,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightText: {color: 'white'},
  lowerContainer: {
    flex: 1,
    margin: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentText: {
    marginTop: 10,
    fontSize: 12,
  },
});