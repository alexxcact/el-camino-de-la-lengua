import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radii, acento } from '../theme/ui';
import { mundos } from '../data/datos';
import { decirPalabra } from '../utils/voz';
import PalabraIlustrada from './PalabraIlustrada';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const fechaLarga = (d = new Date()) => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;

// Franja tejida: rombos escalonados como en una faja o ruana pasto, con el
// color del mundo de la palabra. Se repite según el ancho medido.
function FranjaTejida({ color, alto = 16 }) {
  const [ancho, setAncho] = useState(0);
  const paso = alto * 1.75;
  const n = ancho ? Math.ceil(ancho / paso) + 1 : 0;
  const m = alto / 2;
  const d = [];
  const relleno = [];
  for (let i = 0; i < n; i++) {
    const cx = i * paso + paso / 2;
    d.push(`M${cx - m} ${m} L${cx} 1 L${cx + m} ${m} L${cx} ${alto - 1} Z`);
    relleno.push(`M${cx - m / 2.4} ${m} L${cx} ${m - m / 2.4} L${cx + m / 2.4} ${m} L${cx} ${m + m / 2.4} Z`);
    // Dientes entre rombos (arriba y abajo).
    const x = i * paso;
    relleno.push(`M${x - 3} 0 L${x} 4 L${x + 3} 0 Z`, `M${x - 3} ${alto} L${x} ${alto - 4} L${x + 3} ${alto} Z`);
  }
  return (
    <View style={{ height: alto }} onLayout={e => setAncho(e.nativeEvent.layout.width)} pointerEvents="none">
      {n > 0 && (
        <Svg width={ancho} height={alto}>
          <Rect x={0} y={0} width={ancho} height={alto} fill="rgba(8,26,34,0.85)" />
          <Path d={d.join(' ')} stroke={colors.doradoNeon} strokeWidth={1.4} fill="none" />
          <Path d={relleno.join(' ')} fill={color} />
        </Svg>
      )}
    </View>
  );
}

/**
 * Tarjeta "Palabra de hoy" (pestaña Juegos), con aire de tejido: franja de
 * rombos del color del mundo, la ilustración propia de la palabra en un rombo,
 * su grafía y ejemplo, y el Reto del día.
 * Props:
 *  palabra        objeto de datos.js
 *  retoCompletado bool — si ya completó el reto diario hoy
 *  onReto         () => void — abre el reto diario
 *  racha          número de días seguidos (opcional)
 *  fecha          Date (opcional, para tests)
 */
