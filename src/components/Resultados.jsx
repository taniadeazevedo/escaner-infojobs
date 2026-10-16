// ======================
// PANTALLA DE RESULTADOS
// ======================
import React, { useEffect, useState } from 'react';
import { ARQUETIPOS, ESCALA, INFOJOBS_LINKS } from '../data/arquetipos.js';
import { SECRETOS } from '../data/secretos.js';
import { calcularResultado } from '../lib/puntuacion.js';
import { crearEnlace, crearReto, enlaceLinkedIn, fechaHoy, generarTarjeta, numeroExpediente } from '../lib/compartir.js';
import { anadirAColeccion } from '../lib/memoria.js';
import { Barra, useContador, vibrar } from './Medidor.jsx';

// Compara tu resultado con el de quien te retó
const compararCon = (rival, respuestas, porcentaje) => {
  const suyo = calcularResultado(rival.respuestas); // su resultado completo
  const quien = rival.nombre || 'Tu rival'; // su nombre, o uno genérico
  const diferencia = suyo.porcentaje - porcentaje; // positivo = más corporativo que tú
  const coinciden = rival.respuestas.filter((opcion, i) => opcion === respuestas[i]).length; // respuestas iguales
  let veredicto = 'Empate exacto. RRHH os quiere en el mismo equipo.'; // si sacáis lo mismo
  if (diferencia > 0) veredicto = `${quien} está ${diferencia} puntos más dentro del sistema que tú.`;
  if (diferencia < 0) veredicto = `Estás ${-diferencia} puntos más dentro del sistema que ${quien}.`;
  return { suyo, quien, veredicto, coinciden };
};

