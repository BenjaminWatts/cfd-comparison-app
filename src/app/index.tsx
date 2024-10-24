import React from 'react'
import {ActivityIndicator, View, Text, Button} from 'react-native'
import { useLastSuccessful, useSettlementDatePrices } from '../hooks'
import { SettlementDate } from 'cfd-comparison/dist/models'
import PriceList from '../components/price-list'
import { dateToSettlementDate, getEndDate, toDate, tomorrow, yesterday } from '../utils'
import PriceGraph from '../components/price-graph'
import DatePicker from 'react-datepicker'; // Import the DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the DatePicker CSS
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import '../index.css'

const App = () => {
  
  const lastSuccessful = useLastSuccessful()
  const [sd, setSd] = React.useState<SettlementDate>()
  React.useEffect(() => {
    if(lastSuccessful.sd && !sd) setSd(lastSuccessful.sd)
  }, [lastSuccessful.sd])

  const { data, loading, error } = useSettlementDatePrices(sd)

  const nextDay = () => sd && setSd(yesterday(sd))
  const prevDay = () => sd && setSd(tomorrow(sd))

  return (
    <PanGestureHandler
      onGestureEvent={({ nativeEvent }) => {
        if (nativeEvent.translationX > 0) {
          nextDay();
        } else if (nativeEvent.translationX < 0) {
          prevDay();
        }
      }}
    >
      <>
      <View style={{
        backgroundColor: 'white',
        padding: 10
      }}>
        <Text>
          Compare the average price of renewable electricity from CFD (Contract for Difference) generators with the (gas driven) conventional market index price.
        </Text>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: 'lightgrey'
      }}>
        <Button title='<<' onPress={nextDay} />
       {sd &&  <DatePicker
          selected={toDate(sd)}
          dateFormat={'dd MMMM yyyy'}
          showMonthDropdown={true}
          showYearDropdown={true}
          showPopperArrow={true}  // Display the arrow in the date picker popper
          minDate={new Date(Date.UTC(2022, 0, 1))}
          maxDate={getEndDate()}
          onChange={
            (x) => x && setSd(dateToSettlementDate(x))
          }
        />}
        <Button title='>>' onPress={prevDay} />
      </View>

      <ActivityIndicator animating={loading} />


      {error && <View style={{
        height: 300,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}><Text>Unable to get data. Due to publishing delays from the Low Carbon Contracts Company and Elexon, data is usually only available up to about 10 days in the past. Sometimes we have have redacted days with data where we have found errors such as missing data.</Text></View>}
      {data && <PriceGraph data={data} />}
      
      {data && <>
        <View style={{height: 20}}/>
        <PriceList data={data}/>
      </>}
      </>

    </PanGestureHandler>
  )
}

const WithGestureRootHandlerComponent: React.FC = () => {

  return (
   <GestureHandlerRootView>
      <App />
    </GestureHandlerRootView>
  )
}

export default WithGestureRootHandlerComponent