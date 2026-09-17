// Single source of truth for the /digitalni-cjenik FAQ: used both for the visible
// on-page accordion (DigitalPriceListPage.jsx) and the FAQPage JSON-LD (seoConfig.js).
// Google's structured-data guidelines require FAQPage schema to match visible content,
// so this must not be forked into separate copies again.

export const digitalPriceListFaqHr = [
  ["Odnosi li se nova obveza samo na webshopove?", "Ne. Odluka 1213 obvezu objave digitalnog cjenika veže uz trgovca odnosno pružatelja usluge koji ima uspostavljenu mrežnu stranicu, a ne uz samu mogućnost online kupnje."],
  ["Imam samo prezentacijsku web stranicu. Odnosi li se to na mene?", "Sama činjenica da putem weba ne naplaćujete uslugu ne znači automatski da ste izvan obuhvata. Odluka govori o trgovcima i pružateljima usluga koji imaju uspostavljene mrežne stranice. Za specifične poslovne modele provjerite službena pojašnjenja."],
  ["Koja je razlika između sidrene cijene i digitalnog cjenika?", "Riječ je o dvije povezane, ali odvojene obveze. Odluka 1212 uređuje isticanje dodatne odnosno sidrene cijene, dok Odluka 1213 uređuje objavu strojno čitljivih XML/CSV cjenika na mrežnim stranicama."],
  ["Imam samo Facebook ili Instagram. Moram li imati XML/CSV cjenik?", "Odluka o digitalnom cjeniku govori o objavi XML/CSV datoteka na mrežnim stranicama trgovca odnosno pružatelja usluge. Za poslovanje koje nema vlastitu web stranicu, a koristi samo društvene mreže, konačnu primjenjivost ove konkretne XML/CSV obveze treba provjeriti prema službenim pojašnjenjima nadležnih tijela. To ne znači da se pravila o dodatnoj odnosno sidrenoj cijeni mogu ignorirati pri oglašavanju cijena."],
  ["Moram li svaki put ručno mijenjati cijenu i na webu?", "Ne nužno. Ako poslovni sustav iz kojeg vodite cijene može pružiti odgovarajući strukturirani izvor podataka, web integraciju moguće je automatizirati."],
  ["Vrijedi li za B2B tvrtke?", "Za poslovanje koje je isključivo B2B preporučuje se provjeriti primjenjivost na konkretan slučaj i službena pojašnjenja."],
  ["Je li dovoljan PDF?", "Ne. Odluka izričito navodi objavu cjenika u .xml ili .csv formatu pogodnom za automatsku obradu."],
  ["Koliko dugo se čuvaju stare verzije?", "Objavljeni cjenici trebaju ostati dostupni 30 dana od objave odnosno promjene."],
  ["Treba li WooCommerce?", "Ne. WooCommerce je samo jedna moguća integracija kada cijene već vodite u drugom strukturiranom sustavu."],
  ["Može li se implementirati na Wix?", "Da. Način implementacije razlikuje se od WordPressa, ali digitalni cjenik moguće je povezati i s postojećom Wix stranicom."],
];

export const digitalPriceListFaqEn = [
  ["Does the new obligation apply only to webshops?", "No. Decision 1213 ties the digital-price-list obligation to a trader or service provider with an established website, not to online purchasing itself."],
  ["I only have a presentation website. Does this apply to me?", "The fact that you do not charge for a service through the website does not automatically place you outside the scope. Check official guidance for specific business models."],
  ["What is the difference between an additional/reference price and a digital price list?", "These are related but separate obligations. Decision 1212 governs displaying the additional/reference price, while Decision 1213 governs publishing machine-readable XML/CSV price lists on websites."],
  ["I only have Facebook or Instagram. Do I need an XML/CSV price list?", "For a business without its own website that uses only social media, the final applicability of this specific XML/CSV obligation should be checked against official guidance. This does not mean that additional/reference-price rules can be ignored when advertising prices."],
  ["Do I have to change every price manually on my website?", "Not necessarily. If your business system can provide an appropriate structured data source, web integration can be automated."],
  ["Does this apply to B2B companies?", "Exclusively B2B businesses should verify applicability for their specific case and consult official guidance."],
  ["Is a PDF enough?", "No. The Decision expressly names .xml or .csv formats suitable for automated processing."],
  ["How long are old versions kept?", "Published price lists should remain available for 30 days from publication or change."],
  ["Is WooCommerce required?", "No. WooCommerce is only one possible integration."],
  ["Can it be implemented on Wix?", "Yes. A digital price list can also be connected to an existing Wix site."],
];
