import { View, Text } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'
import MainNav from './MainNav'
import LoginScreen from '../screens/LoginScreen';
import DeliveryNav from './DeliveryNav';
const Stack = createStackNavigator();

export default function LoginNav() {

    return (
      <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown : false}}> 
          <Stack.Screen name={'login'} component={LoginScreen} />
          <Stack.Screen name='MainNav' component={MainNav}/>
          <Stack.Screen name='delivery-nav' component={DeliveryNav}/>
        </Stack.Navigator>
        </NavigationContainer>
      </>
    )
  }