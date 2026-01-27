import { render, screen, waitFor } from '@testing-library/react'
import { MapProvider } from '../../context/MapContext'
import MapContainer from '../../components/Map/MapContainer'
import '@testing-library/jest-dom'

// Mock Leaflet since it requires DOM
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }) => (
    <div data-testid="mock-map" {...props}>
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  useMapEvents: () => ({})
}))

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementationOnce((success) => Promise.resolve(
      success({
        coords: {
          latitude: 39.7589,
          longitude: -84.1916,
          accuracy: 50
        }
      })
    ))
}
global.navigator.geolocation = mockGeolocation

describe('MapContainer', () => {
  it('renders the map container', () => {
    render(
      <MapProvider>
        <MapContainer />
      </MapProvider>
    )
    
    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
  })

  it('requests user location on mount', async () => {
    render(
      <MapProvider>
        <MapContainer />
      </MapProvider>
    )
    
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })
  })
})