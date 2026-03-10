import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";

import Search from './Screens/Search';
import SearchDetails from './Screens/SearchDetails';
import Result from './Screens/Result';
import ProductByCategory from './Screens/ProductByCategory';
import ProductByEvent from './Screens/ProductByEvent';
import ProductBySeller from './Screens/ProductBySeller';

const AuthStack  = createStackNavigator();

export default function() {
    return (
         <AuthStack.Navigator initialRouteName="Search">
            <AuthStack.Screen 
                name="Search" 
                component={Search} 
                options={{ headerLeft: null , headerShown : false,  gestureEnabled: true }} 
            />
            <AuthStack.Screen name="SearchDetails" component={SearchDetails} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted",  gestureEnabled: true }} />
            <AuthStack.Screen name="Result" component={Result} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" ,  gestureEnabled: true }} />
            <AuthStack.Screen name="ProductByCategory" component={ProductByCategory} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" ,  gestureEnabled: true }} />
            <AuthStack.Screen name="ProductByEvent" component={ProductByEvent} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" ,  gestureEnabled: true }} />
            <AuthStack.Screen name="ProductBySeller" component={ProductBySeller} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" ,  gestureEnabled: true }} />
        </AuthStack.Navigator>
    )
}