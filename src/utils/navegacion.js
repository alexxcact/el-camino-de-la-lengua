// Reutiliza la ruta raíz existente: reemplazar el final añadiría otro árbol de tabs.
export function volverAlTerritorio(navigation) {
  navigation.navigate('MainTabs', {
    screen: 'MapaTab',
    params: { screen: 'Mapa' },
  });
}
