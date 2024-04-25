export const statusOrder = {
  POST: { statusid: "1", statusname: "Đăng bài" },
  AWAITING_APPROVAL: { statusid: "2", statusname: "Chờ xét duyệt" },
  AWAITING_PICKUP: { statusid: "3", statusname: "Chờ người nhận lấy hàng" },
  RECEIVER_RECEIVED: { statusid: "4", statusname: "Người nhận đã nhận hàng" },
  COMPLETED: { statusid: "5", statusname: "Hoàn tất" },
  CANCELED: { statusid: "6", statusname: "Hủy" },
  AWAITING_COLLABORATOR_PICKUP: { statusid: "7", statusname: "Chờ cộng tác viên lấy hàng" },
  AWAITING_DELIVERY: { statusid: "8", statusname: "Chờ người nhận giao hàng" },
  STOCK_RECEIVED: { statusid: "9", statusname: "Hàng đã nhập kho" },
  REJECTED: { statusid: "10", statusname: "Từ chối xét duyệt" },
  AWAITING_PICKUP_ARRIVAL: { statusid: "11", statusname: "Hàng đang được đến lấy" },
  APPROVAL: { statusid: "12", statusname: "Đã duyệt" },
};