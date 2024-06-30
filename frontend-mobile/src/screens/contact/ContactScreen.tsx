import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactScreen = () => {
  return (
    <ContainerComponent back isScroll title="Liên hệ">
      <SectionComponent>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/images/retreasure_title_logo.png")} style={styles.logo} />
        </View>
      </SectionComponent>
      <SectionComponent>
        <TextComponent 
          text="ReTreasure - Hệ thống chia sẻ đồ cũ" 
          styles={styles.title} 
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent 
          text="Ứng dụng chia sẻ đồ cũ là nền tảng kết nối giữa những người có đồ dùng đã qua sử dụng và những người cần sử dụng chúng lại. Với mục đích giảm thiểu lượng rác thải và tối ưu hóa tài nguyên, ứng dụng này cho phép người dùng đăng tải các món đồ từ quần áo, đồ gia dụng đến đồ chơi và sách vở, để những ai có nhu cầu có thể tìm và lựa chọn miễn phí hoặc với chi phí rất thấp. Đây không chỉ là một cách để giảm bớt sự lãng phí mà còn là một cộng đồng nhân văn, kết nối con người và lan tỏa tinh thần sáng tạo và sự chia sẻ trong cộng đồng." 
          styles={styles.description} 
        />
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <TextComponent text="Thông tin liên hệ:" styles={styles.subtitle} />
        <View style={styles.contactItem}>
          <Icon name="email" size={24} color={appColors.primary} />
          <TextComponent text="20127662@student.hcmus.edu.vn" styles={styles.contactDetail} />
        </View>
        <View style={styles.contactItem}>
          <Icon name="location-on" size={24} color={appColors.primary} />
          <TextComponent text="227 Nguyễn Văn Cừ, Phường 3, Quận 5, Thành Phố Hồ Chí Minh" styles={styles.contactDetail} />
        </View>
      </SectionComponent>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: appColors.primary,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    color: appColors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: appColors.primary,
    textAlign: 'center'
  },
  contactDetail: {
    fontSize: 16,
    color: appColors.text,
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  }
});

export default ContactScreen;
