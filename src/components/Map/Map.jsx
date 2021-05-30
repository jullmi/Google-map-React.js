import React from 'react'
import {useState, useCallback, useEffect} from 'react'

import paths from "../../mkad";


import
    {GoogleMap,
    Marker,
    useLoadScript,
    DirectionsRenderer,
    DirectionsService,
    Polyline,
    InfoWindow}
from '@react-google-maps/api';

import PolygonMkad from "../PolygonMkad/Polygon";



const containerStyle = {
    width: '100wh',
    height: '100vh'
}


const  Map = () => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBYEey3dAT7X6YcANl4oNHBa5V-4KS2cGA",
    });

    const [ myMap, setMyMap ] = useState(null);
    const [center, setCenter] = useState({lat: 55.7522200, lng: 37.6155600});
    const [zoom,setZoom] = useState(10);
    const [ markers, setMarkers ] = useState([]);
    const [coordinates, setCoordinates] = useState('')
    const [response, setResponse] = useState(null)
    const [travelMode, setTravelMode] = useState('DRIVING')
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')


    const optionsPolyline = {
        strokeColor: 'green',
        strokeOpacity: 1,
        strokeWeight: 5,
        fillColor: 'green',
        fillOpacity: 1,
        visible: true,
    }


    const onMapClick = useCallback((event) => {
        setCoordinates(event.latLng.toJSON())
        setOrigin(event.latLng.toJSON())
            }, [])


    const  distance =  (lat1, lng1, lat2, lng2) =>  {
            if ((lat1 === lat2) && (lng1 === lng2)) {
                return 0;
            }
            else {
                let radlat1 = Math.PI * lat1/180;
                let radlat2 = Math.PI * lat2/180;
                let theta = lng1-lng2;
                let radtheta = Math.PI * theta/180;


                let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }

                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515 *1.609344

                return dist;
            }
    }


    const resultCoordinates = () => {
        const resultDistance = paths.map(item =>
            coordinates ? (distance(coordinates.lat, coordinates.lng, item.lat, item.lng)) : false)
        const resultSort = resultDistance.slice(0).sort((a, b) => a - b);

        const resultIndex = resultDistance.indexOf(resultSort[0]);
        return paths[resultIndex]

    }

    useEffect(() => {
        setDestination(resultCoordinates())
    })

    const path = [origin,destination]

    const directionsServiceOptions = {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
    }

    const directionsCallback = useCallback((res) => {
            if (res !== null)  {
                if (res.status === 'OK') {
                    setResponse(res)
                }
                else {
                    console.log('response: ', res)
                }
            }
        }, [])


    const renderMap = () => (
        <div>
            <GoogleMap
                center={center}
                zoom={zoom}
                mapContainerStyle={containerStyle}
                onLoad={map => setMyMap(map)}
                onClick={onMapClick}
            >
                <PolygonMkad/>
               {markers && coordinates ? (<Marker position={coordinates}/>) : null}

                {(origin !== '' && destination !== '') ?
                    (<DirectionsService
                        options={directionsServiceOptions}
                        callback={directionsCallback}
                    />) : null
                }

                {(response !== null) ? (
                    <DirectionsRenderer directions ={response} />
                ): null}

                {response ? (<Polyline
                        options = {optionsPolyline}
                        path = {path}
                    />
                ): null}

                {(coordinates !== ''  && response) ? (<InfoWindow
                    position = {{lat: 55.7522200, lng: 37.6155600}}
                    >
                    <div>{response.routes[0].legs[0].start_address}</div>
                    </InfoWindow>): null}
            </GoogleMap>
        </div>
)
        return isLoaded ? renderMap() : null;
}



export default React.memo(Map)


