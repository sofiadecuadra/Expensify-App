import React, {useContext, useLayoutEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Text, Modal, Select} from '../components/';
import {View} from 'react-native';
import useQueryAuth from '../hooks/useQueryAuth';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import {useMutation} from 'react-query';
import {api} from '../services/api-service';
import {AlertContext} from '../context/AlertContext';
import AlertCard from '../components/ErrorCard';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Calendar} from 'react-native-calendars';
import {invalidateQueries} from '../../App';
import {StatusBar} from 'expo-status-bar';

const ExpenseForm = ({route: {params}}: {route: {params: any}}) => {
  const {t} = useTranslation();
  const expense = params?.expense;
  const categories = useQueryAuth.useQueryAuth(
    'categories',
    api.getCategories,
    {},
  ).data;
  const {assets, gradients, colors, sizes} = useTheme();
  const [amount, setAmount] = useState(expense ? `${expense.amount}` : '');
  const [openCalendar, setOpenCalendar] = useState(false);
  const [producedDate, setProducedDate] = useState(
    expense ? new Date(expense.producedDate) : new Date(),
  );
  const [description, setDescription] = useState(
    expense ? expense.description : '',
  );
  const [categoryId, setCategoryId] = useState(
    expense ? expense.Category.id : null,
  );
  const [image, setImage] = useState(
    expense
      ? expense.image.uri
        ? expense.image
        : {uri: expense.image, alreadyUploaded: true}
      : '',
  );

  const selectItems = categories?.map((category) => {
    return {id: category.id, name: category.name};
  });

  const {errorMessage, setErrorMessage, setSuccessMessage} =
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

  const addExpense = useMutation(api.addExpense, {
    onError: (error: any) => {
      setErrorMessage(error.response.data.message);
      setSuccessMessage('');
    },
    onSuccess: () => {
      invalidateQueries(['expenses']);
      setErrorMessage('');
      setSuccessMessage('Expense added successfully!');
      navigation.goBack();
    },
  });

  const modifyExpense = useMutation(api.modifyExpense, {
    onError: (error, variables, context) => {
      setErrorMessage(error.response.data.message);
      setSuccessMessage('');
    },
    onSuccess: (data) => {
      invalidateQueries(['expenses']);
      setErrorMessage('');
      setSuccessMessage('Expense modified successfully!');
      navigation.goBack();
    },
  });

  const onSubmit = () => {
    let errorMessage = '';
    if (amount == '') errorMessage = 'Please enter an amount!';
    else if (!image) errorMessage = 'Please select a image!';
    else if (description == '') errorMessage = 'Please enter a description!';
    else if (categoryId == '') errorMessage = 'Please select a category!';
    else if (Number.parseInt(amount) < 0)
      errorMessage = 'Please enter a valid amount!';
    setErrorMessage(errorMessage);
    if (errorMessage == '') {
      if (!expense) {
        addExpense.mutate({
          amount,
          categoryId,
          description,
          producedDate: producedDate.toISOString(),
          image,
        });
      } else {
        modifyExpense.mutate({
          id: expense.id,
          amount,
          categoryId,
          description,
          producedDate: producedDate.toISOString(),
          image,
        });
      }
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <Block
        color={colors.card}
        paddingHorizontal={sizes.padding}
        paddingTop={sizes.m}
        scroll={true}>
        <Block>
          <Button
            paddingTop={sizes.m}
            paddingBottom={sizes.s}
            row
            flex={0}
            justify="flex-start"
            onPress={() => {
              navigation.goBack();
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
              {expense
                ? t('screens.expense_form.edit')
                : t('screens.expense_form.add')}
            </Text>
          </Block>

          <Text p semibold marginBottom={sizes.s}>
            Amount
          </Text>
          <Input
            onChangeText={(value) => setAmount(value)}
            placeholder="Amount"
            marginBottom={sizes.sm}
            value={amount}
          />
          <Text p semibold marginBottom={sizes.s}>
            Bill image
          </Text>
          <View
            style={{
              borderColor: 'b5b5ba',
              borderWidth: !image ? 0.5 : 0,
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
          <Select
            title="Category"
            data={selectItems}
            selectCategoryId={setCategoryId}
            categoryId={categoryId}
          />
          <Text p semibold marginBottom={sizes.s} marginTop={15}>
            Produced Date
          </Text>
          <Button
            style={{
              borderWidth: 0.8,
              borderColor: colors.gray,
            }}
            onPress={() => setOpenCalendar(true)}
            height={sizes.xl}>
            <Text p marginHorizontal={sizes.m} color="black">
              {producedDate.toDateString()}
            </Text>
          </Button>
          <Modal
            id="Calendar"
            open={openCalendar}
            onRequestClose={() => setOpenCalendar(false)}>
            <Calendar
              onDayPress={(day) => {
                setProducedDate(new Date(day.dateString + 'T06:00:01'));
                setOpenCalendar(false);
              }}
            />
          </Modal>
        </Block>
        {errorMessage !== '' && (
          <AlertCard errorMessage={errorMessage} isSuccess={false} />
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
              {expense ? 'Modify expense' : 'Add expense'}
            </Text>
          </Button>
        </Block>
      </Block>
    </>
  );
};

export default ExpenseForm;
