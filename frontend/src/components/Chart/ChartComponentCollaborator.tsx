import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useSelector } from 'react-redux';
import { option } from './ChartConfig';

const colorArrayBackground = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(201, 203, 207, 0.2)',
  'rgb(0, 0, 0, 0.2)'
]

const colorArrayBorder = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
  'rgb(0, 0, 0)'
]

function ChartComponentCollaborator({data, title, typeChart}: any) {
  const userLogin = useSelector((state: any) => state.userLogin);
  const chartRef: any = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: typeChart,
      data: {
        labels: (userLogin.userInfo.roleID === 2 || title === 'Lượng người truy cập' || title === 'Lượng đăng bài') ? data.map((row: any) => row.label) : data[0].data.results.map((row: any) => row.label),
        datasets: (userLogin.userInfo.roleID === 2 || title === 'Lượng người truy cập' || title === 'Lượng đăng bài') ? 
        [
          {
            label: title,
            data: data.map((row: any) => row.quantity),
            backgroundColor: colorArrayBackground,
              borderColor: colorArrayBorder,
            borderWidth: 3,
            tension: 0.2
          },
        ] :
        data.map((wh: any, index: number) => {
          return {
            label: wh.warehousename,
            data: wh.data.results.map((row: any) => row.quantity),
            backgroundColor: typeChart === 'pie' ? colorArrayBackground : [
                colorArrayBackground[index % 8],
                colorArrayBackground[index % 8],
                colorArrayBackground[index % 8],
                colorArrayBackground[index % 8],
                colorArrayBackground[index % 8],
                colorArrayBackground[index % 8],
                colorArrayBackground[index % 8],
                colorArrayBackground[index % 8],
              ],
              borderColor: typeChart === 'pie' ? colorArrayBorder : [
                colorArrayBorder[index % 8],
                colorArrayBorder[index % 8],
                colorArrayBorder[index % 8],
                colorArrayBorder[index % 8],
                colorArrayBorder[index % 8],
                colorArrayBorder[index % 8],
                colorArrayBorder[index % 8],
                colorArrayBorder[index % 8],
              ],
            borderWidth: 3,
            tension: 0.2
          }
        })
      },
      options: option
    });

    return () => {
      chartInstance.destroy(); // Hủy đối tượng chart khi component unmount
    };
  }, [typeChart]);

  return (
    <div style={{width: '80vw', height: '90vh', marginRight: '30px'}}>
      <canvas style={{width: '100%'}} ref={chartRef} />
    </div>
  );
}

export default ChartComponentCollaborator;
