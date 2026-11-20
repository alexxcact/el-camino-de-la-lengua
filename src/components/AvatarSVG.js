import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse, G, Polygon, Line } from 'react-native-svg';
import { AVATAR_OPCIONES } from '../data/datos';
import { petroglifoDe } from '../data/petroglifos';
import { pathGreca } from '../data/greca';
import { colors } from '../theme/colors';

// Avatar plano compuesto por capas SVG según los índices elegidos.
// viewBox 100x100: un busto (cabeza + hombros) que muestra todas las capas.
// Props: avatar { piel, cabello, ropa, sombrero, adorno, accesorio, emblema },
// tamano, conFondo. Orden de capas: emblema → pelo de atrás → guagua → cuello →
// ropa → mechones y trenzas → cabeza → flequillo → adornos → sombrero → accesorio.
const PELO = '#231812';
const ORO = '#E0B040';
const ORO_OSCURO = '#9A6E14';
const ROJO = '#B3262E';

export default function AvatarSVG({ avatar = {}, tamano = 100, conFondo = false }) {
  const a = { piel: 0, cabello: 0, ropa: 0, sombrero: 0, adorno: 0, accesorio: 0, emblema: 0, ...avatar };
  const piel = AVATAR_OPCIONES.piel[a.piel] || AVATAR_OPCIONES.piel[0];
  const ropa = AVATAR_OPCIONES.ropa[a.ropa] || AVATAR_OPCIONES.ropa[0];
  const estilo = (AVATAR_OPCIONES.cabello[a.cabello] || AVATAR_OPCIONES.cabello[0]).estilo;
  const emblema = AVATAR_OPCIONES.emblema[a.emblema]?.petroglifo;

  const pielColor = piel.color;
  const pielSombra = oscurecer(pielColor, 0.12);

  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 100 100">
      {conFondo && <Circle cx={50} cy={50} r={50} fill={colors.nocheProfundo} />}

      {/* Emblema: el petroglifo descubierto, grabado detrás */}
      {emblema && renderEmblema(emblema, conFondo)}

      {renderPeloAtras(estilo)}
      {a.accesorio === 4 && renderGuaguaAtras(pielColor)}

      {/* Cuello */}
      <Rect x={42} y={58} width={16} height={16} rx={5} fill={pielSombra} />

      {renderRopa(ropa)}
      {renderPeloFrente(estilo)}

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

      {renderFlequillo(estilo)}
      {renderAdorno(a.adorno)}
      {renderSombrero(a.sombrero, ropa)}
      {renderAccesorio(a.accesorio)}
    </Svg>
  );
}

// ── Emblema (petroglifo) ──
function renderEmblema(id, conFondo) {
  const p = petroglifoDe(id);
  if (!p) return null;
  const lado = 86;
  const k = lado / Math.max(p.ancho, p.alto);
  const x = 50 - (p.ancho * k) / 2;
  const y = 46 - (p.alto * k) / 2;
  return (
    <G opacity={conFondo ? 0.3 : 0.24} transform={`translate(${x} ${y}) scale(${k})`}>
      <Path d={p.d} fill={colors.doradoNeon} fillRule="evenodd" />
    </G>
  );
}

// ── Cabello ──
function renderPeloAtras(estilo) {
  if (estilo === 'suelto') return <Ellipse cx={50} cy={42} rx={27.5} ry={27} fill={PELO} />;
  if (estilo === 'chongo') {
    return (
      <G>
        <Circle cx={50} cy={15} r={8.5} fill={PELO} />
        <Path d="M44 12 Q50 9 56 12" stroke="#4A3528" strokeWidth={1} fill="none" />
        {/* Cinta roja que amarra el moño */}
        <Rect x={44} y={20} width={12} height={2.6} rx={1.3} fill={ROJO} />
      </G>
    );
  }
  return null;
}

function renderPeloFrente(estilo) {
  if (estilo === 'suelto') {
    // Mechones largos que caen sobre los hombros
    return (
      <G>
        <Path d="M24 40 C21 58 21 74 25 86 L35 84 C31 72 30 58 32 46 Z" fill={PELO} />
        <Path d="M76 40 C79 58 79 74 75 86 L65 84 C69 72 70 58 68 46 Z" fill={PELO} />
      </G>
    );
  }
  if (estilo === 'trenzas') return <G>{trenza([[29, 52], [28.5, 88]])}{trenza([[71, 52], [71.5, 88]])}</G>;
  if (estilo === 'trenza') return trenza([[71, 52], [72, 70], [64, 92]]);
  return null;
}

