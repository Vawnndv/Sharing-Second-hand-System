/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */

import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Alert, Button, Checkbox, IconButton, InputBase, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../../hooks/useDebounce';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import Axios from '../../redux/APIs/Axios';
import { useSelector } from 'react-redux';
import home from '../../assets/home.png'
import  './styles.scss'

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
        borderRadius: 2,
        zIndex: 2
      }}>
      {
        suggests.map((location: any, index: number) => {
          return (
            <Stack key={index}>
              <Stack
                className='autocompleteComponent'
                sx={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  px: 3,
                  py: 2
                  // zIndex: 1
                }}
                onMouseDown={ () => handleClickLocation(parseFloat(location.lat), parseFloat(location.lon), location.display_name)}
                >
                <Stack
                  direction='column'
                  component='div'
                  // onClick={ () => handleClick()}
                  >
                  <Stack
                    flexDirection='column'>
                      <Typography variant='body1' sx={{fontWeight: 'bold'}}>{location.name}</Typography>
                      <Typography variant='body2'>{location.display_name}</Typography>
                  </Stack>
                  
                </Stack>
                  
              </Stack>
                {
                  (index < (suggests.length - 1)) &&
                  <Stack component='div' sx={{width: '100%', height: '2px', backgroundColor: 'black'}} />
                }
            </Stack>
            
            
            
          )
        })
      }
      
    </Stack>
    
  )
}

function MapSelectAddress({setLocation, handleClose, isUser}: any) {

  const [inputSearch, setInputSearch] = useState('')
  const debouncedSearch = useDebounce(inputSearch, 500);
  const [dataSearch, setDataSearch] = useState<any[]>([])
  const [isFocusSearch, setIsFocusSearch] = useState(false)
  const [locationSelected, setLocationSelected] = useState<any>(null)
  const [center, setCenter] = useState<any>(initialLocation)

  const userLogin = useSelector((state: any) => state.userLogin);
  const [homeLocation, setHomeLocation] = useState<any>(null)

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
      setLocationSelected(locationTarget)
      setInputSearch(display_name)
      moveCameraToCoordinate(locationTarget)
      setIsFocusSearch(false)
      
  }

  const getAddressFromLatLng = async (lat: any, lng: any) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
    const data = await response.json();
    if (data && data.display_name) {
      setLocation({
        latitude: lat,
        longitude: lng,
        address: data.display_name
      })
      if(isUser === true){
        try {
          const response = await Axios.post(`/map/set_user_location`, {
            userID: userLogin.userInfo.id,
            latitude: lat, 
            longitude: lng, 
            address: data.display_name
          })
        } catch (error) {
          console.log(error)
        }
      }
      
    } else {
      console.log('No results found');
    }
  };

  const getCenter = () => {
    const center = map.getCenter();
    return center
  };

  const handleConfirmAddress = async () => {
    const center = getCenter()

      getAddressFromLatLng(center.lat(), center.lng())
      handleClose()

      
      // eslint-disable-next-line no-alert
      alert('Cập nhật vị trí thành công!')
      
    
    
  }

  useEffect(() => {
    const fetchHomeLocation = async () => {
      try {
        const response = await Axios.get(`/user/get-user-address?userId=${userLogin.userInfo.id}`)
        setHomeLocation({
            address: response.data.address,
            latitude: parseFloat(response.data.latitude),
            longitude: parseFloat(response.data.longitude)
        })
        setCenter({
          lat: parseFloat(response.data.latitude),
          lng: parseFloat(response.data.longitude)
        })
        
      } catch (error) {
        console.log(error)
      }
        
    }
    fetchHomeLocation()
    
  }, [])

  return isLoaded && (
    <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      
      >
        {
            homeLocation !== null &&
            <Marker
                position={{
                    lat: parseFloat(homeLocation.latitude),
                    lng: parseFloat(homeLocation.longitude)
                }}
                title="Vị trí nhà của bạn"
                icon={{
                  url: home, // Sử dụng hình ảnh marker tùy chỉnh
                  scaledSize: new window.google.maps.Size(50, 50), // Kích thước mong muốn của marker
                }}
            />
        }

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
            border: '1px solid #441672',
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
          borderRadius: 20,
          zIndex: 0
        }}
          onClick={() => handleConfirmAddress()}>
          <Typography variant='body1'>Xác nhận vị trí</Typography>
        </Button>

        <LocationOnIcon
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            width: 50,
            height: 50,
            color: '#441672',
            zIndex: 1
          }}/>
      </GoogleMap>

  )
}

export default MapSelectAddress;