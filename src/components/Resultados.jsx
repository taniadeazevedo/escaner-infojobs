// ======================
// PANTALLA DE RESULTADOS
// ======================
import React, { useEffect, useState } from 'react';
import { ARQUETIPOS, ESCALA, INFOJOBS_LINKS } from '../data/arquetipos.js';
import { crearEnlace, enlaceLinkedIn, generarTarjeta } from '../lib/compartir.js';
import { Barra, useContador } from './Medidor.jsx';

// resultado: lo que devuelve calcularResultado · respuestas: las 15 opciones elegidas
// ajeno: true si has abierto el enlace de otra persona · alRepetir: vuelve a empezar el test
export const Resultados = ({ resultado, respuestas, ajeno, alRepetir }) => {
  const { arquetipo, posicion, porcentaje, perfil, metricas, sellos } = resultado; // sacamos cada dato
  const contador = useContador(porcentaje); // el % que sube desde 0
  const [barras, setBarras] = useState(false); // false = barras a 0; true = barras en su valor (para animarlas)
  const [tarjeta, setTarjeta] = useState(null); // la imagen para compartir
  const [copiado, setCopiado] = useState(false); // ¿se acaba de copiar el enlace?
  const enlace = crearEnlace(respuestas); // enlace a este resultado

  useEffect(() => {
    const t = setTimeout(() => setBarras(true), 150); // un instante después, las barras crecen
    generarTarjeta(resultado).then(setTarjeta).catch(() => setTarjeta(null)); // dibuja la tarjeta; si falla, no se muestra
    return () => clearTimeout(t); // limpieza
  }, [resultado]);

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
      {/* 1 · CABECERA DEL RESULTADO: arquetipo, porcentaje y posición en la escala */}
      <header className="veredicto">
        <span className="etiqueta etiqueta--naranja">
          {ajeno ? 'Resultado compartido' : 'Resultado del escáner'}
        </span>
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
        <p className="nota">Nivel corporativo {posicion + 1} de 6 · {arquetipo.nivelLabel}</p>
        <span className="chapa">{arquetipo.estado}</span>
      </header>

      {/* 2 · DIAGNÓSTICO: el mensaje y los tres rasgos, sin caja */}
      <p className="diagnostico">{arquetipo.mensaje}</p>
      <ul className="lista">
        {arquetipo.rasgos.map((rasgo) => <li key={rasgo}>{rasgo}</li>)}
      </ul>

      {/* 3 · SELLOS: los 5 logros, como tampones */}
      <div className="bloque">
        <h4 className="etiqueta">Sellos desbloqueados</h4>
        <ul className="sellos">
          {sellos.map((sello, n) => (
            <li key={sello.texto} className="sello sello--chip" style={{ animationDelay: `${n * 0.12}s` }}>
              <span className="sello__emoji">{sello.emoji}</span>
              <span className="sello__texto">{sello.texto}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4 · DIMENSIONES: plegadas, solo las ve quien quiera el detalle */}
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

      {/* 5 · ROLES + OFERTAS: la única caja destacada */}
      <div className="caja caja--naranja">
        <h4 className="etiqueta">Roles sugeridos · Perfil {nombrePerfil}</h4>
        <p className="roles">{roles}</p>
        <p className="nota nota--cursiva">{arquetipo.nota}</p>
        <a className="boton boton--naranja" href={ofertas} target="_blank" rel="noopener noreferrer">
          Ver ofertas en InfoJobs&nbsp;→
        </a>
      </div>

      {/* 6 · COMPARTIR (o invitar a hacer el test si el resultado es de otra persona) */}
      {ajeno ? (
        <div className="bloque bloque--centrado">
          <h4 className="titulo titulo--pequeno">¿Y tú qué arquetipo eres?</h4>
          <button className="boton boton--azul" onClick={alRepetir}>Hacer mi escaneo →</button>
        </div>
      ) : (
        <div className="bloque">
          <h4 className="etiqueta">Comparte tu diagnóstico</h4>
          <div className="compartir">{/* tarjeta a un lado, botones al otro (en móvil, uno encima de otro) */}
            {tarjeta && <img className="tarjeta" src={tarjeta} alt={`Tarjeta: ${arquetipo.titulo}, ${porcentaje}% corporativo`} />}
            <div className="acciones">
              {tarjeta && (
                <a className="boton boton--azul" href={tarjeta} download={`mi-arquetipo-${arquetipo.id}.png`}>
                  Descargar tarjeta{/* "download" hace que el enlace descargue la imagen */}
                </a>
              )}
              <a className="boton boton--linea" href={enlaceLinkedIn(enlace)} target="_blank" rel="noopener noreferrer">
                Compartir en LinkedIn
              </a>
              <button className="boton boton--linea" onClick={copiar}>
                {copiado ? '¡Enlace copiado!' : 'Copiar enlace'}
              </button>
              <button className="enlace" onClick={alRepetir}>Repetir test</button>
            </div>
          </div>
        </div>
      )}

      {/* SOBRE LA CREADORA */}
      <footer className="creadora">
        <h3 className="etiqueta">Sobre este proyecto</h3>
        <img className="creadora__foto" src="/tania-bio.jpeg" alt="Tania de Azevedo" />
        <h4 className="titulo titulo--pequeno">Tania de Azevedo</h4>
        <p className="texto">Especialista en Branding y Diseño Web<br />enfocada en crear productos que conectan.</p>
        <a className="boton boton--azul" href="https://taniadeazevedo.es/" target="_blank" rel="noopener noreferrer">
          Descubre mi Portfolio
        </a>
        <p className="nota">Proyecto personal de portfolio. No es un producto oficial de InfoJobs.</p>
      </footer>
    </section>
  );
};
