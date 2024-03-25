import { StyleSheet, View } from 'react-native';
import DropdownContentComponent from './DropdownContentComponent';

const data = [
  {
    "Title": "Máy cắt cỏ siêu mạnh 1",
    "LocationGive": "Kho 2, 227 Nguyễn Văn Cừ, Quận 5, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 1",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy say sinh tố tự động 1",
    "LocationGive": "Kho 3, 102 Lê Lợi, Quận 10, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 2",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Bàn ghế gỗ tự nhiên 1",
    "LocationGive": "Kho 4, 54 Trần Hưng Đạo, Quận 1, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 3",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy xay cà phê tự động 1",
    "LocationGive": "Kho 5, 12 Nguyễn Thị Minh Khai, Quận 3, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 4",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy ép trái cây tự động 1",
    "LocationGive": "Kho 6, 79 Lý Tự Trọng, Quận 10, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 5",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Đèn chùm phòng khách hiện đại 1",
    "LocationGive": "Kho 7, 102 Phạm Ngọc Thạch, Quận 3, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 6",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Tủ lạnh side-by-side cao cấp 1",
    "LocationGive": "Kho 8, 220 Trần Hưng Đạo, Quận 5, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 7",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy giặt công nghiệp 1",
    "LocationGive": "Kho 9, 327 Nguyễn Văn Cừ, Quận 1, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 8",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy hút bụi thông minh 1",
    "LocationGive": "Kho 10, 408 Lê Lợi, Quận 10, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 9",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Quạt trần đèn led 1",
    "LocationGive": "Kho 11, 509 Nguyễn Thị Minh Khai, Quận 3, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 10",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy lọc không khí thông minh 1",
    "LocationGive": "Kho 12, 608 Lý Tự Trọng, Quận 1, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 11",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy sưởi dầu tiện lợi 1",
    "LocationGive": "Kho 13, 701 Phạm Ngọc Thạch, Quận 10, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 12",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  },
  {
    "Title": "Máy pha cà phê tự động 1",
    "LocationGive": "Kho 14, 800 Trần Hưng Đạo, Quận 5, Thành Phố Hồ Chí Minh",
    "GiveType": "Loại 13",
    "Status": "Chưa có người nhận",
    "image": "https://www.titan-pro.co.uk/docs/stock/brushcutters/tp260/side.webp"
  }
]

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.filter}>

      </View>
      <View style={styles.content}>
        <DropdownContentComponent title="Đồ cho" data={data}/>
        <DropdownContentComponent title="Đồ nhận" data={data}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filter: {
    height: 40,
    backgroundColor: '#f1f1f1'
  },
  content: {
    flex: 1,
    flexDirection: 'column'
  }
});