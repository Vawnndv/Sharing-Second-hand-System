import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ButtonComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { globalStyles } from '../../styles/globalStyles';
import { ArrowRight } from 'iconsax-react-native';
import { LoadingModal } from '../../modals';

const VerificationScreen = ({navigation, route}: any) => {
  const limitTime = 120;
  const {code, email, password, username} = route.params;

  const [currentCode, setCurrentCode] = useState(code);
  const [codeValues, setCodeValues] = useState<string[]>([]);
  const [newCode, setNewCOde] = useState('');
  const [limit, setLimit] = useState(limitTime);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const ref1 = useRef<any>();
  const ref2 = useRef<any>();
  const ref3 = useRef<any>();
  const ref4 = useRef<any>();

  useEffect(() => {
    ref1.current.focus();
  }, []);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        setLimit(limit => limit - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [limit]);

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;

    setCodeValues(data);
  }
  const handleVerification = () => {

  };
  
  return (
    <ContainerComponent
      back
      isImageBackground
      isScroll
    >
      <SectionComponent>
        <TextComponent text="Verification" title />
        <SpaceComponent height={12} />
        <TextComponent text={`We 've send you the verification code on`} />
        <SpaceComponent height={26} />
        <RowComponent justify="space-around">
          <TextInput
            keyboardType="number-pad"
            ref={ref1}
            value={codeValues[0]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={val => {
              handleChangeCode(val, 0);
              val.length > 0 && ref2.current.focus();
            }}
            placeholder="-"
            />
          <TextInput
            keyboardType="number-pad"
            ref={ref2}
            value={codeValues[1]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={val => {
              handleChangeCode(val, 1);
              val.length > 0 && ref3.current.focus();
            }}
            placeholder="-"
            />
          <TextInput
            keyboardType="number-pad"
            ref={ref3}
            value={codeValues[2]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={val => {
              handleChangeCode(val, 2);
              val.length > 0 && ref4.current.focus();
            }}
            placeholder="-"
            />
          <TextInput
            keyboardType="number-pad"
            ref={ref4}
            value={codeValues[3]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={val => {
              handleChangeCode(val, 3);
            }}
            placeholder="-"
            />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{marginTop: 40}}>
        <ButtonComponent
          disable={newCode.length > 4}
          onPress={handleVerification}
          text="Continue"
          type="primary"
          iconFlex="right"
          icon={
            <View style={[
              globalStyles.iconContainer,
              {
                backgroundColor: newCode.length !== 4 
                  ? appColors.gray 
                  : appColors.primary
              },
            ]}>
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </SectionComponent>
      {errorMessage && (
        <SectionComponent>
          <TextComponent
            styles={{textAlign: 'center'}}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionComponent>
      )}
      <SectionComponent>
        {limit > 0 ? (
          <RowComponent justify="center">
            <TextComponent text="Re-send code in " flex={0} />
            <TextComponent 
              text={`${(limit - (limit % 60)) / 60}:${limit - (limit - (limit % 60))}`}
              color={appColors.link}
              flex={0}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text="Resend email verification"
              onPress={handleVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  )
}

export default VerificationScreen

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
})