import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Splash from './Screens/Splash';
import Login from './Screens/Login';
import CorporateLogin from './Screens/CorporateLogin';

const AuthStack  = createStackNavigator();

export default function() {
    return (
      <AuthStack.Navigator initialRouteName="Login">
        <AuthStack.Screen name="Login" component={Login} options={{ headerLeft: null , headerShown : false, gestureEnabled: false  }} />
        <AuthStack.Screen name="Splash" component={Splash} options={{ headerLeft: null , headerShown : false, gestureEnabled: false  }}/>
        <AuthStack.Screen name="CorporateLogin" component={CorporateLogin} options={{ headerLeft: null , headerShown : false, gestureEnabled: false  }} />
      </AuthStack.Navigator>
    )
}