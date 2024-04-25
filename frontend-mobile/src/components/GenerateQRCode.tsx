import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGeneratorProps {
  data: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data }) => {
  return (
    <View>
      <View style={{ marginVertical: 10 }}>
        <QRCode value={data} size={200} />
      </View>
    </View>
  );
};

export default QRCodeGenerator;
