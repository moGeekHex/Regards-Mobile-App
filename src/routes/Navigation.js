import React,{ useState, useEffect } from 'react';
import {Dimensions, Platform} from 'react-native';
import { NavigationContainer, useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import * as RootNavigation from './RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesApi from '../constants/RoutesApi';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Splash from '../modules/Auth/Screens/Splash';
import Login from '../modules/Auth';
import Product from '../modules/Product';
import Payment from '../modules/Payment';
import Thanks from '../modules/Thanks/Screens/Thanks';
import Profile from '../modules/Profile';
import Filter from '../modules/Home/Screens/Filter';
import ProviderScreen from '../modules/Provider';
import FilterSearch from '../modules/Search/Screens/FilterSearch';
import HowToUse from '../modules/Home/Screens/HowToUse';
import { useTranslation } from "react-i18next";

//firebase
import analytics from '@react-native-firebase/analytics';

//Redux
import { useDispatch, useSelector, Provider } from 'react-redux';
import { getMyWallet } from "../store/State/actions/MyWalletAction"
// import { getCategories } from '../modules/Search/State/action/CategorySearchAction';
import Likes from '../modules/Likes';
import { font } from '../utils/Responsive';
import API_PATH from '../constants/RoutesApi';

const MainStackIos  = createStackNavigator();
const MainStackAndroid  = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default () => {
    
    const {otp} = useSelector(state=>state.auth)
    const {loginCorporate} = useSelector(state=>state.authCorporate)

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState(null);
    const { profile } = useSelector(state=>state.profile)

    const lang = useTranslation().i18n.language 

    const dispatch = useDispatch();

    const width = Dimensions.get("screen").width;

    const navigationRef = useNavigationContainerRef();
    const routeNameRef = React.useRef();

  useEffect(() => {
    if(profile)
    {
      dispatch(getMyWallet())
    }
  },[profile])

    const getData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const fcmtoken = await AsyncStorage.getItem('fcmtoken')

        const user = JSON.parse(userData)

        const Auth = 'Bearer '.concat(user?.token);

        if(user)
        {        
          if(user.user.fcm !== fcmtoken)
          {
            var config = {
              method: 'patch',
              url: `${RoutesApi}/notifications/fcmUpdate`,
              headers: { 
                'Authorization': Auth
              },
              data : {
                fcm : fcmtoken
              }
            };

            axios(config)
            .then(resp => console.log("success req"))
            .catch(function (err) {
              console.log("error ", err)
            });
          }else{
            setUser(null)
          }
        }

        setUser(userData);
      } catch(e) {
        console.log(e, ' error');
      }
    }

    useEffect(() => {
      getData()
      setTimeout(() => {
        setIsLoading(!isLoading);
      }, 1500);
    },[]);

    useEffect(() => {
      getData()
    },[otp,loginCorporate])

    useEffect(() => {
      fetch(`${API_PATH}/categories`)
      .then((res) => res.json())
      .then((json) => {
        setCategories(json)
      })
    },[])

    const insets = useSafeAreaInsets();
  
    return (
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          console.log("currentRouteName ", currentRouteName)

          if (previousRouteName !== currentRouteName) {
            console.log("currentRouteName if ", currentRouteName)
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
      >
          {
            Platform.OS === "ios" 
            ?

              isLoading ? (
                <MainStackIos.Navigator screenOptions={(navigation) => ({
                  animationEnabled : true,
                  drawerItemStyle: {
                    borderRadius: 0,
                    width: '100%',
                    marginLeft: 0
                }
                })}>
                  <MainStackIos.Screen 
                    name="Splash" 
                    component={Splash} 
                    options={{ headerLeft: null , headerShown : false, gestureEnabled: false }} 
                  />
                </MainStackIos.Navigator>
              ) : 
                (
                  <MainStackIos.Navigator 
                    screenOptions={{
                      gestureEnabled: true, // Enable swipe-back gesture
                      gestureDirection: 'horizontal', // Set the direction of the gesture (horizontal or vertical)
                      // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Optional, for smooth animation
                    }}
                  >
                    {
                      user   
                      ?
                        null
                      :
                        <MainStackIos.Screen 
                          name="Login" 
                          component={Login} 
                          options={{ headerLeft: null , headerShown : false, gestureEnabled: false }} 
                        />
                    }
                    <MainStackIos.Screen 
                      name="App" 
                      component={BottomTabNavigator} 
                      options={{ headerLeft: null , headerShown : false, gestureEnabled: false }} 
                    />
                    <MainStackIos.Screen 
                      name="Product" 
                      component={Product} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />  
                    <MainStackIos.Screen 
                      name="Payment" 
                      component={Payment} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />                  
                    <MainStackIos.Screen 
                      name="Thanks" 
                      component={Thanks} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackIos.Screen 
                      name="Profile" 
                      component={Profile} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackIos.Screen
                      name="Filter"
                      component={Filter}
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackIos.Screen
                      name="FilterSearch"
                      component={FilterSearch }
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
            
                    <MainStackIos.Screen 
                      name="ProviderScreen" 
                      component={ProviderScreen} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackIos.Screen 
                      name="Likes" 
                      component={Likes} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackIos.Screen 
                      name="HowToUse" 
                      component={HowToUse} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                  </MainStackIos.Navigator>
                )
            :
              isLoading ? (
                <MainStackAndroid.Navigator screenOptions={(navigation) => ({
                  animationEnabled : true,
                  drawerItemStyle: {
                    borderRadius: 0,
                    width: '100%',
                    marginLeft: 0
                }
                })}>
                  <MainStackAndroid.Screen 
                    name="Splash" 
                    component={Splash} 
                    options={{ headerLeft: null , headerShown : false, gestureEnabled: false }} 
                  />
                </MainStackAndroid.Navigator>
              ) : 
                (
                  <MainStackAndroid.Navigator 
                    screenOptions={{
                      gestureEnabled: true, // Enable swipe-back gesture
                      gestureDirection: 'horizontal', // Set the direction of the gesture (horizontal or vertical)
                      // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Optional, for smooth animation
                    }}
                  >
                    {
                      user   
                      ?
                        null
                      :
                        <MainStackAndroid.Screen 
                          name="Login" 
                          component={Login} 
                          options={{ headerLeft: null , headerShown : false, gestureEnabled: false }} 
                        />
                    }
                    <MainStackAndroid.Screen 
                      name="App" 
                      component={BottomTabNavigator} 
                      options={{ headerLeft: null , headerShown : false, gestureEnabled: false }} 
                    />
                    <MainStackAndroid.Screen 
                      name="Product" 
                      component={Product} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />  
                    <MainStackAndroid.Screen 
                      name="Payment" 
                      component={Payment} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />                  
                    <MainStackAndroid.Screen 
                      name="Thanks" 
                      component={Thanks} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackAndroid.Screen 
                      name="Profile" 
                      component={Profile} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackAndroid.Screen
                      name="Filter"
                      component={Filter}
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackAndroid.Screen
                      name="FilterSearch"
                      component={FilterSearch }
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
            
                    <MainStackAndroid.Screen 
                      name="ProviderScreen" 
                      component={ProviderScreen} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackAndroid.Screen 
                      name="Likes" 
                      component={Likes} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                    <MainStackAndroid.Screen 
                      name="HowToUse" 
                      component={HowToUse} 
                      options={{ headerLeft: null , headerShown : false, gestureDirection : lang === "english" ? "horizontal" : "horizontal-inverted" }} 
                    />
                  </MainStackAndroid.Navigator>
                )
          }
      </NavigationContainer>
      
    );
};