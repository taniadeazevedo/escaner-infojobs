// ======================
// MEMORIA DEL NAVEGADOR (localStorage)
// ======================
// Guarda el test a medias y tu colección de arquetipos y secretos.
// Todo va con try/catch: en modo incógnito puede no haber memoria, y la app debe funcionar igual.

import { TOTAL } from './puntuacion.js'; // 15

const PROGRESO = 'escaner-progreso'; // nombre con el que se guarda el test a medias
const COLECCION = 'escaner-coleccion'; // nombre con el que se guarda la colección

// Lee un dato guardado; si no hay o falla, devuelve "porDefecto"
const leer = (clave, porDefecto) => {
  try {
    const texto = localStorage.getItem(clave); // el dato como texto
    return texto ? JSON.parse(texto) : porDefecto; // texto -> objeto
  } catch {
    return porDefecto; // sin memoria o dato roto
  }
};

// Guarda un dato; si falla, no pasa nada
const escribir = (clave, valor) => {
  try {
    localStorage.setItem(clave, JSON.stringify(valor)); // objeto -> texto
  } catch {
    // sin memoria disponible: seguimos sin guardar
  }
};

// --- TEST A MEDIAS ---

// Devuelve { respuestas, inicio } si hay un test empezado y sin terminar; si no, null
export const leerProgreso = () => {
  const progreso = leer(PROGRESO, null); // lo guardado
  const respuestas = progreso?.respuestas; // la lista de respuestas, si existe
  const valido = Array.isArray(respuestas) // tiene que ser una lista...
    && respuestas.length > 0 && respuestas.length < TOTAL // ...empezada pero sin terminar...
    && respuestas.every((n) => Number.isInteger(n) && n >= 0 && n <= 3); // ...y con opciones de 0 a 3
  return valido ? progreso : null;
};

export const guardarProgreso = (respuestas, inicio) => escribir(PROGRESO, { respuestas, inicio }); // guarda por dónde vas
export const borrarProgreso = () => escribir(PROGRESO, null); // olvida el test a medias

// --- COLECCIÓN ---

// { arquetipos: ['rebelde', ...], secretos: ['speedrun', ...] }
export const leerColeccion = () => {
  const coleccion = leer(COLECCION, null); // lo guardado
  return {
    arquetipos: Array.isArray(coleccion?.arquetipos) ? coleccion.arquetipos : [], // arquetipos conseguidos
    secretos: Array.isArray(coleccion?.secretos) ? coleccion.secretos : [] // secretos encontrados
  };
};

// Añade un arquetipo y unos secretos a la colección y devuelve la colección nueva
export const anadirAColeccion = (arquetipoId, secretosIds) => {
  const antes = leerColeccion(); // lo que ya había
  const nueva = {
    arquetipos: [...new Set([...antes.arquetipos, arquetipoId])], // Set: sin repetidos
    secretos: [...new Set([...antes.secretos, ...secretosIds])]
  };
  escribir(COLECCION, nueva); // la guarda
  return nueva;
};
