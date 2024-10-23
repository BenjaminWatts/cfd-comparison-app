import { SettlementDate, SettlementDateOutput } from 'cfd-comparison/dist/models'
import React from 'react'
import { Platform } from 'react-native'
import { augmentLabels, LabelledPrice } from './utils'

const DOMAIN = Platform.select({
    web: ''
})

const getUrl = (sd: SettlementDate): string => {
    const { year, month, day } = sd;
    const ymd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;  
    return `${DOMAIN}/data/settlement-dates/${ymd}.json`  
}

const fetchSd = (
    sd: SettlementDate
) => fetch(getUrl(sd))
    .then(res => res.json() as Promise<SettlementDateOutput>)
    .then(augmentLabels)

export const useSettlementDatePrices = (
    sd: SettlementDate
) => {
    const [data, setData] = React.useState<LabelledPrice[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<Error | null>(null)
    React.useEffect(() => {
        setLoading(true)
        setError(null)
        fetchSd(sd)
            .then(setData).then(() => setLoading(false))
            .catch(setError)
    }, [sd])
    return { data, loading, error }
}