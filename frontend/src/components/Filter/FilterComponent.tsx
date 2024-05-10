/* eslint-disable array-callback-return */

import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import React, { useEffect, useState } from 'react';
import './styles.scss';

const category = [
    "Quần áo",
    "Giày dép",
    "Đồ nội thất",
    "Công cụ",
    "Dụng cụ học tập",
    "Thể thao",
    "Khác"
]

// const distance = [
//     5,
//     15,
//     25,
//     -1,
// ]

// const time = [
//     3,
//     14,
//     30,
//     -1,
// ]

function FilterComponent({isShowFilter, filterValue, setFilterValue}: any) {

    const [distanceSelect, setDistanceSelect] = useState('-1')
    const [timeSelect, setTimeSelect] = useState('-1')
    const [sortSelect, setSortSelect] = useState('Mới nhất')
    const [categories, setCategories] = useState(Array.from({length: 7}, () => true))
    const handleChangeCategory = (index: number) => {
        const tempCategories = [...categories]
        tempCategories[index] = !tempCategories[index]
        setCategories(tempCategories)
        console.log(categories)
    }

    useEffect(() => {
        // Thiết lập giá trị ban đầu dựa trên filterValue khi component được tải
        const { distance: filterDistance, time: filterTime, category: filterCategory, sort: filterSort } = filterValue;
        console.log(filterValue)
        setDistanceSelect(filterDistance)
        setTimeSelect(filterTime)
        setSortSelect(filterSort)

        const newFilterCategory = Array.from({length: 7}, () => false)
        filterCategory.map((item: any) => {
            newFilterCategory[category.indexOf(item)] = true
        })

        setCategories(newFilterCategory);
    }, [filterValue]);

    const handleApply = () => {
        const newCategories: any = []
        categories.map((item: any, index: number) => {
            if(item === true){
                newCategories.push(category[index])
            }
        })
        setFilterValue({
            distance: distanceSelect,
            time: timeSelect,
            category: newCategories,
            sort: sortSelect
        })
        console.log({
            distance: distanceSelect,
            time: timeSelect,
            category: newCategories,
            sort: sortSelect
        })
    }
    return ( 
        <Stack
        sx={{m: 3, zIndex: 2}}
        // style={{ backgroundColor: '#C8CFF2', borderRadius: '20px', width: '280px'}}
        className={`containerFilter ${isShowFilter === false && 'hidden'}`}>
            <Stack
                direction='column'
                sx={{ pt: 5, pl: 5}}>
                <FormControl
                    sx={{width: '100%'}}>
                    <FormLabel id="demo-radio-buttons-group-label" sx={{fontWeight: 'bold'}}>Khoảng cách</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={distanceSelect}
                        onChange={(e) => setDistanceSelect(e.target.value)}
                    >
                        <FormControlLabel value="5" control={<Radio />} label="5 km"/>
                        <FormControlLabel value="15" control={<Radio />} label="15 km" />
                        <FormControlLabel value="25" control={<Radio />} label="25 km" />
                        <FormControlLabel value="-1" control={<Radio />} label="Tất cả" />
                    </RadioGroup>
                </FormControl>

                <FormControl
                    sx={{width: '100%', marginTop: 2}}>
                    <FormLabel id="demo-radio-buttons-group-label" sx={{fontWeight: 'bold'}}>Thời gian</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={timeSelect}
                        onChange={(e) => setTimeSelect(e.target.value)}
                    >
                        <FormControlLabel value="3" control={<Radio />} label="3 ngày trước"/>
                        <FormControlLabel value="14" control={<Radio />} label="2 tuần trước" />
                        <FormControlLabel value="30" control={<Radio />} label="1 tháng trước" />
                        <FormControlLabel value="-1" control={<Radio />} label="Tất cả" />
                    </RadioGroup>
                </FormControl>

                <FormControl sx={{ marginTop: 2 }} component="fieldset" variant="standard">
                    <FormLabel component="legend" sx={{fontWeight: 'bold'}}>Doanh mục</FormLabel>
                    <FormGroup>
                    <FormControlLabel
                        control={
                        <Checkbox checked={categories[0]} onChange={() => handleChangeCategory(0)} name="Quần áo" />
                        }
                        label="Quần áo"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={categories[1]} onChange={() => handleChangeCategory(1)} name="Giày dép" />
                        }
                        label="Giày dép"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={categories[2]} onChange={() => handleChangeCategory(2)} name="Đồ nội thất" />
                        }
                        label="Đồ nội thất"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={categories[3]} onChange={() => handleChangeCategory(3)} name="Công cụ" />
                        }
                        label="Công cụ"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={categories[4]} onChange={() => handleChangeCategory(4)} name="Dụng cụ học tập" />
                        }
                        label="Dụng cụ học tập"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={categories[5]} onChange={() => handleChangeCategory(5)} name="Thể thao" />
                        }
                        label="Thể thao"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={categories[6]} onChange={() => handleChangeCategory(6)} name="Khác" />
                        }
                        label="Khác"
                    />
                    </FormGroup>
                </FormControl>

                <FormControl
                    sx={{width: '100%', marginTop: 2}}>
                    <FormLabel id="demo-radio-buttons-group-label" sx={{fontWeight: 'bold'}}>Sắp xếp</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={sortSelect}
                        onChange={(e) => setSortSelect(e.target.value)}
                    >
                        <FormControlLabel value="Mới nhất" control={<Radio />} label="Mới nhất" />
                        <FormControlLabel value="Gần nhất" control={<Radio />} label="Gần nhất" />
                    </RadioGroup>
                </FormControl>
            </Stack>
            
            <Button
                onClick={() => handleApply()}
                variant="contained"
                sx={{my: 2, mx: 2, borderRadius: 10}}>Áp dụng</Button>
        </Stack>
        
     );
}

export default FilterComponent;