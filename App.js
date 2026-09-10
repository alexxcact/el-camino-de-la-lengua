import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import { JuegoProvider } from './src/context/JuegoContext';
import { colors } from './src/theme/colors';
import { fonts } from './src/theme/fonts';
import { cargarSonidos } from './src/utils/sonidos';

SplashScreen.preventAutoHideAsync().catch(() => {});

import BienvenidaScreen from './src/screens/BienvenidaScreen';
import NombreScreen     from './src/screens/NombreScreen';
import IntroScreen      from './src/screens/IntroScreen';
import FinalScreen      from './src/screens/FinalScreen';
import MapaScreen       from './src/screens/MapaScreen';
import MundoScreen      from './src/screens/MundoScreen';
import RetoDiarioScreen from './src/screens/RetoDiarioScreen';
import PracticaScreen   from './src/screens/PracticaScreen';
import DueloScreen      from './src/screens/DueloScreen';
import CinematicaScreen from './src/screens/CinematicaScreen';
import QuizScreen       from './src/screens/QuizScreen';
import EscuchaScreen    from './src/screens/EscuchaScreen';
import MemoriaScreen    from './src/screens/MemoriaScreen';
import PersonajesScreen from './src/screens/PersonajesScreen';
import DiccionarioScreen from './src/screens/DiccionarioScreen';
import AvatarScreen     from './src/screens/AvatarScreen';
import EstadisticasScreen from './src/screens/EstadisticasScreen';
import { ParejasScreen, DictadoScreen } from './src/screens/MisionesScreen';
import { MochilaScreen, PerfilScreen }  from './src/screens/MochilaPerfilScreen';

const Tab        = createBottomTabNavigator();
const RootStack  = createStackNavigator();
const MapaStack  = createStackNavigator();

const hdrOpts = {
  headerStyle:      { backgroundColor: colors.nocheHeader, shadowColor: 'transparent', elevation: 0 },
  headerTintColor:  colors.cielo,
  headerTitleStyle: { fontWeight: '900', fontSize: 17 },
};

function MapaStackScreen() {
  return (
    <MapaStack.Navigator screenOptions={hdrOpts}>
      <MapaStack.Screen name="Mapa"    component={MapaScreen}    options={{ headerShown: false }} />
      <MapaStack.Screen name="Mundo"   component={MundoScreen}   options={{ title: 'Mundo' }} />
      <MapaStack.Screen name="RetoDiario" component={RetoDiarioScreen} options={{ title: 'Reto del día' }} />
      <MapaStack.Screen name="Practica" component={PracticaScreen} options={{ title: 'Práctica libre' }} />
      <MapaStack.Screen name="Duelo"    component={DueloScreen}    options={{ headerShown: false }} />
      <MapaStack.Screen name="Cinematica" component={CinematicaScreen} options={{ headerShown: false }} />
      <MapaStack.Screen name="Quiz"    component={QuizScreen}    options={{ title: 'Quiz de palabras' }} />
      <MapaStack.Screen name="Parejas" component={ParejasScreen} options={{ title: 'Une las parejas' }} />
      <MapaStack.Screen name="Dictado" component={DictadoScreen} options={{ title: 'Dictado cultural' }} />
      <MapaStack.Screen name="Escucha" component={EscuchaScreen} options={{ title: 'Escucha y elige' }} />
      <MapaStack.Screen name="Memoria" component={MemoriaScreen} options={{ title: 'Memoria andina' }} />
    </MapaStack.Navigator>
  );
}

function PersonajesStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={hdrOpts}>
      <Stack.Screen name="PersonajesMain" component={PersonajesScreen} options={{ title: 'Personajes del Camino' }} />
    </Stack.Navigator>
  );
}

function MochilaStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={hdrOpts}>
      <Stack.Screen name="MochilaMain" component={MochilaScreen} options={{ title: 'Mochila de palabras' }} />
    </Stack.Navigator>
  );
}

function DiccionarioStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={hdrOpts}>
      <Stack.Screen name="DiccionarioMain" component={DiccionarioScreen} options={{ title: 'Diccionario Pasto' }} />
    </Stack.Navigator>
  );
}

function PerfilStackScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={hdrOpts}>
      <Stack.Screen name="PerfilMain" component={PerfilScreen} options={{ title: 'Mi progreso' }} />
      <Stack.Screen name="Avatar"     component={AvatarScreen} options={{ title: 'Mi avatar' }} />
      <Stack.Screen name="Estadisticas" component={EstadisticasScreen} options={{ title: 'Mis estadísticas' }} />
    </Stack.Navigator>
  );
}

function TabIcon({ name, focused, color }) {
  return <Ionicons name={focused ? name : `${name}-outline`} size={24} color={color} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.nocheHeader, borderTopWidth: 0, height: 68, paddingBottom: 10, paddingTop: 6, elevation: 0 },
        tabBarActiveTintColor:   colors.doradoNeon,
        tabBarInactiveTintColor: colors.turquesaSuave,
        tabBarLabelStyle:        { fontSize: 10, fontFamily: fonts.bold },
      }}
    >
      <Tab.Screen name="MapaTab"       component={MapaStackScreen}
        options={{ title: 'Mapa',       tabBarIcon: ({ focused, color }) => <TabIcon name="map" focused={focused} color={color} /> }} />
      <Tab.Screen name="PersonajesTab" component={PersonajesStackScreen}
        options={{ title: 'Héroes',     tabBarIcon: ({ focused, color }) => <TabIcon name="leaf" focused={focused} color={color} /> }} />
      <Tab.Screen name="MochilaTab"    component={MochilaStackScreen}
        options={{ title: 'Mochila',    tabBarIcon: ({ focused, color }) => <TabIcon name="book" focused={focused} color={color} /> }} />
      <Tab.Screen name="DiccionarioTab" component={DiccionarioStackScreen}
        options={{ title: 'Diccionario', tabBarIcon: ({ focused, color }) => <TabIcon name="library" focused={focused} color={color} /> }} />
      <Tab.Screen name="PerfilTab"     component={PerfilStackScreen}
        options={{ title: 'Progreso',   tabBarIcon: ({ focused, color }) => <TabIcon name="person" focused={focused} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  useEffect(() => { cargarSonidos(); }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <JuegoProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.noche} />
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Bienvenida" component={BienvenidaScreen} />
            <RootStack.Screen name="Nombre"     component={NombreScreen} />
            <RootStack.Screen name="Intro"      component={IntroScreen} />
            <RootStack.Screen name="MainTabs"   component={MainTabs} />
            <RootStack.Screen name="Final"      component={FinalScreen} />
          </RootStack.Navigator>
        </NavigationContainer>
      </JuegoProvider>
      </View>
    </SafeAreaProvider>
  );
}
