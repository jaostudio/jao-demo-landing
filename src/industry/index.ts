import type { IndustryProfile } from '@jaostudio/engine/types'
import { summitRidge } from './summit-ridge'
import { brightsmile } from './brightsmile'
import { harrisonCole } from './harrison-cole'

export const industries: Record<string, IndustryProfile> = {
  'summit-ridge': summitRidge,
  brightsmile,
  'harrison-cole': harrisonCole,
}

export const industryList: IndustryProfile[] = Object.values(industries)
