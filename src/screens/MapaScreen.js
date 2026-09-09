import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { mundos, CINEMATICAS } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import HudJugador from '../components/HudJugador';
import SenderoMapa from '../components/SenderoMapa';
import TarjetaPalabraDia from '../components/TarjetaPalabraDia';

export default function MapaScreen({ navigation }) {
  const { estado, getPalabraDelDia, retoDiarioDisponible, verificarDesbloqueoAvatar, toastAtuendo, setToastAtuendo } = useJuego();

  const nombre = estado.nombreJugador || 'Caminante';
  const hora = new Date().getHours();
  const saludo = hora >= 5 && hora < 12 ? '¡Buenos días' : hora >= 12 && hora < 18 ? '¡Buenas tardes' : '¡Buenas noches';

  // Sincroniza atuendos desbloqueados cuando cambia el progreso. La primera vez
  // (al entrar al mapa) es silenciosa para no mostrar toast de lo ya ganado.
  const primeraSync = useRef(true);
  useEffect(() => {
    verificarDesbloqueoAvatar(primeraSync.current);
    primeraSync.current = false;
  }, [estado.mundosCompletados.size, estado.palabrasVistas.size, estado.racha]);

  // Auto-oculta el toast de atuendo nuevo
  useEffect(() => {
    if (!toastAtuendo) return;
    const t = setTimeout(() => setToastAtuendo(null), 2800);
    return () => clearTimeout(t);
  }, [toastAtuendo]);

  // Palabra del día: se calcula en un efecto (getPalabraDelDia persiste estado, no
  // debe llamarse en render). Se recalcula también al cambiar de día sin cerrar la app.
  const [palabraDia, setPalabraDia] = useState(null);
  useEffect(() => {
    setPalabraDia(getPalabraDelDia());
  }, [estado.ultimaSesion, estado.palabraDiaFecha, estado.palabrasVistas]);

  // Entra a un mundo: la PRIMERA vez muestra su cinemática de entrada; luego, directo.
  // (El auto-completar y el paso de mundoId quedan igual: solo se interpone la cinemática.)
  const irAlMundo = (mundoId) => {
    const clave = `mundo${mundoId}`;
    if (CINEMATICAS[clave] && !(estado.cinematicasVistas || []).includes(clave)) {
      navigation.navigate('Cinematica', { clave, mundoId });
    } else {
      navigation.navigate('Mundo', { mundoId });
    }
  };

  // Cinemática final al completar los 5 mundos (una sola vez)
  useEffect(() => {
    if (estado.mundosCompletados.size === 5 && !estado.finalVisto) {
      const t = setTimeout(() => navigation.navigate('Final'), 400);
      return () => clearTimeout(t);
    }
  }, [estado.mundosCompletados.size, estado.finalVisto]);

  return (
    <View style={s.container}>
      <SafeAreaView edges={['top']} style={s.hudSafe}>
        <HudJugador />
      </SafeAreaView>

      <SenderoMapa
        mundos={mundos}
        estado={estado}
        saludo={saludo}
        nombre={nombre}
        onSelect={irAlMundo}
        cabecera={
          <View>
            <TarjetaPalabraDia
              palabra={palabraDia}
              retoCompletado={!retoDiarioDisponible()}
              onReto={() => navigation.navigate('RetoDiario')}
            />
            <TouchableOpacity style={s.atajoBtn} onPress={() => navigation.navigate('Practica')} activeOpacity={0.85} accessibilityRole="button">
              <View style={s.atajoIcono}><Ionicons name="leaf-outline" size={25} color={colors.turquesaSuave} /></View>
              <View style={s.atajoContenido}>
                <Text style={s.atajoTitulo}>Práctica libre</Text>
                <Text style={s.atajoSub}>Repasa las palabras que ya aprendiste</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.turquesaSuave} />
            </TouchableOpacity>
            <TouchableOpacity style={[s.atajoBtn, s.atajoUltimo]} onPress={() => navigation.navigate('Duelo')} activeOpacity={0.85} accessibilityRole="button">
              <View style={s.atajoIcono}><Ionicons name="people-outline" size={25} color={colors.turquesaSuave} /></View>
              <View style={s.atajoContenido}>
                <Text style={s.atajoTitulo}>Duelo de 2</Text>
                <Text style={s.atajoSub}>Jueguen juntos en este dispositivo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.turquesaSuave} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Toast de atuendo nuevo */}
      {toastAtuendo && (
        <View style={s.toast} pointerEvents="none">
          <Text style={s.toastTxt}>¡Nuevo atuendo desbloqueado!</Text>
          <Text style={s.toastSub}>Míralo en Mi avatar (Progreso)</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  hudSafe:   { backgroundColor: colors.nocheHeader },
  toast: {
    ...ui.cardDestacada,
    position: 'absolute', top: 110, alignSelf: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: radii.md, borderColor: 'rgba(250,199,117,0.6)', alignItems: 'center',
  },
  toastTxt: { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.extra },
  toastSub: { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.medium, marginTop: 2 },

  atajoBtn: {
    marginHorizontal: 16, marginTop: 4, marginBottom: 10,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.md,
    backgroundColor: colors.nocheCard, borderWidth: 1,
    borderColor: 'rgba(159,225,203,0.16)', minHeight: 76,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  atajoUltimo: { marginBottom: 16 },
  atajoIcono: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(159,225,203,0.08)' },
  atajoContenido: { flex: 1, minWidth: 0 },
  atajoTitulo: { color: colors.cielo, fontSize: 16, fontFamily: fonts.extra },
  atajoSub: { color: colors.turquesaSuave, fontSize: 13, lineHeight: 18, fontFamily: fonts.regular, marginTop: 1 },
});
