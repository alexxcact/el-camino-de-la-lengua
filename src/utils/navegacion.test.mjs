import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { volverAlTerritorio } from './navegacion.js';
const require = createRequire(import.meta.url);
const { StackRouter, CommonActions } = require('@react-navigation/routers');

test('repetir y cerrar el final conserva una sola instancia de MainTabs', () => {
  const router = StackRouter({ initialRouteName: 'MainTabs' });
  const options = { routeNames: ['MainTabs', 'Final'], routeParamList: {}, routeGetIdList: {} };
  let estado = router.getInitialState(options);
  const tabsKey = estado.routes[0].key;
  const navigation = {
    navigate(name, params) {
      estado = router.getStateForAction(estado, CommonActions.navigate(name, params), options);
    },
  };
  for (let i = 0; i < 5; i++) {
    navigation.navigate('Final');
    assert.equal(estado.routes.length, 2);
    volverAlTerritorio(navigation);
    assert.equal(estado.index, 0);
    assert.equal(estado.routes.length, 1);
    assert.equal(estado.routes[0].key, tabsKey);
    assert.deepEqual(estado.routes[0].params, { screen: 'MapaTab', params: { screen: 'Mapa' } });
  }
});
