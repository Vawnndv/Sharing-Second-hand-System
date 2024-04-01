import React from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { appColors } from '../constants/appColors'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SpaceComponent } from '../components'
import StyledText from '../components/StyleText'

interface Props {
  modalVisible: boolean;
  onBackPress?: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress?: () => void;
  isLoading: boolean;
}

const UploadModal = (props: Props) => {
  const { modalVisible, onBackPress, onCameraPress, onGalleryPress, onRemovePress, isLoading } = props;

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
          <ActivityIndicator size={70} color={appColors.white} />
        )}
        {!isLoading && (
          <View style={[localStyles.modalView, { backgroundColor: appColors.white }]}>
            <StyledText big style={{ marginBottom: 10 }}>
              Profile Photo
            </StyledText>

            <View style={localStyles.decisionRow}>
              <TouchableOpacity
                style={localStyles.optionBtn}
                onPress={onCameraPress} // Modified onPress here
              >
                <MaterialCommunityIcons name='camera-outline' size={30} color={'coral'} />
                <StyledText small>Camera</StyledText>
              </TouchableOpacity>
              <SpaceComponent width={20} />
              <TouchableOpacity
                style={localStyles.optionBtn}
                onPress={onGalleryPress} // Modified onPress here
              >
                <MaterialCommunityIcons name='image-outline' size={30} color={'black'} />
                <StyledText small>Gallery</StyledText>
              </TouchableOpacity>
              <SpaceComponent width={20} />
              <TouchableOpacity
                style={localStyles.optionBtn}
                onPress={onRemovePress} // Modified onPress here
              >
                <MaterialCommunityIcons name='trash-can-outline' size={30} color={'black'} />
                <StyledText small>Remove</StyledText>
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
    backgroundColor: appColors.gray5,
    padding: 10,
    borderRadius: 10,
  },
});
