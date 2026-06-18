import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse, G, Polygon, Line } from 'react-native-svg';
import { AVATAR_OPCIONES } from '../data/datos';
import { colors } from '../theme/colors';

// Avatar plano estilo flat, compuesto por capas SVG según los índices elegidos.
// viewBox 100x100: un "busto" (cabeza + hombros + ruana) que muestra bien las
// 4 capas. Props: avatar { piel, ropa, sombrero, accesorio }, tamano, conFondo.
export default function AvatarSVG({ avatar = {}, tamano = 100, conFondo = false }) {
  const a = { piel: 0, ropa: 0, sombrero: 0, accesorio: 0, ...avatar };
  const piel = AVATAR_OPCIONES.piel[a.piel] || AVATAR_OPCIONES.piel[0];
  const ropa = AVATAR_OPCIONES.ropa[a.ropa] || AVATAR_OPCIONES.ropa[0];

  const pielColor = piel.color;
  const pielSombra = oscurecer(pielColor, 0.12);

  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 100 100">
      {conFondo && <Circle cx={50} cy={50} r={50} fill={colors.nocheProfundo} />}

      {/* Hombros / cuello (piel) */}
      <Rect x={42} y={58} width={16} height={16} rx={5} fill={pielSombra} />

      {/* Ruana (capa de ropa con patrón) */}
      {renderRuana(ropa)}

      {/* Cabeza */}
      <Circle cx={27} cy={44} r={4.5} fill={pielSombra} />
      <Circle cx={73} cy={44} r={4.5} fill={pielSombra} />
      <Circle cx={50} cy={42} r={24} fill={pielColor} />

      {/* Cara */}
      <Circle cx={42} cy={42} r={2.8} fill="#2A1A0A" />
      <Circle cx={58} cy={42} r={2.8} fill="#2A1A0A" />
      <Path d="M43 50 Q50 57 57 50" stroke="#2A1A0A" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Circle cx={36} cy={48} r={3} fill="#E8907A" opacity={0.35} />
      <Circle cx={64} cy={48} r={3} fill="#E8907A" opacity={0.35} />

      {/* Sombrero (sobre la cabeza) */}
      {renderSombrero(a.sombrero, ropa)}

      {/* Accesorio (al frente) */}
      {renderAccesorio(a.accesorio)}
    </Svg>
  );
}

// ── Ruana ──
function renderRuana(ropa) {
  const trim = '#F7F0E0';
  const dorado = colors.doradoBrillo;
  return (
    <G>
      <Path d="M16 88 L50 62 L84 88 L84 100 L16 100 Z" fill={ropa.color} />
      {/* abertura del cuello */}
      <Path d="M50 62 L43 80 L57 80 Z" fill={oscurecer(ropa.color, 0.18)} />
      {/* patrón cultural */}
      {ropa.patron === 'franjas' && (
        <G>
          <Rect x={16} y={90} width={68} height={3.2} fill={trim} opacity={0.85} />
          <Rect x={16} y={95} width={68} height={3.2} fill={dorado} opacity={0.8} />
        </G>
      )}
      {ropa.patron === 'rombos' && (
        <G>
          {[28, 42, 50, 58, 72].map((x, i) => (
            <Rect key={i} x={x - 3} y={90} width={6} height={6} fill={i % 2 ? dorado : trim} opacity={0.85}
              transform={`rotate(45 ${x} 93)`} />
          ))}
        </G>
      )}
      {/* borde de los hombros */}
      <Path d="M16 88 L50 62 L84 88" stroke={oscurecer(ropa.color, 0.22)} strokeWidth={2} fill="none" />
    </G>
  );
}

// ── Sombrero ──
function renderSombrero(idx, ropa) {
  if (!idx) return null; // 0 = sin sombrero

  if (idx === 3) {
    // Capucha de ruana: arco grueso que enmarca la cara sin taparla
    return (
      <Path d="M22 72 C10 6 90 6 78 72" stroke={oscurecer(ropa.color, 0.05)} strokeWidth={13} fill="none" strokeLinecap="round" />
    );
  }

  // Sombrero de lana (base de idx 1 y 2)
  const lana = '#6B4A2B';
  const base = (
    <G>
      <Ellipse cx={50} cy={24} rx={31} ry={6.5} fill={lana} />
      <Ellipse cx={50} cy={17} rx={19} ry={13} fill={lana} />
      <Rect x={31} y={20} width={38} height={5} fill="#4A3119" />
    </G>
  );

  if (idx === 1) return base;

  // idx 2: con pluma
  return (
    <G>
      {base}
      <Path d="M70 18 Q80 2 76 16 Q74 12 70 18 Z" fill={colors.rojoVivo} />
      <Line x1={70} y1={20} x2={77} y2={6} stroke="#3A2410" strokeWidth={1.6} strokeLinecap="round" />
    </G>
  );
}

// ── Accesorio ──
function renderAccesorio(idx) {
  if (!idx) return null; // 0 = ninguno

  if (idx === 1) {
    // Pishku al hombro (derecho)
    return (
      <G>
        <Ellipse cx={74} cy={74} rx={8} ry={6.5} fill={colors.azul} />
        <Circle cx={80} cy={68} r={4.5} fill={colors.azul} />
        <Polygon points="84,68 90,69 84,71" fill={colors.doradoBrillo} />
        <Circle cx={81} cy={67} r={1.1} fill="#fff" />
        <Path d="M70 74 Q74 80 78 74" fill={colors.azulProfundo} />
      </G>
    );
  }

  if (idx === 2) {
    // Chumbe tejido (faja en la cintura)
    return (
      <G>
        <Rect x={20} y={91} width={60} height={7} fill={colors.rojo} />
        {[28, 38, 48, 58, 68].map((x, i) => (
          <Rect key={i} x={x - 2.5} y={92} width={5} height={5} fill={colors.doradoBrillo} opacity={0.9}
            transform={`rotate(45 ${x} 94.5)`} />
        ))}
      </G>
    );
  }

  // idx 3: mochila / bolso al costado izquierdo
  return (
    <G>
      <Line x1={38} y1={64} x2={20} y2={86} stroke={colors.tierra} strokeWidth={3} strokeLinecap="round" />
      <Rect x={10} y={84} width={16} height={14} rx={3} fill={colors.tierra} />
      <Rect x={10} y={84} width={16} height={4} rx={2} fill={oscurecer(colors.tierra, 0.2)} />
    </G>
  );
}

// Oscurece un color hex en un factor (0-1) para sombras simples.
function oscurecer(hex, f) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = Math.max(0, Math.round(parseInt(n.slice(0, 2), 16) * (1 - f)));
  const g = Math.max(0, Math.round(parseInt(n.slice(2, 4), 16) * (1 - f)));
  const b = Math.max(0, Math.round(parseInt(n.slice(4, 6), 16) * (1 - f)));
  const to2 = v => v.toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}
