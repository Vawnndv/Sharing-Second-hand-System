import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ContainerComponent } from '../../components';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import { useFocusEffect } from '@react-navigation/native';
import CardPostView from './CardPostView';
import { ActivityIndicator } from 'react-native-paper';
import postsAPI from '../../apis/postApi';

interface Item {
  title: string;
  location: string;
  givetype: string;
  statusname: string;
  image: string;
  status: string;
  postid: string;
}

const PostScreen = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Item[]>([]);

  const auth = useSelector(authSelector);
  const userID = auth.id;

  useEffect(() => {
    if (route.params && route.params.reload) {
      getPostList();
    }
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      getPostList();
      return () => {};
    }, [])
  );

  const getPostList = async () => {
    try {
      setIsLoading(true);

      const res = await postsAPI.HandlePost(
        '/getAllPostByUserId',
        { userID: userID },
        'post'
      );

      setIsLoading(false);
      setPosts(res.data);

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <CardPostView
      navigation={navigation}
      title={item.title}
      location={item.location}
      givetype={item.givetype}
      statusname={item.statusname}
      image={item.image}
      status={item.status}
      postid={item.postid}
      isNavigatePostManager={true}
    />
  );

  return (
    <ContainerComponent back title="Bài Đăng">
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.postid.toString()}
          />
        )}
      </View>
    </ContainerComponent>
  );
};

export default PostScreen;
