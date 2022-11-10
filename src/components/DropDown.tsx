import RNPickerSelect from 'react-native-picker-select';

const Dropdown = (items:any) => {
    return (
        <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            items={items}
        />
    );
};

export default Dropdown;