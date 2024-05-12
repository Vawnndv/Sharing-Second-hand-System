/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */

import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import { CheckBox } from '@mui/icons-material';
import { Checkbox, Stack, Typography } from '@mui/material';


// const API_KEY = 'AIzaSyA73cwXhM4O2ATAhqDCbs7B_7UogxxAlYM'
const API_KEY = 'AIzaSyBo988K53_gLTRL0MHoiZGkIjOUoJheyEQ'

const containerStyle = {
  width: '100%',
  height: '100%'
};

const initialLocation = {
    lat: 10.762593665183042,
    lng: 106.68234223144808
}

function MapSelectAddress({setLocation}: any) {
  
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
        center={initialLocation}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {}

      </GoogleMap>
  )
}

export default MapSelectAddress;