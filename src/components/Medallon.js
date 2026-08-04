import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { ui } from '../theme/ui';

// Medallón circular con halo y anillo dorado — el foco visual reutilizable de la app.
// Recorta cualquier imagen cuadrada (retratos, íconos) a un círculo limpio y le da
// profundidad con círculos de halo concéntricos (glow que SÍ se ve en Android).
//
// Uso con imagen:   <Medallon source={require('...')} size={120} />
// Uso con contenido:<Medallon size={110} ring={colors.turquesaClaro}><AvatarSVG .../></Medallon>
//
// Props:
//   source      require() de una imagen (opcional si pasas children)
//   children    contenido a mostrar dentro del círculo (p.ej. AvatarSVG)
//   size        diámetro en px (default 120)
//   ring        color del anillo (default dorado)
//   halo        muestra los halos concéntricos (default true)
//   haloColor   color del halo exterior (default turquesa)
//   resizeMode  para la imagen (default 'cover')
export default function Medallon({
  source,
  children,
  size = 120,
  ring = ui.ringDorado,
  halo = true,
  haloColor = ui.haloTurquesa,
  resizeMode = 'cover',
  style,
}) {
  return (
    <View style={[s.wrap, style]}>
      {halo && (
        <>
          <View style={[s.halo, { width: size * 1.4, height: size * 1.4, borderRadius: size, backgroundColor: haloColor }]} />
          <View style={[s.halo, { width: size * 1.15, height: size * 1.15, borderRadius: size, backgroundColor: ui.haloDorado }]} />
        </>
      )}
      <View
        style={[
          s.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: ring,
          },
        ]}
      >
        {source ? (
          <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode={resizeMode} />
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute' },
  ring: {
    overflow: 'hidden',
    borderWidth: 3,
    backgroundColor: colors.noche,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.doradoNeon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
});
