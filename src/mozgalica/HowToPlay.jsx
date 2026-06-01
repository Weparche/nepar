const STEPS = [
  {
    num: 1,
    title: "Odaberi 4 pojma",
    text: "Pronađi četiri riječi koje imaju nešto zajedničko i dodirni ih.",
  },
  {
    num: 2,
    title: "Provjeri vezu",
    text: "Klikni „Provjeri odabir” i saznaj jesi li pogodio skrivenu grupu.",
  },
  {
    num: 3,
    title: "Podijeli rezultat",
    text: "Riješi sve četiri grupe i izazovi prijatelje da vide tko je brži.",
  },
];

export default function HowToPlay() {
  return (
    <section className="mz-section" id="kako-se-igra" data-testid="how-to-play">
      <h2 className="mz-section__title">Kako se igra?</h2>
      <p className="mz-section__subtitle">
        Jednostavna pravila, zabavna igra — svaki dan nova mozgalica.
      </p>
      <div className="mz-steps">
        {STEPS.map((step) => (
          <article key={step.num} className="mz-step">
            <div className="mz-step__num">{step.num}</div>
            <h3 className="mz-step__title">{step.title}</h3>
            <p className="mz-step__text">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
