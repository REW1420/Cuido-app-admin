import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import NewOrders from "../screens/for delivery/NewOrders";
import CompleteOrders from "../screens/for delivery/CompleteOrders";
import Icon from "react-native-vector-icons/Ionicons";

export default function MainNav() {
  const TabBar = createBottomTabNavigator();

  return (
    <NavigationContainer>
    <TabBar.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "new-orders":
              iconName = focused ? "bag-add" : "bag-add-outline";
              break;
            case "old-orders":
              iconName = focused ? "bag-check" : "bag-check-outline";
              break;
          }
          size = focused ? 30 : 25;
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#71747C",
        tabBarInactiveTintColor: "#671517",
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <TabBar.Screen name="new-orders" component={NewOrders} />
      <TabBar.Screen name="old-orders" component={CompleteOrders} />
    </TabBar.Navigator>
    </NavigationContainer>
  );
}
