import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";

import Home from './Screens/Home';
import ResultHome from './Screens/ResultHome';
import PopularDetails from './Screens/PopularDetails';
import Result from './Screens/Result';
import Deawer from './Screens/Deawer';
import Product from "../Product";
import ProductByCategory from "./Screens/ProductByCategory"
import ProductBySeller from "./Screens/ProductBySeller"
import ProductByEvent from "./Screens/ProductByEvent"

const AuthStack  = createStackNavigator();

export default function() {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen name="Home" component={Home} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted", cardStyle : { backgroundColor : "#fff"} }} />
        <AuthStack.Screen name="ResultHome" component={ResultHome} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="PopularDetails" component={PopularDetails} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="ProductByCategory" component={ProductByCategory} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="ProductBySeller" component={ProductBySeller} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="ProductByEvent" component={ProductByEvent} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="Result" component={Result} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="Deawer" component={Deawer} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
     
      </AuthStack.Navigator>
    )
}