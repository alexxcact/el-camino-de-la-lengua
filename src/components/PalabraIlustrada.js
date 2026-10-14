import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Polygon, Polyline, Defs, ClipPath } from 'react-native-svg';

// Ilustraciones vectoriales propias — estilo "Pasto luminoso": íconos planos de 2 tonos,
// trazo redondeado de tinta y paleta cultural, SIEMPRE dentro de un círculo crema.
// La palabra (palabra.p) determina el dibujo; las entradas sin dibujo propio usan su emoji.
// La tarjeta contenedora da la descripción accesible, por eso el SVG es decorativo.
export default function PalabraIlustrada({ palabra, tamano = 64, style }) {
  const lado = Number.isFinite(tamano) && tamano > 0 ? tamano : 64;
  const dibujo = ilustrar(palabra?.p);

  return (
    <View
      style={[styles.marco, { width: lado, height: lado }, style]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      {dibujo ? (
        <Svg width={lado} height={lado} viewBox="0 0 100 100" accessible={false}>
          <Defs>
            <ClipPath id="piClip"><Circle cx={50} cy={50} r={46} /></ClipPath>
          </Defs>
          <Circle cx={50} cy={50} r={46} fill="#F7F3E7" />
          <G clipPath="url(#piClip)">{dibujo}</G>
        </Svg>
      ) : (
        <Text accessible={false} style={{ fontSize: lado * 0.7, lineHeight: lado, textAlign: 'center' }}>
          {palabra?.emoji || '◇'}
        </Text>
      )}
    </View>
  );
}

function ilustrar(palabra) {
  switch (palabra) {
    case "Zon":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Ellipse cx="50" cy="84" rx="20" ry="4" fill="#D2693D" opacity="0.18"/>
    <Path d="M45 84 L47 58 H53 L55 84Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <G fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round">
      <Path d="M50 60 Q30 48 20 50 Q26 64 50 60Z"/>
      <Path d="M50 60 Q70 48 80 50 Q74 64 50 60Z"/>
      <Path d="M50 60 Q34 40 38 28 Q50 34 50 60Z"/>
      <Path d="M50 60 Q66 40 62 28 Q50 34 50 60Z"/>
      <Path d="M50 60 Q42 36 50 24 Q58 36 50 60Z"/>
    </G>
    <G fill="#F4C430" stroke="#0B1F28" strokeWidth="1.6"><Circle cx="38" cy="30" r="4"/><Circle cx="62" cy="30" r="4"/><Circle cx="50" cy="24" r="4"/></G></G>);
    case "Ina":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M16 34 Q32 28 46 35" fill="none" stroke="#8A9BA0" strokeWidth="3.4" strokeLinecap="round"/><Path d="M14 50 Q38 40 58 50 Q68 55 62 62" fill="none" stroke="#3FA9E0" strokeWidth="3.6" strokeLinecap="round"/><Path d="M18 66 Q36 60 50 67" fill="none" stroke="#8A9BA0" strokeWidth="3.2" strokeLinecap="round"/><Path d="M64 24 C76 26 82 38 74 48 C66 58 52 54 52 42 C52 32 56 23 64 24Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M64 28 L56 46" stroke="#1E8F5E" strokeWidth="2.6" strokeLinecap="round"/></G>);
    case "Chill":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="62" cy="36" r="14" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M26 64 C18 64 14 56 20 51 C19 42 30 38 37 43 C41 35 54 35 58 44 C68 43 74 51 68 58 C72 64 66 70 58 68 C50 72 34 72 26 64Z" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M30 60 C36 63 48 63 56 60" fill="none" stroke="#8A9BA0" strokeWidth="2.6" strokeLinecap="round" opacity="0.6"/><Path d="M62 72 Q66 68 70 72 Q74 68 78 72" fill="none" stroke="#0B1F28" strokeWidth="3" strokeLinecap="round"/></G>);
    case "Chil":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><G stroke="#3FA9E0" strokeWidth="4" strokeLinecap="round"><Line x1="50" y1="14" x2="50" y2="86"/><Line x1="18" y1="32" x2="82" y2="68"/><Line x1="18" y1="68" x2="82" y2="32"/></G><G stroke="#2B86C4" strokeWidth="3.2" strokeLinecap="round"><Line x1="50" y1="22" x2="42" y2="14"/><Line x1="50" y1="22" x2="58" y2="14"/><Line x1="50" y1="78" x2="42" y2="86"/><Line x1="50" y1="78" x2="58" y2="86"/><Line x1="26" y1="37" x2="16" y2="34"/><Line x1="26" y1="37" x2="20" y2="27"/><Line x1="74" y1="63" x2="84" y2="66"/><Line x1="74" y1="63" x2="80" y2="73"/><Line x1="74" y1="37" x2="84" y2="34"/><Line x1="74" y1="37" x2="80" y2="27"/><Line x1="26" y1="63" x2="16" y2="66"/><Line x1="26" y1="63" x2="20" y2="73"/></G><Circle cx="50" cy="50" r="7" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3"/></G>);
    case "Pud":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M50 18 L80 74 L20 74Z" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M62 44 L80 74 L54 74Z" fill="#6E828A" opacity="0.45"/><Path d="M50 18 L62 42 L50 37 L38 42Z" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/></G>);
    case "Put":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M50 26 L78 76 L22 76Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M62 48 L78 76 L52 76Z" fill="#B0501F" opacity="0.5"/><Path d="M44 44 L50 76 L38 76Z" fill="#E0453C"/><Path d="M50 26 Q46 32 50 36 Q54 32 50 26Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"/><Circle cx="50" cy="20" r="6" fill="#8A9BA0" opacity="0.6"/><Circle cx="57" cy="14" r="5" fill="#8A9BA0" opacity="0.5"/><Circle cx="45" cy="12" r="4" fill="#8A9BA0" opacity="0.4"/></G>);
    case "Pa":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <G stroke="#F4C430" strokeWidth="4.5" strokeLinecap="round">
      <Line x1="50" y1="13" x2="50" y2="23"/><Line x1="50" y1="77" x2="50" y2="87"/><Line x1="13" y1="50" x2="23" y2="50"/><Line x1="77" y1="50" x2="87" y2="50"/>
      <Line x1="23" y1="23" x2="30" y2="30"/><Line x1="70" y1="70" x2="77" y2="77"/><Line x1="23" y1="77" x2="30" y2="70"/><Line x1="70" y1="30" x2="77" y2="23"/>
    </G>
    <Circle cx="50" cy="50" r="21" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.6"/>
    <Path d="M40 44 Q44 37 51 38" fill="none" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" opacity="0.8"/></G>);
    case "Pe":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M60 20 C40 22 28 36 28 52 C28 68 40 80 58 80 C44 76 36 64 36 50 C36 36 44 24 60 20Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M72 28 L75 34 L81 36 L75 38 L72 44 L69 38 L63 36 L69 34Z" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="2.2" strokeLinejoin="round"/><Path d="M64 58 L66 62 L70 63 L66 64 L64 68 L62 64 L58 63 L62 62Z" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="2" strokeLinejoin="round"/></G>);
    case "Pepe":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="50" cy="50" r="30" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.6"/><Circle cx="38" cy="40" r="6" fill="#E0A81E" opacity="0.7"/><Circle cx="60" cy="36" r="4" fill="#E0A81E" opacity="0.6"/><Circle cx="62" cy="58" r="7" fill="#E0A81E" opacity="0.7"/><Circle cx="40" cy="62" r="4.5" fill="#E0A81E" opacity="0.6"/></G>);
    case "Pingal":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M15 68 A35 35 0 0 1 85 68" fill="none" stroke="#E0453C" strokeWidth="7.5" strokeLinecap="round"/>
    <Path d="M22.5 68 A27.5 27.5 0 0 1 77.5 68" fill="none" stroke="#F4C430" strokeWidth="7.5" strokeLinecap="round"/>
    <Path d="M30 68 A20 20 0 0 1 70 68" fill="none" stroke="#2FB67B" strokeWidth="7.5" strokeLinecap="round"/>
    <G fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round">
      <Path d="M13 74 C5 74 5 64 14 65 C15 57 28 57 29 66 C34 64 37 74 29 74Z"/>
      <Path d="M71 74 C65 74 65 65 72 66 C73 58 86 59 85 67 C92 66 91 74 84 74Z"/>
    </G></G>);
    case "Pue":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="50" cy="50" r="28" fill="none" stroke="#9B6FC9" strokeWidth="12"/><Path d="M50 78 A28 28 0 0 0 76 42" fill="none" stroke="#0B1F28" strokeWidth="12" strokeLinecap="round" opacity="0.22"/><Circle cx="50" cy="50" r="34" fill="none" stroke="#0B1F28" strokeWidth="3.4"/><Circle cx="50" cy="50" r="22" fill="none" stroke="#0B1F28" strokeWidth="3.4"/></G>);
    case "Tuta":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M50 50 Q42 50 42 42 Q42 32 54 32 Q68 32 68 46 Q68 62 50 64 Q30 66 28 48 Q26 28 48 22" fill="none" stroke="#0B1F28" strokeWidth="8.5" strokeLinecap="round"/><Path d="M50 50 Q42 50 42 42 Q42 32 54 32 Q68 32 68 46 Q68 62 50 64 Q30 66 28 48 Q26 28 48 22" fill="none" stroke="#D2693D" strokeWidth="5.5" strokeLinecap="round"/><Circle cx="50" cy="50" r="3.5" fill="#0B1F28"/></G>);
    case "Punch":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="82" rx="22" ry="4" fill="#0B1F28" opacity="0.12"/><Circle cx="50" cy="52" r="28" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3.6"/><Path d="M26 44 Q50 60 74 44" fill="none" stroke="#8A9BA0" strokeWidth="2.6" strokeLinecap="round" opacity="0.6"/><Path d="M26 58 Q50 42 74 58" fill="none" stroke="#8A9BA0" strokeWidth="2.6" strokeLinecap="round" opacity="0.6"/><Path d="M30 34 Q50 52 70 70" fill="none" stroke="#8A9BA0" strokeWidth="2.6" strokeLinecap="round" opacity="0.5"/><Path d="M70 70 Q78 76 76 84" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/></G>);
    case "Pulan":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="82" rx="22" ry="4" fill="#0B1F28" opacity="0.12"/><Circle cx="50" cy="52" r="28" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.6"/><Path d="M26 44 Q50 60 74 44" fill="none" stroke="#E0A81E" strokeWidth="2.8" strokeLinecap="round" opacity="0.8"/><Path d="M26 58 Q50 42 74 58" fill="none" stroke="#E0A81E" strokeWidth="2.8" strokeLinecap="round" opacity="0.8"/><Path d="M30 34 Q50 52 70 70" fill="none" stroke="#E0A81E" strokeWidth="2.8" strokeLinecap="round" opacity="0.7"/><Path d="M70 70 Q78 76 76 84" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/></G>);
    case "Cuanda":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Ellipse cx="49" cy="80" rx="23" ry="4.5" fill="#D2693D" opacity="0.16"/>
    <Circle cx="48" cy="50" r="27" fill="#E0453C" stroke="#0B1F28" strokeWidth="3.6"/>
    <G stroke="#B83229" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <Path d="M26 44 C40 37 58 39 69 49"/><Path d="M23 54 C39 50 59 54 72 57"/><Path d="M28 64 C42 69 58 70 67 61"/>
      <Path d="M35 27 C45 44 46 60 41 73"/><Path d="M53 26 C61 44 60 60 53 73"/>
    </G>
    <Path d="M73 52 C85 50 86 62 79 67 C86 71 81 81 73 76" fill="none" stroke="#E0453C" strokeWidth="3.6" strokeLinecap="round"/></G>);
    case "Piar":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M49 82 C27 76 22 55 29 36 C41 42 47 60 49 82Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M51 82 C73 76 78 55 71 36 C59 42 53 60 51 82Z" fill="#1E8F5E" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M50 15 C63 20 67 35 67 51 C67 67 60 80 50 84 C40 80 33 67 33 51 C33 35 37 20 50 15Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <G fill="#E0A81E"><Ellipse cx="44" cy="31" rx="3" ry="3.3"/><Ellipse cx="51" cy="30" rx="3" ry="3.3"/><Ellipse cx="58" cy="32" rx="3" ry="3.3"/><Ellipse cx="42" cy="41" rx="3" ry="3.3"/><Ellipse cx="50" cy="40" rx="3" ry="3.3"/><Ellipse cx="58" cy="41" rx="3" ry="3.3"/><Ellipse cx="42" cy="51" rx="3" ry="3.3"/><Ellipse cx="50" cy="50" rx="3" ry="3.3"/><Ellipse cx="58" cy="51" rx="3" ry="3.3"/><Ellipse cx="44" cy="61" rx="3" ry="3.3"/><Ellipse cx="51" cy="61" rx="3" ry="3.3"/><Ellipse cx="57" cy="61" rx="3" ry="3.3"/><Ellipse cx="47" cy="71" rx="2.8" ry="3"/><Ellipse cx="53" cy="71" rx="2.8" ry="3"/></G></G>);
    case "Piaran":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M34 28 C24 32 22 44 27 54 C36 50 39 38 38 30Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <Path d="M52 14 C62 18 66 30 66 42 C66 52 61 60 52 62 C44 60 39 52 39 42 C39 30 43 18 52 14Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <G fill="#E0A81E"><Ellipse cx="48" cy="26" rx="2.6" ry="2.9"/><Ellipse cx="55" cy="25" rx="2.6" ry="2.9"/><Ellipse cx="47" cy="35" rx="2.6" ry="2.9"/><Ellipse cx="54" cy="34" rx="2.6" ry="2.9"/><Ellipse cx="48" cy="44" rx="2.6" ry="2.9"/><Ellipse cx="55" cy="44" rx="2.6" ry="2.9"/><Ellipse cx="50" cy="53" rx="2.5" ry="2.8"/></G>
    <G fill="#F4C430" stroke="#0B1F28" strokeWidth="1.8"><Ellipse cx="40" cy="74" rx="3.3" ry="3.8"/><Ellipse cx="52" cy="80" rx="3.3" ry="3.8"/><Ellipse cx="62" cy="72" rx="3.3" ry="3.8"/><Ellipse cx="47" cy="86" rx="3" ry="3.5"/></G>
    <G stroke="#E0A81E" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"><Path d="M41 64 L40 70"/><Path d="M58 64 L61 68"/></G></G>);
    case "Turma":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Ellipse cx="50" cy="82" rx="24" ry="4.5" fill="#D2693D" opacity="0.18"/>
    <Path d="M44 34 Q53 28 61 33 Q66 24 73 27 Q70 35 63 35" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M26 56 C23 41 43 33 60 37 C78 41 80 57 74 68 C68 80 45 82 34 74 C27 69 27 63 26 56Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/>
    <Path d="M31 50 C37 41 50 39 60 42 C49 44 40 48 35 57 C32 62 30 55 31 50Z" fill="#E8956A" opacity="0.55"/>
    <G fill="#0B1F28"><Circle cx="43" cy="52" r="2.2"/><Circle cx="58" cy="49" r="2"/><Circle cx="62" cy="62" r="2.1"/><Circle cx="47" cy="66" r="1.9"/><Circle cx="53" cy="57" r="1.7"/></G></G>);
    case "Yacuara":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="82" rx="26" ry="6" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 80 L50 30" stroke="#1E8F5E" strokeWidth="3.6" strokeLinecap="round"/><Path d="M50 44 Q38 38 34 46 Q40 52 50 48Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 44 Q62 38 66 46 Q60 52 50 48Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 58 Q40 53 36 60 Q42 65 50 62Z" fill="#1E8F5E" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 58 Q60 53 64 60 Q58 65 50 62Z" fill="#1E8F5E" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Circle cx="42" cy="26" r="7" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3"/><Circle cx="58" cy="22" r="7" fill="#9B6FC9" stroke="#0B1F28" strokeWidth="3"/><Circle cx="42" cy="26" r="2.4" fill="#F4C430"/><Circle cx="58" cy="22" r="2.4" fill="#F4C430"/></G>);
    case "Caguara":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="82" rx="24" ry="4.5" fill="#7A4FA8" opacity="0.18"/><Path d="M40 30 Q50 24 58 29 Q64 22 70 26 Q67 33 60 34" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M28 54 C24 40 42 31 59 35 C76 39 79 55 73 66 C67 78 46 81 35 73 C29 68 29 62 28 54Z" fill="#9B6FC9" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M33 62 C30 50 42 42 55 44 C64 45.5 69 50 70 56" fill="none" stroke="#7A4FA8" strokeWidth="2.6" strokeLinecap="round" opacity="0.7"/><G fill="#0B1F28"><Circle cx="43" cy="52" r="2.2"/><Circle cx="58" cy="50" r="2"/><Circle cx="62" cy="63" r="2.1"/></G></G>);
    case "Puli":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M50 30 Q40 22 32 28 Q36 36 46 34" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 32 L50 24" stroke="#1E8F5E" strokeWidth="3.4" strokeLinecap="round"/><Circle cx="50" cy="58" r="26" fill="#E0453C" stroke="#0B1F28" strokeWidth="3.6"/><Path d="M38 48 Q44 42 52 44" stroke="#B83229" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/></G>);
    case "Capulí":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M44 30 Q46 20 54 16" stroke="#1E8F5E" strokeWidth="3.4" strokeLinecap="round" fill="none"/><Path d="M56 30 Q58 22 66 20" stroke="#1E8F5E" strokeWidth="3.4" strokeLinecap="round" fill="none"/><Path d="M54 16 Q60 12 68 15 Q66 21 58 20Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/><Circle cx="40" cy="58" r="20" fill="#E0453C" stroke="#0B1F28" strokeWidth="3.6"/><Circle cx="64" cy="64" r="20" fill="#B83229" stroke="#0B1F28" strokeWidth="3.6"/><Path d="M33 50 Q38 45 44 48" stroke="#B83229" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.6"/></G>);
    case "Cun":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M38 24 Q50 18 58 26 Q66 36 62 50 Q70 60 64 72 Q58 84 46 82 Q36 80 34 68 Q28 58 34 46 Q28 36 38 24Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M44 30 Q52 28 56 34" stroke="#B0501F" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.6"/><Path d="M42 56 Q50 54 54 60" stroke="#B0501F" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.6"/><Ellipse cx="50" cy="20" rx="10" ry="5" fill="#F7F3E7" stroke="#0B1F28" strokeWidth="3.2"/></G>);
    case "Cuat":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="60" rx="34" ry="20" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.6"/><Ellipse cx="50" cy="58" rx="22" ry="12" fill="#F4C430" stroke="#0B1F28" strokeWidth="3"/><G fill="#E0A81E"><Circle cx="42" cy="55" r="3"/><Circle cx="54" cy="53" r="3"/><Circle cx="58" cy="62" r="3"/></G><Path d="M66 30 L70 46" stroke="#0B1F28" strokeWidth="3.4" strokeLinecap="round"/><Ellipse cx="67" cy="26" rx="6" ry="9" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3" transform="rotate(15 67 26)"/></G>);
    case "Yan":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M28 68 Q26 56 50 54 Q74 56 72 68 Q70 76 50 76 Q30 76 28 68Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M34 54 Q38 36 50 32 Q62 36 66 54 Q58 60 50 58 Q42 60 34 54Z" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><G fill="#8A9BA0"><Circle cx="44" cy="44" r="1.8"/><Circle cx="52" cy="40" r="1.8"/><Circle cx="58" cy="46" r="1.8"/><Circle cx="48" cy="50" r="1.8"/></G></G>);
    case "Yamata":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M36 40 Q34 24 50 20 Q66 24 64 40 L64 70 Q64 80 50 82 Q36 80 36 70 Z" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Ellipse cx="50" cy="40" rx="14" ry="5" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="2.8"/><G fill="#0B1F28"><Circle cx="44" cy="58" r="1.6"/><Circle cx="52" cy="62" r="1.6"/><Circle cx="58" cy="56" r="1.6"/><Circle cx="48" cy="68" r="1.6"/></G><Path d="M74 24 L77 31 L84 32 L78 37 L80 44 L74 40 L68 44 L70 37 L64 32 L71 31Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"/></G>);
    case "Yaguacha":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M30 40 Q30 32 50 32 Q70 32 70 40 L68 48 L32 48Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M28 48 C26 62 30 78 50 80 C70 78 74 62 72 48 Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><G fill="#F4C430"><Circle cx="42" cy="58" r="3.4"/><Circle cx="54" cy="56" r="3.2"/><Circle cx="50" cy="66" r="3.4"/><Circle cx="60" cy="64" r="3"/></G><Path d="M40 28 Q38 20 42 14" stroke="#8A9BA0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/><Path d="M50 26 Q48 18 52 12" stroke="#8A9BA0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/><Path d="M60 28 Q58 20 62 14" stroke="#8A9BA0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/></G>);
    case "Tarta":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M34 64 L38 82 Q50 86 62 82 L66 64Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M30 64 L70 64 L66 54 L34 54Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M50 54 L50 32" stroke="#1E8F5E" strokeWidth="3.6" strokeLinecap="round"/><Path d="M50 42 Q36 34 32 42 Q38 50 50 46Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 42 Q64 34 68 42 Q62 50 50 46Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 32 Q42 24 46 16 Q54 24 50 32Z" fill="#1E8F5E" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/></G>);
    case "Tar":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M44 58 L46 82 L54 82 L56 58Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Circle cx="50" cy="42" r="28" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.6"/><Path d="M50 14 Q68 18 70 38 Q66 46 56 44 Q64 30 50 14Z" fill="#1E8F5E" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/></G>);
    case "Poyo":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M26 46 L50 26 L74 46 Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M30 46 L70 46 L70 78 Q50 84 30 78Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M36 50 L36 70 M44 50 L44 72 M50 50 L50 74 M56 50 L56 72 M64 50 L64 70" stroke="#8A9BA0" strokeWidth="2.4" strokeLinecap="round"/><G stroke="#0B1F28" strokeWidth="2" fill="#F4C430"><Circle cx="42" cy="68" r="4"/><Circle cx="52" cy="70" r="4.2"/><Circle cx="60" cy="67" r="4"/></G></G>);
    case "Pas":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="30" cy="36" r="8" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2"/><Rect x="21" y="44" width="18" height="30" rx="9" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2"/><Circle cx="70" cy="36" r="8" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2"/><Rect x="61" y="44" width="18" height="30" rx="9" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.2"/><Circle cx="50" cy="48" r="7" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2"/><Rect x="41" y="55" width="18" height="24" rx="9" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2"/></G>);
    case "Cal":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M22 54 Q22 44 34 44 L46 44 L46 74 L28 74 Q22 74 22 66Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M44 74 L44 48 Q44 40 56 40 Q74 40 74 56 Q74 66 64 66 Q64 58 58 58 L58 74Z" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M58 44 Q58 26 50 22" fill="none" stroke="#E8B48A" strokeWidth="15" strokeLinecap="round"/>
    <Path d="M58 44 Q58 26 50 22" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/>
    <Path d="M66 44 Q66 28 58 22" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/>
    <Path d="M44 24 A11 11 0 0 1 60 20 Q64 24 60 30 L48 30 Q43 30 44 24Z" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M50 48 Q56 54 62 52" fill="none" stroke="#0B1F28" strokeWidth="2.2" strokeLinecap="round" opacity="0.5"/></G>);
    case "Paskal":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Rect x="46" y="14" width="8" height="26" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3"/><Circle cx="50" cy="38" r="11" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.4"/><Rect x="46" y="60" width="8" height="26" fill="#D2693D" stroke="#0B1F28" strokeWidth="3"/><Circle cx="50" cy="62" r="11" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4"/><Rect x="14" y="46" width="26" height="8" fill="#F4C430" stroke="#0B1F28" strokeWidth="3"/><Circle cx="38" cy="50" r="11" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.4"/><Rect x="60" y="46" width="26" height="8" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3"/><Circle cx="62" cy="50" r="11" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.4"/></G>);
    case "Gua":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="36" cy="38" r="9" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2"/><Rect x="27" y="47" width="18" height="28" rx="9" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2"/><Circle cx="64" cy="38" r="9" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2"/><Rect x="55" y="47" width="18" height="28" rx="9" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M42 58 L58 58" stroke="#0B1F28" strokeWidth="10" strokeLinecap="round"/><Path d="M42 58 L58 58" stroke="#E8B48A" strokeWidth="6" strokeLinecap="round"/></G>);
    case "Au":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="38" cy="48" r="16" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.4"/><Path d="M30 34 C36 28 46 28 50 36" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/><Circle cx="33" cy="44" r="2.2" fill="#0B1F28"/><Ellipse cx="48" cy="54" rx="4.5" ry="3.5" fill="#B83229" stroke="#0B1F28" strokeWidth="2.2"/><Path d="M62 34 Q74 48 62 62" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/><Path d="M70 26 Q88 48 70 70" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/></G>);
    case "Car":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="58" cy="44" rx="17" ry="21" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4"/><G stroke="#B0501F" strokeWidth="2.2"><Line x1="58" y1="24" x2="58" y2="64"/><Line x1="43" y1="40" x2="73" y2="40"/><Line x1="43" y1="50" x2="73" y2="50"/></G><Circle cx="34" cy="30" r="8" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M26 40 C22 46 22 64 28 76 L42 76 C46 64 44 46 40 40 Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><G stroke="#0B1F28" strokeWidth="5" strokeLinecap="round"><Line x1="30" y1="76" x2="27" y2="83"/><Line x1="38" y1="76" x2="41" y2="83"/></G></G>);
    case "Mal":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <G fill="#2FB67B" stroke="#0B1F28" strokeWidth="2.8" strokeLinejoin="round">
      <Ellipse cx="37" cy="64" rx="9" ry="12"/>
      <Ellipse cx="63" cy="40" rx="9" ry="12"/>
    </G>
    <G fill="#2FB67B" stroke="#0B1F28" strokeWidth="1.8">
      <Circle cx="30" cy="51" r="2.6"/><Circle cx="37" cy="48" r="2.6"/><Circle cx="44" cy="51" r="2.6"/>
      <Circle cx="56" cy="27" r="2.6"/><Circle cx="63" cy="24" r="2.6"/><Circle cx="70" cy="27" r="2.6"/>
    </G></G>);
    case "Que":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M32 78 L54 46" stroke="#0B1F28" strokeWidth="13" strokeLinecap="round"/><Path d="M32 78 L54 46" stroke="#D2693D" strokeWidth="9" strokeLinecap="round"/><Rect x="50" y="22" width="26" height="15" rx="3" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3.2" transform="rotate(42 63 29)"/><Path d="M70 16 L73 24 L81 26 L73 28 L70 36 L67 28 L59 26 L67 24 Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="2.2" strokeLinejoin="round"/></G>);
    case "Quer":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Rect x="18" y="55" width="18" height="18" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M15 55 L27 40 L39 55 Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Rect x="40" y="48" width="22" height="26" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.4"/><Path d="M36 48 L51 28 L66 48 Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Rect x="47" y="60" width="8" height="14" fill="#0B1F28"/><Rect x="64" y="55" width="18" height="18" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M61 55 L73 40 L85 55 Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Line x1="14" y1="74" x2="86" y2="74" stroke="#0B1F28" strokeWidth="3.4" strokeLinecap="round"/></G>);
    case "Guanga":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Rect x="25" y="40" width="50" height="26" rx="2" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.2"/>
    <G stroke="#2B86C4" strokeWidth="1.8"><Line x1="33" y1="42" x2="33" y2="64"/><Line x1="40" y1="42" x2="40" y2="64"/><Line x1="60" y1="42" x2="60" y2="64"/><Line x1="67" y1="42" x2="67" y2="64"/></G>
    <Path d="M50 44 L59 53 L50 62 L41 53Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"/>
    <G stroke="#0B1F28" strokeWidth="4.5" strokeLinecap="round"><Line x1="24" y1="22" x2="24" y2="78"/><Line x1="76" y1="22" x2="76" y2="78"/></G>
    <G stroke="#D2693D" strokeWidth="5" strokeLinecap="round"><Line x1="24" y1="26" x2="76" y2="26"/><Line x1="24" y1="74" x2="76" y2="74"/></G></G>);
    case "Guango":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M30 35 C30 25 70 25 70 35 C78 35 78 65 70 65 C70 75 30 75 30 65 C22 65 22 35 30 35 Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M50 22 L50 78" stroke="#B0501F" strokeWidth="7" strokeLinecap="round"/><Path d="M22 50 L78 50" stroke="#B0501F" strokeWidth="7" strokeLinecap="round"/><Circle cx="38" cy="28" r="4.5" fill="#F7F3E7" stroke="#0B1F28" strokeWidth="2.2"/><Circle cx="62" cy="28" r="4.5" fill="#F7F3E7" stroke="#0B1F28" strokeWidth="2.2"/></G>);
    case "Cuenda":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="48" cy="50" r="27" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.6"/><G stroke="#1E8F5E" strokeWidth="2.4" fill="none" strokeLinecap="round"><Path d="M26 44 C40 37 58 39 69 49"/><Path d="M23 54 C39 50 59 54 72 57"/><Path d="M35 27 C45 44 46 60 41 73"/></G><Path d="M73 52 C85 50 86 62 79 67" fill="none" stroke="#2FB67B" strokeWidth="3.6" strokeLinecap="round"/></G>);
    case "Quinchil":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M16 50 Q50 32 84 50 Q50 68 16 50Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/>
    <Path d="M24 50 Q50 40 76 50 Q50 60 24 50Z" fill="#B0501F"/>
    <G stroke="#F4C430" strokeWidth="2.6" strokeLinecap="round"><Line x1="40" y1="46" x2="40" y2="54"/><Line x1="48" y1="44" x2="48" y2="56"/><Line x1="56" y1="44" x2="56" y2="56"/><Line x1="64" y1="46" x2="64" y2="54"/></G>
    <Path d="M84 50 C90 52 91 58 85 60 C89 62 87 67 83 66" fill="none" stroke="#F4C430" strokeWidth="3" strokeLinecap="round"/>
    <Circle cx="20" cy="50" r="2.4" fill="#0B1F28"/><Circle cx="80" cy="50" r="2.4" fill="#0B1F28"/></G>);
    case "Chindé":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M22 50 H78 L72 78 Q71 82 66 82 H34 Q29 82 28 78Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <G stroke="#B0501F" strokeWidth="2"><Line x1="32" y1="54" x2="30" y2="78"/><Line x1="42" y1="54" x2="41" y2="80"/><Line x1="52" y1="54" x2="52" y2="80"/><Line x1="62" y1="54" x2="63" y2="80"/><Line x1="70" y1="54" x2="71" y2="78"/><Path d="M26 62 H74" fill="none"/><Path d="M28 71 H72" fill="none"/></G>
    <Path d="M22 50 Q50 38 78 50" fill="none" stroke="#0B1F28" strokeWidth="3.4" strokeLinecap="round"/>
    <Path d="M30 48 Q50 30 70 48" fill="none" stroke="#E0A81E" strokeWidth="4.5" strokeLinecap="round"/></G>);
    case "Hopa":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Rect x="44" y="74" width="16" height="10" rx="4" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3"/><Rect x="34" y="50" width="36" height="24" rx="10" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3.4"/><Rect x="18" y="54" width="18" height="10" rx="5" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3"/><Rect x="36" y="26" width="7" height="28" rx="3.5" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3"/><Rect x="45" y="18" width="7" height="36" rx="3.5" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3"/><Rect x="54" y="16" width="7" height="38" rx="3.5" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3"/><Rect x="63" y="20" width="7" height="34" rx="3.5" fill="#E8B48A" stroke="#0B1F28" strokeWidth="3"/><G stroke="#0B1F28" strokeWidth="2.6" fill="none" strokeLinecap="round"><Path d="M78 28 Q84 34 78 40"/><Path d="M82 20 Q88 32 82 44"/></G></G>);
    case "In":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Ellipse cx="50" cy="84" rx="20" ry="4" fill="#D2693D" opacity="0.18"/>
    <Path d="M50 16 C55 32 72 36 65 52 C74 49 77 42 77 42 C90 72 66 86 49 83 C29 80 20 63 31 46 C30 59 42 54 40 43 C38 33 44 24 50 16Z" fill="#E0453C" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/>
    <Path d="M50 44 C56 55 65 63 61 73 C57 85 37 81 39 68 C40 59 48 55 50 44Z" fill="#F4C430"/>
    <Path d="M49 63 C55 68 56 78 50 79 C43 79 46 70 49 63Z" fill="#FFFFFF" opacity="0.85"/></G>);
    case "Chu":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Line x1="22" y1="62" x2="78" y2="46" stroke="#0B1F28" strokeWidth="19" strokeLinecap="round"/><Line x1="22" y1="62" x2="78" y2="46" stroke="#D2693D" strokeWidth="15" strokeLinecap="round"/><Ellipse cx="22" cy="62" rx="6.5" ry="7.5" fill="#B0501F" stroke="#0B1F28" strokeWidth="3" transform="rotate(-18 22 62)"/><Ellipse cx="78" cy="46" rx="6.5" ry="7.5" fill="#B0501F" stroke="#0B1F28" strokeWidth="3" transform="rotate(-18 78 46)"/><Line x1="24" y1="44" x2="74" y2="66" stroke="#0B1F28" strokeWidth="19" strokeLinecap="round"/><Line x1="24" y1="44" x2="74" y2="66" stroke="#B0501F" strokeWidth="15" strokeLinecap="round"/><Ellipse cx="24" cy="44" rx="6.5" ry="7.5" fill="#D2693D" stroke="#0B1F28" strokeWidth="3" transform="rotate(22 24 44)"/><Ellipse cx="74" cy="66" rx="6.5" ry="7.5" fill="#D2693D" stroke="#0B1F28" strokeWidth="3" transform="rotate(22 74 66)"/><Ellipse cx="22" cy="62" rx="3" ry="3.6" fill="#8A4A24" transform="rotate(-18 22 62)"/><Ellipse cx="78" cy="46" rx="3" ry="3.6" fill="#8A4A24" transform="rotate(-18 78 46)"/><Ellipse cx="24" cy="44" rx="3" ry="3.6" fill="#8A4A24" transform="rotate(22 24 44)"/><Ellipse cx="74" cy="66" rx="3" ry="3.6" fill="#8A4A24" transform="rotate(22 74 66)"/></G>);
    case "Chula":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><G stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round"><Rect x="23" y="30" width="10" height="48" rx="5" fill="#D2693D"/><Rect x="35" y="25" width="10" height="53" rx="5" fill="#B0501F"/><Rect x="47" y="28" width="10" height="50" rx="5" fill="#D2693D"/><Rect x="59" y="24" width="10" height="54" rx="5" fill="#B0501F"/><Rect x="71" y="30" width="9" height="48" rx="4.5" fill="#D2693D"/></G><Circle cx="28" cy="34" r="3.2" fill="#8A4A24"/><Circle cx="40" cy="30" r="3.2" fill="#8A4A24"/><Circle cx="52" cy="33" r="3.2" fill="#8A4A24"/><Circle cx="64" cy="29" r="3.2" fill="#8A4A24"/><Circle cx="75.5" cy="34" r="3.2" fill="#8A4A24"/><Path d="M18 44 Q50 38 83 44" fill="none" stroke="#0B1F28" strokeWidth="5.5" strokeLinecap="round"/><Path d="M18 44 Q50 38 83 44" fill="none" stroke="#F4C430" strokeWidth="3.2" strokeLinecap="round"/><Path d="M18 64 Q50 58 83 64" fill="none" stroke="#0B1F28" strokeWidth="5.5" strokeLinecap="round"/><Path d="M18 64 Q50 58 83 64" fill="none" stroke="#F4C430" strokeWidth="3.2" strokeLinecap="round"/></G>);
    case "Chular":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="38" cy="76" rx="22" ry="8" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.4"/><Rect x="18" y="58" width="40" height="20" rx="4" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Ellipse cx="38" cy="58" rx="20" ry="7" fill="#E0A05A" stroke="#0B1F28" strokeWidth="3.2"/><Circle cx="38" cy="58" r="3" fill="#8A4A24"/><Line x1="58" y1="80" x2="72" y2="30" stroke="#0B1F28" strokeWidth="7.5" strokeLinecap="round"/><Line x1="58" y1="80" x2="72" y2="30" stroke="#B0501F" strokeWidth="4.6" strokeLinecap="round"/><Path d="M66 36 L83 25 Q85 33 79 40 Q74 43 66 39Z" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/></G>);
    case "Imbuera":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Circle cx="28" cy="72" r="12" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3.4"/><Circle cx="72" cy="72" r="12" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3.4"/><Circle cx="50" cy="78" r="12" fill="#6E7E83" stroke="#0B1F28" strokeWidth="3.4"/><Path d="M38 68 C34 58 40 50 38 40 C48 48 48 58 44 66Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M62 68 C66 58 60 50 62 40 C52 48 52 58 56 66Z" fill="#E0453C" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Path d="M50 62 C44 50 50 34 50 20 C60 34 62 46 54 60Z" fill="#E0453C" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/></G>);
    case "Tacín":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="78" rx="26" ry="7" fill="#B0501F" opacity="0.5"/><Path d="M22 72 Q50 80 78 72 L78 58 Q50 70 22 58Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M22 58 Q50 70 78 58 L78 46 Q50 58 22 46Z" fill="#2B86C4" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/><Path d="M36 46 Q40 36 34 28 Q44 32 44 42 Q48 34 44 24 Q54 30 50 42 Q56 36 54 28 Q60 38 52 46Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/></G>);
    case "Chapil":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M24 50 L26 78 Q26 84 34 84 L62 84 Q70 84 70 78 L72 50Z" fill="#E0A81E" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Ellipse cx="48" cy="50" rx="24" ry="6" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M70 56 Q84 56 84 68 Q84 78 72 76" fill="none" stroke="#0B1F28" strokeWidth="5" strokeLinecap="round"/><Path d="M70 56 Q84 56 84 68 Q84 78 72 76" fill="none" stroke="#E0A81E" strokeWidth="2.8" strokeLinecap="round"/><Path d="M38 34 Q42 28 38 22" fill="none" stroke="#8A9BA0" strokeWidth="3.2" strokeLinecap="round" opacity="0.7"/><Path d="M50 34 Q54 28 50 22" fill="none" stroke="#8A9BA0" strokeWidth="3.2" strokeLinecap="round" opacity="0.7"/></G>);
    case "Chicha":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M30 40 Q22 60 28 78 Q30 84 50 84 Q70 84 72 78 Q78 60 70 40Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M30 40 Q50 48 70 40 L68 30 Q50 36 32 30Z" fill="#E0A81E" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Ellipse cx="50" cy="30" rx="18" ry="6" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M76 48 Q88 50 86 62 Q84 72 74 70" fill="none" stroke="#0B1F28" strokeWidth="5" strokeLinecap="round"/><Path d="M76 48 Q88 50 86 62 Q84 72 74 70" fill="none" stroke="#F4C430" strokeWidth="2.8" strokeLinecap="round"/></G>);
    case "Chara":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M18 54 Q18 78 50 78 Q82 78 82 54Z" fill="#E0A81E" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Ellipse cx="50" cy="54" rx="32" ry="8" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.4"/><Ellipse cx="50" cy="54" rx="20" ry="4.5" fill="#FFF7E0"/><Path d="M66 50 L78 20" stroke="#0B1F28" strokeWidth="6" strokeLinecap="round"/><Path d="M66 50 L78 20" stroke="#8A9BA0" strokeWidth="3.4" strokeLinecap="round"/><Ellipse cx="78" cy="18" rx="7" ry="9" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3.2" transform="rotate(25 78 18)"/><Path d="M36 40 Q40 32 36 24" fill="none" stroke="#8A9BA0" strokeWidth="3" strokeLinecap="round" opacity="0.7"/></G>);
    case "Canchape":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M28 52 L31 76 Q32 82 40 82 L60 82 Q68 82 69 76 L72 52Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Ellipse cx="50" cy="52" rx="22" ry="5.5" fill="#2B86C4" stroke="#0B1F28" strokeWidth="3.2"/><Path d="M62 56 Q74 56 74 66 Q74 74 64 73" fill="none" stroke="#0B1F28" strokeWidth="4.6" strokeLinecap="round"/><Path d="M62 56 Q74 56 74 66 Q74 74 64 73" fill="none" stroke="#3FA9E0" strokeWidth="2.6" strokeLinecap="round"/><Path d="M40 36 Q44 30 40 24" fill="none" stroke="#8A9BA0" strokeWidth="3" strokeLinecap="round" opacity="0.7"/><Path d="M52 36 Q56 30 52 24" fill="none" stroke="#8A9BA0" strokeWidth="3" strokeLinecap="round" opacity="0.7"/></G>);
    case "Guamuca":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M20 52 Q20 76 50 76 Q80 76 80 52Z" fill="#9B6FC9" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Ellipse cx="50" cy="52" rx="30" ry="7.5" fill="#B48EDC" stroke="#0B1F28" strokeWidth="3.4"/><Ellipse cx="50" cy="52" rx="18" ry="4" fill="#E9DBF7"/><Path d="M50 32 L53 24 L61 24 L55 19 L58 11 L50 16.5 L42 11 L45 19 L39 24 L47 24Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="2.8" strokeLinejoin="round"/></G>);
    case "Guanto":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M50 20 Q50 40 50 46" stroke="#1E8F5E" strokeWidth="4.2" strokeLinecap="round" fill="none"/><Path d="M50 28 Q38 24 29 20" stroke="#1E8F5E" strokeWidth="3.6" strokeLinecap="round" fill="none"/><Ellipse cx="29" cy="20" rx="9" ry="5" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" transform="rotate(-30 29 20)"/><Path d="M50 34 Q64 30 71 20" stroke="#1E8F5E" strokeWidth="3.6" strokeLinecap="round" fill="none"/><Ellipse cx="71" cy="20" rx="9" ry="5" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" transform="rotate(25 71 20)"/><Path d="M50 46 C38 50 32 64 40 78 C44 84 56 84 60 78 C68 64 62 50 50 46Z" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M40 78 Q50 72 60 78 Q56 84 50 84 Q44 84 40 78Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/><Path d="M50 46 L50 54" stroke="#0B1F28" strokeWidth="3" strokeLinecap="round"/></G>);
    case "Chuma":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="78" rx="30" ry="8" fill="#8A9BA0" opacity="0.4"/><Path d="M22 70 Q30 56 46 60 Q50 50 60 58 Q76 54 78 68 Q80 78 68 80 Q50 84 32 80 Q20 78 22 70Z" fill="#6E7E83" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Ellipse cx="38" cy="68" rx="9" ry="6" fill="#E0453C" stroke="#0B1F28" strokeWidth="2.8"/><Ellipse cx="56" cy="70" rx="10" ry="6.5" fill="#D2693D" stroke="#0B1F28" strokeWidth="2.8"/><Ellipse cx="46" cy="74" rx="7" ry="4.5" fill="#F4C430" opacity="0.9"/><Path d="M44 44 l3 -8" stroke="#F4C430" strokeWidth="3" strokeLinecap="round"/><Path d="M60 40 l2 -8" stroke="#E0453C" strokeWidth="3" strokeLinecap="round"/><Path d="M52 36 l-2 -7" stroke="#F4C430" strokeWidth="2.6" strokeLinecap="round"/></G>);
    case "Pilche":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M26 46 A24 20 0 0 0 74 46Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/>
    <Ellipse cx="50" cy="46" rx="24" ry="7" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.2"/>
    <Ellipse cx="50" cy="46" rx="18" ry="4.5" fill="#8A4A24"/>
    <Path d="M33 58 Q50 64 67 58" fill="none" stroke="#F4C430" strokeWidth="3" strokeLinecap="round"/></G>);
    case "Cumba":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Rect x="26" y="56" width="48" height="28" rx="4" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M18 58 L50 30 L82 58Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Rect x="42" y="64" width="16" height="20" rx="2" fill="#2B86C4" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/><Rect x="44" y="18" width="12" height="14" rx="3" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/><Ellipse cx="50" cy="18" rx="7" ry="3" fill="#8A4A24" stroke="#0B1F28" strokeWidth="2.6"/></G>);
    case "Cual":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Circle cx="50" cy="50" r="45" fill="#2FB67B"/>
    <Path d="M30 10 Q40 20 36 32 L60 32 Q52 20 60 10 Z" fill="#1E8F5E" opacity="0.5"/>
    <Path d="M40 8 C54 24 42 40 54 54 C62 66 52 78 56 90 L72 90 C68 78 76 66 64 52 C52 38 64 24 54 8 Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <G stroke="#FFFFFF" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.9"><Path d="M49 22 Q55 26 50 31"/><Path d="M50 46 Q56 50 51 55"/><Path d="M52 70 Q58 74 53 79"/></G>
    <Ellipse cx="34" cy="44" rx="5" ry="3.2" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="2"/>
    <Circle cx="50" cy="50" r="45" fill="none" stroke="#0B1F28" strokeWidth="2.6"/></G>);
    case "Cuar":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Circle cx="50" cy="50" r="45" fill="#2FB67B"/>
    <Path d="M36 8 C50 24 40 40 50 54 C58 66 50 78 52 90 L74 90 C70 78 78 64 66 50 C56 38 66 24 54 8 Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <G stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.9"><Path d="M48 20 Q54 24 49 29"/><Path d="M56 66 Q62 70 57 75"/></G>
    <Ellipse cx="50" cy="44" rx="6" ry="4" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="2.4"/>
    <Ellipse cx="60" cy="60" rx="4.6" ry="3" fill="#B0501F" stroke="#0B1F28" strokeWidth="2.2"/>
    <Circle cx="50" cy="50" r="45" fill="none" stroke="#0B1F28" strokeWidth="2.6"/></G>);
    case "Fuel":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M38 10 C42 34 40 60 44 90 L18 90 C12 60 14 30 24 12 C28 10 34 10 38 10Z" fill="#8A9BA0" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M62 10 C58 34 60 60 56 90 L82 90 C88 60 86 30 76 12 C72 10 66 10 62 10Z" fill="#A9B7BB" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M44 10 C48 36 52 36 56 10 C54 40 54 64 52 90 L48 90 C46 64 46 40 44 10Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <G stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85"><Path d="M49 34 Q53 38 49 42"/><Path d="M49 56 Q53 60 49 64"/></G>
    <G fill="#FFFFFF" opacity="0.9"><Circle cx="46" cy="86" r="2.4"/><Circle cx="52" cy="88" r="2.2"/><Circle cx="50" cy="83" r="2"/></G></G>);
    case "Pi":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M50 16 C44 32 27 46 27 60 A23 23 0 0 0 73 60 C73 46 56 32 50 16Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/>
    <Path d="M30 63 C44 74 62 68 71 58 C72 73 60 83 49 82 C38 81 31 74 30 63Z" fill="#2B86C4"/>
    <Path d="M42 40 Q34 50 35 59" fill="none" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" opacity="0.8"/></G>);
    case "Es":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M22 44 L38 24 L50 38 L60 26 L78 44 Z" fill="#1E8F5E" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round" opacity="0.9"/>
    <Ellipse cx="50" cy="62" rx="34" ry="19" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.6"/>
    <G stroke="#FFFFFF" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.85"><Path d="M30 60 Q40 56 50 60 Q60 64 70 60"/><Path d="M36 69 Q44 66 52 69 Q60 72 66 69"/></G>
    <G stroke="#1E8F5E" strokeWidth="3.4" strokeLinecap="round"><Path d="M26 54 C24 46 24 40 26 36"/><Path d="M74 54 C76 46 76 40 74 36"/></G>
    <Circle cx="26" cy="35" r="2.6" fill="#8B5A2B"/><Circle cx="74" cy="35" r="2.6" fill="#8B5A2B"/></G>);
    case "Cuas":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <G stroke="#1E8F5E" strokeWidth="4" strokeLinecap="round"><Path d="M44 72 C42 54 44 38 46 24"/><Path d="M56 72 C58 56 56 42 54 30"/></G>
    <Path d="M46 24 C42 20 42 14 46 12 C50 14 50 20 46 24Z" fill="#8B5A2B" stroke="#0B1F28" strokeWidth="2.4"/>
    <Path d="M54 30 C50 26 50 20 54 18 C58 20 58 26 54 30Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="2.4"/>
    <Path d="M40 40 C32 36 26 38 22 44 C30 48 38 46 40 40Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"/>
    <Path d="M60 48 C68 44 74 46 78 52 C70 56 62 54 60 48Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"/>
    <Path d="M20 72 Q50 64 80 72 L80 84 Q50 78 20 84 Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <Path d="M28 76 Q38 73 48 76" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8"/></G>);
    case "Gualte":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M22 16 C44 18 40 34 30 36 C22 37 22 28 29 29 C34 30 33 34 30 34" fill="none" stroke="#0B1F28" strokeWidth="8.5" strokeLinecap="round"/>
    <Path d="M22 16 C44 18 40 34 30 36 C22 37 22 28 29 29 C34 30 33 34 30 34" fill="none" stroke="#2FB67B" strokeWidth="5" strokeLinecap="round"/>
    <Path d="M44 22 C66 24 62 42 72 44 C80 45 80 36 73 37" fill="none" stroke="#0B1F28" strokeWidth="8.5" strokeLinecap="round"/>
    <Path d="M44 22 C66 24 62 42 72 44 C80 45 80 36 73 37" fill="none" stroke="#1E8F5E" strokeWidth="5" strokeLinecap="round"/>
    <Path d="M50 54 C44 64 44 74 50 80 C56 74 56 64 50 54Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M47 62 Q44 69 46 74" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.8"/></G>);
    case "Gualguán":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M14 66 C14 40 36 24 58 28 C74 31 82 44 76 55 C71 63 59 64 54 56 C50 50 55 43 62 45 C58 40 50 40 45 45 C38 52 40 64 50 68 C60 72 74 68 82 60 C78 74 62 82 46 80 C26 77 14 66 14 66Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <Path d="M18 68 C30 72 44 73 56 70" fill="none" stroke="#2B86C4" strokeWidth="4" strokeLinecap="round"/>
    <G fill="#FFFFFF" stroke="#0B1F28" strokeWidth="2"><Circle cx="62" cy="43" r="3.2"/><Circle cx="70" cy="38" r="2.4"/><Circle cx="54" cy="40" r="2.2"/></G>
    <Circle cx="50" cy="50" r="46" fill="none" stroke="#0B1F28" strokeWidth="0"/></G>);
    case "Guapil":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M20 74 Q50 66 80 74 L80 86 Q50 80 20 86 Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M50 68 C48 52 50 38 50 26" fill="none" stroke="#1E8F5E" strokeWidth="4.5" strokeLinecap="round"/>
    <Path d="M50 30 C34 22 20 28 16 42 C34 50 48 44 50 30Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <Path d="M50 44 C66 36 80 42 84 56 C66 64 52 58 50 44Z" fill="#1E8F5E" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <Path d="M26 36 Q38 40 46 34 M58 50 Q68 52 78 50" stroke="#0B1F28" strokeWidth="1.8" fill="none" opacity="0.5"/></G>);
    case "Cuarris":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M20 68 Q50 60 80 68 L80 82 Q50 76 20 82 Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <Path d="M48 70 C46 58 48 46 48 36" fill="none" stroke="#1E8F5E" strokeWidth="4" strokeLinecap="round"/>
    <Path d="M48 46 C40 42 33 44 29 50 C37 54 45 52 48 46Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <Path d="M48 52 C56 48 63 50 67 56 C59 60 51 58 48 52Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <Path d="M66 26 C62 33 59 38 59 43 A8 8 0 0 0 75 43 C75 38 70 33 66 26Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="2.8" strokeLinejoin="round"/></G>);
    case "Pipisiqui":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Path d="M50 24 C68 24 80 38 80 54 C80 70 66 82 50 82 C34 82 20 70 20 54 C20 38 32 24 50 24Z" fill="#E0453C" stroke="#0B1F28" strokeWidth="3.6" strokeLinejoin="round"/><Path d="M50 24 C46 32 46 40 50 48 C54 40 54 32 50 24Z" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/><Path d="M50 30 L50 78" fill="none" stroke="#0B1F28" strokeWidth="3.2" strokeLinecap="round"/><Path d="M24 54 C32 50 42 50 50 54 C58 58 68 58 76 54" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" opacity="0.7"/><Circle cx="42" cy="60" r="2.2" fill="#F4C430" stroke="#0B1F28" strokeWidth="1.6"/><Circle cx="58" cy="66" r="2.2" fill="#F4C430" stroke="#0B1F28" strokeWidth="1.6"/><Circle cx="44" cy="72" r="2.2" fill="#F4C430" stroke="#0B1F28" strokeWidth="1.6"/><Path d="M34 78 C30 83 30 87 34 89 C38 87 38 83 34 78Z" fill="#B83229" stroke="#0B1F28" strokeWidth="2.8" strokeLinejoin="round"/></G>);
    case "Chichacuas":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/><Ellipse cx="50" cy="60" rx="28" ry="20" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.6"/><Circle cx="32" cy="38" r="12" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.4"/><Circle cx="68" cy="38" r="12" fill="#2FB67B" stroke="#0B1F28" strokeWidth="3.4"/><Circle cx="32" cy="36" r="5" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="2.4"/><Circle cx="68" cy="36" r="5" fill="#FFFFFF" stroke="#0B1F28" strokeWidth="2.4"/><Circle cx="32" cy="36" r="2.2" fill="#0B1F28"/><Circle cx="68" cy="36" r="2.2" fill="#0B1F28"/><Path d="M36 64 Q50 70 64 64" fill="none" stroke="#0B1F28" strokeWidth="3" strokeLinecap="round"/><Path d="M24 72 C20 75 18 78 20 80" fill="none" stroke="#0B1F28" strokeWidth="6.5" strokeLinecap="round"/><Path d="M24 72 C20 75 18 78 20 80" fill="none" stroke="#1E8F5E" strokeWidth="3.8" strokeLinecap="round"/><Path d="M76 72 C80 75 82 78 80 80" fill="none" stroke="#0B1F28" strokeWidth="6.5" strokeLinecap="round"/><Path d="M76 72 C80 75 82 78 80 80" fill="none" stroke="#1E8F5E" strokeWidth="3.8" strokeLinecap="round"/></G>);
    case "Cuatín":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M70 66 C82 66 84 54 78 50 C80 56 74 58 70 56" fill="#E0A81E" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <Ellipse cx="46" cy="60" rx="24" ry="15" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.4"/>
    <G fill="#B0501F"><Circle cx="38" cy="56" r="2.6"/><Circle cx="50" cy="54" r="2.6"/><Circle cx="58" cy="60" r="2.6"/><Circle cx="44" cy="64" r="2.4"/></G>
    <G fill="#F4C430" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"><Path d="M32 70 L30 78 L37 78 L38 70Z"/><Path d="M52 70 L52 78 L59 78 L58 70Z"/></G>
    <Circle cx="26" cy="46" r="13" fill="#F4C430" stroke="#0B1F28" strokeWidth="3.2"/>
    <Path d="M18 38 L16 30 L25 36Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"/>
    <Path d="M34 38 L36 30 L28 36Z" fill="#F4C430" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"/>
    <Circle cx="22" cy="45" r="2.2" fill="#0B1F28"/><Circle cx="30" cy="45" r="2.2" fill="#0B1F28"/>
    <Path d="M24 50 Q26 52 28 50" fill="none" stroke="#0B1F28" strokeWidth="2" strokeLinecap="round"/></G>);
    case "Cusumbe":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Path d="M68 64 C84 60 86 34 74 22 C70 26 74 38 68 44 C64 48 66 54 70 54" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.2" strokeLinejoin="round"/>
    <G stroke="#0B1F28" strokeWidth="2.2" fill="none"><Path d="M78 30 Q83 32 82 37"/><Path d="M75 42 Q80 44 78 49"/></G>
    <Ellipse cx="42" cy="58" rx="23" ry="15" fill="#D2693D" stroke="#0B1F28" strokeWidth="3.4"/>
    <Path d="M44 56 Q42 66 40 72 M52 57 Q52 67 52 73" stroke="#B0501F" strokeWidth="2" fill="none"/>
    <G fill="#B0501F" stroke="#0B1F28" strokeWidth="2.6" strokeLinejoin="round"><Path d="M30 68 L28 76 L34 76 L35 68Z"/><Path d="M50 70 L50 77 L56 77 L55 69Z"/></G>
    <Path d="M22 50 C14 46 12 38 18 34 C22 40 26 44 32 46Z" fill="#D2693D" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <Path d="M18 56 C8 56 8 46 16 46 C16 50 18 52 24 53Z" fill="#B0501F" stroke="#0B1F28" strokeWidth="3" strokeLinejoin="round"/>
    <Circle cx="14" cy="52" r="2.4" fill="#0B1F28"/>
    <Circle cx="27" cy="49" r="2.2" fill="#0B1F28"/></G>);
    case "Cuasmal":
      return (<G><Circle cx="50" cy="50" r="46" fill="#F7F3E7"/>
    <Circle cx="50" cy="50" r="45" fill="#2FB67B"/>
    <Path d="M34 8 L66 8 C60 30 60 60 60 92 L40 92 C40 60 40 30 34 8 Z" fill="#3FA9E0" stroke="#0B1F28" strokeWidth="3.4" strokeLinejoin="round"/>
    <G stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
      <Path d="M43 30 L50 38 L57 30"/><Path d="M43 50 L50 58 L57 50"/><Path d="M43 70 L50 78 L57 70"/>
    </G>
    <Circle cx="50" cy="50" r="45" fill="none" stroke="#0B1F28" strokeWidth="2.6"/></G>);
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  marco: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
