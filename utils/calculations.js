export const berechneKosten = (params) => {
  const {
    mitarbeiter,
    unterweisungen,
    maxTeilnehmer,
    trainerTagessatz,
    unterweisungsDauer,
    anreiseAnteil,
    fahrtkosten,
    mitarbeiterStundensatz,
    entlastungsfaktor,
    lmsAnschaffung,
    lmsHostingJahr,
    betrachtungszeitraum
  } = params;

  const themen = unterweisungen.length;
  const durchgaengeProThema = Math.ceil(mitarbeiter / maxTeilnehmer);
  const gesamteDurchgaenge = themen * durchgaengeProThema;
  
  // Traditionelle Kosten
  const trainerKosten = gesamteDurchgaenge * trainerTagessatz;
  const fahrkostenGesamt = gesamteDurchgaenge * (maxTeilnehmer * anreiseAnteil / 100) * fahrtkosten;
  const ausfallzeitenTraditionell = mitarbeiter * themen * unterweisungsDauer * mitarbeiterStundensatz;
  const traditionellJahr = trainerKosten + fahrkostenGesamt + ausfallzeitenTraditionell;

  // LMS Kosten
  const lmsHosting = lmsHostingJahr;
  const lmsZusatz = mitarbeiter > 300 ? (mitarbeiter - 300) * 2.2 : 0;
  const contentKostenGesamt = unterweisungen.reduce((sum, u) => sum + (mitarbeiter * u.kosten), 0);
  const ausfallzeitenLMS = mitarbeiter * themen * unterweisungsDauer * mitarbeiterStundensatz * (100 - entlastungsfaktor) / 100;
  const lmsJahreslaufend = lmsHosting + lmsZusatz + contentKostenGesamt + ausfallzeitenLMS;

  // Mehrjahresberechnung
  const traditionellGesamt = traditionellJahr * betrachtungszeitraum;
  const lmsGesamt = (lmsJahreslaufend * betrachtungszeitraum) + lmsAnschaffung;
  const ersparnis = traditionellGesamt - lmsGesamt;
  const ersparnisJahr = traditionellJahr - lmsJahreslaufend;

  let roiMonate = 0;
  if (ersparnisJahr > 0) {
    roiMonate = Math.ceil((lmsAnschaffung / ersparnisJahr) * 12);
  }

  const stundenTraditionell = mitarbeiter * themen * unterweisungsDauer;
  const stundenLMS = mitarbeiter * themen * unterweisungsDauer * (100 - entlastungsfaktor) / 100;

  return {
    traditionellJahr,
    lmsJahreslaufend,
    ersparnis,
    ersparnisJahr,
    roiMonate,
    trainerKosten,
    fahrkostenGesamt,
    ausfallzeitenTraditionell,
    ausfallzeitenLMS,
    lmsHosting,
    lmsZusatz,
    contentKostenGesamt,
    gesamteDurchgaenge,
    stundenTraditionell,
    stundenLMS,
    betrachtungszeitraum,
    lmsAnschaffung
  };
};

export const formatEuro = (betrag) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(betrag);
};
