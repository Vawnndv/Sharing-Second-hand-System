import React from 'react'
import { Searchbar } from 'react-native-paper'
import { ContainerComponent, HeaderComponent } from '../../components'
import SearchFilter from './SearchFilter'
import { View, StyleSheet } from 'react-native';

const data : any = [
  { keyword: 'Áo sơ mi nam', id: 1, category: 'Áo' },
  { keyword: 'Quần jean nữ', id: 2, category: 'Quần' },
  { keyword: 'Giày thể thao', id: 3, category: 'Giày' },
  { keyword: 'Túi xách da', id: 4, category: 'Túi xách' },
  { keyword: 'Đồng hồ nam', id: 5, category: 'Đồng hồ' },
  { keyword: 'Áo len nữ', id: 6, category: 'Áo' },
  { keyword: 'Váy dài nữ', id: 7, category: 'Váy' },
  { keyword: 'Dép quai hậu', id: 8, category: 'Dép' },
  { keyword: 'Áo khoác nữ', id: 9, category: 'Áo' },
  { keyword: 'Quần tây nam', id: 10, category: 'Quần' },
  { keyword: 'Giày cao gót', id: 11, category: 'Giày' },
  { keyword: 'Ba lô du lịch', id: 12, category: 'Ba lô' },
  { keyword: 'Nước hoa nam', id: 13, category: 'Nước hoa' },
  { keyword: 'Balo laptop', id: 14, category: 'Ba lô' },
  { keyword: 'Đồng hồ nữ', id: 15, category: 'Đồng hồ' },
  { keyword: 'Quần áo trẻ em', id: 16, category: 'Quần áo' },
  { keyword: 'Túi đeo chéo', id: 17, category: 'Túi xách' },
  { keyword: 'Bóp ví nam', id: 18, category: 'Bóp ví' },
  { keyword: 'Nón snapback', id: 19, category: 'Nón' },
  { keyword: 'Áo thun nữ', id: 20, category: 'Áo' },
  // Thêm các từ khóa và loại hàng khác nếu cần
];

const SearchScreen = ({navigation} : any) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    navigation.navigate('SearchResultScreen', { searchQuery });
  };

  const handleSubmitEditing = () => {
    handleSearch();
  };

  return (
    <ContainerComponent back title='Tìm kiếm'>
      <View style={styles.container}>
        <View style={styles.search}>
          <Searchbar
            placeholder="Bạn đang tìm kiếm gì nà?"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={handleSearch}
            onSubmitEditing={handleSubmitEditing}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: 'gray',
            }}
          />
        </View>
        <SearchFilter navigation={navigation} data={data} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      </View>
    </ContainerComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  search: {
    width: '100%',
    paddingHorizontal: '4%',
  }
});

export default SearchScreen