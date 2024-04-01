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

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileModel>();
  
  const dispatch = useDispatch();

  const auth = useSelector(authSelector);

  useEffect(() => {
    if (auth) {
      getProfile();
    };
  }, []);

  const getProfile = async () => {
    setIsLoading(true);

    try {
      const res = await userAPI.HandleUser(`/profile?userId=${auth.id}`);
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
      ) : profile ? (
        <>
          <SectionComponent>
            <RowComponent>
              <AvatarComponent 
                avatar={profile.avatar}
                username={profile.username ? profile.username : profile.email}
                size={120}
              />
            </RowComponent>
          </SectionComponent>
        </>
      ) : (
        <TextComponent text="profile not found" />
      )}
    </ContainerComponent>
  )
}

export default ProfileScreen