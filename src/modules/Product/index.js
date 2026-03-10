import React from "react";
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

import { useTranslation } from "react-i18next";

import Product from './Screens/Product';
import ProviderScreen from './Screens/ProviderScreen';

const ProductStack  = createStackNavigator();

export default function() {
    return (
     <ProductStack.Navigator initialRouteName="Product">
        <ProductStack.Screen name="Product" component={Product} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <ProductStack.Screen name="ProviderScreen" component={ProviderScreen} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
     </ProductStack.Navigator>
    )
}