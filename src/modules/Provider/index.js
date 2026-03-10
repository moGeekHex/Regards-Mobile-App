import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";

import ProviderScreen from '../Product/Screens/ProviderScreen';

const AuthStack  = createStackNavigator();


export default function({ navigation }) {
    return (
     <AuthStack.Navigator>
        {/* <AuthStack.Screen name="ProviderScreen" component={ProviderScreen} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} /> */}
     </AuthStack.Navigator>
    )
}