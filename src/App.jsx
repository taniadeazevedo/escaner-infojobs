// ======================
// APP: decide qué pantalla se ve y guarda las respuestas
// ======================
import React, { useCallback, useMemo, useState } from 'react';
import { calcularResultado, TOTAL } from './lib/puntuacion.js';
import { leerEnlace, limpiarEnlace } from './lib/compartir.js';
import { Analizando, Cabecera, Hero, Pregunta, Transicion } from './components/Pantallas.jsx';
import { Resultados } from './components/Resultados.jsx';

const App = () => {
  const [compartidas] = useState(leerEnlace); // respuestas que vienen en el enlace (?r=...) o null. Solo se lee una vez.
  const [ajeno, setAjeno] = useState(compartidas !== null); // true = estás viendo el resultado de un enlace
  const [pantalla, setPantalla] = useState(compartidas ? 'RESULTADOS' : 'HERO'); // HERO, PREGUNTAS, TRANSICION, ANALIZANDO o RESULTADOS
  const [respuestas, setRespuestas] = useState(compartidas || []); // opciones confirmadas, una por pregunta
  const [seleccion, setSeleccion] = useState(null); // opción marcada en la pregunta actual (aún sin confirmar)

  // El resultado solo se calcula cuando están las 15 respuestas (useMemo: no lo recalcula en cada pintado)
  const resultado = useMemo(
    () => (respuestas.length === TOTAL ? calcularResultado(respuestas) : null),
    [respuestas]
  );

  // Confirma la opción marcada y decide a dónde ir
  const siguiente = useCallback(() => {
    if (seleccion === null) return; // sin opción marcada no hace nada
    const nuevas = [...respuestas, seleccion]; // añade la respuesta a la lista
    setRespuestas(nuevas); // la guarda
    setSeleccion(null); // la siguiente pregunta empieza sin nada marcado
    if (nuevas.length === TOTAL) setPantalla('ANALIZANDO'); // era la última: suspense
    else if (nuevas.length % 3 === 0) setPantalla('TRANSICION'); // fin de bloque: sello
  }, [respuestas, seleccion]);

  // Vuelve a empezar desde cero
  const repetir = () => {
    limpiarEnlace(); // quita el ?r= de la dirección
    setAjeno(false); // ya no es un resultado ajeno
    setRespuestas([]); // borra las respuestas
    setSeleccion(null); // nada marcado
    setPantalla(ajeno ? 'PREGUNTAS' : 'HERO'); // quien viene de un enlace va directo a las preguntas
    window.scrollTo(0, 0); // sube arriba del todo
  };

  const alTerminarAnalisis = useCallback(() => {
    setPantalla('RESULTADOS'); // enseña el resultado
    window.scrollTo(0, 0); // desde arriba
  }, []);

  return (
    <div className="app">
      <Cabecera />{/* fuera del marco: ocupa todo el ancho de la ventana */}
      <main className="marco">{/* la columna central */}
        {pantalla === 'HERO' && <Hero alEmpezar={() => setPantalla('PREGUNTAS')} />}
        {pantalla === 'PREGUNTAS' && (
          <Pregunta respuestas={respuestas} seleccion={seleccion} alElegir={setSeleccion} alSiguiente={siguiente} />
        )}
        {pantalla === 'TRANSICION' && (
          <Transicion respuestas={respuestas} alContinuar={() => setPantalla('PREGUNTAS')} />
        )}
        {pantalla === 'ANALIZANDO' && <Analizando alTerminar={alTerminarAnalisis} />}
        {pantalla === 'RESULTADOS' && resultado && (
          <Resultados resultado={resultado} respuestas={respuestas} ajeno={ajeno} alRepetir={repetir} />
        )}
      </main>
    </div>
  );
};

export default App;
