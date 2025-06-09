import React, { useState } from 'react';

const tooltips = {
  mitarbeiter: "Gesamtzahl aller Mitarbeitenden, die Pflichtschulungen absolvieren müssen.",
  maxTeilnehmer: "Maximale Anzahl Personen pro Präsenzschulung. Typisch: 15-25 Personen",
  trainerTagessatz: "Honorar eines externen Trainers pro Tag. Marktüblich: 800-1.500€",
  entlastungsfaktor: "Zeitersparnis durch Online-Lernen. Studien zeigen 15-30% Ersparnis",
  raumkostenProTag: "Geschätzte tägliche Mietkosten für einen Schulungsraum, passend zur eingestellten Gruppengröße. Die Preisspanne des Sliders passt sich der Gruppengröße an."
};

export default function Tooltip({ id }) {
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="ml-2 text-blue-500 hover:text-blue-700"
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        <span className="text-sm">❓</span>
      </button>
      {activeTooltip === id && (
        <div className="absolute z-50 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg -top-2 left-8 transform -translate-y-full">
          {tooltips[id]}
        </div>
      )}
    </div>
  );
}
