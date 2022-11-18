import React, { useEffect, useContext, useState } from 'react';

import { useTheme } from '../hooks/';
import { Alert } from 'react-native';

import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { api } from '../services/api-service';

import { Block, Button, Text, Expense } from '../components/';
import AlertCard from '../components/ErrorCard';
import { AlertContext } from '../context/AlertContext';
import useQueryAuth from '../hooks/useQueryAuth';
import { Icon } from 'react-native-elements';

const pageSize = 6;

const Home = ({ route: { params } }: { route: { params: any } }) => {
  useEffect(() => {
    setErrorMessage('');
    if (params?.inviteToken) {
      navigation.setParams({ inviteToken: undefined });
      Alert.alert(
        'Expensify Invite',
        'Please log out from this account in order to accept this invite.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Accept',
            style: 'default',
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>
            Alert.alert(
              'This alert was dismissed by tapping outside of the alert dialog.',
            ),
        },
      );
    }
  }, []);
  const { gradients, sizes } = useTheme();
  const { errorMessage, setErrorMessage } = useContext(AlertContext);
  const fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  const [page, setPage] = useState(0);
  const expensesCount = useQueryAuth(['expensesCount', fromDate, toDate], api.getExpensesCount, {}).data;
  //const pageCount = !expensesCount ? 0 : Math.ceil(expensesCount.total / pageSize);
  const expenses = useQueryAuth(['expenses', fromDate, toDate, page, pageSize], api.getExpenses, {}).data;
  const navigation = useNavigation();

  return (
    <Block>
      <Block
        style={{
          marginTop: 20,
        }}>
        {errorMessage !== '' && (
          <AlertCard errorMessage={errorMessage} isSuccess={false} />
        )}
        <Text center h5 marginHorizontal={sizes.m}>
          {new Date().toLocaleString('en-us', { month: 'long' }) + ' '}
          expenses
        </Text>

        <Block paddingHorizontal={sizes.padding}>
          <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            <FlatList
              data={expenses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Button
                  onPress={() =>
                    navigation.navigate('ExpenseDetails', { expense: item })
                  }>

                  <Expense item={item} key={`card-${item?.id}`} />
                </Button>
              )}
            />
          </Block>
        </Block>
      </Block>
      <Block
        marginRight={5}
        bottom={sizes.m}
        position="absolute"
        right={sizes.m}>
        <Button
          round
          gradient={gradients.primary}
          marginBottom={sizes.base}
          onPress={() => navigation.navigate('ExpenseForm')}>
          <Icon name="add" size={20} color="white" />
        </Button>
      </Block>
    </Block>
  );
};

export default Home;
