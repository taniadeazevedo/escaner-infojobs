// ======================
// COMPARTIR EL RESULTADO
// ======================
// 1) Enlaces que guardan las 15 respuestas: resultado (?r=0123...) y reto (?reto=0123...)
// 2) Una tarjeta-imagen del resultado dibujada con <canvas>

import { TOTAL } from './puntuacion.js'; // 15

const AZUL = '#167db7'; // color principal
const NARANJA = '#ff912c'; // color de acento
const TEXTO = '#1a1a1a'; // casi negro
const GRIS = '#5a6b7a'; // texto secundario
const ENLACE_CORTO = 'bit.ly/Escaner_Infojobs'; // enlace que se imprime en la tarjeta

// --- ENLACE ---

const base = () => `${window.location.origin}${window.location.pathname}`; // la web sin nada detrás

// Enlace del resultado: ?r= + las respuestas pegadas ("0123...") y, si hay, &x= + secretos de cómo jugaste
export const crearEnlace = (respuestas, extras = []) =>
  `${base()}?r=${respuestas.join('')}${extras.length ? `&x=${extras.join('.')}` : ''}`;

// Enlace de reto: ?reto= + tus respuestas y, si lo pones, &de= + tu nombre
export const crearReto = (respuestas, nombre) =>
  `${base()}?reto=${respuestas.join('')}${nombre ? `&de=${encodeURIComponent(nombre)}` : ''}`;

// Lee el enlace actual. Devuelve { modo: 'resultado' | 'reto', ... } o null si no hay nada válido.
export const leerEnlace = () => {
  const datos = new URLSearchParams(window.location.search); // lo que va detrás del "?"
  const valido = (codigo) => new RegExp(`^[0-3]{${TOTAL}}$`).test(codigo || ''); // exactamente 15 cifras del 0 al 3
  const aLista = (codigo) => codigo.split('').map(Number); // "012" -> [0, 1, 2]
  if (valido(datos.get('r'))) {
    return { modo: 'resultado', respuestas: aLista(datos.get('r')), extras: (datos.get('x') || '').split('.').filter(Boolean) };
  }
  if (valido(datos.get('reto'))) {
    return { modo: 'reto', respuestas: aLista(datos.get('reto')), nombre: (datos.get('de') || '').trim().slice(0, 20) }; // nombre de 20 letras como mucho
  }
  return null; // dirección normal, sin resultado ni reto
};

// Número de expediente: sale de las respuestas, así el mismo resultado tiene siempre el mismo número
export const numeroExpediente = (respuestas) => {
  let numero = 7; // semilla
  respuestas.forEach((opcion) => { numero = (numero * 31 + opcion + 1) % 99991; }); // mezcla cada respuesta
  return String(numero).padStart(5, '0'); // siempre 5 cifras: 04721
};

// Fecha de hoy en formato español: 16/10/2026
export const fechaHoy = () => new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Quita el ?r= / ?reto= de la barra de direcciones sin recargar la página
export const limpiarEnlace = () => window.history.replaceState(null, '', window.location.pathname);

// Enlace para abrir el diálogo de publicar en LinkedIn
export const enlaceLinkedIn = (url) =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

// --- TARJETA (imagen de 1080 x 1350): una acreditación de empleado con tu arquetipo como cargo ---

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

