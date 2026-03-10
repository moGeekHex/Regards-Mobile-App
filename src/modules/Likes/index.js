import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";

import Favourites from './Screens/Favourites';


const AuthStack  = createStackNavigator();


export default function() {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Favourites" component={Favourites} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted"  }} />
            {/* <AuthStack.Screen name="Search" component={Search} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted"  }} /> */}
            {/* <AuthStack.Screen name="Product" component={Product} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted"  }} /> */}
        </AuthStack.Navigator>
    )
}