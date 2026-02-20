import { YMaps, Map, Clusterer, Placemark } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";

function YandexMap({
  city,
  deliveryPoints,
  handlePlacemarkClick,
  deliveryType,
}) {
  const apiKey = "3044f076-5c89-4f54-bdfe-98f7f44b67c2";
  const [deliveryPointsLocations, setDeliveryPointsLocations] = useState([]);
  const [cityLocation, setCityLocation] = useState([]);

  useEffect(() => {
    setCityLocation([city.latitude, city.longitude]);
  }, [city]);

  useEffect(() => {
    if (deliveryType === 1) {
      setDeliveryPointsLocations(
        deliveryPoints.map(({ location: { latitude, longitude } }) => [
          latitude,
          longitude,
        ]),
      );
    } else if (deliveryType === 4) {
      setDeliveryPointsLocations(
        deliveryPoints.map(({ GPS }) => {
          const [latitude, longitude] = GPS.split(",").map((coord) =>
            parseFloat(coord.trim()),
          );
          return [latitude, longitude];
        }),
      );
    } else if (deliveryType === 6) {
      setDeliveryPointsLocations(
        deliveryPoints.map(({ lat, lng }) => [lat, lng]),
      );
    }
  }, [deliveryPoints]);

  return (
    <YMaps
      enterprise
      query={{
        apikey: apiKey,
      }}
    >
      <Map
        width="100%"
        height="300px"
        state={{
          center: cityLocation,
          zoom: 9,
          controls: ["zoomControl"],
        }}
        modules={["control.ZoomControl"]}
      >
        <Clusterer
          options={{
            groupByCoordinates: false,
          }}
        >
          {deliveryPointsLocations.map((coordinates, index) => (
            <Placemark
              key={index}
              geometry={coordinates}
              onClick={() => handlePlacemarkClick(index)}
            />
          ))}
        </Clusterer>
      </Map>
    </YMaps>
  );
}

export default YandexMap;
