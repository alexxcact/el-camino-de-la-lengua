// ───────────────────────────────────────────────────────────────
// Raíces de la palabra: palabras reales (lugares, apellidos, plantas) que los
// libros fuente descomponen pieza por pieza. Cada entrada fue extraída del texto
// y verificada contra él (ANH 2015 con página impresa; AUKUSAN con página del PDF,
// porque no trae numeración impresa). Se descartaron las marcadas como dudosas,
// las que el libro no segmenta completas y las de contenido sagrado.
// piezas: en el orden de la palabra; enlace = consonante sin significado propio.
// sig: el significado de la pieza tal como lo da el libro (una acepción).
// ───────────────────────────────────────────────────────────────

export const TIPOS_RAIZ = {
  lugar: 'Nombre de lugar',
  apellido: 'Apellido',
  planta: 'Planta',
  animal: 'Animal',
  objeto: 'Objeto',
  otro: 'Palabra',
};

export const RAICES = [
  {palabra: "Imues",tipo: "lugar",piezas: [{t: "I",enlace: true},{t: "mu",sig: "escondido"},{t: "es",sig: "agua"}],traduccion: "Agua escondida",fuente: "Lengua de los Pastos (ANH, 2015), pp. 13, 30"},
  {palabra: "Cuasquer",tipo: "lugar",piezas: [{t: "Cuas",sig: "agua"},{t: "quer",sig: "pueblo"}],traduccion: "Pueblo del agua",fuente: "Lengua de los Pastos (ANH, 2015), p. 24"},
  {palabra: "Cuaspud",tipo: "lugar",piezas: [{t: "Cuas",sig: "agua"},{t: "pud",sig: "colina"}],traduccion: "Colina de agua",fuente: "Lengua de los Pastos (ANH, 2015), p. 23"},
  {palabra: "Cuasput",tipo: "lugar",piezas: [{t: "Cuas",sig: "agua"},{t: "put",sig: "volcán"}],traduccion: "Volcán de agua",fuente: "Lengua de los Pastos (ANH, 2015), p. 24"},
  {palabra: "Males",tipo: "lugar",piezas: [{t: "Mal",sig: "ir"},{t: "es",sig: "agua"}],traduccion: "Río de los viajes",fuente: "Lengua de los Pastos (ANH, 2015), pp. 32, 57"},
  {palabra: "Pacual",tipo: "lugar",piezas: [{t: "Pa",sig: "familia"},{t: "cual",sig: "río"}],traduccion: "Río de la familia",fuente: "Lengua de los Pastos (ANH, 2015), pp. 33, 58"},
  {palabra: "Pasto",tipo: "lugar",piezas: [{t: "Pas",sig: "familia"},{t: "to",sig: "tierra"}],traduccion: "Tierra de la familia",fuente: "Lengua de los Pastos (ANH, 2015), p. 58"},
  {palabra: "Capulí",tipo: "planta",piezas: [{t: "Ca",sig: "grande"},{t: "pulí",sig: "fruto"}],traduccion: "Gran fruto",fuente: "Lengua de los Pastos (ANH, 2015), pp. 49, 82"},
  {palabra: "Chilgual",tipo: "lugar",piezas: [{t: "Chil",sig: "frío"},{t: "gual",sig: "río"}],traduccion: "Río frío",fuente: "Lengua de los Pastos (ANH, 2015), pp. 50, 68"},
  {palabra: "Chucunes",tipo: "lugar",piezas: [{t: "Chu",sig: "leña"},{t: "cun",sig: "yuca"},{t: "es",sig: "río"}],traduccion: "Río de leña y yucas",fuente: "Lengua de los Pastos (ANH, 2015), p. 26"},
  {palabra: "Ipiales",tipo: "lugar",piezas: [{t: "I",enlace: true},{t: "pia",sig: "maíz"},{t: "l",enlace: true},{t: "es",sig: "río"}],traduccion: "Río del maíz",fuente: "Lengua de los Pastos (ANH, 2015), p. 30"},
  {palabra: "Ipialpud",tipo: "lugar",piezas: [{t: "I",enlace: true},{t: "pial",sig: "maíz"},{t: "pud",sig: "cerro"}],traduccion: "Cerro del maíz",fuente: "Lengua de los Pastos (ANH, 2015), p. 31"},
  {palabra: "Piartal",tipo: "lugar",piezas: [{t: "Piar",sig: "maíz"},{t: "tal",sig: "piedra"}],traduccion: "Piedra de moler el maíz",fuente: "Lengua de los Pastos (ANH, 2015), p. 59"},
  {palabra: "Guacales",tipo: "lugar",piezas: [{t: "Gua",sig: "poder"},{t: "cal",sig: "trabajo"},{t: "es",sig: "agua"}],traduccion: "Agua del poder y del trabajo",fuente: "Lengua de los Pastos (ANH, 2015), p. 27"},
  {palabra: "Yaes",tipo: "lugar",piezas: [{t: "Ya",sig: "casa"},{t: "es",sig: "río"}],traduccion: "Casa del río",fuente: "Lengua de los Pastos (ANH, 2015), p. 38"},
  {palabra: "Yascual",tipo: "lugar",piezas: [{t: "Ya",sig: "casa"},{t: "s",enlace: true},{t: "cual",sig: "quebrada"}],traduccion: "Quebrada de la casa",fuente: "Lengua de los Pastos (ANH, 2015), p. 38"},
  {palabra: "Puerres",tipo: "lugar",piezas: [{t: "Pue",sig: "círculo"},{t: "rr",enlace: true},{t: "es",sig: "río"}],traduccion: "Río del círculo",fuente: "Lengua de los Pastos (ANH, 2015), p. 34"},
  {palabra: "Putisnan",tipo: "lugar",piezas: [{t: "Put",sig: "cerro"},{t: "is",sig: "pequeño"},{t: "nan",sig: "abajo"}],traduccion: "Pequeño cerro de abajo",fuente: "Lengua de los Pastos (ANH, 2015), p. 34"},
  {palabra: "Chapud",tipo: "lugar",piezas: [{t: "Cha",sig: "madera roja"},{t: "pud",sig: "cerro"}],traduccion: "Cerro de la madera roja",fuente: "Lengua de los Pastos (ANH, 2015), pp. 25, 39, 50"},
  {palabra: "Chicales",tipo: "lugar",piezas: [{t: "Chi",sig: "helado"},{t: "cal",sig: "fuerza"},{t: "es",sig: "río"}],traduccion: "Río helado de la fuerza",fuente: "Lengua de los Pastos (ANH, 2015), pp. 25, 26"},
  {palabra: "Iscualquer",tipo: "lugar",piezas: [{t: "Is",sig: "pequeño"},{t: "cual",sig: "río"},{t: "quer",sig: "pueblo"}],traduccion: "Pueblo del pequeño río",fuente: "Lengua de los Pastos (ANH, 2015), p. 31"},
  {palabra: "Pipala",tipo: "lugar",piezas: [{t: "Pi",sig: "agua"},{t: "pa",sig: "hablar"},{t: "la",sig: "ahí"}],traduccion: "Ahí habla el agua",fuente: "Lengua de los Pastos (ANH, 2015), p. 60"},
  {palabra: "Cualchala",tipo: "lugar",piezas: [{t: "Cual",sig: "agua"},{t: "cha",sig: "sabroso"},{t: "la",sig: "ahí"}],traduccion: "Ahí el agua sabrosa",fuente: "Lengua de los Pastos (ANH, 2015), p. 52"},
  {palabra: "Tepud",tipo: "apellido",piezas: [{t: "Te",sig: "bejuco"},{t: "pud",sig: "cerro"}],traduccion: "Cerro del bejuco",fuente: "Lengua de los Pastos (ANH, 2015), pp. 63, 79"},
  {palabra: "Chipud",tipo: "apellido",piezas: [{t: "Chi",sig: "frío"},{t: "pud",sig: "cerro"}],traduccion: "Cerro frío",fuente: "Lengua de los Pastos (ANH, 2015), p. 44"},
  {palabra: "Impud",tipo: "apellido",piezas: [{t: "Im",sig: "fuego"},{t: "pud",sig: "cerro"}],traduccion: "Cerro de fuego",fuente: "Lengua de los Pastos (ANH, 2015), p. 72"},
  {palabra: "Choés",tipo: "apellido",piezas: [{t: "Cho",sig: "leña"},{t: "es",sig: "pueblo"}],traduccion: "Poblado de leña",fuente: "Lengua de los Pastos (ANH, 2015), p. 69"},
  {palabra: "Yarpas",tipo: "apellido",piezas: [{t: "Yar",sig: "casa"},{t: "pas",sig: "familia"}],traduccion: "Familia de casa",fuente: "Lengua de los Pastos (ANH, 2015), p. 81"},
  {palabra: "Pascala",tipo: "apellido",piezas: [{t: "Pas",sig: "familia"},{t: "ca",sig: "grande"},{t: "la",sig: "ahí"}],traduccion: "Ahí la gran familia",fuente: "Lengua de los Pastos (ANH, 2015), p. 75"},
  {palabra: "Alpala",tipo: "apellido",piezas: [{t: "Al",sig: "arriba"},{t: "pa",sig: "Sol"},{t: "la",sig: "ahí"}],traduccion: "Ahí el Sol de mediodía",fuente: "Lengua de los Pastos (ANH, 2015), p. 66"},
  {palabra: "Gualte",tipo: "planta",piezas: [{t: "Gual",sig: "agua"},{t: "te",sig: "bejuco"}],traduccion: "Bejuco de agua",fuente: "Lengua de los Pastos (ANH, 2015), p. 86"},
  {palabra: "Tarta",tipo: "planta",piezas: [{t: "Tar",sig: "planta"},{t: "ta",sig: "valioso"}],traduccion: "Planta valiosa",fuente: "Lengua de los Pastos (ANH, 2015), p. 88"},
  {palabra: "Cuasmal",tipo: "lugar",piezas: [{t: "Cuas",sig: "agua"},{t: "mal",sig: "ir"}],traduccion: "Ir del agua",fuente: "AUKUSAN, p. 43 del PDF"},
  {palabra: "Cuascuas",tipo: "planta",piezas: [{t: "Cuas",sig: "madera roja"},{t: "cuas",sig: "énfasis: muy"}],traduccion: "Buena madera roja",fuente: "AUKUSAN, p. 43 del PDF"},
  {palabra: "Chunchirmal",tipo: "lugar",piezas: [{t: "Chu",sig: "leña"},{t: "n",enlace: true},{t: "chi",sig: "lo alto"},{t: "r",enlace: true},{t: "mal",sig: "ir"}],traduccion: "Ir a lo alto a la leña",fuente: "AUKUSAN, pp. 38-39 del PDF"},
  {palabra: "Altaquer",tipo: "lugar",piezas: [{t: "Al",sig: "sitio"},{t: "ta",sig: "riqueza"},{t: "quer",sig: "pueblo"}],traduccion: "Sitio de riquezas del pueblo",fuente: "AUKUSAN, p. 28 del PDF"},
  {palabra: "Imbula",tipo: "lugar",piezas: [{t: "Im",sig: "fuego"},{t: "bu",sig: "cerro"},{t: "la",sig: "ahí"}],traduccion: "Ahí el cerro del fuego",fuente: "AUKUSAN, p. 52 del PDF"},
  {palabra: "Inchuchala",tipo: "apellido",piezas: [{t: "In",sig: "fuego"},{t: "chu",sig: "leña"},{t: "cha",sig: "cosa útil"},{t: "la",sig: "ahí"}],traduccion: "Ahí la cosa útil, la leña del fuego",fuente: "AUKUSAN, pp. 53, 123 del PDF"},
];
