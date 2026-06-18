// Voz placeholder para los minijuegos orales mientras no hay grabaciones reales.
// Usa expo-speech (voz sintética) — NO es pastoker real, solo da la mecánica.
// Lazy require + try/catch: si el módulo nativo no está (Metro sobre binario viejo)
// no crashea.
let Speech = null;
try {
  Speech = require('expo-speech');
} catch (e) {}

// TODO: reemplazar con audio real de sabedores (Audio.Sound) cuando lleguen las grabaciones.
export function decirPalabra(texto) {
  try {
    if (!Speech || !texto) return;
    Speech.stop();
    Speech.speak(texto, { language: 'es-CO', rate: 0.8 });
  } catch (e) {}
}

export function detenerVoz() {
  try { Speech && Speech.stop(); } catch (e) {}
}
