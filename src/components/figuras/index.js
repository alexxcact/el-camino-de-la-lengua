// Figuras vectoriales de los personajes (react-native-svg puro, sin imágenes).
// Cada entrada: Componente (default export de la figura), VIEWBOX (cuerpo
// entero, calza con FIGURA_INFO de personajesUtil) y BUSTO_VIEWBOX (recorte
// cuadrado de cabeza y hombros para miniaturas).
import { claveRetrato } from '../../data/personajesUtil';
import FiguraKinti, { VIEWBOX as VB_KINTI, BUSTO_VIEWBOX as BUSTO_KINTI } from './FiguraKinti';
import FiguraUma, { VIEWBOX as VB_UMA, BUSTO_VIEWBOX as BUSTO_UMA } from './FiguraUma';
import FiguraPishku, {
  VIEWBOX as VB_PISHKU, BUSTO_VIEWBOX as BUSTO_PISHKU, PishkuAlaDelantera, ALA_PIVOTE,
} from './FiguraPishku';
import FiguraChutun, { VIEWBOX as VB_CHUTUN, BUSTO_VIEWBOX as BUSTO_CHUTUN } from './FiguraChutun';
import FiguraTaitaRimay, { VIEWBOX as VB_TAITA, BUSTO_VIEWBOX as BUSTO_TAITA } from './FiguraTaitaRimay';

export const FIGURAS_VECTOR = {
  kinti: { Componente: FiguraKinti, VIEWBOX: VB_KINTI, BUSTO_VIEWBOX: BUSTO_KINTI },
  uma: { Componente: FiguraUma, VIEWBOX: VB_UMA, BUSTO_VIEWBOX: BUSTO_UMA },
  pishku: { Componente: FiguraPishku, VIEWBOX: VB_PISHKU, BUSTO_VIEWBOX: BUSTO_PISHKU },
  chutun: { Componente: FiguraChutun, VIEWBOX: VB_CHUTUN, BUSTO_VIEWBOX: BUSTO_CHUTUN },
  taita_rimay: { Componente: FiguraTaitaRimay, VIEWBOX: VB_TAITA, BUSTO_VIEWBOX: BUSTO_TAITA },
};

// Acepta el id de datos ('taita-rimay') o la clave de asset ('taita_rimay');
// lo desconocido cae en Pishku, igual que claveRetrato.
export function figuraVectorDe(idOClave) {
  return FIGURAS_VECTOR[claveRetrato(idOClave)];
}

// Ala delantera de Pishku por separado (para aletear encima del cuerpo).
export { PishkuAlaDelantera, ALA_PIVOTE };
