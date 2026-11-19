import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Animated, AccessibilityInfo, Easing } from 'react-native';
import Svg, { Circle, Path, Line, G, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { idPersonaje, datosPersonaje, infoFigura, cajaFigura } from '../data/personajesUtil';
import { figuraVectorDe, PishkuAlaDelantera, ALA_PIVOTE } from './figuras/index';

// Personaje "vivo" integrado en la escena: la figura vectorial (src/components/figuras,
// solo react-native-svg) aparece de pie o flotando, sin aro ni fondo, con una sombra de suelo suave.
// Entra a su manera, tiene un reposo propio (Kinti respira y se balancea, Uma
// asiente, Pishku flota y aletea, Chutun rebota, Taita Rimay flota y titila) y
// reacciona con gestos según su ánimo; las decoraciones del ánimo salen junto a
// su CABEZA. Solo Animated (transform/opacity con useNativeDriver) y react-native-svg.
// La figura recibe el ánimo visible (cara) y parpadea cada pocos segundos; Pishku
// bate el ala delantera en una capa propia que gira sobre el hombro (ALA_PIVOTE).
//
// Props:
//   personaje        id ('taita-rimay') o clave de asset ('taita_rimay')
//   animo            neutral | feliz | pensativo | sorprendido | travieso
//   pulso            número; al cambiar re-dispara el gesto del ánimo actual
//   tamano           ALTURA visible de la figura en px (default 72); el ancho sale
//                    del aspecto (las figuras anchas se limitan a ~1.25x tamano)
//   marco, colorMarco  se aceptan por compatibilidad y se ignoran (ya no hay aro)
//   entrada          anima la entrada propia del personaje (default true)
//   onPress          al tocar: completa la entrada y lo llama (sin onPress no capta toques)
//   style, accessibilityLabel

// La caja se ajusta a la figura con márgenes pequeños (MARGEN_FIGURA en
// personajesUtil) para las decoraciones del ánimo y la sombra.

const DURACION_ENTRADA = {
  pishku: 750,
  chutun: 850,
  uma: 800,
  'taita-rimay': 1200,
  kinti: 700,
};

// Medio ciclo del reposo de cada personaje (ms).
const MEDIO_REPOSO = {
  kinti: 1600,
  uma: 1800,
  pishku: 900,
  chutun: 650,
  'taita-rimay': 2200,
};

const ANIMOS = ['neutral', 'feliz', 'pensativo', 'sorprendido', 'travieso'];

const SUAVE = Easing.inOut(Easing.sin);

// Parpadeo: ojos cerrados ~140 ms cada 2.8–5 s (intervalo aleatorio).
const PARPADEO_MS = 140;
const esperaParpadeo = () => 2800 + Math.random() * 2200;
// Aleteo del ala delantera de Pishku: medio golpe (ms) y amplitud (grados).
const ALA_MEDIO_GOLPE = 80;
const ALA_GRADOS = 15;

// Estrella de 4 puntas (destello) centrada en (cx, cy).
function destello(cx, cy, r) {
  return `M ${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${cy + r} Q ${cx} ${cy} ${cx - r} ${cy} Q ${cx} ${cy} ${cx} ${cy - r} Z`;
}

// Decoración del ánimo alrededor de la cabeza (hx, hy, radio hr) en px de la caja.
// u es la unidad de tamaño (10% de la altura de la figura).
function Decoracion({ animo, hx, hy, hr, u, ancho, alto }) {
  const cx = (x, r) => Math.max(r, Math.min(ancho - r, x));
  const cy = (y, r) => Math.max(r, Math.min(alto - r, y));
  const trazo = Math.max(1.4, u * 0.24);

  if (animo === 'feliz') {
    const puntos = [
      [hx + hr + 0.9 * u, hy - hr - 0.3 * u, 0.8 * u, colors.doradoNeon],
      [hx - hr - 0.8 * u, hy - 0.4 * u, 0.55 * u, colors.doradoNeon],
      [hx + hr + 1.1 * u, hy + 0.7 * u, 0.5 * u, colors.cielo],
      [hx - hr - 0.3 * u, hy - hr - 0.9 * u, 0.45 * u, colors.doradoNeon],
    ];
    return (
      <G>
        {puntos.map(([x, y, r, c], i) => (
          <Path key={i} d={destello(cx(x, r), cy(y, r), r)} fill={c} />
        ))}
      </G>
    );
  }
  if (animo === 'pensativo') {
    const burbujas = [
      [hx + hr + 0.3 * u, hy - hr - 0.1 * u, 0.3 * u],
      [hx + hr + 0.9 * u, hy - hr - 0.6 * u, 0.38 * u],
      [hx + hr + 1.6 * u, hy - hr - 1.1 * u, 0.46 * u],
    ];
    return (
      <G>
        {burbujas.map(([x, y, r], i) => (
          <Circle key={i} cx={cx(x, r)} cy={cy(y, r)} r={r} fill={colors.cielo} />
        ))}
      </G>
    );
  }
  if (animo === 'sorprendido') {
    const r1 = hr + 0.35 * u;
    const r2 = hr + 1.0 * u;
    return (
      <G>
        {[-150, -120, -90, -60, -30].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return (
            <Line
              key={i}
              x1={cx(hx + r1 * Math.cos(rad), 1)} y1={cy(hy + r1 * Math.sin(rad), 1)}
              x2={cx(hx + r2 * Math.cos(rad), 1)} y2={cy(hy + r2 * Math.sin(rad), 1)}
              stroke={colors.doradoNeon} strokeWidth={trazo} strokeLinecap="round"
            />
          );
        })}
      </G>
    );
  }
  if (animo === 'travieso') {
    const x = Math.min(ancho - 2 * u, hx + hr + 0.4 * u);
    const y = cy(hy - hr - 0.2 * u, 1.2 * u);
    return (
      <Path
        d={`M ${x} ${y} C ${x + 1.2 * u} ${y - 0.8 * u}, ${x + 1.8 * u} ${y + 0.6 * u}, ${x + 0.8 * u} ${y + 1.0 * u} C ${x + 0.2 * u} ${y + 1.2 * u}, ${x} ${y + 0.4 * u}, ${x + 0.6 * u} ${y + 0.3 * u}`}
        stroke={colors.turquesaSuave} strokeWidth={trazo} fill="none" strokeLinecap="round"
      />
    );
  }
  return null;
}

