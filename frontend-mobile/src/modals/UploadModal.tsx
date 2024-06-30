import React from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { appColors } from '../constants/appColors'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SpaceComponent } from '../components'
import StyledText from '../components/StyleText'
import { fontFamilies } from '../constants/fontFamilies'
import LoadingComponent from '../components/LoadingComponent'

interface Props {
  modalVisible: boolean;
  onBackPress: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress: () => void;
  isLoading: boolean;
  title: string;
}

const UploadModal = (props: Props) => {
  const { modalVisible, onBackPress, onCameraPress, onGalleryPress, onRemovePress, isLoading, title } = props;

  return (
    <Modal
      animationType='slide'
      visible={modalVisible}
      transparent={true}
    >
      <Pressable
        style={localStyles.container}
        onPress={onBackPress}
      >
        {isLoading && (
          <LoadingComponent isLoading={isLoading} /> 
        )}
        {!isLoading && (
          <View style={[localStyles.modalView, { backgroundColor: appColors.white }]}>
            <StyledText big style={{ marginBottom: 10, fontFamily: fontFamilies.bold }}>
              {title}
            </StyledText>
            <View style={localStyles.decisionRow}>
              <TouchableOpacity
                style={localStyles.optionBtn}
                onPress={onCameraPress}
              >
                <MaterialCommunityIcons name='camera-outline' size={30} color={appColors.primary} />
                <StyledText small>Máy ảnh</StyledText>
              </TouchableOpacity>
              <SpaceComponent width={24} />
              <TouchableOpacity
                style={localStyles.optionBtn}
                onPress={onGalleryPress}
              >
                <MaterialCommunityIcons name='image-outline' size={30} color={appColors.primary} />
                <StyledText small>Thư viện</StyledText>
              </TouchableOpacity>
              <SpaceComponent width={24} />
              <TouchableOpacity
                style={localStyles.optionBtn}
                onPress={onRemovePress}
              >
                <MaterialCommunityIcons name='trash-can-outline' size={30} color={appColors.danger} />
                <StyledText small>Xóa</StyledText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
};

export default UploadModal

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Custom modal background color
  },
  modalView: {
    margin: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  decisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  optionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.gray5,
    width: 65,
    height: 65,
    borderRadius: 10,
  },
});
