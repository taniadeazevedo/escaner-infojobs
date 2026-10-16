// ======================
// PANTALLAS DEL TEST (todas menos la de resultados)
// ======================
// Estética de "expediente de RRHH": acreditación en la portada, formulario en las preguntas.
import React, { useEffect, useState } from 'react';
import { BLOQUES, MENSAJES_TRANSICION, REACCIONES, REACCIONES_PERFIL } from '../data/bloques.js';
import { nivelCorporativo, selloDeBloque, PREGUNTAS, TOTAL } from '../lib/puntuacion.js';
import { Medidor, vibrar } from './Medidor.jsx';

// "TIEMPO" -> "Tiempo"
const capitalizar = (texto) => texto.charAt(0) + texto.slice(1).toLowerCase();

// Número con dos cifras: 6 -> "06"
const dosCifras = (n) => String(n).padStart(2, '0');

// --- CABECERA: foto × InfoJobs ---
export const Cabecera = () => (
  <nav className="cabecera">
    <img className="cabecera__foto" src="/yo.jpeg" alt="Tania" />{/* foto redonda */}
    <span className="cabecera__por">×</span>
    <span className="cabecera__marca">InfoJobs</span>
  </nav>
);

// --- ACREDITACIÓN DE EMPLEADO (dibujo de la portada) ---
// invita: nombre de quien te reta, si lo hay
const Acreditacion = ({ invita }) => (
  <div className="acreditacion" aria-hidden="true">{/* decoración: los lectores de pantalla la saltan */}
    <svg className="acreditacion__cinta" viewBox="0 0 120 100" preserveAspectRatio="none">{/* la cinta: dos tiras que bajan desde arriba del todo */}
      <polygon points="0,0 34,0 66,100 48,100" fill="#ff912c" />
      <polygon points="86,0 120,0 72,100 54,100" fill="#e57f1f" />
    </svg>
    <div className="acreditacion__pinza" />{/* la pinza metálica que sujeta la tarjeta */}
    <div className="acreditacion__tarjeta">
      <div className="acreditacion__agujero" />{/* el agujero por donde pasa la cinta */}
      <div className="acreditacion__cabecera">Acreditación · RR. HH.</div>
      <div className="acreditacion__cuerpo">
        <svg className="acreditacion__foto" viewBox="0 0 80 96">{/* silueta sin cara: aún no sabemos quién eres */}
          <rect width="80" height="96" rx="8" fill="#eef3f7" />
          <circle cx="40" cy="38" r="17" fill="#c5d3df" />
          <path d="M8 96 C8 70 24 62 40 62 C56 62 72 70 72 96 Z" fill="#c5d3df" />
        </svg>
        <dl className="acreditacion__datos">{/* campos de la ficha */}
          <dt>Nombre</dt><dd>________</dd>
          <dt>Cargo</dt><dd>Pendiente de escaneo</dd>
          <dt>{invita ? 'Te reta' : 'Nivel'}</dt><dd>{invita || '??%'}</dd>
        </dl>
      </div>
      <div className="acreditacion__barras" />{/* código de barras */}
      <div className="escaner-linea" />{/* la línea láser que recorre la tarjeta */}
    </div>
  </div>
);

// --- PORTADA ---
// reto: { nombre } si te han retado · guardado: { respuestas } si hay un test a medias
export const Hero = ({ reto, guardado, alEmpezar, alContinuar }) => (
  <section className="pantalla pantalla--centrada pantalla--portada">{/* portada: pegada arriba para que la tarjeta cuelgue */}
    <Acreditacion invita={reto ? reto.nombre || 'Alguien' : null} />

    <span className="etiqueta">{reto ? 'Te han retado' : 'Test satírico · 3 minutos'}</span>
    <h1 className="titulo">Escáner de Compatibilidad Laboral</h1>
    {reto ? (
      <p className="texto texto--intro">
        <strong>{reto.nombre || 'Alguien'}</strong> ya ha pasado por el escáner. Su resultado está bajo llave hasta que termines el tuyo.
      </p>
    ) : (
      <p className="texto texto--intro">
        15 situaciones de oficina para medir cuánto te ha absorbido la empresa. Al final: tu arquetipo, tus sellos y ofertas que encajan contigo.
      </p>
    )}

    <button className="boton boton--naranja boton--grande" onClick={alEmpezar}>
      {reto ? 'Aceptar el reto' : 'Empezar el test'}
    </button>
    {guardado && (
      <button className="boton boton--linea" onClick={alContinuar}>
        Seguir por la pregunta {guardado.respuestas.length + 1} de {TOTAL}{/* el test a medias */}
      </button>
    )}
    <p className="nota">15 preguntas · 5 sellos (y alguno secreto) · Sin registro</p>
  </section>
);

