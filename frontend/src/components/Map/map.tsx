/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */

import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const API_KEY = 'AIzaSyA73cwXhM4O2ATAhqDCbs7B_7UogxxAlYM'
// const API_KEY = 'AIzaSyBo988K53_gLTRL0MHoiZGkIjOUoJheyEQ'
// const API_KEY = 'AIzaSyBW-S8iBG0D-d2QahuXvJbtvkUOpy2A8OY'

const containerStyle = {
  width: '100%',
  height: '80vh'
};



function Map({lat, long, address}: any) {
  const center = {
    lat,
    lng: long
   };
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  })

  const [map, setMap] = useState<any>(null)

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    map.setZoom(15); // Set zoom level to 15
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  return isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <Marker position={{
            lat,
            lng: long
        }}
            cursor='Mouse'
            title={address}/>

      </GoogleMap>
  )
}

export default Map;