import { SettlementDate, SettlementDateOutput } from 'cfd-comparison/dist/models'

export const getEndDate = () => {
    const now = new Date()
    now.setDate(now.getDate() - 30)
    return now
}

export const getInitialSd = () => {
    const now = getEndDate()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  }
}

export const toDate = (
    sd: SettlementDate
) => {
    return new Date(sd.year, sd.month - 1, sd.day)
}

export const tomorrow = (
    sd: SettlementDate
):SettlementDate => {
    const date = toDate(sd)
    date.setDate(date.getDate() + 1)
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    }
}

export const yesterday = (
    sd: SettlementDate
): SettlementDate => {
    const date = toDate(sd)
    date.setDate(date.getDate() - 1)
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    }
}

export const renderLocaleDate = (sd: SettlementDate) => {
    return new Date(sd.year, sd.month - 1, sd.day).toLocaleDateString()
}

export const renderDate = (sd: SettlementDate) => {
  return `${sd.year}-${sd.month}-${sd.day}`
}

export const dateToSettlementDate = (date: Date): SettlementDate => {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    }
    }

export const renderSettlementPeriod = (
  settlementPeriod: number
) => {
  const hours = Math.floor(settlementPeriod / 2)
  const minutes = (settlementPeriod % 2) * 30
  const HHMM = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`
  return HHMM
}

export const generateLabels = (
    sd: SettlementDateOutput,
): string[] => {
    const { periods } = sd
    const labels: string[] = []
    switch (periods) {
        case 46:
            // short day - no 1am
            for (let i = 0; i < periods; i++) {
                if (i === 2) continue // Skip 1am
                labels.push(renderSettlementPeriod(i))
            }
            break
        case 50:
            // long day - two 1ams
            for (let i = 0; i < periods; i++) {
                labels.push(renderSettlementPeriod(i))
                if (i === 2) labels.push(renderSettlementPeriod(i)) // Add extra 1am
            }
            break
        default:
            // normal day
            for (let i = 0; i < periods; i++) {
                labels.push(renderSettlementPeriod(i))
            }
            break
    }
    return labels
}

export interface LabelledPrice {
    cfd?: number
    midp: number
    label: string
    index: number
}

export const augmentLabels = (
    sd: SettlementDateOutput,
): LabelledPrice[] => generateLabels(sd).map((label, index) => ({
        ...sd.prices[index],
        index,
        label   
    })
)