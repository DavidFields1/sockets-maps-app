import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken =
	"pk.eyJ1IjoiZGF2aWRmaWVsZHMxIiwiYSI6ImNsMDkyNnBnOTA5YTAzam1nZ21zYnd6d3kifQ.D4bILpS9qXgoXFXIpO4Rqg";

const initialPosition = {
	lng: -0.1278,
	lat: 51.5074,
	zoom: 12,
};

const useMapbox = () => {
	const mapContainer = useRef();
	const map = useRef();

	const [coords, setCoords] = useState(initialPosition);

	// markers ref
	const markers = useRef({});

	// observables
	const newMarker = useRef(new Subject());
	const markerTracking = useRef(new Subject());

	// add marker
	const addMarker = useCallback((lngLat) => {
		// create marker
		const marker = new mapboxgl.Marker({
			draggable: true,
			color: "#ff0000",
		})
			.setLngLat(lngLat)
			.addTo(map.current);
		marker.id = v4();

		// add marker to ref
		markers.current[marker.id] = marker;

		// emit marker with observable
		newMarker.current.next(marker);

		// marker tracking
		marker.on("drag", (e) => {
			const { id } = e.target;
			const { lng, lat } = e.target.getLngLat();

			markerTracking.current.next({ id, lng, lat });
		});
	}, []);

	// create map
	useEffect(() => {
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [initialPosition.lng, initialPosition.lat],
			zoom: initialPosition.zoom,
		});
	}, []);

	// update map coords
	useEffect(() => {
		if (map) {
			map.current.on("move", () => {
				const { lng, lat } = map.current.getCenter();
				setCoords({
					lng: lng.toFixed(4),
					lat: lat.toFixed(4),
					zoom: map.current.getZoom().toFixed(2),
				});
			});
		}
	}, [map.current]);

	// add marker onclick
	useEffect(() => {
		if (map) {
			map.current.on("click", (e) => addMarker(e.lngLat));
		}
	}, [map.current]);

	return {
		mapContainer,
		map,
		coords,
		addMarker,
		newMarker$: newMarker.current,
		markerTracking$: markerTracking.current,
	};
};

export default useMapbox;
