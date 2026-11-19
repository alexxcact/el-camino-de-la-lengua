// Chutún, el espíritu juguetón: criatura-nube esponjosa dibujada con primitivas SVG.
// Calca la silueta, rostro y colores del recorte assets/images/personajes/figuras/chutun.png
// (294 x 256). Estilo acuarela: manchas suaves de luz y sombra, sin trazos de paja.
// Componente puro: sin hooks, sin estado, sin imágenes ni filtros.
import React from 'react';
import Svg, {
  G, Path, Circle, Ellipse, Defs, LinearGradient, RadialGradient, Stop, ClipPath,
} from 'react-native-svg';

export const VIEWBOX = '0 0 294 256';
// Recorte cuadrado de cabeza y hombros (cara centrada entre ambos ojos).
export const BUSTO_VIEWBOX = '-6 8 168 168';

const TINTA = '#1e140c';
const TINTA_LINEA = '#2e2a26';

// <SILUETA-GENERADA> Contorno suavizado del recorte de referencia (mechones redondeados).
const SILUETA = 'M97.8 -2C97 -1.5 96.3 -0.5 96 0.5C95.8 1.4 96.1 2.6 96.3 3.6C96.5 4.7 97 5.7 97.3 6.7C97.5 7.7 98 9 97.7 9.9C97.4 10.7 96.3 11.7 95.7 11.6C95 11.5 94.4 9.9 93.7 9.2C93 8.4 92.4 7.4 91.5 6.9C90.6 6.4 89.3 6.6 88.4 6.1C87.4 5.7 86.6 4.9 85.7 4.4C84.8 3.8 83.8 3.4 82.8 3C81.9 2.5 80.9 2 79.9 1.6C78.9 1.3 77.9 1.3 76.8 1.1C75.7 1 74.7 0.9 73.6 0.8C72.6 0.6 71.5 0.3 70.5 0.2C69.4 0.1 68.2 -0.2 67.3 0.1C66.4 0.5 65.5 1.4 65.1 2.3C64.8 3.2 64.9 4.4 65.1 5.5C65.3 6.5 65.8 7.5 66.3 8.4C66.7 9.4 67.3 10.3 67.8 11.2C68.4 12.2 69.3 13.2 69.3 14.1C69.4 14.9 68.8 16.2 68.1 16.5C67.3 16.7 66 16 65 15.7C64 15.4 63 15 61.9 14.7C60.9 14.3 59.9 13.9 58.9 13.7C57.9 13.4 56.8 13 55.8 13.1C54.7 13.2 53.8 14 52.8 14.3C51.8 14.6 50.7 14.6 49.7 14.8C48.6 14.9 47.5 14.9 46.5 15.2C45.5 15.4 44.4 15.8 43.5 16.3C42.6 16.8 41.5 17.5 41.1 18.4C40.7 19.2 40.6 20.5 40.8 21.5C41 22.4 41.7 23.4 42.4 24.2C43.1 25 44.1 25.6 44.8 26.3C45.5 27.1 46.9 28.3 46.8 28.7C46.6 29.2 44.9 29.1 43.9 29C42.9 28.8 41.9 28.1 40.9 27.7C39.9 27.3 39 26.8 37.9 26.6C36.9 26.4 35.6 26.1 34.8 26.4C33.9 26.8 33.1 27.9 33 28.8C32.8 29.6 33.5 30.8 33.9 31.8C34.3 32.8 34.8 33.8 35.2 34.7C35.6 35.7 36.3 36.7 36.4 37.7C36.5 38.7 36.5 40 35.9 40.6C35.3 41.1 33.8 40.9 32.8 41C31.7 41.1 30.6 40.9 29.6 41C28.5 41.2 27.4 41.4 26.4 41.8C25.4 42.1 24.5 42.7 23.6 43.1C22.6 43.6 21.4 43.7 20.6 44.3C19.7 44.9 18.8 45.7 18.5 46.6C18.3 47.5 18.6 48.7 19 49.7C19.4 50.7 20 51.6 20.7 52.4C21.4 53.2 22.7 53.6 23.3 54.3C23.8 55.1 24.4 56.3 24 57C23.7 57.7 22.3 58.2 21.3 58.7C20.4 59.2 19.5 59.7 18.5 60.2C17.6 60.7 16.7 61.3 15.7 61.8C14.8 62.3 13.8 62.8 13 63.5C12.2 64.1 11.4 64.9 10.8 65.8C10.2 66.6 9.5 67.6 9.2 68.5C8.9 69.5 8.9 70.7 9.1 71.7C9.2 72.7 9.4 73.9 10 74.8C10.5 75.6 11.5 76.2 12.2 76.9C13 77.6 14.5 78.3 14.6 79C14.6 79.7 13.3 80.5 12.5 81.2C11.7 81.8 10.7 82.3 9.8 82.9C8.9 83.5 8 84.1 7.3 84.9C6.6 85.6 6 86.6 5.6 87.6C5.2 88.5 4.6 89.8 4.8 90.6C5.1 91.5 6.2 92.2 7 92.7C7.9 93.1 9.3 92.9 10.2 93.4C11 93.9 12.3 94.7 12.3 95.4C12.3 96.2 10.9 97 10.1 97.7C9.4 98.4 8.3 98.8 7.5 99.5C6.8 100.3 6.2 101.2 5.5 102C4.9 102.9 4.2 103.7 3.6 104.6C3 105.5 2.4 106.4 2 107.3C1.6 108.3 1.4 109.4 1.1 110.4C0.9 111.4 0.5 112.5 0.4 113.5C0.3 114.5 0.5 115.6 0.5 116.7C0.5 117.8 0.3 118.8 0.3 119.9C0.3 121 0.4 122 0.8 123C1.1 124 2 124.8 2.4 125.8C2.7 126.8 2.6 127.9 3 128.9C3.3 129.9 4.1 130.7 4.6 131.7C5.1 132.6 5.5 133.6 6 134.5C6.6 135.4 7.2 136.4 8.1 137C8.9 137.5 10 137.9 11 138C12.1 138.1 13.2 137.8 14.2 137.6C15.2 137.3 16.2 136.9 17.3 136.7C18.3 136.5 20.3 136.1 20.4 136.3C20.6 136.4 18.9 137 18.1 137.4C17.2 137.8 16 138.1 15.1 138.6C14.2 139.2 13.3 139.8 12.6 140.6C11.9 141.4 11.1 142.3 10.9 143.2C10.6 144.2 10.9 145.3 11.1 146.4C11.3 147.4 12.1 148.5 12 149.4C12 150.4 11.7 151.6 11 152C10.3 152.4 8.8 151.8 7.8 151.9C6.8 152.1 5.6 152.4 4.8 153C4 153.6 3.4 154.6 3 155.5C2.5 156.5 2.3 157.6 2 158.6C1.8 159.6 1.1 160.7 1.2 161.7C1.3 162.6 2 163.7 2.7 164.4C3.4 165.1 4.7 165.3 5.4 166C6.1 166.8 6.7 167.8 6.8 168.8C6.9 169.7 6.2 170.8 5.9 171.8C5.6 172.9 5 173.9 4.9 174.9C4.9 175.9 5.1 177 5.6 177.9C6.1 178.8 7.1 179.4 7.9 180.1C8.7 180.8 9.6 181.6 10.5 182C11.4 182.5 12.6 182.5 13.6 182.9C14.5 183.4 15.3 184.1 16.3 184.6C17.2 185.1 18.2 185.5 19.3 185.8C20.3 186 21.4 186.2 22.4 186.1C23.5 186 24.5 185.8 25.5 185.4C26.5 185 27.4 184.3 28.3 183.7C29.1 183.1 30 182.4 30.7 181.7C31.4 180.9 31.9 179.9 32.5 179C33.1 178.2 33.6 177 34.3 176.4C35 175.7 36.6 175 36.8 175.2C37 175.5 36.2 177.2 35.7 178.1C35.1 178.9 34.1 179.5 33.5 180.4C32.8 181.2 32.3 182.2 31.9 183.1C31.5 184.1 31.5 185.2 31.3 186.3C31.1 187.3 30.9 188.4 30.7 189.4C30.6 190.5 30.2 191.5 30.2 192.6C30.1 193.6 30.1 194.7 30.3 195.8C30.6 196.8 31.2 197.7 31.5 198.7C31.8 199.7 31.7 201 32.1 201.9C32.6 202.7 33.4 203.7 34.3 204.1C35.2 204.5 36.5 204.3 37.5 204.1C38.5 203.9 39.5 203.3 40.3 202.7C41.1 202 41.7 201 42.3 200.2C43 199.4 43.7 197.6 44.2 197.6C44.6 197.7 44.8 199.4 45 200.3C45.1 201.3 45.1 202.5 45.3 203.5C45.4 204.6 45.5 205.7 45.8 206.7C46.1 207.7 46.5 208.7 47.1 209.6C47.6 210.5 48.5 211.2 49.2 212C50 212.7 50.7 213.5 51.6 214.1C52.4 214.8 53.4 215.3 54.3 215.8C55.3 216.3 56.3 216.7 57.3 216.9C58.3 217.2 59.4 217.2 60.5 217.3C61.5 217.5 62.6 218 63.6 217.9C64.6 217.9 65.6 217.2 66.6 217C67.6 216.9 68.6 216.6 69.4 217.1C70.2 217.5 70.8 218.7 71.5 219.5C72.3 220.2 73 221 73.8 221.7C74.7 222.4 75.5 223.1 76.4 223.6C77.3 224.2 78.3 224.5 79.3 224.8C80.3 225.2 81.8 225.2 82.3 225.9C82.8 226.5 82.4 227.7 82.4 228.7C82.3 229.6 81.9 230.8 82 231.8C82.2 232.8 82.8 233.8 83.3 234.7C83.9 235.6 84.6 236.3 85.3 237.2C85.9 238.1 86.5 239 87.1 239.9C87.7 240.7 88.3 241.6 88.9 242.5C89.4 243.4 90 244.3 90.4 245.3C90.9 246.3 91.2 247.3 91.6 248.3C92 249.3 92.2 250.4 92.8 251.2C93.5 252 94.5 252.5 95.5 252.8C96.5 253.1 97.7 253 98.7 252.9C99.8 252.8 100.8 252.5 101.8 252.2C102.9 251.9 103.9 251.7 104.9 251.2C105.8 250.7 106.6 249.9 107.3 249.2C108.1 248.4 108.8 247.6 109.4 246.7C110 245.9 110.5 244.9 110.9 243.9C111.4 243 111.7 241.9 112 240.9C112.3 239.9 112.6 238.9 112.7 237.8C112.9 236.8 113 235.7 113 234.6C113 233.6 112.8 232.4 113 231.4C113.2 230.4 113.4 229 114.1 228.6C114.8 228.1 116.2 228.5 117.2 228.7C118.2 229 119.1 229.7 120.1 230.1C121.1 230.4 122.1 230.8 123.1 230.9C124.2 231.1 125.3 231 126.3 231C127.4 231 128.5 231 129.5 231C130.6 231 131.7 231 132.7 230.9C133.8 230.9 135 230.4 135.9 230.6C136.9 230.9 137.7 231.7 138.4 232.5C139.1 233.2 139.4 234.3 140 235.2C140.6 236.1 141.3 236.9 142 237.7C142.7 238.5 143.6 239.2 144.3 240C145 240.8 145.6 241.7 146.2 242.5C146.9 243.4 147.5 244.2 148.3 245C149 245.8 149.8 246.5 150.5 247.3C151.3 248 152 248.8 152.8 249.5C153.6 250.3 154.3 251.1 155.1 251.8C155.9 252.5 156.7 253.2 157.7 253.6C158.7 254 159.8 254 160.9 254C161.9 254 163.1 254 164 253.6C165 253.2 165.8 252.5 166.7 251.8C167.5 251.2 168.2 250.3 168.9 249.6C169.7 248.8 170.5 248.1 171.1 247.2C171.7 246.3 172.3 245.4 172.6 244.4C172.9 243.4 172.9 242.3 173 241.2C173.1 240.2 173 239.1 173.2 238C173.3 237 173.8 236 173.9 234.9C174 233.9 174 232.8 174 231.7C174 230.6 174 229.6 174 228.5C174 227.4 173.9 226.4 173.9 225.3C173.8 224.2 173.4 222.9 173.8 222.1C174.2 221.3 175.3 220.7 176.2 220.4C177.1 220.2 178.3 220.7 179.4 220.7C180.5 220.8 181.5 220.9 182.6 220.8C183.7 220.8 184.7 220.6 185.8 220.4C186.8 220.3 188 220.4 188.9 220C189.8 219.6 190.6 218.7 191.4 218C192.2 217.3 192.9 216.5 193.5 215.6C194.2 214.8 194.6 213.6 195.3 213C196.1 212.3 197.2 211.9 198.2 211.8C199.2 211.8 200.2 212.4 201.2 212.7C202.2 213.1 203.1 213.8 204.1 214C205.2 214.3 206.3 214.3 207.3 214.4C208.4 214.5 209.5 214.6 210.5 214.7C211.6 214.8 212.7 215.1 213.7 215.1C214.7 215 215.9 214.7 216.7 214.2C217.5 213.6 218.2 212.6 218.8 211.8C219.4 210.9 219.9 209.9 220.3 209C220.8 208 221 206.8 221.6 206.1C222.3 205.3 223.3 204.7 224.2 204.3C225.2 204 226.4 204 227.4 204C228.5 203.9 229.6 204.2 230.6 204C231.6 203.8 232.6 203.3 233.6 202.9C234.6 202.5 235.8 202.3 236.5 201.6C237.1 200.9 237.4 199.7 237.5 198.7C237.6 197.7 236.8 196.5 236.9 195.5C237.1 194.6 237.7 193.6 238.3 192.8C239 192 240 191.5 240.8 190.7C241.5 189.9 242.3 189.1 242.6 188.1C242.9 187.2 242.4 186 242.5 184.9C242.6 183.9 242.6 182.6 243.2 181.9C243.8 181.2 245 180.8 246 180.6C247 180.5 248.1 180.9 249.2 181C250.2 181.1 251.3 181.2 252.4 181.3C253.4 181.3 254.5 181.2 255.6 181.3C256.6 181.5 257.7 181.6 258.7 182C259.6 182.4 260.4 183.2 261.3 183.7C262.2 184.3 263.2 184.9 264.2 185.2C265.2 185.5 266.3 185.7 267.3 185.6C268.3 185.5 269.3 184.7 270.3 184.6C271.3 184.4 272.4 184.7 273.5 184.6C274.5 184.6 275.7 184.7 276.6 184.3C277.5 183.8 278.1 182.6 279 182.1C279.9 181.6 281 181.5 282 181.2C283 180.8 284 180.5 284.9 180C285.8 179.4 286.6 178.6 287.3 177.9C288.1 177.1 288.8 176.3 289.4 175.4C289.9 174.5 290.4 173.5 290.7 172.5C291 171.5 291.1 170.4 291.3 169.4C291.5 168.3 292 167.2 291.9 166.2C291.9 165.2 291.5 164.1 290.9 163.4C290.2 162.7 288.9 162.6 288 162C287.1 161.4 286.4 160.6 285.5 159.9C284.7 159.3 283.7 158.8 282.8 158.2C281.9 157.7 280.9 157.3 280 156.8C279 156.3 278 155.9 277.2 155.2C276.3 154.6 275.5 153.8 274.9 153C274.2 152.2 273.7 151.2 273.2 150.3C272.7 149.4 272.3 148.3 271.7 147.5C271 146.6 270.3 145.7 269.4 145.3C268.5 144.9 267.3 145 266.2 144.9C265.2 144.9 264 145.5 263.1 145.2C262.2 144.9 261.5 143.8 260.7 143.1C259.9 142.4 259.2 141.5 258.3 141.1C257.3 140.6 256.2 140.5 255.2 140.4C254.1 140.3 253 140.4 252 140.4C250.9 140.5 249.8 140.5 248.8 140.6C247.7 140.6 246.6 140.6 245.6 140.9C244.6 141.1 243.6 141.7 242.7 142.2C241.8 142.8 240.9 144 240.1 144C239.2 143.9 238.4 142.9 237.8 142.1C237.2 141.2 237.1 140 236.6 139.1C236.1 138.1 235.7 137.1 235 136.3C234.3 135.6 233.3 134.9 232.3 134.7C231.4 134.4 230.2 134.8 229.2 135C228.2 135.3 227.2 135.7 226.2 136C225.2 136.4 224.1 136.8 223.2 137.3C222.3 137.8 221.3 139 220.6 139.1C219.8 139.2 218.9 138.5 218.8 137.8C218.7 137.1 219.6 135.8 220 134.8C220.4 133.8 220.9 132.8 221 131.8C221.1 130.7 221 129.6 220.7 128.6C220.4 127.6 219.8 126.7 219.2 125.8C218.7 124.9 218.1 123.9 217.4 123.2C216.6 122.5 215.5 122.2 214.5 121.8C213.5 121.4 212.5 121.2 211.4 120.9C210.4 120.6 209.3 120.4 208.4 120C207.4 119.5 206.2 118.9 205.9 118.1C205.6 117.3 206.2 116.1 206.5 115C206.8 114 207.3 113.1 207.7 112.1C208.1 111.1 208.6 110.1 208.8 109C208.9 108 208.9 106.9 208.8 105.9C208.6 104.8 208.3 103.7 207.8 102.8C207.3 101.9 206.6 101 205.8 100.4C204.9 99.8 203.8 99.6 202.8 99.4C201.8 99.2 200.7 99.5 199.6 99.3C198.6 99.1 197.6 98.7 196.6 98.2C195.7 97.8 194.4 97.3 193.9 96.6C193.4 95.9 193 94.5 193.5 93.9C193.9 93.4 195.5 93.3 196.5 93.2C197.5 93 198.6 93.2 199.7 93.1C200.8 93 201.8 92.8 202.8 92.4C203.8 92.1 204.9 91.6 205.6 90.9C206.3 90.2 207 89.1 207.2 88.2C207.3 87.2 206.8 86.1 206.4 85.1C206.1 84.1 205.6 83.1 205 82.3C204.3 81.5 203.4 80.8 202.5 80.2C201.7 79.6 200.6 79.3 199.7 78.7C198.9 78.1 198.1 77.3 197.2 76.7C196.4 76 195.4 75.6 194.5 75C193.6 74.5 191.9 74 191.8 73.4C191.7 72.8 193 72 193.8 71.5C194.7 70.9 196 70.9 196.7 70.2C197.4 69.5 197.7 68.3 198 67.3C198.3 66.3 198.3 65.2 198.6 64.1C198.8 63.1 199.2 62 199.3 61C199.4 60 199.5 58.8 199.1 57.9C198.7 57 197.7 56.3 196.9 55.6C196.1 54.9 195.2 54.3 194.2 53.8C193.3 53.3 192.3 52.9 191.3 52.6C190.2 52.4 189.1 52.4 188.1 52.1C187.1 51.9 186.1 51.4 185.1 51.1C184 50.9 182.9 50.9 181.9 50.5C180.9 50.2 180.1 49.5 179.2 48.9C178.3 48.4 177.2 47.9 176.5 47.2C175.7 46.5 174.9 45.7 174.8 44.7C174.6 43.8 175.3 42.7 175.7 41.7C176 40.7 176.4 39.7 176.8 38.7C177.2 37.7 177.6 36.7 177.9 35.7C178.2 34.6 178.4 33.6 178.4 32.5C178.4 31.5 178.4 30.3 178 29.3C177.6 28.4 176.7 27.7 175.9 27C175.1 26.3 174.2 25.7 173.3 25.2C172.3 24.7 171.3 24.3 170.3 23.9C169.3 23.5 168.4 22.9 167.3 22.8C166.3 22.6 165.2 22.9 164.2 22.8C163.1 22.7 162.1 22.4 161 22.3C160 22.3 158.9 22.5 157.9 22.7C156.8 22.9 155.8 23.2 154.8 23.5C153.7 23.8 152.7 24.2 151.7 24.5C150.7 24.7 149.2 25.3 148.6 24.8C148 24.4 148 22.9 148.1 21.9C148.2 20.9 148.8 19.9 149.1 18.9C149.3 17.8 149.7 16.5 149.3 15.7C148.9 14.9 147.8 14.2 146.9 14.1C146 14 144.8 14.7 143.8 15.1C142.8 15.4 141.8 15.8 140.8 16.2C139.8 16.6 138.8 17.1 137.8 17.3C136.8 17.5 135.3 17.8 134.8 17.3C134.3 16.8 134.5 15.2 134.7 14.2C135 13.2 135.6 12.3 136 11.3C136.4 10.3 137 9.3 137.2 8.3C137.4 7.3 137.6 5.9 137.2 5.2C136.7 4.5 135.4 4.1 134.4 4C133.4 4 132.3 4.6 131.4 5.1C130.5 5.6 129.8 6.4 128.9 7.1C128.1 7.8 127.1 8.3 126.4 9C125.6 9.8 125 10.6 124.3 11.5C123.7 12.3 123.4 13.6 122.5 14.1C121.7 14.6 120.5 14.5 119.4 14.5C118.4 14.6 117.3 14.5 116.2 14.5C115.2 14.6 114.1 14.8 113.1 14.9C112 15.1 110.9 15.7 109.9 15.5C109 15.4 107.9 14.8 107.3 14C106.7 13.3 106.6 12 106.4 11C106.1 10 106.1 8.9 106 7.8C106 6.8 106.3 5.7 106.2 4.6C106.2 3.6 106.1 2.4 105.7 1.5C105.3 0.5 104.6 -0.4 103.8 -1.1C103 -1.7 101.9 -2.2 100.9 -2.4C99.9 -2.5 98.6 -2.5 97.8 -2Z';
// </SILUETA-GENERADA>