export default function PersonajeVivo({
  personaje,
  animo = 'neutral',
  pulso = 0,
  tamano = 72,
  marco, // eslint-disable-line no-unused-vars -- compatibilidad: ya no hay aro
  colorMarco, // eslint-disable-line no-unused-vars -- compatibilidad
  entrada = true,
  onPress,
  style,
  accessibilityLabel,
}) {
  const id = idPersonaje(personaje);
  const datos = datosPersonaje(id);
  const figura = figuraVectorDe(id);
  const Figura = figura.Componente;
  const info = infoFigura(id);
  const geo = cajaFigura(id, tamano);
  const { figAncho, figAlto, padX, padArriba } = geo;
  const cajaAncho = geo.ancho;
  const cajaAlto = geo.alto;
  const animoOk = ANIMOS.includes(animo) ? animo : 'neutral';
  const durEntrada = DURACION_ENTRADA[id] || 800;
  const medioReposo = MEDIO_REPOSO[id] || 1500;

  // ── Hooks (todos arriba, sin returns tempranos) ──
  const entradaAV = useRef(new Animated.Value(entrada ? 0 : 1)).current;
  const aleteoAV = useRef(new Animated.Value(0)).current;
  const reposoAV = useRef(new Animated.Value(0)).current;
  const balanceoAV = useRef(new Animated.Value(0)).current;
  const gestoAV = useRef(new Animated.Value(0)).current;
  const decoAV = useRef(new Animated.Value(0)).current;
  const alaAV = useRef(new Animated.Value(0)).current;

  const entradaAnimRef = useRef(null);
  const aleteoRef = useRef(null);
  const reposoRef = useRef(null);
  const balanceoRef = useRef(null);
  const gestoRef = useRef(null);
  const alaRef = useRef(null);
  const montadoRef = useRef(false);
  const reduceRef = useRef(false);
  const vivoRef = useRef(true);

  const [reduce, setReduce] = useState(false);
  const [listo, setListo] = useState(false);
  const [animoVisible, setAnimoVisible] = useState(animoOk);
  const animoVisibleRef = useRef(animoOk);
  const [ojosCerrados, setOjosCerrados] = useState(false);

  // Aleteo periódico de Pishku en reposo: tres golpes rápidos y una pausa.
  const iniciarAleteoReposo = () => {
    if (!vivoRef.current || reduceRef.current || id !== 'pishku') return;
    const anterior = aleteoRef.current;
    aleteoRef.current = null;
    if (anterior) anterior.stop();
    aleteoAV.setValue(0);
    const golpe = (v) => Animated.timing(aleteoAV, { toValue: v, duration: 70, useNativeDriver: true });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(1400),
        golpe(1), golpe(-1), golpe(1), golpe(-1), golpe(0),
      ])
    );
    aleteoRef.current = loop;
    loop.start();
  };

  // Consulta "reducir movimiento" y arranca entrada + reposo propio.
  useEffect(() => {
    let cancelado = false;
    vivoRef.current = true;
    const arrancar = (rm) => {
      if (cancelado) return;
      reduceRef.current = !!rm;
      setReduce(!!rm);
      setListo(true);

      let aleteoEntrada = false;
      if (entrada) {
        entradaAV.setValue(0);
        const anim = Animated.timing(entradaAV, {
          toValue: 1,
          duration: rm ? 400 : durEntrada,
          useNativeDriver: true,
        });
        entradaAnimRef.current = anim;
        anim.start(({ finished }) => {
          if (finished) entradaAnimRef.current = null;
        });

        if (!rm && id === 'pishku') {
          aleteoEntrada = true;
          const aleteo = Animated.loop(
            Animated.sequence([
              Animated.timing(aleteoAV, { toValue: 1, duration: 90, useNativeDriver: true }),
              Animated.timing(aleteoAV, { toValue: -1, duration: 90, useNativeDriver: true }),
            ]),
            { iterations: Math.max(2, Math.round(durEntrada / 180)) }
          );
          aleteoRef.current = aleteo;
          aleteo.start(({ finished }) => {
            // Si lo cortó completarEntrada, el aleteo de reposo ya ocupa la ref.
            if (aleteoRef.current !== aleteo) return;
            aleteoAV.setValue(0);
            aleteoRef.current = null;
            if (finished && !cancelado) iniciarAleteoReposo();
          });
        }
      } else {
        entradaAV.setValue(1);
      }

      if (!rm) {
        const reposo = Animated.loop(
          Animated.sequence([
            Animated.timing(reposoAV, { toValue: 1, duration: medioReposo, easing: SUAVE, useNativeDriver: true }),
            Animated.timing(reposoAV, { toValue: 0, duration: medioReposo, easing: SUAVE, useNativeDriver: true }),
          ])
        );
        reposoRef.current = reposo;
        reposo.start();

        if (id === 'kinti') {
          const balanceo = Animated.loop(
            Animated.sequence([
              Animated.timing(balanceoAV, { toValue: 1, duration: 2600, easing: SUAVE, useNativeDriver: true }),
              Animated.timing(balanceoAV, { toValue: 0, duration: 2600, easing: SUAVE, useNativeDriver: true }),
            ])
          );
          balanceoRef.current = balanceo;
          balanceo.start();
        }
        if (!aleteoEntrada) iniciarAleteoReposo();

        if (id === 'pishku') {
          // Aleteo continuo y rápido del ala delantera (colibrí).
          alaAV.setValue(0);
          const ala = Animated.loop(
            Animated.sequence([
              Animated.timing(alaAV, { toValue: 1, duration: ALA_MEDIO_GOLPE, easing: SUAVE, useNativeDriver: true }),
              Animated.timing(alaAV, { toValue: -1, duration: ALA_MEDIO_GOLPE * 2, easing: SUAVE, useNativeDriver: true }),
              Animated.timing(alaAV, { toValue: 0, duration: ALA_MEDIO_GOLPE, easing: SUAVE, useNativeDriver: true }),
            ])
          );
          alaRef.current = ala;
          ala.start();
        }
      }
    };

    let promesa;
    try {
      promesa = AccessibilityInfo.isReduceMotionEnabled();
    } catch (e) {
      promesa = null;
    }
    if (promesa && typeof promesa.then === 'function') {
      promesa.then(arrancar, () => arrancar(false));
    } else {
      arrancar(false);
    }

    return () => {
      cancelado = true;
      vivoRef.current = false;
      [entradaAnimRef, aleteoRef, reposoRef, balanceoRef, alaRef].forEach((r) => {
        if (r.current) r.current.stop();
        r.current = null;
      });
    };
    // El personaje define la entrada; se re-ejecuta solo si cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Parpadeo: timeouts encadenados (cierra ~140 ms y vuelve a esperar 2.8–5 s).
  // Se mantiene con "reducir movimiento": es un cambio mínimo de la cara.
  useEffect(() => {
    let activo = true;
    let t = null;
    const programar = () => {
      t = setTimeout(() => {
        if (!activo) return;
        setOjosCerrados(true);
        t = setTimeout(() => {
          if (!activo) return;
          setOjosCerrados(false);
          programar();
        }, PARPADEO_MS);
      }, esperaParpadeo());
    };
    programar();
    return () => {
      activo = false;
      if (t) clearTimeout(t);
    };
  }, [id]);

  // Gesto del ánimo: se dispara al cambiar animo o pulso (y al montar si no es neutral).
  useEffect(() => {
    if (!listo) return undefined;
    const esPrimero = !montadoRef.current;
    montadoRef.current = true;

    if (gestoRef.current) gestoRef.current.stop();

    if (animoOk === 'neutral') {
      // La decoración y la transformación del ánimo anterior siguen montadas mientras
      // se desvanecen; solo al terminar se pasa a 'neutral' (sin cortes bruscos).
      // 'pensativo' reposa en gestoAV=1 (inclinado) y vuelve a 0; los gestos de ida y
      // vuelta (feliz, sorprendido, travieso) reposan en 1, así que se completan hacia 1.
      const previo = animoVisibleRef.current;
      const destinoGesto = previo === 'pensativo' ? 0 : 1;
      const anim = Animated.parallel([
        Animated.timing(decoAV, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(gestoAV, { toValue: destinoGesto, duration: 250, useNativeDriver: true }),
      ]);
      gestoRef.current = anim;
      anim.start(({ finished }) => {
        if (!finished) return;
        animoVisibleRef.current = 'neutral';
        setAnimoVisible('neutral');
        gestoAV.setValue(0);
      });
      return () => anim.stop();
    }

    animoVisibleRef.current = animoOk;
    setAnimoVisible(animoOk);
    gestoAV.setValue(0);
    decoAV.setValue(0);
    const rm = reduceRef.current;
    const espera = esPrimero && entrada ? (rm ? 400 : durEntrada) : 0;
    const durGesto = { feliz: 700, pensativo: 450, sorprendido: 400, travieso: 800 }[animoOk];
    const persistente = animoOk === 'pensativo';

    const pasos = [];
    if (espera) pasos.push(Animated.delay(espera));
    pasos.push(
      Animated.parallel([
        Animated.timing(gestoAV, { toValue: 1, duration: rm ? 1 : durGesto, useNativeDriver: true }),
        Animated.timing(decoAV, { toValue: 1, duration: 180, useNativeDriver: true }),
      ])
    );
    if (!persistente) {
      pasos.push(Animated.delay(rm ? 900 : 700));
      pasos.push(Animated.timing(decoAV, { toValue: 0, duration: 400, useNativeDriver: true }));
    }
    const anim = Animated.sequence(pasos);
    gestoRef.current = anim;
    anim.start();
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animoOk, pulso, listo]);

  // ── Interpolaciones ──
  const h = figAlto;

  const opacidadEntrada = (() => {
    if (reduce) return entradaAV;
    if (id === 'pishku') return entradaAV.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 1] });
    if (id === 'kinti') return entradaAV.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 1, 1] });
    return entradaAV;
  })();

  const transformEntrada = (() => {
    if (reduce) return [];
    if (id === 'pishku') {
      return [
        { translateX: entradaAV.interpolate({ inputRange: [0, 1], outputRange: [-h * 0.8, 0] }) },
        { translateY: entradaAV.interpolate({ inputRange: [0, 0.5, 1], outputRange: [h * 0.3, -h * 0.35, 0] }) },
      ];
    }
    if (id === 'chutun') {
      return [{ scale: entradaAV.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }];
    }
    if (id === 'taita-rimay') {
      return [
        { translateY: entradaAV.interpolate({ inputRange: [0, 1], outputRange: [h * 0.08, 0] }) },
        { scale: entradaAV.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
      ];
    }
    if (id === 'kinti') {
      // Llega caminando desde la izquierda, con dos pasitos.
      return [
        { translateX: entradaAV.interpolate({ inputRange: [0, 1], outputRange: [-h * 0.45, 0] }) },
        {
          translateY: entradaAV.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, -h * 0.05, 0, -h * 0.04, 0],
          }),
        },
      ];
    }
    // uma: la figura se revela por opacidad y el hilo dorado cruza junto al telar
    return [];
  })();

  // Reposo propio de cada personaje. Las capas giran y escalan sobre el punto de
  // apoyo (transformOrigin en los pies), así la figura no se despega de su sombra.
  const transformReposo = (() => {
    if (reduce) return [];
    if (id === 'kinti') {
      return [
        { scaleY: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] }) },
        { rotate: balanceoAV.interpolate({ inputRange: [0, 1], outputRange: ['-1deg', '1deg'] }) },
      ];
    }
    if (id === 'uma') {
      return [{ rotate: reposoAV.interpolate({ inputRange: [0, 1], outputRange: ['-1.2deg', '1.2deg'] }) }];
    }
    if (id === 'pishku') {
      return [
        { translateY: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [h * 0.035, -h * 0.035] }) },
        { rotate: aleteoAV.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] }) },
      ];
    }
    if (id === 'chutun') {
      // Squash & stretch: aplastado abajo (0) y estirado en el aire (1).
      return [
        { translateY: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [0, -h * 0.06] }) },
        { scaleX: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [1.04, 0.97] }) },
        { scaleY: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.04] }) },
      ];
    }
    // taita-rimay: flota lento
    return [{ translateY: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [h * 0.025, -h * 0.025] }) }];
  })();

  // Taita Rimay es un espíritu: su luz pulsa suave.
  const opacidadReposo = !reduce && id === 'taita-rimay'
    ? reposoAV.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] })
    : 1;

  const transformGesto = (() => {
    if (reduce) return [];
    if (animoVisible === 'feliz') {
      return [{
        translateY: gestoAV.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, -h * 0.12, 0, -h * 0.07, 0],
        }),
      }];
    }
    if (animoVisible === 'pensativo') {
      return [{ rotate: gestoAV.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '5deg'] }) }];
    }
    if (animoVisible === 'sorprendido') {
      return [{ scale: gestoAV.interpolate({ inputRange: [0, 0.3, 1], outputRange: [1, 1.1, 1] }) }];
    }
    if (animoVisible === 'travieso') {
      return [{
        rotate: gestoAV.interpolate({
          inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
          outputRange: ['0deg', '8deg', '-8deg', '6deg', '-4deg', '0deg'],
        }),
      }];
    }
    return [];
  })();

  // Sombra de suelo: elipse difusa bajo los pies. Para los que flotan es más
  // pequeña y tenue, y se encoge cuando suben.
  const sombraRx = Math.max(4, (info.anchoSombra * figAncho) / 2);
  const sombraRy = Math.max(2, h * (info.flota ? 0.028 : 0.04));
  const sombraCx = padX + info.pie.x * figAncho;
  const sombraCy = padArriba + info.pie.y * h;
  const sombraOpacidad = info.flota ? 0.55 : 1;
  // Punto de apoyo (px de la caja) para transformOrigin; en array porque la forma
  // de texto solo admite enteros.
  const origenPies = [sombraCx, sombraCy, 0];
  const transformSombra = (() => {
    if (reduce) return [];
    if (info.flota) return [{ scale: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [1, 0.75] }) }];
    if (id === 'chutun') {
      return [{ scaleX: reposoAV.interpolate({ inputRange: [0, 1], outputRange: [1.06, 0.82] }) }];
    }
    return [];
  })();

  // Volutas de niebla (entrada de chutun) e hilo de la tejedora (entrada de uma).
  const opacidadVolutas = entradaAV.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.9, 0] });
  const opacidadHilo = entradaAV.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 1, 0.5] });
  const desplazaHilo = reduce
    ? []
    : [{ translateX: entradaAV.interpolate({ inputRange: [0, 1], outputRange: [-cajaAncho * 0.25, 0] }) }];

  // Coordenadas de la caja en px desde un 0..100 relativo.
  const px = (x) => (x * cajaAncho) / 100;
  const py = (y) => (y * cajaAlto) / 100;
  // Coordenadas desde un 0..1 relativo a la figura.
  const fx = (x) => padX + x * figAncho;
  const fy = (y) => padArriba + y * h;

  const unidad = Math.max(4, h * 0.1);
  const etiqueta = accessibilityLabel || datos?.nombre || 'Personaje';

  const completarEntrada = () => {
    if (entradaAnimRef.current) {
      entradaAnimRef.current.stop();
      entradaAnimRef.current = null;
    }
    entradaAV.setValue(1);
    if (id === 'pishku' && !reduceRef.current) iniciarAleteoReposo();
    if (onPress) onPress();
  };

  // Sin onPress no se usa Pressable: así la figura no se vuelve responder del toque
  // ni se traga los toques de su contenedor.
  const Contenedor = onPress ? Pressable : View;
  const propsContenedor = onPress
    ? { onPress: completarEntrada, accessibilityRole: 'button', accessibilityLabel: etiqueta }
    : { accessible: !!accessibilityLabel, accessibilityRole: 'image', accessibilityLabel: etiqueta };

  const capa = { width: cajaAncho, height: cajaAlto };
  const cajaFig = { left: padX, top: padArriba, width: figAncho, height: h };
  const conAla = id === 'pishku';
  // Hombro del ala en px de la figura (el viewBox se escala igual en ambos ejes).
  const [vbAncho, vbAlto] = figura.VIEWBOX.split(/\s+/).slice(2).map(Number);
  const origenAla = [(ALA_PIVOTE.x / vbAncho) * figAncho, (ALA_PIVOTE.y / vbAlto) * h, 0];
  const transformAla = reduce
    ? []
    : [{ rotate: alaAV.interpolate({ inputRange: [-1, 1], outputRange: [`-${ALA_GRADOS}deg`, `${ALA_GRADOS}deg`] }) }];

  // Elementos memorizados: cuando este componente se re-renderiza por otra causa
  // (re-render del padre, estado interno) React reutiliza el mismo elemento y no vuelve
  // a reconciliar los cientos de trazos del SVG; el ala ni siquiera con el parpadeo.
  const elementoFigura = useMemo(
    () => (
      <Figura
        width={figAncho}
        height={h}
        animo={animoVisible}
        ojosCerrados={ojosCerrados}
        {...(conAla ? { sinAlaDelantera: true } : null)}
      />
    ),
    [Figura, figAncho, h, animoVisible, ojosCerrados, conAla]
  );
  const elementoAla = useMemo(
    () => (conAla ? <PishkuAlaDelantera width={figAncho} height={h} /> : null),
    [conAla, figAncho, h]
  );

  return (
    <Contenedor
      {...propsContenedor}
      style={[capa, s.caja, style]}
    >
      {/* Sombra de suelo (no sigue al gesto: queda en el piso) */}
      <Animated.View
        pointerEvents="none"
        style={[
          s.abs,
          {
            left: sombraCx - sombraRx,
            top: sombraCy - sombraRy,
            width: sombraRx * 2,
            height: sombraRy * 2,
            opacity: opacidadEntrada,
            transform: transformSombra,
          },
        ]}
      >
        <Svg width={sombraRx * 2} height={sombraRy * 2}>
          <Defs>
            <RadialGradient id="sombra" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#000" stopOpacity={0.45 * sombraOpacidad} />
              <Stop offset="0.6" stopColor="#000" stopOpacity={0.22 * sombraOpacidad} />
              <Stop offset="1" stopColor="#000" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={sombraRx} cy={sombraRy} rx={sombraRx} ry={sombraRy} fill="url(#sombra)" />
        </Svg>
      </Animated.View>

      {/* Hilo dorado de la tejedora: cruza junto al telar mientras ella aparece */}
      {entrada && id === 'uma' ? (
        <Animated.View pointerEvents="none" style={[s.abs, capa, { opacity: opacidadHilo, transform: desplazaHilo }]}>
          <Svg width={cajaAncho} height={cajaAlto}>
            <Path
              d={`M 0 ${fy(0.36)} C ${fx(0.15)} ${fy(0.22)}, ${fx(0.32)} ${fy(0.62)}, ${fx(0.52)} ${fy(0.55)} S ${fx(0.8)} ${fy(0.42)}, ${cajaAncho} ${fy(0.3)}`}
              stroke={colors.doradoNeon} strokeWidth={Math.max(1.2, h * 0.014)} fill="none" strokeLinecap="round"
            />
            <Circle cx={fx(0.18)} cy={fy(0.33)} r={Math.max(1.2, h * 0.012)} fill={colors.doradoNeon} />
            <Circle cx={fx(0.72)} cy={fy(0.45)} r={Math.max(1.2, h * 0.01)} fill={colors.doradoNeon} />
          </Svg>
        </Animated.View>
      ) : null}

      {/* Entrada, reposo y gesto: tres capas anidadas que transforman sobre los pies */}
      <Animated.View style={[s.abs, capa, { transformOrigin: origenPies, opacity: opacidadEntrada, transform: transformEntrada }]}>
        <Animated.View style={[s.abs, capa, { transformOrigin: origenPies, opacity: opacidadReposo, transform: transformReposo }]}>
          <Animated.View style={[s.abs, capa, { transformOrigin: origenPies, transform: transformGesto }]}>
            <View pointerEvents="none" style={[s.abs, cajaFig]}>
              {elementoFigura}
            </View>
            {conAla ? (
              <Animated.View
                pointerEvents="none"
                style={[s.abs, cajaFig, { transformOrigin: origenAla, transform: transformAla }]}
              >
                {elementoAla}
              </Animated.View>
            ) : null}

            {/* Decoración del ánimo junto a la cabeza */}
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: decoAV }]}>
              <Svg width={cajaAncho} height={cajaAlto}>
                <Decoracion
                  animo={animoVisible}
                  hx={geo.cabezaX}
                  hy={geo.cabezaY}
                  hr={info.radioCabeza * h}
                  u={unidad}
                  ancho={cajaAncho}
                  alto={cajaAlto}
                />
              </Svg>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {/* Volutas de niebla de la entrada de Chutun */}
      {entrada && id === 'chutun' ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: opacidadVolutas }]}>
          <Svg width={cajaAncho} height={cajaAlto}>
            <Path
              d={`M ${px(6)} ${py(64)} C ${px(14)} ${py(54)}, ${px(26)} ${py(58)}, ${px(24)} ${py(66)} C ${px(22)} ${py(72)}, ${px(14)} ${py(70)}, ${px(16)} ${py(64)}`}
              stroke={colors.turquesaSuave} strokeWidth={Math.max(1.4, unidad * 0.22)} fill="none" strokeLinecap="round"
            />
            <Path
              d={`M ${px(94)} ${py(38)} C ${px(86)} ${py(28)}, ${px(74)} ${py(32)}, ${px(76)} ${py(40)} C ${px(78)} ${py(46)}, ${px(86)} ${py(44)}, ${px(84)} ${py(38)}`}
              stroke={colors.cielo} strokeWidth={Math.max(1.4, unidad * 0.22)} fill="none" strokeLinecap="round"
            />
            <Path
              d={`M ${px(30)} ${py(94)} C ${px(40)} ${py(86)}, ${px(56)} ${py(90)}, ${px(60)} ${py(96)}`}
              stroke={colors.turquesaSuave} strokeWidth={Math.max(1.2, unidad * 0.2)} fill="none" strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
      ) : null}
    </Contenedor>
  );
}

const s = StyleSheet.create({
  caja: { position: 'relative' },
  abs: { position: 'absolute', top: 0, left: 0 },
});
