import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radii } from '../theme/ui';
import { palabras } from '../data/datos';
import { RAICES } from '../data/raices';
import { useJuego } from '../context/JuegoContext';
import { rachaVigente } from '../context/logica';
import HudJugador from '../components/HudJugador';
import TarjetaPalabraDia from '../components/TarjetaPalabraDia';

// Pestaña de juegos y retos: todo lo que no es el camino de los mundos.
// El mapa queda solo para recorrer el territorio.
export function abrirRepaso(navigation, falladas) {
  navigation.navigate('Quiz', {
    palabrasPractica: falladas, modoPractica: true, modoRepaso: true,
    nPreguntas: Math.min(falladas.length, 8),
  });
}

function Atajo({ icono, titulo, sub, onPress, destacado = false, accessibilityLabel }) {
  const color = destacado ? colors.sol : colors.turquesaSuave;
  return (
    <TouchableOpacity
      style={[s.atajoBtn, destacado && s.atajoDestacado]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${titulo}. ${sub}`}
    >
      <View style={[s.atajoIcono, destacado && s.atajoIconoDestacado]}><Ionicons name={icono} size={25} color={color} /></View>
      <View style={s.atajoContenido}>
        <Text style={s.atajoTitulo}>{titulo}</Text>
        <Text style={s.atajoSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={color} />
    </TouchableOpacity>
  );
}

export default function JuegosScreen({ navigation }) {
  const { estado, getPalabraDelDia, retoDiarioDisponible } = useJuego();

  const falladas = (estado.palabrasFalladas || []).map(id => palabras.find(p => p.id === id)).filter(Boolean);
  const armadas = (estado.raicesArmadas || []).filter(p => RAICES.some(r => r.palabra === p)).length;

  // getPalabraDelDia persiste estado: se llama en un efecto, no en render.
  const [palabraDia, setPalabraDia] = useState(null);
  useEffect(() => {
    setPalabraDia(getPalabraDelDia());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.ultimaSesion, estado.palabraDiaFecha, estado.palabrasVistas]);

  return (
    <View style={s.container}>
      <SafeAreaView edges={['top']} style={s.hudSafe}>
        <HudJugador />
      </SafeAreaView>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <TarjetaPalabraDia
          palabra={palabraDia}
          retoCompletado={!retoDiarioDisponible()}
          onReto={() => navigation.navigate('RetoDiario')}
          racha={rachaVigente(estado)}
        />

        {falladas.length > 0 && (
          <Atajo
            destacado
            icono="refresh"
            titulo="Repaso"
            sub={`Vuelve a las palabras que fallaste (${falladas.length})`}
            accessibilityLabel={`Repaso de ${falladas.length} palabras que fallaste`}
            onPress={() => abrirRepaso(navigation, falladas)}
          />
        )}

        <Text style={s.seccion}>Juegos</Text>
        <Atajo icono="leaf-outline" titulo="Práctica libre" sub="Repasa las palabras que ya aprendiste" onPress={() => navigation.navigate('Practica')} />
        <Atajo
          icono="extension-puzzle-outline"
          titulo="Raíces de la palabra"
          sub={`Arma nombres de lugares con sus raíces · ${armadas}/${RAICES.length}`}
          onPress={() => navigation.navigate('Raices')}
        />
        <Atajo icono="finger-print-outline" titulo="El secreto de tu apellido" sub="Descubre las raíces pastas de tu apellido" onPress={() => navigation.navigate('Apellido')} />
        <Atajo icono="people-outline" titulo="Duelo de 2" sub="Jueguen juntos en este dispositivo" onPress={() => navigation.navigate('Duelo')} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  hudSafe:   { backgroundColor: colors.nocheHeader },
  content:   { paddingTop: 12, paddingBottom: 30 },
  seccion:   { color: colors.cielo, fontSize: 18, fontFamily: fonts.bold, marginHorizontal: 16, marginTop: 10, marginBottom: 8 },

  atajoBtn: {
    marginHorizontal: 16, marginTop: 4, marginBottom: 10,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.md,
    backgroundColor: colors.nocheCard, borderWidth: 1,
    borderColor: 'rgba(159,225,203,0.16)', minHeight: 76,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  atajoDestacado: { borderColor: 'rgba(242,177,52,0.5)' },
  atajoIconoDestacado: { backgroundColor: 'rgba(242,177,52,0.14)' },
  atajoIcono: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(159,225,203,0.08)' },
  atajoContenido: { flex: 1, minWidth: 0 },
  atajoTitulo: { color: colors.cielo, fontSize: 16, fontFamily: fonts.extra },
  atajoSub: { color: colors.turquesaSuave, fontSize: 13, lineHeight: 18, fontFamily: fonts.regular, marginTop: 1 },
});