// <MECHONES-GENERADOS> Separaciones entre mechones (sombra) y brillos en sus puntas (luz),
// colocados a lo largo del contorno del cuerpo.
const MECHON_SOMBRA =
  'M96 11.6Q95.8 17.7 97.9 22.9M68.7 16.1Q72.3 21.1 76.4 24.6M46.6 28.7Q51.7 32.2 57.1 33.5M36.4 39.9Q41.5 43.4 46.5 45.5M24.2 56.8Q29.8 59.2 35.2 60.2M14.6 79Q20.7 79.5 26 77.1M12.3 95.5Q18.4 96.4 23.8 94.1M44.4 197.9Q48.1 192.9 50.9 188.3M196.5 212Q195.3 206.8 192.2 203.1M193.2 94.5Q187.5 92.1 181.9 92.2M191.9 73.1Q185.9 71.7 180.6 70.5M174.8 45.7Q169.3 47.1 165.1 49.8M148.4 24.6Q143.4 28.3 139.4 31.8M134.5 16.9Q128.9 19.4 124.7 22.9M122.7 14.3Q124.7 18.9 127.4 22.5M108.6 15.4Q105.3 20.1 104.7 25.5';
const MECHON_LUZ =
  'M100.5 1.8Q99.1 0.6 100.3 2.7M93.6 14.6Q90.4 9.5 85.5 9M82.2 7.1Q78.7 4.1 73.8 4.8M70 4.2Q68 3.1 69.3 5M59.8 18.2Q56.3 15.9 52.2 18.4M46.2 19.5Q43.6 19.9 45.4 21.3M37.3 30.7Q35.9 29.2 37.8 30.8M33 44.9Q28.4 44 24.8 47M23.9 47.3Q21.3 47.4 23.4 49.1M13.2 70Q12.1 72.9 16 74.9M9.8 88.4Q7.7 89.8 10.7 89.5M13.9 99.6Q9 101.9 7.3 106.3M8.4 104.9Q4.8 107.8 4.8 112.3M4.4 117.4Q3.2 121.6 6.4 125.7M34.7 190Q32.8 194.1 35.4 197.9M35.6 198.8Q35.4 201.4 37.2 199.8M49.3 203.3Q49 207.4 52.5 209.6M189.5 70.1Q194.8 68.1 194.5 64.3M194.9 62.4Q196.5 59.2 193.4 58.1M174.2 33.6Q175.4 30.4 172 29.2M170.7 28.5Q167.3 25.6 162.6 26.6M164.7 26.8Q160.1 25 156.2 27.3M144.9 18.8Q146.7 17.1 145.2 18.8M133 8.1Q134.8 7 133.5 8.6M101.1 2.1Q99.5 0.4 100.1 1.7';
