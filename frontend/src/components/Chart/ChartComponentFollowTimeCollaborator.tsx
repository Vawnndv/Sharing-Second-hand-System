import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { option } from './ChartConfig';

const colorArrayBackground = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(201, 203, 207, 0.2)'
]

const colorArrayBorder = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)'
]

function ChartComponentFollowTimeCollaborator({data, typeChart}: any) {
  const chartRef: any = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: typeChart,
      data: {
        labels:  data[0].data.results.map((row: any) => row.label),
        datasets: 
        data.map((category: any, index: number) => {
          return {
            label: category.label,
            data: category.data.results.map((row: any) => row.quantity),
            backgroundColor: typeChart === 'pie' ? [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
              ] : [
                colorArrayBackground[index % 7],
                colorArrayBackground[index % 7],
                colorArrayBackground[index % 7],
                colorArrayBackground[index % 7],
                colorArrayBackground[index % 7],
                colorArrayBackground[index % 7],
                colorArrayBackground[index % 7]
              ],
              borderColor: typeChart === 'pie' ? [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ] : [
                colorArrayBorder[index % 7],
                colorArrayBorder[index % 7],
                colorArrayBorder[index % 7],
                colorArrayBorder[index % 7],
                colorArrayBorder[index % 7],
                colorArrayBorder[index % 7],
                colorArrayBorder[index % 7]
              ],
            borderWidth: 3,
            tension: 0.2
          }
        })
      },
      options: option,
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

export default ChartComponentFollowTimeCollaborator;
