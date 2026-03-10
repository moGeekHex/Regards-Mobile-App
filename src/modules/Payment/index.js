import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";

import Payment from './Screens/Payment';
import CheckOtp from './Screens/CheckOtp';

const AuthStack  = createStackNavigator();


export default function() {
    return (
     <AuthStack.Navigator initialRouteName="Payment">
        <AuthStack.Screen name="Payment" component={Payment} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="CheckOtp" component={CheckOtp} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
     </AuthStack.Navigator>
    )
}