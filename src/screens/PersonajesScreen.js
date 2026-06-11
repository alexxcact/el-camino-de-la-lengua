import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import BotonGlow from '../components/BotonGlow';

const { width } = Dimensions.get('window');

const personajes = [
  {
    id: 'kinti',
    nombre: 'Kinti',
    rol: 'Protagonista · Guardián del Camino',
    img: require('../../assets/images/personajes/kinti.jpg'),
    color: '#C49010',
    desc: 'Joven indígena de Muellamués. Curioso, valiente y respetuoso con los mayores. Es a quien tú controlas en el juego. Porta ruana tradicional y camina por el páramo con palabras doradas flotando a su alrededor.',
    frase: '¡Voy a recuperar las palabras de mi pueblo!',
  },
  {
    id: 'taita-rimay',
    nombre: 'Taita Rimay',
    rol: 'Espíritu Guía · El Padre de la Palabra',
    img: require('../../assets/images/personajes/taita_rimay.jpg'),
    color: '#8B4513',
    desc: 'Espíritu ancestral envuelto en niebla dorada. Habla solo en pastoker y narra el inicio de cada mundo. Aparece como una figura luminosa de anciano sabio rodeado de símbolos sagrados flotantes.',
    frase: 'Solo recuperando las palabras restaurarás el Tuta y el Pued.',
  },
  {
    id: 'uma',
    nombre: 'Uma',
    rol: 'Abuela Tejedora · Maestra del Chumbe',
    img: require('../../assets/images/personajes/uma.jpg'),
    color: '#7A1515',
    desc: 'Tejedora de Muellamués. Habla únicamente en pastoker y solo responde cuando usas las palabras correctas. Viste anacu, rebozo tejido y sombrero de lana. Sus manos siempre aparecen tejiendo el chumbe.',
    frase: 'Pas wawa, rimay Pastoquer.',
  },
  {
    id: 'pishku',
    nombre: 'Pishku',
    rol: 'Pájaro Mensajero · Voz del Pastoker',
    img: require('../../assets/images/personajes/pishku.jpg'),
    color: '#1A3A5C',
    desc: 'Colibrí de los Andes con plumas de los colores del quincha. Pronuncia cada palabra nueva y celebra tus logros con cantos. Deja estelas doradas por donde vuela.',
    frase: '¡Pío pío! ¡Pas rimay!',
  },
  {
    id: 'chutun',
    nombre: 'Los Chutún',
    rol: 'Espíritus del Páramo · Guardianes del Olvido',
    img: require('../../assets/images/personajes/chutun.jpg'),
    color: '#2D5A16',
    desc: 'Espíritus traviesos del páramo con apariencia neblinosa y suave. Representan las fuerzas del olvido y te desafían con acertijos lingüísticos. Aparecen en grupo cerca del fogón o entre las piedras del páramo.',
    frase: 'Si no sabes nuestra palabra... ¡no pasas!',
  },
];

