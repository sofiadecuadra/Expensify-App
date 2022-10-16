import React, {useContext, useLayoutEffect, useState} from 'react';
import {FlatList, View} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Image, Modal, Text} from '../components/';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMutation} from 'react-query';
import {api} from '../services/api-service';
import {AuthContext} from '../context/AuthContext';

// buttons example
const Buttons = () => {
  const [showModal, setModal] = useState(false);
  const [quantity, setQuantity] = useState('01');
  const {assets, colors, gradients, sizes} = useTheme();

  return (
    <Block>
      <Text p semibold marginBottom={sizes.s}>
        Buttons
      </Text>
      <Block>
        <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            Primary
          </Text>
        </Button>
        <Button
          flex={1}
          gradient={gradients.secondary}
          marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            Secondary
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.info} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            info
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.success} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            success
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.danger} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            danger
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.light} marginBottom={sizes.base}>
          <Text bold transform="uppercase">
            light
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.dark} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            dark
          </Text>
        </Button>
        <Block row justify="space-between" marginBottom={sizes.base}>
          <Button
            flex={1}
            row
            gradient={gradients.dark}
            onPress={() => setModal(true)}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white bold transform="uppercase" marginRight={sizes.sm}>
                {quantity}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
          <Button gradient={gradients.dark}>
            <Text white bold transform="uppercase" marginHorizontal={sizes.sm}>
              Save for later
            </Text>
          </Button>
        </Block>
      </Block>
      <Modal visible={showModal} onRequestClose={() => setModal(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={['01', '02', '03', '04', '05']}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                setQuantity(item);
                setModal(false);
              }}>
              <Text p white semibold transform="uppercase">
                {item}
              </Text>
            </Button>
          )}
        />
      </Modal>
    </Block>
  );
};

const Configuration = () => {
  const {assets, sizes, gradients} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const logout = useMutation(api.adminLogout);
  const {signOut} = useContext(AuthContext);

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
    <>
      <Block safe>
        <Block
          paddingHorizontal={sizes.padding}
          scroll
          showsVerticalScrollIndicator={false}
          flex={1}
          width="100%"
          contentContainerStyle={{paddingVertical: sizes.padding}}>
          <Block>
            <Buttons />
          </Block>
        </Block>
        <SafeAreaView
          style={{
            paddingHorizontal: sizes.padding,
          }}>
          <Button
            onPress={() => {
              logout.mutate();
              signOut();
            }}
            flex={1}
            gradient={gradients.primary}
            marginBottom={10}>
            <Text white bold transform="uppercase">
              Log out
            </Text>
          </Button>
        </SafeAreaView>
      </Block>
    </>
  );
};

export default Configuration;
