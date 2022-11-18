import React from 'react';
import Block from './Block';
import Image from './Image';
import Text from './Text';
import { useTheme } from '../hooks/';
import { parseDate } from '../utils/dateParser';

const Expense = ({ item }: any) => {
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
                source={{ uri: item?.Category.image }}
                style={{
                    height: sizes.width / 4,
                    width: sizes.width / 4,
                }}
            />
            <Block
                paddingTop={sizes.s}
                paddingLeft={sizes.sm}
                paddingBottom={sizes.s}>
                <Text p >
                    {`${item?.User.name} added '${item?.description}'`}
                </Text>
                <Text
                    size={12}
                    p >
                    {parseDate(item?.producedDate)}
                </Text>
            </Block>
            <Block
                position="absolute"
                right={sizes.sm}
                bottom={sizes.sm}>
                <Text p >
                    {`$${item?.amount}`}
                </Text>
            </Block>

        </Block>
    );
};

export default Expense;