export default function PersonajesScreen() {
  const [idx, setIdx] = useState(0);
  const p = personajes[idx];

  return (
    <View style={s.container}>

      {/* Hero con imagen del personaje */}
      <ImageBackground source={p.img} style={s.hero} resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(11,31,42,0.6)', colors.noche]}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.heroTxt}>
          <Text style={s.heroBadge}>✨ CONOCE A</Text>
          <Text style={s.heroNombre}>{p.nombre}</Text>
          <Text style={s.heroRol}>{p.rol}</Text>
        </View>
      </ImageBackground>

      {/* Contenido inferior */}
      <ScrollView style={s.content} contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>

        <Text style={s.seccionLbl}>HÉROES DEL CAMINO</Text>

        {/* Selector horizontal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.minisWrap}>
          {personajes.map((pj, i) => (
            <TouchableOpacity key={pj.id} onPress={() => setIdx(i)} style={[s.mini, i === idx && s.miniOn]} activeOpacity={0.8}>
              <View style={[
                s.miniFrame,
                { borderColor: pj.color },
                i === idx && s.miniFrameOn,
              ]}>
                <Image source={pj.img} style={s.miniImg} />
              </View>
              <Text style={[s.miniNom, i === idx && { color: colors.doradoNeon }]}>{pj.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Descripción */}
        <View style={[s.descCard, { borderLeftColor: p.color }]}>
          <Text style={s.descLbl}>DESCRIPCIÓN</Text>
          <Text style={s.descTxt}>{p.desc}</Text>
        </View>

        {/* Frase */}
        <View style={s.fraseWrap}>
          <LinearGradient
            colors={[p.color, colors.noche]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={s.fraseComilla}>"</Text>
          <Text style={s.fraseTxt}>{p.frase}</Text>
          <Text style={[s.fraseComilla, { alignSelf: 'flex-end' }]}>"</Text>
        </View>

        {/* Tip */}
        <View style={s.tipCard}>
          <Text style={s.tipEmoji}>💡</Text>
          <Text style={s.tipTxt}>Cada personaje tiene un rol especial. Conócelos bien para avanzar en tu camino.</Text>
        </View>

        {/* Navegación */}
        <View style={s.nav}>
          <BotonGlow texto="← Anterior" onPress={() => idx > 0 && setIdx(idx - 1)} variante="fantasma" tamano="sm" desactivado={idx === 0} />
          <Text style={s.navCount}>{idx + 1} / {personajes.length}</Text>
          <BotonGlow texto="Siguiente →" onPress={() => idx < personajes.length - 1 && setIdx(idx + 1)} variante="fantasma" tamano="sm" desactivado={idx === personajes.length - 1} />
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },

  // Hero
  hero:      { width, height: 250, justifyContent: 'flex-end', padding: 16 },
  heroTxt:   { padding: 4 },
  heroBadge: { color: colors.doradoNeon, fontSize: 11, fontFamily: fonts.extra, letterSpacing: 4, marginBottom: 4 },
  heroNombre:{ color: colors.cielo, fontSize: 34, fontFamily: fonts.extra, textShadowColor: 'rgba(11,31,42,0.8)', textShadowRadius: 8 },
  heroRol:   { color: colors.turquesaSuave, fontSize: 12, fontStyle: 'italic', marginTop: 4, letterSpacing: 1 },

  // Scroll content
  content:    { flex: 1 },
  seccionLbl: { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 2, marginBottom: 12, marginTop: 4 },

  // Miniaturas
  minisWrap:   { gap: 14, paddingVertical: 6, paddingRight: 10, paddingLeft: 2, marginBottom: 6 },
  mini:        { alignItems: 'center', width: 80 },
  miniOn:      { transform: [{ scale: 1.08 }] },
  miniFrame:   { width: 72, height: 72, borderRadius: 36, borderWidth: 3, overflow: 'hidden', backgroundColor: colors.nocheProfundo },
  miniFrameOn: {
    borderColor: colors.doradoNeon, borderWidth: 4,
    shadowColor: colors.doradoNeon, shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10,
  },
  miniImg: { width: '100%', height: '100%' },
  miniNom: { fontSize: 11, fontFamily: fonts.semibold, color: colors.turquesaSuave, marginTop: 6, textAlign: 'center' },

  // Descripción
  descCard: { backgroundColor: colors.nocheCard, borderRadius: 16, padding: 16, marginTop: 8, borderLeftWidth: 4, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  descLbl:  { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 8 },
  descTxt:  { fontSize: 14, color: colors.cielo, lineHeight: 22 },

  // Frase
  fraseWrap:    { borderRadius: 18, padding: 20, marginTop: 12, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.4)' },
  fraseComilla: { color: colors.doradoNeon, fontSize: 40, fontFamily: 'serif', lineHeight: 40 },
  fraseTxt:     { flex: 1, color: colors.cielo, fontSize: 15, fontStyle: 'italic', textAlign: 'center', fontFamily: fonts.semibold, paddingHorizontal: 6 },

  // Tip
  tipCard:  { flexDirection: 'row', backgroundColor: colors.nocheProfundo, borderRadius: 14, padding: 12, marginTop: 12, alignItems: 'center', gap: 10 },
  tipEmoji: { fontSize: 24 },
  tipTxt:   { flex: 1, fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', lineHeight: 17 },

  // Nav
  nav:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 10 },
  navCount: { fontSize: 13, color: colors.doradoNeon, fontFamily: fonts.bold, letterSpacing: 1 },
});
