import React, {useMemo, useState} from 'react';
import {Block, Text} from '../components';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {Dimensions, useWindowDimensions} from 'react-native';
import {useQueryAuth, useTheme} from '../hooks';
import {api} from '../services/api-service';

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
  let result = {labels: [], datasets: []};
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
  const {sizes} = useTheme();
  const [toDate, setToDate] = useState(getToDate());
  const [fromDate, setFromDate] = useState(getFromDate());
  const {data: expensesByCategory} = useQueryAuth.useQueryAuth(
    ['categoriesExpenses', fromDate, toDate],
    api.expenseByCategory,
    {},
  );
  const {data: expensesByMonth} = useQueryAuth.useQueryAuth(
    ['monthExpenses', fromDate, toDate],
    api.expenseByMonth,
    {},
  );
  const {width} = useWindowDimensions();

  const parsedChartCategoryData = useMemo(
    () => parseChartCategoryData(expensesByCategory),
    [expensesByCategory],
  );

  const parsedChartMonthData = useMemo(
    () => parseChartMonthData(expensesByMonth),
    [expensesByMonth],
  );

  return (
    <Block>
      <Block color="#FAFAFA">
        <Text h5 semibold marginVertical={sizes.s} center>
          Expense distribution by category
        </Text>
        {parsedChartCategoryData.length > 0 ? (
          <PieChart
            data={parsedChartCategoryData}
            width={width}
            height={220}
            chartConfig={chartConfig}
            accessor={'total'}
            backgroundColor={'transparent'}
          />
        ) : null}
        <Text h5 semibold marginVertical={sizes.s} center>
          Expense distribution by category
        </Text>
        {expensesByMonth?.length > 0 ? (
          <BarChart
            style={chartConfig}
            data={parsedChartMonthData}
            width={width}
            height={300}
            yAxisLabel="$"
            chartConfig={chartConfig}
            verticalLabelRotation={15}
          />
        ) : null}
      </Block>
    </Block>
  );
};

export default Analysis;
