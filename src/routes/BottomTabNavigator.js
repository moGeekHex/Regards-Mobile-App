import React,{ useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import Octicons from '@react-native-vector-icons/foundation';
import AntDesign from '@react-native-vector-icons/ant-design';
import Evil from '@react-native-vector-icons/evil-icons';
import fontawesome6 from '@react-native-vector-icons/fontawesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import { fontPercent, height, font, fontValue } from '../utils/Responsive';
import Colors from '../constants/Colors';
import Title from "../components/Title"
// import modules app
import Home from '../modules/Home';
import Search from '../modules/Search';
import Favourites from '../modules/Likes/Screens/Favourites';
import Profile from '../modules/Profile';
import { useTranslation } from "react-i18next";
import Likes from '../modules/Likes';
import { useDispatch, useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();


function BottomTabNavigator({ navigation }) {

    const [searchScreenOpen, setSearchScreenOpen] = useState(null);
    const { t, i18n } = useTranslation();
    const lang = i18n.language === "english" ? "english" : "arabic"

    const dispatch = useDispatch();
    const { profile } = useSelector(state=>state.profile)

    return (
        <Tab.Navigator            
            screenOptions={{
                tabBarStyle: { 
                    position: 'absolute', 
                    height: font("58"), 
                    borderWidth : 0,
                    borderColor : "#fff", 
                    direction : i18n.language == "arabic" ? "rtl" : "ltr"
                    
                },  
                tabBarLabelStyle : {
                    paddingTop: font('3'), 
                },
                tabBarPosition : {
                    flexDirection : "row-reverse"
                },
                tabBarActiveTintColor : Colors.standardColor,
            }}
        >

            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerLeft: null,
                    headerShown: false,
                    gestureEnabled: false,
                    tabBarLabel : lang === "english" ? "Home" : "الرئيسية" ,
                    // tabBarLabelStyle : {  transform: i18n.language == "arabic" ? [{scaleX: -1}] : [{scaleX: 1}] },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.bottomTab, focused ? styles.focused : styles.default]}>
                            <Octicons name="home" color={color} size={fontValue(24)} />
                        </View>
                    ),
                    transitionSpec: {
                        animation: 'timing',
                        config: {
                          duration: 250,
                          easing: Easing.inOut(Easing.in),
                        },
                    },
                    sceneStyleInterpolator: ({ current }) => ({
                        sceneStyle: {
                          opacity: current.progress.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [0, 1, 0],
                          }),
                        },
                    }),
                }}
            />

            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    headerLeft: null,
                    headerShown: false,
                    gestureEnabled: false,
                    tabBarLabel : lang === "english" ? "Search" : "البحث" ,
                    // tabBarLabelStyle : { transform: i18n.language == "arabic" ? [{scaleX: -1}] : [{scaleX: 1}] },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.bottomTab, focused ? styles.focused : styles.default]}>
                            <Evil 
                                name="search" 
                                color={color} 
                                size={fontValue(22)} 
                                iconType="light"
                            />
                        </View>
                    ),
                    transitionSpec: {
                        animation: 'timing',
                        config: {
                          duration: 250,
                          easing: Easing.inOut(Easing.in),
                        },
                    },
                    sceneStyleInterpolator: ({ current }) => ({
                        sceneStyle: {
                          opacity: current.progress.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [0, 1, 0],
                          }),
                        },
                    }),
                }}
            />
            { 
                profile
                ?
                    <Tab.Screen
                        name="Likes"
                        component={Likes}
                        options={{
                            headerLeft: null,
                            headerShown: false,
                            gestureEnabled: false,
                            tabBarLabel : lang === "english" ? "Likes" : "أعجبني" ,
                            // tabBarLabelStyle : { transform: i18n.language == "arabic" ? [{scaleX: -1}] : [{scaleX: 1}] },
                            tabBarIcon: ({ color, size, focused }) => (
                                <View style={[styles.bottomTab, focused ? styles.focused : styles.default]}>
                                    <AntDesign 
                                        name="heart" 
                                        color={color} 
                                        size={fontValue(17)} 
                                    />
                                </View>
                            ),
                            transitionSpec: {
                                animation: 'timing',
                                config: {
                                  duration: 250,
                                  easing: Easing.inOut(Easing.in),
                                },
                            },
                            sceneStyleInterpolator: ({ current }) => ({
                                sceneStyle: {
                                  opacity: current.progress.interpolate({
                                    inputRange: [-1, 0, 1],
                                    outputRange: [0, 1, 0],
                                  }),
                                },
                            }),
                        }}
                    />
                :
                    null
            }

            <Tab.Screen
                name="user"
                component={Profile}
                options={{
                    headerLeft: null,
                    headerShown: false,
                    gestureEnabled: false,
                    tabBarLabel : lang === "english" ? "More" : "المزيد" ,
                    // tabBarLabelStyle : { transform: i18n.language == "arabic" ? [{scaleX: -1}] : [{scaleX: 1}] },
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[styles.bottomTab, focused ? styles.focused : styles.default]}>
                            <Feather name="more-horizontal" color={color} size={fontValue(20)} />
                            {/* {
                                focused
                                    ?
                                        <View style={styles.cricle} />
                                    :
                                        null
                            } */}
                        </View>
                    ),
                    transitionSpec: {
                        animation: 'timing',
                        config: {
                          duration: 250,
                          easing: Easing.inOut(Easing.in),
                        },
                    },
                    sceneStyleInterpolator: ({ current }) => ({
                        sceneStyle: {
                          opacity: current.progress.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [0, 1, 0],
                          }),
                        },
                    }),
                }}
            />

        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    focused: {
        // width: fontPercent('6.5'),
        // height: fontPercent('6.5'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: fontPercent('4'),
    },
    default: {
        // width: "100%",
        // height : fontValue("40"),
        // height: fontValue('30'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        // backgroundColor : "#000"
    },
    cricle: {
        width: font('2.5'),
        height: font('2.5'),
        top: font('4'),
        borderRadius: font('5'),
        backgroundColor: Colors.standardColor
    }
});

export default BottomTabNavigator;