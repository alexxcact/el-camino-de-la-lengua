import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import FiguraMini from './FiguraMini';
import { CINEMATICAS } from '../data/datos';
import { datosPersonaje, idPersonaje } from '../data/personajesUtil';
import { elegirLinea } from '../data/dialogos';
import { numeroDe } from '../data/reacciones';
import { rachaVigente } from '../context/logica';
import { useJuego } from '../context/JuegoContext';

// Personajes que acompañan en un mundo: los que hablan en su cinemática y, si
// el jugador tiene palabras en Repaso, la Niebla que las esconde.
export function companerosDe(mundoId, estado) {
  const escenas = CINEMATICAS[`mundo${mundoId}`]?.escenas || [];
  const ids = [...new Set(escenas.map(e => idPersonaje(e.personaje)))];
  if ((estado?.palabrasFalladas || []).length > 0 && !ids.includes('chutun')) ids.push('chutun');
  return ids.filter(id => datosPersonaje(id));
}

// Sustituye a la antigua pestaña Héroes: los personajes están de pie dentro de
// cada mundo y, al tocarlos, se presentan y dicen algo según tu progreso.
export default function CompanerosMundo({ mundoId }) {
  const { estado } = useJuego();
  const ids = useMemo(() => companerosDe(mundoId, estado), [mundoId, estado]);
  const [sel, setSel] = useState(null);
  const [linea, setLinea] = useState(null);

  if (ids.length === 0) return null;

  const tocar = (id) => {
    const ctx = { n: numeroDe(id, estado, rachaVigente(estado)), nombre: estado?.nombreJugador || '' };
    const nueva = elegirLinea({ personaje: id, momento: 'heroe', ctx, ultima: sel === id ? linea?.id : null });
    setSel(id);
    setLinea(nueva);
  };

  const p = sel ? datosPersonaje(sel) : null;

  return (
    <View style={s.card}>
      <Text style={s.lbl}>TE ACOMPAÑAN EN ESTE MUNDO</Text>
      <View style={s.fila}>
        {ids.map(id => {
          const pj = datosPersonaje(id);
          const on = sel === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => tocar(id)}
              activeOpacity={0.8}
              style={[s.pj, on && s.pjOn]}
              accessibilityRole="button"
              accessibilityLabel={`${pj.nombre}. Toca para escuchar`}
              accessibilityState={{ selected: on }}
            >
              <FiguraMini personaje={id} ancho={64} alto={72} animo={on ? (linea?.animo || 'feliz') : 'neutral'} />
              <View style={[s.suelo, { backgroundColor: on ? colors.doradoNeon : pj.color }]} />
              <Text style={[s.nom, on && { color: colors.doradoNeon }]} numberOfLines={2}>{pj.nombre}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View accessibilityLiveRegion="polite">
        {p ? (
          <View style={[s.burbuja, { borderColor: p.color }]}>
            <Text style={s.rol}>{p.rol}</Text>
            <Text style={s.txt}>{linea ? linea.texto : p.desc}</Text>
            {p.origen ? <Text style={s.origen}>{p.origen}</Text> : null}
          </View>
        ) : (
          <Text style={s.hint}>Toca a un personaje para escucharlo</Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card:    { ...ui.card, padding: 14, marginBottom: 14 },
  lbl:     { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 6 },
  fila:    { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  pj:      { alignItems: 'center', width: 76, paddingVertical: 4, minHeight: 48 },
  pjOn:    { transform: [{ scale: 1.08 }] },
  suelo:   { width: 36, height: 3, borderRadius: 2, marginTop: 2 },
  nom:     { fontSize: 11, fontFamily: fonts.semibold, color: colors.turquesaSuave, marginTop: 5, textAlign: 'center' },
  burbuja: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radii.md, borderWidth: 1.5, backgroundColor: 'rgba(8,26,34,0.92)' },
  origen:  { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.medium, fontStyle: 'italic', marginTop: 8, lineHeight: 16 },
  rol:     { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.medium, fontStyle: 'italic', marginBottom: 3 },
  txt:     { color: colors.cielo, fontSize: 14, fontFamily: fonts.semibold, lineHeight: 20 },
  hint:    { ...ui.caption, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8 },
});
