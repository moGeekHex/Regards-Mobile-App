import React,{ useEffect, useRef, useState } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl, FlatList } from 'react-native'
import { useScrollToTop } from '@react-navigation/native';
import { Card, PopularProduct, Title } from '../../../components';
import Colors from '../../../constants/Colors';
import { height, font, fontPercent } from '../../../utils/Responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { useTranslation } from "react-i18next";


//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getFavourites, deleteFavourite } from '../State/action/FavouritesProductAction';

const wait = (timeout) => {
     return new Promise(resolve => setTimeout(resolve, timeout));
}

const Favourites = ({ navigation }) => {

     //Redux
     const { favourites, deleteItem } = useSelector(state=>state.favouritesProduct)
     const { profile } = useSelector(state=>state.profile)
     const dispatch = useDispatch();

     const [loadingData, setLoadingData] = useState(true);
     const [refreshing, setRefreshing] = React.useState(false);

     //Scroll
     const scrollUpScreen = React.useRef(null);
     useScrollToTop(scrollUpScreen);
     const scrollRef = useRef();   
     const scrollToEnd = () => scrollRef.current.scrollToEnd({ animated: false });

     const { t, i18n } = useTranslation();
     const lang = i18n.language

     const getInit = () => {
          dispatch(getFavourites());
     }    

     const handleDeleteProduct = (id) => {
          dispatch(deleteFavourite(id))
     }

     const onRefresh = React.useCallback(() => {
          setRefreshing(true);
          getInit()
          wait(500).then(() => setRefreshing(false));
     }, []);

     useEffect(() => {
          getInit()
     },[deleteItem]);

    return (
          <View style={styles.root}>

               <Card pushUp={ Platform.OS === "ios" ? "6" : "1" } flexDirection={ lang === "english" ? 'row' : "row-reverse"}  pushDown="1" style={styles.containerHead}>
                    <View style={styles.containerIcons(lang)}/>
                    <Title size="1.8" fontWeight="500"  text={ lang === "english" ? "Likes" : "الإعجابات" }/>
                    <Card style={styles.containerIcons(lang)} flexDirection={ lang === "english" ? 'row' : "row-reverse"}>
                         <Icon style={styles.iocn(lang)} name='sort' size={font('20')}/>
                         <IconAntDesign style={styles.iocn(lang)} name='filter' size={font('20')}/>
                    </Card>
               </Card>
                    <View style={styles.screen}>
                         <View style={styles.containerPopularProducts(lang)}>
                              {/* {
                                   favourites 
                                   ?
                                        favourites.map((product => {
                                             return (  */}
                                             <FlatList
                                                  data={favourites}
                                                  keyExtractor={item => item.id}
                                                  refreshControl={
                                                       <RefreshControl
                                                            refreshing={refreshing}
                                                            onRefresh={onRefresh}
                                                       />
                                                  }
                                                  renderItem={({ item }) => (
                                                       <PopularProduct 
                                                            data={item}
                                                            large 
                                                            like={true}
                                                            mylike
                                                            onPress={ () => navigation.navigate('Product',{
                                                                 screen  : "Product",
                                                                 params : {
                                                                      id: item.id 
                                                                 }
                                                            })}   
                                                            auth={profile} 
                                                            onPressLike={ () => handleDeleteProduct(item.id) }         
                                                       />
                                                  )}
                                                  style={{ marginBottom : fontPercent("10") }}
                                                  showsVerticalScrollIndicator={false}
                                                  numColumns={2}
                                             />
                                             {/* )
                                        }))

                                   :
                                        null
                              } */}
                         </View>
                         
                    </View>
          </View>
    )
}

const styles = StyleSheet.create({
     root : {
          flex : 1,
          backgroundColor : Colors.backgroundColor,
          paddingTop : height("0.8"),
          // marginBottom : height("8")
     },
     containerPopularProducts : (lang) => ({
          flexDirection : lang === "english" ? 'row' : "row-reverse",
          justifyContent : "space-between",
          paddingHorizontal : "2%",
     }),
     containerHead : {
          justifyContent : 'space-between',
          alignItems : 'center',
          backgroundColor : '#fff'
     },
     containerIcons : (lang) => ({
          width : '22.5%',
          justifyContent : 'center',
          alignItems : 'center',
          bottom : font('2.5')
     }),
     iocn : (lang) => ({
          // color : Colors.standardColor,
          color : "#fff",
          paddingRight : lang === "english" ? font('10') : null ,
          paddingLeft : lang === "arabic" ? font('10') : null ,
          top : font('4')
    })
})
     
export default Favourites