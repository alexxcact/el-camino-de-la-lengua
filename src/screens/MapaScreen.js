import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { mundos } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';
import Glass from '../components/Glass';

const { width } = Dimensions.get('window');

export default function MapaScreen({ navigation }) {
  const { estado, getNivel } = useJuego();

  const fadeAnims  = useRef(mundos.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(mundos.map(() => new Animated.Value(28))).current;

  useEffect(() => {
    Animated.stagger(80,
      fadeAnims.map((anim, i) =>
        Animated.parallel([
          Animated.timing(anim,          { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(slideAnims[i], { toValue: 0, duration: 420, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const desbloqueado = (id) => id === 1 || estado.mundosCompletados.has(id - 1);

  const mundosRestaurados = mundos.filter(m => {
    const palVistas = m.palabrasIds.filter(id => estado.palabrasVistas.has(id)).length;
    return palVistas >= m.palabrasIds.length / 2;
  }).length;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 30 }}>

      {/* HEADER con gradiente */}
      <LinearGradient
        colors={colors.gradHero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={s.avatarBox}>
          <Image source={require('../../assets/images/personajes/kinti.jpg')} style={s.avatar} />
          <View style={s.levelBadge}>
            <Text style={s.levelTxt}>{getNivel().split(' ')[0]}</Text>
          </View>
        </View>

        <View style={s.statsCol}>
          <View style={s.xpRow}>
            <Text style={s.xpLabel}>✨ {estado.puntos} pts</Text>
          </View>
          <View style={s.xpBarWrap}>
            <LinearGradient
              colors={colors.gradDorado}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.xpBarFill, { width: `${Math.min(100, estado.puntos % 100)}%` }]}
            />
          </View>
          <Text style={s.statLabel}>Palabras Pastoker:</Text>
          <Text style={s.statBig}>
            {estado.palabrasVistas.size}
            <Text style={s.statMax}>/75</Text>
          </Text>
        </View>

        <View style={s.logoBox}>
          <Image source={require('../../assets/images/logo-pumamaki.png')} style={s.logo} resizeMode="contain" />
        </View>
      </LinearGradient>

      {/* Barra de restauración */}
      <Glass tipo="claro" intensidad={50} style={s.restGlass}>
        <View style={s.restHead}>
          <Text style={s.restTit}>🌿 Restauración del Territorio</Text>
          <Text style={s.restCount}>{mundosRestaurados}/5</Text>
        </View>
        <View style={s.restBar}>
          <LinearGradient
            colors={colors.gradParamo}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[s.restBarFill, { width: `${(mundosRestaurados / 5) * 100}%` }]}
          />
        </View>
        <Text style={s.restSub}>
          {mundosRestaurados === 0 && 'El territorio está en silencio... aprende para devolverle la vida'}
          {mundosRestaurados >= 1 && mundosRestaurados < 3 && 'El color empieza a volver al territorio'}
          {mundosRestaurados >= 3 && mundosRestaurados < 5 && 'Las palabras cantan otra vez en los cerros'}
          {mundosRestaurados === 5 && '¡El Tuta y el Pued están restaurados! 🏆'}
        </Text>
      </Glass>

      {/* Mensaje de Kinti */}
      <Glass tipo="oscuro" intensidad={60} style={s.kintiGlass}>
        <Image source={require('../../assets/images/personajes/kinti.jpg')} style={s.kintiAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.kintiNom}>Kinti dice:</Text>
          <Text style={s.kintiMsgTxt}>
            {estado.mundosCompletados.size === 0
              ? '"Empecemos por el Páramo... debo devolverle su color"'
              : estado.mundosCompletados.size < 5
              ? `"Ya restauré ${estado.mundosCompletados.size} de 5 mundos. ¡Sigamos!"`
              : '"¡Restauré el Tuta y el Pued! El territorio vive otra vez"'}
          </Text>
        </View>
      </Glass>

      <Text style={s.seccion}>🗺️ Los 5 Mundos del Camino</Text>

      {mundos.map((mundo, index) => {
        const abierto   = desbloqueado(mundo.id);
        const completado = estado.mundosCompletados.has(mundo.id);
        const palVistas = mundo.palabrasIds.filter(id => estado.palabrasVistas.has(id)).length;
        const pct       = Math.round((palVistas / mundo.palabrasIds.length) * 100);
        const aColor    = pct >= 50;
        const imgMundo  = aColor ? imgMundoColor[mundo.id] : imgMundoGris[mundo.id];

        return (
          <Animated.View
            key={mundo.id}
            style={{ opacity: fadeAnims[index], transform: [{ translateY: slideAnims[index] }] }}
          >
            <TouchableOpacity
              style={s.mundoCard}
              onPress={() => abierto && navigation.navigate('Mundo', { mundoId: mundo.id })}
              disabled={!abierto}
              activeOpacity={0.9}
            >
              <ImageBackground source={imgMundo} style={s.mundoBg} imageStyle={{ borderRadius: 18 }}>
                {/* Overlay gradiente */}
                <LinearGradient
                  colors={['transparent', 'rgba(26,16,8,0.82)']}
                  start={{ x: 0, y: 0.25 }}
                  end={{ x: 0, y: 1 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
                />
                {!abierto && <View style={s.lockOverlay} />}

                {/* Número */}
                <View style={s.mundoCorner}>
                  <View style={[s.mundoNumBox, { backgroundColor: mundo.color }]}>
                    <Text style={s.mundoNum}>{mundo.id}</Text>
                  </View>
                </View>

                {/* Badges de estado */}
                {completado && (
                  <View style={s.completeBadge}>
                    <Text style={s.completeTxt}>✓ Restaurado</Text>
                  </View>
                )}
                {!completado && aColor && (
                  <View style={s.colorBadge}>
                    <Text style={s.colorTxt}>🎨 Tomando color</Text>
                  </View>
                )}
                {!abierto && (
                  <View style={s.lockBadge}>
                    <Text style={s.lockTxt}>🔒</Text>
                  </View>
                )}

                {/* Info inferior */}
                <View style={[s.mundoInfo, completado && s.mundoInfoGold]}>
                  <Text style={s.mundoEmoji}>{mundo.emoji}</Text>
                  <Text style={s.mundoTit}>{mundo.titulo}</Text>
                  <Text style={s.mundoSub}>"{mundo.subtitulo}"</Text>
                  <View style={s.mundoPB}>
                    <LinearGradient
                      colors={colors.gradDorado}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[s.mundoPBFill, { width: `${pct}%` }]}
                    />
                  </View>
                  <Text style={s.mundoCount}>{palVistas} / {mundo.palabrasIds.length} palabras restauradas</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {estado.mundosCompletados.size === 5 && (
        <Glass tipo="dorado" bordeBrillante style={s.victoria}>
          <Text style={s.vicEmoji}>🏆</Text>
          <Text style={s.vicTit}>¡EL CAMINO COMPLETO!</Text>
          <Text style={s.vicSub}>Has restaurado el Tuta y el Pued del territorio sagrado</Text>
        </Glass>
      )}

      <View style={s.footer}>
        <Text style={s.footTxt}>🌄 Asociación Indígena Agroecológica</Text>
        <Text style={s.footNeg}>PUMA-MAKI</Text>
        <Text style={s.footSub}>Pueblo Pasto · Resguardo de Muellamués · Nariño</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.negro },

  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10, borderBottomWidth: 1.5, borderBottomColor: colors.glassBorde },
  avatarBox:    { position: 'relative' },
  avatar:       { width: 54, height: 54, borderRadius: 27, borderWidth: 2.5, borderColor: colors.doradoBrillo },
  levelBadge:   { position: 'absolute', bottom: -4, left: -4, backgroundColor: colors.doradoBrillo, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  levelTxt:     { fontSize: 9, fontWeight: '900', color: colors.negro },
  statsCol:     { flex: 1 },
  xpRow:        { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 },
  xpLabel:      { fontSize: 11, color: colors.doradoBrillo, fontWeight: '700' },
  xpBarWrap:    { height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  xpBarFill:    { height: '100%', borderRadius: 3 },
  statLabel:    { fontSize: 10, color: colors.arena, letterSpacing: 0.5 },
  statBig:      { fontSize: 22, fontWeight: '900', color: colors.doradoBrillo, lineHeight: 24 },
  statMax:      { fontSize: 13, color: 'rgba(247,240,224,0.6)', fontWeight: '400' },
  logoBox:      { width: 58, height: 40 },
  logo:         { width: '100%', height: '100%' },

  restGlass:    { marginHorizontal: 14, marginTop: 14, padding: 14 },
  restHead:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  restTit:      { fontSize: 13, fontWeight: '900', color: colors.tierra },
  restCount:    { fontSize: 14, fontWeight: '900', color: colors.verdeClaro },
  restBar:      { height: 10, backgroundColor: colors.arena, borderRadius: 5, overflow: 'hidden' },
  restBarFill:  { height: '100%', borderRadius: 5 },
  restSub:      { fontSize: 11, color: colors.gris, fontStyle: 'italic', marginTop: 6, lineHeight: 15 },

  kintiGlass:   { flexDirection: 'row', marginHorizontal: 14, marginTop: 12, padding: 12, alignItems: 'center', gap: 10 },
  kintiAvatar:  { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.doradoBrillo },
  kintiNom:     { fontSize: 10, fontWeight: '900', color: colors.doradoBrillo, letterSpacing: 1, marginBottom: 2 },
  kintiMsgTxt:  { fontSize: 12, color: colors.crema, fontStyle: 'italic', lineHeight: 17 },

  seccion:      {
    fontSize: 16, fontWeight: '900', color: colors.doradoBrillo,
    marginHorizontal: 16, marginTop: 16, marginBottom: 10, letterSpacing: 0.5,
    textShadowColor: 'rgba(245,200,66,0.3)', textShadowRadius: 8,
  },

  mundoCard:    { marginHorizontal: 14, marginBottom: 14, borderRadius: 18, overflow: 'hidden', shadowColor: colors.doradoBrillo, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  mundoBg:      { width: '100%', height: 200, justifyContent: 'flex-end' },
  lockOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 18 },
  mundoCorner:  { position: 'absolute', top: 12, left: 12 },
  mundoNumBox:  { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.doradoBrillo },
  mundoNum:     { color: colors.crema, fontWeight: '900', fontSize: 16 },
  completeBadge:{ position: 'absolute', top: 12, right: 12, backgroundColor: colors.verdeM, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: colors.glassBorde },
  completeTxt:  { color: colors.crema, fontSize: 10, fontWeight: '900' },
  colorBadge:   { position: 'absolute', top: 12, right: 12, backgroundColor: colors.dorado, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  colorTxt:     { color: colors.negro, fontSize: 10, fontWeight: '900' },
  lockBadge:    { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 20 },
  lockTxt:      { fontSize: 16 },

  mundoInfo:    {
    padding: 14,
    backgroundColor: colors.glassClaro,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorde,
  },
  mundoInfoGold:{ backgroundColor: colors.glassDorado },
  mundoEmoji:   { fontSize: 22, marginBottom: 2 },
  mundoTit:     { color: colors.doradoBrillo, fontSize: 20, fontWeight: '900', textShadowColor: 'rgba(245,200,66,0.35)', textShadowRadius: 6 },
  mundoSub:     { color: colors.crema, fontSize: 11, fontStyle: 'italic', marginTop: 1, opacity: 0.9 },
  mundoPB:      { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  mundoPBFill:  { height: 4, borderRadius: 2 },
  mundoCount:   { color: colors.arena, fontSize: 10, marginTop: 3 },

  victoria:     { margin: 14, padding: 24, alignItems: 'center' },
  vicEmoji:     { fontSize: 52 },
  vicTit:       { fontSize: 18, fontWeight: '900', color: colors.doradoBrillo, marginTop: 8, letterSpacing: 1 },
  vicSub:       { fontSize: 12, color: colors.crema, opacity: 0.85, marginTop: 6, textAlign: 'center', lineHeight: 18 },

  footer:       { alignItems: 'center', marginTop: 20, paddingHorizontal: 14, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(196,144,16,0.25)', marginHorizontal: 14 },
  footTxt:      { fontSize: 11, color: '#aaa', fontStyle: 'italic' },
  footNeg:      { fontSize: 16, fontWeight: '900', color: colors.tierraClara, letterSpacing: 3, marginVertical: 3 },
  footSub:      { fontSize: 10, color: '#bbb' },
});
