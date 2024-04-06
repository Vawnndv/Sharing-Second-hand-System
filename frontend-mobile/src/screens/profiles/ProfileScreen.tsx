import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarComponent, ButtonComponent, ContainerComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { authSelector, removeAuth } from '../../redux/reducers/authReducers'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import userAPI from '../../apis/userApi'
import { ProfileModel } from '../../models/ProfileModel'
import { Avatar } from 'react-native-paper'

const ProfileScreen = ({navigation, route}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileModel>();
  const [profileId, setProfileId] = useState('');

  const dispatch = useDispatch();

  const auth = useSelector(authSelector);

  useEffect(() => {
    if (auth) {
      getProfile();
    };
  }, []);

  useEffect(() => {
    if (route.params) {
      const {id} = route.params;
      setProfileId(id);

      if (route.params.isUpdated) {
        getProfile();
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
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    };
  } ;

  return (
    <ContainerComponent isScroll title='Profile' back right>
      {isLoading ? (
        <ActivityIndicator />
        // <LoadingComponent isLoading={isLoading} values={1} />
      ) : profile ? (
        <>
          <SectionComponent styles={[globalStyles.center]}>
            <RowComponent>
              <AvatarComponent 
                avatar={profile.avatar}
                username={profile.username ? profile.username : profile.email}
                size={150}
                isBorder
              />
            </RowComponent>
            <SpaceComponent height={16} />
            <TextComponent
              text={profile.username}
              title
              size={24}
            />
          <SpaceComponent height={16} />
            <RowComponent>
              <View style={[globalStyles.center, {flex: 1}]}>
                <TextComponent
                  title
                  text={`20`}
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
                  text={`10`}
                  size={20}
                />
                <SpaceComponent height={8} />
                <TextComponent text="Sản phẩm đã nhận" />
              </View>
            </RowComponent>
          </SectionComponent>
          <SpaceComponent height={20} />
          <RowComponent>
            <SectionComponent>
              <ButtonComponent
                styles={{
                  borderWidth: 1,
                  borderColor: appColors.primary,
                  backgroundColor: appColors.white,
                }}
                text="Edit profile"
                onPress={() =>
                  navigation.navigate('EditProfileScreen', {
                    profile,
                  })
                }
                textColor={appColors.primary}
                type="primary"
              />
            </SectionComponent>
          </RowComponent>
        </>
      ) : (
        <TextComponent text="profile not found" />
      )}
    </ContainerComponent>
  )
}

export default ProfileScreen