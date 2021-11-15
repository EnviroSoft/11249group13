import React from 'react';
import { Map, Marker, GoogleApiWrapper, Polyline, InfoWindow } from 'google-maps-react';
import red from './red.png'
import yellow from './yellow.png'
import blue from './blue.png'
import green from './green.png'
import lblue from './lblue.png'
import dgreen from './dgreen.png'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryLabel, VictoryAxis } from "victory";

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
    width: '100vmin',
    height: '75vmin',
    borderStyle: 'solid',
    borderWidth: '5px',
    borderColor: 'black',
}

const markerImages = {
    'ST': blue,
    'SP': dgreen,
    'ES': red,
    'LK': yellow,
    'OC': red
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
    constructor(props) {
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
            zoom: getBoundsZoomLevel(bounds, { width: mapWidth, height: mapHeight }),
            center: {
                lat: 28.0571376,
                lng: -83.7662318
            },
            sites: [],
            activeMarker: null,
            activeMarkerProps: null,
            activeSiteData: null
        }
    }

    onTilesLoaded = (mapProps, maps) => {
        if (this.props.onMapLoaded != null)
            this.props.onMapLoaded()
        if (this.props.onBoundsCheckPassed != null) {
            let points = [
                { lat: maxLat, lng: minLng },
                { lat: minLat, lng: maxLng },
            ]
            let bounds = new this.props.google.maps.LatLngBounds();
            for (let i = 0; i < points.length; i++) {
                bounds.extend(points[i]);
            }
            if (maps.getBounds().contains(bounds.getNorthEast()) && maps.getBounds().contains(bounds.getSouthWest())) {
                this.props.onBoundsCheckPassed()
            }
        }
    }

    onMarkerClick = (props, marker, e) => {
        if(this.state.activeMarker == null || this.state.activeMarkerProps.id != props.id){
            axios.get('https://waterservices.usgs.gov/nwis/dv/?format=rdb&sites=' + props.id + '&startDT=2015-11-01&endDT=2022-11-09&statCd=00003&parameterCd=00010&siteStatus=all')
                .then((response)=> {
                    let data = response.data.split('\n')
                    let siteData = []
                    for(let entry of data){
                        if(entry.startsWith('USGS')){
                            entry = entry.split('\t')
                            let temperature = parseFloat((entry[3].length == 0) ? (entry[5].length == 0 ? entry[7] : entry[5]) : entry[3])
                            if(temperature.length == 0){
                                alert("PROBLEM!")
                                continue
                            }
                            if(!isNaN(temperature)){
                                entry = {
                                    date: entry[2],
                                    temperature: temperature
                                }
                                siteData.push(entry)
                            }
                        }
                    }
                    this.setState({
                        activeSiteData: siteData
                    })
                })
                .catch((error)=>{
                    alert(error)
                })
            this.setState({
                activeMarker: marker,
                activeMarkerProps: props,
                activeSiteData: null
            })
        }else{
            this.setState({
                activeMarker: null,
                activeMarkerProps: null,
                activeSiteData: null
            })
        }
    }

    onMapClick = (props) => {
        if(this.state.activeMarker != null){
            this.setState({
                activeMarker: null,
                activeMarkerProps: null,
                activeSiteData: null
            })
        }
    }

    setup = (mapProps, maps) => {
        axios.get('https://waterservices.usgs.gov/nwis/site/?format=rdb&stateCd=fl&parameterCd=00010&siteType=OC,ES,LK,ST,SP&siteStatus=active&hasDataTypeCd=dv')
            .then((response) => {
                let data = response.data.split('\n')
                let usgsSites = []
                for (let entry of data) {
                    if (entry.startsWith('USGS')) {
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
                axios.get('https://waterservices.usgs.gov/nwis/dv/?format=rdb&stateCd=fl&startDT=2021-10-09&endDT=2021-11-09&statCd=00003&parameterCd=00010&siteStatus=active')
                    .then((response) => {
                        let dData = response.data.split('\n')
                        let siteIds = new Set()
                        for(let entry of dData){
                            if(entry.startsWith('USGS')){
                                entry = entry.split('\t')
                                siteIds.add(entry[1])
                            }
                        }
                        let usgsSitesFinal = []
                        for(let entry of usgsSites){
                            if(siteIds.has(entry.id))
                                usgsSitesFinal.push(entry)
                        }
                        this.setState({
                            sites: usgsSitesFinal
                        })
                        if (this.props.onSiteDataReceived != null)
                            this.props.onSiteDataReceived()
                    }).catch((error) => {
                        alert(error)
                    })
            })
            .catch((error) => {
                alert(error)
            })
    }

    onZoomChanged = (mapProps, maps) => {
        // Should only run if necessary
        //this.setState({zoom: maps.zoom, center: maps.center})
    }

    onDragEnd = (mapProps, maps) => {
        let lat = maps.center.lat()
        let lng = maps.center.lng()
        let latNew = Math.min(maxLat, Math.max(minLat, lat))
        let lngNew = Math.min(maxLng, Math.max(minLng, lng))
        if (latNew !== lat || lngNew !== lng) {
            this.setState({
                center: {
                    lat: latNew,
                    lng: lngNew
                }
            })
        }
    }

    render = () => {
        console.log(this.state)
        const markers = []

        for (let entry of this.state.sites) {
            markers.push(
                <Marker
                    id={entry.id}
                    title={entry.name}
                    name={entry.name}
                    icon={{
                        url: markerImages[entry.type.substring(0, 2)],
                        scaledSize: new this.props.google.maps.Size(5, 5)
                    }}
                    position={{ lat: entry.lat, lng: entry.lng }} 
                    onClick={this.onMarkerClick}/>
            )
        }

        if (this.props.onMarkersLoaded != null && markers.length > 0)
            this.props.onMarkersLoaded()
        
        const infoWindowContent = []

        if(this.state.activeMarker != null){
            infoWindowContent.push(
                <h1>{this.state.activeMarkerProps.name}</h1>
            )
            if(this.state.activeSiteData != null){
                if(this.state.activeSiteData.length == 0){
                    infoWindowContent.push(
                        <h3>No available temperature data</h3>
                    )
                }else{
                    infoWindowContent.push(
                        <p><b>Average Temperature on {this.state.activeSiteData[this.state.activeSiteData.length - 1].date}:    </b>{this.state.activeSiteData[this.state.activeSiteData.length - 1].temperature}°C</p>
                    )
                    let data = []
                    for(let entry of this.state.activeSiteData){
                        data.push({x: new Date(entry.date), y: entry.temperature})
                    }
                    console.log(this.state.activeSiteData)
                    console.log(data)
                    infoWindowContent.push(
                        <h3>Average Daily Temperature (°C)</h3>
                    )
                    infoWindowContent.push(
                        <div style={{width: '50%', height: '20vh', margin:'auto'}}>
                            <VictoryChart
                            theme={VictoryTheme.material}
                            padding={{ top: 0, bottom: 50, right: 0, left: 0 }}
                            >
                            <VictoryLine
                                style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"}
                                }}
                                data={data}
                            />
                            </VictoryChart>
                        </div>
                    )
                }
            }
        }

        return (
            <div>
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
                    onTilesloaded={this.state.tiles_loaded ? null : this.onTilesLoaded}
                    onClick={this.onMapClick}
                >
                    {markers}
                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.activeMarker != null}
                        >
                            <div style={{color: 'black', height:'30vh'}}>
                                {infoWindowContent}
                            </div>
                    </InfoWindow>
                    <Polyline
                        path={
                            [
                                { lat: minLat, lng: minLng },
                                { lat: maxLat, lng: minLng },
                                { lat: maxLat, lng: maxLng },
                                { lat: minLat, lng: maxLng },
                                { lat: minLat, lng: minLng }
                            ]
                        }
                        strokeColor="#000000"
                        strokeOpacity={1}
                        strokeWeight={2}
                    />
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainer);