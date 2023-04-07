import React, {useState, useContext, useEffect} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useMutation, useQuery} from 'react-query';
import {api} from '../services/api-service';
import {AuthContext} from '../context/AuthContext';

import {useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text} from '../components/';
import AlertCard from '../components/ErrorCard';
import {AlertContext} from '../context/AlertContext';
import {StatusBar} from 'expo-status-bar';

const isAndroid = Platform.OS === 'android';
export interface IRegistration {
  familyName: string;
  name: string;
  email: string;
  password: string;
}
interface IRegistrationValidation {
  familyName: boolean;
  name: boolean;
  email: boolean;
  password: boolean;
}

const Register = ({route: {params}}: {route: {params: any}}) => {
  let inviteToken = params?.inviteToken;
  inviteToken =
    inviteToken && Platform.OS === 'android'
      ? inviteToken.split('#Intent')[0]
      : inviteToken;
  const inviteData = useQuery(
    ['validate-invite', inviteToken],
    api.validateInviteToken,
  ).data;
  const {signIn} = useContext(AuthContext);
  const {errorMessage, setErrorMessage} = useContext(AlertContext);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [familyId, setFamilyId] = useState(-1);
  const [role, setRole] = useState(0);

  useEffect(() => {
    setErrorMessage('');
    setRegistration(
      inviteData
        ? {...registrationData, familyName: inviteData.inviteData.familyName}
        : registrationData,
    );
    setRole(inviteData?.inviteData.userType == 'Administrator' ? 1 : 0);
    setFamilyId(inviteData ? inviteData.inviteData.familyId : -1);
  }, [inviteData]);

  const [registrationData, setRegistration] = useState<IRegistration>({
    familyName: '',
    name: '',
    email: '',
    password: '',
  });
  const isValid: IRegistrationValidation = {
    familyName: regex.name.test(registrationData.familyName),
    name: regex.name.test(registrationData.name),
    email: regex.email.test(registrationData.email),
    password: regex.password.test(registrationData.password),
  };

  const register = useMutation(
    inviteData ? api.inviteSignup : api.adminSignup,
    {
      onSuccess: (data: any) => {
        navigation.setParams({inviteToken: undefined});
        signIn(data.data);
      },
      onError: (data: any) => {
        setErrorMessage(data.response.data.message);
      },
    },
  );

  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = (value: any) => {
    setRegistration((state) => ({...state, ...value}));
  };

  const handleSignUp = () => {
    if (inviteData && isValid.name && isValid.email && isValid.password) {
      register.mutate({
        ...registrationData,
        familyId,
        inviteToken,
        role,
      });
    } else if (!Object.values(isValid).includes(false)) {
      register.mutate(registrationData);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <Block safe marginTop={sizes.md}>
        {errorMessage !== '' && (
          <AlertCard errorMessage={errorMessage} isSuccess={false} />
        )}
        <Block paddingHorizontal={sizes.s}>
          <Block flex={0} style={{zIndex: 0}}>
            <Image
              background
              resizeMode="cover"
              padding={sizes.sm}
              radius={sizes.cardRadius}
              source={assets.background}
              height={sizes.height * 0.3}>
              <Button
                row
                flex={0}
                justify="flex-end"
                onPress={() => navigation.navigate('SignIn')}>
                <Image
                  radius={0}
                  width={10}
                  height={18}
                  color={colors.white}
                  source={assets.arrow}
                />
                <Text p white marginLeft={sizes.s}>
                  {t('common.signin')}
                </Text>
              </Button>

              <Text h4 center white marginBottom={sizes.md}>
                {t('register.title')}
              </Text>
            </Image>
          </Block>

          {/* register form */}
          <Block
            keyboard
            behavior={!isAndroid ? 'padding' : 'height'}
            marginTop={-(sizes.height * 0.2 - sizes.l)}>
            <Block
              flex={0}
              radius={sizes.sm}
              marginHorizontal="8%"
              shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            >
              <Block
                blur
                flex={0}
                intensity={90}
                radius={sizes.sm}
                overflow="hidden"
                justify="space-evenly"
                tint={colors.blurTint}
                paddingVertical={sizes.sm}>
                {familyId === -1 ? (
                  <Text p semibold center>
                    {t('register.subtitle')}
                  </Text>
                ) : (
                  <Text p semibold center>
                    {'Register to ' +
                      registrationData.familyName +
                      " family with role '" +
                      (role == 0 ? 'Member' : 'Administrator') +
                      "'"}
                  </Text>
                )}

                {/* form inputs */}
                <Block paddingHorizontal={sizes.sm} paddingTop={sizes.sm}>
                  {familyId === -1 && (
                    <Input
                      autoCapitalize="none"
                      marginBottom={sizes.m}
                      label={t('common.familyName')}
                      placeholder={t('common.familyNamePlaceholder')}
                      success={Boolean(
                        registrationData.familyName && isValid.familyName,
                      )}
                      danger={Boolean(
                        registrationData.familyName && !isValid.familyName,
                      )}
                      onChangeText={(value) =>
                        handleChange({familyName: value})
                      }
                    />
                  )}
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.name')}
                    placeholder={t('common.namePlaceholder')}
                    success={Boolean(registrationData.name && isValid.name)}
                    danger={Boolean(registrationData.name && !isValid.name)}
                    onChangeText={(value) => handleChange({name: value})}
                  />
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.email')}
                    keyboardType="email-address"
                    placeholder={t('common.emailPlaceholder')}
                    success={Boolean(registrationData.email && isValid.email)}
                    danger={Boolean(registrationData.email && !isValid.email)}
                    onChangeText={(value) => handleChange({email: value})}
                  />
                  <Input
                    secureTextEntry
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.password')}
                    placeholder={t('common.passwordPlaceholder')}
                    onChangeText={(value) => handleChange({password: value})}
                    success={Boolean(
                      registrationData.password && isValid.password,
                    )}
                    danger={Boolean(
                      registrationData.password && !isValid.password,
                    )}
                  />
                </Block>
                <Button
                  onPress={handleSignUp}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.primary}>
                  <Text bold white transform="uppercase">
                    {t('common.signup')}
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default Register;
