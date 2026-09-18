import React, { useState, useEffect } from 'react';

// ======================
// CONFIGURACIÓN DE MARCA INFOJOBS
// ======================
const COLORS = {
  primary: '#167db7',
  accent: '#ff912c',
  linkedin: '#0077B5',
  bg: '#f0f4f8',
  text: '#1a1a1a',
  muted: '#6a7d8e'
};

// --- ENLACES ESPECÍFICOS POR ARQUETIPO Y TIPO ---
const INFOJOBS_LINKS = {
  equilibrio_creativo: "https://www.infojobs.net/ofertas-trabajo/account-manager+customer-success",
  equilibrio_analitico: "https://www.infojobs.net/ofertas-trabajo/account-manager+business-analyst",
  rebelde_creativo: "https://www.infojobs.net/ofertas-trabajo/content-strategist+community-manager",
  rebelde_analitico: "https://www.infojobs.net/ofertas-trabajo/product-manager+data-analyst",
  prioritario_creativo: "https://www.infojobs.net/ofertas-trabajo/project-manager+creative-director",
  prioritario_analitico: "https://www.infojobs.net/ofertas-trabajo/project-manager+operations-manager",
  arquitecto_creativo: "https://www.infojobs.net/ofertas-trabajo/copywriter+brand-manager+marketing",
  arquitecto_analitico: "https://www.infojobs.net/ofertas-trabajo/business-analyst+strategy-consultant",
  director_creativo: "https://www.infojobs.net/ofertas-trabajo/creative-director+marketing-director",
  director_analitico: "https://www.infojobs.net/ofertas-trabajo/director-operaciones+supply-chain",
  entidad_creativo: "https://www.infojobs.net/ofertas-trabajo/chief-marketing-officer+brand-director",
  entidad_analitico: "https://www.infojobs.net/ofertas-trabajo/controller+auditor+consultor-empresas"
};

