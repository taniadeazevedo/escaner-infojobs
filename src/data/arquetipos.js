// ======================
// ARQUETIPOS (los 6 resultados posibles)
// ======================
// Van de menos a más corporativo. Los títulos parodian nombres de puesto
// y no llevan "el/la" para que valgan para cualquiera.
// Los roles no suben de cargo: cada arquetipo recomienda puestos donde su actitud es una ventaja.

export const ARQUETIPOS = {
  equilibrio: { // 1 · pone límites y se va a su hora
    id: "equilibrio", // nombre interno (no se ve)
    titulo: "ESPECIALISTA EN IRSE A SU HORA", // título grande del resultado
    corto: "A su hora", // nombre corto para la escala
    subtitulo: "Límites con contrato indefinido", // frase bajo el título
    nivelLabel: "Inmunidad casi total", // texto bajo el porcentaje
    mensaje: "Trabajas para vivir y lo dices sin bajar la voz. Cumples, cobras y desapareces a las 18:00 como si tuvieras vida propia. RRHH lo llama 'falta de implicación'; tu terapeuta, 'salud'.",
    rasgos: [
      "Dice 'no' sin adjuntar disculpa",
      "Apaga el móvil y también la culpa",
      "Se ha leído el convenio. Entero."
    ],
    estado: "SOSTENIBLE // DIFÍCIL DE EXPLOTAR", // sello final
    roles_creativo: "Diseño gráfico, Maquetación", // roles si tu perfil es creativo
    roles_analitico: "Contabilidad, Administración", // roles si tu perfil es analítico
    nota: "Puestos donde el trabajo se acaba cuando se acaba. Haberlos, haylos." // frase sobre el botón de ofertas
  },
  rebelde: { // 2 · critica el sistema, pero entrega a tiempo
    id: "rebelde",
    titulo: "DISIDENTE CON NÓMINA",
    corto: "Disidente",
    subtitulo: "Critica al sistema, cobra del sistema",
    nivelLabel: "Resistencia en horario de oficina",
    mensaje: "Ves todas las grietas del sistema y las comentas en el café con una precisión que ya querría Auditoría. Luego vuelves a tu mesa y entregas a tiempo. Tu rebeldía tiene horario de oficina.",
    rasgos: [
      "Detecta el humo antes de que empiece la reunión",
      "Humor negro como equipo de protección individual",
      "Se queja con datos y entrega con puntualidad"
    ],
    estado: "DESESTABILIZADOR CONTROLADO",
    roles_creativo: "Copywriter, Community Manager",
    roles_analitico: "Tester QA, Analista de datos",
    nota: "Puestos donde encontrar fallos es el trabajo y no un problema de actitud."
  },
  prioritario: { // 3 · da resultados a cambio de algo
    id: "prioritario",
    titulo: "ESTRATEGA DEL TOMA Y DACA",
    corto: "Estratega",
    subtitulo: "Ambición con calculadora",
    nivelLabel: "Lealtad renovable por trimestres",
    mensaje: "Has leído la letra pequeña del pacto y la has firmado: tú das resultados, ellos dan reconocimiento (y a veces dinero). Tu lealtad existe, pero se renueva por trimestres.",
    rasgos: [
      "Negocia hasta el orden del día",
      "Entusiasmo indexado al variable",
      "Sabe exactamente cuánto vale su 'sí'"
    ],
    estado: "ALTO POTENCIAL // EN OBSERVACIÓN",
    roles_creativo: "Account Manager, Desarrollo de negocio",
    roles_analitico: "Compras, Key Account Manager",
    nota: "Puestos donde negociar va en la descripción. Pide que te lo pongan por escrito."
  },
  arquitecto: { // 4 · habla corporativo con fluidez
    id: "arquitecto",
    titulo: "PORTAVOZ OFICIAL DEL HUMO",
    corto: "Portavoz",
    subtitulo: "Bilingüe: español y corporativo",
    nivelLabel: "Simbiosis narrativa",
    mensaje: "Hablas corporativo como lengua materna. Donde otros ven un recorte, tú ves 'una oportunidad de optimizar recursos', y lo peor es que suena bien. Empiezas a creerte tus propias diapositivas.",
    rasgos: [
      "Convierte un problema en 'reto' en menos de una frase",
      "Dice 'alinear' sin ironía",
      "Sus emails podrían ser notas de prensa"
    ],
    estado: "SIMBIOSIS NARRATIVA AVANZADA",
    roles_creativo: "Comunicación corporativa, Brand Manager",
    roles_analitico: "Consultoría, Preventa",
    nota: "Puestos donde te pagan por explicarlo bonito. Ya tienes la plantilla abierta."
  },
  director: { // 5 · se cree el sistema de verdad
    id: "director",
    titulo: "EVANGELISTA DEL KPI",
    corto: "Evangelista",
    subtitulo: "Lo que no se mide, no existe",
    nivelLabel: "Fe ciega en el dashboard",
    mensaje: "Ya no distingues entre objetivos y emociones: si no está en un dashboard, no ha pasado. Tu calendario tiene más bloques que tu vida, y te parece bien.",
    rasgos: [
      "Mide su descanso en puntos de productividad",
      "Ha dicho 'ponerse la camiseta' en serio",
      "Considera el viernes un día como otro cualquiera"
    ],
    estado: "INTEGRADO EN EL SISTEMA // SIN INCIDENCIAS",
    roles_creativo: "Marketing Manager, Employer Branding",
    roles_analitico: "Controller, Operaciones",
    nota: "No buscas trabajo: el trabajo te encuentra. Normalmente en fin de semana."
  },
  entidad: { // 6 · ya no hay diferencia entre la persona y la empresa
    id: "entidad",
    titulo: "ENTIDAD CORPORATIVA",
    corto: "Entidad",
    subtitulo: "Persona física, alma jurídica",
    nivelLabel: "Fusión total",
    mensaje: "Ya no hay separación: eres la marca. Piensas en reuniones, sueñas en OKRs y sangras en formato Excel. Diagnóstico: vacaciones. Urgentes. Sin portátil.",
    rasgos: [
      "Dice 'nosotros' incluso en casa",
      "No recuerda su último hobby",
      "Su firma de email es su personalidad"
    ],
    estado: "FUSIÓN TOTAL // AVISEN A LA FAMILIA",
    roles_creativo: "Dirección de Marketing",
    roles_analitico: "Dirección Financiera",
    nota: "No necesitas InfoJobs. InfoJobs te necesita a ti."
  }
};

