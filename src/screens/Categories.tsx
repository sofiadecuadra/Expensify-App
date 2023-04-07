import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {api} from '../services/api-service';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Text, Category} from '../components/';
import AlertCard from '../components/ErrorCard';
import {AlertContext} from '../context/AlertContext';
import {useHeaderHeight} from '@react-navigation/stack';
import useQueryAuth from '../hooks/useQueryAuth';
import {Icon} from 'react-native-elements';

const pageSize = 6;

const Categories = ({route: {params}}: {route: {params: any}}) => {
  const categoriesCount = useQueryAuth.useQueryAuth(
    ['categories', 'categoriesCount'],
    api.getCategoriesCount,
    {},
  ).data;

  const onRefresh = useCallback(() => {
    refetch();
  }, []);

  const {assets, gradients, sizes} = useTheme();
  const {errorMessage, successMessage} = useContext(AlertContext);
  const {data, fetchNextPage, refetch, isFetching} =
    useQueryAuth.useInfiniteQueryAuth(
      ['categories', pageSize],
      api.getCategoriesPaginated,
      {
        getNextPageParam: (lastPage, allPages) => {
          const pageCount = !categoriesCount
            ? 0
            : Math.ceil(categoriesCount.total / pageSize);
          if (allPages.length < pageCount) {
            return allPages.length;
          }
          return undefined;
        },
      },
    );
  const categoriesData = data?.pages.reduce((acc, val) => acc.concat(val), []);

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

  return (
    <Block>
      {successMessage !== '' && (
        <AlertCard errorMessage={successMessage} isSuccess={true} />
      )}
      {errorMessage !== '' && (
        <AlertCard errorMessage={errorMessage} isSuccess={false} />
      )}
      <Block
        style={{
          marginTop: 20,
        }}>
        <Text center h5 marginHorizontal={sizes.m}>
          Your categories
        </Text>

        {/* products list */}
        <Block paddingHorizontal={sizes.padding}>
          <Block wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
              }
              data={categoriesData}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={() => {
                fetchNextPage();
              }}
              renderItem={({item}) => (
                <Button
                  onPress={() =>
                    navigation.navigate('CategoryDetails', {category: item})
                  }>
                  <Category {...item} key={`card-${item?.id}`} />
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
          onPress={() => navigation.navigate('CategoryForm')}>
          <Icon name="add" size={20} color="white" />
        </Button>
      </Block>
    </Block>
  );
};

export default Categories;
