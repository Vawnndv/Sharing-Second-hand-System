import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import PostDetail from '../../components/PostDetail';


const UserPostScreen = () => {
  const postID = 5;

  return (
    <View>
      <PostDetail postID={postID}/>
    </View>
  );
}

export default UserPostScreen