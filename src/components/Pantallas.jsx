// ======================
// PANTALLAS DEL TEST (todas menos la de resultados)
// ======================
import React, { useEffect, useState } from 'react';
import { BLOQUES, MENSAJES_TRANSICION, REACCIONES, REACCIONES_PERFIL } from '../data/bloques.js';
import { nivelCorporativo, selloDeBloque, PREGUNTAS, TOTAL } from '../lib/puntuacion.js';
import { Medidor } from './Medidor.jsx';

// --- CABECERA: foto × InfoJobs ---
export const Cabecera = () => (
  <nav className="cabecera">
    <img className="cabecera__foto" src="/yo.jpeg" alt="Tania" />{/* foto redonda */}
    <span className="cabecera__por">×</span>
    <span className="cabecera__marca">InfoJobs</span>
  </nav>
);

// --- PORTADA ---
export const Hero = ({ alEmpezar }) => (
  <section className="pantalla pantalla--centrada">
    <span className="chapa">Test satírico · 3 minutos</span>{/* pastilla de arriba */}

    <div className="radar" aria-hidden="true">{/* aria-hidden: es decoración, los lectores la saltan */}
      <div className="radar__barrido" />{/* el haz que gira */}
      <svg width="110" height="110" viewBox="0 0 100 100">{/* el pentágono del centro */}
        <polygon points="50,10 90,35 75,80 25,80 10,35" fill="rgba(22, 125, 183, 0.2)" stroke="#167db7" strokeWidth="2" />
      </svg>
    </div>

    <h1 className="titulo">Escáner de Compatibilidad</h1>
    <p className="texto texto--intro">
      No buscamos tu trabajo soñado. Comprobamos qué sistema laboral es capaz de aguantar tu ADN profesional.
    </p>

    <button className="boton boton--naranja boton--grande" onClick={alEmpezar}>Iniciar Escaneo Táctico</button>
    <p className="nota">15 preguntas · 5 sellos por desbloquear · 1 diagnóstico brutal</p>
  </section>
);

// --- PREGUNTA ---
// respuestas: las ya confirmadas · seleccion: la opción marcada ahora (o null)
export const Pregunta = ({ respuestas, seleccion, alElegir, alSiguiente }) => {
  const indice = respuestas.length; // número de pregunta actual (0 a 14)
  const numBloque = Math.floor(indice / 3); // bloque actual (0 a 4)
  const bloque = BLOQUES[numBloque]; // datos del bloque
  const pregunta = PREGUNTAS[indice]; // datos de la pregunta
  const elegida = seleccion === null ? null : pregunta.r[seleccion]; // la opción marcada, si hay

  // El medidor cuenta también la opción marcada, así se mueve en cuanto tocas
  const nivel = nivelCorporativo(seleccion === null ? respuestas : [...respuestas, seleccion]);

  // Frase del escáner para la opción marcada
  let reaccion = ''; // vacía si no hay nada marcado
  if (elegida && pregunta.tipo === 'perfil') reaccion = REACCIONES_PERFIL[elegida.perfil]; // pregunta de perfil
  else if (elegida) reaccion = REACCIONES[elegida.v][indice % 3]; // corporativa: varía la frase según la pregunta

  // Teclado: 1-4 eligen opción, Enter pasa a la siguiente
  useEffect(() => {
    const alPulsar = (e) => {
      const numero = Number(e.key); // la tecla como número (NaN si no lo es)
      if (numero >= 1 && numero <= pregunta.r.length) alElegir(numero - 1); // teclas 1 a 4
      const enBoton = e.target.tagName === 'BUTTON'; // si el foco está en un botón, Enter ya lo pulsa él solo
      if (e.key === 'Enter' && !enBoton && seleccion !== null) alSiguiente(); // Enter = siguiente
    };
    window.addEventListener('keydown', alPulsar); // empieza a escuchar el teclado
    return () => window.removeEventListener('keydown', alPulsar); // deja de escuchar al salir
  }, [pregunta, seleccion, alElegir, alSiguiente]);

  return (
    <section className="pantalla" key={indice}>{/* key: al cambiar de pregunta se repite la animación de entrada */}
      <div className="progreso">
        <span className="etiqueta" style={{ color: bloque.color }}>
          {bloque.emoji} Bloque {numBloque + 1}/5 · {bloque.nombre}
        </span>
        <span className="etiqueta">{indice + 1}/{TOTAL}</span>{/* pregunta 4/15 */}
      </div>
      <div className="pasos" aria-hidden="true">{/* 15 rayitas, una por pregunta */}
        {PREGUNTAS.map((_, i) => (
          <span key={i} className={`paso ${i < indice ? 'paso--hecho' : ''} ${i === indice ? 'paso--actual' : ''}`} />
        ))}
      </div>

      <Medidor nivel={nivel} />

      <h2 className="pregunta">{pregunta.p}</h2>

      <div className="opciones" role="radiogroup" aria-label="Respuestas">{/* se comporta como un grupo de radios */}
        {pregunta.r.map((opcion, i) => (
          <button
            key={i}
            role="radio" // cada opción es un "radio"
            aria-checked={seleccion === i} // marcada o no, para lectores de pantalla
            className={`opcion ${seleccion === i ? 'opcion--marcada' : ''}`}
            onClick={() => alElegir(i)} // al tocar, la marca
          >
            <span className="opcion__tecla">{i + 1}</span>{/* número de la tecla */}
            <span>{opcion.t}</span>{/* texto de la respuesta */}
          </button>
        ))}
      </div>

      <p className="reaccion" aria-live="polite">{reaccion && `› ${reaccion}`}</p>{/* frase del escáner */}

      <button className="boton boton--azul boton--abajo" onClick={alSiguiente} disabled={seleccion === null}>
        {indice === TOTAL - 1 ? 'Ver mi diagnóstico →' : 'Siguiente →'}{/* en la última cambia el texto */}
      </button>
    </section>
  );
};

