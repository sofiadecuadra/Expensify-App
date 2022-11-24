import {useNavigation} from '@react-navigation/core';
import {api} from '../services/api-service';
import {useMutation} from 'react-query';
import ImageView from 'react-native-image-viewing';
import {useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Text, DialogBox, Modal} from '../components/';
import {Icon} from 'react-native-elements';
import {useContext, useState} from 'react';
import React from 'react';
import {Pressable, View} from 'react-native';
import {parseDate} from '../utils/dateParser';
import {invalidateQueries} from '../../App';
import {AuthContext} from '../context/AuthContext';
import {AlertContext} from '../context/AlertContext';
import AlertCard from '../components/ErrorCard';
import {StatusBar} from 'expo-status-bar';

const ExpenseDetails = ({route: {params}}: {route: {params: any}}) => {
  const {assets, gradients, colors, sizes} = useTheme();
  const expense = params.expense;
  const [openDialogBox, setDialogBoxOpen] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {isAdmin} = useContext(AuthContext);
  const {successMessage, setSuccessMessage, setErrorMessage} =
    useContext(AlertContext);

  const deleteExpense = useMutation(api.deleteExpense, {
    onError: (error: any) => {
      setErrorMessage('Error deleting expense');
      setSuccessMessage('');
    },
    onSuccess: () => {
      invalidateQueries(['expenses']);
      setErrorMessage('');
      setSuccessMessage('Expense deleted successfully!');
      navigation.navigate('Home');
    },
  });

  return (
    <>
      <StatusBar style="dark" />
      <Block safe marginTop={sizes.md}>
        {successMessage !== '' && (
          <AlertCard errorMessage={successMessage} isSuccess={true} />
        )}
        <Block
          scroll
          paddingHorizontal={sizes.s}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.padding}}>
          <Block flex={0}>
            <DialogBox
              resource="expense"
              open={openDialogBox}
              cancel={() => setDialogBoxOpen(false)}
              confirm={() => deleteExpense.mutate(expense.id)}
            />
            <Image
              background
              resizeMode="cover"
              padding={sizes.sm}
              paddingBottom={sizes.l}
              radius={sizes.cardRadius}
              source={assets.background}>
              <Block row justify="space-between">
                <Button
                  row
                  flex={0}
                  justify="flex-start"
                  onPress={() => navigation.goBack()}>
                  <Image
                    radius={0}
                    width={10}
                    height={18}
                    color={colors.white}
                    source={assets.arrow}
                    transform={[{rotate: '180deg'}]}
                  />
                  <Text p white marginLeft={sizes.s}>
                    {t('home.title')}
                  </Text>
                </Button>
                {isAdmin && (
                  <Button
                    round
                    color={colors.white}
                    marginBottom={sizes.base}
                    onPress={() => setDialogBoxOpen(true)}>
                    <Icon name="delete" size={20} color="red" />
                  </Button>
                )}
              </Block>

              <Block flex={0} align="center">
                <Text h5 center white marginBottom={sizes.sm}>
                  {`${expense?.Category.name}`}
                </Text>
                <Pressable
                  onPress={() => {
                    setOpenImageModal(true);
                  }}>
                  <Image
                    resizeMode="cover"
                    source={{uri: expense.image}}
                    style={{
                      height: sizes.width / 2.435,
                      width: sizes.width / 2.435,
                    }}
                    marginBottom={sizes.sm}
                  />
                </Pressable>
                <Text p center white marginBottom={sizes.sm}>
                  {`${expense?.User.name} added '${expense?.description}'`}
                </Text>
                <Text p center white marginBottom={sizes.sm} bold>
                  {`Amount: $${expense?.amount}`}
                </Text>
                <Text p center white marginBottom={sizes.sm}>
                  {`Produced date: ${parseDate(expense?.producedDate)}`}
                </Text>
                <Text p center white marginBottom={sizes.sm}>
                  {`Registered date: ${parseDate(expense?.producedDate)}`}
                </Text>
                {isAdmin && (
                  <Block>
                    <Button
                      gradient={gradients.secondary}
                      marginBottom={sizes.base}
                      marginTop={10}
                      onPress={() => {
                        navigation.navigate('ExpenseForm', {expense: expense});
                      }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingHorizontal: 30,
                        }}>
                        <Icon name="edit" size={20} color="white" />
                        <Text marginLeft={3} white bold transform="uppercase">
                          Edit
                        </Text>
                      </View>
                    </Button>
                  </Block>
                )}
                <ImageView
                  images={[{uri: expense.image}]}
                  imageIndex={0}
                  visible={openImageModal}
                  onRequestClose={() => setOpenImageModal(false)}
                />
              </Block>
            </Image>
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default ExpenseDetails;
