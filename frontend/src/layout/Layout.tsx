import React, { useState } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { Stack } from '@mui/material';
import Menu from './Menu';

function Layout() {
    const [index, setIndex] = useState(0)
    return ( 
        <>
            <Header setIndex={setIndex}/>

            <Stack direction='row'>
                <Menu index={index} setIndex={setIndex}/>
                <div className='outletAndFooter' style={{display: 'flex', flexDirection: 'column'}}>
                    <Outlet/>
                    <Footer/>
                </div>
                
            </Stack>
            
            
        </>
     );
}

export default Layout;