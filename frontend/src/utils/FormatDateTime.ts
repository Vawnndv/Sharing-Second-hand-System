/* eslint-disable no-unneeded-ternary */
export function formatDateTime(dateTimeStr: string): string {
  const dateTime = new Date(dateTimeStr);

  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const day = dateTime.getDate();
  const month = dateTime.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, vì vậy cần phải cộng thêm 1
  const year = dateTime.getFullYear();

  // Chuyển đổi giờ sang định dạng 12 giờ và xác định buổi sáng hoặc buổi tối
  const ampm = hours >= 12 ? 'pm' : 'am';
  let formattedHours = hours % 12;
  formattedHours = formattedHours ? formattedHours : 12; // Nếu giờ là 0, chuyển thành 12

  // Chuẩn hóa định dạng phút
  const formattedMinutes = minutes < 10 ? `0${  minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm} - ${day}/${month}/${year}`;
}
