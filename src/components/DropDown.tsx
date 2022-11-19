import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

export default   (items:any) => {
    return (
        <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            items={items}
        />
    );
};

