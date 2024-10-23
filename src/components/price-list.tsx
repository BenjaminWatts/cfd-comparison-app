import React from 'react'
import {StyleSheet, FlatList, Text, View} from 'react-native'
import { LabelledPrice } from '../utils'


const renderPrice = (x?: number) => x ? `£${x.toFixed(2)}` : 'N/A'

const PriceList:React.FC<{
  data: LabelledPrice[]
}> = ({data}) => {
  return (
    <>
      <FlatList
        data={data}
        ListHeaderComponent={<View style={styles.row}>
          <Text></Text>
          <Text style={styles.header}>Renewables</Text>
          <Text style={styles.header}>Fossil Fuel</Text>
        </View>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.label}</Text>
            <Text>{renderPrice(item.cfd)}</Text>
            <Text>{renderPrice(item.midp)}</Text>
          </View>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10
  },
  header: {
    fontWeight: 'bold',
    paddingBottom: 10
  }
})

export default PriceList