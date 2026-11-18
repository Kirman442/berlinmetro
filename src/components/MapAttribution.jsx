import { useEffect } from 'react';
import { AttributionControl, useMap } from 'react-map-gl/maplibre';

const ATTRIBUTION = [
  '<a href="https://maplibre.org/" target="_blank" rel="noreferrer">MapLibre</a>',
  'Daten: <a href="https://de.wikipedia.org/wiki/Liste_der_Berliner_U-Bahnh%C3%B6fe" target="_blank" rel="noreferrer">Wikipedia</a> (CC BY-SA 4.0), Wikidata',
];
const LEGAL = ' | <a href="#impressum" aria-haspopup="dialog">Impressum</a> · <a href="#datenschutz" aria-haspopup="dialog">Datenschutz</a>';

// MapLibre schreibt die Attribution beim Stilwechsel neu; der Rechtshinweis wird danach wieder angehängt
function LegalLinks() {
  const { current: map } = useMap();
  useEffect(() => {
    const root = map?.getContainer().querySelector('.maplibregl-ctrl-attrib-inner');
    if (!root) return undefined;
    const ensure = () => {
      if (root.querySelector('.map-attribution-legal')) return;
      const span = document.createElement('span');
      span.className = 'map-attribution-legal';
      span.lang = 'de';
      span.innerHTML = LEGAL;
      root.appendChild(span);
    };
    ensure();
    const obs = new MutationObserver(ensure);
    obs.observe(root, { childList: true });
    return () => obs.disconnect();
  }, [map]);
  return null;
}

export default function MapAttribution() {
  return (
    <>
      <AttributionControl position="bottom-right" compact={false} customAttribution={ATTRIBUTION} />
      <LegalLinks />
    </>
  );
}