const FILA_LUZ =
  'M83.3 19.7Q80.7 13.1 75.5 16.1M75.1 16Q69.4 10.2 79.8 6.3M79.8 6.3Q75.8 5 78.6 26.7M78.6 26.7Q58.8 24.2 57.8 28.2M57.8 28.2Q50 24.8 53 27.8M51.1 29.4Q50.7 18.9 57.6 18.3M57.6 18.3Q38.4 37.5 40 40.9M40 40.9Q43.4 28.7 51 41.1M49.4 46.5Q30.9 51 29.1 57.1M30.9 56.3Q27.8 50.9 31.9 42.2M32.4 42.9Q33.3 59.3 25.5 73.5M27.3 72.6Q19.6 71.1 23.7 73.1M24 72.1Q18.5 69.1 24.3 90.5M22 92.7Q14.8 91.6 17.4 82M20.1 89Q14.9 84.8 18.8 109.9M17.9 110.6Q11.9 110.3 15.5 114.8M15.4 115.1Q10.4 119.6 16.9 122.5M46.1 188.2Q40.3 192.6 45.5 193.5M46.1 195.7Q35.9 194.1 30.3 191.2M30.3 191.2Q54.8 199.2 60.2 202.1M60.1 201.9Q57.4 205.9 61 202.3';
