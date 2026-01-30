import L from "leaflet"

export const createIcon = (iconClass, color = "#3b82f6") =>
  L.divIcon({
    html: `
      <div class="map-marker" style="color:${color}">
        <i class="${iconClass}"></i>
      </div>
    `,
    className: "", // IMPORTANT: removes default leaflet styles
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })