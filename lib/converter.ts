import type { LotteryType, IntuitionInput, GeneratedNumbers } from './types'

// 音霊：50音の数値マッピング
const OTODAMA_MAP: Record<string, number> = {
  'あ':1,'い':2,'う':3,'え':4,'お':5,
  'か':6,'き':7,'く':8,'け':9,'こ':10,
  'さ':11,'し':12,'す':13,'せ':14,'そ':15,
  'た':16,'ち':17,'つ':18,'て':19,'と':20,
  'な':21,'に':22,'ぬ':23,'ね':24,'の':25,
  'は':26,'ひ':27,'ふ':28,'へ':29,'ほ':30,
  'ま':31,'み':32,'む':33,'め':34,'も':35,
  'や':36,'ゆ':37,'よ':38,
  'ら':39,'り':40,'る':41,'れ':42,'ろ':43,
  'わ':44,'を':45,'ん':46,
  'が':6,'ぎ':7,'ぐ':8,'げ':9,'ご':10,
  'ざ':11,'じ':12,'ず':13,'ぜ':14,'ぞ':15,
  'だ':16,'ぢ':17,'づ':18,'で':19,'ど':20,
  'ば':26,'び':27,'ぶ':28,'べ':29,'ぼ':30,
  'ぱ':26,'ぴ':27,'ぷ':28,'ぺ':29,'ぽ':30,
}

// 色の数値マッピング
const COLOR_MAP: Record<string, number> = {
  '赤':1, '橙':2, '黄':3, '緑':4, '青':5,
  '藍':6, '紫':7, '白':8, '黒':9, '金':10,
  'ピンク':1, 'オレンジ':2, 'イエロー':3, 'グリーン':4,
  'ブルー':5, '水色':5, 'バイオレット':7, 'ゴールド':10,
}

// 方角の数値マッピング
const DIRECTION_MAP: Record<string, number> = {
  '北':1, '北東':2, '東':3, '南東':4,
  '南':5, '南西':6, '西':7, '北西':8,
}

// 文字列から数値を生成（数秘術的変換）
function textToSeed(text: string): number {
  if (!text.trim()) return 0
  let sum = 0
  for (const char of text) {
    const otodama = OTODAMA_MAP[char]
    if (otodama) {
      sum += otodama
    } else {
      sum += char.charCodeAt(0) % 46 + 1
    }
  }
  // 数秘術的に1桁に還元
  while (sum > 9) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0)
  }
  return sum || 1
}

// 日付から数秘術的に数値を生成
function dateToNumbers(date: Date): number[] {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const sum = [...String(y), ...String(m), ...String(d)]
    .reduce((a, b) => a + parseInt(b), 0)
  return [y % 43 + 1, m * 4 - 1, d + 1, sum % 43 + 1]
}

// シードから指定範囲の重複なし数値配列を生成
function seedToNumbers(seeds: number[], count: number, min: number, max: number): number[] {
  const range = max - min + 1
  const combined = seeds.reduce((a, b, i) => a + b * Math.pow(31, i), 0)

  const results = new Set<number>()
  let counter = 0

  while (results.size < count) {
    const val = ((combined * 1103515245 + 12345 + counter * 6364136223846793005) >>> 0) % range + min
    results.add(val)
    counter++
    if (counter > 10000) break
  }

  return Array.from(results).sort((a, b) => a - b)
}

export function generateNumbers(input: IntuitionInput, type: LotteryType): GeneratedNumbers {
  const config = { loto6: {count:6,min:1,max:43}, loto7: {count:7,min:1,max:37}, numbers3: {count:3,min:0,max:9}, numbers4: {count:4,min:0,max:9} }[type]
  const today = new Date()
  const sources: GeneratedNumbers['sources'] = []

  // 各入力からシードを生成
  const dateNums = dateToNumbers(today)
  sources.push({ label: '今日の日付の音', value: `${today.getMonth()+1}月${today.getDate()}日`, numbers: dateNums.slice(0, 2) })

  const reasonSeed = textToSeed(input.reason)
  if (input.reason) {
    const reasonNums = seedToNumbers([reasonSeed, today.getDate()], 2, config.min, config.max)
    sources.push({ label: '買おうと思った理由', value: input.reason, numbers: reasonNums })
  }

  const keywordSeed = textToSeed(input.keyword)
  if (input.keyword) {
    const keyNums = seedToNumbers([keywordSeed, reasonSeed], 2, config.min, config.max)
    sources.push({ label: 'キーワードの音霊', value: input.keyword, numbers: keyNums })
  }

  const colorVal = COLOR_MAP[input.color] || textToSeed(input.color)
  if (input.color) {
    sources.push({ label: '気になる色', value: input.color, numbers: [colorVal % (config.max - config.min + 1) + config.min] })
  }

  const dirVal = DIRECTION_MAP[input.direction] || textToSeed(input.direction)
  if (input.direction) {
    sources.push({ label: '気になる方角', value: input.direction, numbers: [dirVal % (config.max - config.min + 1) + config.min] })
  }

  const dreamSeed = textToSeed(input.dream)
  if (input.dream) {
    const dreamNums = seedToNumbers([dreamSeed, colorVal], 2, config.min, config.max)
    sources.push({ label: '夢・ビジョン', value: input.dream, numbers: dreamNums })
  }

  if (input.freeNumber) {
    const freeNums = input.freeNumber.split(/[,、\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= config.min && n <= config.max)
    if (freeNums.length) sources.push({ label: '直感で浮かんだ数字', value: input.freeNumber, numbers: freeNums })
  }

  // 生年月日：数秘術の運命数を算出
  let birthSeed = 0
  if (input.birthdate) {
    const digits = input.birthdate.replace(/\D/g, '')
    let sum = digits.split('').reduce((a, b) => a + parseInt(b), 0)
    while (sum > 9) sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0)
    birthSeed = sum || 1
    const birthNums = seedToNumbers([birthSeed, digits.length], 2, config.min, config.max)
    sources.push({ label: '運命数（生年月日）', value: `運命数 ${birthSeed}`, numbers: birthNums })
  }

  // シンクロ数字：最近見たゾロ目・気になる数字
  let syncSeed = 0
  if (input.syncNumber) {
    const syncNums = input.syncNumber.split(/[,、\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n))
    if (syncNums.length) {
      syncSeed = syncNums.reduce((a, b) => a + b, 0)
      const mapped = syncNums.map(n => ((n - config.min) % (config.max - config.min + 1) + (config.max - config.min + 1)) % (config.max - config.min + 1) + config.min)
      sources.push({ label: 'シンクロ数字', value: input.syncNumber, numbers: mapped })
    }
  }

  // タップ位置：純粋な直感シード
  if (input.tapSeed !== null && input.tapSeed !== undefined) {
    const tapNums = seedToNumbers([input.tapSeed, today.getTime() % 1000], 2, config.min, config.max)
    sources.push({ label: '直感タップ', value: '画面に触れた位置', numbers: tapNums })
  }

  // 全シードを統合して最終的な数字を生成
  const allSeeds = [reasonSeed, keywordSeed, colorVal, dirVal, dreamSeed, birthSeed, syncSeed, input.tapSeed ?? 0, ...dateNums]
  const finalNumbers = seedToNumbers(allSeeds, config.count, config.min, config.max)

  return { type, numbers: finalNumbers, sources }
}
