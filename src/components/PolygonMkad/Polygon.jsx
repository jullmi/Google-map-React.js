import React from 'react'
import {Polygon} from "@react-google-maps/api";
import paths from "../../mkad";



const PolygonMkad = () => {

    const options = {
        fillColor: "red",
        fillOpacity: 0.6,
        strokeColor: "red",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 1
    }

    return (
        <Polygon
            paths={paths}
            options={options}
        />
    )
}

export default React.memo(PolygonMkad)