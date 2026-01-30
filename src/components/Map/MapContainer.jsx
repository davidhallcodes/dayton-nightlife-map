import { useEffect, useRef } from 'react'
import { MapContainer as LeafletMap, TileLayer, useMapEvents } from 'react-leaflet'
import { useMap } from '../../context/MapContext'
import { createIcon } from "../../map/divIcons"
import L from 'leaflet'
import { useMap as useLeafletMap } from 'react-leaflet'
import { getPOIs } from '../../api/getPOIs'
import POIMarkers from './POIMarkers'
import MapControls from './MapControls'
import UserLocationMarker from './UserLocationMarker'
import 'leaflet/dist/leaflet.css'

function NightlifeLayer() {
  const map = useLeafletMap()
  const markersRef = useRef([])

  useEffect(() => {
    if (!map) return

    const loadPOIs = async () => {
      try {
        const center = map.getCenter()
        const pois = await getPOIs(center.lat, center.lng)

        // Remove old markers
        markersRef.current.forEach(marker => map.removeLayer(marker))
        markersRef.current = []

        const getCategoryIcon = (category = "") => {
          const c = category.toLowerCase()
          if (c.includes("bar") || c.includes("pub") || c.includes("tavern")) {
            return createIcon("fas fa-beer", "#f59e0b")
          }
          if (c.includes("club") || c.includes("night")) {
            return createIcon("fas fa-music", "#ec4899")
          }
          return createIcon("fas fa-map-marker-alt", "#3b82f6")
        }

        pois.forEach(poi => {
          const marker = L.marker(
            [poi.lat, poi.lng],
            { icon: getCategoryIcon(poi.category) }
          )
            .addTo(map)
            .bindPopup(`
              <b>${poi.name}</b><br/>
              ⭐ ${poi.rating || "N/A"}<br/>
              ${poi.address || ""}
            `)

          markersRef.current.push(marker)
        })
      } catch (err) {
        console.error("Failed to load POIs", err)
      }
    }

    loadPOIs()

    map.on("moveend", loadPOIs)

    return () => {
      map.off("moveend", loadPOIs)
    }
  }, [map])

  return null
}


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
    <div className="h-full w-full relative">
      <LeafletMap
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
        minZoom={12}
        maxZoom={19}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        <UserLocationMarker />
        <NightlifeLayer />
        <MapControls />
      </LeafletMap>
      
      {/* Map Attribution */}
      <div className="absolute bottom-2 left-2 z-10 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  )
}

export default MapContainer