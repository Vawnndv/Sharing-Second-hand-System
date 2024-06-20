import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { Dayjs } from 'dayjs';

export default function DatePicker({date, setDate}: any) {

  const handleDateChange = (newValue: [Dayjs | null, Dayjs | null]) => {
    setDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DateRangePicker localeText={{ start: 'Ngày bắt đầu', end: 'Ngày kết thúc' }} 
          value={date}
          onChange={handleDateChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
} 