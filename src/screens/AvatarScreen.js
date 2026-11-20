import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { AVATAR_OPCIONES, CATS_AVATAR, atuendosDesbloqueados } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import AvatarSVG from '../components/AvatarSVG';
import BotonGlow from '../components/BotonGlow';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import FondoSimbolos from '../components/FondoSimbolos';
import AnillosPlato from '../components/pasto/AnillosPlato';
import Petroglifo from '../components/Petroglifo';
import { laja, LAJA } from '../theme/pasto';

const CATEGORIAS = [
  { key: 'piel',      label: 'Piel',      emoji: '🧑' },
  { key: 'cabello',   label: 'Cabello',   emoji: '💇' },
  { key: 'ropa',      label: 'Ropa',      emoji: '🧥' },
  { key: 'sombrero',  label: 'Cabeza',    emoji: '👒' },
  { key: 'adorno',    label: 'Adornos',   emoji: '📿' },
  { key: 'accesorio', label: 'Extra',     emoji: '🎒' },
  { key: 'emblema',   label: 'Emblema',   petroglifo: 'espiralDoble' },
];

// Piel y cabello son parte de quién eres: siempre disponibles.
const LIBRES = ['piel', 'cabello'];

export default function AvatarScreen({ navigation }) {
  const { estado, guardarAvatar, verificarLogros } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const [sel, setSel] = useState({ piel: 0, cabello: 0, ropa: 0, sombrero: 0, adorno: 0, accesorio: 0, emblema: 0, ...estado.avatar });
  const [cat, setCat] = useState('piel');

  // Balanceo idle de la vista previa
  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(sway, { toValue: -1, duration: 1600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-4deg', '4deg'] });

  // Índices desbloqueados de la categoría activa (la piel siempre está toda disponible)
  const desbloqueados = LIBRES.includes(cat)
    ? AVATAR_OPCIONES[cat].map((_, i) => i)
    : atuendosDesbloqueados(estado, cat);

  const elegir = (idx, libre) => {
    if (!libre) { sonar.error(); vibrar.error(); return; }
    setSel(prev => ({ ...prev, [cat]: idx }));
    sonar.pop(); vibrar.suave();
  };

  const guardar = () => {
    guardarAvatar(sel);
    verificarLogros();
    sonar.mision(); vibrar.exito();
    navigation.goBack();
  };

  return (
    <View style={s.bg}>
      <FondoSimbolos variante="progreso" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>

        {/* Vista previa */}
        <View style={s.preview}>
          <AnillosPlato tamano={220}>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <AvatarSVG avatar={sel} tamano={172} conFondo />
            </Animated.View>
          </AnillosPlato>
          <Text style={s.previewNom}>{nombre}</Text>
        </View>

        {/* Tabs de categoría */}
        <View style={s.tabs}>
          {CATEGORIAS.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[s.tab, cat === c.key && s.tabOn]}
              onPress={() => setCat(c.key)}
              activeOpacity={0.85}
            >
              {c.petroglifo
                ? <View style={s.tabSimbolo}><Petroglifo id={c.petroglifo} tamano={26} color={cat === c.key ? colors.doradoNeon : LAJA.crema} /></View>
                : <Text style={s.tabEmoji}>{c.emoji}</Text>}
              <Text style={[s.tabLbl, cat === c.key && s.tabLblOn]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Opciones de la categoría activa */}
        <View style={s.grid}>
          {AVATAR_OPCIONES[cat].map((op, idx) => {
            const libre = desbloqueados.includes(idx);
            const activa = sel[cat] === idx;
            // miniatura: el avatar actual con esta parte cambiada
            const mini = { ...sel, [cat]: idx };
            return (
              <TouchableOpacity
                key={idx}
                style={[s.tile, activa && s.tileOn, !libre && s.tileLock]}
                onPress={() => elegir(idx, libre)}
                activeOpacity={libre ? 0.85 : 1}
              >
                <View style={s.miniWrap}>
                  <AvatarSVG avatar={mini} tamano={64} />
                  {!libre && (
                    <View style={s.lockOverlay}>
                      <Ionicons name="lock-closed" size={24} color={colors.cielo} />
                    </View>
                  )}
                </View>
                <Text style={[s.tileNom, activa && { color: colors.doradoNeon }]} numberOfLines={2}>{op.nombre}</Text>
                {!libre && <Text style={s.tilePista} numberOfLines={2}>{op.pista}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <BotonGlow texto="✓ Guardar avatar" onPress={guardar} variante="primario" tamano="lg" />
        <View style={{ height: 10 }} />
        <BotonGlow texto="Cancelar" onPress={() => navigation.goBack()} variante="fantasma" tamano="md" />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  preview: {
    ...laja, borderColor: 'rgba(250,199,117,0.45)',
    alignItems: 'center', paddingVertical: 14, marginBottom: 16,
  },
  previewNom: { fontSize: 20, fontFamily: fonts.extra, color: colors.cielo, marginTop: 10 },

  tabs: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 16 },
  tab: {
    width: '22.5%', alignItems: 'center', paddingVertical: 8, borderRadius: radii.sm,
    backgroundColor: 'rgba(8,26,34,0.62)', borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.35)',
  },
  tabOn: { borderColor: colors.doradoNeon, backgroundColor: 'rgba(250,199,117,0.12)' },
  tabEmoji: { fontSize: 22 },
  tabSimbolo: { height: 29, justifyContent: 'center' },
  tabLbl: { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginTop: 2 },
  tabLblOn: { color: colors.doradoNeon },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  tile: {
    width: '31%', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4, marginBottom: 12,
    borderRadius: radii.md, backgroundColor: 'rgba(8,26,34,0.62)',
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.35)',
  },
  tileOn:   { borderColor: colors.doradoNeon, borderWidth: 2, backgroundColor: 'rgba(250,199,117,0.10)' },
  tileLock: { opacity: 0.85 },
  miniWrap: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center' },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(11,31,42,0.55)', borderRadius: 32,
  },
  tileNom:  { fontSize: 11, color: colors.cielo, fontFamily: fonts.bold, marginTop: 6, textAlign: 'center' },
  tilePista:{ fontSize: 9, color: colors.turquesaSuave, fontFamily: fonts.regular, fontStyle: 'italic', textAlign: 'center', marginTop: 2 },
});