// Trenza: eslabones a lo largo de una polilínea, con cinta roja al final.
function trenza(puntos) {
  const pasos = [];
  const n = 6;
  for (let i = 0; i < n; i++) pasos.push(enPolilinea(puntos, i / (n - 1)));
  const fin = enPolilinea(puntos, 1);
  return (
    <G>
      {pasos.map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={3.9} ry={4.2} fill={PELO} stroke="#120B07" strokeWidth={0.7}
          transform={`rotate(${i % 2 ? 18 : -18} ${x} ${y})`} />
      ))}
      <Rect x={fin[0] - 3} y={fin[1] + 2.5} width={6} height={2.6} rx={1} fill={ROJO} />
      <Path d={`M${fin[0] - 2.4} ${fin[1] + 5} L${fin[0]} ${fin[1] + 10} L${fin[0] + 2.4} ${fin[1] + 5} Z`} fill={PELO} />
    </G>
  );
}

function enPolilinea(pts, t) {
  const seg = pts.length - 1;
  const u = Math.min(seg - 1e-6, t * seg);
  const i = Math.floor(u);
  const f = u - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
}

function renderFlequillo(estilo) {
  // Todos los estilos llevan el pelo de la coronilla; corto añade patillas.
  return (
    <G>
      <Path d="M26 44 C24 12 76 12 74 44 C71 34 64 28 56 27 Q50 31 44 27 C36 28 29 34 26 44 Z" fill={PELO} />
      {estilo === 'corto' && (
        <G>
          <Path d="M26.5 44 L26 36 L30 34 Z" fill={PELO} />
          <Path d="M73.5 44 L74 36 L70 34 Z" fill={PELO} />
        </G>
      )}
    </G>
  );
}

// ── Ropa: ruanas y chalina ──
function renderRopa(ropa) {
  if (ropa.patron === 'chalina') return renderChalina(ropa);
  const trim = '#F7F0E0';
  const dorado = colors.doradoBrillo;
  return (
    <G>
      <Path d="M16 88 L50 62 L84 88 L84 100 L16 100 Z" fill={ropa.color} />
      {/* abertura del cuello */}
      <Path d="M50 62 L43 80 L57 80 Z" fill={oscurecer(ropa.color, 0.18)} />
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
      {ropa.patron === 'espiral' && (
        <G>
          <Path d={espiral(30, 92, 5.2)} stroke={dorado} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <Path d={espiral(70, 92, 5.2, true)} stroke={dorado} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <Rect x={16} y={98.2} width={68} height={1.8} fill={trim} opacity={0.7} />
        </G>
      )}
      {ropa.patron === 'greca' && (
        <G transform="translate(18 90)">
          <Path d={pathGreca(56, 7).d} stroke={dorado} strokeWidth={1.3} fill="none" strokeLinecap="square" />
        </G>
      )}
      {/* borde de los hombros */}
      <Path d="M16 88 L50 62 L84 88" stroke={oscurecer(ropa.color, 0.22)} strokeWidth={2} fill="none" />
    </G>
  );
}

// Chalina tejida sobre los hombros y blusa bordada (Cartilla 4, p. 58).
function renderChalina(ropa) {
  const borde = oscurecer(ropa.color, 0.25);
  const claro = '#F4E6C8';
  const bordado = [ROJO, colors.doradoBrillo, '#2F6FB0', ROJO, colors.doradoBrillo];
  return (
    <G>
      {/* Blusa */}
      <Path d="M20 100 L20 90 Q35 70 50 66 Q65 70 80 90 L80 100 Z" fill="#F4EFE6" />
      {/* Bordado del cuello de la blusa */}
      {bordado.map((c, i) => {
        const t = (i + 0.5) / bordado.length;
        const x = 40 + 20 * t;
        const y = 66 + 14 * t * (1 - t) * 2;
        return <Circle key={i} cx={x} cy={y} r={1.6} fill={c} />;
      })}
      {/* Paños de la chalina, abiertos al frente */}
      <Path d="M13 100 L13 86 Q24 67 45 62 Q38 80 37 100 Z" fill={ropa.color} />
      <Path d="M87 100 L87 86 Q76 67 55 62 Q62 80 63 100 Z" fill={ropa.color} />
      {/* Orillo tejido con rombos */}
      <Path d="M45 62 Q38 80 37 100" stroke={claro} strokeWidth={1.2} fill="none" opacity={0.8} />
      <Path d="M55 62 Q62 80 63 100" stroke={claro} strokeWidth={1.2} fill="none" opacity={0.8} />
      {[[24, 92], [31, 85], [69, 85], [76, 92]].map(([x, y], i) => (
        <Rect key={i} x={x - 2.2} y={y - 2.2} width={4.4} height={4.4} fill={i % 2 ? colors.doradoBrillo : claro}
          opacity={0.85} transform={`rotate(45 ${x} ${y})`} />
      ))}
      <Path d="M13 86 Q24 67 45 62 M87 86 Q76 67 55 62" stroke={borde} strokeWidth={1.6} fill="none" />
    </G>
  );
}

