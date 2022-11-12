import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { api } from '../services/api-service';

import { useTheme } from '../hooks/';
import { Block, Button, Input, Image, Text, Category } from '../components/';
import AlertCard from '../components/ErrorCard';
import { AlertContext } from '../context/AlertContext';
import { useHeaderHeight } from '@react-navigation/stack';
import useQueryAuth from '../hooks/useQueryAuth';
import { Icon } from '@rneui/themed'

const Categories = ({ route: { params } }: { route: { params: any } }) => {
    const { assets, gradients, sizes } = useTheme();
    const { errorMessage, setErrorMessage } = useContext(AlertContext);
    const categories = useQueryAuth('categories', api.getCategories, {}).data;
    const navigation = useNavigation();
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        setErrorMessage("");
    }, []);

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
            <Block
                style={{
                    marginTop: 20
                }}
                scroll={true}>
                {errorMessage !== '' && (
                    <AlertCard errorMessage={errorMessage} isSuccess={false} />
                )}
                <Text
                    center
                    h5
                    marginHorizontal={sizes.m}
                >
                    Your categories
                </Text>

                {/* products list */}
                <Block
                    scroll
                    paddingHorizontal={sizes.padding}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: sizes.l }}>
                    <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <Button
                                    onPress={() => navigation.navigate('CategoryDetails', { category: item })}
                                >
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
                right={sizes.m}
            >
                <Button
                    round
                    gradient={gradients.primary}
                    marginBottom={sizes.base}
                    onPress={() => navigation.navigate('AddCategory')}>
                    <Icon name="add" size={20} color="white" />
                </Button>
            </Block>
        </Block>
    );
};

export default Categories;
