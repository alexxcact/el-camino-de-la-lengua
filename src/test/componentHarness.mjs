// Ejecuta componentes y efectos reales sin un dispositivo. Los dobles de hooks
// y módulos nativos permiten controlar eventos, almacenamiento y tiempo; esto
// no sustituye la validación visual ni el planificador nativo de React.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { transformSync } = require('@babel/core');
const compilados = new Map();

export function montarComponente(file, { exportName = 'default', props = {}, mocks = {}, fecha, guardado = null } = {}) {
  let ahora = (fecha || new Date(2026, 8, 5, 12)).getTime();
  class Fecha extends Date {
    constructor(...args) { super(...(args.length ? args : [ahora])); }
    static now() { return ahora; }
  }
  let hooks = [];
  let efectos = [];
  const temporizadores = new Map();
  const eventos = new Set();
  let indice = 0, siguienteTimer = 0, pendiente = true, arbol;
  let persistido = guardado;
  const iguales = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const memo = (crear, deps) => {
    const i = indice++;
    if (!hooks[i] || !iguales(hooks[i].deps, deps)) hooks[i] = { valor: crear(), deps };
    return hooks[i].valor;
  };
  const React = {
    createContext: () => ({ Provider: 'Provider' }),
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    Fragment: 'Fragment',
    useState(inicial) {
      const i = indice++;
      if (!hooks[i]) hooks[i] = { valor: typeof inicial === 'function' ? inicial() : inicial };
      return [hooks[i].valor, cambio => {
        const valor = typeof cambio === 'function' ? cambio(hooks[i].valor) : cambio;
        if (!Object.is(valor, hooks[i].valor)) { hooks[i].valor = valor; pendiente = true; }
      }];
    },
    useRef: inicial => memo(() => ({ current: inicial }), []),
    useMemo: memo,
    useCallback: (fn, deps) => memo(() => fn, deps),
    useEffect(fn, deps) {
      const i = indice++;
      if (!hooks[i] || !iguales(hooks[i].deps, deps)) {
        const anterior = hooks[i];
        hooks[i] = { deps };
        efectos.push(() => { anterior?.limpiar?.(); hooks[i].limpiar = fn(); });
      }
    },
    useContext: () => { throw new Error('Proporciona un doble del contexto para pantallas.'); },
  };
  const AppState = {
    currentState: 'active',
    addEventListener(event, callback) {
      if (event !== 'change') throw new Error(event);
      eventos.add(callback);
      return { remove: () => eventos.delete(callback) };
    },
  };
  const storage = {
    getItem: async () => persistido == null ? null : JSON.stringify(persistido),
    setItem: async (key, value) => { persistido = JSON.parse(value); },
  };
  const nativos = { AppState, Platform: { OS: 'android' }, StyleSheet: { create: s => s } };
  for (const name of ['View', 'Text', 'TouchableOpacity', 'ScrollView', 'TextInput', 'KeyboardAvoidingView']) nativos[name] = name;
  const timer = (fn, delay, intervalo = false) => {
    const id = ++siguienteTimer;
    temporizadores.set(id, { fn, vence: ahora + delay, delay, intervalo });
    return id;
  };
  const cache = new Map();
  function cargar(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    if (!compilados.has(filename)) {
      compilados.set(filename, transformSync(fs.readFileSync(filename, 'utf8'), {
        configFile: false, babelrc: false,
        plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-transform-react-jsx'],
      }).code);
    }
    const importar = name => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name === 'react') return React;
      if (name === 'react-native') return nativos;
      if (name === '@react-native-async-storage/async-storage') return storage;
      if (name === 'expo-linear-gradient') return { LinearGradient: 'LinearGradient' };
      if (name === '@expo/vector-icons') return { Ionicons: 'Ionicons' };
      if (name.includes('/components/')) return path.basename(name);
      if (!name.startsWith('.')) throw new Error(`Módulo nativo sin doble: ${name}`);
      const destino = path.resolve(path.dirname(filename), name);
      return cargar(path.extname(destino) ? destino : `${destino}.js`);
    };
    vm.runInNewContext(compilados.get(filename), {
      module, exports: module.exports, require: importar, Date: Fecha, console,
      setTimeout: (fn, delay) => timer(fn, delay), clearTimeout: id => temporizadores.delete(id),
      setInterval: (fn, delay) => timer(fn, delay, true), clearInterval: id => temporizadores.delete(id),
    }, { filename });
    return module.exports;
  }
  const componente = cargar(path.resolve(file))[exportName];
  function render() {
    let vueltas = 0;
    while (pendiente) {
      if (++vueltas > 30) throw new Error('Ciclo de render sin estabilizar');
      pendiente = false;
      indice = 0;
      arbol = componente(props);
      efectos.splice(0).forEach(fn => fn());
    }
    return arbol;
  }
  render();
  return {
    render,
    rerender() { pendiente = true; return render(); },
    // Inspecciona el JSX de un hijo con sus propios hooks, sin ejecutar efectos
    // ni simular el motor de layout nativo.
    inspectChild(elemento) {
      const anteriores = { hooks, efectos, indice };
      hooks = []; efectos = []; indice = 0;
      try { return elemento.type(elemento.props); }
      finally { ({ hooks, efectos, indice } = anteriores); }
    },
    get tree() { return render(); },
    get saved() { return persistido; },
    get timers() { return temporizadores.size; },
    get listeners() { return eventos.size; },
    async settle() { for (let i = 0; i < 5; i++) { await Promise.resolve(); render(); } },
    setTime(fecha) { ahora = fecha.getTime(); },
    emitAppState(estado) {
      AppState.currentState = estado;
      [...eventos].forEach(fn => fn(estado));
      render();
    },
    fireTimers() {
      for (const [id, t] of [...temporizadores]) {
        if (t.vence > ahora) continue;
        temporizadores.delete(id);
        if (t.intervalo) temporizadores.set(id, { ...t, vence: ahora + t.delay });
        t.fn();
        render();
      }
    },
    unmount() { hooks.forEach(h => h?.limpiar?.()); },
  };
}

export function buscarNodo(arbol, predicate) {
  if (!arbol || typeof arbol !== 'object') return undefined;
  if (Array.isArray(arbol)) {
    for (const item of arbol) { const encontrado = buscarNodo(item, predicate); if (encontrado) return encontrado; }
    return undefined;
  }
  if (predicate(arbol)) return arbol;
  return buscarNodo(arbol.props?.children, predicate);
}
