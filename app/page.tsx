'use client'

import { useState } from 'react'
import type { LotteryType, IntuitionInput, GeneratedNumbers } from '@/lib/types'
import { LOTTERY_CONFIGS } from '@/lib/types'
import { generateNumbers } from '@/lib/converter'

const COLORS = ['赤', 'オレンジ', '黄', '緑', '青', '水色', '紫', 'ピンク', '白', '黒', '金']
const DIRECTIONS = ['北', '北東', '東', '南東', '南', '南西', '西', '北西']

function generateRandomPatterns(type: LotteryType, count: number): number[][] {
  const { min, max, count: numCount } = LOTTERY_CONFIGS[type]
  return Array.from({ length: count }, () => {
    const nums: number[] = []
    while (nums.length < numCount) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min
      if (!nums.includes(n)) nums.push(n)
    }
    return nums.sort((a, b) => a - b)
  })
}

type RandomPatternsMap = Record<LotteryType, number[][]>

function generateAllRandomPatterns(): RandomPatternsMap {
  return Object.keys(LOTTERY_CONFIGS).reduce((acc, type) => {
    acc[type as LotteryType] = generateRandomPatterns(type as LotteryType, 5)
    return acc
  }, {} as RandomPatternsMap)
}

const emptyInput: IntuitionInput = {
  reason: '', keyword: '', color: '', direction: '', dream: '', freeNumber: '',
  birthdate: '', syncNumber: '', tapSeed: null,
}

