import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

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

export class MapContainer extends React.Component {
    setup = (mapProps, maps)=>{
        console.log(process.env.REACT_APP_GOOGLE_API_KEY)
    }

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={7}
                minZoom={7}
                style={mapStyles}
                containerStyle={containerStyle}
                initialCenter={
                    {
                        lat: 28.0571376,
                        lng: -83.7662318
                    }
                }
                center={
                    {
                        lat: 28.0571376,
                        lng: -83.7662318
                    }
                }
                mapTypeControl={false}
                scaleControl={false}
                streetViewControl={false}
                fullscreenControl={false}
                onReady={this.setup}
            />
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainer);