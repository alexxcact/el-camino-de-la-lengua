import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { mundos } from '../data/datos';
import { COLECCIONABLES } from '../data/petroglifos';
import Petroglifo from './Petroglifo';

// Pista de dónde buscar cada petroglifo que falta.
export function pistaDe(lugar) {
  if (lugar === 'juegos') return 'En la pestaña Juegos';
  if (lugar === 'mapa') return 'Al final del camino, en el mapa';
  if (lugar === 'duelo') return 'En el Duelo de 2';
  if (lugar === 'raices') return 'En Raíces de la palabra';
  const m = mundos.find(x => `mundo${x.id}` === lugar);
  return m ? `En el mundo ${m.titulo}` : '';
}

// Colección de Progreso: los petroglifos encontrados brillan; los que faltan
// se ven como sombra, con la pista de dónde están escondidos.
export default function PiedraPetroglifos({ encontrados = [] }) {
  const [sel, setSel] = useState(null);
  const total = COLECCIONABLES.length;
  const n = COLECCIONABLES.filter(p => encontrados.includes(p.id)).length;
  const elegido = COLECCIONABLES.find(p => p.id === sel);

  return (
    <View style={s.card}>
      <Text style={s.tit}>La piedra de los petroglifos</Text>
      <Text style={s.sub}>{n} de {total} encontrados. Búscalos tallados en el juego.</Text>
      <View style={s.grilla}>
        {COLECCIONABLES.map(p => {
          const ok = encontrados.includes(p.id);
          return (
            <TouchableOpacity
              key={p.id}
              style={[s.celda, sel === p.id && s.celdaOn]}
              onPress={() => setSel(sel === p.id ? null : p.id)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={ok ? p.nombre : `Petroglifo por encontrar. ${pistaDe(p.lugar)}`}
            >
              <Petroglifo id={p.id} tamano={52} color={ok ? colors.doradoNeon : '#2C5A60'} opacity={ok ? 1 : 0.9} enColor={ok} />
              <Text style={[s.nom, !ok && s.nomOculto]} numberOfLines={2}>{ok ? p.nombre : '¿?'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {elegido && (
        <View style={s.detalle}>
          {encontrados.includes(elegido.id) ? (
            <>
              <Text style={s.detTit}>{elegido.nombre}</Text>
              <Text style={s.detTxt}>{elegido.nota || 'Figura de los petroglifos y la iconografía del pueblo Pasto.'}</Text>
            </>
          ) : (
            <Text style={s.detTxt}>Pista: {pistaDe(elegido.lugar).toLowerCase()}.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card:   { ...ui.card, padding: 16, marginBottom: 16 },
  tit:    { color: colors.cielo, fontSize: 17, fontFamily: fonts.extra },
  sub:    { color: colors.turquesaSuave, fontSize: 12, fontFamily: fonts.medium, marginTop: 2 },
  grilla: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12, rowGap: 10 },
  celda:  { width: '23%', alignItems: 'center', paddingVertical: 8, borderRadius: radii.sm, backgroundColor: 'rgba(8,26,34,0.55)', minHeight: 96, justifyContent: 'center' },
  celdaOn:{ borderWidth: 1.5, borderColor: colors.doradoNeon },
  nom:    { color: colors.cielo, fontSize: 10, fontFamily: fonts.bold, marginTop: 6, textAlign: 'center', paddingHorizontal: 2 },
  nomOculto: { color: colors.turquesaSuave },
  detalle:{ marginTop: 12, padding: 12, borderRadius: radii.sm, backgroundColor: 'rgba(8,26,34,0.55)' },
  detTit: { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.extra },
  detTxt: { color: colors.cielo, fontSize: 13, fontFamily: fonts.medium, lineHeight: 19, marginTop: 2 },
});
