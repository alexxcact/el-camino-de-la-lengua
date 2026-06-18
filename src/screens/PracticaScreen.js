import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { palabras, mundos, categorias, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import BotonGlow from '../components/BotonGlow';
import PishkuMascota from '../components/PishkuMascota';
import { sonar } from '../utils/sonidos';

const MECANICAS = [
  { key: 'Quiz',     emoji: '🧠', label: 'Quiz' },
  { key: 'Parejas',  emoji: '🃏', label: 'Parejas' },
  { key: 'Dictado',  emoji: '✍️', label: 'Dictado' },
  { key: 'Escucha',  emoji: '🎧', label: 'Escucha' },
  { key: 'Memoria',  emoji: '🧩', label: 'Memoria' },
  { key: 'sorpresa', emoji: '🎲', label: 'Sorpréndeme' },
];

const CANTIDADES = [5, 10, 15];
const MIN_PALABRAS = 4;

export default function PracticaScreen({ navigation }) {
  const { estado } = useJuego();

  const aprendidas = useMemo(
    () => palabras.filter(p => estado.palabrasVistas.has(p.id)),
    [estado.palabrasVistas]
  );

  const [alcance, setAlcance] = useState({ tipo: 'todo' });
  const [mecanica, setMecanica] = useState('Quiz');
  const [cuantas, setCuantas] = useState(10);

  // Mundos y categorías que el jugador ya tiene palabras aprendidas
  const mundosConPalabras = mundos.filter(m => aprendidas.some(p => p.mundo === m.id));
  const catsConPalabras = categorias.filter(c => c !== 'Todas' && aprendidas.some(p => p.cat === c));

  const seleccionadas = useMemo(() => {
    if (alcance.tipo === 'mundo') return aprendidas.filter(p => p.mundo === alcance.id);
    if (alcance.tipo === 'cat')   return aprendidas.filter(p => p.cat === alcance.cat);
    return aprendidas;
  }, [alcance, aprendidas]);

  const mismo = (a, b) => a.tipo === b.tipo && a.id === b.id && a.cat === b.cat;

  const empezar = () => {
    if (seleccionadas.length === 0) return;
    const destino = mecanica === 'sorpresa'
      ? ['Quiz', 'Parejas', 'Dictado', 'Escucha', 'Memoria'][Math.floor(Math.random() * 5)]
      : mecanica;
    sonar.pop();
    navigation.navigate(destino, {
      modoPractica: true,
      palabrasPractica: shuffle(seleccionadas),
      nPreguntas: cuantas,
    });
  };

  // ─── Aún no hay suficientes palabras ───
  if (aprendidas.length < MIN_PALABRAS) {
    return (
      <View style={[s.bg, { justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
        <PishkuMascota celebrando={false} tamano={88} />
        <Text style={s.gateTit}>Aún no hay mucho para repasar</Text>
        <Text style={s.gateSub}>Aprende algunas palabras en el mapa primero y vuelve a practicarlas aquí cuando quieras.</Text>
        <BotonGlow texto="🗺️ Ir al mapa" onPress={() => navigation.navigate('Mapa')} variante="primario" tamano="lg" />
      </View>
    );
  }

  return (
    <View style={s.bg}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>

        <Text style={s.intro}>Repasa lo que ya aprendiste, a tu ritmo. No afecta tu avance en el mapa.</Text>

        {/* QUÉ practicar */}
        <Text style={s.seccion}>¿QUÉ QUIERES PRACTICAR?</Text>
        <View style={s.chipsWrap}>
          <Chip on={alcance.tipo === 'todo'} onPress={() => setAlcance({ tipo: 'todo' })} texto="Todo lo aprendido" />
          {mundosConPalabras.map(m => (
            <Chip key={`m${m.id}`} on={alcance.tipo === 'mundo' && alcance.id === m.id}
              onPress={() => setAlcance({ tipo: 'mundo', id: m.id })} texto={`${m.emoji} ${m.titulo}`} />
          ))}
          {catsConPalabras.map(c => (
            <Chip key={`c${c}`} on={alcance.tipo === 'cat' && alcance.cat === c}
              onPress={() => setAlcance({ tipo: 'cat', cat: c })} texto={c} />
          ))}
        </View>
        <Text style={s.disponibles}>{seleccionadas.length} palabras disponibles</Text>

        {/* CÓMO practicar */}
        <Text style={s.seccion}>¿CÓMO?</Text>
        <View style={s.mecGrid}>
          {MECANICAS.map(m => {
            const on = mecanica === m.key;
            return (
              <TouchableOpacity key={m.key} style={[s.mecBtn, on && s.mecOn]} onPress={() => setMecanica(m.key)} activeOpacity={0.85}>
                <Text style={s.mecEmoji}>{m.emoji}</Text>
                <Text style={[s.mecLbl, on && { color: colors.doradoNeon }]}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CUÁNTAS */}
        <Text style={s.seccion}>¿CUÁNTAS?</Text>
        <View style={s.cantRow}>
          {CANTIDADES.map(n => {
            const on = cuantas === n;
            return (
              <TouchableOpacity key={n} style={[s.cantBtn, on && s.cantOn]} onPress={() => setCuantas(n)} activeOpacity={0.85}>
                <Text style={[s.cantTxt, on && { color: colors.noche }]}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {(mecanica === 'Parejas' || mecanica === 'Memoria') && (
          <Text style={s.nota}>* Parejas y Memoria usan hasta 6 palabras por tablero.</Text>
        )}

        <View style={{ height: 8 }} />
        <BotonGlow texto="▶ Empezar práctica" onPress={empezar} variante="primario" tamano="lg" desactivado={seleccionadas.length === 0} />
      </ScrollView>
    </View>
  );
}

function Chip({ on, onPress, texto }) {
  return (
    <TouchableOpacity style={[s.chip, on && s.chipOn]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[s.chipTxt, on && { color: colors.noche }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  intro:   { fontSize: 13, color: colors.turquesaSuave, fontStyle: 'italic', textAlign: 'center', marginBottom: 18, lineHeight: 19 },
  seccion: { fontSize: 12, fontFamily: fonts.bold, color: colors.turquesaSuave, letterSpacing: 2, marginBottom: 10, marginTop: 6 },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:   { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.3)' },
  chipOn: { backgroundColor: colors.doradoNeon, borderColor: colors.doradoNeon },
  chipTxt:{ fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.semibold },
  disponibles: { fontSize: 11, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 8 },

  mecGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  mecBtn:  { width: '31%', alignItems: 'center', paddingVertical: 14, marginBottom: 10, borderRadius: 16, backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.2)' },
  mecOn:   { borderColor: colors.doradoNeon, borderWidth: 2, backgroundColor: 'rgba(250,199,117,0.10)' },
  mecEmoji:{ fontSize: 28 },
  mecLbl:  { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginTop: 4 },

  cantRow: { flexDirection: 'row', gap: 10 },
  cantBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.25)' },
  cantOn:  { backgroundColor: colors.doradoNeon, borderColor: colors.doradoNeon },
  cantTxt: { fontSize: 18, color: colors.cielo, fontFamily: fonts.extra },
  nota:    { fontSize: 11, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 10 },

  gateTit: { fontSize: 18, fontFamily: fonts.bold, color: colors.cielo, marginTop: 16, textAlign: 'center' },
  gateSub: { fontSize: 14, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8, marginBottom: 22, lineHeight: 20 },
});
