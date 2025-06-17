import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tabBarBg = isDark ? Colors.dark.card : Colors.light.card;
  const tabBarActiveTint = isDark ? '#B388FF' : '#7E57C2';
  const tabBarInactiveTint = isDark ? '#B0BEC5' : '#78909C';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveTint,
        tabBarInactiveTintColor: tabBarInactiveTint,
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: tabBarBg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            ...styles.shadow,
          },
        ],
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          paddingBottom: 8,
        },
      }}>
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
        }}
      />
      
      <Tabs.Screen
        name="tareas"
        options={{
          title: 'Tareas',
        }}
      />
      
      <Tabs.Screen
        name="finanzas"
        options={{
          title: 'Finanzas',
        }}
      />
      
      <Tabs.Screen
        name="mas"
        options={{
          title: 'Más',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 0,
    elevation: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabIconActive: {
    backgroundColor: 'rgba(126, 87, 194, 0.1)',
  },
});
