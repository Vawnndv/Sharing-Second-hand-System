/* eslint-disable no-nested-ternary */
import './Uploader.scss'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi'
import Loader from '../notification/Loader'

interface Props {
  imageUrl: string; 
  setImageUrl: (val: string) => void; 
  imageUpdateUrl: string;
};

function Uploader(props: Props) {
  const { imageUrl, setImageUrl, imageUpdateUrl } = props;

  const [loading, setLoading] = useState(false)
  // upload image

  const onDrop = useCallback(async (imageFile: any) => {
    const file = new FormData()
    file.append('file', imageFile[0])
    if (imageUrl !== '') {
      if (imageUrl !== imageUpdateUrl) {
        // await deleteImageService(imageUrl);
      }
    }
    // const data = await uploadImageService(file, setLoading);
    // if (data) {
      // setImageUrl(data)
    // }

  }, [imageUrl, imageUpdateUrl])

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
          <p className='upload-text'>Drag your image here</p>
          <em className='upload-hint'>
            {isDragActive
              ? 'Drop it like it\'s hot'
              : isDragReject
                ? 'Unsupported file type...'
                : 'only .jpg and .png files will be accepted'}
          </em>
        </div>
      )}
    </div>
  )
}

export default Uploader