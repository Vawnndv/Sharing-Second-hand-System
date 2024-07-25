import { Avatar } from '@mui/material';
import './ImagePreview.css';

interface Props {
  image?: string;
  name?: string;
  isAboutProfile?: boolean;
}

function ImagePreview(props: Props) {
  const { image, name, isAboutProfile } = props;

  return (
    <div className={isAboutProfile ? "user-image-preview-container" : "image-preview-container"}>
      {image ? (
        <Avatar
          src={image}
          alt={name}
          variant="square"
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '0.25rem',
          }}
        />
      ) : name ? (
        <Avatar
          variant="square"
          sx={{
            bgcolor: '#321357',
            width: '100%',
            height: '100%',
            borderRadius: '0.25rem',
            fontSize: isAboutProfile ? '6rem' : '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {name.substring(0, 1).toLocaleUpperCase()}
        </Avatar>
      ) : (
        <Avatar
          alt={name}
          variant="square"
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '0.25rem',
          }}
        />
      )}
    </div>
  );
}

export default ImagePreview;