// </MECHONES-GENERADOS>

// Estrellitas de cuatro puntas (cx, cy, r).
function estrella(cx, cy, r) {
  const k = r * 0.26;
  return `M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}` +
    `Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
}
const ESTRELLAS = [
  [82, 32, 3], [154, 70, 3.4], [178, 191, 3.6], [212, 186, 2.8], [132, 208, 3], [256, 166, 2.4],
  [60, 36, 2], [168, 44, 2.2],
].map(([x, y, r]) => estrella(x, y, r)).join('');

// Puntitos (x, y, r) agrupados en un único path por color.
function puntos(lista) {
  return lista.map(([x, y, r]) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`).join('');
}
const POLVO_BLANCO = puntos([
  [96, 26, 1], [120, 44, 0.8], [160, 46, 0.9], [172, 90, 0.8], [142, 112, 0.9], [186, 104, 0.8], [196, 160, 1],
  [208, 166, 0.8], [224, 172, 0.9], [238, 160, 0.7], [190, 182, 1.1], [205, 192, 0.9], [150, 196, 1],
  [142, 220, 0.8], [118, 205, 0.9], [230, 186, 0.8], [262, 160, 0.7], [180, 150, 0.8], [146, 30, 0.9],
  [189, 95, 0.9], [173, 86, 0.9], [196, 131, 0.7], [170, 136, 0.9], [143, 140, 0.9], [221, 151, 0.7],
  [172, 212, 0.7], [164, 213, 0.9], [184, 188, 0.6], [197, 190, 0.9], [204, 206, 0.7], [235, 189, 0.9],
  [268, 173, 0.9], [128, 65, 0.7], [131, 38, 0.9], [204, 108, 0.6],
]);
// Destellos de la zona de galaxia (rosas y naranjas).
const POLVO_ROSA = puntos([
  [118, 196, 0.9], [138, 203, 1.1], [158, 210, 0.8], [176, 199, 1], [196, 203, 0.7], [128, 214, 0.7],
  [166, 190, 0.6], [186, 212, 0.8],
]);
const POLVO_NARANJA = puntos([
  [148, 202, 1.2], [124, 192, 0.8], [170, 206, 0.9], [190, 196, 0.7], [140, 214, 0.8], [104, 198, 0.9],
  [182, 182, 0.6],
]);

