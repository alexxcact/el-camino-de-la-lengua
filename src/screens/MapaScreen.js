import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { mundos } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import HudJugador from '../components/HudJugador';
import SenderoMapa from '../components/SenderoMapa';
import TarjetaPalabraDia from '../components/TarjetaPalabraDia';

export default function MapaScreen({ navigation }) {
  const { estado, getPalabraDelDia, retoDiarioDisponible } = useJuego();

  const nombre = estado.nombreJugador || 'Caminante';
  const hora = new Date().getHours();
  const saludo = hora >= 5 && hora < 12 ? '¡Buenos días' : hora >= 12 && hora < 18 ? '¡Buenas tardes' : '¡Buenas noches';

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
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  hudSafe:   { backgroundColor: colors.nocheHeader },
});
