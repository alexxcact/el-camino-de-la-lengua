import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { mundos, CINEMATICAS, palabras } from '../data/datos';
import { abrirRepaso as abrirRepasoEn } from './JuegosScreen';
import { useJuego } from '../context/JuegoContext';
import { fechaHoy, seedFecha, rachaVigente } from '../context/logica';
import { elegirSaludo } from '../data/reacciones';
import HudJugador from '../components/HudJugador';
import SenderoMapa from '../components/SenderoMapa';
import Onboarding from '../components/Onboarding';
import SaludoDiario from '../components/SaludoDiario';

export default function MapaScreen({ navigation }) {
  const { estado, cargado, getPalabraDelDia, retoDiarioDisponible, verificarDesbloqueoAvatar, toastAtuendo, setToastAtuendo, marcarOnboardingVisto, marcarSaludoHoy } = useJuego();

  const nombre = estado.nombreJugador || 'Caminante';
  // Palabras marcadas como falladas (para el Repaso), mapeadas a objetos del corpus.
  const falladas = (estado.palabrasFalladas || []).map(id => palabras.find(p => p.id === id)).filter(Boolean);
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

  // Palabra del día (la tarjeta está en Juegos; aquí la usa el saludo diario):
  // se calcula en un efecto (getPalabraDelDia persiste estado, no
  // debe llamarse en render). Se recalcula también al cambiar de día sin cerrar la app.
  const [palabraDia, setPalabraDia] = useState(null);
  useEffect(() => {
    setPalabraDia(getPalabraDelDia());
  }, [estado.ultimaSesion, estado.palabraDiaFecha, estado.palabrasVistas]);

  // ── Saludo diario de un personaje (como máximo una vez al día) ──
  // Nunca en el mismo montaje en que se mostró el Onboarding, ni si hay una
  // navegación a la cinemática Final pendiente.
  const mostrarOnboarding = !!(cargado && estado.nombreJugador && !estado.onboardingVisto);
  const hoy = fechaHoy();
  // Fecha en que este montaje mostró el Onboarding (se registra en un efecto, no en
  // render). Al cambiar de día, el saludo vuelve a ser posible aunque el tab siga montado.
  const onboardingFechaRef = useRef(null);
  useEffect(() => {
    if (mostrarOnboarding) onboardingFechaRef.current = hoy;
  }, [mostrarOnboarding, hoy]);
  const finalPendiente = estado.mundosCompletados.size === 5 && !estado.finalVisto;
  const saludoPosible = !!(cargado && estado.nombreJugador && estado.onboardingVisto)
    && estado.ultimoSaludoFecha !== hoy && !finalPendiente
    && !mostrarOnboarding && onboardingFechaRef.current !== hoy;

  // La elección se fija por fecha (semilla por fecha, sin azar): solo se recalcula
  // si cambia el día, si el saludo deja de ser posible o cambia la palabra del día.
  const saludoDia = useMemo(() => {
    if (!saludoPosible || !palabraDia) return null;
    return elegirSaludo({
      nFalladas: falladas.length,
      racha: rachaVigente(estado),
      diasActivos: estado.diasActivos || [],
      hoy,
      palabraDiaId: palabraDia.id,
      nombre,
      retoDisponible: retoDiarioDisponible(),
      semilla: seedFecha(hoy),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoy, saludoPosible, palabraDia?.id]);

  // Los retos viven en la pestaña Juegos: el saludo lleva allí (initial:false
  // deja la portada de Juegos debajo para que "atrás" vuelva a ella).
  const irAJuegos = (screen, params) => navigation.navigate('JuegosTab', { screen, params, initial: false });
  const abrirRepaso = () => abrirRepasoEn({ navigate: irAJuegos }, falladas);

  const cerrarSaludo = () => marcarSaludoHoy();
  const accionSaludo = () => {
    const accion = saludoDia?.accion;
    marcarSaludoHoy();
    if (accion === 'repaso' && falladas.length > 0) abrirRepaso();
    else if (accion === 'reto') irAJuegos('RetoDiario');
  };

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
      />

      {/* Toast de atuendo nuevo */}
      {toastAtuendo && (
        <View style={s.toast} pointerEvents="none">
          <Text style={s.toastTxt}>¡Nuevo atuendo desbloqueado!</Text>
          <Text style={s.toastSub}>Míralo en Mi avatar (Progreso)</Text>
        </View>
      )}

      {/* Tutorial de bienvenida (una sola vez, tras dar el nombre) */}
      {mostrarOnboarding && (
        <Onboarding nombre={nombre} onTerminar={marcarOnboardingVisto} />
      )}

      {/* Saludo diario de un personaje (una vez al día, nunca junto al Onboarding) */}
      {saludoDia && (
        <SaludoDiario
          personaje={saludoDia.linea.personaje}
          animo={saludoDia.linea.animo}
          texto={saludoDia.linea.texto}
          accionTexto={saludoDia.accionTexto}
          onAccion={saludoDia.accion ? accionSaludo : undefined}
          onCerrar={cerrarSaludo}
        />
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
});
