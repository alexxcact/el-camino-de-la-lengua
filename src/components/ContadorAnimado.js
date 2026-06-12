import React, { useRef, useState, useEffect } from 'react';
import { Animated, Easing, Text } from 'react-native';

/**
 * Número que "cuenta" hacia su valor con efecto rolling.
 * Props:
 *  valor          número objetivo
 *  estilo         estilo del Text
 *  duracion       ms de la animación (default 600)
 *  delay          ms antes de empezar (para escalonar varios)
 *  animarEntrada  si true, anima desde 0 al montar
 *  prefijo/sufijo texto opcional alrededor del número
 *
 * El texto del número NO puede usar native driver (cambia content),
 * pero es un solo Text: no afecta el rendimiento.
 */
export default function ContadorAnimado({
  valor,
  estilo,
  duracion = 600,
  delay = 0,
  animarEntrada = false,
  prefijo = '',
  sufijo = '',
}) {
  const anim = useRef(new Animated.Value(animarEntrada ? 0 : valor)).current;
  const prev = useRef(animarEntrada ? 0 : null);
  const [display, setDisplay] = useState(animarEntrada ? 0 : valor);

  useEffect(() => {
    const desde = prev.current;

    // Primera carga (sin animar entrada) o un descenso → mostrar directo
    if (desde === null || valor < desde) {
      anim.setValue(valor);
      setDisplay(valor);
      prev.current = valor;
      return;
    }
    if (valor === desde) { prev.current = valor; return; }

    const id = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    anim.setValue(desde);
    const a = Animated.timing(anim, {
      toValue: valor,
      duration: duracion,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    a.start(() => setDisplay(valor));
    prev.current = valor;

    return () => { anim.removeListener(id); a.stop(); };
  }, [valor]);

  return <Text style={estilo}>{prefijo}{display}{sufijo}</Text>;
}
