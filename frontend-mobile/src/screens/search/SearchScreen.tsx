import React from "react";
import { Searchbar } from "react-native-paper";
import { ContainerComponent, HeaderComponent } from "../../components";
import SearchFilter from "./SearchFilter";
import { View, StyleSheet } from "react-native";

const data: any = [
  { keyword: "Áo sơ mi", id: 1, category: "Quần áo" },
  { keyword: "Bàn ghế cũ", id: 2, category: "Đồ nội thất" },
  { keyword: "Sofa", id: 2, category: "Đồ nội thất" },
  { keyword: "Máy khoan", id: 2, category: "Công cụ" },
  { keyword: "Bộ dụng cụ", id: 2, category: "Công cụ" },
  { keyword: "Cưa tay", id: 2, category: "Công cụ" },
  { keyword: "Vợt", id: 2, category: "Thể thao" },
  { keyword: "Xe đạp", id: 2, category: "Thể thao" },
  { keyword: "Đồ bơi", id: 2, category: "Thể thao" },
  { keyword: "Điện thoại", id: 2, category: "Công nghệ" },
  { keyword: "Tai nghe", id: 2, category: "Công nghệ" },
  { keyword: "Giày thể thao", id: 3, category: "Giày dép" },
  { keyword: "Túi xách", id: 4, category: "Khác" },
  { keyword: "Đồng hồ", id: 5, category: "Khác" },
  { keyword: "Áo len", id: 6, category: "Quần áo" },
  { keyword: "Váy dài", id: 7, category: "Quần áo" },
  { keyword: "Dép", id: 8, category: "Giày dép" },
  { keyword: "Áo khoác", id: 9, category: "Quần áo" },
  { keyword: "Quần tây", id: 10, category: "Quần áo" },
  { keyword: "Giày cao gót", id: 11, category: "Giày dép" },
  { keyword: "Ba lô", id: 12, category: "Khác" },
  { keyword: "Balo laptop", id: 14, category: "Dụng cụ học tập" },
  { keyword: "Đồng hồ", id: 15, category: "Khác" },
  { keyword: "Quần áo trẻ em", id: 16, category: "Quần áo" },
  { keyword: "Túi đeo chéo", id: 17, category: "Khác" },
  { keyword: "Bóp ví", id: 18, category: "Khác" },
  { keyword: "Nón", id: 19, category: "Khác" },
  { keyword: "Áo thun", id: 20, category: "Quần áo" },
];


const SearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = () => {
    navigation.navigate("SearchResultScreen", { searchQuery });
  };

  const handleSubmitEditing = () => {
    handleSearch();
  };

  return (
    <ContainerComponent back title="Tìm kiếm">
      <View style={styles.container}>
        <View style={styles.search}>
          <Searchbar
            placeholder="Bạn đang tìm kiếm gì nà?"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={handleSearch}
            onSubmitEditing={handleSubmitEditing}
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "gray",
            }}
          />
        </View>
        <SearchFilter
          navigation={navigation}
          data={data}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  search: {
    width: "100%",
    paddingHorizontal: "4%",
  },
});

export default SearchScreen;
