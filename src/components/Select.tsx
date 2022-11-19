import {isoCurrencyCodes} from 'expo-localization';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '../hooks';
import Input from './Input';
import Text from './Text';

const Select = ({title, data}) => {
  const {assets, colors, sizes} = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const selectedValue = selected != -1 ? data[selected].name : '';

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
            borderColor: colors.gray,
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
              }}>
              <Text paddingLeft={15} size={16} color={colors.gray}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

export default Select;
