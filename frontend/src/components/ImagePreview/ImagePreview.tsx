import './ImagePreview.css';

interface Props {
  image: string;
  name: string;
  isAboutProfile?: boolean;
};

function ImagePreview(props: Props) {
    const { image, name,  isAboutProfile } = props;

    return (
      <div className={isAboutProfile ? "user-image-preview-container" : "image-preview-container"}>
        <img
          src={image !==  '' ? image : 'https://www.vietnamfineart.com.vn/wp-content/uploads/2023/03/avatar-chill-anime-2.jpg'}
          alt={name}
          className="image-preview"
        />
      </div>
    )
  }

export default ImagePreview