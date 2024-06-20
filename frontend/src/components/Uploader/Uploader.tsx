/* eslint-disable no-nested-ternary */
import './Uploader.scss'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi'
import Loader from '../notification/Loader'
import toast from 'react-hot-toast'
import Axios from '../../redux/APIs/Axios'

interface Props {
  imageUrl: string; 
  setImageUrl: (val: string) => void; 
  imageUpdateUrl: string;
};

function Uploader(props: Props) {
  const { imageUrl, setImageUrl, imageUpdateUrl } = props;

  const [loading, setLoading] = useState(false)
  // upload image

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const readFileContent = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const UploadImageToAws3 = async (file: any, isLimit: boolean) => {
    try {
      // Đọc nội dung của tệp tin bằng FileReader
      const fileReader: any = new FileReader();
      fileReader.readAsDataURL(file);

      return await new Promise((resolve, reject) => {
          fileReader.onload = async () => {
              try {
                  // Chuyển đổi nội dung của tệp thành dạng Base64
                  const fileContent = fileReader.result.split(',')[1];

                  // Tạo FormData và thêm tệp tin và thông tin vào đó
                  const formData = new FormData();
                  formData.append('file', fileContent);
                  formData.append('name', `${new Date().getTime()}${file.name}`);
                  formData.append('type', file.type);
                  if(isLimit){
                    formData.append('typeExpire', "expire")
                  }

                  // Gửi FormData qua phương thức POST
                  const serverResponse = await Axios.post('/aws3/uploadImage', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });

                  // Xử lý phản hồi từ server nếu cần
                  const data: any = serverResponse;
                  resolve(data);
              } catch (error) {
                  console.error('Error uploading file:', error);
                  reject(error);
              }
          };
      });
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
  };
  

  const onDrop = useCallback(async (imageFile: any) => {
    const file = new FormData()
    file.append('file', imageFile[0])
    // console.log('OnDrop', file)
    if (imageUrl !== '') {
      if (imageUrl !== imageUpdateUrl) {
        // await deleteImageService(imageUrl);
      }
    }
    // const data = await uploadImageService(file, setLoading);
    try {
      setLoading(true)
      const responseUploadImage: any = await UploadImageToAws3(imageFile[0], false)
      setImageUrl(responseUploadImage.url);
      setLoading(false)
      toast.success('Thêm ảnh thành công!')
    } catch (error: any) {
      // console.log(error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Lỗi mạng');
      }
    }
    // if (data) {
    //   setImageUrl(data)
    // }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setImageUrl, imageUrl, imageUpdateUrl])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    multiple: false,
    onDrop
  })


  return (
    <div className='form-upload-container'>
      {loading ? (
        <div className='loader'>
          <Loader />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className='upload-container'
        >
          <input {...getInputProps()} />
          <span className='upload-icon'>
            <FiUploadCloud />
          </span>
          <p className='upload-text'>Hãy thả tệp ảnh vào đây</p>
          <em className='upload-hint'>
            {isDragActive
              ? 'Drop it like it\'s hot'
              : isDragReject
                ? 'Unsupported file type...'
                : 'chỉ các tệp .jpg và .png là được chấp nhận'}
          </em>
        </div>
      )}
    </div>
  )
}

export default Uploader