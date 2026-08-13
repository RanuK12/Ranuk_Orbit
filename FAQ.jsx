/*
  FAQ.jsx — Ranuk Orbit
  Sección de preguntas frecuentes implementada
*/

function FAQSection() {
  const [open, setOpen] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpen(open === index ? null : index);
  };

  const faqItems = [
    {
      question: '¿En qué zonas vuelas?',
      answer: 'Trabajo desde Mar del Plata como base, pero la órbita es mundial. En 2024-2025 ya volé en Argentina, Italia, Marruecos, Tailandia, Holanda, Alemania y Costa Rica. Si el proyecto justifica el viaje, voy.'
    },
    {
      question: '¿Cuánto tarda la entrega?',
      answer: 'Siete días desde el cierre del rodaje. Incluye color grade, corte final y dos rondas de revisión. Si necesitás algo urgente — un teaser para redes en 24-48hs — lo hablamos en el briefing y lo cotizamos aparte.'
    },
    {
      question: '¿Quién tiene los derechos del material?',
      answer: 'Vos. Cada entrega incluye derechos completos para uso comercial y editorial, sin marca de agua, sin pago por uso. Yo solo me reservo el derecho de mostrar el material en mi portfolio y redes — siempre con tu autorización previa si el proyecto es confidencial.'
    },
    {
      question: '¿Tenés licencia de drone?',
      answer: 'Sí. Piloto registrado en ANAC (Argentina) y opero con DJI Mini 4 Pro — equipo aprobado para vuelo en zonas reguladas internacionales. Para cada proyecto gestiono los permisos locales si hacen falta.'
    },
    {
      question: '¿Cómo facturás?',
      answer: 'Acepto transferencia bancaria en pesos, USD o EUR, USDT (red TRC20 o ERC20), y Wise para clientes internacionales. La factura sale en formato A o C según corresponda. 50% al confirmar el proyecto, 50% contra entrega.'
    },
    {
      question: '¿Hacés casamientos o eventos sociales?',
      answer: 'No es mi foco principal — me especializo en cinematografía de viaje, marca y editorial. Si tu evento tiene un componente cinematográfico fuerte (locación icónica, narrativa visual clara), lo conversamos sin problema.'
    }
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <button 
                className={`faq-question ${open === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
                <span className="faq-icon">{open === index ? '−' : '+'}</span>
              </button>
              {open === index && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}