// Dibuja un rectángulo con esquinas redondeadas, solo relleno
const pastillaRect = (ctx, x, y, ancho, alto, radio, relleno) => {
  ctx.beginPath(); // empieza una forma
  ctx.roundRect(x, y, ancho, alto, radio); // rectángulo con esquinas de "radio" px
  ctx.fillStyle = relleno; // color de dentro
  ctx.fill(); // lo rellena
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

// Dibuja la acreditación y devuelve la imagen como texto (data URL en PNG)
export const generarTarjeta = async (resultado, expediente) => {
  await Promise.all([ // espera a que estén cargadas las dos fuentes que usa el dibujo
    document.fonts.load('800 40px Inter'),
    document.fonts.load('600 24px "IBM Plex Mono"')
  ]);

  const ANCHO = 1080; // ancho en píxeles
  const ALTO = 1350; // alto en píxeles (formato 4:5, el que mejor se ve en LinkedIn e Instagram)
  const CENTRO = ANCHO / 2; // centro horizontal
  const lienzo = document.createElement('canvas'); // lienzo invisible
  lienzo.width = ANCHO; // le damos tamaño
  lienzo.height = ALTO;
  const ctx = lienzo.getContext('2d'); // el "pincel"
  const inter = (peso, tam) => `${peso} ${tam}px Inter, system-ui, sans-serif`; // letra normal
  const mono = (peso, tam) => `${peso} ${tam}px "IBM Plex Mono", ui-monospace, monospace`; // letra de máquina
  const { arquetipo, posicion, porcentaje, sellos, secretos } = resultado; // los datos que se pintan

  // Medidas de la acreditación
  const T = { x: 150, y: 165, ancho: 780, alto: 1030 }; // la tarjeta blanca
  const IZQ = T.x + 50; // margen izquierdo dentro de la tarjeta
  const DER = T.x + T.ancho - 50; // margen derecho dentro de la tarjeta

  // Fondo: gris azulado, como una mesa de oficina
  ctx.fillStyle = '#e9eef3';
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Cinta del cuello (dos tiras naranjas que bajan hacia la tarjeta)
  ctx.strokeStyle = NARANJA;
  ctx.lineWidth = 46; // grosor de la cinta
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(380, -20); ctx.lineTo(515, 175); // tira izquierda
  ctx.moveTo(700, -20); ctx.lineTo(565, 175); // tira derecha
  ctx.stroke();

  // Tarjeta blanca con sombra
  ctx.save(); // guarda el estado para que la sombra solo afecte a la tarjeta
  ctx.shadowColor = 'rgba(16, 40, 60, 0.18)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 20;
  pastillaRect(ctx, T.x, T.y, T.ancho, T.alto, 36, '#ffffff');
  ctx.restore(); // quita la sombra

  // Pinza metálica y agujero
  pastillaRect(ctx, 495, 150, 90, 46, 10, '#9aa8b5'); // la pinza
  pastillaRect(ctx, 500, 205, 80, 16, 8, '#e9eef3'); // el agujero de la tarjeta

  // Franja azul de cabecera
  ctx.fillStyle = AZUL;
  ctx.fillRect(T.x, 240, T.ancho, 110);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = mono(700, 26);
  ctx.fillText('ACREDITACIÓN · DPTO. DE RR. HH.', IZQ, 287);
  ctx.font = inter(600, 24);
  ctx.fillText('Escáner de Compatibilidad Laboral', IZQ, 325);

  // Foto: silueta sin cara
  const F = { x: IZQ, y: 390, ancho: 210, alto: 255 }; // el hueco de la foto
  pastillaRect(ctx, F.x, F.y, F.ancho, F.alto, 16, '#eef3f7');
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(F.x, F.y, F.ancho, F.alto, 16);
  ctx.clip(); // lo que se pinte ahora no se sale del hueco
  ctx.fillStyle = '#c5d3df';
  ctx.beginPath(); ctx.arc(F.x + F.ancho / 2, F.y + 100, 50, 0, Math.PI * 2); ctx.fill(); // cabeza
  ctx.beginPath(); ctx.ellipse(F.x + F.ancho / 2, F.y + F.alto + 20, 95, 90, 0, Math.PI, 0); ctx.fill(); // hombros
  ctx.restore();

  // Datos a la derecha de la foto
  const X = F.x + F.ancho + 40; // donde empiezan los datos
  const anchoDatos = DER - X; // espacio disponible
  let y = 412; // la "y" va bajando según pintamos
  ctx.fillStyle = GRIS;
  ctx.font = mono(600, 22);
  ctx.fillText('CARGO', X, y);
  ctx.fillStyle = TEXTO;
  ctx.font = inter(800, 44);
  partirEnLineas(ctx, arquetipo.titulo, anchoDatos).forEach((linea) => {
    y += 50; // baja una línea
    ctx.fillText(linea, X, y);
  });
  y += 56;
  ctx.fillStyle = GRIS;
  ctx.font = mono(600, 22);
  ctx.fillText('NIVEL CORPORATIVO', X, y);
  y += 86;
  ctx.fillStyle = AZUL;
  ctx.font = mono(700, 88);
  ctx.fillText(`${porcentaje}%`, X - 4, y);

  // Sello "CONFIDENCIAL" torcido encima de la foto
  ctx.save();
  ctx.translate(F.x + F.ancho / 2, F.y + F.alto - 40); // nos colocamos en la parte baja de la foto
  ctx.rotate(-0.22); // lo torcemos (unos -12 grados)
  ctx.font = mono(700, 28);
  const anchoSello = ctx.measureText('CONFIDENCIAL').width + 36; // ancho del texto + margen
  ctx.strokeStyle = '#b4232c'; // rojo tinta
  ctx.lineWidth = 4;
  ctx.strokeRect(-anchoSello / 2, -26, anchoSello, 52); // marco exterior
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-anchoSello / 2 + 6, -20, anchoSello - 12, 40); // marco interior (doble línea)
  ctx.fillStyle = '#b4232c';
  ctx.textAlign = 'center';
  ctx.fillText('CONFIDENCIAL', 0, 10);
  ctx.restore();

  // Escala de 6 tramos, de lado a lado
  y = Math.max(y, F.y + F.alto) + 60; // debajo de lo que sea más alto: foto o datos
  const TRAMO = (DER - IZQ - 5 * 10) / 6; // ancho de cada tramo
  for (let n = 0; n < 6; n++) {
    const color = n <= posicion ? AZUL : 'rgba(22, 125, 183, 0.18)'; // lleno o vacío
    pastillaRect(ctx, IZQ + n * (TRAMO + 10), y, TRAMO, 14, 3, color);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = GRIS;
  ctx.font = inter(500, 26);
  y += 54;
  ctx.fillText(`Nivel ${posicion + 1} de 6 · ${arquetipo.nivelLabel}`, IZQ, y);
  ctx.fillStyle = AZUL;
  ctx.font = mono(700, 22);
  y += 40;
  ctx.fillText(arquetipo.estado, IZQ, y);

  // Sellos: una fila de insignias redondas, solo con el emoji (naranja = normal, rojo = secreto)
  const insignias = [...sellos, ...secretos.slice(0, 1)]; // los 5 sellos + el primer secreto, si hay
  const D = 90; // diámetro de cada insignia
  const HUECO_I = 18; // separación entre insignias
  y += 64;
  ctx.textAlign = 'left';
  ctx.fillStyle = GRIS;
  ctx.font = mono(600, 20);
  ctx.fillText(`SELLOS · ${sellos.length}${secretos.length ? ` + ${secretos.length} SECRETO${secretos.length > 1 ? 'S' : ''}` : ''}`, IZQ, y);
  y += 24;
  insignias.forEach((sello, n) => {
    const cx = IZQ + D / 2 + n * (D + HUECO_I); // centro de la insignia
    const cy = y + D / 2;
    const secreto = n >= sellos.length; // las que van después de los 5 normales son secretas
    ctx.beginPath();
    ctx.arc(cx, cy, D / 2 - 2, 0, Math.PI * 2); // círculo
    ctx.fillStyle = secreto ? '#fdf3f3' : '#ffffff';
    ctx.fill();
    ctx.setLineDash(secreto ? [] : [7, 5]); // normal: punteado · secreto: continuo
    ctx.lineWidth = 3;
    ctx.strokeStyle = secreto ? '#b4232c' : NARANJA;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = inter(400, 44);
    ctx.textAlign = 'center';
    ctx.fillText(sello.emoji, cx, cy + 15); // el emoji en el centro
  });

  // Código de barras y número de expediente, abajo de la tarjeta
  const yBarras = T.y + T.alto - 100; // a 100 px del borde de abajo
  let xb = IZQ; // donde va la siguiente raya
  ctx.fillStyle = TEXTO;
  `${expediente}${porcentaje}${posicion}7319`.repeat(3).split('').forEach((cifra) => { // el dibujo depende del expediente (repetido para que sea largo)
    const grosor = 2 + (Number(cifra) % 3) * 2; // rayas de 2, 4 o 6 px
    ctx.fillRect(xb, yBarras, grosor, 56);
    xb += grosor + 4 + (Number(cifra) % 2) * 3; // hueco entre rayas
  });
  ctx.textAlign = 'right';
  ctx.fillStyle = TEXTO;
  ctx.font = mono(700, 24);
  ctx.fillText(`EXP. Nº ${expediente}`, DER, yBarras + 24);
  ctx.fillStyle = GRIS;
  ctx.font = mono(600, 20);
  ctx.fillText(fechaHoy(), DER, yBarras + 54);

  // Pie, fuera de la tarjeta
  ctx.textAlign = 'center';
  ctx.fillStyle = TEXTO;
  ctx.font = inter(700, 34);
  ctx.fillText(`Haz el test aquí: ${ENLACE_CORTO}`, CENTRO, ALTO - 68);
  ctx.fillStyle = GRIS;
  ctx.font = inter(500, 24);
  ctx.fillText('Un proyecto de Tania de Azevedo', CENTRO, ALTO - 28);

  return lienzo.toDataURL('image/png'); // la imagen lista para mostrar o descargar
};
