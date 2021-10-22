import React from 'react';
import { Map, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import red from './red.png'

const axios = require('axios')

const maxLat = 31.07
const minLat = 24.5
const maxLng = -79.75
const minLng = -87.7

const mapStyles = {
    position: 'relative',
    width: '100%',
    height: '100%'
};

const containerStyle = {
    position: 'relative',
    margin: 'auto',
    width: '70vmin',
    height: '55vmin',
    borderStyle: 'solid',
    borderWidth: '5px',
    borderColor: 'black',
}

// Copied from https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

export class MapContainer extends React.Component {
    constructor(props){
        super(props)

        let mapHeight = 0.55 * Math.min(window.innerWidth, window.innerHeight)
        let mapWidth = 0.7 * Math.min(window.innerWidth, window.innerHeight)
        let points = [
            { lat: maxLat, lng: minLng },
            { lat: minLat, lng: maxLng },
        ]
        let bounds = new this.props.google.maps.LatLngBounds();
        for (let i = 0; i < points.length; i++) {
            bounds.extend(points[i]);
        }

        this.state = {
            zoom: getBoundsZoomLevel(bounds, {width: mapWidth, height: mapHeight}),
            center: {
                lat: 28.0571376,
                lng: -83.7662318
            },
            sites: []
        }
    }

    setup = (mapProps, maps)=>{
        axios.get('https://waterservices.usgs.gov/nwis/site/?format=rdb&stateCd=fl&parameterCd=00010&siteType=OC,ES,LK,ST,SP&siteStatus=active&hasDataTypeCd=qw')
            .then((response) => {
                let data = response.data.split('\n')
                let usgsSites = []
                for (let entry of data){
                    if (entry.startsWith('USGS')){
                        entry = entry.split('\t')
                        entry = {
                            id: entry[1],
                            name: entry[2],
                            type: entry[3],
                            lat: entry[4],
                            lng: entry[5]
                        }
                        usgsSites.push(entry)
                    }
                }
                this.setState({
                    sites: usgsSites
                })
            })
            .catch((error) => {
                alert(error)
            })
    }

    onZoomChanged = (mapProps, maps)=>{
        console.log(maps.zoom)
        // Should only run if necessary
        //this.setState({zoom: maps.zoom, center: maps.center})
    }

    onDragEnd = (mapProps, maps)=>{
        let lat = maps.center.lat()
        let lng = maps.center.lng()
        let latNew = Math.min(maxLat, Math.max(minLat, lat))
        let lngNew = Math.min(maxLng, Math.max(minLng, lng))
        if(latNew !== lat || lngNew !== lng){
            this.setState({
                center: {
                    lat: latNew,
                    lng: lngNew
                }
            })
        }       
    }

    render = () => {
        const markers = []

        for(let entry of this.state.sites){
            markers.push(
                <Marker
                    key={entry.id}
                    title={entry.name}
                    name={entry.name}
                    icon={{
                        url: red,
                        scaledSize: new this.props.google.maps.Size(8, 8)
                    }}
                    position={{lat: entry.lat, lng: entry.lng}} />
            )
        }
        return (
            <Map
                google={this.props.google}
                zoom={this.state.zoom}
                minZoom={this.state.zoom}
                style={mapStyles}
                containerStyle={containerStyle}
                initialCenter={
                    {
                        lat: 28.0571376,
                        lng: -83.7662318
                    }
                }
                center={this.state.center}
                mapTypeControl={false}
                scaleControl={false}
                streetViewControl={false}
                fullscreenControl={false}
                onReady={this.setup}
                onZoomChanged={this.onZoomChanged}
                onCenterChanged={this.onDragEnd}
            >
                {markers}
                <Polyline
                    path={
                        [
                            {lat: minLat, lng: minLng},
                            {lat: maxLat, lng: minLng},
                            {lat: maxLat, lng: maxLng},
                            {lat: minLat, lng: maxLng},
                            {lat: minLat, lng: minLng}
                        ]
                    }
                    strokeColor="#000000"
                    strokeOpacity={1}
                    strokeWeight={2}
                />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainer);