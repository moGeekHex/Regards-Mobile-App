import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, ScrollView, FlatList, Platform, RefreshControl } from 'react-native'
import { useScrollToTop } from '@react-navigation/native';
import { InputSearch, Card, CategoryItem, PopularItem, ButtonGroup, Title, Hr } from '../../../components';
import Colors from '../../../constants/Colors';
import { height, fontPercent, font, width } from '../../../utils/Responsive';
import { useTranslation } from "react-i18next";
import { useFocusEffect } from '@react-navigation/native';
import AwesomeLoading from 'react-native-awesome-loading';
//Redux
import { getPopularCategories, getAllCategories } from '../State/action/CategorySearchAction';
import { getPopularEvents, getAllEvents } from '../State/action/EventSearchAction';
import { getPopularSeller, getAllSeller } from '../State/action/SellerSearchAction';
import { appEvents } from '../../../events/appEvents';

const Search = ({ route ,navigation }) => {

    const scrollPopularSellerRef = useRef();
    const idSelectorParams = route.params?.idSelector;

    //Scroll
    const scrollUpScreen = React.useRef(null);
    useScrollToTop(scrollUpScreen);

    const buttonsEnglish = ['Categories','Events', 'Partners'];
    const buttonsArabic = ['التصنيفات','المناسبات','شركائنا'];;

    //lang
    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    const [searchText, setSearchText] = useState(null);
    const [openSearch, setOpenSearch] = useState(null);
    const [selectedSearch, setSelectedSearch] = useState(0);
    const [refreshing, setRefreshing] = React.useState(false);

    //Redux
    const dispatch = useDispatch();
    const { popularCategories, allCategories, loadingCategory } = useSelector(state=>state.categoriesSearch)
    const { popularEvents, allEvents } = useSelector(state=>state.eventSearch)
    const { popularSeller, allSeller, loadingSeller } = useSelector(state=>state.sellersSearch)

    const getInit = () => {
        dispatch(getPopularCategories());
        dispatch(getAllCategories())
        dispatch(getPopularEvents())
        dispatch(getAllEvents())
        dispatch(getPopularSeller(4))
        dispatch(getAllSeller())
    }

    useEffect(() => {
        getInit()
    },[])

    useEffect(() => {
        setSearchText(null)
    },[])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getInit()
        // dispatch(getFavourites());
        wait(250).then(() => setRefreshing(false));
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setSearchText(null)
            if(idSelectorParams || idSelectorParams == 0)
            {
                setSelectedSearch(idSelectorParams)
                navigation.setParams({idSelector: null})
            }
        }, [idSelectorParams])
    );

    const updateSelectedSearch = selected => {
        setSelectedSearch(selected)
    }

    return (
        <View style={styles.root}>
            <View style={styles.screen}>
            {   
                !loadingSeller && !loadingCategory
                ?
                    <>
                        <Card pushUp={ Platform.OS === "ios" ? "7" : "1" } pushDown="2" style={{ flexDirection: lang === "english" ? 'row' :'row-reverse', alignItems: 'center' }}>
                            <InputSearch
                                width={'100%'}
                                placeholder={ i18n.language === "english" ? "Regards Search" : "البحث في Regards" }
                                handleChange={(value) => { setSearchText(value), setOpenSearch(true) }}
                                value={searchText}
                                leftIconName={ lang === "english" ? "search" : "close" }   
                                leftIconPress={ () => lang === "arabic" ? setSearchText(null) : searchText ? (() => {
                                     try { appEvents({ eventName: "search", payload: { search_term: searchText } }); } catch(e) {}
                                     navigation.navigate('Result',{ searchText : searchText });
                                })() : null } 
                                rightIconName={ lang === "arabic" ? "search" : "close" }    
                                rightIconPress={ () => lang === "english" ? setSearchText(null) : searchText ? (() => {
                                     try { appEvents({ eventName: "search", payload: { search_term: searchText } }); } catch(e) {}
                                     navigation.navigate('Result',{ searchText : searchText });
                                })() : null } 
                                onSubmitEditing={() => { 
                                     try { appEvents({ eventName: "search", payload: { search_term: searchText } }); } catch(e) {}
                                     navigation.navigate('Result',{ searchText : searchText }) 
                                }}
                            />
                        </Card>
                        <ScrollView 
                            showsVerticalScrollIndicator={false} 
                            keyboardDismissMode='on-drag'
                            ref={scrollUpScreen}
                            style={{ marginBottom : '30%' }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                            nestedScrollEnabled={true}
                        >
                            {
                                <>
                                    <Card pushRight="5" pushLeft="5">
                                        <ButtonGroup
                                            onPress={updateSelectedSearch}
                                            buttons={ i18n.language === "english" ? buttonsEnglish : buttonsArabic }
                                            selectedIndex={selectedSearch}
                                        />
                                    </Card>
                                    {
                                        selectedSearch == 2
                                            ?
                                            <>
                                                <Card pushDown="3">
                                                    <Hr />
                                                </Card>
                                                <Card flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushDown="2" pushRight="2.5" pushLeft="2.5">
                                                    <Title size="2" fontWeight="500" text={t('searchTitlePopularSeller')}/>
                                                </Card>
                                                <FlatList
                                                    data={popularSeller}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({ item }) => (
                                                        <PopularItem
                                                            data={item}
                                                            source={{ uri : item.thumbnail }} 
                                                            text={lang === "english" ? item.S_nameEn :  item.S_nameAr }
                                                            style={{ marginHorizontal : width("2") }}
                                                            onPress={() => navigation.navigate('ProductBySeller',{ 
                                                                sellerID : item.id,
                                                                sellerName : lang === "english" ? item.S_nameEn : item.S_nameAr
                                                            })}
                                                        />
                                                    )}
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    snapToEnd
                                                    inverted={lang === "arabic" ? true : false}
                                                />
                                                <Card pushUp="3.8" flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushDown="2" pushRight="2.5" pushLeft="2.5">
                                                    <Title size="2" fontWeight="500" text={t('searchTitleAllSeller')} />
                                                </Card>
                                                <View style={styles.containerGifts(lang)}>
                                                    {
                                                        allSeller 
                                                        ?
                                                            allSeller.map((seller => {
                                                                return (
                                                                    <CategoryItem 
                                                                        handlePress={() => navigation.navigate('ProductBySeller',{ 
                                                                            sellerID : seller.id,
                                                                            sellerName : lang === "english" ? seller.S_nameEn : seller.S_nameAr
                                                                        })}
                                                                        source={{ uri : seller?.thumbnail ? seller.thumbnail : '' }} 
                                                                        text={lang === "english" ? seller.S_nameEn :  seller.S_nameAr }                                                               
                                                                    />
                                                                )
                                                            }))
                                                        :
                                                            null
                                                    }
                                                </View>
                                            </>
                                        : selectedSearch == 0   
                                            ?
                                                <>
                                                    <Card pushDown="3">
                                                        <Hr />
                                                    </Card>
                                                    <Card flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushDown="2" pushRight="2.5" pushLeft="2.5">
                                                        <Title size="2" fontWeight="500" text={t("searchTitlePopularCategories")} />
                                                    </Card>
                                                    <FlatList
                                                        data={popularCategories}
                                                        keyExtractor={item => item.id}
                                                        renderItem={({ item }) => (
                                                            <PopularItem
                                                                data={item}
                                                                source={{ uri : item.thumbnail }} 
                                                                text={lang === "english" ? item.nameEn : item.nameAr } 
                                                                style={{ marginHorizontal : width("2") }}
                                                                onPress={() => navigation.navigate('ProductByCategory',{ 
                                                                    categoryID : item.id,
                                                                    categoryName : lang === "english" ? item.nameEn : item.nameAr
                                                                })}
                                                            />
                                                        )}
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        snapToEnd
                                                        inverted={lang === "arabic" ? true : false}
                                                    />
                                                    <Card pushUp="3.8" flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushDown="2" pushRight="2.5" pushLeft="2.5">
                                                        <Title size="2" fontWeight="500" text={t("searchTitleAllCategories")} />
                                                    </Card>
                                                    <View style={styles.containerGifts(lang)}>
                                                        {
                                                            allCategories 
                                                            ?   
                                                                allCategories.map(category => {
                                                                    return ( 
                                                                        <CategoryItem 
                                                                            handlePress={() => navigation.navigate('ProductByCategory',{ 
                                                                                categoryID : category.id,
                                                                                categoryName : lang === "english" ? category.nameEn : category.nameAr
                                                                            })}
                                                                            source={{ uri : category.thumbnail }} 
                                                                            text={lang === "english" ? category.nameEn : category.nameAr } 
                                                                        />
                                                                    )
                                                                }) 
                                                            :
                                                                null
                                                        }
                                                    </View>
                                                </>
                                        : selectedSearch == 1
                                            ?
                                                <>
                                                    <Card pushDown="3">
                                                        <Hr />
                                                    </Card>
                                                    <Card flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushDown="2" pushRight="2.5" pushLeft="2.5">
                                                        <Title size="2" fontWeight="500" text={t('shareTitlePopularEvent')}/>
                                                    </Card>
                                                    <FlatList
                                                        data={popularEvents}
                                                        keyExtractor={item => item.id}
                                                        renderItem={({ item }) => (
                                                            <PopularItem
                                                                data={item}
                                                                source={{ uri : item.thumbnail }} 
                                                                text={lang === "english" ? item.nameEn : item.nameAr } 
                                                                style={{ marginHorizontal : width("2") }}
                                                                onPress={() => navigation.navigate('ProductByEvent',{ 
                                                                    eventID : item.id,
                                                                    eventName : lang === "english" ? item.nameEn : item.nameAr
                                                                })}
                                                            />
                                                        )}
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        snapToEnd
                                                        inverted={lang === "arabic" ? true : false}
                                                    />
                                                    <Card pushUp="3.8" flexDirection={i18n.language === "english" ? "row" : "row-reverse"} pushDown="2" pushRight="2.5" pushLeft="2.5">
                                                        <Title size="2" fontWeight="500" text={t('shareTitleAllEvent')}/>
                                                    </Card>
                                                    <View style={styles.containerGifts(lang)}>
                                                        {
                                                            allEvents 
                                                            ? 
                                                                allEvents.map(event => {
                                                                    return ( 
                                                                        <CategoryItem 
                                                                            source={{ uri : event.thumbnail }} 
                                                                            text={lang === "english" ? event.nameEn : event.nameAr } 
                                                                            handlePress={() => navigation.navigate('ProductByEvent',{ 
                                                                                eventID : event.id ,
                                                                                eventName : lang === "english" ? event.nameEn : event.nameAr
                                                                            })}                                                                    
                                                                        />
                                                                    )
                                                                })
                                                            :
                                                                null
                                                        }
                                                    </View>
                                                </>
                                            :
                                                null
                                    }
                                </>
                            }
                        </ScrollView>  
                    </>
                :
                <>
                    <AwesomeLoading indicatorId={7} size={50} isActive={true} text="loading" />
                </>
            } 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        ...Platform.select({
            ios : {
                paddingBottom: height("5"),
            },
            android : {
            }
        }),
        backgroundColor: Colors.backgroundColor,
    },
    screen: {
    },
    containerPopularProducts : {
        paddingTop : '4.5%',
        flexDirection : 'row',
        flexWrap : 'wrap',
        paddingHorizontal : '2%',
    },
    containerGifts: (lang) =>  ({
        flexDirection: lang === "english" ? 'row' : "row-reverse",
        flexWrap: 'wrap',
        // justifyContent: 'space-around',
        paddingHorizontal: width("2")
    }),
    iocn: (lang) => ({
        color: Colors.standardColor,
        paddingRight: lang === "english" ? font('10') : null,
        paddingLeft: lang === "arabic" ? font('10') : null,
        top: font('4')
    })
})

export default Search