import React from 'react';
import { View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import { figuraVectorDe } from './figuras/index';
import { medidasFigura } from '../data/personajesUtil';

// Personaje de cuerpo entero en miniatura: la figura vectorial completa (sin
// recorte ni marco), escalada para caber en `ancho` x `alto` y apoyada abajo
// sobre una sombra suave. Para selectores y listas donde un busto recortado
// se veía como un cuadro.
export default function FiguraMini({ personaje, ancho = 72, alto = 72, animo = 'neutral', sombra = true, style }) {
  const { Componente, VIEWBOX } = figuraVectorDe(personaje);
  const altoFig = alto - (sombra ? 4 : 0);
  const { ancho: fw, alto: fh } = medidasFigura(personaje, altoFig, ancho / altoFig);
  return (
    <View style={[{ width: ancho, height: alto, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
      {sombra && (
        <Svg width={ancho} height={8} style={{ position: 'absolute', bottom: 0 }}>
          <Ellipse cx={ancho / 2} cy={4} rx={Math.min(fw, ancho) * 0.32} ry={3} fill="rgba(0,0,0,0.35)" />
        </Svg>
      )}
      <View style={{ marginBottom: sombra ? 3 : 0 }}>
        <Componente width={fw} height={fh} viewBox={VIEWBOX} animo={animo} />
      </View>
    </View>
  );
}
