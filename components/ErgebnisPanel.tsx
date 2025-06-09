import React from 'react';
import { formatEuro } from '../utils/calculations';

export default function ErgebnisPanel({ ergebnisse, betrachtungszeitraum, entlastungsfaktor }) {
  return (
    <div className="w-1/3 sticky top-8"> {/* w-full lg:w-1/3 zu w-1/3 geändert */}
      <div className="ergebnis-panel">
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
          <div className="live-indicator">
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
                {ergebnisse.traditionellJahr > 0 && (
                  <span className="block font-bold text-green-600 text-lg">
                    {Math.round(((ergebnisse.ersparnisJahr || 0) / ergebnisse.traditionellJahr) * 100)}%
                  </span>
                )}
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
            <span className="text-sm text-gray-600">Kosten/MA/Jahr:</span>
            <div>
              <span className="font-bold text-blue-600">{formatEuro(ergebnisse.kostenProTeilnehmerTraditionellJahr || 0)}</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="font-bold text-orange-600">{formatEuro(ergebnisse.kostenProTeilnehmerLMSJahr || 0)}</span>
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
