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
import {Dimensions} from 'react-native';
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

const data1 = [
  {
    name: 'Seoul',
    population: 21500000,
    color: 'rgba(131, 167, 234, 1)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Toronto',
    population: 2800000,
    color: '#F00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Beijing',
    population: 527612,
    color: 'red',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'New York',
    population: 8538000,
    color: '#ffffff',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Moscow',
    population: 11920000,
    color: 'rgb(0, 0, 255)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
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

const parseChartData = (data) => {
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

const Analysis = () => {
  const {sizes} = useTheme();
  const [toDate, setToDate] = useState(getToDate());
  const [fromDate, setFromDate] = useState(getFromDate());
  const {data} = useQueryAuth(
    ['categoriesExpenses', fromDate, toDate],
    api.expenseByCategory,
    {},
  );

  const parsedChartData = useMemo(() => parseChartData(data), [data]);

  return (
    <Block>
      <Block color="#FAFAFA">
        <Text h5 semibold marginVertical={sizes.s} center>
          Expense distribution by category
        </Text>
        {parseChartData.length > 0 ? (
          <PieChart
            data={parsedChartData}
            width={400}
            height={220}
            chartConfig={chartConfig}
            accessor={'total'}
            backgroundColor={'transparent'}
          />
        ) : null}
      </Block>
    </Block>
  );
};

export default Analysis;
