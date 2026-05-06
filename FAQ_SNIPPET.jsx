/*
  FAQ_SNIPPET.jsx — Ranuk Orbit
  Accordion FAQ. Respuestas escritas en primera persona,
  positivas, profesionales, sin tecnicismos innecesarios.

  Cómo aplicarlo:
  Pegar dentro de ranuk-sections.jsx y montar en App
  ANTES de <ContactSection /> (queda perfecto después de HowIWork).
*/

function FAQSection() {
  const { lang } = useChangeLang();
  const [open, setOpen] = React.useState(0);

  const COPY = {
    es: {
      kicker: 'Preguntas frecuentes',
      title: 'Lo que más me preguntan.',
      subtitle: 'Si tu duda no está acá, escribime — respondo en menos de 24 horas.',
      contact: '¿Otra pregunta?',
      contactCta: 'Hablemos directo',
      items: [
        {
          q: '¿En qué zonas vuelas?',
          a: 'Trabajo desde Mar del Plata como base, pero la órbita es mundial. En 2024-2025 ya volé en Argentina, Italia, Marruecos, Tailandia, Holanda, Alemania y Costa Rica. Si el proyecto justifica el viaje, voy.',
        },
        {
          q: '¿Cuánto tarda la entrega?',
          a: 'Siete días desde el cierre del rodaje. Incluye color grade, corte final y dos rondas de revisión. Si necesitás algo urgente — un teaser para redes en 24-48hs — lo hablamos en el briefing y lo cotizamos aparte.',
        },
        {
          q: '¿Quién tiene los derechos del material?',
          a: 'Vos. Cada entrega incluye derechos completos para uso comercial y editorial, sin marca de agua, sin pago por uso. Yo solo me reservo el derecho de mostrar el material en mi portfolio y redes — siempre con tu autorización previa si el proyecto es confidencial.',
        },
        {
          q: '¿Tenés licencia de drone?',
          a: 'Sí. Piloto registrado en ANAC (Argentina) y opero con DJI Mini 4 Pro — equipo aprobado para vuelo en zonas reguladas internacionales. Para cada proyecto gestiono los permisos locales si hacen falta.',
        },
        {
          q: '¿Cómo facturás?',
          a: 'Acepto transferencia bancaria en pesos, USD o EUR, USDT (red TRC20 o ERC20), y Wise para clientes internacionales. La factura sale en formato A o C según corresponda. 50% al confirmar el proyecto, 50% contra entrega.',
        },
        {
          q: '¿Hacés casamientos o eventos sociales?',
          a: 'No es mi foco principal — me especializo en cinematografía de viaje, marca y editorial. Si tu evento tiene un componente cinematográfico fuerte (locación icónica, narrativa visual clara), lo conversamos sin problema.',
        },
        {
          q: '¿Trabajás con agencias?',
          a: 'Sí. Tengo experiencia colaborando con agencias creativas y productoras. Puedo entregar en formatos master broadcast (ProRes, DNxHR), seguir guías de marca específicas y firmar acuerdos de confidencialidad. Pedime portfolio extendido.',
        },
        {
          q: '¿Aceptás briefs internacionales?',
          a: 'Por supuesto. Los gastos de viaje, alojamiento y permisos los cotizo aparte y de forma transparente. Para proyectos en Europa o Latinoamérica suelo aprovechar viajes ya planificados — preguntame por las fechas en las que voy a estar cerca.',
        },
        {
          q: '¿Trabajás con Ray-Ban Meta como contenido oficial?',
          a: 'Soy creador POV con Ray-Ban Meta desde 2024. El formato POV inmersivo lo integro en proyectos que pidan una mirada en primera persona — autenticidad de viaje, marca personal, behind-the-scenes. Es complementario al drone, no sustituto.',
        },
        {
          q: '¿Qué pasa si el clima no acompaña?',
          a: 'Está incluido en cómo planeo el proyecto. Para rodajes de 1 día, monitoreo el clima 72 hs antes y reagendamos si hace falta — sin costo. Para rodajes de varios días, planificamos buffers y locaciones alternativas en el scouting.',
        },
      ],
    },
    en: {
      kicker: 'Frequently asked',
      title: 'What I get asked the most.',
      subtitle: 'If your question isn\'t here, write me — I reply within 24 hours.',
      contact: 'Got another question?',
      contactCta: 'Let\'s talk',
      items: [
        {
          q: 'What areas do you fly in?',
          a: 'I work out of Mar del Plata as a base, but the orbit is worldwide. In 2024-2025 I\'ve flown in Argentina, Italy, Morocco, Thailand, the Netherlands, Germany and Costa Rica. If the project justifies the trip, I go.',
        },
        {
          q: 'How long until delivery?',
          a: 'Seven days from wrap. Includes color grade, final cut and two rounds of revisions. If you need something urgent — a teaser for socials in 24-48h — we talk it through during briefing and quote it separately.',
        },
        {
          q: 'Who owns the rights to the material?',
          a: 'You do. Every delivery includes full commercial and editorial rights, no watermark, no usage fees. I only reserve the right to feature the work in my portfolio and socials — always with your prior approval if the project is confidential.',
        },
        {
          q: 'Are you a licensed drone pilot?',
          a: 'Yes. Registered pilot with ANAC (Argentina) operating a DJI Mini 4 Pro — approved equipment for regulated international airspace. For each project I handle local permits if needed.',
        },
        {
          q: 'How do you invoice?',
          a: 'I accept bank transfer in ARS, USD or EUR, USDT (TRC20 or ERC20), and Wise for international clients. Invoice comes in formato A or C as applicable. 50% on project confirmation, 50% against delivery.',
        },
        {
          q: 'Do you shoot weddings or social events?',
          a: 'Not my main focus — I specialize in travel, brand and editorial cinematography. If your event has a strong cinematic component (iconic location, clear visual narrative), let\'s talk.',
        },
        {
          q: 'Do you work with agencies?',
          a: 'Yes. I\'ve collaborated with creative agencies and production companies. I can deliver master broadcast formats (ProRes, DNxHR), follow specific brand guidelines and sign NDAs. Ask for the extended portfolio.',
        },
        {
          q: 'Do you take international briefs?',
          a: 'Absolutely. Travel, accommodation and permit costs are quoted separately and transparently. For projects in Europe or Latin America I often piggyback on trips already planned — ask me about the dates I\'ll be in your region.',
        },
        {
          q: 'Do you create as official Ray-Ban Meta content?',
          a: 'I\'ve been a Ray-Ban Meta POV creator since 2024. The immersive POV format slots into projects that call for a first-person perspective — travel authenticity, personal branding, behind-the-scenes. It complements the drone work, doesn\'t replace it.',
        },
        {
          q: 'What if the weather turns bad?',
          a: 'Built into how I plan. For single-day shoots I monitor weather 72h ahead and reschedule if needed — no charge. For multi-day shoots, we plan buffers and alternate locations during scouting.',
        },
      ],
    },
  };
  const L = COPY[lang] || COPY.es;

  return (
    <section className="section section-light faq-section" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <header className="faq-head" data-reveal>
          <span className="kicker">{L.kicker}</span>
          <h2 className="section-title" id="faq-title">{L.title}</h2>
          <p className="section-subtitle">{L.subtitle}</p>
        </header>

        <div className="faq-list" role="list">
          {L.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                role="listitem"
                data-reveal
                style={{transitionDelay: `${Math.min(i * 0.04, 0.4)}s`}}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                <div
                  className="faq-answer"
                  id={`faq-a-${i}`}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-footer" data-reveal>
          <p className="faq-footer-text">{L.contact}</p>
          <a href="#contact" className="btn-secondary">{L.contactCta}</a>
        </div>
      </div>
    </section>
  );
}
