import React, {
  useEffect,
  useContext,
  useState,
  useReducer,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';

import {useTheme} from '../hooks/';
import {Alert, RefreshControl} from 'react-native';

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
  Image,
} from '../components/';
import AlertCard from '../components/ErrorCard';
import {AlertContext} from '../context/AlertContext';
import queryAuth from '../hooks/useQueryAuth';
import {Icon} from 'react-native-elements';
import {useHeaderHeight} from '@react-navigation/stack';

const pageSize = 6;

const Home = ({route: {params}}: {route: {params: any}}) => {
  const {assets, gradients, colors, sizes} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  const onRefresh = useCallback(() => {
    refetch();
  }, []);

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
          onDismiss: () => {},
        },
      );
    }
  }, [params?.inviteToken]);

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

  const {errorMessage, successMessage, setErrorMessage} =
    useContext(AlertContext);
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

  const {data, fetchNextPage, refetch, isFetching} =
    queryAuth.useInfiniteQueryAuth(
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
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <>
      <Block>
        {errorMessage !== '' && (
          <AlertCard errorMessage={errorMessage} isSuccess={false} />
        )}
        {successMessage !== '' && (
          <AlertCard errorMessage={successMessage} isSuccess={true} />
        )}
        <Block
          style={{
            marginTop: 20,
          }}
          align="center">
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
                setFromDate(new Date(start + 'T06:00:01'));
                setToDate(new Date(end + 'T06:00:01'));
              }}
              theme={{markColor: '#808080', markTextColor: 'white'}}
            />
          </Modal>
          <Block paddingHorizontal={sizes.padding}>
            <Block wrap="wrap" justify="space-between" marginTop={sizes.sm}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isFetching}
                    onRefresh={onRefresh}
                  />
                }
                data={expenseData}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => {
                  fetchNextPage();
                }}
                ListEmptyComponent={() => (
                  <Text center>No data to display on the current period.</Text>
                )}
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
    </>
  );
};

export default Home;