// Manchas de acuarela: [cx, cy, rx, ry, gradiente, opacidad].
const MANCHAS = [
  [38, 60, 30, 22, 'chutun_crema', 0.75],
  [24, 150, 20, 30, 'chutun_crema', 0.6],
  [50, 198, 34, 24, 'chutun_crema', 0.8],
  [82, 44, 30, 18, 'chutun_crema', 0.5],
  [70, 150, 22, 26, 'chutun_crema', 0.35],
  [178, 66, 30, 38, 'chutun_pizarra', 0.42],
  [150, 150, 30, 26, 'chutun_pizarra', 0.22],
  [205, 172, 30, 18, 'chutun_pizarra', 0.25],
  [140, 50, 26, 20, 'chutun_menta', 0.45],
  [120, 170, 26, 18, 'chutun_menta', 0.4],
];

// ---------- Rostro ----------

// Ojo izquierdo (lejano): óvalo casi negro con esclerótica clara a la izquierda.
function OjoIzq({ escala, cerrado, guino, alegre, sorpresa }) {
  if (alegre && !cerrado) {
    return (
      <G>
        <Path d="M26 92Q37.5 72 50 92" fill="none" stroke={TINTA} strokeWidth={3.6} strokeLinecap="round" />
        <Path d="M25 88L21 85M27 82L24 78" fill="none" stroke={TINTA} strokeWidth={1.6} strokeLinecap="round" />
      </G>
    );
  }
  if (cerrado || guino) {
    return <Path d="M25 89Q37.5 99 50 88" fill="none" stroke={TINTA} strokeWidth={2.5} strokeLinecap="round" />;
  }
  return (
    <G transform={`translate(37.5 87) scale(${escala}) translate(-37.5 -87)`}>
      <Ellipse cx={37.5} cy={87} rx={12.6} ry={16.6} fill="#120d0b" />
      <Path d="M29.2 80Q24.6 90 29.4 100.5Q31.6 101 30.9 98Q28.6 90 31.2 81.5Q30.8 79.2 29.2 80Z" fill="#f1e3d0" />
      <Ellipse cx={43} cy={80} rx={1.8} ry={2.3} fill="#ffffff" opacity={sorpresa ? 0.9 : 0.45} />
      {sorpresa ? <Circle cx={34} cy={96} r={1.4} fill="#ffffff" opacity={0.7} /> : null}
    </G>
  );
}

