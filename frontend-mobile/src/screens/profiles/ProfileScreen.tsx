import { Fontisto, SimpleLineIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import userAPI from '../../apis/userApi'
import { AvatarComponent, ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { ProfileModel } from '../../models/ProfileModel'
import { authSelector, removeAuth } from '../../redux/reducers/authReducers'
import { globalStyles } from '../../styles/globalStyles'
import { Flag } from 'iconsax-react-native'
import ReportModal from '../../modals/ReportModal'
import axiosClient from '../../apis/axiosClient'
import { AirbnbRating } from "react-native-ratings";
import { userSelector } from '../../redux/reducers/userReducers'

const ProfileScreen = ({navigation, route}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileModel>();
  const [profileId, setProfileId] = useState('');
  // const [refresh, setRefresh] = useState(false)
  const [rating, setRating] = useState<any>(null)

  const [visibleModalReport, setVisibleModalReport] = useState(false)

  const dispatch = useDispatch();

  const auth = useSelector(authSelector);
  const user = useSelector(userSelector);

  

  useEffect(() => {
    if (auth) {
      getProfile();
    };
  }, []);

  useEffect(() => {
    if (route.params) {
      setProfileId(route.params.id);

      if (route.params.isUpdated) {
        getProfile();
        setProfileId(auth.id);
      }
    } else {
      setProfileId(auth.id);
    }
  }, [route.params]);

  useEffect(() => {
    if (profileId) {
      getProfile();
    }
  }, [profileId]);

  const getProfile = async () => {
    setIsLoading(true);

    try {
      const res = await userAPI.HandleUser(`/get-profile?userId=${profileId}`);
      res && res.data && setProfile(res.data);

      const resRating = await axiosClient.get(`/rating/getRating?userID=${profileId}`)
      setRating(resRating.data)
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    };
  } ;

  const handleLogout = async () => {
    await AsyncStorage.clear();
    dispatch(removeAuth({}));
  }

  return (
    <ContainerComponent 
      isScroll 
      title={auth.id === profileId ? '' : 'Tài khoản'} 
      back={auth.roleID === 1 && auth.id !== profileId} 
      right={auth.roleID === 1 && auth.id === profileId}
      isLoading={isLoading}
      option= {(auth.id !== profileId) && (
        <TouchableOpacity
          onPress={() => 
            setVisibleModalReport(true)
          }
        >
          <Flag
            size="28"
            color={appColors.green}
            variant="Outline"
          />
        </TouchableOpacity>
      )}
    >
      {profile && (
        <>
          <SectionComponent styles={[globalStyles.center]}>
            <RowComponent>
              <AvatarComponent 
                avatar={profile.avatar}
                username={profile.firstname ? profile.firstname : profile.email}
                size={150}
                isBorder
              />
            </RowComponent>
            <SpaceComponent height={16} />
            <TextComponent
              text={profile.firstname + ' ' + profile.lastname}
              title
              size={24}
            />
          <SpaceComponent height={16} />
            <RowComponent>
              <View style={[globalStyles.center, {flex: 1}]}>
                <TextComponent
                  title
                  text={auth.id !== profile?.userId ? profile.giveCount : user.giveCount}
                  size={20}
                />
                <SpaceComponent height={8} />
                <TextComponent text="Sản phẩm đã cho" />
              </View>
              <View
                style={{
                  backgroundColor: appColors.gray2,
                  width: 1,
                  height: '100%',
                }}
              />
              <View style={[globalStyles.center, {flex: 1}]}>
                <TextComponent
                  title
                  text={auth.id !== profile?.userId ? profile.receiveCount : user.receiveCount}
                  size={20}
                />
                <SpaceComponent height={8} />
                <TextComponent text="Sản phẩm đã nhận" />
              </View>
              
            </RowComponent>
          </SectionComponent>
          {/* <SpaceComponent height={21} /> */}
          <SectionComponent>
            <View style={styles.container}>
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <Fontisto name="email" size={24} color={appColors.gray} />
                </View>
                <View style={styles.textContainer}>
                  <TextComponent text={profile.email}/>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <SimpleLineIcons name="phone" size={24} color={appColors.gray} />
                </View>
                <View style={styles.textContainer}>
                  <TextComponent text={profile.phonenumber}/>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <Fontisto name="date" size={24} color={appColors.gray} />
                </View>
                <View style={styles.textContainer}>
                  <TextComponent text={profile.dob ? moment(profile.dob).format('DD-MM-YYYY') : ''}/>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <SimpleLineIcons name="location-pin" size={26} color={appColors.gray} />
                </View>
                <View style={styles.textContainer}>
                  <TextComponent text={profile.address}/>
                </View>
              </View>
              <View style={styles.separator} />
              {
                rating !== null && rating?.average_rate !== null &&

                <><View style={styles.infoContainer}>
                    <View style={styles.iconContainer}>
                      <TextComponent text={`${parseFloat(rating.average_rate).toFixed(2)}`} styles={{
                        backgroundColor: '#929200',
                        paddingVertical: 2,
                        paddingHorizontal: 15,
                        color: 'white',
                        borderRadius: 10,
                        fontSize: 18,
                        fontWeight: '800'
                      }} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <TextComponent text={rating.amount_rate} styles={{
                        color: '#929200',
                        fontSize: 18,
                        paddingHorizontal: 10,
                        fontWeight: '800'
                      }} />
                      <AirbnbRating
                        count={5}
                        size={20}
                        defaultRating={parseInt(rating.average_rate)}
                        isDisabled
                        showRating={false} />
                    </View>
                  </View><View style={styles.separator} /></>
              }
              
            </View>
          </SectionComponent>
          {
            profile.userId === auth.id && (
              // <RowComponent justify='center'>
                <SectionComponent>
                  <ButtonComponent
                    styles={{
                      borderWidth: 1,
                      borderColor: appColors.primary,
                      backgroundColor: appColors.white,
                    }}
                    text="Sửa thông tin"
                    onPress={() =>
                      navigation.navigate('EditProfileScreen', {
                        profile,
                      })
                    }
                    textColor={appColors.primary}
                    type="primary"
                  />
    
                  {
                    auth.roleID !== 1 &&
                    <ButtonComponent
                      styles={{
                        borderWidth: 1,
                        borderColor: appColors.white,
                        backgroundColor: appColors.gray,
                      }}
                      text="Đăng xuất"
                      onPress={() =>
                        handleLogout()
                      }
                      textColor={appColors.white}
                      type="primary"
                    />
                  }
                </SectionComponent>
              // </RowComponent>
            )
          }

          <ReportModal visible={visibleModalReport} setVisible={setVisibleModalReport} title={profile.firstname + ' ' + profile.lastname} reportType={1} userID={profile.userId} postID={null} reporterID={auth.id} warehouseID={null}/>
        </>
      )}
    </ContainerComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
});


export default ProfileScreen