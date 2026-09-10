# 📱 GUÍA PARA GENERAR EL APK EN ANDROID STUDIO
## "El Camino de la Lengua"

---

## REQUISITOS PREVIOS

| Herramienta | Versión | Descarga |
|---|---|---|
| Node.js | LTS (20 o superior) | https://nodejs.org |
| JDK | 17 | https://adoptium.net |
| Android Studio | Más reciente | https://developer.android.com/studio |
| RAM mínima | 8 GB | — |

---

## PASO 1 — Instalar Node.js

1. Ve a https://nodejs.org
2. Descarga la versión **LTS**
3. Instala con el asistente (siguiente, siguiente, finalizar)
4. Verifica en CMD o Terminal:
   ```
   node --version
   npm --version
   ```

---

## PASO 2 — Instalar Android Studio

1. Ve a https://developer.android.com/studio
2. Descarga e instala Android Studio
3. Al abrir por primera vez, instala el **Android SDK** cuando lo solicite
4. En Android Studio abre: **SDK Manager** → instala:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34
   - Android Emulator (opcional)

5. Configura la variable de entorno **ANDROID_HOME**:

   **Windows:**
   - Busca "Variables de entorno" en el buscador de Windows
   - Agrega variable de usuario: `ANDROID_HOME` = `C:\Users\TuUsuario\AppData\Local\Android\Sdk`
   - Agrega al PATH: `%ANDROID_HOME%\platform-tools`

   **Mac/Linux:**
   - Agrega a ~/.bashrc o ~/.zshrc:
   ```
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

---

## PASO 3 — Preparar el proyecto

1. Descomprime el archivo `el-camino-de-la-lengua.zip`
2. Abre la terminal (CMD en Windows) dentro de la carpeta
3. Instala las dependencias:
   ```
   npm install
   ```
4. Instala Expo CLI globalmente:
   ```
   npm install -g expo-cli
   ```

---

## PASO 4 — Generar la carpeta Android

Este comando convierte el proyecto Expo en un proyecto nativo Android:

```
npx expo run:android
```

- La primera vez demora entre 5 y 15 minutos
- Descarga automáticamente Gradle y dependencias de Android
- Crea la carpeta `/android` dentro del proyecto
- Si tienes un dispositivo Android conectado por USB (con depuración USB activada), instala la app directamente

---

## PASO 5 — Abrir en Android Studio y generar APK

1. Abre Android Studio
2. Selecciona **Open** → navega a la carpeta del proyecto → abre la subcarpeta **`android`**
3. Espera que Gradle sincronice (puede demorar unos minutos)
4. En el menú superior: **Build → Generate Signed Bundle/APK**
5. Selecciona **APK** y haz clic en Next
6. En "Key store path" selecciona **Create new**:
   - Key store path: elige dónde guardar el archivo `.jks`
   - Password: pon una contraseña (¡guárdala bien!)
   - Key alias: `camino-lengua`
   - Validity: 25 años
7. Haz clic en **Next**
8. Selecciona **release** y haz clic en **Finish**
9. El APK se genera en: `android/app/release/app-release.apk`

---

## PASO 6 — Instalar el APK en tu Android

**Opción A — USB:**
1. Conecta tu celular por USB
2. Activa "Depuración USB" en Opciones de desarrollador
3. Copia el archivo APK al celular
4. Ábrelo desde el administrador de archivos

**Opción B — WhatsApp o correo:**
1. Envíate el APK por WhatsApp o correo
2. Descárgalo en tu Android
3. Al abrirlo, acepta "Instalar desde fuentes desconocidas"

**Opción C — Android Studio directamente:**
- Con el celular conectado por USB, presiona el botón ▶ Play en Android Studio

---

## ALTERNATIVA RÁPIDA — Expo EAS Build (sin Android Studio)

Si el proceso anterior es muy complejo, usa este método en la nube:

```bash
npm install -g eas-cli
eas login          # Crea cuenta gratis en expo.dev
eas build --platform android --profile preview
```

En 10-15 minutos te da un enlace para descargar el APK directamente.

---

## ESTRUCTURA DEL PROYECTO

```
el-camino-de-la-lengua/
├── App.js                          ← Punto de entrada
├── app.json                        ← Configuración Expo
├── package.json                    ← Dependencias
├── babel.config.js
└── src/
    ├── context/
    │   └── JuegoContext.js         ← Estado global del juego
    ├── data/
    │   └── datos.js                ← 50 palabras, mundos, frases, logros
    ├── screens/
    │   ├── MapaScreen.js           ← Pantalla principal / hub
    │   ├── MundoScreen.js          ← Lecciones por mundo
    │   ├── QuizScreen.js           ← Juego quiz
    │   ├── MisionesScreen.js       ← Parejas y dictado
    │   └── MochilaPerfilScreen.js  ← Diccionario y progreso
    └── theme/
        └── colors.js               ← Paleta de colores andina
```

---

## CÓMO REVISAR EL VOCABULARIO

Las 75 entradas de `src/data/datos.js` forman el corpus de esta versión. Conserva sus IDs y los 15 IDs de cada mundo. Para corregir una entrada, documenta su procedencia y ejecuta `npm test`; ampliar el corpus requiere revisar también las reglas de progreso. Ejemplo de estructura actual:

```javascript
{
  id: 5,
  p: "Pud",
  e: "Cerro / altura",
  cat: "Territorio",
  fon: "pud", // Grafía de apoyo, no transcripción fonética
  ej: "Pud representa las alturas del territorio.",
  emoji: "⛰️",
  mundo: 1,
  tipo: "raiz",
  respaldo: "pendiente_validacion",
  fuente: "Listado de vocabulario aportado para esta actualización",
  nota: "Entrada relacionada con cerro y altura. Referencia sugerida: Lengua de los Pastos; falta cotejar edición y página."
}
```

---

## PUBLICAR EN GOOGLE PLAY STORE

1. Crea cuenta de desarrollador: https://play.google.com/console ($25 único pago)
2. Genera el AAB (Android App Bundle) en lugar del APK:
   - En Android Studio: Build → Generate Signed Bundle → AAB
3. Sube el .aab a Play Console
4. Completa la ficha: descripción, capturas de pantalla, categoría Educación
5. Envía a revisión (proceso de 3 a 7 días)

---

## SOBRE EL CONTENIDO

"El Camino de la Lengua" — Vocabulario y territorio del pueblo Pasto.

Los significados proceden del listado aportado para la actualización y requieren cotejo documental y revisión cultural. Los ejemplos están escritos en español.
