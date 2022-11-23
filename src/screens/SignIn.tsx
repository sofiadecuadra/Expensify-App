import React, {useState, useContext, useEffect} from 'react';
import {Platform, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useMutation, useQuery} from 'react-query';
import {api, createAxiosInstance} from '../services/api-service';
import {AuthContext} from '../context/AuthContext';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Button, Input, Image, Text} from '../components/';
import AlertCard from '../components/ErrorCard';
import {AlertContext} from '../context/AlertContext';
import {StatusBar} from 'expo-status-bar';
import Prompt from 'react-native-simple-prompt';
import axios from 'axios';

const isAndroid = Platform.OS === 'android';
export interface ISignIn {
  email: string;
  password: string;
}

const SignIn = ({route: {params}}: {route: {params: any}}) => {
  const {signIn} = useContext(AuthContext);
  const {errorMessage, setErrorMessage} = useContext(AlertContext);
  const {t} = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    setErrorMessage('');
  }, []);

  const [signInData, setSignIn] = useState<ISignIn>({
    email: '',
    password: '',
  });

  const signInMutation = useMutation(api.signIn, {
    onSuccess: (data: any) => {
      signIn(data.data);
    },
    onError: (data: any) => {
      setErrorMessage(data.response.data.message);
    },
  });

  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = (value: any) => {
    setSignIn((state) => ({...state, ...value}));
  };

  const handleSignIn = () => {
    let errorMessage = '';
    const email = signInData.email;
    const password = signInData.password;
    if (!email) errorMessage = 'Email is required';
    else if (!password) errorMessage = 'Password is required';
    setErrorMessage(errorMessage);
    if (errorMessage === '') {
      signInMutation.mutate({email, password});
    }
  };

  const onShowHiddenOptions = () => {
    Prompt.show('Configuration', "Please enter the backend's ip", (ip) => {
      createAxiosInstance(ip);
    });
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
                justify="flex-start"
                onPress={() => navigation.navigate('Register')}>
                <Image
                  radius={0}
                  width={10}
                  height={18}
                  color={colors.white}
                  source={assets.arrow}
                  transform={[{rotate: '180deg'}]}
                />
                <Text p white marginLeft={sizes.s}>
                  {t('common.signup')}
                </Text>
              </Button>

              <Pressable
                onLongPress={() => {
                  onShowHiddenOptions();
                }}>
                <Text h4 center white marginBottom={sizes.md}>
                  {t('signIn.title')}
                </Text>
              </Pressable>
            </Image>
          </Block>

          <Block
            keyboard
            behavior={!isAndroid ? 'padding' : 'height'}
            marginTop={-(sizes.height * 0.2 - sizes.l)}>
            <Block
              flex={0}
              radius={sizes.sm}
              marginHorizontal="8%"
              shadow={!isAndroid}>
              <Block
                blur
                flex={0}
                intensity={90}
                radius={sizes.sm}
                overflow="hidden"
                justify="space-evenly"
                tint={colors.blurTint}
                paddingVertical={sizes.sm}>
                <Text p semibold center>
                  {t('signIn.subtitle')}
                </Text>

                {/* form inputs */}
                <Block paddingHorizontal={sizes.sm} paddingTop={sizes.sm}>
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.email')}
                    keyboardType="email-address"
                    placeholder={t('common.emailPlaceholder')}
                    onChangeText={(value) => handleChange({email: value})}
                  />
                  <Input
                    secureTextEntry
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.password')}
                    placeholder={t('common.passwordPlaceholder')}
                    onChangeText={(value) => handleChange({password: value})}
                  />
                </Block>
                <Button
                  onPress={handleSignIn}
                  marginVertical={sizes.s}
                  marginHorizontal={sizes.sm}
                  gradient={gradients.primary}>
                  <Text bold white transform="uppercase">
                    {t('common.signin')}
                  </Text>
                </Button>
                <Prompt></Prompt>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default SignIn;
