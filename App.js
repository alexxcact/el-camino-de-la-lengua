import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JuegoProvider } from './src/context/JuegoContext';
import { colors } from './src/theme/colors';

import BienvenidaScreen from './src/screens/BienvenidaScreen';
import IntroScreen      from './src/screens/IntroScreen';
import MapaScreen       from './src/screens/MapaScreen';
import MundoScreen      from './src/screens/MundoScreen';
import QuizScreen       from './src/screens/QuizScreen';
import PersonajesScreen from './src/screens/PersonajesScreen';
import { ParejasScreen, DictadoScreen } from './src/screens/MisionesScreen';
import { MochilaScreen, PerfilScreen }  from './src/screens/MochilaPerfilScreen';

const Tab        = createBottomTabNavigator();
const RootStack  = createStackNavigator();
const MapaStack  = createStackNavigator();

const hdrOpts = {
  headerStyle:      { backgroundColor: colors.verde },
  headerTintColor:  colors.crema,
  headerTitleStyle: { fontWeight: '900', fontSize: 17 },
};

function MapaStackScreen() {
  return (
    <MapaStack.Navigator screenOptions={hdrOpts}>
      <MapaStack.Screen name="Mapa"    component={MapaScreen}    options={{ title: '🗺️ El Camino de la Lengua' }} />
      <MapaStack.Screen name="Mundo"   component={MundoScreen}   options={{ title: '📚 Mundo' }} />
      <MapaStack.Screen name="Quiz"    component={QuizScreen}    options={{ title: '🧠 Quiz de palabras' }} />
      <MapaStack.Screen name="Parejas" component={ParejasScreen} options={{ title: '🃏 Une las parejas' }} />
      <MapaStack.Screen name="Dictado" component={DictadoScreen} options={{ title: '✍️ Dictado cultural' }} />
    </MapaStack.Navigator>
  );
}

function PersonajesStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={hdrOpts}>
      <Stack.Screen name="PersonajesMain" component={PersonajesScreen} options={{ title: '🌿 Personajes del Camino' }} />
    </Stack.Navigator>
  );
}

function MochilaStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={hdrOpts}>
      <Stack.Screen name="MochilaMain" component={MochilaScreen} options={{ title: '📖 Mochila de palabras' }} />
    </Stack.Navigator>
  );
}

function PerfilStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={hdrOpts}>
      <Stack.Screen name="PerfilMain" component={PerfilScreen} options={{ title: '👤 Mi progreso' }} />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, focused }) {
  return <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.blanco, borderTopWidth: 2, borderTopColor: colors.arena, height: 64, paddingBottom: 8, paddingTop: 4 },
        tabBarActiveTintColor:   colors.tierra,
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle:        { fontSize: 10, fontWeight: '700' },
      }}
    >
      <Tab.Screen name="MapaTab"       component={MapaStackScreen}
        options={{ title: 'Mapa',       tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} /> }} />
      <Tab.Screen name="PersonajesTab" component={PersonajesStackScreen}
        options={{ title: 'Héroes',     tabBarIcon: ({ focused }) => <TabIcon emoji="🌿" focused={focused} /> }} />
      <Tab.Screen name="MochilaTab"    component={MochilaStackScreen}
        options={{ title: 'Mochila',    tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} /> }} />
      <Tab.Screen name="PerfilTab"     component={PerfilStackScreen}
        options={{ title: 'Progreso',   tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <JuegoProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.verde} />
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Bienvenida" component={BienvenidaScreen} />
            <RootStack.Screen name="Intro"      component={IntroScreen} />
            <RootStack.Screen name="MainTabs"   component={MainTabs} />
          </RootStack.Navigator>
        </NavigationContainer>
      </JuegoProvider>
    </SafeAreaProvider>
  );
}
