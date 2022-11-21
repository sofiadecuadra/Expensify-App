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

const Buttons = () => {
  const {gradients, sizes} = useTheme();
  const [role, setRole] = useState('Member');
  const {setSuccessMessage, setErrorMessage} = useContext(AlertContext);

  const mutation = useMutation(api.createInvite, {
    onError: (error: any) => {
      setErrorMessage(error.response.data.message);
      setSuccessMessage('');
    },
    onSuccess: (data) => {
      onShare(data.data);
      setSuccessMessage('Invites sent successfully! ');
      setErrorMessage('');
    },
  });

  const onShare = async (data: any) => {
    try {
      const {inviteToken} = data;
      const url = 'https://ortisp.github.io/Expensify-Invitations/?';
      const inviteLink = url + inviteToken;
      const result = await Share.share({
        message: `Hey, I am inviting you to join my family on expensify. Please use this link to register: ${inviteLink}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
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
  const {errorMessage, successMessage} = useContext(AlertContext);

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
        {successMessage !== '' && (
          <AlertCard errorMessage={successMessage} isSuccess={true} />
        )}
      </Block>
      <Button
        onPress={() => {
          logout.mutate();
          signOut();
        }}
        style={{
          paddingHorizontal: sizes.padding,
        }}
        gradient={gradients.dark}
        marginBottom={10}>
        <Text white bold transform="uppercase">
          Log out
        </Text>
      </Button>
    </Block>
  );
};

export default Configuration;
