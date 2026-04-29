import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import Glass from '../components/Glass';
import BotonGlow from '../components/BotonGlow';

const { width } = Dimensions.get('window');

const personajes = [
  {
    id: 'kinti',
    nombre: 'Kinti',
    rol: 'Protagonista · Guardián del Camino',
    img: require('../../assets/images/personajes/kinti.jpg'),
    color: '#C49010',
    grad: ['#C49010', '#8B4513'],
    desc: 'Joven indígena de Muellamués. Curioso, valiente y respetuoso con los mayores. Es a quien tú controlas en el juego. Porta ruana tradicional y camina por el páramo con palabras doradas flotando a su alrededor.',
    frase: '¡Voy a recuperar las palabras de mi pueblo!',
  },
  {
    id: 'taita-rimay',
    nombre: 'Taita Rimay',
    rol: 'Espíritu Guía · El Padre de la Palabra',
    img: require('../../assets/images/personajes/taita_rimay.jpg'),
    color: '#8B4513',
    grad: ['#8B4513', '#1A1008'],
    desc: 'Espíritu ancestral envuelto en niebla dorada. Habla solo en pastoker y narra el inicio de cada mundo. Aparece como una figura luminosa de anciano sabio rodeado de símbolos sagrados flotantes.',
    frase: 'Solo recuperando las palabras restaurarás el Tuta y el Pued.',
  },
  {
    id: 'uma',
    nombre: 'Uma',
    rol: 'Abuela Tejedora · Maestra del Chumbe',
    img: require('../../assets/images/personajes/uma.jpg'),
    color: '#7A1515',
    grad: ['#7A1515', '#1A1008'],
    desc: 'Tejedora de Muellamués. Habla únicamente en pastoker y solo responde cuando usas las palabras correctas. Viste anacu, rebozo tejido y sombrero de lana. Sus manos siempre aparecen tejiendo el chumbe.',
    frase: 'Pas wawa, rimay Pastoquer.',
  },
  {
    id: 'pishku',
    nombre: 'Pishku',
    rol: 'Pájaro Mensajero · Voz del Pastoker',
    img: require('../../assets/images/personajes/pishku.jpg'),
    color: '#1A3A5C',
    grad: ['#1A3A5C', '#0D2540'],
    desc: 'Colibrí de los Andes con plumas de los colores del quincha. Pronuncia cada palabra nueva y celebra tus logros con cantos. Deja estelas doradas por donde vuela.',
    frase: '¡Pío pío! ¡Pas rimay!',
  },
  {
    id: 'chutun',
    nombre: 'Los Chutún',
    rol: 'Espíritus del Páramo · Guardianes del Olvido',
    img: require('../../assets/images/personajes/chutun.jpg'),
    color: '#2D5A16',
    grad: ['#2D5A16', '#1E4010'],
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
          colors={['rgba(26,16,8,0.15)', 'rgba(26,16,8,0.88)']}
          style={StyleSheet.absoluteFill}
        />
        <Glass tipo="oscuro" intensidad={70} bordeBrillante style={s.heroGlass}>
          <Text style={s.heroBadge}>◆ CONOCE A ◆</Text>
          <Text style={s.heroNombre}>{p.nombre}</Text>
          <Text style={s.heroRol}>{p.rol}</Text>
        </Glass>
      </ImageBackground>

      {/* Contenido inferior */}
      <ScrollView style={s.content} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>

        <Text style={s.seccionLbl}>◆ HÉROES DEL CAMINO ◆</Text>

        {/* Selector horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.minisWrap}
        >
          {personajes.map((pj, i) => (
            <TouchableOpacity
              key={pj.id}
              onPress={() => setIdx(i)}
              style={[s.mini, i === idx && s.miniOn]}
              activeOpacity={0.8}
            >
              <View style={[
                s.miniFrame,
                { borderColor: pj.color },
                i === idx && { borderColor: colors.doradoBrillo, borderWidth: 4, shadowColor: pj.color, shadowOpacity: 0.7, elevation: 10 },
              ]}>
                <Image source={pj.img} style={s.miniImg} />
              </View>
              <Text style={[s.miniNom, i === idx && { color: colors.doradoBrillo }]}>
                {pj.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Imagen grande con marco y tag */}
        <View style={[s.imgGrandeWrap, { borderColor: p.color }]}>
          <Image source={p.img} style={s.imgGrandeFull} resizeMode="cover" />
          <LinearGradient
            colors={[...p.grad, 'transparent']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={s.imgGrandeOverlay}
          />
          <Glass tipo="dorado" bordeBrillante style={s.imgGrandeTag}>
            <Text style={s.imgGrandeTagTxt}>{p.nombre}</Text>
          </Glass>
        </View>

        {/* Descripción */}
        <Glass tipo="claro" style={[s.descCard, { borderLeftColor: p.color, borderLeftWidth: 4 }]}>
          <Text style={s.descLbl}>DESCRIPCIÓN</Text>
          <Text style={s.descTxt}>{p.desc}</Text>
        </Glass>

        {/* Frase */}
        <View style={s.fraseWrap}>
          <LinearGradient
            colors={[p.color, colors.negro]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={s.fraseComilla}>"</Text>
          <Text style={s.fraseTxt}>{p.frase}</Text>
          <Text style={[s.fraseComilla, { alignSelf: 'flex-end' }]}>"</Text>
        </View>

        {/* Tip */}
        <Glass tipo="oscuro" style={s.tipCard}>
          <Text style={s.tipEmoji}>💡</Text>
          <Text style={s.tipTxt}>
            Cada personaje tiene un rol especial. Conócelos bien para avanzar en tu camino.
          </Text>
        </Glass>

        {/* Navegación */}
        <View style={s.nav}>
          <BotonGlow
            texto="← Anterior"
            onPress={() => idx > 0 && setIdx(idx - 1)}
            variante="fantasma"
            tamano="sm"
            desactivado={idx === 0}
          />
          <Text style={s.navCount}>{idx + 1} / {personajes.length}</Text>
          <BotonGlow
            texto="Siguiente →"
            onPress={() => idx < personajes.length - 1 && setIdx(idx + 1)}
            variante="fantasma"
            tamano="sm"
            desactivado={idx === personajes.length - 1}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.negro },

  // Hero
  hero:      { width, height: 240, justifyContent: 'flex-end', padding: 16 },
  heroGlass: { padding: 16, borderRadius: 18 },
  heroBadge: { color: colors.doradoBrillo, fontSize: 11, fontWeight: '900', letterSpacing: 4, marginBottom: 4 },
  heroNombre:{
    color: colors.crema, fontSize: 34, fontWeight: '900', letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 8,
  },
  heroRol:   { color: colors.doradoBrillo, fontSize: 12, fontStyle: 'italic', marginTop: 4, letterSpacing: 1 },

  // Scroll content
  content:   { flex: 1, backgroundColor: colors.negro },
  seccionLbl:{ fontSize: 11, color: colors.doradoBrillo, fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginBottom: 12, marginTop: 4 },

  // Miniaturas
  minisWrap: { gap: 14, paddingVertical: 4, paddingRight: 10, paddingLeft: 4, marginBottom: 4 },
  mini:      { alignItems: 'center', width: 80 },
  miniOn:    { transform: [{ scale: 1.08 }] },
  miniFrame: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, overflow: 'hidden',
    backgroundColor: colors.negro,
    shadowOpacity: 0.35, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 6,
  },
  miniImg:   { width: '100%', height: '100%' },
  miniNom:   { fontSize: 11, fontWeight: '700', color: colors.arena, marginTop: 6, textAlign: 'center' },

  // Imagen grande
  imgGrandeWrap: {
    marginTop: 16, borderRadius: 18, overflow: 'hidden',
    borderWidth: 3, height: 240,
    shadowColor: colors.doradoBrillo, shadowOpacity: 0.25, shadowRadius: 12, elevation: 10,
  },
  imgGrandeFull:    { width: '100%', height: '100%' },
  imgGrandeOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 },
  imgGrandeTag:     { position: 'absolute', bottom: 12, left: 12, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 18 },
  imgGrandeTagTxt:  { color: colors.crema, fontSize: 14, fontWeight: '900', letterSpacing: 1 },

  // Descripción
  descCard: { borderRadius: 14, padding: 16, marginTop: 14 },
  descLbl:  { fontSize: 10, color: colors.gris, fontWeight: '900', letterSpacing: 3, marginBottom: 8 },
  descTxt:  { fontSize: 14, color: colors.negro, lineHeight: 22 },

  // Frase
  fraseWrap: {
    borderRadius: 16, padding: 20, marginTop: 12,
    flexDirection: 'row', alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5, borderColor: colors.glassBorde,
  },
  fraseComilla: { color: colors.doradoBrillo, fontSize: 40, fontWeight: '900', lineHeight: 40 },
  fraseTxt:     { flex: 1, color: colors.crema, fontSize: 15, fontStyle: 'italic', textAlign: 'center', fontWeight: '700', paddingHorizontal: 6 },

  // Tip
  tipCard: { flexDirection: 'row', borderRadius: 12, padding: 12, marginTop: 12, alignItems: 'center', gap: 10 },
  tipEmoji:{ fontSize: 24 },
  tipTxt:  { flex: 1, fontSize: 12, color: colors.arena, fontStyle: 'italic', lineHeight: 17 },

  // Nav
  nav:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 10 },
  navCount: { fontSize: 12, color: colors.doradoBrillo, fontWeight: '900', letterSpacing: 1 },
});
