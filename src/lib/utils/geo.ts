/** Haversine distance in metres. */
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearest<T extends { lat: number; lng: number }>(origin: { lat: number; lng: number }, items: T[]) {
  return items
    .map((item) => ({ item, distance: distanceMeters(origin, item) }))
    .sort((x, y) => x.distance - y.distance)[0];
}
