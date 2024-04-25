
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from "expo-image-picker";
import { appInfo } from "./constants/appInfos";

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

export const PickImage = async (permission: boolean, multiple: boolean, setImage: any, setModalVisible: (value: boolean) => void) => {
    if(permission === true){
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: multiple,
            quality: 0.5,
            base64: false,
            allowsEditing: true,
            aspect: [8,5]
        })

    
        if(!result.canceled){

            // console.log(result.assets[0].base64)
            const finalResult = {
                uri: result.assets[0].uri,
                name: new Date().getTime(),
                type: result.assets[0].mimeType,
            }
            setImage(finalResult);
            setModalVisible(false);
            // setImage(result.assets[0])
        }
    
    }else{
        alert(`Permission hasn't granted yet`)
    }
    
}

export const TakePhoto = async (permission: boolean, setImage: any, setModalVisible: ((value: boolean) => void) | any)  => {
    if(permission){
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.5,
            base64: false,
            aspect: [8,5]
        })
    
        if(!result.canceled){
            const finalResult = {
                uri: result.assets[0].uri,
                name: new Date().getTime(),
                type: result.assets[0].mimeType,
            }
            console.log(finalResult)
            setImage(finalResult)
            setModalVisible(false);
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
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}