export default function TarjetaPalabraDia({ palabra, retoCompletado, onReto, racha = 0, fecha }) {
  if (!palabra) return null;
  const mundo = mundos.find(m => m.id === palabra.mundo);
  const color = acento(palabra.mundo);

  return (
    <View style={[s.wrap, { borderColor: color }]}>
      <FranjaTejida color={color} />

      <View style={s.cuerpo}>
        <View style={s.cabecera}>
          <Text style={s.etiqueta}>PALABRA DE HOY</Text>
          <Text style={s.fecha}>{fechaLarga(fecha)}</Text>
        </View>

        <View style={s.fila}>
          <View style={[s.rombo, { borderColor: color }]}>
            <View style={s.romboDentro}>
              <PalabraIlustrada palabra={palabra} tamano={58} />
            </View>
          </View>
          <View style={s.textos}>
            <Text style={s.past} numberOfLines={1} adjustsFontSizeToFit>{palabra.p}</Text>
            <Text style={s.fon}>se escribe: {palabra.fon}</Text>
            <Text style={s.esp}>{palabra.e}</Text>
          </View>
          <TouchableOpacity
            style={[s.audioBtn, { borderColor: color }]}
            onPress={() => decirPalabra(palabra.p)}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={`Escuchar ${palabra.p} con voz sintética de práctica`}
          >
            <Ionicons name="volume-high" size={20} color={colors.cielo} />
          </TouchableOpacity>
        </View>

        {palabra.ej ? <Text style={[s.ej, { borderLeftColor: color }]} numberOfLines={3}>{palabra.ej}</Text> : null}

        <View style={s.chips}>
          <View style={s.chip}><Text style={s.chipTxt}>{palabra.cat}</Text></View>
          {mundo ? (
            <View style={[s.chip, { borderColor: color }]}>
              <Text style={[s.chipTxt, { color }]}>Mundo {mundo.id} · {mundo.titulo}</Text>
            </View>
          ) : null}
        </View>

        {retoCompletado ? (
          <View style={s.hecho}>
            <Ionicons name="checkmark-circle" size={20} color={colors.turquesaSuave} />
            <Text style={s.hechoTxt}>Reto de hoy completado</Text>
            {racha > 0 ? <Text style={s.rachaTxt}>{racha} {racha === 1 ? 'día' : 'días'} seguidos</Text> : null}
          </View>
        ) : (
          <TouchableOpacity style={s.reto} onPress={onReto} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel="Empezar el Reto del día">
            <View style={s.retoIcono}><Ionicons name="flag" size={20} color={colors.noche} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.retoTit}>Reto del día</Text>
              <Text style={s.retoSub}>5 pasos · +25 de bonus</Text>
            </View>
            {racha > 0 ? (
              <View style={s.racha}>
                <Ionicons name="flame" size={16} color={colors.sol} />
                <Text style={s.rachaNum}>{racha}</Text>
              </View>
            ) : null}
            <Ionicons name="chevron-forward" size={20} color={colors.noche} />
          </TouchableOpacity>
        )}
      </View>

      <FranjaTejida color={color} alto={10} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 16, marginTop: 4, marginBottom: 10,
    borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1.5,
    backgroundColor: colors.nocheCard,
  },
  cuerpo:   { padding: 16, paddingTop: 12 },
  cabecera: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 },
  etiqueta: { fontSize: 10, color: colors.doradoNeon, fontFamily: fonts.bold, letterSpacing: 2.5 },
  fecha:    { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.medium },

  fila:   { flexDirection: 'row', alignItems: 'center', gap: 14 },
  // Rombo pasto: un cuadrado girado 45° con la ilustración enderezada dentro.
  rombo:  {
    width: 64, height: 64, marginHorizontal: 6, borderRadius: 12, borderWidth: 2,
    backgroundColor: 'rgba(250,199,117,0.08)', transform: [{ rotate: '45deg' }],
    alignItems: 'center', justifyContent: 'center',
  },
  romboDentro: { transform: [{ rotate: '-45deg' }] },
  textos: { flex: 1, minWidth: 0 },
  past:   { fontSize: 32, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif' },
  fon:    { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.medium, fontStyle: 'italic' },
  esp:    { fontSize: 16, color: colors.cielo, fontFamily: fonts.bold, marginTop: 2 },
  audioBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1.5,
    backgroundColor: 'rgba(8,26,34,0.6)', alignItems: 'center', justifyContent: 'center',
  },

  ej: {
    marginTop: 12, paddingLeft: 10, borderLeftWidth: 3,
    color: colors.cielo, opacity: 0.85, fontSize: 13, lineHeight: 19, fontFamily: fonts.regular, fontStyle: 'italic',
  },

  chips:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  chip:    { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.pill, borderWidth: 1, borderColor: 'rgba(159,225,203,0.35)' },
  chipTxt: { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.bold },


  reto: {
    marginTop: 14, minHeight: 56, borderRadius: radii.md, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.doradoNeon,
  },
  retoIcono: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(11,31,42,0.12)', alignItems: 'center', justifyContent: 'center' },
  retoTit:   { color: colors.noche, fontSize: 16, fontFamily: fonts.extra },
  retoSub:   { color: colors.noche, opacity: 0.75, fontSize: 12, fontFamily: fonts.semibold },
  racha:     { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.pill, backgroundColor: colors.noche },
  rachaNum:  { color: colors.sol, fontSize: 13, fontFamily: fonts.extra },

  hecho:    {
    marginTop: 14, minHeight: 48, borderRadius: radii.md, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(29,158,117,0.16)', borderWidth: 1, borderColor: colors.turquesa,
  },
  hechoTxt: { flex: 1, color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.bold },
  rachaTxt: { color: colors.sol, fontSize: 12, fontFamily: fonts.bold },
});
