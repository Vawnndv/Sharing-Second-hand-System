import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarComponent, ButtonComponent, ContainerComponent, HeaderComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { authSelector, removeAuth } from '../../redux/reducers/authReducers'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import userAPI from '../../apis/userApi'
import { ProfileModel } from '../../models/ProfileModel'
import { Avatar } from 'react-native-paper'
import { FontAwesome, Fontisto } from '@expo/vector-icons'

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
      console.log(profileId, '12366')
      const res = await userAPI.HandleUser(`/get-profile?userId=${profileId}`);
      res && res.data && setProfile(res.data);
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
    <ContainerComponent isScroll title='Profile' back={auth.roleID === 1} right={auth.roleID === 1}>
      {isLoading ? (
        <ActivityIndicator />
        // <LoadingComponent isLoading={isLoading} value={1} />
      ) : profile && (
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
          {/* <SpaceComponent height={12} /> */}
          <SectionComponent>
            <View style={styles.container}>
              {/* <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="user" size={24} color="black" />
                </View>
                <View style={styles.textContainer}>
                  <TextComponent text='John Doe'/>
                </View>
              </View> */}
              <View style={styles.separator} />
              <View style={styles.infoContainer}>
              <View style={styles.infoContainer}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="envelope" size={22} color="black" />
                </View>
                <View style={styles.textContainer}>
                  <TextComponent text={profile.email}/>
                </View>
              </View>
                <View style={styles.iconContainer}>
                  <FontAwesome name="phone" size={22} color="black" />
                </View>
                <View style={styles.textContainer}>
                  <TextComponent text={profile.phonenumber}/>
                </View>
              </View>
              <View style={styles.separator} />
            </View>
          </SectionComponent>
          <SpaceComponent height={12} />
          <RowComponent justify='center'>
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

              {
                auth.roleID !== 1 &&
                <ButtonComponent
                  styles={{
                    borderWidth: 1,
                    borderColor: appColors.white,
                    backgroundColor: appColors.gray,
                  }}
                  text="Log out"
                  onPress={() =>
                    handleLogout()
                  }
                  textColor={appColors.white}
                  type="primary"
                />
              }
            </SectionComponent>
          </RowComponent>
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