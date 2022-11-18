import { useNavigation } from '@react-navigation/core';
import { api } from '../services/api-service';
import { useMutation } from 'react-query';

import { useTheme, useTranslation } from '../hooks/';
import { Block, Button, Image, Text, DialogBox } from '../components/';
import { Icon } from 'react-native-elements';
import { useState } from 'react';
import React from 'react';
import { View } from 'react-native';

const CategoryDetails = ({ route: { params } }: { route: { params: any } }) => {
  const { assets, gradients, colors, sizes } = useTheme();
  const category = params.category;
  const [openDialogBox, setDialogBoxOpen] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const deleteCategory = useMutation(api.deleteCategory, {
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      // TODO: invalidateQueries(['categories']);
      navigation.navigate('Categories');
    },
  });

  return (
    <Block safe marginTop={sizes.md}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.padding }}>
        <Block flex={0}>
          <DialogBox
            resource="category"
            open={openDialogBox}
            cancel={() => setDialogBoxOpen(false)}
            confirm={() => deleteCategory.mutate(category.id)}
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
                  transform={[{ rotate: '180deg' }]}
                />
                <Text p white marginLeft={sizes.s}>
                  {t('categories.title')}
                </Text>
              </Button>
              <Button
                round
                color={colors.white}
                marginBottom={sizes.base}
                onPress={() => setDialogBoxOpen(true)}>
                <Icon name="delete" size={20} color="red" />
              </Button>
            </Block>
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
              <Block>
                <Button
                  gradient={gradients.secondary}
                  marginBottom={sizes.base}
                  marginTop={10}
                  onPress={() => {
                    navigation.navigate('CategoryForm', { category: category });
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
            </Block>
          </Image>
        </Block>
      </Block>
    </Block>
  );
};

export default CategoryDetails;
