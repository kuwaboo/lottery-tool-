export type LotteryType = 'loto6' | 'loto7' | 'numbers3' | 'numbers4'

export interface LotteryConfig {
  type: LotteryType
  label: string
  description: string
  count: number
  min: number
  max: number
}

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  loto6: { type: 'loto6', label: 'ロト6', description: '1〜43から6個', count: 6, min: 1, max: 43 },
  loto7: { type: 'loto7', label: 'ロト7', description: '1〜37から7個', count: 7, min: 1, max: 37 },
  numbers3: { type: 'numbers3', label: 'ナンバーズ3', description: '0〜9を3桁', count: 3, min: 0, max: 9 },
  numbers4: { type: 'numbers4', label: 'ナンバーズ4', description: '0〜9を4桁', count: 4, min: 0, max: 9 },
}

export interface IntuitionInput {
  reason: string
  keyword: string
  color: string
  direction: string
  dream: string
  freeNumber: string
  birthdate: string
  syncNumber: string
  tapSeed: number | null
}

export interface GeneratedNumbers {
  type: LotteryType
  numbers: number[]
  sources: { label: string; value: string; numbers: number[] }[]
}