// resultado: lo que devuelve calcularResultado · respuestas: las 15 opciones elegidas
// extras: secretos de cómo has jugado · ajeno: true si has abierto el enlace de otra persona
// rival: { respuestas, nombre } si vienes de un reto · alRepetir: vuelve a empezar el test
export const Resultados = ({ resultado, respuestas, extras, ajeno, rival, alRepetir }) => {
  const { arquetipo, posicion, porcentaje, perfil, metricas, sellos, secretos } = resultado; // sacamos cada dato
  const contador = useContador(porcentaje); // el % que sube desde 0
  const [barras, setBarras] = useState(false); // false = barras a 0; true = barras en su valor (para animarlas)
  const [tarjeta, setTarjeta] = useState(null); // la imagen para compartir
  const [copiado, setCopiado] = useState(false); // ¿se acaba de copiar el enlace?
  const [coleccion, setColeccion] = useState(null); // arquetipos y secretos conseguidos en este navegador
  const [nombre, setNombre] = useState(''); // tu nombre para el enlace de reto
  const [retoCopiado, setRetoCopiado] = useState(false); // ¿se acaba de copiar el reto?
  const enlace = crearEnlace(respuestas, extras); // enlace a este resultado
  const expediente = numeroExpediente(respuestas); // nº de expediente (el mismo para el mismo resultado)
  const duelo = rival ? compararCon(rival, respuestas, porcentaje) : null; // comparación si vienes de un reto

  useEffect(() => {
    const t = setTimeout(() => setBarras(true), 150); // un instante después, las barras crecen
    generarTarjeta(resultado, expediente).then(setTarjeta).catch(() => setTarjeta(null)); // dibuja la tarjeta; si falla, no se muestra
    return () => clearTimeout(t); // limpieza
  }, [resultado, expediente]);

  // Solo con tu propio resultado: vibración del "tampón" y guardar en tu colección
  useEffect(() => {
    if (ajeno) return; // el resultado de otra persona no cuenta
    vibrar([30, 50, 80]); // tres golpes cortos
    setColeccion(anadirAColeccion(arquetipo.id, secretos.map((s) => s.id))); // lo apunta y devuelve la colección
  }, [ajeno, arquetipo, secretos]);

  // Crea el enlace de reto y lo comparte (móvil) o lo copia (ordenador)
  const retar = async () => {
    const url = crearReto(respuestas, nombre.trim()); // enlace con tus respuestas y tu nombre
    try {
      if (navigator.share) { // en móviles: menú de compartir del sistema
        await navigator.share({ title: 'Escáner de Compatibilidad Laboral', text: '¿Cuánto te ha absorbido la empresa? Yo ya lo sé. Te reto:', url });
        return;
      }
      await navigator.clipboard.writeText(url); // en ordenador: lo copia
      setRetoCopiado(true); // cambia el texto del botón
      setTimeout(() => setRetoCopiado(false), 2500); // y lo devuelve
    } catch (error) {
      if (error?.name !== 'AbortError') window.prompt('Copia tu enlace de reto:', url); // AbortError = cerraste el menú, no es un fallo
    }
  };

  // Roles y enlace de InfoJobs según el perfil (el híbrido ve los dos)
  const roles = perfil === 'hibrido'
    ? `${arquetipo.roles_creativo}, ${arquetipo.roles_analitico}` // creativos + analíticos
    : arquetipo[`roles_${perfil}`]; // roles_creativo o roles_analitico
  const ofertas = INFOJOBS_LINKS[`${arquetipo.id}_${perfil === 'hibrido' ? 'creativo' : perfil}`]; // el híbrido usa el enlace creativo
  const nombrePerfil = { creativo: 'Creativo', analitico: 'Analítico', hibrido: 'Híbrido' }[perfil]; // texto bonito

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace); // copia el enlace al portapapeles
      setCopiado(true); // cambia el texto del botón
      setTimeout(() => setCopiado(false), 2000); // y lo devuelve a los 2 segundos
    } catch {
      window.prompt('Copia tu enlace:', enlace); // si el navegador no deja copiar, lo enseña para copiarlo a mano
    }
  };

  return (
    <section className="pantalla resultados">
      {/* 0 · RESULTADO DEL RETO (solo si vienes de un enlace de reto) */}
      {duelo && (
        <div className="duelo">
          <span className="etiqueta">Resultado del reto</span>
          <div className="duelo__marcador">
            <div className="duelo__lado duelo__lado--tuyo">{/* tú */}
              <span className="etiqueta">Tú</span>
              <strong>{porcentaje}%</strong>
              <span className="nota">{arquetipo.corto}</span>
            </div>
            <span className="duelo__vs">vs</span>
            <div className="duelo__lado">{/* quien te retó */}
              <span className="etiqueta">{duelo.quien}</span>
              <strong>{duelo.suyo.porcentaje}%</strong>
              <span className="nota">{duelo.suyo.arquetipo.corto}</span>
            </div>
          </div>
          <p className="duelo__veredicto">{duelo.veredicto}</p>
          <p className="nota">Coincidís en {duelo.coinciden} de 15 respuestas.</p>
        </div>
      )}

      {/* 1 · EL INFORME: una hoja de expediente con el resultado */}
      <article className="informe">
        <header className="informe__cabecera">{/* membrete del documento */}
          <span>Informe de compatibilidad laboral</span>
          <span>Exp. nº {expediente} · {fechaHoy()}</span>
        </header>

        <div className="informe__cuerpo">
          <span className="sello-confidencial" aria-hidden="true">Confidencial</span>{/* sello rojo torcido */}
          <span className="etiqueta">{ajeno ? 'Resultado compartido' : 'Arquetipo asignado'}</span>
          <h1 className="titulo titulo--revelado">{arquetipo.titulo}</h1>
          <p className="texto">{arquetipo.subtitulo}</p>

          <div className="numero-grande">{contador}%</div>{/* sube de 0 al valor final */}
          <ol className="escala" aria-label={`Nivel ${posicion + 1} de 6`}>{/* 6 tramos: se rellenan hasta el tuyo */}
            {ESCALA.map((tramo, n) => (
              <li
                key={tramo.id}
                title={ARQUETIPOS[tramo.id].titulo} // al pasar el ratón se ve qué arquetipo es
                className={`escala__tramo ${barras && n <= posicion ? 'escala__tramo--lleno' : ''}`}
              />
            ))}
          </ol>

          <dl className="ficha">{/* campos del expediente: etiqueta a la izquierda, dato a la derecha */}
            <div><dt>Nivel corporativo</dt><dd>{posicion + 1} de 6 · {arquetipo.nivelLabel}</dd></div>
            <div><dt>Estado</dt><dd>{arquetipo.estado}</dd></div>
            <div><dt>Perfil</dt><dd>{nombrePerfil}</dd></div>
          </dl>

          <div className="observaciones">
            <span className="etiqueta">Observaciones</span>
            <p className="diagnostico">{arquetipo.mensaje}</p>
            <ul className="lista">
              {arquetipo.rasgos.map((rasgo) => <li key={rasgo}>{rasgo}</li>)}
            </ul>
          </div>
        </div>
      </article>

      {/* 2 · SELLOS: los 5 logros + los secretos encontrados */}
      <div className="bloque">
        <h3 className="seccion">Sellos desbloqueados</h3>
        <ul className="sellos">
          {sellos.map((sello, n) => (
            <li key={sello.texto} className="sello sello--chip" style={{ animationDelay: `${n * 0.12}s` }}>
              <span className="sello__emoji">{sello.emoji}</span>
              <span className="sello__texto">{sello.texto}</span>
            </li>
          ))}
          {secretos.map((secreto, n) => (
            <li key={secreto.id} className="sello sello--chip sello--secreto" style={{ animationDelay: `${(sellos.length + n) * 0.12}s` }}>
              <span className="sello__emoji">{secreto.emoji}</span>
              <span className="sello__texto">{secreto.texto}</span>
              <span className="sello__marca">Secreto</span>{/* etiqueta "secreto" */}
            </li>
          ))}
        </ul>
        {!ajeno && coleccion && (
          <p className="nota nota--centrada">
            🔒 Sellos secretos encontrados: {coleccion.secretos.length} de {SECRETOS.length}
            {coleccion.secretos.length < SECRETOS.length && '. Hay más escondidos según cómo respondas y cómo juegues.'}
          </p>
        )}
      </div>

      {/* 3 · DIMENSIONES: plegadas, solo las ve quien quiera el detalle */}
      <details className="detalle">
        <summary>Ver análisis por dimensiones</summary>{/* al pulsar se despliega */}
        {metricas.map((metrica) => (
          <div key={metrica.nombre} className="metrica">
            <div className="metrica__fila">
              <span>{metrica.nombre}</span>
              <strong>{metrica.valor}%</strong>
            </div>
            <Barra valor={metrica.valor} />
          </div>
        ))}
      </details>

      {/* 4 · ROLES + OFERTAS: la única caja destacada */}
      <div className="caja caja--naranja">
        <h3 className="seccion">Roles que encajan contigo</h3>
        <p className="roles">{roles}</p>
        <p className="nota nota--cursiva">{arquetipo.nota}</p>
        <a className="boton boton--naranja" href={ofertas} target="_blank" rel="noopener noreferrer">
          Ver ofertas en InfoJobs&nbsp;→
        </a>
      </div>

      {/* 5 · COMPARTIR (o invitar a hacer el test si el resultado es de otra persona) */}
      {ajeno ? (
        <div className="bloque bloque--centrado">
          <h3 className="seccion">¿Y tú qué arquetipo eres?</h3>
          <button className="boton boton--azul" onClick={alRepetir}>Hacer el test →</button>
        </div>
      ) : (
        <div className="bloque">
          <h3 className="seccion">Comparte tu acreditación</h3>
          <div className="compartir">{/* tarjeta a un lado, botones al otro (en móvil, uno encima de otro) */}
            {tarjeta && <img className="tarjeta" src={tarjeta} alt={`Acreditación: ${arquetipo.titulo}, ${porcentaje}% corporativo`} />}
            <div className="acciones">
              {tarjeta && (
                <a className="boton boton--azul" href={tarjeta} download={`acreditacion-${arquetipo.id}.png`}>
                  Descargar tarjeta{/* "download" hace que el enlace descargue la imagen */}
                </a>
              )}
              <a className="boton boton--linea" href={enlaceLinkedIn(enlace)} target="_blank" rel="noopener noreferrer">
                Compartir en LinkedIn
              </a>
              <button className="boton boton--linea" onClick={copiar}>
                {copiado ? '¡Enlace copiado!' : 'Copiar enlace'}
              </button>
            </div>
          </div>

          <div className="reto">{/* RETAR A ALGUIEN */}
            <h3 className="seccion">Reta a un compañero</h3>
            <p className="nota">Recibe un enlace, hace el test y al final ve quién de los dos está más dentro del sistema.</p>
            <div className="reto__fila">
              <input
                className="campo"
                type="text"
                maxLength={20} // como mucho 20 letras
                placeholder="Tu nombre (opcional)"
                aria-label="Tu nombre para el reto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)} // guarda lo que escribes
              />
              <button className="boton boton--naranja" onClick={retar}>
                {retoCopiado ? '¡Reto copiado!' : 'Crear reto'}
              </button>
            </div>
          </div>

          {coleccion && (
            <div className="coleccion">{/* TU COLECCIÓN DE ARQUETIPOS */}
              <h3 className="seccion">Tu colección · {coleccion.arquetipos.length} de 6 arquetipos</h3>
              <ol className="coleccion__lista">
                {ESCALA.map((tramo) => {
                  const tuyo = coleccion.arquetipos.includes(tramo.id); // ¿ya lo has sacado alguna vez?
                  return (
                    <li key={tramo.id} className={`coleccion__pieza ${tuyo ? 'coleccion__pieza--tuya' : ''}`}>
                      {tuyo ? ARQUETIPOS[tramo.id].corto : '???'}{/* los que faltan, ocultos */}
                    </li>
                  );
                })}
              </ol>
              <button className="enlace" onClick={alRepetir}>Repetir test</button>
            </div>
          )}
        </div>
      )}

      {/* SOBRE LA CREADORA */}
      <footer className="creadora">
        <h3 className="seccion">Sobre este proyecto</h3>
        <img className="creadora__foto" src="/tania-bio.jpeg" alt="Tania de Azevedo" />
        <h4 className="titulo titulo--pequeno">Tania de Azevedo</h4>
        <p className="texto">Especialista en Branding y Diseño Web<br />enfocada en crear productos que conectan.</p>
        <a className="boton boton--azul" href="https://taniadeazevedo.es/" target="_blank" rel="noopener noreferrer">
          Descubre mi portfolio
        </a>
        <p className="nota">Proyecto personal de portfolio. No es un producto oficial de InfoJobs.</p>
      </footer>
    </section>
  );
};
