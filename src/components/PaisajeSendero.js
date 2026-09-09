import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { G, Path, Circle, Ellipse } from 'react-native-svg';

const paleta = {
  "suelo": "#173C42",
  "solParamo": "#8C784E",
  "cerroFondo": "#28524E",
  "cerroFrente": "#397365",
  "nieve": "#9CB6A5",
  "nieveSombra": "#8BAB9A",
  "aguaParamo": "#467D83",
  "surco": "#7A6748",
  "tallo": "#5B9070",
  "hoja": "#4C7855",
  "espiga": "#9B8856",
  "puesto": "#4B5C51",
  "techo": "#9A784D",
  "toldo": "#587859",
  "madera": "#7A664B",
  "frutaVerde": "#839159",
  "frutaDorada": "#AA884F",
  "canasto": "#9D7553",
  "lena": "#816D52",
  "llama": "#996B46",
  "brasa": "#C19C5E",
  "humo": "#6F8780",
  "cerroLaguna": "#315D58",
  "nieveLaguna": "#87A59A",
  "laguna": "#326475",
  "reflejo": "#71A39E",
  "solLaguna": "#9B8D62"
};

// Pequeñas escenas al lado de cada mundo. La capa completa es decorativa:
// no intercepta gestos ni añade elementos al recorrido del lector de pantalla.
export default function PaisajeSendero({ ancho, alto, nodos }) {
  const tamano = Math.min(130, ancho * 0.27);
  return (
    <Svg width={ancho} height={alto} style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false}>
      {nodos.map(({ mundo, cx, cy, estado }) => {
        const centroX = cx < ancho * 0.5 ? ancho * 0.79 : ancho * 0.2;
        return (
          <G key={mundo.id} transform={`translate(${centroX - tamano / 2}, ${cy - tamano / 2}) scale(${tamano / 120})`} opacity={estado === 'bloqueado' ? 0.36 : 0.68}>
            <Ellipse cx="60" cy="101" rx="56" ry="8" fill={paleta.suelo} />
            {mundo.id === 1 && <>
              <Circle cx="92" cy="24" r="12" fill={paleta.solParamo} />
              <Path d="M3 96 41 24 78 96Z" fill={paleta.cerroFondo} />
              <Path d="M38 96 79 41 117 96Z" fill={paleta.cerroFrente} />
              <Path d="M31 43 41 24 52 45 41 40Z" fill={paleta.nieve} />
              <Path d="M72 51 79 41 89 55 80 51Z" fill={paleta.nieveSombra} />
              <Ellipse cx="68" cy="99" rx="28" ry="4" fill={paleta.aguaParamo} />
            </>}
            {mundo.id === 2 && <>
              <Path d="M8 99Q57 74 112 99M15 105Q60 82 105 105" fill="none" stroke={paleta.surco} strokeWidth="5" strokeLinecap="round" />
              {[30, 60, 90].map((x, i) => <G key={x} transform={`translate(${x}, ${i === 1 ? 0 : 12})`}>
                <Path d="M0 85V36" stroke={paleta.tallo} strokeWidth="4" strokeLinecap="round" />
                <Path d="M0 64Q-25 64-22 44Q-3 44 0 64M0 50Q23 48 21 29Q3 32 0 50" fill={paleta.hoja} />
                <Path d="M0 36Q-11 19 0 13Q12 24 0 36" fill={paleta.espiga} />
              </G>)}
            </>}
            {mundo.id === 3 && <>
              <Path d="M18 99V56H102V99" fill={paleta.puesto} />
              <Path d="M8 55 28 26H92L112 55Z" fill={paleta.techo} />
              <Path d="M32 55 44 26H58L54 55M76 55 70 26H84L96 55" fill={paleta.toldo} />
              <Path d="M22 76H99V96H22Z" fill={paleta.madera} />
              <Circle cx="37" cy="72" r="7" fill={paleta.frutaVerde} />
              <Circle cx="55" cy="72" r="7" fill={paleta.frutaDorada} />
              <Path d="M72 76V60H89V76Z" fill={paleta.canasto} />
            </>}
            {mundo.id === 4 && <>
              <Path d="M30 97 88 77M34 77 91 97" stroke={paleta.lena} strokeWidth="9" strokeLinecap="round" />
              <Path d="M59 87C21 83 36 55 47 42C44 63 58 57 58 20C92 48 93 74 73 84Z" fill={paleta.llama} />
              <Path d="M59 82C43 75 51 63 60 51C60 66 73 66 71 76Z" fill={paleta.brasa} />
              <Path d="M52 10Q42 2 49-5M77 17Q87 10 81 2" stroke={paleta.humo} strokeWidth="3" fill="none" strokeLinecap="round" />
            </>}
            {mundo.id === 5 && <>
              <Path d="M6 82 31 42 58 80 85 29 115 82Z" fill={paleta.cerroLaguna} />
              <Path d="M74 45 85 29 96 48 85 42Z" fill={paleta.nieveLaguna} />
              <Ellipse cx="62" cy="88" rx="49" ry="13" fill={paleta.laguna} />
              <Path d="M34 86H88M48 93H76" stroke={paleta.reflejo} strokeWidth="3" strokeLinecap="round" />
              <Circle cx="24" cy="22" r="10" fill={paleta.solLaguna} />
            </>}
          </G>
        );
      })}
    </Svg>
  );
}
