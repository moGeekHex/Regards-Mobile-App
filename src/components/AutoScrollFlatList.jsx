import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { FlatList, Image, StyleSheet } from "react-native";
import PopularItem from "./PopularItem"
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { font } from "../utils/Responsive";
const width = Dimensions.get("screen").width;


export default AutoScrollFlatList = ({ data, interval }) => {

    const navigation = useNavigation();

    const imageRef = useRef();
    const [active, setActive] = useState(0);
    const indexRef = useRef(active);
    indexRef.current = active;

    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    useInterval(() => {
        if (active < Number(data?.length) - 1) {
            setActive(active + 1);
        } else {
            setActive(0);
        }
    }, interval);

    useEffect(() => {
        imageRef.current.scrollToIndex({ index: active, animated: true });
    }, [active]);

    const onViewableItemsChangedHandler = useCallback(
        ({ viewableItems, changed }) => {
            if (active != 0) {
                setActive(viewableItems[0]?.index);
            }
        },
        []
    );

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChangedHandler}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
            }}
            style={{ flex : 1 }}
            ref={imageRef}
            data={data}
            horizontal
            inverted={lang === "arabic" ? true : false}

            // scrollEnabled
            // onScroll={}
            renderItem={({ item }) => (
                <PopularItem 
                    source={{uri: item?.thumbnail}} 
                    text={ lang === "english"? item.S_nameEn : item.S_nameAr}
                    onPress={() => navigation.navigate('PopularDetails',{ 
                        sellerID : item.id,
                        itemName : lang === "english" ? item.S_nameEn : item.S_nameAr
                    })}
                />
            )}
        />
    );
};

const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};