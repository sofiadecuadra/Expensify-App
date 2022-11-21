import React, { useMemo, useState, useLayoutEffect } from 'react';
import { Block, Text, Modal, DateRangePicker, Button, Image } from '../components';
import {useNavigation} from '@react-navigation/core';
import {
  BarChart,
  PieChart,
} from 'react-native-chart-kit';
import { useWindowDimensions } from 'react-native';
import { useQueryAuth, useTheme } from '../hooks';
import { api } from '../services/api-service';
import {useHeaderHeight} from '@react-navigation/stack';

const availableColors = [
  '#cb0c9f',
  '#8392ab',
  '#17c1e8',
  '#82d616',
  '#fbcf33',
  '#ea0606',
  '#e9ecef',
  '#344767',
];

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

export const getFromDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getToDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const parseChartCategoryData = (data) => {
  if (!data) return [];
  let result = [];
  for (let item of data) {
    result.push({
      name: item.Category.name,
      total: Number.parseInt(item.total),
      color: availableColors[result.length % availableColors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    });
  }
  return result;
};

//get month from number
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
  let result = { labels: [], datasets: [] };
  for (let item of data) {
    if (item.month) result.labels.push(getMonth(item.month));
    else result.labels.push(item.week);
    result.datasets.push({
      data: [Number.parseInt(item.amount)],
    });
  }
  return result;
};


const Analysis = () => {
  const { sizes, colors, assets } = useTheme();
  const [toDate, setToDate] = useState(getToDate());
  const [fromDate, setFromDate] = useState(getFromDate());
  const [openCalendar, setOpenCalendar] = useState(false);
  const { data: expensesByCategory } = useQueryAuth.useQueryAuth(
    ['categoriesExpenses', fromDate, toDate],
    api.expenseByCategory,
    {},
  );
  const { data: expensesByMonth } = useQueryAuth.useQueryAuth(
    ['monthExpenses', fromDate, toDate],
    api.expenseByMonth,
    {},
  );
  const { width } = useWindowDimensions();

  const parsedChartCategoryData = useMemo(
    () => parseChartCategoryData(expensesByCategory),
    [expensesByCategory],
  );

  const parsedChartMonthData = useMemo(
    () => parseChartMonthData(expensesByMonth),
    [expensesByMonth],
  );

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
      <Block flex={0} row center style={{
          marginTop: 20,
          marginBottom: 20,
        }}>
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
        </Block>
      <Modal
        id="Calendar"
        open={openCalendar}
        onRequestClose={() => setOpenCalendar(false)}>
        <DateRangePicker
          onSuccess={(start, end) => {
            setFromDate(new Date(start + 'T00:00:00'));
            setToDate(new Date(end + 'T00:00:00'));
          }}
          theme={{ markColor: '#808080', markTextColor: 'white' }}
        />
      </Modal>
      <Text center h5 marginHorizontal={sizes.m} paddingBottom={10}>
        Expenses distribution by category
      </Text>
      {parsedChartCategoryData.length > 0 ? (
        <Block
          card
          flex={0}
          marginBottom={sizes.sm}
          marginHorizontal={10}>
          <PieChart
            data={parsedChartCategoryData}
            width={width - 20}
            height={220}
            chartConfig={chartConfig}
            accessor={'total'}
            backgroundColor={'transparent'}
          />
        </Block>
      ) : (
        <Text center>No data to display on the current period.</Text>
      )}

      <Text h5 semibold marginVertical={sizes.s} center>
        Expense distribution by month/week
      </Text>

      {expensesByMonth?.length > 0 ? (
        <Block
          card
          flex={0}
          row={true}
          marginBottom={sizes.sm}
          marginHorizontal={10}>
          <BarChart
            style={chartConfig}
            data={parsedChartMonthData}
            width={width - 30}
            height={300}
            yAxisLabel="$"
            chartConfig={chartConfig}
            verticalLabelRotation={15}
          />
        </Block>
      ) : (
        <Text center>No data to display on the current period.</Text>
      )}

    </Block>
  );
};

export default Analysis;
