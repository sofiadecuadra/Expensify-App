import {useNavigation} from '@react-navigation/core';
import {api} from '../services/api-service';
import {useMutation} from 'react-query';

import {useQueryAuth, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Text, DialogBox} from '../components/';
import {Icon} from 'react-native-elements';
import {useMemo, useState} from 'react';
import React from 'react';
import {View} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

const getMonth = (number) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[number - 1];
};

const parseChartMonthData = (data) => {
  if (!data) return [];
  let result = {labels: [], datasets: []};
  for (let item of data) {
    if (item.month) result.labels.push(getMonth(item.month));
    else result.labels.push(item.week);
    result.datasets.push({
      data: [Number.parseInt(item.total)],
    });
  }
  return result;
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const CategoryDetails = ({route: {params}}: {route: {params: any}}) => {
  const {assets, gradients, colors, sizes} = useTheme();
  const category = params.category;
  const [openDialogBox, setDialogBoxOpen] = useState(false);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {data} = useQueryAuth.useQueryAuth(
    ['categoryExpenses', category.id],
    api.getCategoryExpenses,
    {},
  );

  const parsedChartMonthData = useMemo(() => parseChartMonthData(data), [data]);

  console.log(parsedChartMonthData);

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
        contentContainerStyle={{paddingBottom: sizes.padding}}>
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
                  transform={[{rotate: '180deg'}]}
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
                source={{uri: category.image}}
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
                    navigation.navigate('CategoryForm', {category: category});
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
              {parsedChartMonthData.datasets?.length > 0 ? (
                <>
                  <Text p white>
                    {`Expenses by month`}
                  </Text>
                  <BarChart
                    style={chartConfig}
                    data={parsedChartMonthData}
                    width={300}
                    height={200}
                    yAxisLabel="$"
                    chartConfig={chartConfig}
                    verticalLabelRotation={15}
                  />
                </>
              ) : null}
            </Block>
          </Image>
        </Block>
      </Block>
    </Block>
  );
};

export default CategoryDetails;
