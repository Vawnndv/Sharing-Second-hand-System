import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { Stack } from '@mui/material';
import Menu from './Menu';

function Layout() {
    return ( 
        <>
            <Header/>

            <Stack direction='row'>
                <Menu/>
                <div className='outletAndFooter'>
                    <Outlet/>
                    <Footer/>
                </div>
                
            </Stack>
            
            
        </>
     );
}

export default Layout;