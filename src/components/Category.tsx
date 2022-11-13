import React from 'react';
import Block from './Block';
import Image from './Image';
import Text from './Text';
import { useTheme } from '../hooks/';

const Category = ({ image, name, description }: any) => {
  const { sizes } = useTheme();

  const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

  return (
    <Block
      card
      flex={0}
      row={true}
      marginBottom={sizes.sm}
      width={CARD_WIDTH * 2 + sizes.sm}>
      <Image
        resizeMode="cover"
        source={{ uri: image }}
        style={{
          height: sizes.width / 4,
          width: sizes.width / 4,
        }}
      />
      <Block
        paddingTop={sizes.s}
        paddingLeft={sizes.sm}
        paddingBottom={ sizes.s}>
        <Text p >
          {name}
        </Text>
        <Text
          size={12}
          p >
          {description}
        </Text>
      </Block>
    </Block>
  );
};

export default Category;
