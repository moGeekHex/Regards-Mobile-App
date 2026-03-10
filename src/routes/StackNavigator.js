import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import InitQuestions from '../modules/InitQuestions';
export default function StackNavigator() {
  return (
    <>
      <Stack.Screen name="InitQuestions" component={InitQuestions} />
    </>
  );
}