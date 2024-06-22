import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import CardItemResult from '../search/CardItemResult';
import postsAPI from '../../apis/postApi';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import { PostData } from '../search/SearchResultScreen';
import { ContainerComponent } from '../../components';

const UserLikePostsScreen = () => {
    const auth = useSelector(authSelector);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [page, setPage] = useState(0);
    const [shouldFetchData, setShouldFetchData] = useState(false);
    const [isEndOfData, setIsEndOfData] = useState(false);

    const LIMIT = 3;

    
    useEffect(() => {
        setShouldFetchData(true); // Đánh dấu rằng cần fetch dữ liệu mới
        setPage(0);
        setIsEmpty(false);
        setData([]);

    }, [])

    useEffect(() => {
        if (shouldFetchData) {
        fetchData(); // Fetch dữ liệu chỉ khi shouldFetchData là true
        setShouldFetchData(false); // Đặt lại shouldFetchData về false sau khi đã fetch dữ liệu
        }
    }, [shouldFetchData]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res: any = await postsAPI.HandlePost(`/get-user-like-posts?page=${page}&limit=${LIMIT}&userId=${auth.id}`);

            const newData: any = res.allPosts;
            console.log(newData)
            if (newData.length <= 0 && page === 0)
                setIsEmpty(true)
    
            if (newData.length <= 0 && data.length > 0)
                setIsEndOfData(true)
    
            if (newData.length > 0)
            setPage(page + 1); // Tăng số trang lên
    
            setData((prevData) => [...prevData, ...newData]); // Nối dữ liệu mới với dữ liệu cũ
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEndReached = () => {
        if (!isLoading && !isEmpty && !isEndOfData) {
            fetchData(); // Khi người dùng kéo xuống cuối cùng của danh sách, thực hiện fetch dữ liệu mới
        }
    };

    return (
        // <ContainerComponent back title='Danh sách bài viết yêu thích'>
        <ContainerComponent>
            { isEmpty ? (
                <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../../../assets/images/shopping.png')}
                    style={styles.image} 
                    resizeMode="contain"
                />
                </View>
            ) : (
                <CardItemResult data={data} handleEndReached={handleEndReached} isLoading={isLoading} setData={setData} isRefresh={true} />
            )}
        </ContainerComponent>
        // </ContainerComponent>
    )
}

export default UserLikePostsScreen


const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 80,
    }
})
