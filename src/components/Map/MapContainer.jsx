import { MapContainer as LeafletMap, TileLayer, useMapEvents } from 'react-leaflet'
import { useEffect } from 'react'
import { useMap } from '../../context/MapContext'
import POIMarkers from './POIMarkers'
import MapControls from './MapControls'
import 'leaflet/dist/leaflet.css'

function MapEvents() {
  const { setMapCenter, setZoom } = useMap()
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      setMapCenter([center.lat, center.lng])
    },
    zoomend: () => {
      setZoom(map.getZoom())
    }
  })
  return null
}

const MapContainer = () => {
  const { mapCenter, zoom, getUserLocation } = useMap()

  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  return (
    <div className="h-full w-full">
      <LeafletMap
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
        minZoom={12}
        maxZoom={19}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        <POIMarkers />
        <MapControls />
      </LeafletMap>
    </div>
  )
}

export default MapContainer