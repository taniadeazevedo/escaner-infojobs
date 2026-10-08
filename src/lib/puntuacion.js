// ======================
// CÁLCULO DEL RESULTADO
// ======================
// Todo sale de una sola cosa: "respuestas", una lista con la opción elegida
// (0, 1, 2 o 3) en cada una de las 15 preguntas. Ej: [2, 0, 1, 3, ...]

import { BLOQUES } from '../data/bloques.js'; // las preguntas
import { ARQUETIPOS, ESCALA } from '../data/arquetipos.js'; // los 6 resultados y sus límites

export const PREGUNTAS = BLOQUES.flatMap((bloque) => bloque.preguntas); // las 15 preguntas seguidas, sin bloques
export const TOTAL = PREGUNTAS.length; // 15

// Pasa una nota media (de 1 a 4) a porcentaje (de 0 a 100)
const aPorcentaje = (media) => Math.round(((media - 1) / 3) * 100); // 1 -> 0%, 2.5 -> 50%, 4 -> 100%

// Media de una lista de números (0 si está vacía)
const media = (lista) => (lista.length ? lista.reduce((a, b) => a + b, 0) / lista.length : 0);

// Devuelve los valores "v" de las preguntas corporativas ya respondidas, desde la pregunta "desde" hasta "hasta"
const valoresCorporativos = (respuestas, desde = 0, hasta = TOTAL) =>
  respuestas
    .map((opcion, i) => ({ pregunta: PREGUNTAS[i], opcion, i })) // junta cada respuesta con su pregunta
    .filter(({ pregunta, i }) => pregunta.tipo === 'corporativo' && i >= desde && i < hasta) // solo las corporativas del tramo
    .map(({ pregunta, opcion }) => pregunta.r[opcion].v); // nos quedamos con su valor de 1 a 4

// Nivel corporativo (0-100) con las respuestas que haya hasta ahora. null si aún no hay ninguna corporativa.
// Lo usa el medidor en vivo durante el test.
export const nivelCorporativo = (respuestas) => {
  const valores = valoresCorporativos(respuestas); // valores de 1 a 4 respondidos
  return valores.length ? aPorcentaje(media(valores)) : null; // sin respuestas no hay nivel
};

// Sello (logro) que se gana en un bloque ya terminado
export const selloDeBloque = (respuestas, numBloque) => {
  const valores = valoresCorporativos(respuestas, numBloque * 3, numBloque * 3 + 3); // las 2 corporativas de ese bloque
  const tipo = media(valores) > 2.5 ? 'alto' : 'bajo'; // por encima de la mitad = sello corporativo
  return BLOQUES[numBloque].sellos[tipo]; // { emoji, texto }
};

// Perfil: creativo, analítico o híbrido, según las 5 preguntas de perfil
const calcularPerfil = (respuestas) => {
  const cuenta = { creativo: 0, analitico: 0 }; // solo contamos estos dos; "hibrido" y "neutro" no suman
  respuestas.forEach((opcion, i) => {
    const perfil = PREGUNTAS[i].r[opcion].perfil; // undefined en las preguntas corporativas
    if (perfil in cuenta) cuenta[perfil] += 1; // suma 1 al perfil elegido
  });
  if (cuenta.creativo > cuenta.analitico) return 'creativo'; // gana creativo
  if (cuenta.analitico > cuenta.creativo) return 'analitico'; // gana analítico
  return 'hibrido'; // empate
};

// Resultado completo del test (necesita las 15 respuestas)
export const calcularResultado = (respuestas) => {
  const notaMedia = media(valoresCorporativos(respuestas)); // media de 1 a 4 de las 10 preguntas corporativas
  const posicion = ESCALA.findIndex((tramo) => notaMedia <= tramo.hasta); // en qué tramo de la escala cae

  return {
    arquetipo: ARQUETIPOS[ESCALA[posicion].id], // el arquetipo que te toca
    posicion, // 0 (el menos corporativo) a 5 (Entidad corporativa)
    porcentaje: aPorcentaje(notaMedia), // nivel corporativo de 0 a 100
    perfil: calcularPerfil(respuestas), // creativo, analitico o hibrido
    metricas: BLOQUES.map((bloque, n) => ({
      nombre: bloque.metrica, // nombre de la barra
      valor: aPorcentaje(media(valoresCorporativos(respuestas, n * 3, n * 3 + 3))) // % de ese bloque
    })),
    sellos: BLOQUES.map((_, n) => selloDeBloque(respuestas, n)) // los 5 logros
  };
};
