import {
	Animated,
	StyleSheet,
	View,
	Dimensions,
	SafeAreaView,
	Text,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { font } from "../../../utils/Responsive";
import FastImage from "react-native-fast-image";
import Colors from "../../../constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');


const Carousel = ({ data }) => {
	const flatListRef = useRef(null);
	const scrollX = useRef(new Animated.Value(0)).current;

	// Get Dimesnions
	const [activeIndex, setActiveIndex] = useState(0);

	//lang
	const { t, i18n } = useTranslation();
  	const lang = i18n.language === "english" ? "english" : "arabic"

	//nav
	const navigation = useNavigation();

	// Auto Scroll
	useEffect(() => {
		console.log("render alert")
		let interval = setInterval(() => {
			console.log("render alert")
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

	const onPressHandle = (titleEn, titleAr, clickable, type, typeId) => {
		console.log({clickable})

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
		  return navigation.navigate("ProductByEvent",{
			  eventID : typeId,
			  eventName : lang === "english" ? titleEn : titleAr
		  })
		}else if(type === "SELLER"){
		  return navigation.navigate("ProductBySeller",{
			  sellerID : typeId,
			  sellerName : lang === "english" ? titleEn : titleAr
		  })
		}
	}

	const handleScroll = ({ viewableItems }) => {
		setActiveIndex(viewableItems[0].index );
	};

	return (
			<View style={styles.screen}>			
				<Animated.FlatList
				    ref={flatListRef}
					data={data}
					style={{ width : "100%", borderRadius : font("9") }}
					inverted={ lang === "arabic" ? true : false }
					horizontal
					pagingEnabled
					decelerationRate="fast"
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item, index) => `${item.id}-${index}`}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{ useNativeDriver: true },
					)}
					onViewableItemsChanged={handleScroll}
					renderItem={({item, index}) => {
						const inputRange = [
							width * (index - 0.5),
							width  * index,
							width * (index + 0.5),
						];
						return (
							<TouchableOpacity 
								onPress={() => onPressHandle(item.titleEn, item.titleAr, item.clickable, item.type, item.typeId)} 
								style={styles.item}
								activeOpacity={1}
								disabled={!item.clickable}
							>
							<Animated.Image
								source={{ uri :item.image}}
								style={[
									styles.image,
									{
										transform: [
										{
											translateX: scrollX.interpolate({
											inputRange: [
												width *  (index - 1),
												width *  index,
												width *  (index + 1),
											],
											outputRange: lang === "english" ? [-width * 0.5, 0, width * 0.5] : [width * 0.5, 0,-width * 0.5],
											}),
										},
										],
									},
								]}
							/>
							</TouchableOpacity>
						);
					}}
				/>
				
				<SafeAreaView style={styles.containerIndicator(lang)}>
				{

					data.map((item, index) => {
						return (
								<View style={[styles.indicator,{ backgroundColor : index === activeIndex ? Colors.standardColor : "#777" }]}></View>
						)
					})

				}
				</SafeAreaView>
			</View>
	);
};

const styles = StyleSheet.create({
	screen: {
	  flex: 1,
	  justifyContent : "center",
	  alignItems : "center",
	  borderRadius : font("9"),
	},
	item: {
	  alignItems: 'center',
	  justifyContent: 'center',
	  overflow: 'hidden',
	  width : width,
	  height : height * 0.255,
	  paddingHorizontal : "2%",
	  borderRadius : font("9"),
	},
	itemOverlay: {
	  backgroundColor: 'rgba(0, 0, 0, 0.2)',
	  borderRadius : font("9")
	},
	image: {
		width : "100%",
		height : "100%",
	  	resizeMode: 'cover',
		borderRadius : font("9"),
	},
	containerIndicator : (lang) => ({
		flexDirection : lang === "english" ? "row" : "row-reverse",
	    justifyContent: 'space-around',
		alignItems: 'center',
		marginTop : font("7")
	}),
	indicator : {
		width : font("5"),
		height : font("5"),
		borderRadius : font("9"),
		backgroundColor : "#999",
		marginHorizontal : font("3"),
	}
  });
  

export default Carousel;
