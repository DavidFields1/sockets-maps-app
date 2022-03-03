import React, { useEffect } from "react";
import useMapbox from "../hooks/useMapbox";

const MapPage = () => {
	const { mapContainer, coords, newMarker$, markerTracking$ } = useMapbox();

	// new marker
	useEffect(() => {
		newMarker$.subscribe((marker) => {
			console.log(marker);
		});
	}, [newMarker$]);

	// marker tracking
	useEffect(() => {
		markerTracking$.subscribe((marker) => {
			console.log(marker);
		});
	}, [markerTracking$]);

	return (
		<>
			<div className="mapInfo">
				Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
			</div>
			<div className="mapContainer" ref={mapContainer} />
		</>
	);
};

export default MapPage;
