export const berechneKosten = (params) => {
  const {
    mitarbeiter,
    unterweisungen,
    maxTeilnehmer,
    trainerTagessatz,
    gesamteUnterweisungsDauer, // Geänderter Parametername
    anreiseAnteil,
    fahrtkosten,
    mitarbeiterStundensatz,
    entlastungsfaktor,
    lmsAnschaffung,
    lmsHostingJahr,
    betrachtungszeitraum,
    raumkostenProTag, // Neuer Parameter
    beruecksichtigeAusfallzeiten // Neuer Parameter
  } = params;

  const themen = unterweisungen.length;
  const durchgaengeProThema = Math.ceil(mitarbeiter / maxTeilnehmer);
  const gesamteDurchgaenge = themen * durchgaengeProThema;
  
  // Traditionelle Kosten
  const trainerKosten = gesamteDurchgaenge * trainerTagessatz; // Annahme: gesamteDurchgaenge ist Anzahl Trainer-Tage
  const fahrkostenGesamt = gesamteDurchgaenge * (maxTeilnehmer * anreiseAnteil / 100) * fahrtkosten; // Annahme: Fahrtkosten pro Trainer-Einsatz/Tag

  // Neue Berechnung für Raumkosten:
  // gesamteUnterweisungsDauer ist die Summe der Stunden, die ein Mitarbeiter pro Jahr geschult wird.
  // Ein Raumtag kann maximal 6 Stunden Schulung beinhalten.
  const stundenProGruppe = gesamteUnterweisungsDauer;
  const raumTageProGruppe = Math.ceil(stundenProGruppe / 6); // Benötigte Raumtage pro Gruppe
  const anzahlGruppen = Math.ceil(mitarbeiter / maxTeilnehmer); // Anzahl der Gruppen
  const gesamteRaumTage = raumTageProGruppe * anzahlGruppen; // Gesamte Raumtage über alle Gruppen
  const gesamteRaumkosten = gesamteRaumTage * raumkostenProTag;
  
  let ausfallzeitenTraditionell = 0;
  let ausfallzeitenLMS = 0;
  let aktuelleStundenTraditionell = 0;
  let aktuelleStundenLMS = 0;

  if (beruecksichtigeAusfallzeiten) {
    ausfallzeitenTraditionell = mitarbeiter * gesamteUnterweisungsDauer * mitarbeiterStundensatz;
    ausfallzeitenLMS = mitarbeiter * gesamteUnterweisungsDauer * mitarbeiterStundensatz * (100 - entlastungsfaktor) / 100;
    aktuelleStundenTraditionell = mitarbeiter * gesamteUnterweisungsDauer;
    aktuelleStundenLMS = mitarbeiter * gesamteUnterweisungsDauer * (100 - entlastungsfaktor) / 100;
  }
  
  const traditionellJahr = trainerKosten + fahrkostenGesamt + ausfallzeitenTraditionell + gesamteRaumkosten;

  // LMS Kosten
  const lmsHosting = lmsHostingJahr;
  const lmsZusatz = mitarbeiter > 300 ? (mitarbeiter - 300) * 2.2 : 0;
  const contentKostenGesamt = unterweisungen.reduce((sum, u) => sum + (mitarbeiter * u.kosten), 0);
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

  // themen ist hier nicht mehr nötig
  const stundenTraditionell = mitarbeiter * gesamteUnterweisungsDauer;
  const stundenLMS = mitarbeiter * gesamteUnterweisungsDauer * (100 - entlastungsfaktor) / 100;

  const kostenProTeilnehmerTraditionellJahr = mitarbeiter > 0 ? traditionellJahr / mitarbeiter : 0;
  const lmsAnschaffungProJahr = betrachtungszeitraum > 0 ? lmsAnschaffung / betrachtungszeitraum : lmsAnschaffung;
  const kostenProTeilnehmerLMSJahr = mitarbeiter > 0 ? (lmsJahreslaufend + lmsAnschaffungProJahr) / mitarbeiter : 0;

  return {
    traditionellJahr,
    lmsJahreslaufend,
    ersparnis,
    ersparnisJahr,
    roiMonate,
    trainerKosten,
    fahrkostenGesamt,
    ausfallzeitenTraditionell,
    ausfallzeitenLMS, // Bleibt für die Anzeige, wird aber 0 sein, wenn nicht berücksichtigt
    lmsHosting,
    lmsZusatz,
    contentKostenGesamt,
    gesamteDurchgaenge, // Bezieht sich auf Trainer-Einsätze/Abrechnungseinheiten
    gesamteRaumkosten, // Neu für die Detailanalyse
    stundenTraditionell: aktuelleStundenTraditionell, // Angepasste Stunden
    stundenLMS: aktuelleStundenLMS, // Angepasste Stunden
    betrachtungszeitraum,
    lmsAnschaffung,
    kostenProTeilnehmerTraditionellJahr,
    kostenProTeilnehmerLMSJahr,
    raumkostenProTagParameter: raumkostenProTag // Damit es im Summary angezeigt werden kann
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