// Ojo derecho (cercano): óvalo negro con una medialuna crema ancha a la derecha y abajo.
function OjoDer({ escala, cerrado, alegre, sorpresa }) {
  if (alegre && !cerrado) {
    return (
      <G>
        <Path d="M89 98Q106 74 123 98" fill="none" stroke={TINTA} strokeWidth={3.8} strokeLinecap="round" />
        <Path d="M124 93L128 89M121 86L125 81" fill="none" stroke={TINTA} strokeWidth={1.6} strokeLinecap="round" />
      </G>
    );
  }
  if (cerrado) {
    return <Path d="M88 93Q106 106 124 92" fill="none" stroke={TINTA} strokeWidth={2.5} strokeLinecap="round" />;
  }
  return (
    <G transform={`translate(106 92) scale(${escala}) translate(-106 -92)`}>
      <Ellipse cx={106} cy={92} rx={18.4} ry={18.6} fill="#120d0b" />
      <Ellipse cx={108.4} cy={93.4} rx={15.2} ry={16.2} fill="url(#chutun_luna)" />
      <Ellipse cx={99.6} cy={91.6} rx={12.4} ry={16.2} fill="#120d0b" />
      <Ellipse cx={104} cy={83} rx={sorpresa ? 2.6 : 1.9} ry={sorpresa ? 3.2 : 2.4} fill="#ffffff" opacity={sorpresa ? 0.95 : 0.5} />
      {sorpresa ? <Circle cx={95} cy={101} r={1.5} fill="#ffffff" opacity={0.7} /> : null}
    </G>
  );
}

// Cejas: pequeñas píldoras gris verdoso, como en la referencia.
const CEJAS = {
  neutral: ['M37 56.5Q42.5 53 49 51.5', 'M107 54.5Q113.5 56.5 119.5 61.5'],
  feliz: ['M36 54Q42 49 49 49.5', 'M106 51Q113 50 120 55'],
  pensativo: ['M36 52Q42 47 49 48.5', 'M106 59.5Q113 59.5 120.5 60'],
  sorprendido: ['M36 49Q42 43 49 43.5', 'M106 47Q113 43 120 47.5'],
  travieso: ['M36 58Q42 56.5 49 57', 'M105 50Q112 45 121 51'],
};

