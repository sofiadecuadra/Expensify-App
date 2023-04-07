import React, {useContext, useLayoutEffect, useState} from 'react';
import {Share, View} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Image, Text} from '../components/';
import {useMutation} from 'react-query';
import {api} from '../services/api-service';
import {AuthContext} from '../context/AuthContext';
import RadioButtonGroup, {RadioButtonItem} from 'expo-radio-button';
import {AlertContext} from '../context/AlertContext';
import AlertCard from '../components/ErrorCard';
import {SafeAreaView} from 'react-native-safe-area-context';

const Buttons = () => {
  const {gradients, sizes} = useTheme();
  const [role, setRole] = useState('Member');
  const {setErrorMessage} = useContext(AlertContext);

  const mutation = useMutation(api.createInvite, {
    onError: (error: any) => {
      setErrorMessage(error.response.data.message);
    },
    onSuccess: (data) => {
      onShare(data.data);
      setErrorMessage('');
    },
  });

  const onShare = async (data: any) => {
    try {
      const {inviteToken} = data;
      const url = 'https://ortisp.github.io/Expensify-Invitations/?';
      const inviteLink = url + inviteToken;
      await Share.share({
        message: `Hey, I am inviting you to join my family on expensify. Please use this link to register: ${inviteLink}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Block paddingBottom={10} card>
      <Block align="center" paddingBottom={10}>
        <Text h5 semibold marginBottom={sizes.s}>
          Invites
        </Text>

        <Text p marginBottom={sizes.s}>
          Select the role of the invitees
        </Text>
        <RadioButtonGroup
          containerStyle={{marginBottom: 10}}
          selected={role}
          onSelected={(value: string) => setRole(value)}
          radioBackground="grey">
          <RadioButtonItem value="Member" label="Member" />
          <RadioButtonItem value="Administrator" label="Administrator" />
        </RadioButtonGroup>
      </Block>
      <Block>
        <Button
          flex={1}
          gradient={gradients.primary}
          marginBottom={sizes.base}
          onPress={() => mutation.mutate({userType: role})}>
          <Text white bold transform="uppercase">
            create invite
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

const Configuration = () => {
  const {assets, sizes, gradients} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const logout = useMutation(api.adminLogout);
  const {signOut, isAdmin} = useContext(AuthContext);
  const {errorMessage} = useContext(AlertContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Image
          radius={0}
          resizeMode="cover"
          width={sizes.width}
          height={headerHeight}
          source={assets.header}
        />
      ),
    });
  }, [assets.header, navigation, sizes.width, headerHeight]);

  return (
    <Block>
      <Block
        paddingHorizontal={sizes.padding}
        scroll
        showsVerticalScrollIndicator={false}
        flex={1}
        width="100%"
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block>{isAdmin && <Buttons />}</Block>
        {errorMessage !== '' && (
          <AlertCard errorMessage={errorMessage} isSuccess={false} />
        )}
      </Block>
      <SafeAreaView style={{marginBottom: 10}}>
        <Button
          onPress={() => {
            logout.mutate();
            signOut();
          }}
          style={{
            paddingHorizontal: sizes.padding,
          }}
          gradient={gradients.dark}>
          <Text white bold transform="uppercase">
            Log out
          </Text>
        </Button>
      </SafeAreaView>
    </Block>
  );
};

export default Configuration;
