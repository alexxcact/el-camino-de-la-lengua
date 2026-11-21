import React from 'react';
import Petroglifo from '../Petroglifo';
import { SIMBOLO_MUNDO } from '../../theme/pasto';

// El petroglifo de un mundo, para usar junto a su nombre en lugar de un emoji.
export default function SimboloMundo({ mundo, tamano = 16, color = '#F4E6C8', opacity = 1 }) {
  const id = SIMBOLO_MUNDO[typeof mundo === 'object' ? mundo?.id : mundo];
  if (!id) return null;
  return <Petroglifo id={id} tamano={tamano} color={color} opacity={opacity} />;
}
