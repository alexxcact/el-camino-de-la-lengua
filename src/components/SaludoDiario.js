import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Pressable, AccessibilityInfo, Animated, Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { datosPersonaje, cajaFigura } from '../data/personajesUtil';
import PersonajeVivo from './PersonajeVivo';

// Saludo diario de un personaje sobre el Mapa (una vez al día, gated en MapaScreen).
// El personaje entra desde un costado y queda de pie, grande, en la parte baja de
// la pantalla; encima, un bocadillo de cómic con colita que le apunta a la cabeza.
// El texto se escribe letra a letra (~2 s; tocar el bocadillo lo completa) y debajo
// del texto van el botón de acción opcional y "Seguir". Tocar fuera también cierra.
const DURACION_ESCRITURA = 2000;
const PASO_MIN = 25; // ms mínimos entre letras (textos cortos no van más rápido)
const MARGEN = 16;
const FONDO_GLOBO = '#0E2730';
const COLA = 12; // medio ancho de la colita

export default function SaludoDiario({ personaje, animo = 'neutral', texto, accionTexto, onAccion, onCerrar }) {
  const total = (texto || '').length;
  const [visibles, setVisibles] = useState(0);
  const timer = useRef(null);
  const cerrado = useRef(false);
  const llegadaAV = useRef(new Animated.Value(0)).current;
  // Con "reducir movimiento" el personaje no cruza la pantalla: solo aparece.
  const [sinDesplazar, setSinDesplazar] = useState(false);

  useEffect(() => {
    let vivo = true;
    setVisibles(0);
    const paso = Math.max(PASO_MIN, Math.floor(DURACION_ESCRITURA / Math.max(1, total)));
    const arrancar = () => {
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        setVisibles(v => {
          if (v + 1 >= total) clearInterval(timer.current);
          return Math.min(total, v + 1);
        });
      }, paso);
    };
    let promesa = null;
    try { promesa = AccessibilityInfo.isReduceMotionEnabled && AccessibilityInfo.isReduceMotionEnabled(); } catch (e) { promesa = null; }
    if (promesa && typeof promesa.then === 'function') {
      promesa.then(reducir => {
        if (!vivo) return;
        if (reducir) setVisibles(total); else arrancar();
      }).catch(() => { if (vivo) arrancar(); });
    } else {
      arrancar();
    }
    return () => { vivo = false; clearInterval(timer.current); };
  }, [texto, total]);

  // El personaje llega desde el costado izquierdo (sin desplazamiento si se
  // pidió reducir movimiento: solo aparece).
  useEffect(() => {
    let vivo = true;
    let anim = null;
    const llegar = (reducir) => {
      if (!vivo) return;
      setSinDesplazar(!!reducir);
      anim = Animated.timing(llegadaAV, { toValue: 1, duration: reducir ? 250 : 650, useNativeDriver: true });
      anim.start();
    };
    let promesa = null;
    try { promesa = AccessibilityInfo.isReduceMotionEnabled && AccessibilityInfo.isReduceMotionEnabled(); } catch (e) { promesa = null; }
    if (promesa && typeof promesa.then === 'function') {
      promesa.then(llegar, () => llegar(false));
    } else {
      llegar(false);
    }
    return () => { vivo = false; if (anim) anim.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaje]);

  const completar = () => { clearInterval(timer.current); setVisibles(total); };

  // Evita llamar dos veces (p. ej. toque fuera + botón casi simultáneos).
  const cerrar = () => {
    if (cerrado.current) return;
    cerrado.current = true;
    clearInterval(timer.current);
    if (onCerrar) onCerrar();
  };
  const accionar = () => {
    if (cerrado.current) return;
    cerrado.current = true;
    clearInterval(timer.current);
    if (onAccion) onAccion();
  };

  if (!texto) return null;

  const datos = datosPersonaje(personaje);
  const nombre = datos?.nombre || '';
  const color = datos?.color || colors.doradoNeon;

  // Tamaño: grande pero sin comerse la pantalla ni desbordar a lo ancho.
  const { width: anchoPant, height: altoPant } = Dimensions.get('window');
  const anchoUtil = Math.min(anchoPant, 460) - MARGEN * 2;
  let tamano = Math.round(Math.max(150, Math.min(210, altoPant * 0.27)));
  while (tamano > 120 && cajaFigura(personaje, tamano).ancho > anchoUtil) tamano -= 10;
  const geo = cajaFigura(personaje, tamano);
  // Figura centrada: la colita apunta a su cabeza.
  const izqFigura = (anchoUtil - geo.ancho) / 2;
  const colaX = Math.max(COLA + 14, Math.min(anchoUtil - COLA - 14, izqFigura + geo.cabezaX));
  const conAccion = !!accionTexto && !!onAccion;

  const desplazamiento = llegadaAV.interpolate({ inputRange: [0, 1], outputRange: [-anchoPant * 0.7, 0] });
  const opacidadLlegada = sinDesplazar
    ? llegadaAV
    : llegadaAV.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] });

  return (
    <View style={s.overlay} accessibilityViewIsModal>
      {/* Fondo: hermano del contenido (no lo envuelve), así el lector de pantalla
          llega al texto, a la acción y a "Seguir". */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={cerrar}
        accessibilityRole="button"
        accessibilityLabel="Cerrar saludo"
      />

      <View style={[s.escena, { width: anchoUtil }]} pointerEvents="box-none">
        {/* Bocadillo */}
        <View style={[s.globo, { borderColor: color }]}>
          {!!nombre && <Text style={s.nombre}>{nombre}</Text>}
          <Pressable onPress={completar} accessible={false}>
            {/* El texto completo reserva el alto; encima va el escrito hasta ahora. */}
            <Text style={[s.texto, s.reserva]} accessibilityElementsHidden importantForAccessibility="no">{texto}</Text>
            <Text style={[s.texto, s.escrito]} accessibilityLabel={texto}>{texto.slice(0, visibles)}</Text>
          </Pressable>

          <View style={s.acciones}>
            {conAccion && (
              <TouchableOpacity style={s.btn} onPress={accionar} activeOpacity={0.85} accessibilityRole="button">
                <Text style={s.btnTxt}>{accionTexto}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={conAccion ? s.seguirBtn : s.btn}
              onPress={cerrar}
              activeOpacity={0.85}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            >
              <Text style={conAccion ? s.seguir : s.btnTxt}>Seguir</Text>
            </TouchableOpacity>
          </View>

          {/* Colita hacia la cabeza del personaje: borde + relleno */}
          <View pointerEvents="none" style={[s.colaBorde, { left: colaX - COLA - 2, borderTopColor: color }]} />
          <View pointerEvents="none" style={[s.colaRelleno, { left: colaX - COLA }]} />
        </View>

        {/* Personaje de pie en la parte baja, llegando desde el costado */}
        <Animated.View
          pointerEvents="none"
          style={{
            marginLeft: izqFigura,
            marginTop: 10,
            opacity: opacidadLlegada,
            transform: sinDesplazar ? [] : [{ translateX: desplazamiento }],
          }}
        >
          <PersonajeVivo personaje={personaje} animo={animo} tamano={tamano} />
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,18,24,0.82)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    zIndex: 40,
    elevation: 40,
  },
  escena: { alignItems: 'flex-start' },
  globo: {
    alignSelf: 'stretch',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 18,
    borderRadius: radii.lg,
    borderWidth: 2,
    backgroundColor: FONDO_GLOBO,
    marginBottom: COLA,
  },
  nombre: { ...ui.pillTxt, textTransform: 'uppercase', marginBottom: 6 },
  texto: { ...ui.bodyMed, color: colors.cielo },
  reserva: { opacity: 0 },
  escrito: { position: 'absolute', top: 0, left: 0, right: 0 },
  acciones: { marginTop: 14, alignItems: 'stretch' },
  btn: {
    alignItems: 'center',
    backgroundColor: colors.doradoNeon, borderRadius: radii.pill, paddingVertical: 12,
  },
  btnTxt: { color: colors.noche, fontSize: 16, fontFamily: fonts.extra, letterSpacing: 0.3 },
  seguirBtn: { marginTop: 8, paddingVertical: 6, alignItems: 'center' },
  seguir: { color: colors.turquesaSuave, fontSize: 15, fontFamily: fonts.semibold },
  colaBorde: {
    position: 'absolute', bottom: -(COLA + 4), width: 0, height: 0,
    borderLeftWidth: COLA + 2, borderRightWidth: COLA + 2, borderTopWidth: COLA + 4,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
  colaRelleno: {
    position: 'absolute', bottom: -(COLA + 0.5), width: 0, height: 0,
    borderLeftWidth: COLA, borderRightWidth: COLA, borderTopWidth: COLA + 1,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: FONDO_GLOBO,
  },
});
