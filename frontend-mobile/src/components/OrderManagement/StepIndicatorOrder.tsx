import { useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import StepIndicator from "react-native-step-indicator";
import { formatDateTime } from "../../utils/FormatDateTime";
import React, { useEffect } from 'react';
import orderAPI from '../../apis/orderApi';

const jsonData = [
  {
    label: "Cart",
    status: "In Progress",
    dateTime: "2024-03-25T10:30:00"
  },
  {
    label: "Delivery Address",
    status: "Completed",
    dateTime: "2024-03-26T13:45:00"
  },
  {
    label: "Order Summary",
    status: "Pending",
    dateTime: "2024-03-27T08:15:00"
  },
  {
    label: "Payment Method",
    status: "In Progress",
    dateTime: "2024-03-28T11:20:00"
  },
  {
    label: "Track",
    status: "Completed",
    dateTime: "2024-03-29T09:00:00"
  },
  {
    label: "Track",
    status: "Completed",
    dateTime: "2024-03-29T09:00:00"
  },
  {
    label: "Track",
    status: "Completed",
    dateTime: "2024-03-29T09:00:00"
  }
];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#552466',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#552466',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#552466',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#552466',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#552466',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#552466',
}

interface Item {
  statusname: string;
  createdat: string;
}

// const labels = jsonData.map(item => item.label);

const {width, height} = Dimensions.get("window");

export default function StepIndicatorOrder ({orderID}: any) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [data, setData] = useState<any>([]);
  const [labels, setLabels] = useState<any>([]);

  useEffect(function() {
    getTrackingList()
  }, []);

  const getTrackingList = async () => {
    try {
      const res = await orderAPI.HandleOrder(
        `/tracking?orderID=${orderID}`,
        'get'
      );

      const responseData: Item[] = res.data;
      setData(responseData);
      setLabels(responseData.map(item => item.statusname));
      setCurrentPosition(responseData.map(item => item.statusname).length)

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.indicatorContainer, { padding: 10, paddingLeft: 5, height: height - (height / (labels.length < 2 ? 2 : labels.length)) }]}>
      {
        labels.length === 0 ? (
          <></>
        ) : (
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            labels={labels}
            direction="vertical"
            stepCount={labels.length}
            renderLabel={({position, label}) => {
              return (
                <View style={{ padding: 10, paddingLeft: 5, width: width - 100}}>
                  <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{data[position].statusname}</Text>
                  {/* <Text style={{ fontSize: 14, color: 'grey' }}>{jsonData[position].status}</Text> */}
                  <Text style={{ fontSize: 14, color: 'grey' }}>{formatDateTime(data[position].createdat)}</Text>
                </View>
              );
             }}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorContainer: {
    width: width - 30,
    padding: 20,
    paddingTop: 0,
    margin: 15,
    borderRadius: 20,
  } 
});