function Boca({ animo }) {
  const trazo = { fill: 'none', stroke: TINTA, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (animo) {
    case 'feliz':
      return (
        <G>
          <Path d="M50 116Q62 132 76 117Q64 121 50 116Z" fill="#7a3b33" stroke={TINTA} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M56 123Q63 127 69 123Q63 129 56 123Z" fill="#e48a84" />
        </G>
      );
    case 'pensativo':
      return <Path d="M52 125Q60 122 67 126" {...trazo} />;
    case 'sorprendido':
      return (
        <G>
          <Ellipse cx={58} cy={124} rx={5.4} ry={6.6} fill="#3a1a16" stroke={TINTA} strokeWidth={2} />
          <Ellipse cx={58} cy={127} rx={3} ry={2.4} fill="#c8706a" />
        </G>
      );
    case 'travieso':
      return (
        <G>
          <Path d="M50 122Q60 128 70 119" {...trazo} />
          <Path d="M68 117Q71 119 71 122" {...trazo} strokeWidth={1.8} />
        </G>
      );
    default:
      // Boquita fruncida soplando (beso) hacia la izquierda: una ε.
      return (
        <G>
          <Path d="M61.5 114.5Q56 111.5 52.5 116Q50.5 120 56 124.5Q51 127 52.5 132Q55 137.5 62.5 133.5" {...trazo} strokeWidth={2.6} />
          <Path d="M56 124.5Q53.8 125 53.5 124" {...trazo} strokeWidth={1.4} />
        </G>
      );
  }
}

// Soplido: dos o tres líneas cálidas y cortas que salen de la boca hacia la izquierda.
function Soplido() {
  return (
    <G>
      <Path d="M44 121Q30 119 14 121Q8 122 2 120" fill="none" stroke="#fff3c4" strokeWidth={2.2} strokeLinecap="round" opacity={0.75} />
      <Path d="M42 127Q28 127 10 129" fill="none" stroke="#fff0bd" strokeWidth={1.6} strokeLinecap="round" opacity={0.55} />
    </G>
  );
}

export default function FiguraChutun({ width, height, animo = 'neutral', ojosCerrados = false, viewBox }) {
  const sorpresa = animo === 'sorprendido';
  const escalaOjo = sorpresa ? 1.1 : animo === 'feliz' ? 0.96 : 1;
  const guino = animo === 'travieso';
  const cejas = CEJAS[animo] || CEJAS.neutral;
  const brilloMejilla = animo === 'feliz' || animo === 'travieso' ? 1 : 0.85;

  return (
    <Svg width={width} height={height} viewBox={viewBox || VIEWBOX}>
      <Defs>
        <ClipPath id="chutun_clip">
          <Path d={SILUETA} />
        </ClipPath>
        {/* Color base: crema cálido a la izquierda, menta pálida al centro, azul niebla a la derecha */}
        <LinearGradient id="chutun_cuerpo" x1="0" y1="0" x2="294" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#f3e2b4" />
          <Stop offset="0.12" stopColor="#ece0ba" />
          <Stop offset="0.25" stopColor="#dde1c6" />
          <Stop offset="0.4" stopColor="#c8d4c5" />
          <Stop offset="0.52" stopColor="#b3c4c2" />
          <Stop offset="0.64" stopColor="#9fb3b8" />
          <Stop offset="0.8" stopColor="#98abb2" />
          <Stop offset="1" stopColor="#b2c2c2" />
        </LinearGradient>
        <LinearGradient id="chutun_vertical" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
          <Stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
          <Stop offset="0.78" stopColor="#6a7378" stopOpacity="0.08" />
          <Stop offset="1" stopColor="#5d6266" stopOpacity="0.2" />
        </LinearGradient>
        <RadialGradient id="chutun_crema" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#fff6d8" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#fff6d8" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="chutun_menta" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#e6f2e6" stopOpacity="0.8" />
          <Stop offset="1" stopColor="#e6f2e6" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="chutun_pizarra" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#5f7888" stopOpacity="0.85" />
          <Stop offset="1" stopColor="#5f7888" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="chutun_galaxia" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#5a4a6e" stopOpacity="0.6" />
          <Stop offset="0.6" stopColor="#5d5878" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#5d6a80" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="chutun_nucleo" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#d9a07a" stopOpacity="0.45" />
          <Stop offset="1" stopColor="#d9a07a" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="chutun_punta" x1="250" y1="0" x2="292" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#8a6a52" stopOpacity="0" />
          <Stop offset="0.4" stopColor="#8a6a52" stopOpacity="0.45" />
          <Stop offset="1" stopColor="#7a5a44" stopOpacity="0.75" />
        </LinearGradient>
        <LinearGradient id="chutun_pierna_i" x1="0" y1="214" x2="0" y2="252" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#6e7a78" stopOpacity="0" />
          <Stop offset="0.3" stopColor="#6e7a78" stopOpacity="0.3" />
          <Stop offset="0.55" stopColor="#f4e6c0" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#b9c3bd" stopOpacity="0.3" />
        </LinearGradient>
        <LinearGradient id="chutun_pierna_d" x1="0" y1="212" x2="0" y2="254" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#5e6e78" stopOpacity="0" />
          <Stop offset="0.3" stopColor="#5e6e78" stopOpacity="0.35" />
          <Stop offset="0.55" stopColor="#d7ddd2" stopOpacity="0.2" />
          <Stop offset="1" stopColor="#8fa2ac" stopOpacity="0.4" />
        </LinearGradient>
        {/* Luz de borde: crema a la izquierda, blanco azulado a la derecha */}
        <LinearGradient id="chutun_borde" x1="0" y1="0" x2="294" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#fff1c4" stopOpacity="0.95" />
          <Stop offset="0.25" stopColor="#fff4d6" stopOpacity="0.55" />
          <Stop offset="0.5" stopColor="#f0f8f6" stopOpacity="0.25" />
          <Stop offset="0.8" stopColor="#eef7ff" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#eef7ff" stopOpacity="0.55" />
        </LinearGradient>
        <RadialGradient id="chutun_mejilla" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#f2967a" stopOpacity="0.85" />
          <Stop offset="0.6" stopColor="#f2a184" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#f2a184" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="chutun_luna" cx="0.75" cy="0.6" r="0.7">
          <Stop offset="0" stopColor="#f6ece0" />
          <Stop offset="0.7" stopColor="#f1e3d0" />
          <Stop offset="1" stopColor="#d9c3c3" />
        </RadialGradient>
      </Defs>

      {/* Cuerpo */}
      <Path d={SILUETA} fill="url(#chutun_cuerpo)" />

      <G clipPath="url(#chutun_clip)">
        {/* Manchas de acuarela (luz crema, menta y sombra azul pizarra) */}
        {MANCHAS.map(([cx, cy, rx, ry, g, o], i) => (
          <Ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${g})`} opacity={o} />
        ))}
        {/* Galaxia del vientre: violeta profundo con núcleo cálido y franja nebulosa */}
        <Ellipse cx={160} cy={201} rx={82} ry={26} fill="url(#chutun_galaxia)" opacity={1} />
        <Ellipse cx={135} cy={206} rx={40} ry={14} fill="url(#chutun_galaxia)" opacity={0.6} />
        <Ellipse cx={148} cy={203} rx={34} ry={12} fill="url(#chutun_nucleo)" />
        <Path d="M108 196Q140 186 172 196Q200 204 232 192" fill="none" stroke="#e8e4f0" strokeWidth={6} strokeLinecap="round" opacity={0.18} />
        <Path d="M0 0H294V256H0Z" fill="url(#chutun_vertical)" />

        {/* Cola de niebla: punta terrosa deshilachada */}
        <Path d="M300 128L250 138Q255 143 252 146Q246 149 248 152Q256 155 256 158Q251 162 253 166Q261 168 262 172Q259 177 263 180Q268 183 266 192L300 196Z" fill="url(#chutun_punta)" />
        <Path d="M258 150Q268 152 278 160M262 168Q272 168 284 172" fill="none" stroke="#c9a88c" strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
        {/* Bultos de nube en la cola: sombras y luces suaves */}
        <Path d="M172 140Q184 134 194 142Q204 134 216 142Q228 136 238 144Q248 140 256 146" fill="none" stroke="#6b8290" strokeWidth={4} strokeLinecap="round" opacity={0.25} />
        <Path d="M196 166Q210 158 224 166Q236 160 248 164" fill="none" stroke="#eef8ff" strokeWidth={3.6} strokeLinecap="round" opacity={0.3} />
        {/* Línea de luz: borde de la cabeza sobre la cola */}
        <Path d="M168 108C176 112 178 122 178 130C179 140 186 145 196 147C204 149 208 150 213 149" fill="none" stroke="#f2fbff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        {/* Borde inferior luminoso de la cola */}
        <Path d="M180 218C192 216 204 212 216 207C228 201 235 196 239 188C245 182 256 182 266 184C276 184 284 180 289 174" fill="none" stroke="#f4fbff" strokeWidth={2.6} strokeLinecap="round" opacity={0.65} />
        <Path d="M176 191Q183 196 190 191Q195 188 199 190" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />

        {/* Luz de borde (resplandor interior de la niebla) */}
        <Path d={SILUETA} fill="none" stroke="url(#chutun_borde)" strokeWidth={18} strokeLinejoin="round" opacity={0.18} />
        <Path d={SILUETA} fill="none" stroke="url(#chutun_borde)" strokeWidth={10} strokeLinejoin="round" opacity={0.22} />
        <Path d={SILUETA} fill="none" stroke="url(#chutun_borde)" strokeWidth={4} strokeLinejoin="round" opacity={0.3} />

        {/* Mechones: separaciones en sombra y brillos en las puntas */}
        <Path d={MECHON_SOMBRA} fill="none" stroke="#5f727a" strokeWidth={2} strokeLinecap="round" opacity={0.22} />
        <Path d={MECHON_LUZ} fill="none" stroke="#fffbe8" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        {/* Filas interiores de mechones (escamas suaves) */}
        <Path d={FILA_LUZ} fill="none" stroke="#fff8e0" strokeWidth={5} strokeLinecap="round" opacity={0.2} />
        {/* Pliegues de pelo en la parte baja izquierda */}
        <Path d="M40 196Q46 204 54 206M58 206Q64 213 74 214M24 184Q30 190 38 191" fill="none" stroke="#fff6dc" strokeWidth={3} strokeLinecap="round" opacity={0.4} />

        {/* Piernas lisas con sombra de oclusión bajo el vientre */}
        <Ellipse cx={97} cy={236} rx={19} ry={24} fill="url(#chutun_pierna_i)" />
        <Ellipse cx={157} cy={234} rx={23} ry={26} fill="url(#chutun_pierna_d)" />
        <Path d="M84 226Q98 232 112 229M138 230Q154 228 172 222" fill="none" stroke="#56646a" strokeWidth={5} strokeLinecap="round" opacity={0.18} />
        <Path d="M110 228Q124 234 140 230" fill="none" stroke="#4d5a62" strokeWidth={8} strokeLinecap="round" opacity={0.16} />
        <Path d="M90 236Q92 244 98 248M150 236Q154 244 160 248" fill="none" stroke="#fffaf0" strokeWidth={2.2} strokeLinecap="round" opacity={0.4} />

        {/* Pliegue del brazo derecho (sombra suave junto a la manita) */}
        <Path d="M128 160Q140 166 150 180" fill="none" stroke="#6f8f9a" strokeWidth={3} strokeLinecap="round" opacity={0.4} />
      </G>

      {/* Contorno suave azulado */}
      <Path d={SILUETA} fill="none" stroke="#4e6068" strokeWidth={0.8} strokeLinejoin="round" opacity={0.15} />

      {/* Brillos: estrellitas y polvo de estrellas */}
      <Path d={ESTRELLAS} fill="#ffffff" opacity={0.95} />
      <Path d={POLVO_BLANCO} fill="#ffffff" opacity={0.8} />
      <Path d={POLVO_ROSA} fill="#f7b6c8" opacity={0.85} />
      <Path d={POLVO_NARANJA} fill="#ffc58a" opacity={0.85} />

      {/* Puñito izquierdo (lejano), pegado a la mejilla */}
      <Path d="M13 140Q18 136.5 21 141.5Q25.5 140 28.5 145.5Q33.5 151 33.6 160Q33.8 170 29 177" fill="none" stroke={TINTA_LINEA} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      <Path d="M21 141.5Q20.5 145 18.5 147M28.5 145.5Q28.2 149 26.2 151" fill="none" stroke={TINTA_LINEA} strokeWidth={1.3} strokeLinecap="round" opacity={0.75} />

      {/* Manita derecha con mentón */}
      <Path d="M97.5 150Q93 147.5 91 152Q88 149.5 85 153Q80 153 81.5 158Q77 160 79 165Q76 167 80 170" fill="none" stroke={TINTA} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M97.5 150Q101 147 104 150Q109 154 113 157.5Q119 161 124.5 158" fill="none" stroke={TINTA} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M86 160Q90 158 92 160M84 165Q88 164 90 166" fill="none" stroke={TINTA} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
      {/* Brazo: línea fina y suave que baja de la manita (como en la referencia) */}
      <Path d="M81 170Q88 186 104 193Q120 197 133 189" fill="none" stroke={TINTA_LINEA} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
      <Path d="M139 189Q148 184 152 173" fill="none" stroke={TINTA_LINEA} strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />

      {/* Mejillas */}
      <Ellipse cx={17} cy={109} rx={15} ry={8} fill="url(#chutun_mejilla)" opacity={brilloMejilla} />
      <Ellipse cx={116} cy={121} rx={21} ry={11} fill="url(#chutun_mejilla)" opacity={brilloMejilla} />
      <Path d="M108 124L112 118M113.5 125L117.5 119M119 125L123 119" fill="none" stroke="#d9786a" strokeWidth={1} strokeLinecap="round" opacity={0.35} />

      {/* Cejas */}
      <Path d={cejas[0]} fill="none" stroke="#5f6b66" strokeWidth={4.4} strokeLinecap="round" />
      <Path d={cejas[0]} fill="none" stroke="#8d9a92" strokeWidth={2.4} strokeLinecap="round" />
      <Path d={cejas[1]} fill="none" stroke="#5f6b66" strokeWidth={4.4} strokeLinecap="round" />
      <Path d={cejas[1]} fill="none" stroke="#8d9a92" strokeWidth={2.4} strokeLinecap="round" />

      {/* Ojos */}
      <OjoIzq escala={escalaOjo} cerrado={ojosCerrados} guino={guino && !ojosCerrados} alegre={animo === 'feliz'} sorpresa={sorpresa} />
      <OjoDer escala={escalaOjo} cerrado={ojosCerrados} alegre={animo === 'feliz'} sorpresa={sorpresa} />

      {/* Boca */}
      <Boca animo={animo} />
      {animo === 'neutral' ? <Soplido /> : null}
    </Svg>
  );
}
