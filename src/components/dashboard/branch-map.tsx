"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({ className: "", html: '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#ff7a00;border:4px solid white;box-shadow:0 4px 12px #0004;transform:rotate(-45deg)"></div>', iconSize: [28, 28], iconAnchor: [14, 28] });

function MapEvents({ onChange }: { onChange: (position: { lat: number; lng: number }) => void }) {
  useMapEvents({ click: (event) => onChange({ lat: event.latlng.lat, lng: event.latlng.lng }) });
  return null;
}

function Recenter({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => { map.flyTo(position, Math.max(map.getZoom(), 14), { duration: .7 }); }, [map, position]);
  return null;
}

export function BranchMap({ position, onChange }: { position: { lat: number; lng: number }; onChange: (position: { lat: number; lng: number }) => void }) {
  return <MapContainer center={position} zoom={13} className="h-72 w-full rounded-2xl" scrollWheelZoom><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><Marker position={position} icon={markerIcon} /><MapEvents onChange={onChange} /><Recenter position={position} /></MapContainer>;
}
