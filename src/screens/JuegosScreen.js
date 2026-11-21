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
import PetroglifoEscondido from '../components/PetroglifoEscondido';
import FondoSimbolos from '../components/FondoSimbolos';
import Petroglifo from '../components/Petroglifo';
import { SIMBOLO_JUEGO, LAJA } from '../theme/pasto';
import FiguraPishku from '../components/figuras/FiguraPishku';

// Pestaña de juegos y retos: todo lo que no es el camino de los mundos.
// El mapa queda solo para recorrer el territorio.
export function abrirRepaso(navigation, falladas) {
  navigation.navigate('Quiz', {
    palabrasPractica: falladas, modoPractica: true, modoRepaso: true,
    nPreguntas: Math.min(falladas.length, 8),
  });
}

function Atajo({ icono, titulo, sub, onPress, destacado = false, accessibilityLabel, simbolo }) {
  const color = destacado ? colors.sol : colors.turquesaSuave;
  return (
    <TouchableOpacity
      style={[s.atajoBtn, destacado && s.atajoDestacado]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${titulo}. ${sub}`}
    >
      {simbolo ? (
        <View style={s.atajoSello} pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants">
          <Petroglifo id={simbolo} tamano={64} color={colors.crema} opacity={0.07} />
        </View>
      ) : null}
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
      <FondoSimbolos variante="juegos" />
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
            simbolo={SIMBOLO_JUEGO.repaso}
            titulo="Repaso"
            sub={`Vuelve a las palabras que fallaste (${falladas.length})`}
            accessibilityLabel={`Repaso de ${falladas.length} palabras que fallaste`}
            onPress={() => abrirRepaso(navigation, falladas)}
          />
        )}

        <View style={s.seccionFila}>
          <Text style={s.seccion}>Juegos</Text>
          <PetroglifoEscondido lugar="juegos" tamano={44} />
        </View>

        {/* Juego destacado: arcade para jugar por gusto */}
        <TouchableOpacity
          style={s.vuelo}
          onPress={() => navigation.navigate('Vuelo')}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={`El vuelo de Auara. Vuela por el páramo y encuentra los significados.${estado.vueloRecord ? ` Récord ${estado.vueloRecord}.` : ''}`}
        >
          <View style={s.vueloSello} pointerEvents="none">
            <Petroglifo id={SIMBOLO_JUEGO.vuelo} tamano={92} color={colors.crema} opacity={0.08} />
          </View>
          <View style={s.vueloAve}>
            <FiguraPishku width={96} height={81} animo="feliz" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.vueloNuevo}>¡JUEGA!</Text>
            <Text style={s.vueloTit}>El vuelo de Auara</Text>
            <Text style={s.vueloSub}>Vuela por el páramo y cruza la nube con el significado</Text>
            {estado.vueloRecord ? <Text style={s.vueloRecord}>Récord: {estado.vueloRecord}</Text> : null}
          </View>
          <Ionicons name="play-circle" size={34} color={colors.doradoNeon} />
        </TouchableOpacity>
        <Atajo simbolo={SIMBOLO_JUEGO.practica} icono="leaf-outline" titulo="Práctica libre" sub="Repasa las palabras que ya aprendiste" onPress={() => navigation.navigate('Practica')} />
        <Atajo
          icono="extension-puzzle-outline"
          simbolo={SIMBOLO_JUEGO.raices}
          titulo="Raíces de la palabra"
          sub={`Arma nombres de lugares con sus raíces · ${armadas}/${RAICES.length}`}
          onPress={() => navigation.navigate('Raices')}
        />
        <Atajo simbolo={SIMBOLO_JUEGO.apellido} icono="finger-print-outline" titulo="El secreto de tu apellido" sub="Descubre las raíces pastas de tu apellido" onPress={() => navigation.navigate('Apellido')} />
        <Atajo simbolo={SIMBOLO_JUEGO.duelo} icono="people-outline" titulo="Duelo de 2" sub="Jueguen juntos en este dispositivo" onPress={() => navigation.navigate('Duelo')} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  hudSafe:   { backgroundColor: colors.nocheHeader },
  content:   { paddingTop: 12, paddingBottom: 30 },
  vuelo: {
    flexDirection: 'row', alignItems: 'center', gap: 10, overflow: 'hidden',
    marginHorizontal: 16, marginBottom: 12, paddingVertical: 12, paddingRight: 14, paddingLeft: 6,
    borderRadius: radii.md, backgroundColor: LAJA.fondo, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.6)',
  },
  vueloSello: { position: 'absolute', right: 40, top: 0, bottom: 0, justifyContent: 'center' },
  vueloAve: { width: 100, alignItems: 'center' },
  vueloNuevo: { color: colors.turquesaClaro, fontSize: 10, fontFamily: fonts.extra, letterSpacing: 2 },
  vueloTit: { color: colors.doradoNeon, fontSize: 19, fontFamily: fonts.extra },
  vueloSub: { color: colors.cielo, fontSize: 12, fontFamily: fonts.medium, marginTop: 2 },
  vueloRecord: { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.bold, marginTop: 4 },
  seccionFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 20, zIndex: 2 },
  seccion:   { color: colors.cielo, fontSize: 18, fontFamily: fonts.bold, marginHorizontal: 16, marginTop: 10, marginBottom: 8 },

  atajoSello: { position: 'absolute', right: 34, top: 0, bottom: 0, justifyContent: 'center' },
  atajoBtn: {
    overflow: 'hidden',
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
