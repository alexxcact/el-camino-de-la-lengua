// Genera sonidos sintéticos cortos (.wav PCM16 mono) sin dependencias.
// Ejecutar: node scripts/gen-sonidos.js
const fs = require('fs');
const path = require('path');

const SR = 22050;          // sample rate
const AMP = 0.4;           // volumen master (acentos, no protagonistas)
const OUT = path.join(__dirname, '..', 'assets', 'sounds');

fs.mkdirSync(OUT, { recursive: true });

// Construye samples para una secuencia de notas [{ freq, ms }]
function samples(notas) {
  const out = [];
  for (const { freq, ms } of notas) {
    const n = Math.floor((ms / 1000) * SR);
    const attack = Math.floor(SR * 0.006); // 6ms para evitar clicks
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const env = Math.min(1, i / attack) * Math.pow(1 - i / n, 1.4); // ataque + decay tipo pluck
      out.push(Math.sin(2 * Math.PI * freq * t) * env * AMP);
    }
  }
  return out;
}

function escribirWav(nombre, floats) {
  const dataLen = floats.length * 2;
  const buf = Buffer.alloc(44 + dataLen);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);          // PCM
  buf.writeUInt16LE(1, 22);          // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);     // byteRate
  buf.writeUInt16LE(2, 32);          // blockAlign
  buf.writeUInt16LE(16, 34);         // bits
  buf.write('data', 36);
  buf.writeUInt32LE(dataLen, 40);
  let off = 44;
  for (const f of floats) {
    const v = Math.max(-1, Math.min(1, f));
    buf.writeInt16LE(Math.round(v * 32767), off);
    off += 2;
  }
  fs.writeFileSync(path.join(OUT, nombre), buf);
  console.log('  ✓', nombre, `(${(dataLen / 1024).toFixed(1)} KB)`);
}

console.log('Generando sonidos en assets/sounds/ ...');
escribirWav('acierto.wav', samples([{ freq: 660, ms: 90 }, { freq: 880, ms: 90 }]));
escribirWav('error.wav',   samples([{ freq: 220, ms: 150 }]).map(v => v * 0.7));
escribirWav('mision.wav',  samples([{ freq: 523, ms: 130 }, { freq: 659, ms: 130 }, { freq: 784, ms: 150 }]));
escribirWav('mundo.wav',   samples([{ freq: 392, ms: 170 }, { freq: 440, ms: 170 }, { freq: 523, ms: 170 }, { freq: 587, ms: 170 }, { freq: 784, ms: 220 }]));
escribirWav('pop.wav',     samples([{ freq: 440, ms: 60 }]));
console.log('Listo.');
