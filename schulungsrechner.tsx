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
    { name: 'Gleichstellungsgesetz', kosten: 29 },
    { name: 'Arbeitssicherheit', kosten: 29 },
    { name: 'Datenschutz', kosten: 29 },
    { name: 'IT-Security', kosten: 29 },
    { name: 'Brandschutz', kosten: 29 }
  ]);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showUnterweisungen, setShowUnterweisungen] = useState(false);
  const [maxTeilnehmer, setMaxTeilnehmer] = useState(25);
  const [trainerTagessatz, setTrainerTagessatz] = useState(1200);
  const [unterweisungsDauer, setUnterweisungsDauer] = useState(2);
  const [anreiseAnteil, setAnreiseAnteil] = useState(5);
  const [fahrtkosten, setFahrtkosten] = useState(120);
  const [mitarbeiterStundensatz, setMitarbeiterStundensatz] = useState(60);
  const [entlastungsfaktor, setEntlastungsfaktor] = useState(15);
  const [lmsAnschaffung, setLmsAnschaffung] = useState(3800);
  const [lmsHostingJahr, setLmsHostingJahr] = useState(1920);
  const [betrachtungszeitraum, setBetrachtungszeitraum] = useState(3);
  const [ergebnisse, setErgebnisse] = useState({});

  useEffect(() => {
    const results = berechneKosten({
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
    });
    setErgebnisse(results);
  }, [mitarbeiter, unterweisungen, maxTeilnehmer, trainerTagessatz, unterweisungsDauer, anreiseAnteil, fahrtkosten, mitarbeiterStundensatz, entlastungsfaktor, lmsAnschaffung, lmsHostingJahr, betrachtungszeitraum]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
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
            unterweisungsDauer={unterweisungsDauer}
            setUnterweisungsDauer={setUnterweisungsDauer}
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
          />
          <ErgebnisPanel 
            ergebnisse={ergebnisse} 
            betrachtungszeitraum={betrachtungszeitraum}
            entlastungsfaktor={entlastungsfaktor}
          />
        </div>
        
        <DetailAnalyse 
          ergebnisse={ergebnisse}
          betrachtungszeitraum={betrachtungszeitraum}
          entlastungsfaktor={entlastungsfaktor}
          mitarbeiter={mitarbeiter}
          unterweisungen={unterweisungen}
          maxTeilnehmer={maxTeilnehmer}
          trainerTagessatz={trainerTagessatz}
          unterweisungsDauer={unterweisungsDauer}
          anreiseAnteil={anreiseAnteil}
          fahrtkosten={fahrtkosten}
          mitarbeiterStundensatz={mitarbeiterStundensatz}
          lmsAnschaffung={lmsAnschaffung}
          lmsHostingJahr={lmsHostingJahr}
        />
      </div>
      
      <Footer />
    </div>
  );
}
