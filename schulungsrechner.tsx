import React, { useState, useEffect } from 'react';
import { TrendingDown, Users, Euro, Download, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

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
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [ergebnisse, setErgebnisse] = useState({});

  const tooltips = {
    mitarbeiter: "Gesamtzahl aller Mitarbeitenden, die Pflichtschulungen absolvieren müssen.",
    maxTeilnehmer: "Maximale Anzahl Personen pro Präsenzschulung. Typisch: 15-25 Personen",
    trainerTagessatz: "Honorar eines externen Trainers pro Tag. Marktüblich: 800-1.500€",
    entlastungsfaktor: "Zeitersparnis durch Online-Lernen. Studien zeigen 15-30% Ersparnis"
  };

  const berechneKosten = () => {
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

    setErgebnisse({
      traditionellJahr, lmsJahreslaufend, ersparnis, ersparnisJahr, roiMonate,
      trainerKosten, fahrkostenGesamt, ausfallzeitenTraditionell, ausfallzeitenLMS,
      lmsHosting, lmsZusatz, contentKostenGesamt, gesamteDurchgaenge,
      stundenTraditionell, stundenLMS, betrachtungszeitraum, lmsAnschaffung
    });
  };

  useEffect(() => {
    berechneKosten();
  }, [mitarbeiter, unterweisungen, maxTeilnehmer, trainerTagessatz, unterweisungsDauer, anreiseAnteil, fahrtkosten, mitarbeiterStundensatz, entlastungsfaktor, lmsAnschaffung, lmsHostingJahr, betrachtungszeitraum]);

  const formatEuro = (betrag) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(betrag);
  };

  const Tooltip = ({ id }) => (
    <div className="relative inline-block">
      <button
        type="button"
        className="ml-2 text-blue-500 hover:text-blue-700"
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {activeTooltip === id && (
        <div className="absolute z-50 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg -top-2 left-8 transform -translate-y-full">
          {tooltips[id]}
        </div>
      )}
    </div>
  );

  const addUnterweisung = () => {
    setUnterweisungen([...unterweisungen, { name: 'Neue Unterweisung', kosten: 29 }]);
  };

  const removeUnterweisung = (index) => {
    if (unterweisungen.length > 1) {
      setUnterweisungen(unterweisungen.filter((_, i) => i !== index));
    }
  };

  const updateUnterweisung = (index, field, value) => {
    const updated = [...unterweisungen];
    updated[index][field] = value;
    setUnterweisungen(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Sparen Sie bis zu 85% Ihrer Schulungskosten
          </h1>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Entdecken Sie Ihr Einsparpotenzial beim Wechsel von Präsenz- zu Online-Unterweisungen
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          
          {/* Parameter Panel */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Ihre Unternehmensdaten
              </h2>

              {/* Haupteingabe */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                  Anzahl Mitarbeiter: {mitarbeiter}
                  <Tooltip id="mitarbeiter" />
                </label>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={mitarbeiter}
                  onChange={(e) => setMitarbeiter(parseInt(e.target.value))}
                  className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>10</span>
                  <span>2.000</span>
                </div>
              </div>

              {/* Erweiterte Einstellungen */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-700 mb-4 hover:text-blue-600"
                >
                  <span>Erweiterte Einstellungen</span>
                  {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Gruppengröße Präsenz: {maxTeilnehmer} Personen
                        <Tooltip id="maxTeilnehmer" />
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        step="10"
                        value={maxTeilnehmer}
                        onChange={(e) => setMaxTeilnehmer(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Trainer-Tagessatz: {formatEuro(trainerTagessatz)}
                        <Tooltip id="trainerTagessatz" />
                      </label>
                      <input
                        type="range"
                        min="600"
                        max="1800"
                        step="50"
                        value={trainerTagessatz}
                        onChange={(e) => setTrainerTagessatz(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Schulungsdauer: {unterweisungsDauer}h
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="0.5"
                        value={unterweisungsDauer}
                        onChange={(e) => setUnterweisungsDauer(parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Anreiseanteil: {anreiseAnteil}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={anreiseAnteil}
                        onChange={(e) => setAnreiseAnteil(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Fahrtkosten: {formatEuro(fahrtkosten)}
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="250"
                        step="10"
                        value={fahrtkosten}
                        onChange={(e) => setFahrtkosten(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        MA-Stundensatz: {formatEuro(mitarbeiterStundensatz)}
                      </label>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        step="5"
                        value={mitarbeiterStundensatz}
                        onChange={(e) => setMitarbeiterStundensatz(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Zeitersparnis Online: {entlastungsfaktor}%
                        <Tooltip id="entlastungsfaktor" />
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={entlastungsfaktor}
                        onChange={(e) => setEntlastungsfaktor(parseInt(e.target.value))}
                        className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        LMS-Anschaffung: {formatEuro(lmsAnschaffung)}
                      </label>
                      <input
                        type="range"
                        min="2000"
                        max="6000"
                        step="200"
                        value={lmsAnschaffung}
                        onChange={(e) => setLmsAnschaffung(parseInt(e.target.value))}
                        className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        LMS-Hosting/Jahr: {formatEuro(lmsHostingJahr)}
                      </label>
                      <input
                        type="range"
                        min="1200"
                        max="12000"
                        step="160"
                        value={lmsHostingJahr}
                        onChange={(e) => setLmsHostingJahr(parseInt(e.target.value))}
                        className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Betrachtungszeitraum: {betrachtungszeitraum} Jahre
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={betrachtungszeitraum}
                        onChange={(e) => setBetrachtungszeitraum(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Unterweisungen */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowUnterweisungen(!showUnterweisungen)}
                  className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-700 mb-4 hover:text-blue-600"
                >
                  <span>Unterweisungen ({unterweisungen.length} Themen)</span>
                  {showUnterweisungen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>

                {showUnterweisungen && (
                  <div className="space-y-3">
                    {unterweisungen.map((unterweisung, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          value={unterweisung.name}
                          onChange={(e) => updateUnterweisung(index, 'name', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded text-sm"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={unterweisung.kosten}
                            onChange={(e) => updateUnterweisung(index, 'kosten', parseInt(e.target.value) || 0)}
                            className="w-16 p-2 border border-gray-300 rounded text-sm text-center"
                            min="0"
                            max="200"
                          />
                          <span className="text-sm text-gray-600">€/MA</span>
                        </div>
                        <button
                          onClick={() => removeUnterweisung(index)}
                          disabled={unterweisungen.length <= 1}
                          className={`px-2 py-1 rounded text-sm ${
                            unterweisungen.length <= 1 
                              ? 'bg-gray-200 text-gray-400' 
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addUnterweisung}
                      className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 text-sm font-medium"
                    >
                      + Unterweisung hinzufügen
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ergebnis Panel */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-green-600" />
                Live-Ergebnis
              </h2>

              {/* Hauptergebnis */}
              <div className="text-center mb-6 p-4 bg-green-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">
                  Ersparnis über {betrachtungszeitraum} Jahre
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatEuro(ergebnisse.ersparnis || 0)}
                </div>
                <div className="text-sm text-gray-700">
                  {formatEuro(ergebnisse.ersparnisJahr || 0)} pro Jahr ab Jahr 2
                </div>
                {ergebnisse.roiMonate > 0 && ergebnisse.roiMonate <= 36 && (
                  <div className="mt-2 text-xs text-blue-600 font-semibold">
                    💡 ROI nach {ergebnisse.roiMonate} Monaten!
                  </div>
                )}
              </div>

              {/* Live Indikator */}
              <div className="mb-4 text-center">
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  Live-Berechnung
                </div>
              </div>

              {/* Kostenvergleich */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-4 text-center">Kostenvergleich (jährlich)</h3>
                
                <div className="flex justify-center items-end gap-3 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Traditionell</div>
                    <div className="text-sm font-bold text-blue-800 mb-2">
                      {formatEuro(ergebnisse.traditionellJahr || 0)}
                    </div>
                    <div className="w-12 bg-blue-400 rounded" style={{ height: '80px' }}></div>
                  </div>

                  <div className="flex flex-col items-center justify-center pb-8">
                    <div className="text-lg font-bold text-gray-400 mb-2">VS</div>
                    <div className="text-xs text-gray-500 text-center">
                      Ersparnis:<br/>
                      <span className="font-bold text-green-600">
                        {formatEuro(ergebnisse.ersparnisJahr || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-xs font-semibold text-gray-700 mb-1">lern.link LMS</div>
                    <div className="text-sm font-bold text-orange-800 mb-2">
                      {formatEuro((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum))}
                    </div>
                    <div 
                      className="w-12 bg-orange-400 rounded transition-all duration-300"
                      style={{ 
                        height: `${Math.max((((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum)) / (ergebnisse.traditionellJahr || 1)) * 80, 20)}px`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Kosteneinsparung:</span>
                  <span className="font-bold text-green-600">
                    {((Math.abs(ergebnisse.ersparnisJahr || 0)) / (ergebnisse.traditionellJahr || 1) * 100).toFixed(0)}%
                  </span>
                </div>
                {ergebnisse.roiMonate > 0 && ergebnisse.roiMonate <= 36 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">ROI erreicht nach:</span>
                    <span className="font-bold text-blue-600">{ergebnisse.roiMonate} Monaten</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Trainings gesamt:</span>
                  <span className="font-medium">{ergebnisse.gesamteDurchgaenge || 0}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a 
                  href="https://service.lern.link/calendar/beratung-fur-ihr-e-learning-projekt-3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm text-center block no-underline"
                >
                  💬 Kostenlose Beratung
                </a>
                <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  PDF-Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detaillierte Analyse */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Detaillierte Kostenanalyse</h3>
          
          {/* Balken und Legenden in zwei Spalten */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Linke Spalte: Traditionell */}
            <div className="flex flex-col items-center">
              {/* Traditioneller Balken */}
              <div className="flex flex-col items-center mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  Traditionelle<br/>Unterweisungen
                </div>
                <div className="text-lg font-bold text-blue-800 mb-3">
                  {formatEuro(ergebnisse.traditionellJahr || 0)}
                </div>
                
                <div className="w-20 bg-gray-100 rounded-lg shadow-lg overflow-hidden relative flex flex-col justify-end" style={{ height: '200px' }}>
                  <div
                    className="bg-blue-700 w-full"
                    style={{ height: `${((ergebnisse.trainerKosten || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
                  ></div>
                  <div
                    className="bg-blue-500 w-full"
                    style={{ height: `${((ergebnisse.fahrkostenGesamt || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
                  ></div>
                  <div
                    className="bg-blue-300 w-full"
                    style={{ height: `${((ergebnisse.ausfallzeitenTraditionell || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
                  ></div>
                </div>
              </div>

              {/* Traditionelle Legende */}
              <div className="bg-blue-50 p-4 rounded-lg w-full border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Traditionelle Unterweisungen</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-700 rounded"></div>
                      <span>Trainer-Kosten:</span>
                    </div>
                    <span className="font-medium">{formatEuro(ergebnisse.trainerKosten || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Fahrtkosten:</span>
                    </div>
                    <span className="font-medium">{formatEuro(ergebnisse.fahrkostenGesamt || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-300 rounded"></div>
                      <span>Ausfallzeiten:</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{ergebnisse.stundenTraditionell?.toFixed(0) || 0} Stunden</div>
                      <span className="font-medium">{formatEuro(ergebnisse.ausfallzeitenTraditionell || 0)}</span>
                    </div>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-3">
                    <div className="flex justify-between font-bold text-blue-800">
                      <span>Summe:</span>
                      <span>{formatEuro(ergebnisse.traditionellJahr || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rechte Spalte: LMS */}
            <div className="flex flex-col items-center">
              {/* LMS Balken */}
              <div className="flex flex-col items-center mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  lern.link<br/>LMS
                </div>
                <div className="text-lg font-bold text-orange-800 mb-3">
                  {formatEuro((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum))}
                </div>
                
                <div 
                  className="w-20 bg-gray-100 rounded-lg shadow-lg overflow-hidden relative flex flex-col justify-end"
                  style={{ 
                    height: '200px',
                    paddingTop: `${200 - (((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum)) / (ergebnisse.traditionellJahr || 1)) * 200}px`
                  }}
                >
                  <div
                    className="bg-orange-700 w-full"
                    style={{
                      height: `${((ergebnisse.contentKostenGesamt || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px`
                    }}
                  ></div>
                  {ergebnisse.lmsZusatz > 0 && (
                    <div
                      className="bg-orange-500 w-full"
                      style={{ height: `${((ergebnisse.lmsZusatz || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
                    ></div>
                  )}
                  <div
                    className="bg-orange-400 w-full"
                    style={{ height: `${((ergebnisse.lmsHosting || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
                  ></div>
                  <div
                    className="bg-orange-600 w-full"
                    style={{ height: `${(((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
                  ></div>
                  <div
                    className="bg-orange-300 w-full"
                    style={{ height: `${((ergebnisse.ausfallzeitenLMS || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
                  ></div>
                </div>
              </div>

              {/* LMS Legende */}
              <div className="bg-orange-50 p-4 rounded-lg w-full border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3">lern.link-LMS</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-700 rounded"></div>
                      <span>Content-Kosten:</span>
                    </div>
                    <span className="font-medium">{formatEuro(ergebnisse.contentKostenGesamt || 0)}</span>
                  </div>
                  {ergebnisse.lmsZusatz > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span>Zusatzkosten (&gt;300 MA):</span>
                      </div>
                      <span className="font-medium">{formatEuro(ergebnisse.lmsZusatz || 0)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-400 rounded"></div>
                      <span>LMS-Hosting:</span>
                    </div>
                    <span className="font-medium">{formatEuro(ergebnisse.lmsHosting || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-600 rounded"></div>
                      <span>LMS-Anschaffung: {formatEuro(ergebnisse.lmsAnschaffung || 0)}</span>
                    </div>
                    <span className="font-medium">{formatEuro((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-300 rounded"></div>
                      <span>Optimierte Ausfallzeiten:</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{ergebnisse.stundenLMS?.toFixed(0) || 0} Stunden (-{entlastungsfaktor}%)</div>
                      <span className="font-medium">{formatEuro(ergebnisse.ausfallzeitenLMS || 0)}</span>
                    </div>
                  </div>
                  <div className="border-t border-orange-200 pt-2 mt-3">
                    <div className="flex justify-between font-bold text-orange-800">
                      <span>Summe:</span>
                      <span>{formatEuro((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VS-Anzeige und Breakdown */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-8 p-4 bg-gray-50 rounded-lg">
              <div><strong>Traditionell:</strong> {formatEuro(ergebnisse.traditionellJahr || 0)}</div>
              <div className="text-2xl font-bold text-gray-400">VS</div>
              <div><strong>lern.link LMS:</strong> {formatEuro((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum))}</div>
              <div className="text-green-600"><strong>Ersparnis:</strong> {formatEuro(ergebnisse.ersparnisJahr || 0)} ({((Math.abs(ergebnisse.ersparnisJahr || 0)) / (ergebnisse.traditionellJahr || 1) * 100).toFixed(0)}%)</div>
              <div><strong>ROI nach:</strong> {
                (ergebnisse.roiMonate > 0 && ergebnisse.roiMonate <= 36) 
                  ? `${ergebnisse.roiMonate} Monaten` 
                  : 'mehr als 3 Jahren'
              }</div>
            </div>
          </div>

          {/* Parameter Summary */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-600">
            <h4 className="text-base font-semibold text-gray-800 mb-4">📊 Verwendete Parameter</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 text-sm text-gray-600">
              <div><strong>Mitarbeiter:</strong> {mitarbeiter}</div>
              <div><strong>Betrachtungszeitraum:</strong> {betrachtungszeitraum} Jahre</div>
              <div><strong>Unterweisungen:</strong> {unterweisungen.length} Themen</div>
              <div><strong>Gruppengröße Präsenz:</strong> {maxTeilnehmer} Personen</div>
              <div><strong>Trainer-Tagessatz:</strong> {formatEuro(trainerTagessatz)}</div>
              <div><strong>Schulungsdauer:</strong> {unterweisungsDauer}h</div>
              <div><strong>Anreiseanteil:</strong> {anreiseAnteil}%</div>
              <div><strong>Fahrtkosten:</strong> {formatEuro(fahrtkosten)}</div>
              <div><strong>MA-Stundensatz:</strong> {formatEuro(mitarbeiterStundensatz)}</div>
              <div><strong>Zeitersparnis Online:</strong> {entlastungsfaktor}%</div>
              <div><strong>LMS-Anschaffung:</strong> {formatEuro(lmsAnschaffung)}</div>
              <div><strong>LMS-Hosting/Jahr:</strong> {formatEuro(lmsHostingJahr)}</div>
              <div className="col-span-full pt-2 border-t border-gray-300 text-xs">
                <strong>Unterweisungsthemen:</strong> {unterweisungen.map(u => `${u.name} (${u.kosten}€/MA)`).join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <div className="flex justify-center items-center mb-2">
            <Euro className="h-5 w-5 mr-2 text-blue-600" />
            <span className="text-lg font-semibold">lern.link GmbH – Ihr Moodle Premium Partner</span>
          </div>
          <p className="text-sm">Open Source • 100% Hosting in Deutschland • Attraktives Design</p>
        </div>
      </div>
    </div>
  );
}