// Los arquetipos ordenados de menos a más corporativo, con su nota media máxima
export const ESCALA = [
  { id: "equilibrio", hasta: 1.7 },  // media de 1.0 a 1.7
  { id: "rebelde", hasta: 2.3 },     // media de 1.7 a 2.3
  { id: "prioritario", hasta: 2.8 }, // media de 2.3 a 2.8
  { id: "arquitecto", hasta: 3.2 },  // media de 2.8 a 3.2
  { id: "director", hasta: 3.6 },    // media de 3.2 a 3.6
  { id: "entidad", hasta: 4 }        // media de 3.6 a 4.0
];

// --- ENLACES DE OFERTAS POR ARQUETIPO Y PERFIL ---
// Una sola búsqueda por enlace: al juntar varios puestos, InfoJobs exige todas las palabras y casi no salen ofertas.
export const INFOJOBS_LINKS = {
  equilibrio_creativo: "https://www.infojobs.net/ofertas-trabajo/disenador-grafico",
  equilibrio_analitico: "https://www.infojobs.net/ofertas-trabajo/contabilidad",
  rebelde_creativo: "https://www.infojobs.net/ofertas-trabajo/community-manager",
  rebelde_analitico: "https://www.infojobs.net/ofertas-trabajo/analista-datos",
  prioritario_creativo: "https://www.infojobs.net/ofertas-trabajo/account-manager",
  prioritario_analitico: "https://www.infojobs.net/ofertas-trabajo/compras",
  arquitecto_creativo: "https://www.infojobs.net/ofertas-trabajo/comunicacion-corporativa",
  arquitecto_analitico: "https://www.infojobs.net/ofertas-trabajo/consultor",
  director_creativo: "https://www.infojobs.net/ofertas-trabajo/marketing-manager",
  director_analitico: "https://www.infojobs.net/ofertas-trabajo/controller",
  entidad_creativo: "https://www.infojobs.net/ofertas-trabajo/director-marketing",
  entidad_analitico: "https://www.infojobs.net/ofertas-trabajo/director-financiero"
};
