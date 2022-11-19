import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker'

const Picker= () => {
  const [date, setDate] = useState(new Date())

  return <DatePicker  date={date} maximumDate={date}mode ={'date'}onDateChange={setDate} />
}

export default Picker;