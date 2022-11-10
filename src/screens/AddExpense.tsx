import React, {useContext, useLayoutEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/core';
import {Assets, useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Image, Input, Text,DatePicker,Dropdown} from '../components/';
import {View} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {useMutation} from 'react-query';
import {api} from '../services/api-service';
import {AlertContext} from '../context/AlertContext';
import AlertCard from '../components/ErrorCard';
import useQueryAuth from '../hooks/useQueryAuth';

const AddExpense = () => {
  const {assets, gradients, colors, sizes} = useTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
	const [category, setCategory] = useState(null);
  const {errorMessage, successMessage, setSuccessMessage, setErrorMessage} =
    useContext(AlertContext);
    const categories = useQueryAuth(['categories'], api.categories, {}).data;
  const categoriesFormatted= categories?.map((category:any) => ({label:category.name, value:category.id}));
  console.log(categoriesFormatted);
    console.log("CATEGORIES----------------",categories);
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

  const addExpense = useMutation(api.addExpense, {
    onError: (error: any) => {
      setSuccessMessage('');
      setErrorMessage(error.response.data.message);
    },
    onSuccess: () => {
      //invalidateQueries(['categories']);
      setErrorMessage('');
      setSuccessMessage('Expense created successfully! ');
    },
  });

  return (
    <Block
      color={colors.card}
      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}
      scroll={true}>
      <Block>
        <Text p semibold marginBottom={sizes.s}>
				Description
        </Text>
        <Input
          onChangeText={(value) => setDescription(value)}
          placeholder="Description"
          marginBottom={sizes.sm}
        />

        <Text p semibold marginBottom={sizes.s}>
          Amount
        </Text>
        <Input
            
          onChangeText={(value) => setAmount(value)}
          placeholder="Amount"
          marginBottom={sizes.sm}
        />
  
        <Text p semibold marginBottom={sizes.s}>
          Produced date
        </Text>
      
        <DatePicker />
  
        <Text p semibold marginBottom={sizes.s}>
          Category
        </Text>
        <Dropdown items={categoriesFormatted}></Dropdown>
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
                const parsedImage = {
                  size: result.assets[0].fileSize,
                  name: result.assets[0].fileName,
                  mimetype: result.assets[0].type,
                  uri: result.assets[0].uri,
                };
                setImage(parsedImage);
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
                const parsedImage = {
                  size: result.assets[0].fileSize,
                  name: result.assets[0].fileName,
                  mimetype: result.assets[0].type,
                  uri: result.assets[0].uri,
                };
                setImage(parsedImage);
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
        {errorMessage !== '' && (
          <AlertCard errorMessage={errorMessage} isSuccess={false} />
        )}
        {successMessage !== '' && (
          <AlertCard errorMessage={successMessage} isSuccess={true} />
        )}
        <Block>
          <Button
            gradient={gradients.primary}
            marginBottom={sizes.base}
            marginTop={10}
            onPress={() => {
              addExpense.mutate({
                description,
                amount,
                image: image,
              });
            }}>
            <Text white bold transform="uppercase">
              Add expense
            </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default AddExpense;
