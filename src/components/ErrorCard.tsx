import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Image from './Image';
import Text from './Text';
import React, {useContext} from 'react';
import {useTheme} from '../hooks';
import {AlertContext} from '../context/AlertContext';

const ErrorCard = ({errorMessage}: {errorMessage: string}) => {
  const {setErrorMessage} = useContext(AlertContext);
  const {colors, assets} = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.width}>
        <Text size={16} bold color={'white'} style={styles.text}>
          {errorMessage}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setErrorMessage('')}
        style={styles.touchableOpacity}>
        <Image
          radius={0}
          width={18}
          height={18}
          color={colors.white}
          source={assets.close}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#EA0606',
    borderRadius: 12,
    position: 'absolute',
    zIndex: 3,
    flex: 1,
    flexDirection: 'row',
    width: '95%',
    marginHorizontal: '2.5%',
    top: '3%',
  },
  width: {width: '93%'},
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  touchableOpacity: {
    padding: 5,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
});

export default ErrorCard;