// Espiral (como las de los petroglifos), dibujada como polilínea.
function espiral(cx, cy, r, espejo = false) {
  const vueltas = 2.2;
  const pasos = 40;
  let d = '';
  for (let i = 0; i <= pasos; i++) {
    const t = (i / pasos) * vueltas * 2 * Math.PI;
    const rr = (r * i) / pasos;
    const x = cx + (espejo ? -1 : 1) * rr * Math.cos(t);
    const y = cy + rr * Math.sin(t);
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d;
}

// ── Adornos: orfebrería y chaquiras ──
function renderAdorno(idx) {
  if (!idx) return null;
  const orejeras = (
    <G>
      {[27, 73].map(x => (
        <G key={x}>
          <Circle cx={x} cy={49.5} r={3.4} fill={ORO} stroke={ORO_OSCURO} strokeWidth={0.8} />
          <Circle cx={x} cy={49.5} r={1.2} fill={ORO_OSCURO} />
        </G>
      ))}
    </G>
  );
  const chaquiras = (
    <G>
      {[[63, 70], [64, 75], [65, 80]].map(([y0, yc], s) => {
        const x0 = 40 - s * 2;
        const x1 = 60 + s * 2;
        const n = 9 + s * 2;
        return Array.from({ length: n }, (_, i) => {
          const t = i / (n - 1);
          const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * 50 + t * t * x1;
          const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (yc + 3) + t * t * y0;
          return <Circle key={`${s}-${i}`} cx={x} cy={y} r={1.35} fill={(i + s) % 3 === 0 ? '#F4E6C8' : '#C0392B'} />;
        });
      })}
    </G>
  );
  if (idx === 1) return orejeras;
  if (idx === 2) return chaquiras;
  if (idx === 3) return <G>{chaquiras}{orejeras}</G>;
  if (idx === 4) {
    // Colgante de oro con la espiral de los petroglifos
    return (
      <G>
        <Path d="M42 62 L50 75 L58 62" stroke="#3A2410" strokeWidth={0.9} fill="none" />
        <Circle cx={50} cy={80} r={5.6} fill={ORO} stroke={ORO_OSCURO} strokeWidth={0.8} />
        <Path d={espiral(50, 80, 4)} stroke={ORO_OSCURO} strokeWidth={0.9} fill="none" />
      </G>
    );
  }
  // idx 5: pectoral de oro (orfebrería pasta)
  return (
    <G>
      <Path d="M41 62 L46 72 M59 62 L54 72" stroke="#3A2410" strokeWidth={0.9} />
      <Path d="M36 74 Q50 68 64 74 L60 88 Q50 92 40 88 Z" fill={ORO} stroke={ORO_OSCURO} strokeWidth={0.9} />
      <Path d="M40 77 Q50 72.5 60 77" stroke={ORO_OSCURO} strokeWidth={0.8} fill="none" />
      {[42, 50, 58].map(x => (
        <Circle key={x} cx={x} cy={83} r={2} fill="none" stroke={ORO_OSCURO} strokeWidth={0.8} />
      ))}
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

  if (idx === 4) {
    // Sombrero negro de copa alta con cinta tejida
    return (
      <G>
        <Ellipse cx={50} cy={25} rx={29} ry={5.5} fill="#2A2420" />
        <Path d="M33 25 L35.5 8 Q50 1 64.5 8 L67 25 Z" fill="#2A2420" />
        <Rect x={33.6} y={18.5} width={32.8} height={5} fill={ROJO} />
        {[38, 44, 50, 56, 62].map((x, i) => (
          <Rect key={i} x={x - 1.4} y={19.6} width={2.8} height={2.8} fill={colors.doradoBrillo}
            transform={`rotate(45 ${x} 21)`} />
        ))}
      </G>
    );
  }

  if (idx === 5) {
    // Cinta tejida en la frente, con las puntas sueltas
    return (
      <G>
        <Path d="M27 34 Q50 14 73 34" stroke={ROJO} strokeWidth={5} fill="none" strokeLinecap="round" />
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const x = (1 - t) * (1 - t) * 27 + 2 * (1 - t) * t * 50 + t * t * 73;
          const y = (1 - t) * (1 - t) * 34 + 2 * (1 - t) * t * 14 + t * t * 34;
          return <Rect key={i} x={x - 1.3} y={y - 1.3} width={2.6} height={2.6} fill={colors.doradoBrillo}
            transform={`rotate(45 ${x} ${y})`} />;
        })}
        <Path d="M73 34 L79 50 M73 34 L82 47" stroke={ROJO} strokeWidth={2.2} strokeLinecap="round" />
      </G>
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

// La guagua va a la espalda: su cabecita asoma por el hombro (Cartilla 4, p. 63).
function renderGuaguaAtras(pielColor) {
  const x = 22;
  const y = 60;
  return (
    <G>
      <Circle cx={x} cy={y} r={8.5} fill={aclarar(pielColor, 0.08)} />
      {/* gorrito tejido */}
      <Path d={`M${x - 8.6} ${y - 1} Q${x} ${y - 16} ${x + 8.6} ${y - 1} Z`} fill={ROJO} />
      <Rect x={x - 8.6} y={y - 2.4} width={17.2} height={2.4} fill={colors.doradoBrillo} />
      <Circle cx={x} cy={y - 10.5} r={2} fill={colors.doradoBrillo} />
      {/* ojitos dormidos */}
      <Path d={`M${x - 4.4} ${y + 2} q1.6 1.4 3.2 0 M${x + 1.2} ${y + 2} q1.6 1.4 3.2 0`} stroke="#2A1A0A" strokeWidth={0.9} fill="none" strokeLinecap="round" />
    </G>
  );
}

// ── Accesorio ──
function renderAccesorio(idx) {
  if (!idx) return null; // 0 = ninguno

  if (idx === 1) {
    // Ave mensajera al hombro (derecho)
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
    // Chumbe (faja) tejido en la cintura: siempre lleva rojo (Cartilla 4, p. 70)
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

  if (idx === 3) {
    // Mochila / bolso al costado izquierdo
    return (
      <G>
        <Line x1={38} y1={64} x2={20} y2={86} stroke={colors.tierra} strokeWidth={3} strokeLinecap="round" />
        <Rect x={10} y={84} width={16} height={14} rx={3} fill={colors.tierra} />
        <Rect x={10} y={84} width={16} height={4} rx={2} fill={oscurecer(colors.tierra, 0.2)} />
      </G>
    );
  }

  if (idx === 4) {
    // Chalina que carga a la guagua, cruzada sobre el pecho
    return (
      <G>
        <Path d="M30 64 L70 100" stroke={ROJO} strokeWidth={6} strokeLinecap="round" />
        <Path d="M30 64 L70 100" stroke={colors.doradoBrillo} strokeWidth={1} strokeDasharray="2 2.5" />
      </G>
    );
  }

  // idx 5: huso de hilar con la lana hilada
  return (
    <G>
      <Line x1={85} y1={64} x2={77} y2={99} stroke="#7A5230" strokeWidth={1.8} strokeLinecap="round" />
      <Ellipse cx={82.6} cy={76} rx={4.6} ry={7} fill="#EFE6D2" transform="rotate(13 82.6 76)" />
      <Path d="M79 72 L86 74 M78.5 76 L86 78 M79 80 L85.5 82" stroke="#CDBF9F" strokeWidth={0.8} />
      <Ellipse cx={78} cy={94} rx={5} ry={1.9} fill="#5A3A1E" transform="rotate(13 78 94)" />
    </G>
  );
}

// Oscurece un color hex en un factor (0-1) para sombras simples.
function oscurecer(hex, f) {
  return mezclar(hex, (v) => v * (1 - f));
}

function aclarar(hex, f) {
  return mezclar(hex, (v) => v + (255 - v) * f);
}

function mezclar(hex, fn) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const to2 = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${[0, 2, 4].map(i => to2(fn(parseInt(n.slice(i, i + 2), 16)))).join('')}`;
}
