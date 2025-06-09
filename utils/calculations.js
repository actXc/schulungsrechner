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
    raumkostenProTag,
    beruecksichtigeAusfallzeiten,
    contentKostenModus,
    // contentErstellungsStundenGesamt, contentPflegeStundenJahrGesamt entfernt
    entwicklerStundensatz,
    contentPauschaleJahrGesamt
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
  
  let contentKostenKaufen = 0;
  let contentKostenMachenErstellungProJahr = 0;
  let contentKostenMachenPflegeJahr = 0;
  let contentKostenPauschale = 0;
  let contentKostenGesamt = 0;

  if (contentKostenModus === 'kaufen') {
    contentKostenKaufen = unterweisungen.reduce((sum, u) => sum + (mitarbeiter * u.kosten), 0);
    contentKostenGesamt = contentKostenKaufen;
  } else if (contentKostenModus === 'machen') {
    const sumErstellungsStunden = unterweisungen.reduce((sum, u) => sum + (u.erstellungsStunden || 0), 0);
    const sumPflegeStundenJahr = unterweisungen.reduce((sum, u) => sum + (u.pflegeStundenJahr || 0), 0);
    
    const erstellungsKostenEinmalig = sumErstellungsStunden * entwicklerStundensatz;
    contentKostenMachenErstellungProJahr = betrachtungszeitraum > 0 ? erstellungsKostenEinmalig / betrachtungszeitraum : erstellungsKostenEinmalig;
    contentKostenMachenPflegeJahr = sumPflegeStundenJahr * entwicklerStundensatz;
    contentKostenGesamt = contentKostenMachenErstellungProJahr + contentKostenMachenPflegeJahr;
  } else if (contentKostenModus === 'pauschale') {
    contentKostenPauschale = contentPauschaleJahrGesamt;
    contentKostenGesamt = contentKostenPauschale;
  }
  
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
    ausfallzeitenLMS,
    lmsHosting,
    lmsZusatz,
    // Detaillierte Content-Kosten für Analyse
    contentKostenGesamt, // Gesamt-Content-Kosten für die Hauptberechnung
    contentKostenKaufen,
    contentKostenMachenErstellungProJahr,
    contentKostenMachenPflegeJahr,
    contentKostenPauschale,
    contentKostenModusParameter: contentKostenModus, // Um den Modus in der Analyse anzuzeigen

    gesamteDurchgaenge,
    gesamteRaumkosten,
    stundenTraditionell: aktuelleStundenTraditionell,
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
