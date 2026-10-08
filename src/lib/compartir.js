// ======================
// COMPARTIR EL RESULTADO
// ======================
// 1) Un enlace que guarda las 15 respuestas (?r=012301230123012)
// 2) Una tarjeta-imagen del resultado dibujada con <canvas>

import { TOTAL } from './puntuacion.js'; // 15

const AZUL = '#167db7'; // color principal
const NARANJA = '#ff912c'; // color de acento
const TEXTO = '#1a1a1a'; // casi negro
const GRIS = '#5a6b7a'; // texto secundario
const ENLACE_CORTO = 'bit.ly/Escaner_Infojobs'; // enlace que se imprime en la tarjeta

// --- ENLACE ---

// Crea el enlace del resultado: la web + ?r= + las respuestas pegadas ("0123...")
export const crearEnlace = (respuestas) =>
  `${window.location.origin}${window.location.pathname}?r=${respuestas.join('')}`;

// Lee las respuestas del enlace actual. Devuelve null si no hay o no son válidas.
export const leerEnlace = () => {
  const codigo = new URLSearchParams(window.location.search).get('r'); // lo que va detrás de ?r=
  const valido = new RegExp(`^[0-3]{${TOTAL}}$`).test(codigo || ''); // exactamente 15 cifras del 0 al 3
  return valido ? codigo.split('').map(Number) : null; // "012" -> [0, 1, 2]
};

// Quita el ?r= de la barra de direcciones sin recargar la página
export const limpiarEnlace = () => window.history.replaceState(null, '', window.location.pathname);

// Enlace para abrir el diálogo de publicar en LinkedIn
export const enlaceLinkedIn = (url) =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

// --- TARJETA (imagen de 1080 x 1350, mismo estilo que la pantalla de resultados) ---

// Parte un texto en líneas que quepan en "anchoMax". Devuelve la lista de líneas.
const partirEnLineas = (ctx, texto, anchoMax) => {
  const lineas = ['']; // empezamos con una línea vacía
  texto.split(' ').forEach((palabra) => {
    const ultima = lineas[lineas.length - 1]; // la línea que estamos rellenando
    const prueba = ultima ? `${ultima} ${palabra}` : palabra; // esa línea con una palabra más
    if (ctx.measureText(prueba).width > anchoMax && ultima) lineas.push(palabra); // no cabe: línea nueva
    else lineas[lineas.length - 1] = prueba; // cabe: seguimos en la misma
  });
  return lineas;
};

// Dibuja una "pastilla" (rectángulo muy redondeado), con relleno y, si se pide, borde punteado
const pastilla = (ctx, x, y, ancho, alto, relleno, borde) => {
  ctx.beginPath(); // empieza una forma
  ctx.roundRect(x, y, ancho, alto, alto / 2); // esquinas totalmente redondas
  ctx.fillStyle = relleno; // color de dentro
  ctx.fill(); // la rellena
  if (borde) { // solo los sellos llevan borde
    ctx.setLineDash([8, 6]); // línea punteada: 8 px de raya, 6 de hueco
    ctx.lineWidth = 3; // grosor del borde
    ctx.strokeStyle = borde; // color del borde
    ctx.stroke(); // lo pinta
    ctx.setLineDash([]); // vuelve a línea continua para lo siguiente
  }
};

