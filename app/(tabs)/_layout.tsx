// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export const unstable_settings = {
  initialRouteName: 'homePage',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderRadius: 50,
          height: 60,
          position: 'absolute',
          marginHorizontal: 20,
          marginBottom: 36,
          elevation: 4,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          borderTopWidth: 0,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === 'homePage') {
            return <Entypo name="home" size={28} color={focused ? '#007AFF' : '#A0A0A0'} />;
          } 
          if (route.name === 'statisticsPage') {
            return <Entypo name="bar-graph" size={28} color={focused ? '#007AFF' : '#A0A0A0'} />;
          } 
          if (route.name === 'mealplanPage') {
            return <FontAwesome name="calendar" size={28} color={focused ? '#007AFF' : '#A0A0A0'} />;
          }
        },
      })}
    >
      <Tabs.Screen name="homePage" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="statisticsPage" options={{ title: 'Statistics', headerShown: false }} />
      <Tabs.Screen name="mealplanPage" options={{ title: 'Meal Plan', headerShown: false }} />
    </Tabs>
  );
}
