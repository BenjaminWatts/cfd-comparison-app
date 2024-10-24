import fs from 'fs'
import { getSettlementDate } from "cfd-comparison/dist/index"
import {type SettlementDate} from "cfd-comparison/dist/models"

const outputDir = 'public/data/settlement-dates'

const dateToSd = (date: Date): SettlementDate => ({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
})

const getDateIso = (sd: SettlementDate): string => {
    const { year, month, day } = sd;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;    
}

const getOutputFp = (sd: SettlementDate) => `${outputDir}/${getDateIso(sd)}.json`

const START_DATE = new Date(Date.UTC(2023, 0, 1))
const LAG_DAYS = 7 // only try getting data up to x days in the past from now

const getSettlementDates = () => {
    const now = Date.now();
    const dates: Date[] = [];
    for (let date = START_DATE.getTime(); date <= now - LAG_DAYS * 24 * 60 * 60 * 1000; date += 24 * 60 * 60 * 1000) {
        dates.push(new Date(date));
    }
    return dates;
}

const downloadSd = async (
    sd: SettlementDate
) => {
    const fp = getOutputFp(sd)
    if(fs.existsSync(fp)) return 
    const data = await getSettlementDate(sd);
    fs.writeFileSync(fp, JSON.stringify(data, null, 2))
}

const writeLastSuccessful = (sd: SettlementDate) => fs.writeFileSync(`${outputDir}/last-successful.json`, JSON.stringify(sd, null, 2))

export const checkUpdateAll = async () => {
    const dates = getSettlementDates();
    const sds = dates.map(dateToSd)
    let lastSuccessful: SettlementDate | null = null;
    for (const sd of sds) {
        try {
            await downloadSd(sd)
            lastSuccessful = sd;
        } catch(e: any) {
            console.error(sd, e.message)
        }
    }
    if(lastSuccessful) {
        console.log('Last successful:', lastSuccessful)
        writeLastSuccessful(lastSuccessful)
    }
}

checkUpdateAll()