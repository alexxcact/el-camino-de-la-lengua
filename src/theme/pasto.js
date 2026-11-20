// Piezas de estilo "piedra tallada" para las pantallas con simbología pasta.
export const LAJA = {
  fondo: '#132E35',
  borde: 'rgba(244,230,200,0.14)',
  tallado: '#2C5A60',     // petroglifo sin encontrar / bloqueado
  crema: '#F4E6C8',
};

export const laja = {
  backgroundColor: LAJA.fondo,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: LAJA.borde,
};

// Petroglifo que acompaña a cada logro (solo decorativo; no atribuye significado).
export const SIMBOLO_LOGRO = {
  'primera-palabra': 'espiralS',
  explorador: 'venadoSalto',
  'warmi-urku': 'venado',
  chakra: 'espiralS',
  tiyanaku: 'selloMono',
  tulpa: 'selloFigura',
  'la-bolsa': 'espiralDoble',
  'quiz-master': 'machin',
  constante: 'monosRama',
  'oido-fino': 'perdiz',
  'buena-memoria': 'selloMono',
  'estilo-propio': 'danzante',
  'guardian-elegante': 'mono',
  consultor: 'machin',
  'repaso-constante': 'espiralDoble',
  'mes-vivo': 'monosRama',
  'duelo-competitivo': 'figurasPlato',
  '50-palabras': 'espiralS',
  '75-palabras': 'espiralDoble',
  'camino-completo': 'venado',
  'taita-lengua': 'danzante',
};

// Petroglifo de cada mundo (el mismo que se esconde en él).
export const SIMBOLO_MUNDO = { 1: 'venado', 2: 'espiralS', 3: 'selloMono', 4: 'selloFigura', 5: 'espiralDoble' };
