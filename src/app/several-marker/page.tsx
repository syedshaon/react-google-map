"use client";
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import Image from "next/image";

const allMarkers = [
  {
    id: 1,
    name: "Polli Kabi Jasimuddin's House",
    image: "jasimuddin.jpg",
    position: { lat: 23.6130064, lng: 89.8006529 },
    category: "historical",
  },
  {
    id: 2,
    name: "Dholar Mor - ধলার মোড়",
    image: "dholar-mor.jpeg",
    position: { lat: 23.616494, lng: 89.8657628 },
    category: "natural",
  },
  {
    id: 3,
    name: "Serene Garden Restaurant",
    image: "serene-garden.jpeg",
    position: { lat: 23.5955456, lng: 89.8372972 },
    category: "restaurant",
  },
  {
    id: 4,
    name: "Faridpur Medical College",
    image: "medical.jpeg",
    position: { lat: 23.5883373, lng: 89.8304817 },
    category: "medical",
  },
  {
    id: 5,
    name: "Faridpur Zilla School",
    image: "zilla-school.png",
    position: { lat: 23.6088087, lng: 89.8412669 },
    category: "educational",
  },
];

function SeveralMarker() {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState(allMarkers);
  const [mapType, setMapType] = useState("roadmap");

  const [activeMarker, setActiveMarker] = useState(null as null | number);
  const center = {
    lat: 23.6055505,
    lng: 89.8385425,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleRoute = () => {
    if (mapInstance) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      directionsService.route(
        {
          origin: { lat: 23.592577, lng: 89.8090716 }, // Starting point
          destination: { lat: 23.616494, lng: 89.8657628 }, // Final destination point
          waypoints: [
            {
              location: { lat: 23.6130064, lng: 89.8006529 }, // josimuddin
              stopover: true,
            },
            {
              location: { lat: 23.5883373, lng: 89.8304817 }, // Medical
              stopover: true,
            },
            {
              location: { lat: 23.5955456, lng: 89.8372972 }, // Serene
              stopover: true,
            },
            {
              location: { lat: 23.6088087, lng: 89.8412669 }, // Jilla
              stopover: true,
            },
          ],
          travelMode: google.maps.TravelMode.DRIVING, // Travel mode can be DRIVING, WALKING, etc.
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );

      directionsRenderer.setMap(mapInstance); // Set the map instance here
    }
  };

  const handleActiveMarker: (marker: number) => void = (marker: number) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const filterMarkers = (category: string) => {
    if (!category) {
      setMarkers(allMarkers);
      return;
    }
    const filteredMarkers = allMarkers.filter((marker) => marker.category === category);
    setMarkers(filteredMarkers);
  };

  return isLoaded ? (
    <>
      <div className="flex flex-col md:flex-row items-center gap-5 justify-between px-5 py-2 bg-white shadow-lg z-10 w-full fixed top-0 left-0">
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-2 px-4 rounded-lg   transition duration-200" onClick={handleRoute}>
          Show Best Route to Visit Those Places
        </button>
        <div className="font-bold flex gap-3 items-center">
          <label htmlFor="category" className="block text-sm mb-1">
            Filter by category:
          </label>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300" onChange={(e) => filterMarkers(e.target.value)}>
            <option value="">All</option>
            <option value="historical">Historical</option>
            <option value="natural">Natural</option>
            <option value="restaurant">Restaurant</option>
            <option value="medical">Medical</option>
            <option value="educational">Educational</option>
          </select>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 z-10 flex items-center justify-center gap-5">
        <button className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-lg shadow-lg transition duration-200" onClick={() => setMapType("satellite")}>
          Satellite View
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg shadow-lg transition duration-200" onClick={() => setMapType("roadmap")}>
          Roadmap View
        </button>
      </div>

      <GoogleMap center={center} zoom={14} mapContainerStyle={{ width: "100%", height: "100vh" }} mapTypeId={mapType} onClick={() => setActiveMarker(null)} onLoad={(map) => setMapInstance(map)}>
        {markers.map(({ id, name, image, position }) => (
          <Marker
            key={id}
            position={position}
            icon={{
              url: `/icon.png`, // Path to the custom icon
              scaledSize: new google.maps.Size(45, 65), // Size of the icon
            }}
            onClick={() => handleActiveMarker(id)}
            // animation={google.maps.Animation.BOUNCE}
            animation={google.maps.Animation.DROP}
          >
            {activeMarker === id ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="text-center p-4">
                  <Image className="rounded-lg mx-auto mb-2 shadow-lg" src={`/${image}`} alt={name} width={100} height={100} />
                  <p className="font-bold text-lg text-gray-800 mb-2">{name}</p>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition duration-200 shadow-lg">
                    Get Directions
                  </a>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
}

export default SeveralMarker;