// Dibuja la tarjeta y devuelve la imagen como texto (data URL en PNG)
export const generarTarjeta = async (resultado) => {
  await document.fonts.ready; // espera a que la fuente Inter esté cargada

  const ANCHO = 1080; // ancho en píxeles
  const ALTO = 1350; // alto en píxeles (formato 4:5, el que mejor se ve en LinkedIn e Instagram)
  const CENTRO = ANCHO / 2; // todo va centrado, como en la pantalla
  const lienzo = document.createElement('canvas'); // lienzo invisible
  lienzo.width = ANCHO; // le damos tamaño
  lienzo.height = ALTO;
  const ctx = lienzo.getContext('2d'); // el "pincel"
  const fuente = (peso, tam) => `${peso} ${tam}px Inter, system-ui, sans-serif`; // atajo para elegir fuente
  const { arquetipo, posicion, porcentaje, sellos } = resultado; // los datos que se pintan

  // Fondo
  const fondo = ctx.createLinearGradient(0, 0, ANCHO, ALTO); // degradado en diagonal
  fondo.addColorStop(0, '#ffffff'); // blanco arriba
  fondo.addColorStop(1, '#dbe7f1'); // azul grisáceo abajo
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, ANCHO, ALTO); // pinta todo el lienzo
  ctx.fillStyle = AZUL;
  ctx.fillRect(0, 0, ANCHO, 16); // franja azul de arriba

  ctx.textAlign = 'center'; // los textos se centran en la "x" que les demos
  ctx.textBaseline = 'alphabetic'; // la "y" marca la base de las letras

  // Etiqueta de arriba
  ctx.fillStyle = '#b85c00'; // naranja oscuro
  ctx.font = fuente(700, 28);
  ctx.fillText('RESULTADO DEL ESCÁNER', CENTRO, 130);

  // Arquetipo (1 o 2 líneas)
  let y = 160; // la "y" va bajando según pintamos
  ctx.fillStyle = TEXTO;
  ctx.font = fuente(800, 80);
  partirEnLineas(ctx, arquetipo.titulo, 920).forEach((linea) => {
    y += 88; // baja una línea
    ctx.fillText(linea, CENTRO, y);
  });
  ctx.fillStyle = GRIS;
  ctx.font = fuente(500, 36);
  y += 62; // baja para el subtítulo
  ctx.fillText(arquetipo.subtitulo, CENTRO, y);

  // Porcentaje grande
  ctx.fillStyle = AZUL;
  ctx.font = fuente(800, 200);
  y += 210;
  ctx.fillText(`${porcentaje}%`, CENTRO, y);

  // Escala de 6 tramos, rellenos hasta tu nivel
  const TRAMO = 86; // ancho de cada tramo
  const HUECO = 10; // separación entre tramos
  const inicio = CENTRO - (TRAMO * 6 + HUECO * 5) / 2; // "x" del primer tramo para que queden centrados
  y += 44;
  for (let n = 0; n < 6; n++) {
    const color = n <= posicion ? AZUL : 'rgba(22, 125, 183, 0.18)'; // lleno o vacío
    pastilla(ctx, inicio + n * (TRAMO + HUECO), y, TRAMO, 16, color);
  }
  ctx.fillStyle = GRIS;
  ctx.font = fuente(500, 30);
  y += 66;
  ctx.fillText(`Nivel corporativo ${posicion + 1} de 6 · ${arquetipo.nivelLabel}`, CENTRO, y);

  // Chapa con el estado
  ctx.font = fuente(700, 24);
  const anchoChapa = ctx.measureText(arquetipo.estado).width + 56; // el texto + relleno a los lados
  y += 36;
  pastilla(ctx, CENTRO - anchoChapa / 2, y, anchoChapa, 52, 'rgba(22, 125, 183, 0.08)');
  ctx.fillStyle = AZUL;
  ctx.fillText(arquetipo.estado, CENTRO, y + 35);

  // Sellos: pastillas con borde punteado, colocadas en filas centradas
  ctx.font = fuente(600, 26);
  const chips = sellos.map((sello) => {
    const texto = `${sello.emoji}  ${sello.texto}`; // emoji + nombre del sello
    return { texto, ancho: ctx.measureText(texto).width + 52 }; // ancho del texto + relleno
  });
  const filas = [[]]; // repartimos los sellos en filas que no pasen de 960 px
  chips.forEach((chip) => {
    const fila = filas[filas.length - 1]; // la fila que estamos rellenando
    const ocupado = fila.reduce((suma, c) => suma + c.ancho + 16, 0); // lo que ya ocupa esa fila
    if (ocupado + chip.ancho > 960 && fila.length) filas.push([chip]); // no cabe: fila nueva
    else fila.push(chip); // cabe
  });
  y += 110; // separación antes de los sellos
  filas.forEach((fila) => {
    const anchoFila = fila.reduce((suma, c) => suma + c.ancho, 0) + 16 * (fila.length - 1); // ancho total de la fila
    let x = CENTRO - anchoFila / 2; // "x" donde empieza para quedar centrada
    fila.forEach((chip) => {
      pastilla(ctx, x, y, chip.ancho, 56, '#ffffff', NARANJA); // fondo blanco, borde naranja punteado
      ctx.fillStyle = TEXTO;
      ctx.fillText(chip.texto, x + chip.ancho / 2, y + 37); // texto centrado dentro
      x += chip.ancho + 16; // siguiente sello de la fila
    });
    y += 70; // siguiente fila
  });

  // Pie
  ctx.fillStyle = TEXTO;
  ctx.font = fuente(700, 34);
  ctx.fillText(`Haz el test aquí: ${ENLACE_CORTO}`, CENTRO, ALTO - 100);
  ctx.fillStyle = GRIS;
  ctx.font = fuente(500, 26);
  ctx.fillText('Un proyecto de Tania de Azevedo', CENTRO, ALTO - 52);

  return lienzo.toDataURL('image/png'); // la imagen lista para mostrar o descargar
};
