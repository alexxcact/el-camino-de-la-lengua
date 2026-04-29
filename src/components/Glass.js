import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

/**
 * Tarjeta glassmorphism reutilizable.
 * Props:
 *  tipo: 'claro' | 'oscuro' | 'dorado'  (default 'claro')
 *  intensidad: 20-100                    (default 60)
 *  bordeBrillante: bool                  (default false)
 *  style: estilos adicionales
 */
export default function Glass({
  tipo = 'claro',
  intensidad = 60,
  bordeBrillante = false,
  style,
  children,
}) {
  const tintMap   = { claro: 'light', oscuro: 'dark', dorado: 'default' };
  const colorMap  = { claro: colors.glassClaro, oscuro: colors.glassOscuro, dorado: colors.glassDorado };

  if (Platform.OS === 'android') {
    return (
      <View style={[s.base, { backgroundColor: colorMap[tipo] }, bordeBrillante && s.brillante, style]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensidad}
      tint={tintMap[tipo]}
      style={[s.base, bordeBrillante && s.brillante, style]}
    >
      {children}
    </BlurView>
  );
}

const s = StyleSheet.create({
  base: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  brillante: {
    borderWidth: 1.5,
    borderColor: colors.glassBorde,
    shadowColor: colors.doradoBrillo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
});
