/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */

import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button, Checkbox, IconButton, InputBase, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../../hooks/useDebounce';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

// const API_KEY = 'AIzaSyA73cwXhM4O2ATAhqDCbs7B_7UogxxAlYM'
const API_KEY = 'AIzaSyBo988K53_gLTRL0MHoiZGkIjOUoJheyEQ'

const getUrlRequest = (query: string) => {
  return `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const initialLocation = {
    lat: 10.762593665183042,
    lng: 106.68234223144808
}

function SuggestComponent({suggests, handleClickLocation}: any) {

  const handleClick = () => {
    console.log('click location')
  }
  return (
    <Stack
      flexDirection='column'
      sx={{
        position: 'absolute',
        top: 70,
        left: '50%',
        transform: 'translate(-50%, 0)',
        width: '50%',
        maxWidth: '600px',
        minWidth: '300px',
        overflow: 'auto',
        maxHeight: '600px',
        backgroundColor: 'white',
        borderRadius: 2
      }}>
      {
        suggests.map((location: any, index: number) => {
          return (
            <Button type='button' key={index}
              sx={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                // zIndex: 1
              }}
              onMouseDown={ () => handleClickLocation(parseFloat(location.lat), parseFloat(location.lon), location.display_name)}
              >
              <Stack
                direction='column'
                sx={{
                  px: 2, py: 1
                }}
                component='div'
                // onClick={ () => handleClick()}
                >
                <Stack
                  flexDirection='column'>
                    <Typography variant='body1' sx={{fontWeight: 'bold'}}>{location.name}</Typography>
                    <Typography variant='body2'>{location.display_name}</Typography>
                </Stack>
                {
                  (index < (suggests.length - 1)) &&
                  <Stack component='div' sx={{width: '100%', height: '2px', backgroundColor: 'black', mt: 1}} />
                }
              </Stack>
            </Button>
            
            
          )
        })
      }
      
    </Stack>
    
  )
}

function MapSelectAddress({setLocation}: any) {

  const [inputSearch, setInputSearch] = useState('')
  const debouncedSearch = useDebounce(inputSearch, 500);
  const [dataSearch, setDataSearch] = useState<any[]>([])
  const [isFocusSearch, setIsFocusSearch] = useState(false)
  const [locationSelected, setLocationSelected] = useState<any>(null)
  const [center, setCenter] = useState<any>(initialLocation)

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

  const searchLocation = async (text: string) => {
    try {
        const response = await axios.get(getUrlRequest(text));
        setDataSearch(response.data)
    } catch (error) {
        console.error('Lỗi khi tìm kiếm địa điểm:', error);
    }
  };

  useEffect(() => {
    searchLocation(debouncedSearch)
  }, [debouncedSearch])

  const moveCameraToCoordinate = (locationTarget: any) => {
    console.log('moveCameraToCoordinate',locationTarget)
    setCenter({
      lat: locationTarget.latitude,
      lng: locationTarget.longitude, 
    })
  };
  
  const handleClickLocation = (lat: any, lon: any, display_name: any) => {
    
      const locationTarget = {
          latitude: lat,
          longitude: lon, 
          address: display_name
      }
      console.log('handleClickLocation',locationTarget)
      setLocationSelected(locationTarget)
      setInputSearch(display_name)
      moveCameraToCoordinate(locationTarget)
      setIsFocusSearch(false)
      
  }

  const getCenter = () => {
    const center = map.getCenter();
    console.log('Vị trí giữa của bản đồ:', center.lat(), center.lng());
    return center
  };

  const handleConfirmAddress = () => {
    const center = getCenter()
    console.log('handleConfirmAddress')
    setLocation({
      latitude: center.lat(),
      longitude: center.lng(),
      address: inputSearch
    })
  }

  return isLoaded && (
    <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      
      >
        {}

        <Stack
          flexDirection='row'
          sx={{
            position: 'absolute',
            backgroundColor: '#FCF8FF',
            top: 10,
            left: '50%',
            transform: 'translate(-50%, 0)',
            borderRadius: 20,
            width: '50%',
            maxWidth: '600px',
            minWidth: '300px',
          }}>
          <InputBase
            sx={{ ml: 1, flex: 1, p: 1 }}
            placeholder="Tìm kiếm..."
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            onFocus={() => setIsFocusSearch(true)}
            onBlur={() => setIsFocusSearch(false)}
          />
          <IconButton
           sx={{
            p: 2,
            borderRadius: 30,
            backgroundColor: '#FAF5FF',
            border: '1px solid #C89FE7',
            boxShadow: '1px 1px 10px #F4F4F4'
           }}>
            <SearchIcon />
          </IconButton>
        </Stack>
        {
          isFocusSearch &&
          <SuggestComponent suggests={dataSearch} handleClickLocation={handleClickLocation}/>
        }

        <Button variant='contained' sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          px: 4,
          py: 2,
          borderRadius: 20
        }}
          onClick={() => handleConfirmAddress()}>
          <Typography variant='body1'>Xác nhận vị trí</Typography>
        </Button>

        <LocationOnIcon
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 50,
            height: 50,
            color: '#441672'
          }}/>
      </GoogleMap>

  )
}

export default MapSelectAddress;