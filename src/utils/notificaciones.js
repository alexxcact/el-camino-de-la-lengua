// Notificación local del ave mensajera para recordar la palabra del día.
// Todo va envuelto en try/catch: si el módulo nativo no está (Metro sobre un
// binario viejo) o el permiso se niega, nunca crashea ni insiste.
//
// NO usa servidor: es una notificación local programada con la hora del dispositivo.
let Notifications = null;
try {
  // require perezoso: si el módulo nativo no existe, no rompe el arranque de la app
  Notifications = require('expo-notifications');
} catch (e) {}

const CANAL_ID = 'recordatorio-diario';

// Pide permiso de notificaciones de forma amable. Devuelve true si quedó concedido.
// Solo se debe llamar tras una acción del jugador (no al arrancar la app).
export async function pedirPermisoNotificaciones() {
  try {
    if (!Notifications) return false;
    const actual = await Notifications.getPermissionsAsync();
    let status = actual.status;
    if (status !== 'granted') {
      const pedido = await Notifications.requestPermissionsAsync();
      status = pedido.status;
    }
    return status === 'granted';
  } catch (e) { return false; }
}

// Programa (o reprograma) el recordatorio diario a la hora dada (0-23).
// Cancela los anteriores para no acumular duplicados.
export async function programarNotificacionDiaria(hora = 16, nombre = 'Caminante') {
  try {
    if (!Notifications) return false;
    const concedido = await pedirPermisoNotificaciones();
    if (!concedido) return false;

    // Canal Android (obligatorio para que aparezca la notificación)
    if (Notifications.setNotificationChannelAsync) {
      await Notifications.setNotificationChannelAsync(CANAL_ID, {
        name: 'Recordatorio diario',
        importance: Notifications.AndroidImportance?.DEFAULT ?? 3,
      });
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🐦 ¡Pío, ${nombre}!`,
        body: 'Tu palabra del día te espera en El Camino de la Lengua',
      },
      trigger: {
        hour: Math.max(0, Math.min(23, hora)),
        minute: 0,
        repeats: true,
        channelId: CANAL_ID,
      },
    });
    return true;
  } catch (e) { return false; }
}

export async function cancelarNotificaciones() {
  try {
    if (!Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
}
