
import { Dimensions, StyleSheet, Image, View } from 'react-native'
import React,{ useEffect } from 'react'
import { LogoSplash } from '../../../components';
import { fontValue } from '../../../utils/Responsive';

//Redux
import { useDispatch } from 'react-redux';
// import { initSlider } from '../../Home/State/actions/HomeAction';
import { initCategories } from '../../Home/State/actions/CategoryAction';
import { getAllEvents } from '../../Home/State/actions/PopularEventAction';
// import { initPopularProduct } from '../../Home/State/actions/PopularProductAction';
// import { initPopularEvent } from '../../Home/State/actions/PopularEventAction';
// import { getPopularSellerByHome } from '../../Search/State/action/SellerSearchAction';
// import { initGift } from '../../Home/State/actions/GiftAction';
// import { getProfile } from '../../Profile/State/actions/ProfileAction';
// import { getFavourites } from '../../Likes/State/action/FavouritesProductAction';

const Splash = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initCategories());
    dispatch(getAllEvents());
  })

  return (
    <View style={styles.screen}>
      {/* <LogoSplash width="160" height="160"/> */}
          <Image
            style ={{ width: "55%", height:"37.5%", resizeMode : "contain" }}
            source={require("../../../assets/images/logoAnd.png")}
          />  
    </View>
  )
}

const styles = StyleSheet.create({
    screen : {
          flex : 1,
          justifyContent : 'center',
          alignItems : 'center',
          backgroundColor : '#fff'
    },
    backgroundVideo: {
          position: "absolute",
          height : fontValue("120"),
          top: "40%",
          left: 0,
          alignItems: "center",
          alignSelf : "center",
          alignContent : "center",
          bottom: 0,
          right: 0,
          justifyContent : "center"
    }
})

export default Splash