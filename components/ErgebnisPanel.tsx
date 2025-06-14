import React from 'react';
import { formatEuro } from '../utils/calculations';

export default function ErgebnisPanel({ ergebnisse, betrachtungszeitraum, entlastungsfaktor, waehrung }) {
  return (
    <div className="grow sticky top-8 max-h-[calc(100vh-2rem)]"> {/* Nimmt flexibel Platz, max-h für Viewport-Höhe abzüglich top-Abstand */}
      <div className="ergebnis-panel overflow-y-auto h-full"> {/* overflow-y-auto und h-full für internes Scrollen */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2 text-green-600">📉</span>
          Live-Ergebnis
        </h2>

        {/* Hauptergebnis */}
        <div className="hauptergebnis">
          <div className="text-xs text-gray-600 mb-1">
            Ersparnis über {betrachtungszeitraum} Jahre
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatEuro(ergebnisse.ersparnis || 0, waehrung)}
          </div>
          {ergebnisse.roiMonate > 0 && ergebnisse.roiMonate <= 36 && (
            <div className="mt-2 text-xs text-blue-600 font-semibold">
              💡 ROI nach {ergebnisse.roiMonate} Monaten!
            </div>
          )}
        </div>

        {/* Live Indikator */}
        <div className="mb-4 text-center">
          <div className="live-indicator">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            Live-Berechnung
          </div>
        </div>

        {/* Kostenvergleich */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-center hide-bars-on-small-screens">Kostenvergleich (jährlich)</h3>
          
          <div className="flex justify-around items-end gap-2 mb-4"> {/* Geändert zu justify-around und gap-2 */}
            {/* Traditionell Block */}
            <div className="flex flex-col items-center hide-bars-on-small-screens">
              <div className="text-xs font-semibold text-gray-700 mb-1">Traditionell</div>
              <div className="w-12 bg-blue-400 rounded" style={{ height: '80px' }}></div>
              <div className="text-sm font-bold text-blue-800 mt-2">
                {formatEuro(ergebnisse.traditionellJahr || 0, waehrung)}
              </div>
            </div>

            {/* Ersparnis Block (mittig) */}
            <div className="flex flex-col items-center justify-center text-center"> {/* pb-8 entfernt, text-center hinzugefügt */}
              <div className="text-lg font-bold text-gray-400 mb-1">VS</div> {/* mb-1 statt mb-2 */}
              <div className="text-xs text-gray-500">
                <span className="text-xl">💰</span><br/> {/* Symbol für Ersparnis */}
                <span className="font-bold text-green-600">
                  {formatEuro(ergebnisse.ersparnisJahr || 0, waehrung)}
                </span>
                {ergebnisse.traditionellJahr > 0 && (
                  <span className="block font-bold text-green-600 text-lg">
                    {Math.round(((ergebnisse.ersparnisJahr || 0) / ergebnisse.traditionellJahr) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* lern.link LMS Block */}
            <div className="flex flex-col items-center hide-bars-on-small-screens">
              <div className="text-xs font-semibold text-gray-700 mb-1">lern.link LMS</div>
              <div 
                className="w-12 bg-orange-400 rounded transition-all duration-300"
                style={{ 
                  height: `${Math.max((((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum)) / (ergebnisse.traditionellJahr || 1)) * 80, 20)}px`
                }}
              ></div>
              <div className="text-sm font-bold text-orange-800 mt-2">
                {formatEuro((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum), waehrung)}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded key-metric-item-layout">
            <span className="text-sm text-gray-600 key-metric-label">
              <span>💰 👤 Jahr</span>
              <span className="show-text-on-large"> (Kosten/Person/Jahr)</span>
            </span>
            <div className="key-metric-values">
              <span className="font-bold text-blue-600">{formatEuro(ergebnisse.kostenProTeilnehmerTraditionellJahr || 0, waehrung)}</span>
              {/* Slash entfernt, Abstand zum nächsten Wert hinzugefügt */}
              <span className="font-bold text-orange-600 ml-2">{formatEuro(ergebnisse.kostenProTeilnehmerLMSJahr || 0, waehrung)}</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <a 
            href="https://service.lern.link/calendar/beratung-fur-ihr-e-learning-projekt-3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            💬 Kostenlose Beratung
          </a>
          <button className="btn-secondary">
            <span>📄</span>
            PDF-Report
          </button>
        </div>
      </div>
    </div>
  );
}
