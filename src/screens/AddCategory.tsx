import React, {useContext, useLayoutEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/core';
import {Assets, useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Image, Input, Text} from '../components/';
import {View} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {useMutation} from 'react-query';
import {api} from '../services/api-service';
import {AlertContext} from '../context/AlertContext';

function _base64ToArrayBuffer(base64: any) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

const AddCategory = () => {
  const {assets, gradients, colors, sizes} = useTheme();
  const [name, setName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const {setSuccessMessage, setErrorMessage} = useContext(AlertContext);

  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

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

  const addCategory = useMutation(api.addCategory, {
    onError: (error: any) => {
      setSuccessMessage('');
      setErrorMessage(error.response.data.message);
    },
    onSuccess: () => {
      //invalidateQueries(['categories']);
      setErrorMessage('');
      setSuccessMessage('Category created successfully! ');
    },
  });

  return (
    <Block
      color={colors.card}
      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}>
      <Block>
        <Text p semibold marginBottom={sizes.s}>
          Name
        </Text>
        <Input
          onChangeText={(value) => setName(value)}
          placeholder="Name"
          marginBottom={sizes.sm}
        />
        <Text p semibold marginBottom={sizes.s}>
          Image
        </Text>
        <View
          style={{
            borderColor: 'b5b5ba',
            borderWidth: 0.5,
            borderRadius: 10,
            alignContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingBottom: 25,
            paddingTop: 40,
            marginBottom: 15,
          }}>
          <View style={{flex: 1}}>
            <Button
              onPress={async () => {
                const type: MediaType = 'photo';
                const options = {
                  selectionLimit: 0,
                  mediaType: type,
                  includeBase64: true,
                  includeExtra: true,
                };
                const result = await launchImageLibrary(options);
                //const buffer = _base64ToArrayBuffer(result.)
                setImage({result.assets[0]});
                console.log(result);
              }}>
              <Block row align="center">
                <Block
                  flex={0}
                  radius={6}
                  align="center"
                  justify="center"
                  width={sizes.xxl * 1.5}
                  height={sizes.xxl * 1.5}
                  gradient={gradients?.secondary}>
                  <Image
                    source={assets.extras}
                    color={colors.white}
                    radius={0}
                  />
                </Block>
              </Block>
            </Button>
            <Text style={{marginTop: 15, alignSelf: 'center'}} size={11}>
              {'Upload image from gallery'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Button
              onPress={async () => {
                const type: MediaType = 'photo';
                const options = {
                  includeBase64: true,
                  saveToPhotos: true,
                  mediaType: type,
                  includeExtra: true,
                };
                const result = await launchCamera(options);
                setImage(result.assets[0]);

                console.log(result);
              }}>
              <Block row align="center">
                <Block
                  flex={0}
                  radius={6}
                  align="center"
                  justify="center"
                  width={sizes.xxl * 1.5}
                  height={sizes.xxl * 1.5}
                  gradient={gradients?.secondary}>
                  <Image
                    source={assets.extras}
                    color={colors.white}
                    radius={0}
                  />
                </Block>
              </Block>
            </Button>
            <Text style={{marginTop: 15, alignSelf: 'center'}} size={11}>
              {'Open camera'}
            </Text>
          </View>
        </View>

        <Text p semibold marginBottom={sizes.s}>
          Description
        </Text>

        <Input
          onChangeText={(value) => setDescription(value)}
          placeholder="Description"
          marginBottom={sizes.sm}
        />

        <Text p semibold marginBottom={sizes.s}>
          Monthly budget
        </Text>

        <Input
          onChangeText={(value) => setMonthlyBudget(value)}
          placeholder="Monthly budget"
          marginBottom={sizes.sm}
        />

        <Block>
          <Button
            gradient={gradients.primary}
            marginBottom={sizes.base}
            marginTop={10}
            onPress={() => {
              addCategory.mutate({
                name,
                monthlyBudget,
                description,
                image: image,
              });
              console.log('Hola');
            }}>
            <Text white bold transform="uppercase">
              Add category
            </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default AddCategory;