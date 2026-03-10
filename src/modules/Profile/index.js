import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";

import Profile from './Screens/Profile';
import History from './Screens/History';
import EditProfile from './Screens/EditProfile';
import Report from './Screens/Report';
import Privacy from './Screens/Privacy';
import TermsAndConditions from './Screens/TermsAndConditions';
import Language from './Screens/Language';
import Notifications from './Screens/Notifications';
import DeleteAccount from './Screens/DeleteAccount';
import Invoice from './Screens/Invoice'
import MyGift from './Screens/MyGift'

const AuthStack  = createStackNavigator();


export default function({ navigation }) {
    return (
     <AuthStack.Navigator>
        <AuthStack.Screen name="Profile" component={Profile} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="History" component={History} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="EditProfile" component={EditProfile} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="Report" component={Report} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="Privacy" component={Privacy} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="Language" component={Language} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="Notifications" component={Notifications} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="DeleteAccount" component={DeleteAccount} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="Invoice" component={Invoice} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
        <AuthStack.Screen name="MyGift" component={MyGift} options={{ headerLeft: null , headerShown : false, gestureDirection : useTranslation().i18n.language === "english" ? "horizontal" : "horizontal-inverted" }} />
     </AuthStack.Navigator>
    )
}