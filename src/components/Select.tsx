import {isoCurrencyCodes} from 'expo-localization';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '../hooks';
import Input from './Input';
import Text from './Text';

const getSelectedPosition = (categories, categoryId) => {
  if (!categories) {
    return -1;
  }
  const index = categories.findIndex((category) => category.id === categoryId);
  return index;
};

const Select = ({title, data, selectCategoryId, categoryId}) => {
  const {colors, sizes} = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    categoryId ? getSelectedPosition(data, categoryId) : -1,
  );
  const selectedValue = selected != -1 ? data[selected].name : '';

  useEffect(() => {
    setSelected(getSelectedPosition(data, categoryId));
  }, [data]);

  return (
    <>
      <Text p semibold marginBottom={sizes.s}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => {
          setIsOpen(!isOpen);
        }}>
        <Input
          select={selectedValue === ''}
          close={selectedValue != '' && !isOpen}
          disabled
          placeholder={title}
          value={selectedValue}
        />
      </TouchableOpacity>
      {isOpen && (
        <View
          style={{
            borderColor: data.length == 0 ? colors.danger : colors.gray,
            borderWidth: 1,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            marginBottom: 15,
          }}>
          {data.map((item, index) => (
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 7,
              }}
              key={item.id}
              onPress={() => {
                setSelected(index);
                setIsOpen(false);
                selectCategoryId(item.id);
              }}>
              <Text paddingLeft={15} size={16} color={colors.gray}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
          {data.length == 0 ? (
            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 7,
              }}>
              <Text paddingLeft={15} size={16} color={colors.danger}>
                Please add a category
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </>
  );
};

export default Select;
