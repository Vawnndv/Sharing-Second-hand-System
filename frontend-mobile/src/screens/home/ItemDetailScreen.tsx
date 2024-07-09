import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ContainerComponent, SectionComponent } from '../../components'
import PostDetail from '../../components/PostDetail';
import { appColors } from '../../constants/appColors';
import { Flag } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';


const ItemDetailScreen = ({navigation, route}: any) => {
  const postID = route.params.postID;
  const handleRefresh = route.params.handleRefresh

  const [visibleModalReport, setVisibleModalReport] = useState(false)
  const [isOwnPost, setIsOwnPost] = useState(false);

  return (
    <ContainerComponent 
      title='Bài đăng' 
      // isScroll 
      back
      option={(isOwnPost) && (
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
      <PostDetail navigation={navigation} route={route} postID={postID} visibleModalReport={visibleModalReport} setVisibleModalReport={setVisibleModalReport} setIsOwnPost={setIsOwnPost} handleRefresh={handleRefresh}/>
    </ContainerComponent>
  )
}

export default ItemDetailScreen