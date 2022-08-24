import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { LeafletEventHandlerFnMap, Map } from "leaflet";
import {
  ComponentProps,
  ComponentType,
  forwardRef,
  MutableRefObject,
} from "react";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

interface ILeafletMap {
  latitude: number;
  longitude: number;
  circleRadius?: number;
  onLatLngChange?: (lat: number, lng: number) => void;
  scrollWheelZoom?: boolean;
  draggable?: boolean;
}

const LeafletMap: ComponentType<
  ComponentProps<typeof MapContainer> & ILeafletMap
> = (
  {
    latitude,
    longitude,
    circleRadius,
    onLatLngChange,
    scrollWheelZoom,
    draggable,
    ...rest
  },
  ref: MutableRefObject<Map>
) => {
  const eventHandlers: LeafletEventHandlerFnMap = {
    drag: (e) => {
      const target = e.target as L.Marker;
      const { lat, lng } = target.getLatLng();
      onLatLngChange && onLatLngChange(lat, lng);
    },
  };

  return (
    <MapContainer
      ref={ref}
      center={[latitude, longitude]}
      zoom={16}
      className="h-96"
      scrollWheelZoom={scrollWheelZoom}
      {...rest}
    >
      <MapContainerEventListeners onLatLngChange={onLatLngChange} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {circleRadius && (
        <Circle radius={circleRadius} center={[latitude, longitude]} />
      )}

      <Marker
        position={[latitude, longitude]}
        eventHandlers={eventHandlers}
        draggable={draggable}
      />
    </MapContainer>
  );
};

interface IMapContainerEventListeners {
  onLatLngChange?: (lat: number, long: number) => void;
}

const MapContainerEventListeners: ComponentType<
  IMapContainerEventListeners
> = ({ onLatLngChange }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLatLngChange && onLatLngChange(lat, lng);
    },
  });

  return null;
};

// @ts-ignore: has type error, but hey, as long as it works
export default forwardRef(LeafletMap);