export default function Home() {
  const [selectedType, setSelectedType] = useState<LotteryType>('loto6')
  const [input, setInput] = useState<IntuitionInput>(emptyInput)
  const [result, setResult] = useState<GeneratedNumbers | null>(null)
  const [step, setStep] = useState<'input' | 'result'>('input')
  const [randomPatterns, setRandomPatterns] = useState<RandomPatternsMap | null>(null)

  const handleGenerate = () => {
    const generated = generateNumbers(input, selectedType)
    setResult(generated)
    setRandomPatterns(generateAllRandomPatterns())
    setStep('result')
  }

  const handleReset = () => {
    setResult(null)
    setStep('input')
    setInput(emptyInput)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white">
      <div className="max-w-lg mx-auto px-4 py-10">

        <div className="text-center mb-10">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-3xl font-bold mb-2">直感数字占い</h1>
          <p className="text-purple-300 text-sm">あなたの直感と音霊が導く数字</p>
        </div>

        {step === 'input' && (
          <div className="space-y-6">

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-3">🎯 くじの種類</h2>
              <div className="grid grid-cols-2 gap-2">
                {(Object.values(LOTTERY_CONFIGS)).map(config => (
                  <button
                    key={config.type}
                    onClick={() => setSelectedType(config.type)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      selectedType === config.type
                        ? 'bg-purple-600 border border-purple-400'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-sm">{config.label}</div>
                    <div className="text-xs text-purple-300">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-1">💭 なぜ今日買いたいと思いましたか？</h2>
              <p className="text-white/40 text-xs mb-3">直感・予感・出来事など</p>
              <textarea
                value={input.reason}
                onChange={e => setInput({...input, reason: e.target.value})}
                placeholder="例：今日はなんかいい予感がする"
                className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none border border-white/10 focus:border-purple-400 resize-none h-20"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-1">🔮 今浮かんでいるキーワード</h2>
              <p className="text-white/40 text-xs mb-3">人名・地名・言葉・物など</p>
              <input
                value={input.keyword}
                onChange={e => setInput({...input, keyword: e.target.value})}
                placeholder="例：桜、海、おばあちゃん"
                className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none border border-white/10 focus:border-purple-400"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-3">🎨 今気になる色</h2>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setInput({...input, color: input.color === color ? '' : color})}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      input.color === color
                        ? 'bg-purple-600 border border-purple-400'
                        : 'bg-white/10 border border-white/10 hover:bg-white/20'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-3">🧭 今気になる方角</h2>
              <div className="flex flex-wrap gap-2">
                {DIRECTIONS.map(dir => (
                  <button
                    key={dir}
                    onClick={() => setInput({...input, direction: input.direction === dir ? '' : dir})}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      input.direction === dir
                        ? 'bg-purple-600 border border-purple-400'
                        : 'bg-white/10 border border-white/10 hover:bg-white/20'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-1">🌙 最近見た夢や浮かんだビジョン</h2>
              <p className="text-white/40 text-xs mb-3">なければ空白でOK</p>
              <input
                value={input.dream}
                onChange={e => setInput({...input, dream: e.target.value})}
                placeholder="例：空を飛んでいた、お金を拾った"
                className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none border border-white/10 focus:border-purple-400"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-1">⚡ 直感で浮かんだ数字</h2>
              <p className="text-white/40 text-xs mb-3">複数の場合はカンマ区切り（なければ空白）</p>
              <input
                value={input.freeNumber}
                onChange={e => setInput({...input, freeNumber: e.target.value})}
                placeholder="例：7, 13, 28"
                className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none border border-white/10 focus:border-purple-400"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-1">🎂 生年月日</h2>
              <p className="text-white/40 text-xs mb-3">数秘術で運命数を算出（なければ空白）</p>
              <input
                type="date"
                value={input.birthdate}
                onChange={e => setInput({...input, birthdate: e.target.value})}
                className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none border border-white/10 focus:border-purple-400"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-1">🔢 最近見たシンクロ数字</h2>
              <p className="text-white/40 text-xs mb-3">時計のゾロ目・レシート合計など（なければ空白）</p>
              <input
                value={input.syncNumber}
                onChange={e => setInput({...input, syncNumber: e.target.value})}
                placeholder="例：1111, 777, 333"
                className="w-full bg-white/10 rounded-xl p-3 text-sm outline-none border border-white/10 focus:border-purple-400"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-1">👆 直感タップ</h2>
              <p className="text-white/40 text-xs mb-3">パッと感じた場所をタップ（やらなくてもOK）</p>
              <button
                type="button"
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  const seed = Math.floor(x * 1000 + y)
                  setInput({...input, tapSeed: seed})
                }}
                className="w-full h-32 bg-gradient-to-br from-purple-700/30 to-indigo-700/30 rounded-xl border border-purple-400/30 hover:border-purple-300/60 transition-all text-sm text-purple-200 relative overflow-hidden"
              >
                {input.tapSeed !== null
                  ? `✨ タップ済み (シード: ${input.tapSeed})`
                  : 'ここを直感でタップ'}
              </button>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              ✨ 数字を導き出す
            </button>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-6">

            <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-2xl p-6 border border-purple-400/50 text-center">
              <div className="text-purple-300 text-sm mb-2">{LOTTERY_CONFIGS[result.type].label}</div>
              <h2 className="text-xl font-bold mb-6">あなたの数字</h2>
              <div className="flex justify-center gap-3 flex-wrap">
                {result.numbers.map((num, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/30"
                  >
                    {String(num).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-4">🔍 数字の由来</h2>
              <div className="space-y-3">
                {result.sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="text-purple-400 text-xs mt-0.5 w-28 shrink-0">{source.label}</div>
                    <div className="flex-1">
                      <div className="text-xs text-white/60 mb-1">{source.value}</div>
                      <div className="flex gap-1.5 flex-wrap">
                        {source.numbers.map((n, j) => (
                          <span key={j} className="px-2 py-0.5 bg-purple-600/40 rounded-full text-xs">{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
              <h2 className="text-purple-300 text-sm font-medium mb-3">🎯 他のくじの数字</h2>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LOTTERY_CONFIGS) as LotteryType[]).filter(t => t !== result.type).map(type => {
                  const other = generateNumbers(input, type)
                  return (
                    <div key={type} className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="text-xs text-purple-300 mb-2">{LOTTERY_CONFIGS[type].label}</div>
                      <div className="flex gap-1.5 flex-wrap">
                        {other.numbers.map((n, i) => (
                          <span key={i} className="w-8 h-8 rounded-full bg-indigo-700/60 flex items-center justify-center text-xs font-bold">{n}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {randomPatterns && (
              <div className="bg-white/5 rounded-2xl p-5 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-purple-300 text-sm font-medium">🎲 ランダム5パターン</h2>
                  <button
                    onClick={() => setRandomPatterns(generateAllRandomPatterns())}
                    className="text-xs text-purple-400 hover:text-purple-200 transition-colors border border-purple-500/40 rounded-lg px-3 py-1"
                  >
                    再生成
                  </button>
                </div>
                <div className="space-y-6">
                  {(Object.keys(LOTTERY_CONFIGS) as LotteryType[]).map(type => (
                    <div key={type}>
                      <div className="text-xs text-amber-400 font-medium mb-2">{LOTTERY_CONFIGS[type].label}</div>
                      <div className="space-y-2">
                        {randomPatterns[type].map((pattern, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-white/40 w-14 shrink-0">パターン{i + 1}</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {pattern.map((n, j) => (
                                <span key={j} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600/60 to-orange-700/60 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                                  {String(n).padStart(2, '0')}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10"
            >
              もう一度占う
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
