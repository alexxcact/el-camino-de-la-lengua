import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { mundos } from '../data/datos';
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
  // debe llamarse en render). Se recalcula si cambia la fecha asignada.
  const [palabraDia, setPalabraDia] = useState(null);
  useEffect(() => {
    setPalabraDia(getPalabraDelDia());
  }, [estado.palabraDiaFecha, estado.palabrasVistas]);

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
        onSelect={(mundoId) => navigation.navigate('Mundo', { mundoId })}
        cabecera={
          <TarjetaPalabraDia
            palabra={palabraDia}
            retoCompletado={!retoDiarioDisponible()}
            onReto={() => navigation.navigate('RetoDiario')}
          />
        }
      />

      {/* Toast de atuendo nuevo */}
      {toastAtuendo && (
        <View style={s.toast} pointerEvents="none">
          <Text style={s.toastTxt}>🎁 ¡Nuevo atuendo desbloqueado!</Text>
          <Text style={s.toastSub}>Míralo en 🎨 Mi avatar (Progreso)</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  hudSafe:   { backgroundColor: colors.nocheHeader },
  toast: {
    position: 'absolute', top: 110, alignSelf: 'center',
    backgroundColor: colors.nocheCard, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 18, borderWidth: 1.5, borderColor: colors.doradoNeon, alignItems: 'center',
    shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 10,
  },
  toastTxt: { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.extra },
  toastSub: { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.medium, marginTop: 2 },
});
