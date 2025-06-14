import React, { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import ParameterPanel from './components/ParameterPanel';
import ErgebnisPanel from './components/ErgebnisPanel';
import DetailAnalyse from './components/DetailAnalyse';
import Footer from './components/Footer';
import { berechneKosten } from './utils/calculations';
import './styles/main.css';

export default function LernlinkKostenrechner() {
  const [mitarbeiter, setMitarbeiter] = useState(100);
  const [unterweisungen, setUnterweisungen] = useState([
    { name: 'Gleichstellungsgesetz', kosten: 5, dauer: 0.5, erstellungsStunden: 8, pflegeStundenJahr: 1 },
    { name: 'Arbeitssicherheit', kosten: 5, dauer: 0.5, erstellungsStunden: 8, pflegeStundenJahr: 1 },
    { name: 'Datenschutz', kosten: 5, dauer: 0.5, erstellungsStunden: 10, pflegeStundenJahr: 2 },
    { name: 'IT-Security', kosten: 5, dauer: 0.5, erstellungsStunden: 12, pflegeStundenJahr: 2 },
    { name: 'Brandschutz', kosten: 5, dauer: 0.5, erstellungsStunden: 6, pflegeStundenJahr: 1 }
  ]);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showUnterweisungen, setShowUnterweisungen] = useState(false);
  const [maxTeilnehmer, setMaxTeilnehmer] = useState(25); // Geändert von 21 auf 25
  const [trainerTagessatz, setTrainerTagessatz] = useState(1200);
  // unterweisungsDauer state wird entfernt
  const [anreiseAnteil, setAnreiseAnteil] = useState(5);
  const [fahrtkosten, setFahrtkosten] = useState(120);
  const [mitarbeiterStundensatz, setMitarbeiterStundensatz] = useState(60);
  const [entlastungsfaktor, setEntlastungsfaktor] = useState(15);
  const [lmsAnschaffung, setLmsAnschaffung] = useState(3800);
  const [lmsHostingJahr, setLmsHostingJahr] = useState(1920);
  const [betrachtungszeitraum, setBetrachtungszeitraum] = useState(3);
  const [raumkostenProTag, setRaumkostenProTag] = useState(150);
  const [beruecksichtigeAusfallzeiten, setBeruecksichtigeAusfallzeiten] = useState(true);
  
  // States für Content-Kosten Modi
  const [contentKostenModus, setContentKostenModus] = useState('kaufen'); // 'kaufen', 'machen', 'pauschale'
  // contentErstellungsStundenGesamt und contentPflegeStundenJahrGesamt entfernt
  const [entwicklerStundensatz, setEntwicklerStundensatz] = useState(75);
  const [contentPauschaleJahrGesamt, setContentPauschaleJahrGesamt] = useState(1000);

  const [waehrung, setWaehrung] = useState('EUR'); // Neuer State für Währung

  const [ergebnisse, setErgebnisse] = useState({});

  useEffect(() => {
    // Berechne die gesamte Unterweisungsdauer aus den einzelnen Unterweisungen
    const gesamteUnterweisungsDauer = unterweisungen.reduce((sum, u) => sum + u.dauer, 0);

    const results = berechneKosten({
      mitarbeiter,
      unterweisungen, // unterweisungen enthält jetzt die einzelnen Dauern
      maxTeilnehmer,
      trainerTagessatz,
      gesamteUnterweisungsDauer, // Übergabe der summierten Dauer
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
    });
    setErgebnisse(results);
  }, [
    mitarbeiter, unterweisungen, maxTeilnehmer, trainerTagessatz, anreiseAnteil, fahrtkosten, 
    mitarbeiterStundensatz, entlastungsfaktor, lmsAnschaffung, lmsHostingJahr, betrachtungszeitraum, 
    raumkostenProTag, beruecksichtigeAusfallzeiten, contentKostenModus, 
    entwicklerStundensatz, contentPauschaleJahrGesamt, waehrung // Abhängigkeiten aktualisiert
  ]);
  // unterweisungsDauer aus den Dependencies entfernt

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeroSection />
      
      <div className="container mx-auto px-2 md:px-4 py-8"> {/* Horizontalen Padding für kleine Bildschirme reduziert */}
        <div className="flex flex-row gap-8 max-w-7xl mx-auto"> {/* lg:flex-row zu flex-row geändert */}
          <ParameterPanel 
            mitarbeiter={mitarbeiter}
            setMitarbeiter={setMitarbeiter}
            unterweisungen={unterweisungen}
            setUnterweisungen={setUnterweisungen}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            showUnterweisungen={showUnterweisungen}
            setShowUnterweisungen={setShowUnterweisungen}
            maxTeilnehmer={maxTeilnehmer}
            setMaxTeilnehmer={setMaxTeilnehmer}
            trainerTagessatz={trainerTagessatz}
            setTrainerTagessatz={setTrainerTagessatz}
            // unterweisungsDauer und setUnterweisungsDauer Props werden entfernt
            anreiseAnteil={anreiseAnteil}
            setAnreiseAnteil={setAnreiseAnteil}
            fahrtkosten={fahrtkosten}
            setFahrtkosten={setFahrtkosten}
            mitarbeiterStundensatz={mitarbeiterStundensatz}
            setMitarbeiterStundensatz={setMitarbeiterStundensatz}
            entlastungsfaktor={entlastungsfaktor}
            setEntlastungsfaktor={setEntlastungsfaktor}
            lmsAnschaffung={lmsAnschaffung}
            setLmsAnschaffung={setLmsAnschaffung}
            lmsHostingJahr={lmsHostingJahr}
            setLmsHostingJahr={setLmsHostingJahr}
            betrachtungszeitraum={betrachtungszeitraum}
            setBetrachtungszeitraum={setBetrachtungszeitraum}
            raumkostenProTag={raumkostenProTag}
            setRaumkostenProTag={setRaumkostenProTag}
            beruecksichtigeAusfallzeiten={beruecksichtigeAusfallzeiten}
            setBeruecksichtigeAusfallzeiten={setBeruecksichtigeAusfallzeiten}
            contentKostenModus={contentKostenModus}
            setContentKostenModus={setContentKostenModus}
            // contentErstellungsStundenGesamt, setContentErstellungsStundenGesamt entfernt
            // contentPflegeStundenJahrGesamt, setContentPflegeStundenJahrGesamt entfernt
            entwicklerStundensatz={entwicklerStundensatz}
            setEntwicklerStundensatz={setEntwicklerStundensatz}
            contentPauschaleJahrGesamt={contentPauschaleJahrGesamt}
            setContentPauschaleJahrGesamt={setContentPauschaleJahrGesamt}
            waehrung={waehrung} // Prop hinzufügen
            setWaehrung={setWaehrung} // Prop hinzufügen
          />
          <ErgebnisPanel 
            ergebnisse={ergebnisse} 
            betrachtungszeitraum={betrachtungszeitraum}
            entlastungsfaktor={entlastungsfaktor}
            waehrung={waehrung} // Prop hinzufügen
          />
        </div>
        
        <DetailAnalyse 
          ergebnisse={ergebnisse}
          betrachtungszeitraum={betrachtungszeitraum}
          entlastungsfaktor={entlastungsfaktor}
          mitarbeiter={mitarbeiter}
          unterweisungen={unterweisungen} // unterweisungen enthält jetzt die einzelnen Dauern
          maxTeilnehmer={maxTeilnehmer}
          trainerTagessatz={trainerTagessatz}
          // unterweisungsDauer Prop wird entfernt, stattdessen wird die Summe indirekt über ergebnisse.stunden... genutzt
          anreiseAnteil={anreiseAnteil}
          fahrtkosten={fahrtkosten}
          mitarbeiterStundensatz={mitarbeiterStundensatz}
          lmsAnschaffung={lmsAnschaffung}
          lmsHostingJahr={lmsHostingJahr}
          beruecksichtigeAusfallzeiten={beruecksichtigeAusfallzeiten}
          contentKostenModus={contentKostenModus}
          // contentErstellungsStundenGesamt, contentPflegeStundenJahrGesamt entfernt
          entwicklerStundensatz={entwicklerStundensatz}
          contentPauschaleJahrGesamt={contentPauschaleJahrGesamt}
          waehrung={waehrung} // Prop hinzufügen
        />
      </div>
      
      <Footer />
    </div>
  );
}
