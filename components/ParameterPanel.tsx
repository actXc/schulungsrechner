import React from 'react';
import Tooltip from './Tooltip';
import { formatEuro } from '../utils/calculations';

const allowedDauerValues = [0, 0.5, 1, 2, 4, 6, 8];
const fibonacciGroupSizes = [5, 10, 15, 25, 30, 55, 90, 150, 250, 400, 600, 1000];

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
  setBetrachtungszeitraum
}) {
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
    <div className="w-full lg:w-2/3">
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
                  className="slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>{formatEuro(40)}</span>
                  <span>{formatEuro(100)}</span>
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
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={unterweisung.name}
                    onChange={(e) => updateUnterweisung(index, 'name', e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded text-sm"
                  />
                  <div className="flex items-center gap-1">
                    <label htmlFor={`dauer-${index}`} className="text-sm text-gray-600 sr-only">Dauer</label>
                    <select
                      id={`dauer-${index}`}
                      value={unterweisung.dauer}
                      onChange={(e) => updateUnterweisung(index, 'dauer', parseFloat(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded text-sm"
                    >
                      {allowedDauerValues.map(val => (
                        <option key={val} value={val}>{val}h</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <label htmlFor={`kosten-${index}`} className="text-sm text-gray-600 sr-only">Kosten</label>
                    <input
                      id={`kosten-${index}`}
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
  );
}
