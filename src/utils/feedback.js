import * as Haptics from 'expo-haptics';
import { sonidoActivo } from './ajustes';

// Háptica con try/catch silencioso (si el dispositivo no la soporta, no crashea).
// Respeta el mismo flag que el sonido.
const seguro = (fn) => { try { if (sonidoActivo()) fn(); } catch (e) {} };

export const vibrar = {
  suave: () => seguro(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  medio: () => seguro(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  exito: () => seguro(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: () => seguro(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
