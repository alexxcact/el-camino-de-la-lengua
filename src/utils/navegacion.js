// Reutiliza la ruta raíz existente: reemplazar el final añadiría otro árbol de tabs.
export function volverAlTerritorio(navigation) {
  navigation.navigate('MainTabs', {
    screen: 'MapaTab',
    params: { screen: 'Mapa' },
  });
}

// Abre la ficha de una palabra en el Diccionario sin apilar otro árbol de tabs.
export function abrirPalabraEnDiccionario(navigation, palabraId) {
  navigation.navigate('MainTabs', {
    screen: 'DiccionarioTab',
    params: { screen: 'DiccionarioMain', params: { palabraId } },
  });
}
