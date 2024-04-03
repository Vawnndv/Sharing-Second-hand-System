
import axios from "axios";
import * as ImagePicker from "expo-image-picker"
import { Platform } from "react-native";
import { appInfo } from "./constants/appInfos";import AWS from 'aws-sdk';
import * as FileSystem from 'expo-file-system';

export const getGallaryPermission = async (setGalleryPermission: any) => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if(result.granted){
        setGalleryPermission(true)
        console.log(`gallery permission true`)
    }else{
        alert(`Can't get Gallery Permission`)
    }
}

export const getCameraPermission = async (setCameraPermission: any) => {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    if(result.granted){
        setCameraPermission(true)
        console.log(`camera permission true`)
    }else{
        alert(`Can't get Camera Permission`)
    }
    
}

export const PickImage = async (permission: boolean, multiple: boolean, setImage: any) => {
    if(permission === true){
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: multiple,
            quality: 1,
            base64: false
        })

    
        if(!result.canceled){

            // console.log(result.assets[0].base64)
            const finalResult = {
                uri: result.assets[0].uri,
                name: new Date().getTime(),
                type: result.assets[0].mimeType,
            }
            setImage(finalResult)
            // setImage(result.assets[0])
        }
    
    }else{
        alert(`Permission hasn't granted yet`)
    }
    
}

export const TakePhoto = async (permission: boolean, setImage: any) => {
    if(permission){
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
            base64: false
        })
    
        if(!result.canceled){
            const finalResult = {
                uri: result.assets[0].uri,
                name: new Date().getTime(),
                type: result.assets[0].mimeType,
            }
            setImage(finalResult)
            // setImage(result.assets[0])
        }
        
    }
    else{
        alert(`Permission hasn't granted yet`)
    }
}


export const uploadImage = async (file: any) => {

    fetch(file.uri).
    then(response => response.blob())
    .then(async blob => {
        // const params = {
        //     Bucket: 'retreasure',
        //     Key: `${file.name}`,
        //     Body: blob,
        //     ContentType: file.type // Loại tệp tin của tệp tin đã đọc
        // };
    
        // // Gửi yêu cầu PUT đến AWS S3
        // s3.putObject(params, (err, data) => {
        // if (err) {
        //     console.error('Error uploading file to AWS S3:', err);
        // } else {
        //     console.log('File uploaded successfully:', data);
        // }
        // });

        await UploadImageToAws3(file);
    }).catch(error => {
        console.error('error reading image', error)
    })
    
    
    
        
}

export const UploadImageToAws3 = async (file: any) => {

    // fetch(file.uri).
    // then(response => response.blob())
    // .then(async blob => {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     console.log(formData)
    //     try {
    //         // const response = await axios.post(`${appInfo.BASE_URL}/aws3/uploadImage`,formData,{
    //         //     headers: {
    //         //         "Content-Type": "multipart/form-data"
    //         //     }
    //         // })
    //         // let options = {
    //         //     method: 'POST',
    //         //     body: formData,
    //         //   };
    //         let res = await axios.post(`${appInfo.BASE_URL}/aws3/uploadImage`, formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data"
    //             }
    //         })
        
    //         console.log(res)
    //     } catch (error) {
    //         console.log(error)
    //     }

    // }).catch(error => {
    //     console.error('error reading image', error)
    // })
    

    try {
        const fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 });
        const formData = new FormData();

        // Thêm file vào FormData
        formData.append('file', fileContent);
        formData.append('name', file.name)
        formData.append('type', file.type)

        // Gửi FormData qua phương thức POST
        const serverResponse = await fetch(`${appInfo.BASE_URL}/aws3/uploadImage`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Xử lý phản hồi từ server nếu cần
        const data = await serverResponse.json();
        console.log('Server response:', data);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}