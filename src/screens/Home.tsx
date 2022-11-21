import React, {
  useEffect,
  useContext,
  useState,
  useReducer,
  useRef,
} from 'react';

import {useTheme} from '../hooks/';
import {Alert} from 'react-native';

import {FlatList, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {api} from '../services/api-service';

import {
  Block,
  Button,
  Text,
  Expense,
  DateRangePicker,
  Modal,
} from '../components/';
import AlertCard from '../components/ErrorCard';
import {AlertContext} from '../context/AlertContext';
import queryAuth from '../hooks/useQueryAuth';
import {Icon} from 'react-native-elements';

const pageSize = 6;

const Home = ({route: {params}}: {route: {params: any}}) => {
  useEffect(() => {
    setErrorMessage('');
    if (params?.inviteToken) {
      navigation.setParams({inviteToken: undefined});
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
  const {gradients, colors, sizes} = useTheme();
  const {errorMessage, setErrorMessage} = useContext(AlertContext);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 0, 1),
  );
  const [toDate, setToDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  );

  const expensesCount = queryAuth.useQueryAuth(
    ['expenses', 'expensesCount', fromDate, toDate],
    api.getExpensesCount,
    {},
  ).data;

  const {data, fetchNextPage} = queryAuth.useInfiniteQueryAuth(
    ['expenses', fromDate, toDate, pageSize],
    api.getExpenses,
    {
      getNextPageParam: (lastPage, allPages) => {
        const pageCount = !expensesCount
          ? 0
          : Math.ceil(expensesCount.total / pageSize);
        if (allPages.length < pageCount) {
          return allPages.length;
        }
        return undefined;
      },
    },
  );

  const expenseData = data?.pages.reduce((acc, val) => acc.concat(val), []);
  const navigation = useNavigation();
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <Block>
      <Block
        style={{
          marginTop: 20,
        }}
        align="center">
        {errorMessage !== '' && (
          <AlertCard errorMessage={errorMessage} isSuccess={false} />
        )}

        <Text center h5 marginHorizontal={sizes.m} paddingBottom={10}>
          Expenses
        </Text>
        <Button
          light
          style={{
            borderWidth: 0.8,
            borderColor: colors.gray,
          }}
          height={sizes.xl}
          onPress={() => setOpenCalendar(true)}>
          <Text center p marginHorizontal={sizes.m} color="#808080">
            {fromDate.toDateString()} - {toDate.toDateString()}
          </Text>
        </Button>
        <Modal
          id="Calendar"
          open={openCalendar}
          onRequestClose={() => setOpenCalendar(false)}>
          <DateRangePicker
            onSuccess={(start, end) => {
              setFromDate(new Date(start + 'T00:00:00'));
              setToDate(new Date(end + 'T00:00:00'));
            }}
            theme={{markColor: '#808080', markTextColor: 'white'}}
          />
        </Modal>
        <Block paddingHorizontal={sizes.padding}>
          <Block wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            <FlatList
              data={expenseData}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={() => {
                fetchNextPage();
              }}
              renderItem={({item}) => (
                <Button
                  onPress={() =>
                    navigation.navigate('ExpenseDetails', {expense: item})
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
