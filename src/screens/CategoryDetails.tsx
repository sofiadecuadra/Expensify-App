import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/core';

import { useTheme, useTranslation } from '../hooks/';
import { Block, Button, Input, Image, Text, Category } from '../components/';

const CategoryDetails = ({ route: { params } }: { route: { params: any } }) => {
    const category = params.category;
    const { assets, colors, sizes } = useTheme();
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <Block safe marginTop={sizes.md}>
            <Block
                scroll
                paddingHorizontal={sizes.s}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: sizes.padding }}>
                <Block flex={0}>
                    <Image
                        background
                        resizeMode="cover"
                        padding={sizes.sm}
                        paddingBottom={sizes.l}
                        radius={sizes.cardRadius}
                        source={assets.background}>
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
                                transform={[{ rotate: '180deg' }]}
                            />
                            <Text p white marginLeft={sizes.s}>
                                {t('categories.title')}
                            </Text>
                        </Button>
                        <Block flex={0} align="center">
                            <Text h5 center white marginBottom={sizes.sm}>
                                {`${category?.name}`}
                            </Text>
                            <Image
                                resizeMode="cover"
                                source={{ uri: category.image }}
                                style={{
                                    height: sizes.width / 2.435,
                                    width: sizes.width / 2.435,
                                }}
                                marginBottom={sizes.sm}
                            />
                            <Text p center white marginBottom={sizes.sm}>
                                {`Description: ${category?.description}`}
                            </Text>
                            <Text p center white marginBottom={sizes.sm}>
                                {`Monthly Budget: $${category?.monthlyBudget}`}
                            </Text>
                            <Block row marginVertical={sizes.m}>

                            </Block>
                        </Block>
                    </Image>
                </Block>
            </Block>
        </Block>
    );
};

export default CategoryDetails;
