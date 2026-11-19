import React from 'react';
import ReactDOM from 'react-dom/client';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import App from './App';
import './index.css';

maplibregl.addProtocol('pmtiles', new Protocol().tile);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
