import React from 'react';
import { formatEuro } from '../utils/calculations';

export default function DetailAnalyse({ 
  ergebnisse, 
  betrachtungszeitraum, 
  entlastungsfaktor, 
  mitarbeiter, 
  unterweisungen, 
  maxTeilnehmer, 
  trainerTagessatz, 
  unterweisungsDauer, 
  anreiseAnteil, 
  fahrtkosten, 
  mitarbeiterStundensatz, 
  lmsAnschaffung, 
  lmsHostingJahr
  // raumkostenProTag wird nicht direkt benötigt, da ergebnisse.gesamteRaumkosten verwendet wird
}) {
  return (
    <div className="detail-analyse">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Detaillierte Kostenanalyse</h3>
      
      {/* Container für Balken */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traditioneller Balken */}
        <div className="flex flex-col items-center mb-6 lg:mb-0">
          <div className="text-sm font-semibold text-gray-700 mb-2 text-center">
            Traditionelle<br/>Unterweisungen
          </div>
          <div className="text-lg font-bold text-blue-800 mb-3">
            {formatEuro(ergebnisse.traditionellJahr || 0)}
          </div>
          <div className="balken-container">
            <div
              className="bg-blue-700 w-full"
              style={{ height: `${((ergebnisse.trainerKosten || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
            ></div>
            <div
              className="bg-blue-500 w-full"
              style={{ height: `${((ergebnisse.fahrkostenGesamt || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
            ></div>
            <div 
              className="bg-blue-400 w-full" 
              style={{ height: `${((ergebnisse.gesamteRaumkosten || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
            ></div>
            <div
              className="bg-blue-300 w-full"
              style={{ height: `${((ergebnisse.ausfallzeitenTraditionell || 0) / (ergebnisse.traditionellJahr || 1)) * 200}px` }}
            ></div>
          </div>
        </div>

        {/* LMS Balken */}
        <div className="flex flex-col items-center mb-6 lg:mb-0">
          <div className="text-sm font-semibold text-gray-700 mb-2 text-center">
            lern.link<br/>LMS
          </div>
          <div className="text-lg font-bold text-orange-800 mb-3">
            {formatEuro((ergebnisse.lmsJahreslaufend || 0) + ((ergebnisse.lmsAnschaffung || 0) / betrachtungszeitraum))}
          </div>
          <div 
            className="balken-container"
            style={{ 
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
      </div>

      {/* Container für Legenden */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traditionelle Legende */}
        <div className="legende-box legende-traditionell">
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
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span>Raumkosten:</span>
              </div>
              <span className="font-medium">{formatEuro(ergebnisse.gesamteRaumkosten || 0)}</span>
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

        {/* LMS Legende */}
        <div className="legende-box legende-lms">
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
                <span>LMS-Anschaffung: {formatEuro(ergebnisse.lmsAnschaffung || 0)} / {betrachtungszeitraum} J.</span>
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
          <div><strong>Gesamtschulungsdauer/Jahr:</strong> {unterweisungen.reduce((sum, u) => sum + u.dauer, 0)}h</div>
          <div><strong>Anreiseanteil:</strong> {anreiseAnteil}%</div>
          <div><strong>Fahrtkosten:</strong> {formatEuro(fahrtkosten)}</div>
          <div><strong>Raumkosten/Tag:</strong> {formatEuro(ergebnisse.raumkostenProTagParameter || 0)}</div>
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
  );
}
