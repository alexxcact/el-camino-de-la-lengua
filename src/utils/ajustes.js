// Flag compartido (fuera de React) que leen sonar/vibrar antes de ejecutar.
// El JuegoContext lo sincroniza con el estado persistido.
let sonidoOn = true;
export const setSonido = (v) => { sonidoOn = !!v; };
export const sonidoActivo = () => sonidoOn;
