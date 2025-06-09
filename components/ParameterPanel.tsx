import React from 'react';
import Tooltip from './Tooltip';
import { formatEuro } from '../utils/calculations';

const allowedDauerValues = [0, 0.5, 1, 2, 4, 6, 8];
const fibonacciGroupSizes = [5, 10, 15, 25, 30, 55, 90, 150, 250, 400, 600, 1000];
const mitarbeiterAnzahlSkala = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000];
const mitarbeiterStundensatzSkala = [0, 10, 20, 30, 45, 60, 80, 100, 125, 150];

export default function ParameterPanel({
  mitarbeiter,
  setMitarbeiter,
  unterweisungen,
  setUnterweisungen,
  showAdvanced,
  setShowAdvanced,
  showUnterweisungen,
  setShowUnterweisungen,
  maxTeilnehmer,
  setMaxTeilnehmer,
  trainerTagessatz,
  setTrainerTagessatz,
  // unterweisungsDauer und setUnterweisungsDauer Props werden entfernt
  anreiseAnteil,
  setAnreiseAnteil,
  fahrtkosten,
  setFahrtkosten,
  mitarbeiterStundensatz,
  setMitarbeiterStundensatz,
  entlastungsfaktor,
  setEntlastungsfaktor,
  lmsAnschaffung,
  setLmsAnschaffung,
  lmsHostingJahr,
  setLmsHostingJahr,
  betrachtungszeitraum,
  setBetrachtungszeitraum,
  raumkostenProTag,
  setRaumkostenProTag,
  beruecksichtigeAusfallzeiten,
  setBeruecksichtigeAusfallzeiten
}) {

  const calculateRaumkostenRange = (currentMaxTeilnehmer) => {
    const minTN = 5, maxTN = 1000;
    const minRK_at_minTN = 0, maxRK_at_minTN = 100;
    const minRK_at_maxTN = 2000, maxRK_at_maxTN = 6000;

    if (currentMaxTeilnehmer <= minTN) return { min: minRK_at_minTN, max: maxRK_at_minTN };
    if (currentMaxTeilnehmer >= maxTN) return { min: minRK_at_maxTN, max: maxRK_at_maxTN };

    const t = (currentMaxTeilnehmer - minTN) / (maxTN - minTN);
    
    const calcMin = Math.round((minRK_at_minTN * (1 - t) + minRK_at_maxTN * t) / 10) * 10;
    const calcMax = Math.round((maxRK_at_minTN * (1 - t) + maxRK_at_maxTN * t) / 10) * 10;
    
    return { min: Math.max(0, calcMin), max: Math.max(calcMin + 10, calcMax) }; // Ensure max > min
  };

  const [currentRaumkostenRange, setCurrentRaumkostenRange] = React.useState(calculateRaumkostenRange(maxTeilnehmer));

  React.useEffect(() => {
    const newRange = calculateRaumkostenRange(maxTeilnehmer);
    setCurrentRaumkostenRange(newRange);
    if (raumkostenProTag < newRange.min) {
      setRaumkostenProTag(newRange.min);
    } else if (raumkostenProTag > newRange.max) {
      setRaumkostenProTag(newRange.max);
    }
  }, [maxTeilnehmer, raumkostenProTag, setRaumkostenProTag]);

  const addUnterweisung = () => {
    setUnterweisungen([...unterweisungen, { name: 'Neue Unterweisung', kosten: 5, dauer: 0.5 }]); // Standarddauer für neue Unterweisung
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
    <div className="w-2/3"> {/* w-full lg:w-2/3 zu w-2/3 geändert */}
      <div className="parameter-panel">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2 text-blue-600">👥</span>
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
            min="0"
            max={mitarbeiterAnzahlSkala.length - 1}
            step="1"
            value={mitarbeiterAnzahlSkala.indexOf(mitarbeiter)}
            onChange={(e) => setMitarbeiter(mitarbeiterAnzahlSkala[parseInt(e.target.value)])}
            className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
            {mitarbeiterAnzahlSkala.map(val => (
              <span key={val} className={`text-center ${val === mitarbeiter ? 'font-bold text-blue-600' : ''}`}>
                {val >= 1000 ? `${val/1000}k` : val}
              </span>
            ))}
          </div>
        </div>

        {/* Erweiterte Einstellungen */}
        <div className="parameter-section">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-700 mb-4 hover:text-blue-600"
          >
            <span>Erweiterte Einstellungen</span>
            {showAdvanced ? <span>▲</span> : <span>▼</span>}
          </button>

          {showAdvanced && (
            <div className="parameter-grid">
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
                  className="slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>1 J.</span>
                  <span>5 J.</span>
                </div>
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Gruppengröße Präsenz: {maxTeilnehmer} Personen
                  <Tooltip id="maxTeilnehmer" />
                </label>
                <input
                  type="range"
                  min="0"
                  max={fibonacciGroupSizes.length - 1}
                  step="1"
                  value={fibonacciGroupSizes.indexOf(maxTeilnehmer)}
                  onChange={(e) => setMaxTeilnehmer(fibonacciGroupSizes[parseInt(e.target.value)])}
                  className="slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  {fibonacciGroupSizes.map(val => (
                    <span key={val} className={`text-center ${val === maxTeilnehmer ? 'font-bold text-blue-600' : ''}`}>
                      {val}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Raumkosten pro Tag: {formatEuro(raumkostenProTag)}
                  <Tooltip id="raumkostenProTag" />
                </label>
                <input
                  type="range"
                  min={currentRaumkostenRange.min}
                  max={currentRaumkostenRange.max}
                  step="10" 
                  value={raumkostenProTag}
                  onChange={(e) => setRaumkostenProTag(parseInt(e.target.value))}
                  className="slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>{formatEuro(currentRaumkostenRange.min)}</span>
                  <span>{formatEuro(currentRaumkostenRange.max)}</span>
                </div>
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
                  className="slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>{formatEuro(600)}</span>
                  <span>{formatEuro(1800)}</span>
                </div>
              </div>
              {/* Globaler Schulungsdauer-Slider wird entfernt */}
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
                  className="slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
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
                  className="slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>{formatEuro(50)}</span>
                  <span>{formatEuro(250)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={beruecksichtigeAusfallzeiten}
                    onChange={(e) => setBeruecksichtigeAusfallzeiten(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  MA-Stundensatz: {beruecksichtigeAusfallzeiten ? formatEuro(mitarbeiterStundensatz) : 'nicht berücksichtigt'}
                </label>
                <input
                  type="range"
                  min="0"
                  max={mitarbeiterStundensatzSkala.length - 1}
                  step="1"
                  value={mitarbeiterStundensatzSkala.indexOf(mitarbeiterStundensatz)}
                  onChange={(e) => setMitarbeiterStundensatz(mitarbeiterStundensatzSkala[parseInt(e.target.value)])}
                  className={`slider-blue ${!beruecksichtigeAusfallzeiten ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!beruecksichtigeAusfallzeiten}
                />
                <div className={`flex justify-between text-xs text-gray-500 mt-1 px-1 ${!beruecksichtigeAusfallzeiten ? 'opacity-50' : ''}`}>
                  {mitarbeiterStundensatzSkala.map(val => (
                    <span key={val} className={`text-center ${val === mitarbeiterStundensatz && beruecksichtigeAusfallzeiten ? 'font-bold text-blue-600' : ''}`}>
                      {formatEuro(val)}
                    </span>
                  ))}
                </div>
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
                  className="slider-orange"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  LMS-Anschaffung: {formatEuro(lmsAnschaffung)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="12000"
                  step="200"
                  value={lmsAnschaffung}
                  onChange={(e) => setLmsAnschaffung(parseInt(e.target.value))}
                  className="slider-orange"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>{formatEuro(0)}</span>
                  <span>{formatEuro(12000)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  LMS-Hosting/Jahr: {formatEuro(lmsHostingJahr)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="12000"
                  step="160"
                  value={lmsHostingJahr}
                  onChange={(e) => setLmsHostingJahr(parseInt(e.target.value))}
                  className="slider-orange"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>{formatEuro(0)}</span>
                  <span>{formatEuro(12000)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Unterweisungen */}
        <div className="parameter-section">
          <button
            onClick={() => setShowUnterweisungen(!showUnterweisungen)}
            className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-700 mb-4 hover:text-blue-600"
          >
            <span>Unterweisungen ({unterweisungen.length} Themen, Gesamt: {unterweisungen.reduce((sum, u) => sum + u.dauer, 0)}h)</span>
            {showUnterweisungen ? <span>▲</span> : <span>▼</span>}
          </button>

          {showUnterweisungen && (
            <div className="space-y-3">
              {unterweisungen.map((unterweisung, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={unterweisung.name}
                    onChange={(e) => updateUnterweisung(index, 'name', e.target.value)}
                    placeholder="Name der Unterweisung"
                    className="w-full md:flex-grow p-2 border border-gray-300 rounded text-sm bg-white"
                  />
                  <div className="w-full md:w-auto">
                    <label htmlFor={`dauer-${index}`} className="text-sm font-medium text-gray-700 mb-1 block md:sr-only">Dauer pro Thema</label>
                    <select
                      id={`dauer-${index}`}
                      value={unterweisung.dauer}
                      onChange={(e) => updateUnterweisung(index, 'dauer', parseFloat(e.target.value))}
                      className="w-full md:w-24 p-2 border border-gray-300 rounded text-sm bg-white"
                    >
                      {allowedDauerValues.map(val => (
                        <option key={val} value={val}>{val}h</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-auto">
                    <label htmlFor={`kosten-${index}`} className="text-sm font-medium text-gray-700 mb-1 block md:sr-only">Kosten pro Thema/MA</label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`kosten-${index}`}
                        type="number"
                        value={unterweisung.kosten}
                        onChange={(e) => updateUnterweisung(index, 'kosten', parseInt(e.target.value) || 0)}
                        className="w-full md:w-20 p-2 border border-gray-300 rounded text-sm text-center bg-white"
                        min="0"
                        max="200"
                      />
                      <span className="text-sm text-gray-600">€/MA</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeUnterweisung(index)}
                    disabled={unterweisungen.length <= 1}
                    className={`px-3 py-2 rounded text-sm self-end md:self-center ${
                      unterweisungen.length <= 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    🗑️
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
  );
}
