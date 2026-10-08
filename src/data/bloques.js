// ======================
// PREGUNTAS DEL TEST
// ======================
// 5 bloques x 3 preguntas = 15 preguntas.
// En cada bloque hay 2 preguntas "corporativo" (puntúan de 1 a 4 con "v")
// y 1 pregunta "perfil" (solo dice si eres creativo o analítico; NO puntúa).
// Las respuestas están desordenadas a propósito para que no se adivine cuál puntúa más.

export const BLOQUES = [
  {
    id: 1,
    nombre: "BIENESTAR",
    metrica: "Tolerancia al salario emocional", // nombre de la barra de este bloque (más alto = más corporativo)
    sellos: { // logro que se desbloquea al terminar el bloque
      bajo: { emoji: "🍎", texto: "Inmune a la fruta gratis" }, // si respondes poco corporativo
      alto: { emoji: "🍌", texto: "Fan del salario emocional" }  // si respondes muy corporativo
    },
    emoji: "💼",
    color: "#ff912c",
    preguntas: [
      {
        p: "La oferta dice: 'salario competitivo + fruta fresca los martes'. ¿Qué entiendes?",
        tipo: "corporativo",
        r: [
          { t: "Que cobraré en plátanos. Al menos llevan potasio.", v: 2 },
          { t: "Que se preocupan por mi microbiota. Qué detalle.", v: 4 },
          { t: "Que pregunto la cifra antes de pelar nada.", v: 1 },
          { t: "Que hay detalles. No todo es dinero… dicen.", v: 3 }
        ]
      },
      {
        p: "Tu empresa regala una sesión de mindfulness para gestionar el estrés que ella misma genera. Tú:",
        tipo: "corporativo",
        r: [
          { t: "Voy. Cuenta como hora trabajada y hay cojines.", v: 3 },
          { t: "Propongo otra técnica de relajación: contratar a alguien más.", v: 1 },
          { t: "Voy y doy las gracias. Qué suerte de empresa.", v: 4 },
          { t: "Respiro hondo. Concretamente, un suspiro.", v: 2 }
        ]
      },
      {
        p: "Toca pedir un aumento. Tu arma:",
        tipo: "perfil",
        r: [
          { t: "Un Excel con mi impacto, celda a celda. Que discutan con la fórmula.", perfil: "analitico" },
          { t: "Una historia: cómo era este equipo antes de mí y cómo es ahora.", perfil: "creativo" },
          { t: "Tres datos y un buen final. Ni tesis ni monólogo.", perfil: "hibrido" },
          { t: "Ninguna. Mi trabajo ya habla… bajito, pero habla.", perfil: "neutro" }
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: "TIEMPO",
    metrica: "Presentismo", // nombre de la barra de este bloque (más alto = más corporativo)
    sellos: { // logro que se desbloquea al terminar el bloque
      bajo: { emoji: "🚪", texto: "Fichaje de salida impecable" }, // si respondes poco corporativo
      alto: { emoji: "💡", texto: "Último en apagar la luz" }  // si respondes muy corporativo
    },
    emoji: "⏱️",
    color: "#167db7",
    preguntas: [
      {
        p: "Son las 18:01 y nadie se levanta. ¿Qué haces?",
        tipo: "corporativo",
        r: [
          { t: "Me quedo un rato moviendo el ratón. Trabajar no, pero estar, estoy.", v: 3 },
          { t: "Me levanto. Alguien tiene que estrenar la puerta.", v: 1 },
          { t: "Me quedo. Las horas visibles son el único KPI que entiende todo el mundo.", v: 4 },
          { t: "Me voy despacio, con el abrigo en la mano, como quien va a por café.", v: 2 }
        ]
      },
      {
        p: "Viernes, 17:45. Llega un email con el asunto 'Cosita rápida'.",
        tipo: "corporativo",
        r: [
          { t: "Lo abro, sufro y lo marco como no leído. Autoengaño profesional.", v: 2 },
          { t: "Ya la tengo hecha. La vi venir en el calendario de mi jefe.", v: 4 },
          { t: "Contesto 'me pongo con ello' y me pongo. Un poco.", v: 3 },
          { t: "Lo leo el lunes. Si era rápida, sobrevivirá.", v: 1 }
        ]
      },
      {
        p: "Reunión de dos horas que podía ser un email. ¿Qué haces mientras?",
        tipo: "perfil",
        r: [
          { t: "Dibujo en la libreta. El organigrama me está quedando con dragones.", perfil: "creativo" },
          { t: "Calculo cuánto cuesta en sueldos. Da para una cena de empresa.", perfil: "analitico" },
          { t: "Asiento a intervalos regulares. Funciona desde 2019.", perfil: "neutro" },
          { t: "Redacto el email que debió ser, con su gráfico y todo.", perfil: "hibrido" }
        ]
      }
    ]
  },
  {
    id: 3,
    nombre: "CULTURA",
    metrica: "Fe en 'somos una familia'", // nombre de la barra de este bloque (más alto = más corporativo)
    sellos: { // logro que se desbloquea al terminar el bloque
      bajo: { emoji: "🍻", texto: "Tiene amigos de verdad" }, // si respondes poco corporativo
      alto: { emoji: "🕴️", texto: "Networker hasta dormido" }  // si respondes muy corporativo
    },
    emoji: "🤝",
    color: "#22c55e",
    preguntas: [
      {
        p: "En la entrevista te dicen: 'Aquí somos como una familia'.",
        tipo: "corporativo",
        r: [
          { t: "Se me humedecen los ojos. Por fin un sitio al que pertenecer.", v: 4 },
          { t: "Perfecto. En la mía tampoco se habla de dinero y siempre hay drama.", v: 2 },
          { t: "Pregunto si la familia paga las horas extra.", v: 1 },
          { t: "Sonrío. Toda empresa tiene su eslogan y este es inofensivo.", v: 3 }
        ]
      },
      {
        p: "Team building de paintball un sábado. 'Voluntario', pero pasan lista.",
        tipo: "corporativo",
        r: [
          { t: "No voy. Mis sábados no figuran en el contrato.", v: 1 },
          { t: "Voy y me dejo eliminar pronto. Cumplo y llego a comer.", v: 3 },
          { t: "Voy. Disparar a mi jefe legalmente es terapia subvencionada.", v: 2 },
          { t: "Voy, organizo los equipos y propongo repetirlo cada trimestre.", v: 4 }
        ]
      },
      {
        p: "El proyecto ha salido mal y toca explicarlo. Tú preparas:",
        tipo: "perfil",
        r: [
          { t: "Un análisis de causa raíz. Con gráfico de barras, que consuela mucho.", perfil: "analitico" },
          { t: "Los dos números que importan y una frase que se pueda repetir en el pasillo.", perfil: "hibrido" },
          { t: "Un relato: no fue un fracaso, fue un 'aprendizaje' con buen arco narrativo.", perfil: "creativo" },
          { t: "Nada. Espero a que salga mal otro proyecto y se olviden de este.", perfil: "neutro" }
        ]
      }
    ]
  },
  {
    id: 4,
    nombre: "VALORES",
    metrica: "Digestión de humo", // nombre de la barra de este bloque (más alto = más corporativo)
    sellos: { // logro que se desbloquea al terminar el bloque
      bajo: { emoji: "🔥", texto: "Detector de humo corporativo" }, // si respondes poco corporativo
      alto: { emoji: "📣", texto: "Embajador de marca involuntario" }  // si respondes muy corporativo
    },
    emoji: "🎯",
    color: "#a855f7",
    preguntas: [
      {
        p: "La empresa anuncia 'Somos sostenibles' y te pide imprimir 300 copias del comunicado.",
        tipo: "corporativo",
        r: [
          { t: "Imprimo a doble cara. Mi activismo llega hasta ahí.", v: 2 },
          { t: "Imprimo. La sostenibilidad es un viaje, no un destino.", v: 3 },
          { t: "Imprimo 300 y pido 50 más para plastificarlas.", v: 4 },
          { t: "Señalo la contradicción. Por email, que no gasta papel.", v: 1 }
        ]
      },
      {
        p: "El CEO cierra la reunión general con: 'El cambio es una oportunidad'. Tú oyes:",
        tipo: "corporativo",
        r: [
          { t: "Una verdad. La apunto para mi próximo post de LinkedIn.", v: 4 },
          { t: "'Hay recortes'. Actualizo el currículum esa misma tarde.", v: 1 },
          { t: "Un bingo. Me faltaba 'resiliencia' para cantar línea.", v: 2 },
          { t: "Una frase hecha, pero mejor eso que el silencio.", v: 3 }
        ]
      },
      {
        p: "Hay que convencer a un cliente escéptico. Abres con:",
        tipo: "perfil",
        r: [
          { t: "Un café. Lo demás se improvisa.", perfil: "neutro" },
          { t: "Una historia: alguien con sus mismas dudas, justo antes de decir que sí.", perfil: "creativo" },
          { t: "Una comparativa. Los números no caen simpáticos, pero no mienten.", perfil: "analitico" },
          { t: "Un dato que sorprenda y, después, por qué debería importarle.", perfil: "hibrido" }
        ]
      }
    ]
  },
  {
    id: 5,
    nombre: "IDENTIDAD",
    metrica: "Fusión con el cargo", // nombre de la barra de este bloque (más alto = más corporativo)
    sellos: { // logro que se desbloquea al terminar el bloque
      bajo: { emoji: "🌱", texto: "Persona con vida propia" }, // si respondes poco corporativo
      alto: { emoji: "🏢", texto: "Uno con la empresa" }  // si respondes muy corporativo
    },
    emoji: "🧠",
    color: "#ef4444",
    preguntas: [
      {
        p: "En una cena te preguntan: '¿Y tú qué eres?'. Respondes:",
        tipo: "corporativo",
        r: [
          { t: "Mi cargo. Es lo más rápido y la gente lo entiende.", v: 3 },
          { t: "Mi cargo, mi empresa y nuestros tres valores, por este orden.", v: 4 },
          { t: "Mi nombre. El cargo viene en la nómina, no en el DNI.", v: 1 },
          { t: "'Trabajo en algo con reuniones'. Y cambio de tema.", v: 2 }
        ]
      },
      {
        p: "Si mañana te despidieran, ¿quién serías?",
        tipo: "corporativo",
        r: [
          { t: "Alguien con un finiquito y muchas opiniones.", v: 2 },
          { t: "La misma persona, con las mañanas libres.", v: 1 },
          { t: "No lo sé. ¿Hay alguien debajo del lanyard?", v: 4 },
          { t: "Un perfil 'Open to work' con una foto muy sonriente.", v: 3 }
        ]
      },
      {
        p: "Un día perfecto de trabajo es aquel en el que…",
        tipo: "perfil",
        r: [
          { t: "…una idea de servilleta acaba proyectada en la pared.", perfil: "creativo" },
          { t: "…no pasa nada. Absolutamente nada.", perfil: "neutro" },
          { t: "…la idea era bonita y, además, los números le dan la razón.", perfil: "hibrido" },
          { t: "…una fórmula cuadra a la primera y nadie me ha hablado.", perfil: "analitico" }
        ]
      }
    ]
  }
];

// Frases que aparecen entre bloque y bloque (una por bloque completado)
export const MENSAJES_TRANSICION = [
  "Tu cinismo ya tiene más curvas que el organigrama del CEO. Next.",
  "RRHH acaba de activar protocolo de contención. Siguiente bloque.",
  "El algoritmo dice 'este no es de fichar fácil'. Vamos a verificarlo.",
  "Tu perfil laboral: 80% superviviente, 20% amenaza interna. Confirmamos."
];

// Reacción del "escáner" a cada respuesta corporativa, según su valor (1 = nada corporativo, 4 = muy corporativo)
export const REACCIONES = {
  1: ["Límite detectado. RRHH frunce el ceño.", "Dignidad intacta. El sistema toma nota.", "Respuesta no alineada con los valores. Bien."],
  2: ["Ironía funcional registrada.", "Sobrevives con humor. Clásico.", "Cinismo dentro de parámetros."],
  3: ["Adaptación al medio en curso.", "El sistema empieza a reconocerte como suyo.", "Ya dices 'sinergia' sin reírte."],
  4: ["Integración casi completa. Enhorabuena, supongo.", "RRHH acaba de sonreír. Preocúpate.", "KPI de lealtad: en verde."]
};

// Reacción a las preguntas de perfil (no mueven el medidor)
export const REACCIONES_PERFIL = {
  analitico: "Dato de perfil: mente analítica.",
  creativo: "Dato de perfil: mente creativa.",
  hibrido: "Dato de perfil: mitad datos, mitad relato.",
  neutro: "Dato de perfil: todoterreno pragmático."
};
