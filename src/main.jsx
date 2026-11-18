import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'

maplibregl.addProtocol('pmtiles', new Protocol().tile)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
