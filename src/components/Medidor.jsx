// ======================
// PIEZAS PEQUEÑAS QUE SE REPITEN
// ======================
import React, { useEffect, useState } from 'react';

// ¿La persona ha pedido menos animaciones en su sistema? (accesibilidad)
const sinAnimaciones = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hook: devuelve un número que sube poco a poco desde 0 hasta "destino" (efecto contador)
export const useContador = (destino, duracion = 1400) => {
  const [valor, setValor] = useState(sinAnimaciones() ? destino : 0); // sin animaciones, va directo al final

  useEffect(() => {
    if (sinAnimaciones()) { setValor(destino); return; } // nada que animar
    const inicio = performance.now(); // momento en el que empieza
    let id; // identificador del siguiente fotograma, para poder cancelarlo
    const paso = (ahora) => {
      const avance = Math.min((ahora - inicio) / duracion, 1); // de 0 a 1
      const suave = 1 - Math.pow(1 - avance, 3); // frena al final (ease-out)
      setValor(Math.round(destino * suave)); // número que toca en este fotograma
      if (avance < 1) id = requestAnimationFrame(paso); // si no ha acabado, pide otro fotograma
    };
    id = requestAnimationFrame(paso); // arranca la animación
    return () => cancelAnimationFrame(id); // si el componente desaparece, la para
  }, [destino, duracion]);

  return valor;
};

// Barra de progreso con degradado. "valor" va de 0 a 100.
export const Barra = ({ valor, gruesa = false, retraso = 0 }) => (
  <div className={`barra ${gruesa ? 'barra--gruesa' : ''}`}>{/* el fondo claro */}
    <div
      className="barra__relleno" // la parte de color
      style={{ width: `${valor}%`, transitionDelay: `${retraso}s` }} // el ancho es el porcentaje
    />
  </div>
);

// Medidor en vivo del nivel corporativo (se ve mientras respondes)
export const Medidor = ({ nivel }) => (
  <div className="medidor" aria-live="polite">{/* aria-live: los lectores de pantalla avisan cuando cambia */}
    <div className="medidor__fila">
      <span className="etiqueta">Nivel corporativo</span>{/* texto pequeño en mayúsculas */}
      <span className="medidor__numero">{nivel === null ? '—' : `${nivel}%`}</span>{/* raya si aún no hay datos */}
    </div>
    <Barra valor={nivel ?? 0} />{/* ?? 0: si es null, la barra está vacía */}
  </div>
);
