
export const option = {
    scales: {
      x: {
        ticks: {
            
          font: {
            weight: 'bold', // In đậm
            style: 'normal', // Không nghiêng
            size: 14
          },
          maxRotation: 0, // Không xoay nhãn
          minRotation: 0, // Không xoay nhãn
          color: '#4E597D',
          
        }
      },
      y: {
          ticks: {
              beginAtZero: true,
              color: '#005B47',
              font: {
                weight: 'bold',
                size: 14
              }
          }
      }
    }
}
