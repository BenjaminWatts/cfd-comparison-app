import React from 'react'
import {ActivityIndicator, View, Text, Button} from 'react-native'
import { useSettlementDatePrices } from '../hooks'
import { SettlementDate } from 'cfd-comparison/dist/models'
import PriceList from '../components/price-list'
import { getInitialSd, renderLocaleDate, tomorrow, yesterday } from '../utils'
import PriceGraph from '../components/price-graph'
import { useNavigation } from 'expo-router'

const App = () => {
  const nav = useNavigation()
  const [sd, setSd] = React.useState<SettlementDate>(getInitialSd())
  const {data, loading} = useSettlementDatePrices(sd)

  const nextDay = () => setSd(yesterday(sd))
  const prevDay = () => setSd(tomorrow(sd))

  React.useEffect(() => {
    nav.setOptions({
      headerLeft: () => <Button title='<' onPress={nextDay}/>,
      headerTitle: () => <Text>{renderLocaleDate(sd)}</Text>,
      headerRight: () => <Button title='>' onPress={prevDay} />
    })
  }, [sd])
  return (
    <>
      <ActivityIndicator animating={loading} />
      {data && <PriceGraph data={data} />}
      {data && <PriceList data={data}/>}
    </>
  )
}

export default App