import { Audio } from 'expo-av';
import { sonidoActivo } from './ajustes';

const fuentes = {
  acierto: require('../../assets/sounds/acierto.wav'),
  error:   require('../../assets/sounds/error.wav'),
  mision:  require('../../assets/sounds/mision.wav'),
  mundo:   require('../../assets/sounds/mundo.wav'),
  pop:     require('../../assets/sounds/pop.wav'),
};

const cargados = {};
let listo = false;

// Precarga todos los sonidos al iniciar la app (try/catch silencioso).
export async function cargarSonidos() {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: false });
    for (const k of Object.keys(fuentes)) {
      const { sound } = await Audio.Sound.createAsync(fuentes[k], { volume: 0.4 });
      cargados[k] = sound;
    }
    listo = true;
  } catch (e) {}
}

async function reproducir(k) {
  try {
    if (!sonidoActivo() || !listo) return;
    const s = cargados[k];
    if (!s) return;
    await s.replayAsync();   // reinicia y reproduce aunque ya estuviera sonando
  } catch (e) {}
}

export const sonar = {
  acierto: () => reproducir('acierto'),
  error:   () => reproducir('error'),
  mision:  () => reproducir('mision'),
  mundo:   () => reproducir('mundo'),
  pop:     () => reproducir('pop'),
};
