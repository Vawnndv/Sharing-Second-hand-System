import { useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import StepIndicator from "react-native-step-indicator";

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

const labels = jsonData.map(item => item.label);

const {width, height} = Dimensions.get("window");

function formatDateTime(dateTimeStr : string) {
  const dateTime = new Date(dateTimeStr);

  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const day = dateTime.getDate();
  const month = dateTime.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, vì vậy cần phải cộng thêm 1
  const year = dateTime.getFullYear();

  // Chuyển đổi giờ sang định dạng 12 giờ và xác định buổi sáng hoặc buổi tối
  let ampm = hours >= 12 ? 'pm' : 'am';
  let formattedHours = hours % 12;
  formattedHours = formattedHours ? formattedHours : 12; // Nếu giờ là 0, chuyển thành 12

  // Chuẩn hóa định dạng phút
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm} - ${day}/${month}/${year}`;
}

export default function StepIndicatorOrder () {
  const [currentPosition, setCurrentPosition] = useState(2);

  return (
    <View style={styles.indicatorContainer}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        direction="vertical"
        stepCount={labels.length}
        renderLabel={({position, label}) => {
          return (
            <View style={{ padding: 10, paddingLeft: 5, width: width - 100}}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{jsonData[position].label}</Text>
              <Text style={{ fontSize: 14, color: 'grey' }}>{jsonData[position].status}</Text>
              <Text style={{ fontSize: 14, color: 'grey' }}>{formatDateTime(jsonData[position].dateTime)}</Text>
            </View>
          );
         }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorContainer: {
    height: height - 170,
    width: width - 30,
    padding: 20,
    paddingTop: 0,
    margin: 15,
    borderRadius: 20,
  } 
});
