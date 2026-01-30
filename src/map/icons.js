import L from "leaflet"

export const icons = {
  bar: new L.Icon({
    iconUrl: "/icons/bar.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  }),
  default: new L.Icon({
    iconUrl: "/icons/default.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24]
  })
}