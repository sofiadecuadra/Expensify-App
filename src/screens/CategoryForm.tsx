import React, {useContext, useLayoutEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Text} from '../components/';
import {TouchableOpacity, View} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {useMutation} from 'react-query';
import {api} from '../services/api-service';
import {AlertContext} from '../context/AlertContext';
import AlertCard from '../components/ErrorCard';
import {invalidateQueries} from '../../App';

const CategoryForm = ({route: {params}}: {route: {params: any}}) => {
  const {t} = useTranslation();
  const category = params?.category;
  const {assets, gradients, colors, sizes} = useTheme();
  const [name, setName] = useState(category ? category.name : '');
  const [monthlyBudget, setMonthlyBudget] = useState(
    category ? `${category.monthlyBudget}` : '',
  );
  const [description, setDescription] = useState(
    category ? category.description : '',
  );
  const [image, setImage] = useState(
    category
      ? category.image.uri
        ? category.image
        : {uri: category.image, alreadyUploaded: true}
      : '',
  );
  const {errorMessage, successMessage, setSuccessMessage, setErrorMessage} =
    useContext(AlertContext);

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
      invalidateQueries(['categories']);
      setErrorMessage('');
      setSuccessMessage('Category created successfully! ');
    },
  });

  const modifyCategory = useMutation(api.modifyCategory, {
    onError: (error, variables, context) => {
      setSuccessMessage('');
      setErrorMessage(error.response.data.message);
    },
    onSuccess: (data) => {
      invalidateQueries(['categories']);
      setErrorMessage('');
      setSuccessMessage('Category updated successfully! ');
    },
  });

  const onSubmit = () => {
    let errorMessage = '';
    if (name == '') errorMessage = 'Please enter a name!';
    else if (!image) errorMessage = 'Please select a image!';
    else if (description == '') errorMessage = 'Please enter a description!';
    else if (Number.parseInt(monthlyBudget) < 0)
      errorMessage = 'Please enter a valid monthly budget!';
    setSuccessMessage('');
    setErrorMessage(errorMessage);
    if (errorMessage == '') {
      if (!category) {
        addCategory.mutate({
          name,
          monthlyBudget,
          description,
          image,
        });
      } else {
        modifyCategory.mutate({
          id: category.id,
          name,
          monthlyBudget,
          description,
          image,
        });
      }
    }
  };

  return (
    <Block
      color={colors.card}
      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}
      scroll={true}>
      <Block>
        <Button
          paddingTop={sizes.m}
          paddingBottom={sizes.s}
          row
          flex={0}
          justify="flex-start"
          onPress={() => {
            category
              ? navigation.navigate('CategoryDetails', {category})
              : navigation.navigate('Categories');
          }}>
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.primary}
            source={assets.arrow}
            transform={[{rotate: '180deg'}]}
          />
          <Text p primary marginLeft={sizes.s}>
            {t('common.goBack')}
          </Text>
        </Button>
        <Block align="center">
          <Text h5>
            {category
              ? t('screens.category_form.edit')
              : t('screens.category_form.add')}
          </Text>
        </Block>
        <Text p semibold marginBottom={sizes.s}>
          Name
        </Text>
        <Input
          value={name}
          onChangeText={(value) => setName(value)}
          placeholder="Name"
          marginBottom={sizes.sm}
        />
        <Text p semibold marginBottom={sizes.s}>
          Image
        </Text>
        <View
          style={{
            borderColor: colors.gray,
            borderWidth: !image ? 1 : 0,
            borderRadius: 10,
            alignContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingBottom: !image ? 25 : 0,
            paddingTop: !image ? 40 : 0,
            marginBottom: 15,
          }}>
          {!image ? (
            <>
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
            </>
          ) : (
            <>
              <Block
                style={{
                  zIndex: 2,
                  position: 'absolute',
                  right: 3,
                  top: 3,
                }}>
                <TouchableOpacity onPress={() => setImage(null)}>
                  <Block
                    flex={0}
                    radius={6}
                    align="center"
                    justify="center"
                    width={sizes.md}
                    height={sizes.md}
                    gradient={gradients?.secondary}>
                    <Image
                      source={assets.close}
                      color={colors.white}
                      radius={0}
                    />
                  </Block>
                </TouchableOpacity>
              </Block>
              <Image
                width="100%"
                height={200}
                radius={10}
                source={{
                  uri: image.uri,
                }}
              />
            </>
          )}
        </View>
        <Text p semibold marginBottom={sizes.s}>
          Description
        </Text>
        <Input
          onChangeText={(value) => setDescription(value)}
          placeholder="Description"
          marginBottom={sizes.sm}
          value={description}
        />
        <Text p semibold marginBottom={sizes.s}>
          Monthly budget
        </Text>
        <Input
          value={monthlyBudget}
          onChangeText={(value) => setMonthlyBudget(value)}
          placeholder="Monthly budget"
          marginBottom={sizes.sm}
          keyboardType="numeric"
        />
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
              onSubmit();
            }}>
            <Text white bold transform="uppercase">
              {category ? 'Modify category' : 'Add category'}
            </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default CategoryForm;
