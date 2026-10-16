// ======================
// APP: decide qué pantalla se ve y guarda las respuestas
// ======================
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ARQUETIPOS, ESCALA } from './data/arquetipos.js';
import { calcularResultado, posicionParcial, TOTAL } from './lib/puntuacion.js';
import { leerEnlace, limpiarEnlace } from './lib/compartir.js';
import { borrarProgreso, guardarProgreso, leerProgreso } from './lib/memoria.js';
import { Analizando, Aviso, Cabecera, Hero, Pregunta, Transicion } from './components/Pantallas.jsx';
import { Resultados } from './components/Resultados.jsx';

const AVANCE_MS = 1200; // lo que se ve la reacción del escáner antes de pasar sola a la siguiente pregunta

const App = () => {
  const [enlace] = useState(leerEnlace); // lo que venga en la dirección (?r= o ?reto=), o null. Solo se lee una vez.
  const verResultado = enlace?.modo === 'resultado'; // ¿han abierto el resultado de otra persona?

  const [guardado, setGuardado] = useState(() => (enlace ? null : leerProgreso())); // test a medias de otra visita
  const [ajeno, setAjeno] = useState(verResultado); // true = estás viendo el resultado de un enlace
  const [rival, setRival] = useState(enlace?.modo === 'reto' ? enlace : null); // quien te ha retado: { respuestas, nombre }
  const [pantalla, setPantalla] = useState(verResultado ? 'RESULTADOS' : 'HERO'); // HERO, PREGUNTAS, TRANSICION, ANALIZANDO o RESULTADOS
  const [respuestas, setRespuestas] = useState(verResultado ? enlace.respuestas : []); // opciones confirmadas, una por pregunta
  const [extras, setExtras] = useState(verResultado ? enlace.extras : []); // secretos de "cómo juegas" (tiempo, atrás)
  const [seleccion, setSeleccion] = useState(null); // opción marcada en la pregunta actual
  const [pendiente, setPendiente] = useState(false); // true = se acaba de tocar una opción y va a avanzar sola
  const [inicio, setInicio] = useState(null); // momento en que empezó el test (para los secretos de tiempo)
  const [reanudado, setReanudado] = useState(false); // si se continuó un test de otra visita, el tiempo no cuenta
  const [vueltas, setVueltas] = useState(0); // cuántas veces se ha pulsado "atrás"
  const [aviso, setAviso] = useState(null); // aviso de ascenso o bajada de nivel

  // El resultado solo se calcula cuando están las 15 respuestas (useMemo: no lo recalcula en cada pintado)
  const resultado = useMemo(
    () => (respuestas.length === TOTAL ? calcularResultado(respuestas, extras) : null),
    [respuestas, extras]
  );

  // Mientras se responde, guarda por dónde vas (por si cierras la pestaña)
  useEffect(() => {
    if (pantalla === 'PREGUNTAS' || pantalla === 'TRANSICION') guardarProgreso(respuestas, inicio);
  }, [pantalla, respuestas, inicio]);

  // El aviso de nivel desaparece solo
  useEffect(() => {
    if (!aviso) return; // no hay aviso
    const t = setTimeout(() => setAviso(null), 2600); // a los 2,6 s se quita
    return () => clearTimeout(t); // limpieza
  }, [aviso]);

  // Empieza el test desde cero
  const empezar = () => {
    borrarProgreso(); // olvida cualquier test a medias
    setGuardado(null);
    setRespuestas([]);
    setExtras([]);
    setSeleccion(null);
    setPendiente(false);
    setVueltas(0);
    setReanudado(false);
    setInicio(Date.now()); // pone el cronómetro en marcha
    setPantalla('PREGUNTAS');
    window.scrollTo(0, 0); // sube arriba del todo
  };

  // Sigue el test que se quedó a medias
  const continuar = () => {
    setRespuestas(guardado.respuestas); // recupera las respuestas
    setInicio(guardado.inicio);
    setReanudado(true); // el tiempo ya no es fiable
    setGuardado(null);
    setPantalla('PREGUNTAS');
  };

  // Confirma la opción marcada y decide a dónde ir
  const siguiente = useCallback(() => {
    if (seleccion === null) return; // sin opción marcada no hace nada
    const nuevas = [...respuestas, seleccion]; // añade la respuesta a la lista

    const antes = posicionParcial(respuestas); // tramo de la escala antes de esta respuesta
    const despues = posicionParcial(nuevas); // y después
    if (antes !== null && despues !== antes) { // si ha cambiado de tramo, avisamos
      setAviso({ sube: despues > antes, texto: ARQUETIPOS[ESCALA[despues].id].titulo, id: Date.now() });
    }

    setRespuestas(nuevas); // la guarda
    setSeleccion(null); // la siguiente pregunta empieza sin nada marcado
    setPendiente(false);

    if (nuevas.length === TOTAL) { // era la última
      const segundos = (Date.now() - inicio) / 1000; // lo que ha durado el test
      const ganados = []; // secretos de cómo has jugado
      if (!reanudado && segundos < 45) ganados.push('speedrun'); // muy rápido
      if (!reanudado && segundos > 180) ganados.push('contrato'); // muy lento
      if (vueltas >= 3) ganados.push('atras'); // muchas vueltas atrás
      setExtras(ganados);
      borrarProgreso(); // ya no hay test a medias
      setPantalla('ANALIZANDO'); // suspense
    } else if (nuevas.length % 3 === 0) {
      setPantalla('TRANSICION'); // fin de bloque: sello
    }
  }, [respuestas, seleccion, inicio, reanudado, vueltas]);

  // Al tocar una opción: se marca y, pasado un momento, avanza sola
  const elegir = useCallback((opcion) => {
    setSeleccion(opcion);
    setPendiente(true);
  }, []);

  // Cuenta atrás del avance automático. Si cambias de opción, vuelve a empezar.
  useEffect(() => {
    if (!pendiente) return; // nada que hacer
    const t = setTimeout(siguiente, AVANCE_MS); // pasado el tiempo, confirma
    return () => clearTimeout(t); // si algo cambia antes, se cancela
  }, [pendiente, siguiente]);

  // Vuelve a la pregunta anterior, con su respuesta marcada (sin avanzar sola)
  const atras = useCallback(() => {
    if (!respuestas.length) return; // en la primera no hay "atrás"
    setSeleccion(respuestas[respuestas.length - 1]); // marca lo que respondiste
    setRespuestas(respuestas.slice(0, -1)); // y lo quita de las confirmadas
    setPendiente(false); // no avanza hasta que vuelvas a tocar
    setVueltas((v) => v + 1); // una vuelta atrás más
    setPantalla('PREGUNTAS');
  }, [respuestas]);

  // Vuelve a empezar desde la pantalla de resultados
  const repetir = () => {
    limpiarEnlace(); // quita el ?r= o ?reto= de la dirección
    setAjeno(false); // ya no es un resultado ajeno
    setRival(null); // ni un reto
    empezar(); // directo a la primera pregunta
  };

  const alTerminarAnalisis = useCallback(() => {
    setPantalla('RESULTADOS'); // enseña el resultado
    window.scrollTo(0, 0); // desde arriba
  }, []);

  return (
    <div className="app">
      <Cabecera />{/* fuera del marco: ocupa todo el ancho de la ventana */}
      {aviso && <Aviso key={aviso.id} sube={aviso.sube} texto={aviso.texto} />}{/* key: cada aviso nuevo se anima de nuevo */}
      <main className="marco">{/* la columna central */}
        {pantalla === 'HERO' && (
          <Hero reto={rival} guardado={guardado} alEmpezar={empezar} alContinuar={continuar} />
        )}
        {pantalla === 'PREGUNTAS' && (
          <Pregunta
            respuestas={respuestas}
            seleccion={seleccion}
            pendiente={pendiente}
            alElegir={elegir}
            alAtras={atras}
          />
        )}
        {pantalla === 'TRANSICION' && (
          <Transicion respuestas={respuestas} alContinuar={() => setPantalla('PREGUNTAS')} />
        )}
        {pantalla === 'ANALIZANDO' && <Analizando alTerminar={alTerminarAnalisis} />}
        {pantalla === 'RESULTADOS' && resultado && (
          <Resultados
            resultado={resultado}
            respuestas={respuestas}
            extras={extras}
            ajeno={ajeno}
            rival={rival}
            alRepetir={repetir}
          />
        )}
      </main>
    </div>
  );
};

export default App;
