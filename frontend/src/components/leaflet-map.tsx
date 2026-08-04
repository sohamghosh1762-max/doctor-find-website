import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useEffect, useState } from "react";

const hospitalIcon = L.divIcon({
  className: "",
  html: `<div style="background:oklch(0.68 0.13 190);width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.3);display:grid;place-items:center;border:2px solid white"><div style="transform:rotate(45deg);color:white;font-weight:700;font-size:14px">H</div></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const pharmacyIcon = L.divIcon({
  className: "",
  html: `<div style="background:oklch(0.55 0.18 260);width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.3);display:grid;place-items:center;border:2px solid white"><div style="transform:rotate(45deg);color:white;font-weight:700;font-size:14px">P</div></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export function LeafletMap({
  filter,
}: {
  filter: string;
}) {

  const [locations, setLocations] =
    useState<any[]>([]);

  const [userLat, setUserLat] =
    useState<number | null>(null);

  const [userLng, setUserLng] =
    useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    if (userLat && userLng) {
      fetchLocations();
    }
  }, [userLat, userLng]);

const fetchLocations = async () => {
  try {
    if (!userLat || !userLng) return;

const res = await axios.get(
  `http://localhost:5000/api/google-places/nearby?lat=${userLat}&lng=${userLng}`
);

console.log(res.data);

    const places = res.data.map(
  (place: any) => ({
    name: place.name,
    address: place.vicinity,
    phone:
      place.international_phone_number ||
      "Not Available",

    lat:
      place.geometry.location.lat,

    lng:
      place.geometry.location.lng,

    type:
      place.types?.includes(
        "pharmacy"
      )
        ? "pharmacy"
        : "hospital",
  })
);

setLocations(places);

  } catch (error) {
    console.log(error);
  }
};
  const filtered =
  locations.filter(
    (item) =>
      filter === "all" ||
      item.type === filter
  );
  return (
    <MapContainer
  center={[
    userLat || 22.5726,
    userLng || 88.3639,
  ]} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {filtered
  .filter(
  (p) =>
    typeof p.lat === "number" &&
    typeof p.lng === "number" &&
    !isNaN(p.lat) &&
    !isNaN(p.lng)
)
  .map((p) => (
    <Marker
      key={p.name}
      position={[
        p.lat,
        p.lng,
      ]}
      icon={
        p.type === "hospital"
          ? hospitalIcon
          : pharmacyIcon
      }
    >
          <Popup>
  <div
    style={{
      fontFamily: "Inter",
      minWidth: 200,
    }}
  >
    <strong>{p.name}</strong>

    <div
      style={{
        fontSize: 12,
        marginTop: 4,
      }}
    >
      {p.address}
    </div>

    <div
      style={{
        fontSize: 12,
        marginTop: 4,
      }}
    >
      📞 {p.phone}
    </div>

    <a
      href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
      target="_blank"
      rel="noreferrer"
    >
      Open in Google Maps
    </a>
  </div>
</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