// --- BLOQUES CON 3 PREGUNTAS CADA UNO (15 TOTAL) ---
const BLOQUES = [
  {
    id: 1,
    nombre: "BIENESTAR",
    emoji: "💼",
    color: COLORS.accent,
    preguntas: [
      { 
        p: "¿La fruta fresca gratuita de la oficina compensa un sueldo de 16k?", 
        tipo: "corporativo",
        r: [
          { t: "Sí, me motiva saber que alguien piensa en mi microbiota mientras yo pienso en mi hipoteca.", v: 1 },
          { t: "Es un buen gesto, pero no paga la hipoteca.", v: 2 },
          { t: "Me da igual la fruta, yo quiero que el sueldo cuadre primero.", v: 4 },
          { t: "¿Fruta? Si hay café decente ya estoy feliz.", v: 3 }
        ]
      },
      { 
        p: "Cuando la empresa te pide 'ponerte la camiseta', ¿de qué material esperas que sea?", 
        tipo: "corporativo",
        r: [
          { t: "Algodón orgánico, que aquí cuidamos a la gente... o eso dicen los valores.", v: 1 },
          { t: "Poliéster 100%, sintético y barato como lo que piden.", v: 3 },
          { t: "Lana de merino, si voy a vender mi alma que sea con clase.", v: 2 },
          { t: "Blindaje de acero. Aquí toca protegerse para las reuniones.", v: 4 }
        ]
      },
      {
        p: "Para demostrar tu valor en la empresa, prefieres:",
        tipo: "perfil",
        r: [
          { t: "Un dashboard con métricas claras y ROI cuantificable.", v: 4, perfil: "analitico" },
          { t: "Una presentación visual que cuente la historia del impacto.", v: 4, perfil: "creativo" },
          { t: "Datos sólidos con un storytelling convincente.", v: 2, perfil: "hibrido" },
          { t: "Que hablen mis resultados, sin necesidad de presentar nada.", v: 1, perfil: "neutro" }
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: "TIEMPO",
    emoji: "⏱️",
    color: COLORS.primary,
    preguntas: [
      { 
        p: "Son las 18:00, tu jefe sonríe... ¿hora de irse o de demostrar 'implicación'?", 
        tipo: "corporativo",
        r: [
          { t: "Me voy, pero con una sonrisa más falsa que la suya.", v: 2 },
          { t: "Me quedo. La implicación se mide en horas visibles.", v: 4 },
          { t: "Pregunto educadamente por mis horas extras.", v: 1 },
          { t: "Saco mi portátil. Si quedo mal, que sea multitasking.", v: 3 }
        ]
      },
      { 
        p: "¿Prefieres un bonus de 500€ o no aparecer en expedientes de despido?", 
        tipo: "corporativo",
        r: [
          { t: "Bonus ya. Los despidos son para quien no da el callo.", v: 3 },
          { t: "Ni bonus ni despido. Yo controlo mi destino.", v: 1 },
          { t: "500€ compensan muchas noches de ansiedad.", v: 2 },
          { t: "Ninguno. Mejor ser indispensable.", v: 4 }
        ]
      },
      {
        p: "Tu herramienta de trabajo ideal es:",
        tipo: "perfil",
        r: [
          { t: "Excel, Google Sheets, Power BI. Dame datos y gráficos.", v: 3, perfil: "analitico" },
          { t: "Figma, Canva, Miro. Visual y colaborativo.", v: 3, perfil: "creativo" },
          { t: "Notion o Asana. Organización clara y flexible.", v: 2, perfil: "hibrido" },
          { t: "Email y calendario. Lo básico funciona.", v: 1, perfil: "neutro" }
        ]
      }
    ]
  },
  {
    id: 3,
    nombre: "CULTURA",
    emoji: "🤝",
    color: '#22c55e',
    preguntas: [
      { 
        p: "En la cena de Navidad, ¿ves compañeros o assets con patas?", 
        tipo: "corporativo",
        r: [
          { t: "Compañeros. Fuera del trabajo también conectamos.", v: 1 },
          { t: "Assets con dos cervezas. Se les ve el código fuente.", v: 3 },
          { t: "Networking disfrazado de fiesta. Doble beneficio.", v: 2 },
          { t: "Todos evaluables. El alcohol cambia la velocidad del KPI.", v: 4 }
        ]
      },
      { 
        p: "¿Puede un Team Building de paintball sustituir años de terapia?", 
        tipo: "corporativo",
        r: [
          { t: "Es ridículo. Cada problema necesita su solución.", v: 1 },
          { t: "Legalmente disparar al jefe es terapéutico.", v: 2 },
          { t: "Funciona para liberar tensiones. Punto.", v: 3 },
          { t: "Si después suben el rendimiento, sustituye lo que sea.", v: 4 }
        ]
      },
      {
        p: "Cuando resuelves un problema complejo, tu enfoque es:",
        tipo: "perfil",
        r: [
          { t: "Análisis de datos, patrones, causa raíz con números.", v: 3, perfil: "analitico" },
          { t: "Entender el contexto, las personas, crear una narrativa.", v: 3, perfil: "creativo" },
          { t: "Combinar insights cualitativos con métricas clave.", v: 2, perfil: "hibrido" },
          { t: "Experiencia previa y sentido común.", v: 1, perfil: "neutro" }
        ]
      }
    ]
  },
  {
    id: 4,
    nombre: "VALORES",
    emoji: "🎯",
    color: '#a855f7',
    preguntas: [
      { 
        p: "Tu empresa anuncia '¡Somos sostenibles!' mientras te manda a imprimir 300 páginas. Reacción:", 
        tipo: "corporativo",
        r: [
          { t: "Les señalo la contradicción constructivamente.", v: 1 },
          { t: "Imprimo y subo una story con el logo verde.", v: 2 },
          { t: "Uso papel reciclado y me siento mejor.", v: 3 },
          { t: "Los valores son marketing. Yo solo hago mi trabajo.", v: 4 }
        ]
      },
      { 
        p: "¿Cuántas frases motivacionales puedes aguantar antes de sentirte vacío por dentro?", 
        tipo: "corporativo",
        r: [
          { t: "2-3. Necesito realismo.", v: 1 },
          { t: "5-6. Después pido datos concretos.", v: 2 },
          { t: "10+. Las transformo en memes mentalmente.", v: 3 },
          { t: "Infinitas. Ya no proceso su significado.", v: 4 }
        ]
      },
      {
        p: "Si tuvieras que convencer a un cliente, usarías:",
        tipo: "perfil",
        r: [
          { t: "Datos duros, ROI, comparativas, estudios de caso.", v: 3, perfil: "analitico" },
          { t: "Una historia emocional, visión inspiradora, casos de éxito.", v: 3, perfil: "creativo" },
          { t: "Balance entre datos concretos y storytelling atractivo.", v: 2, perfil: "hibrido" },
          { t: "Lo que funcione en el momento.", v: 1, perfil: "neutro" }
        ]
      }
    ]
  },
  {
    id: 5,
    nombre: "IDENTIDAD",
    emoji: "🧠",
    color: '#ef4444',
    preguntas: [
      { 
        p: "¿Cuándo fue la última vez que dijiste 'nosotros' hablando de la empresa?", 
        tipo: "corporativo",
        r: [
          { t: "Nunca. Yo trabajo aquí, no soy la empresa.", v: 1 },
          { t: "A veces, por cortesía profesional.", v: 2 },
          { t: "Casi siempre. Me siento parte del proyecto.", v: 3 },
          { t: "Es mi lenguaje natural. Somos uno.", v: 4 }
        ]
      },
      { 
        p: "Si te despidieran mañana, ¿quién serías?", 
        tipo: "corporativo",
        r: [
          { t: "La misma persona, con más tiempo libre.", v: 1 },
          { t: "Alguien buscando redefinir su identidad profesional.", v: 2 },
          { t: "Un asset temporalmente desvinculado.", v: 3 },
          { t: "No lo sé. Llevo tanto tiempo aquí que no recuerdo.", v: 4 }
        ]
      },
      {
        p: "Tu zona de confort profesional está en:",
        tipo: "perfil",
        r: [
          { t: "Hojas de cálculo, análisis financiero, modelos predictivos.", v: 3, perfil: "analitico" },
          { t: "Brainstorming, diseño conceptual, storytelling visual.", v: 3, perfil: "creativo" },
          { t: "Proyectos que combinan estrategia y creatividad.", v: 2, perfil: "hibrido" },
          { t: "Adaptarme a lo que necesite el proyecto.", v: 1, perfil: "neutro" }
        ]
      }
    ]
  }
];

// --- ARQUETIPOS CON ROLES DUALES ---
const ARQUETIPOS = {
  equilibrio: {
    id: "equilibrio",
    titulo: "EL EQUILIBRISTA",
    subtitulo: "Pragmático con principios",
    nivelLabel: "Equilibrio Sano",
    mensaje: "Sabes que el sistema es lo que es, pero no has dejado que te lo trague entero. No eres el candidato tibio: eres quien pone límites claros y mantiene un modelo sostenible a largo plazo.",
    rasgos: [
      "Límites profesionales bien definidos",
      "Capacidad de desconectar del trabajo",
      "Cinismo moderado y funcional"
    ],
    estado: "VIABLE A LARGO PLAZO",
    roles_creativo: "Account Manager, Customer Success",
    roles_analitico: "Business Analyst, Data Coordinator",
    nota: "Empresas que respetan el equilibrio real te necesitan."
  },
  rebelde: {
    id: "rebelde",
    titulo: "EL REBELDE FUNCIONAL",
    subtitulo: "Crítico pero operativo",
    nivelLabel: "Rebeldía Consciente",
    mensaje: "Ves las grietas del sistema y las señalas sin miedo, pero no eres destructivo: tu rebeldía detecta fallos para mejorar procesos. Sigues jugando porque sabes cómo funciona el tablero.",
    rasgos: [
      "Alta capacidad de análisis crítico",
      "Resistencia al corporate bullshit",
      "Empuja límites sin autodestruirse"
    ],
    estado: "DESESTABILIZADOR CONTROLADO",
    roles_creativo: "Content Strategist, Community Manager",
    roles_analitico: "Product Manager, Data Analyst",
    nota: "Startups y agencias con cultura horizontal buscan tu perfil."
  },
  prioritario: {
    id: "prioritario",
    titulo: "EL CANDIDATO PRIORITARIO",
    subtitulo: "Ambición pragmática",
    nivelLabel: "Ambición Calculada",
    mensaje: "Has aceptado el pacto: das resultados, recibes reconocimiento. Tu moral es flexible pero no inexistente.",
    rasgos: [
      "Orientación extrema a resultados",
      "Capacidad de negociación estratégica",
      "Visión a largo plazo del juego corporativo"
    ],
    estado: "ALTO POTENCIAL // EN OBSERVACIÓN",
    roles_creativo: "Project Manager, Creative Lead",
    roles_analitico: "Operations Manager, Business Intelligence",
    nota: "Multinacionales y consultoras top te ficharon mentalmente."
  },
  arquitecto: {
    id: "arquitecto",
    titulo: "EL ARQUITECTO DEL DISCURSO",
    subtitulo: "Simulación avanzada",
    nivelLabel: "Simbiosis Corporativa",
    mensaje: "Dominas el lenguaje corporativo como una segunda lengua nativa. Tu talento es traducir contradicciones en planes accionables y convertir cualquier fricción en narrativa coherente.",
    rasgos: [
      "Maestro en storytelling corporativo",
      "Capacidad de reframing infinito",
      "Ha interiorizado el lenguaje de marca"
    ],
    estado: "SIMBIOSIS NARRATIVA COMPLETA",
    roles_creativo: "Copywriter, Brand Manager, Marketing",
    roles_analitico: "Strategy Consultant, Business Analyst",
    nota: "Departamentos de comunicación y estrategia te quieren."
  },
  director: {
    id: "director",
    titulo: "EL DIRECTOR DE OPERACIONES",
    subtitulo: "Integración sistémica",
    nivelLabel: "Ejecutor Sistémico",
    mensaje: "Has dejado de diferenciar entre KPIs y emociones. Todo es medible, todo es optimizable.",
    rasgos: [
      "Visión completamente sistémica",
      "Priorización absoluta de objetivos",
      "Ha transcendido la dualidad trabajo-vida"
    ],
    estado: "ENTIDAD CORPORATIVA FUNCIONAL",
    roles_creativo: "Creative Director, Marketing Director",
    roles_analitico: "Director Operaciones, Supply Chain",
    nota: "Ya no buscas trabajo. El trabajo te encuentra a ti."
  },
  entidad: {
    id: "entidad",
    titulo: "LA ENTIDAD CORPORATIVA",
    subtitulo: "Metamorfosis completa",
    nivelLabel: "Fusión Total",
    mensaje: "Ya no hay separación. Eres la marca. Piensas en reuniones, sueñas en OKRs, sangras en formato Excel. (Si has llegado aquí, quizá necesitas vacaciones urgentemente).",
    rasgos: [
      "Identidad fusionada con el rol profesional",
      "Ausencia de conflicto interno",
      "Ha superado la necesidad de desconectar"
    ],
    estado: "INTEGRACIÓN TOTAL // IRREVERSIBLE",
    roles_creativo: "Chief Marketing Officer, Brand Director",
    roles_analitico: "CFO, Controller, Auditor Senior",
    nota: "No necesitas InfoJobs. InfoJobs te necesita a ti."
  }
};

// --- COMPONENTE BARRAS HORIZONTALES ---
const MetricsBars = ({ metrics }) => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(metrics);
    }, 100);
    return () => clearTimeout(timer);
  }, [metrics]);

  return (
    <div style={{ margin: '25px 0' }}>
      {Object.entries(metrics).map(([label, value], index) => (
        <div key={label} style={{ marginBottom: '18px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '6px',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: '600',
              color: COLORS.text 
            }}>
              {label}
            </span>
            <span style={{ 
              fontSize: '15px', 
              fontWeight: '700',
              color: COLORS.primary 
            }}>
              {progress[label] || 0}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(22, 125, 183, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress[label] || 0}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              borderRadius: '10px',
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: `${index * 0.1}s`
            }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const App = () => {
  const [step, setStep] = useState('HERO');
  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [perfilAnswers, setPerfilAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [archetype, setArchetype] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [perfilTipo, setPerfilTipo] = useState("hibrido");

  const TRANSITION_MESSAGES = [
    "Tu cinismo ya tiene más curvas que el organigrama del CEO. Next.",
    "RRHH acaba de activar protocolo de contención. Siguiente bloque.",
    "El algoritmo dice 'este no es de fichar fácil'. Vamos a verificarlo.",
    "Tu perfil laboral: 80% superviviente, 20% amenaza interna. Confirmamos.",
    "Si fueras KPI, ya te habrían puesto en amarillo. Continuamos el escaneo."
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const texts = [
        "Escaneando cinismo operativo...",
        "Calculando tolerancia al corporate bullshit...",
        "Analizando ADN laboral...",
        "Cruzando datos con vacantes de InfoJobs...",
        "Generando arquetipo definitivo..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i]);
        i++;
        if (i >= texts.length) clearInterval(interval);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const currentQ = BLOQUES[currentBlock].preguntas[currentQuestion];
    const selectedOption = currentQ.r[selectedAnswer]; // Ahora selectedAnswer es el índice
    
    // Guardar valor corporativo
    const newAnswers = [...answers, selectedOption.v];
    setAnswers(newAnswers);
    
    // Guardar respuesta de perfil si existe
    if (currentQ.tipo === "perfil" && selectedOption.perfil) {
      setPerfilAnswers([...perfilAnswers, selectedOption.perfil]);
    }

    if (currentQuestion < 2) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else if (currentBlock < 4) {
      setStep('TRANSITION');
    } else {
      finishTest(newAnswers, [...perfilAnswers, selectedOption.perfil || 'neutro']);
    }
  };

  const calcularMetricas = (answersList) => {
    const blocks = [];
    for (let i = 0; i < 5; i++) {
      blocks.push(answersList.slice(i * 3, (i + 1) * 3)); // 3 por bloque
    }
    
    const avgBlock = (block) => {
      const sum = block.reduce((a, b) => a + b, 0);
      return Math.round((sum / block.length / 4) * 100);
    };
    
    return {
      "Cinismo Operativo": avgBlock(blocks[0]),
      "Alergia 'Familia'": avgBlock(blocks[2]),
      "Simulación Entusiasmo": avgBlock(blocks[3]),
      "Tolerancia Reuniones": avgBlock(blocks[1]),
      "Disociación Profesional": avgBlock(blocks[4])
    };
  };

  const calcularPerfil = (perfilList) => {
    const count = {
      creativo: 0,
      analitico: 0,
      hibrido: 0,
      neutro: 0
    };
    
    perfilList.forEach(p => {
      count[p] = (count[p] || 0) + 1;
    });
    
    if (count.creativo > count.analitico + count.hibrido) return "creativo";
    if (count.analitico > count.creativo + count.hibrido) return "analitico";
    return "hibrido";
  };

  const calcularArquetipo = (totalScore, answersList) => {
    const avg = totalScore / answersList.length;
    
    if (avg <= 1.7) return ARQUETIPOS.equilibrio;
    if (avg <= 2.3) return ARQUETIPOS.rebelde;
    if (avg <= 2.8) return ARQUETIPOS.prioritario;
    if (avg <= 3.2) return ARQUETIPOS.arquitecto;
    if (avg <= 3.6) return ARQUETIPOS.director;
    return ARQUETIPOS.entidad;
  };

  const finishTest = (finalAnswers, finalPerfil) => {
    const totalScore = finalAnswers.reduce((a, b) => a + b, 0);
    const avg = totalScore / finalAnswers.length;
    const percentage = Math.round((avg / 4) * 100);
    const result = calcularArquetipo(totalScore, finalAnswers);
    const calculatedMetrics = calcularMetricas(finalAnswers);
    const perfil = calcularPerfil(finalPerfil);
    
    setArchetype(result);
    setMetrics(calculatedMetrics);
    setScorePercentage(percentage);
    setPerfilTipo(perfil);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep('RESULTS');
    }, 4000);
  };

  const nextBlock = () => {
    setCurrentBlock(currentBlock + 1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setStep('QUESTIONS');
  };

  const OptionButton = ({ text, index }) => {
    const isSelected = selectedAnswer === index;
    return (
      <button
        className="option-button"
        onClick={() => setSelectedAnswer(index)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: window.innerWidth >= 768 ? '16px 22px' : '14px 18px',
          margin: window.innerWidth >= 768 ? '8px 0' : '6px 0',
          borderRadius: '12px',
          border: `2px solid ${isSelected ? COLORS.primary : 'rgba(22, 125, 183, 0.15)'}`,
          background: isSelected ? 'rgba(22, 125, 183, 0.08)' : 'white',
          color: isSelected ? COLORS.primary : COLORS.text,
          cursor: 'pointer',
          fontSize: window.innerWidth >= 768 ? '15px' : '14px',
          fontWeight: isSelected ? '600' : '400',
          transition: 'all 0.2s ease',
          transform: isSelected ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isSelected ? '0 4px 12px rgba(22, 125, 183, 0.15)' : 'none'
        }}
      >
        <span style={{ flex: 1, textAlign: 'center' }}>{text}</span>
        {isSelected && (
          <span style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: '16px', position: 'absolute', right: '20px' }}>✓</span>
        )}
      </button>
    );
  };

  return (
    <div style={{ 
      background: 'radial-gradient(circle at top right, #ffffff 0%, #e2e8f0 100%)',
      minHeight: '100vh', 
      fontFamily: 'Inter, system-ui, sans-serif',
      paddingBottom: '40px',
      color: COLORS.text
    }}>
      
      <div style={{ 
        maxWidth: '100%', 
        padding: window.innerWidth >= 768 ? '40px 20px' : '0',
        minHeight: '100vh'
      }}>
        
        {/* CONTAINER RESPONSIVE PARA DESKTOP */}
        <div style={{
          maxWidth: '650px',
          margin: '0 auto',
          background: window.innerWidth >= 768 ? 'white' : 'transparent',
          boxShadow: window.innerWidth >= 768 ? '0 10px 40px rgba(0,0,0,0.08)' : 'none',
          borderRadius: window.innerWidth >= 768 ? '20px' : '0',
          overflow: step === 'RESULTS' 
            ? 'visible' 
            : (window.innerWidth >= 768 ? 'hidden' : 'auto'),
          position: 'relative',
          minHeight: step === 'RESULTS'
            ? 'auto'
            : window.innerWidth >= 768
              ? '750px'
              : 'auto',
          height: step === 'RESULTS' ? 'auto' : (window.innerWidth >= 768 ? 'auto' : 'auto')
        }}>
        
        {/* HEADER LIMPIO - FOTO × INFOJOBS */}
        <nav style={{ 
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(15px)',
          padding: '14px 20px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid rgba(22, 125, 183, 0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          borderRadius: window.innerWidth >= 768 ? '20px 20px 0 0' : '0'
        }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            overflow: 'hidden',
            border: '2px solid rgba(22, 125, 183, 0.3)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <img
              src="/yo.jpeg"
              alt="Tania"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <span style={{ 
            color: '#999', 
            fontWeight: '600',
            fontSize: '18px'
          }}>
            ×
          </span>
          <span style={{
            fontWeight: '800',
            fontSize: '18px',
            color: COLORS.primary,
            letterSpacing: '-0.5px'
          }}>
            InfoJobs
          </span>
        </div>
      </nav>

        {/* HERO - SIN CARD */}
        {step === 'HERO' && (
          <div style={{ 
            padding: window.innerWidth >= 768 ? '30px 20px 30px' : '30px 20px 30px',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              display: 'inline-block',
              background: 'rgba(22, 125, 183, 0.1)',
              color: COLORS.primary,
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: '600',
              margin: '0 auto 25px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              V2.0 Premium Interface
            </div>
            
            {/* FIGURA GEOMÉTRICA PARPADEANTE */}
            <div style={{ 
              width: '180px',
              height: '180px',
              margin: '0 auto 15px',
              background: 'rgba(22, 125, 183, 0.03)',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: `1px dashed ${COLORS.primary}`,
              animation: 'pulse 2s ease-in-out infinite',
              position: 'relative'
            }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <polygon 
                  points="50,10 90,35 75,80 25,80 10,35" 
                  fill="rgba(22, 125, 183, 0.2)" 
                  stroke={COLORS.primary} 
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            <h1 style={{ 
              color: COLORS.text,
              fontSize: window.innerWidth >= 768 ? '38px' : '28px',
              fontWeight: '800',
              marginBottom: '15px',
              letterSpacing: '-0.5px',
              lineHeight: '1.1',
              padding: '0 20px'
            }}>
              Escáner de Compatibilidad
            </h1>
            
            <p style={{ 
              color: COLORS.muted, 
              margin: '0 auto 40px', 
              lineHeight: '1.7',
              fontSize: window.innerWidth >= 768 ? '1.125rem' : '1rem',
              maxWidth: '400px',
              padding: '0 30px'
            }}>
              No buscamos tu trabajo soñado. Comprobamos qué sistema laboral es capaz de aguantar tu ADN profesional.
            </p>
            
            <button 
              className="action-button"
              onClick={() => setStep('QUESTIONS')}
              style={{ 
                background: COLORS.accent,
                color: 'white', 
                padding: window.innerWidth >= 768 ? '20px 50px' : '18px 40px', 
                borderRadius: '16px', 
                border: 'none', 
                fontWeight: '600', 
                fontSize: window.innerWidth >= 768 ? '1rem' : '0.9375rem',
                cursor: 'pointer',
                maxWidth: window.innerWidth >= 768 ? '320px' : '320px',
                margin: '0 auto',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 10px 20px rgba(255, 145, 44, 0.25)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 25px rgba(255, 145, 44, 0.35)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 20px rgba(255, 145, 44, 0.25)';
              }}
            >
              Iniciar Escaneo Táctico
            </button>
            
            <p style={{ 
              marginTop: '30px', 
              fontSize: '12px', 
              color: '#a0aec0',
              lineHeight: '1.6'
            }}>
              15 preguntas · 5 bloques · 1 diagnóstico brutal
            </p>
          </div>
        )}

        {/* PREGUNTAS - SIN CARD */}
        {step === 'QUESTIONS' && (
          <div style={{
            padding: window.innerWidth >= 768 ? '30px 20px 110px' : '30px 20px 50px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: window.innerWidth >= 768 ? 'space-between' : 'flex-start',
              minHeight: window.innerWidth >= 768 ? 'calc(100vh - 360px)' : 'auto'
            }}>
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* INDICADOR BLOQUE */}
                <div style={{
                  marginBottom: '20px',
                  textAlign: 'center',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: BLOQUES[currentBlock].color,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '8px'
                  }}>
                    Bloque {currentBlock + 1}/5 · {BLOQUES[currentBlock].nombre}
                  </div>

                  {/* PUNTOS PROGRESO */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '15px'
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: i === currentQuestion ? COLORS.primary : 'rgba(22, 125, 183, 0.2)',
                        transition: 'all 0.3s ease'
                      }} />
                    ))}
                  </div>

                  {/* BARRA TOTAL */}
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(22, 125, 183, 0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    maxWidth: '300px',
                    margin: '0 auto'
                  }}>
                    <div style={{
                      width: `${((currentBlock * 3 + currentQuestion + 1) / 15) * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                      borderRadius: '10px',
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>
                </div>

                <h2 style={{
                  fontSize: window.innerWidth >= 768 ? '22px' : '20px',
                  marginBottom: '25px',
                  lineHeight: '1.4',
                  color: COLORS.text,
                  fontWeight: '600',
                  textAlign: 'center',
                  padding: '0 10px',
                  width: '100%'
                }}>
                  {BLOQUES[currentBlock].preguntas[currentQuestion].p}
                </h2>

                <div style={{
                  maxWidth: '500px',
                  width: '100%',
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  {BLOQUES[currentBlock].preguntas[currentQuestion].r.map((opt, i) => (
                    <OptionButton key={i} text={opt.t} index={i} />
                  ))}
                </div>
              </div>

              <button
                className="action-button"
                onClick={handleNext}
                disabled={selectedAnswer === null}
                style={{
                  display: 'block',
                  maxWidth: '320px',
                  width: 'auto',
                  background: selectedAnswer === null ? 'rgba(22, 125, 183, 0.2)' : '#167db7',
                  color: 'white',
                  padding: window.innerWidth >= 768 ? '16px 40px' : '14px 32px',
                  borderRadius: '50px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
                  opacity: selectedAnswer === null ? 0.5 : 1,
                  transition: 'all 0.3s ease',
                  position: window.innerWidth >= 768 ? 'absolute' : 'static',
                  bottom: window.innerWidth >= 768 ? '30px' : 'auto',
                  left: window.innerWidth >= 768 ? '50%' : 'auto',
                  transform: window.innerWidth >= 768 ? 'translateX(-50%)' : 'none',
                  margin: window.innerWidth >= 768 ? '0' : '20px auto 0',
                  zIndex: window.innerWidth >= 768 ? 5 : 'auto'
                }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* TRANSICIÓN CON EMOJIS */}
        {step === 'TRANSITION' && (
          <div style={{ 
            padding: window.innerWidth >= 768 ? '80px 20px 90px' : '60px 20px 40px',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: window.innerWidth >= 768 ? 'calc(100vh - 360px)' : 'auto'
            }}>
              {window.innerWidth >= 768 && <div style={{ flex: 0.55 }}></div>}
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '80px',
                  marginBottom: window.innerWidth >= 768 ? '30px' : '20px',
                  animation: 'floatSlow 3s ease-in-out infinite',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))'
                }}>
                  {BLOQUES[currentBlock].emoji}
                </div>

                <h2 style={{
                  color: COLORS.primary,
                  fontSize: window.innerWidth >= 768 ? '24px' : '20px',
                  fontWeight: '700',
                  marginBottom: '15px'
                }}>
                  Bloque {currentBlock + 1} completado
                </h2>

                <p style={{
                  color: COLORS.muted,
                  marginBottom: '12px',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  maxWidth: '350px',
                  textAlign: 'center',
                  margin: '0 auto 12px'
                }}>
                  {TRANSITION_MESSAGES[currentBlock]}
                </p>
              </div>
              {window.innerWidth >= 768 && <div style={{ flex: 1.45 }}></div>}

              <button
                className="action-button"
                onClick={nextBlock}
                style={{
                  display: 'block',
                  maxWidth: '320px',
                  width: 'auto',
                  background: COLORS.accent,
                  color: 'white',
                  padding: window.innerWidth >= 768 ? '16px 40px' : '14px 32px',
                  borderRadius: '50px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(255, 145, 44, 0.25)',
                  transition: 'all 0.3s ease',
                  ...(window.innerWidth >= 768 ? {
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    margin: 0,
                    zIndex: 5
                  } : {
                    position: 'static',
                    margin: '25px auto 0',
                    transform: 'none'
                  })
                }}
                onMouseOver={(e) => {
                  if (window.innerWidth >= 768) {
                    e.target.style.transform = 'translateX(-50%) scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (window.innerWidth >= 768) {
                    e.target.style.transform = 'translateX(-50%)';
                  }
                }}
              >
                {window.innerWidth >= 768 
                  ? `Continuar al Bloque ${currentBlock + 2}` 
                  : `Bloque ${currentBlock + 2} →`
                }
              </button>
            </div>
          </div>
        )}

        {/* ANÁLISIS - PANTALLA COMPLETA CENTRADA */}
        {isAnalyzing && (
          <div style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'radial-gradient(circle at center, #ffffff 0%, #e2e8f0 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 30px',
              border: `4px solid ${COLORS.primary}`,
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            
            <h3 style={{ 
              color: COLORS.primary, 
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '15px',
              textAlign: 'center',
              padding: '0 30px'
            }}>
              {loadingText}
            </h3>
            
            <p style={{ 
              color: COLORS.muted,
              fontSize: '13px'
            }}>
              No cierres esta ventana...
            </p>
          </div>
        )}

        {/* RESULTADOS */}
        {step === 'RESULTS' && archetype && metrics && (
          <div style={{ 
            animation: 'fadeIn 0.8s ease-out', 
            padding: window.innerWidth >= 768 ? '30px 20px 20px' : '30px 20px 20px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              textAlign: 'center',
              maxWidth: '550px',
              margin: '0 auto 40px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 'bold', 
                color: COLORS.accent,
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                RESULTADO DEL ESCÁNER
              </span>
              
              {/* 1. TÍTULO CON % CORPORATIVO */}
              <h1 style={{ 
                fontSize: window.innerWidth >= 768 ? '38px' : '28px',
                margin: '15px 0 5px',
                fontWeight: '800',
                color: COLORS.text,
                letterSpacing: '-0.5px',
                lineHeight: '1.1'
              }}>
                {archetype.titulo}
              </h1>
              
              <p style={{ 
                color: COLORS.muted,
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '20px',
                lineHeight: '1.2'
              }}>
                {archetype.subtitulo}
              </p>

              {/* Porcentaje corporativo integrado con título */}
              <div style={{
                background: 'rgba(22, 125, 183, 0.05)',
                padding: '25px',
                borderRadius: '16px',
                marginBottom: '25px',
                width: '100%'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: COLORS.muted,
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Nivel Corporativo
                </div>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  color: COLORS.primary,
                  marginBottom: '15px'
                }}>
                  {scorePercentage}%
                </div>
                
                <div style={{
                  width: '100%',
                  height: '10px',
                  background: 'rgba(22, 125, 183, 0.1)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: `${scorePercentage}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                    borderRadius: '10px',
                    transition: 'width 1.5s ease-out'
                  }}></div>
                </div>

                <div style={{
                  fontSize: '13px',
                  color: COLORS.muted,
                  fontWeight: '500'
                }}>
                  {archetype.nivelLabel}
                </div>
              </div>
              
              {/* 2. RASGOS DETECTADOS */}
              <div style={{ 
                background: 'rgba(240, 244, 248, 0.5)',
                padding: '20px', 
                borderRadius: '16px', 
                marginBottom: '20px',
                textAlign: 'left',
                width: '100%'
              }}>
                <h4 style={{ 
                  margin: '0 0 12px', 
                  fontSize: '12px',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '700'
                }}>
                  Tus rasgos detectados:
                </h4>
                {archetype.rasgos.map((t, i) => (
                  <div key={i} style={{ 
                    fontSize: '14px', 
                    margin: '8px 0',
                    paddingLeft: '18px',
                    position: 'relative',
                    color: COLORS.text,
                    lineHeight: '1.5'
                  }}>
                    <span style={{ 
                      position: 'absolute',
                      left: 0,
                      color: COLORS.primary,
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                    {t}
                  </div>
                ))}
              </div>

              {/* 3. MENSAJE (Has aceptado el pacto...) */}
              <div style={{ 
                background: 'rgba(22, 125, 183, 0.05)',
                padding: '20px', 
                borderRadius: '16px',
                borderLeft: `4px solid ${COLORS.primary}`,
                marginBottom: '20px',
                textAlign: 'left',
                width: '100%'
              }}>
                <p style={{ 
                  color: COLORS.text,
                  lineHeight: '1.6',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  margin: 0
                }}>
                  "{archetype.mensaje}"
                </p>
              </div>
              
              {/* 4. ANÁLISIS POR DIMENSIONES (Barras) */}
              <div style={{
                background: 'rgba(240, 244, 248, 0.5)',
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '20px',
                width: '100%'
              }}>
                <h4 style={{
                  margin: '0 0 15px',
                  fontSize: '12px',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '700',
                  textAlign: 'center'
                }}>
                  Análisis por Dimensiones
                </h4>
                <MetricsBars metrics={metrics} />
              </div>

              {/* 5. ESTADO */}
              <div style={{
                background: 'rgba(22, 125, 183, 0.05)',
                padding: '20px',
                borderRadius: '16px',
                borderLeft: `4px solid ${COLORS.primary}`,
                marginBottom: '20px',
                width: '100%',
                textAlign: 'left'
              }}>
                <h4 style={{
                  margin: '0 0 8px',
                  fontSize: '12px',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '700'
                }}>
                  Estado:
                </h4>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: COLORS.primary
                }}>
                  {archetype.estado}
                </div>
              </div>

              {/* 6. ROLES SUGERIDOS */}
              <div style={{
                background: 'rgba(240, 244, 248, 0.5)',
                padding: '20px',
                borderRadius: '16px',
                borderLeft: `4px solid ${COLORS.accent}`,
                marginBottom: '20px',
                width: '100%',
                textAlign: 'left'
              }}>
                <h4 style={{
                  margin: '0 0 8px',
                  fontSize: '12px',
                  color: COLORS.muted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '700'
                }}>
                  Roles sugeridos:
                </h4>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: COLORS.accent,
                  lineHeight: '1.5'
                }}>
                  {perfilTipo === 'creativo' ? archetype.roles_creativo : archetype.roles_analitico}
                </div>
              </div>

              {/* 7. CTA INFOJOBS */}
              <div style={{ 
                background: `rgba(22, 125, 183, 0.05)`,
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '20px',
                border: `2px solid rgba(22, 125, 183, 0.15)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
              }}>
                <p style={{ 
                  fontSize: '13px',
                  color: COLORS.muted,
                  fontStyle: 'italic',
                  marginBottom: '15px',
                  lineHeight: '1.5',
                  textAlign: 'center'
                }}>
                  {archetype.nota}
                </p>
                
                <a
                  href={INFOJOBS_LINKS[`${archetype.id}_${perfilTipo}`] || INFOJOBS_LINKS[`${archetype.id}_creativo`]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    className="action-button"
                    style={{
                    margin: '0 auto',
                    display: 'flex',
                    maxWidth: '320px',
                    width: 'auto',
                    background: COLORS.accent,
                    color: 'white',
                    padding: window.innerWidth >= 768 ? '16px 40px' : '14px 32px',
                    borderRadius: '50px',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: window.innerWidth >= 768 ? '14px' : '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(255, 145, 44, 0.25)',
                    transition: 'all 0.3s ease',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    Ver Ofertas en InfoJobs
                    <span style={{ fontSize: '14px' }}>→</span>
                  </button>
                </a>
              </div>

              <button
                onClick={() => window.location.reload()}
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: COLORS.muted,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '10px'
                }}
              >
                Repetir test
              </button>
            </div>

            {/* SECCIÓN CREADORA */}
            <div style={{ 
              maxWidth: '550px',
              width: '100%',
              margin: '60px auto 40px',
              padding: '35px 25px',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1px solid rgba(22, 125, 183, 0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
                marginBottom: '25px',
                opacity: 0.3
              }}></div>
              
              <h3 style={{
                fontSize: '13px',
                color: COLORS.muted,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                💡 Sobre este proyecto
              </h3>
              
              <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                margin: '0 auto 18px',
                overflow: 'hidden',
                border: `3px solid ${COLORS.primary}`,
                boxShadow: `0 0 20px rgba(22, 125, 183, 0.3)`
              }}>
                <img
                  src="/tania-bio.jpeg"
                  alt="Tania de Azevedo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
                />
              </div>
              
              <h4 style={{
                fontSize: '19px',
                fontWeight: '700',
                color: COLORS.text,
                marginBottom: '8px'
              }}>
                Tania de Azevedo
              </h4>
              
              <p style={{
                fontSize: '14px',
                color: COLORS.muted,
                lineHeight: '1.6',
                marginBottom: '20px',
                maxWidth: '520px',
                margin: '0 auto 20px'
              }}>
Especialista en Branding y Diseño Web<br />enfocada en crear productos que conectan.
              </p>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <a
                  href="https://taniadeazevedo.es/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block', width: 'fit-content', margin: '0 auto' }}
                >
                  <button style={{
                    maxWidth: '280px',
                    width: 'auto',
                    background: COLORS.linkedin,
                    color: 'white',
                    padding: window.innerWidth >= 768 ? '16px 36px' : '14px 28px',
                    borderRadius: '50px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0, 119, 181, 0.25)',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Descubre mi Portfolio
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* FIN CONTAINER RESPONSIVE DESKTOP 650px */}
      </div>
      {/* FIN WRAPPER CON PADDING */}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(2deg); }
          50% { transform: translateY(-15px) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        /* RESPONSIVE DESKTOP - ELEMENTOS MÁS GRANDES */
        @media (min-width: 768px) {
          body {
            background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
          }
          
          /* Títulos más grandes */
          h1 {
            font-size: 38px !important;
          }
          
          /* Preguntas más grandes */
          h2 {
            font-size: 22px !important;
          }
          
          /* Botones de accion controlados */
          .action-button {
            max-width: 320px !important;
            font-size: 14px !important;
          }
          
          /* Opciones más espaciadas */
          .option-button {
            font-size: 15px !important;
            padding: 16px 20px !important;
          }
        }
        
        /* CLASES PARA GRID DE ROLES */
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 15px;
          width: 100%;
          max-width: 550px;
          margin-bottom: 30px;
        }
        
        .role-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        
        .role-label {
          font-size: 0.7rem;
          color: ${COLORS.muted};
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .role-value {
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
};

export default App;
