import React from 'react'
import {ActivityIndicator, View, Text, Button} from 'react-native'
import { useSettlementDatePrices } from '../hooks'
import { SettlementDate } from 'cfd-comparison/dist/models'
import PriceList from '../components/price-list'
import { dateToSettlementDate, getInitialSd, toDate, tomorrow, yesterday } from '../utils'
import PriceGraph from '../components/price-graph'
import DatePicker from 'react-datepicker'; // Import the DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the DatePicker CSS

const App = () => {
  const [sd, setSd] = React.useState<SettlementDate>(getInitialSd())
  const { data, loading, error } = useSettlementDatePrices(sd)
  const nextDay = () => setSd(yesterday(sd))
  const prevDay = () => setSd(tomorrow(sd))
  return (
    <>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
        width: '100%',
        backgroundColor: 'lightgrey'
      }}>
        <Button title='<' onPress={nextDay} />
        <DatePicker
          selected={toDate(sd)}
          dateFormat={'dd MMMM yyyy'}
          onChange={
            x => x && setSd(dateToSettlementDate(x))
          } 
        />
        <Button title='>' onPress={prevDay} />
      </View>




      <ActivityIndicator animating={loading} />


      {error && <View style={{
        height: 300,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}><Text>Unable to get data. Due to publishing delays from the Low Carbon Contracts Company and Elexon, data is usually only available up to about a week in the past. Sometimes we have have redacted days with data where we have found errors such as missing data.</Text></View>}
      {data && <PriceGraph data={data} />}
      
      {data && <>
        <View style={{height: 20}}/>
        <PriceList data={data}/>
      </>}
    </>
  )
}

export default App