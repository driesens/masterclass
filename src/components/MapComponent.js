import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    key="AIzaSyDBHInvI2wGMjhsbAzgyETswpf1A9N5lUQ"
    defaultZoom={10}
    defaultCenter={{ lat: 53.21694957267965, lng: 6.566890693142341 }}
    onClick={props.onClick}
  >
    {props.markers.map((item, index) => (<Marker key={index} position={{ lat: item.lat, lng: item.lng }} />))}
  </GoogleMap>
))

export default MapComponent;