// --- PREGUNTA (como un formulario) ---
// respuestas: las ya confirmadas · seleccion: la opción marcada ahora (o null)
// pendiente: true si la opción se acaba de tocar y va a avanzar sola
export const Pregunta = ({ respuestas, seleccion, pendiente, alElegir, alAtras }) => {
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

  // Teclado: 1-4 eligen opción; flecha izquierda o borrar, atrás
  useEffect(() => {
    const alPulsar = (e) => {
      const numero = Number(e.key); // la tecla como número (NaN si no lo es)
      if (numero >= 1 && numero <= pregunta.r.length) alElegir(numero - 1); // teclas 1 a 4
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') alAtras(); // atrás
    };
    window.addEventListener('keydown', alPulsar); // empieza a escuchar el teclado
    return () => window.removeEventListener('keydown', alPulsar); // deja de escuchar al salir
  }, [pregunta, alElegir, alAtras]);

  return (
    <section className="pantalla pantalla--pregunta" key={indice}>{/* key: cada pregunta nueva entra deslizando */}
      <div className="formulario-cabecera">{/* una sola línea de progreso */}
        <span className="etiqueta">Bloque {numBloque + 1} de 5 · {capitalizar(bloque.nombre)}</span>
        <span className="etiqueta">{dosCifras(indice + 1)}/{TOTAL}</span>
      </div>

      <Medidor nivel={nivel} />

      <div>
        <span className="pregunta__num">P.{dosCifras(indice + 1)}</span>{/* número de pregunta, como en un impreso */}
        <h2 className="pregunta">{pregunta.p}</h2>
      </div>

      <div className="opciones" role="radiogroup" aria-label="Respuestas">{/* se comporta como un grupo de radios */}
        {pregunta.r.map((opcion, i) => (
          <button
            key={i}
            role="radio" // cada opción es un "radio"
            aria-checked={seleccion === i} // marcada o no, para lectores de pantalla
            className={`opcion ${seleccion === i ? 'opcion--marcada' : ''} ${seleccion === i && pendiente ? 'opcion--avanzando' : ''}`}
            onClick={() => alElegir(i)} // al tocar, la marca y avanza sola
          >
            <span className="opcion__casilla">{seleccion === i ? '✕' : i + 1}</span>{/* casilla: número, o ✕ si está marcada */}
            <span>{opcion.t}</span>{/* texto de la respuesta */}
          </button>
        ))}
      </div>

      <p className="reaccion" aria-live="polite">{reaccion && `› ${reaccion}`}</p>{/* frase del escáner */}

      <div className="navegacion">{/* abajo: atrás a la izquierda, pista a la derecha */}
        <button className="enlace" onClick={alAtras} disabled={indice === 0}>← Atrás</button>
        <span className="nota">{pendiente ? 'Siguiente…' : seleccion !== null ? 'Toca una respuesta para seguir' : 'Marca una respuesta'}</span>
      </div>
    </section>
  );
};

// --- TRANSICIÓN ENTRE BLOQUES: aquí se desbloquea el sello ---
export const Transicion = ({ respuestas, alContinuar }) => {
  const hecho = respuestas.length / 3 - 1; // bloque que se acaba de terminar (0 a 3)
  const sello = selloDeBloque(respuestas, hecho); // el logro ganado
  useEffect(() => vibrar(40), []); // un toque de vibración al ganar el sello (solo en móviles que lo permiten)

  return (
    <section className="pantalla pantalla--centrada">
      <span className="etiqueta">Bloque {hecho + 1} de 5 completado</span>

      <div className="sello sello--grande">{/* el logro, cae como un tampón */}
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
        Siguiente bloque: {capitalizar(BLOQUES[hecho + 1].nombre)} →
      </button>
    </section>
  );
};

// --- PANTALLA DE "ANALIZANDO" (suspense antes del resultado) ---
const TEXTOS_ANALISIS = [
  "Midiendo tu nivel de cinismo...",
  "Calculando tu tolerancia al humo corporativo...",
  "Comparando con los 6 arquetipos laborales...",
  "Cruzando datos con vacantes de InfoJobs...",
  "Redactando tu informe..."
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
      <div className="documento-mini" aria-hidden="true">{/* una hoja con líneas que se escanea */}
        <span /><span /><span /><span /><span />
        <div className="escaner-linea" />
      </div>
      <span className="etiqueta">Procesando expediente</span>
      <h3 className="analizando__texto">{TEXTOS_ANALISIS[paso]}</h3>
      <div className="analizando__barra">{/* barra de avance */}
        <div style={{ width: `${((paso + 1) / TEXTOS_ANALISIS.length) * 100}%` }} />
      </div>
    </section>
  );
};

// --- AVISO DE ASCENSO O BAJADA (aparece arriba un momento) ---
export const Aviso = ({ sube, texto }) => (
  <div className={`aviso ${sube ? 'aviso--sube' : 'aviso--baja'}`} role="status">{/* role=status: se anuncia sin interrumpir */}
    <span className="aviso__flecha">{sube ? '⬆' : '⬇'}</span>
    <span>
      <span className="aviso__tipo">{sube ? 'Asciendes a' : 'Bajas a'}</span>{/* línea pequeña */}
      <strong>{texto}</strong>{/* el arquetipo nuevo */}
    </span>
  </div>
);
