import React from "react";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./Map.css";

const Map = (props) => {
    const locationIcon = new L.divIcon({
        className: "marker-icon",
        iconSize: [30, 30],
    });

    const { center, zoom } = props

    return (
        <div className={`map ${props.className}`} style={props.style}>
            <LeafletMap
                center={[center.lat, center.lng]}
                zoom={zoom}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={[center.lat, center.lng]}
                    icon={locationIcon}
                >
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </LeafletMap>
        </div>
    );
};
export default Map;