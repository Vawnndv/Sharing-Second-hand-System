/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */

import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import { CheckBox } from '@mui/icons-material';
import { Checkbox, Stack, Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const initialLocation = {
    lat: 10.762593665183042,
    lng: 106.68234223144808
}

function MapSelectWarehouses({warehouses, warehousesSelected, handleSelectWarehouses}: any) {
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY ? process.env.GOOGLE_MAP_API_KEY : ''
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

  const [isOpens, setIsOpens] = useState(Array.from({length: warehouses.length}, () => true))
  const handleOpen = (index: number) => {
    const newIsOpens = [...isOpens]
    newIsOpens[index] = !newIsOpens[index]
    setIsOpens(newIsOpens)
  }

  const warehouse = warehouses[0]

  return isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialLocation}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {
            warehouses.map((warehouse: any, index: number) => {
                return (
                    <div key={index}>
                        <Marker position={{
                            lat: parseFloat(warehouse.latitude),
                            lng: parseFloat(warehouse.longitude)
                        }}
                            cursor='Mouse'
                            title={warehouse.warehousename}
                            onClick={() => handleOpen(index)}
                        />
                        {
                            isOpens[index] &&
                            <InfoWindow
                                position={{ 
                                    lat: parseFloat(warehouse.latitude),
                                    lng: parseFloat(warehouse.longitude)
                                }}
                                onCloseClick={() => handleOpen(index)}
                            >
                                <Stack
                                  style={{ maxWidth: '200px', cursor: 'pointer'}}
                                  onClick={() => handleSelectWarehouses(warehouse.warehouseid)}>
                                    <Stack
                                        flexDirection='row'
                                        alignItems='center'>
                                        <Typography variant='body1' sx={{fontWeight: 'bold'}}>{warehouse.warehousename}</Typography>
                                        <Checkbox
                                            checked={warehousesSelected[index]}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                            
                                        />
                                    </Stack>
                                    <Typography variant='body2'>{warehouse.address}</Typography>
                                </Stack>
                            </InfoWindow>
                        }
                        
                    </div>
                    
                )
            })
        }

      </GoogleMap>
  )
}

export default MapSelectWarehouses;