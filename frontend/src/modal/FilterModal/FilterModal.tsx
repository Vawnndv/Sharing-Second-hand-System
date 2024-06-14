
import React from 'react';
import FilterComponent from '../../components/Filter/FilterComponent';
import { Stack } from '@mui/material';

function FilterModal({isShowFilter, filterValue, setFilterValue}: any) {
    return ( 
        <Stack>
            <FilterComponent isShowFilter={isShowFilter} filterValue={filterValue} setFilterValue={setFilterValue}/>
        </Stack>
     );
}

export default FilterModal;