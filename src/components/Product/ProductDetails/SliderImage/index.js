import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native'
import Card from "../../../Card";
import Title from "../../../Title";
import Colors from '../../../../constants/Colors'
import { font, fontValue } from '../../../../utils/Responsive'
import FastImage from 'react-native-fast-image'
import { useTranslation } from "react-i18next";
import Carousel from "pinar";
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const {width, height} = Dimensions.get('window');


const SliderImage = ({
    data = null,
    category = null,
    logo = null
}) => {
	const flatListRef = useRef(null);
	const scrollX = useRef(new Animated.Value(0)).current;

	// Get Dimesnions
	const [activeIndex, setActiveIndex] = useState(0);

	//lang
	const { t, i18n } = useTranslation();
  	const lang = i18n.language === "english" ? "english" : "arabic"


    // Auto Scroll
	useEffect(() => {
		let interval = setInterval(() => {
			if (activeIndex === data.length - 1) {
				flatListRef.current.scrollToIndex({
					index: 0,
					animation: true,
				});
				setActiveIndex(0)
			} else {
				flatListRef.current.scrollToIndex({
					index: activeIndex + 1,
					animation: true,
				});

				setActiveIndex( activeIndex + 1)
			}
		}, 4000);

		return () => clearInterval(interval);

	},[activeIndex]);

    const handleScroll = ({ viewableItems }) => {
		setActiveIndex(viewableItems[0].index );
	};


    // handlePressActiveImage = (item) => {
    //     setActiveImage(item.id)
    // }

    // handlePressShow = (item) => {
    //     setActiveImage(item.index)
    // }

    // const goToNext = ( index, id ) => {
        
    //     let next = id ;
    //     listRef.current.scrollToIndex({index: next, animated: true})
    // }

    // const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    return (
        <View style={styles.root}>
                {/* <Carousel
                    height={font("320")}
                    style={styles.carousel}
                    removeClippedSubviews={true}
                    showsControls={false}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={[styles.dotStyle, { backgroundColor: 'white' }]}
                >
                    {
                        data.map(item => {
                            return (
                                <View style={styles.containerViewPhoto}>
                                    <FastImage
                                        source={{uri: item.url ? item.url : item.thumbnail }} 
                                        style={styles.viewPhoto}
                                        key={item.url}
                                    />
        

                                </View>
                            )
                        })
                    }
                </Carousel> */}
                <Animated.FlatList
				    ref={flatListRef}
					data={data}
					style={{ width : "100%" }}
					inverted={ lang === "arabic" ? true : false }
					horizontal
					pagingEnabled
					// decelerationRate="fast"
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item, index) => `${item.id}-${index}`}
                    onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{ useNativeDriver: true },
					)}
					onViewableItemsChanged={handleScroll}
					renderItem={({item, index}) => {
						return (
							<View 
								style={styles.image}
							>
							<Animated.Image
                                source={{uri: item.url ? item.url : item.thumbnail }} 
								style={[
									styles.viewPhoto
								]}
							/>
							</View>
						);
					}}
				/>	
                <View style={styles.containerIndicator(lang)}>
				{

					data.map((item, index) => {
						return (
								<View style={[styles.indicator,{ backgroundColor : index === activeIndex ? "#fff" : "#999" }]}></View>
						)
					})

				}
				</View>
        </View>
    )
}

const styles = StyleSheet.create({
    dotStyle: {
        width: 30,
        height: 5,
        backgroundColor: "#999",
        marginHorizontal: 3,
        borderRadius: 3,
        borderWidth : 1,
        borderColor : "#999",
        shadowColor: "#999",
        shadowOffset: {
            width: 10,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12.00,
        elevation: 20,
    },
    carousel: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12.00,
        
        elevation: 20,  
    },
    image: {
        // paddingHorizontal: '4%',
        width: width,
        // width: 433,
        height: font('325'),
        // height: 438,
        // width: 395,
        // height: 270,
    },
    viewPhoto: {
        // borderRadius: font('9'),
        width: '100%',
        height: '100%',
    },
    containerPhotos: {
        paddingTop: font('12'),
        marginHorizontal: width * 0.019

    },
    containerPhoto: {
        // width: width(23),
        width: width * .23,
        height: font('60'),
        // marginHorizontal: width('.5%'),
        marginHorizontal: width * 0.005,
        resizeMode : 'cover',
        justifyContent : 'flex-start',
        alignItems : 'flex-start'
    },
    containerCateName: (lang) => ({
        // width: width(27),
        width: width *0.27,
        height: fontValue("26"),
        backgroundColor : "#fff",
        position : "absolute",
        right : lang === "arabic" ? "0%" : null,
        left : lang === "english" ? "0%" : null,
        top : "35%",
        justifyContent : "center",
        alignItems : "center",
        borderTopLeftRadius : lang === "arabic" ? 8 : 0,
        borderTopRightRadius : lang === "english" ? 8 : 0,
        borderBottomLeftRadius : lang === "arabic" ? 8 : 0,
        borderBottomRightRadius : lang === "english" ? 8 : 0,

    }),
    containerCateImage : (lang) => ({
        width: fontValue("50"),
        height: fontValue("50"),
        borderRadius: fontValue("50"),
        position : "absolute",
        left : lang === "arabic" ? "8%" : null,
        right : lang === "english" ? "8%" : null,
        bottom : "5%",
        justifyContent : "center",
        alignItems : "center"
    }),
    cateImage : {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: fontValue("50"),
    },
    // active: (fadeAnim) => ({
    //     // borderColor: Colors.standardColor,
    //     // borderRadius: font('10'),
    //     // borderWidth: 1,
    //     // zIndex : 9999999
    //    bottom : fadeAnim
    // })
    containerIndicator : (lang) => ({
        bottom : font("15"),
		flexDirection : lang === "english" ? "row" : "row-reverse",
	    justifyContent: "center",
		alignItems: 'center',
	}),
	indicator : {
		width : font("18"),
		height : font("3.5"),
		borderRadius : font("9"),
		backgroundColor : "#999",
		marginHorizontal : font("2"),
	}
})

export default SliderImage;