import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DEFAULT_CENTER } from '../lib/maps'

type MapViewProps = {
  center?: [number, number]
  marker?: [number, number]
  onSelect?: (lat: number, lng: number) => void
  className?: string
  height?: string
}

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()

  map.setView(center, map.getZoom())
  return null
}

function SelectionHandler({ onSelect }: { onSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelect?.(e.latlng.lat, e.latlng.lng)
    },
  })

  return null
}

export function MapView({ center = DEFAULT_CENTER, marker, onSelect, className = '', height = '100%' }: MapViewProps) {
  return (
    <div className={className} style={{ height }}>
      <MapContainer center={center} zoom={14} scrollWheelZoom style={{ height: '100%', width: '100%', borderRadius: '16px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} />
        {onSelect && <SelectionHandler onSelect={onSelect} />}
        {marker && (
          <Marker position={marker} icon={markerIcon}>
            <Popup>Local selecionado</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
