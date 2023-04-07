import React from 'react';
import { StyleSheet, Modal as RNModal, ViewStyle, Platform } from 'react-native';

import { useTheme } from '../hooks/';
import { IModalProps } from '../constants/types';

import Block from './Block';
import Button from './Button';
import Image from './Image';

const Modal = ({
  id = 'Modal',
  children,
  style,
  onRequestClose,
  open,
  ...props
}: IModalProps) => {
  const { assets, colors, sizes } = useTheme();
  const modalStyles = StyleSheet.flatten([style, {}]) as ViewStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const modalID =
    Platform.OS === 'android' ? { accessibilityLabel: id } : { testID: id };

  return (
    open ? (
      <RNModal
        {...modalID}
        {...props}
        transparent
        style={modalStyles}
        animationType="slide"
        onRequestClose={onRequestClose}>
        <Block justify="flex-end">
          <Block safe card flex={0} color="white">
            <Button
              top={0}
              right={0}
              position="absolute"
              onPress={() => onRequestClose?.()}>
              <Image source={assets.close} color={colors.black} />
            </Button>
            <Block
              flex={0}
              marginTop={sizes.xxl}
              marginBottom={sizes.xxl}
              paddingHorizontal={sizes.padding}>
              {children}
            </Block>
          </Block>
        </Block>
      </RNModal>
    ) : null
  );
};

export default React.memo(Modal);