// --- TRANSICIÓN ENTRE BLOQUES: aquí se desbloquea el sello ---
export const Transicion = ({ respuestas, alContinuar }) => {
  const hecho = respuestas.length / 3 - 1; // bloque que se acaba de terminar (0 a 3)
  const sello = selloDeBloque(respuestas, hecho); // el logro ganado

  return (
    <section className="pantalla pantalla--centrada">
      <span className="etiqueta" style={{ color: BLOQUES[hecho].color }}>Bloque {hecho + 1} completado</span>

      <div className="sello sello--grande">{/* el logro, con animación de aparecer */}
        <span className="sello__emoji">{sello.emoji}</span>
        <span className="etiqueta">Sello desbloqueado</span>
        <strong className="sello__texto">{sello.texto}</strong>
      </div>

      <p className="texto">{MENSAJES_TRANSICION[hecho]}</p>

      <div className="sellos-mini" aria-label={`${hecho + 1} de 5 sellos`}>{/* los 5 huecos de sellos */}
        {BLOQUES.map((_, n) => (
          <span key={n} className={`sello-mini ${n <= hecho ? 'sello-mini--ganado' : ''}`}>
            {n <= hecho ? selloDeBloque(respuestas, n).emoji : '?'}{/* interrogante si aún no lo tienes */}
          </span>
        ))}
      </div>

      <button className="boton boton--naranja boton--abajo" onClick={alContinuar} autoFocus>
        Bloque {hecho + 2}: {BLOQUES[hecho + 1].nombre} →
      </button>
    </section>
  );
};

// --- PANTALLA DE "ANALIZANDO" (suspense antes del resultado) ---
const TEXTOS_ANALISIS = [
  "Escaneando cinismo operativo...",
  "Calculando tolerancia al corporate bullshit...",
  "Analizando ADN laboral...",
  "Cruzando datos con vacantes de InfoJobs...",
  "Generando arquetipo definitivo..."
];

export const Analizando = ({ alTerminar }) => {
  const [paso, setPaso] = useState(0); // qué frase toca (0 a 4)

  useEffect(() => {
    if (paso === TEXTOS_ANALISIS.length - 1) { // en la última frase...
      const fin = setTimeout(alTerminar, 900); // ...espera un poco y enseña el resultado
      return () => clearTimeout(fin); // limpieza
    }
    const sig = setTimeout(() => setPaso(paso + 1), 700); // cada 0,7 s pasa a la siguiente frase
    return () => clearTimeout(sig); // limpieza
  }, [paso, alTerminar]);

  return (
    <section className="analizando" role="status">{/* role=status: se anuncia como estado de carga */}
      <div className="radar radar--rapido" aria-hidden="true"><div className="radar__barrido" /></div>
      <h3 className="analizando__texto">{TEXTOS_ANALISIS[paso]}</h3>
      <p className="nota">{paso + 1} de {TEXTOS_ANALISIS.length}</p>
    </section>
  );
};
