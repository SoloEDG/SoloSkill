import type { PinballDocument } from '@/shared/document'

export interface GoalView {
  id: string
  label: string
  detail: string
  liveDone: boolean
  careerDone: boolean
}

export function latchCareer(doc: PinballDocument): boolean {
  let changed = false
  if (doc.score >= 10000 && !doc.career.score10k) {
    doc.career.score10k = true
    changed = true
  }
  if (doc.live.bonusEntries > 0 && !doc.career.bonusOnce) {
    doc.career.bonusOnce = true
    changed = true
  }
  if (doc.live.bankClears >= 2 && !doc.career.bankTwice) {
    doc.career.bankTwice = true
    changed = true
  }
  return changed
}

export function goalViews(doc: PinballDocument): GoalView[] {
  const cleanLive = doc.phase === 'gameover' && !doc.live.tilted
  const cleanDetail = doc.live.tilted ? '本局已经倾斜' : doc.phase === 'gameover' ? '本局无倾斜收台' : '打完三颗球前不要倾斜'
  return [
    {
      id: 'score10k',
      label: '得分破万',
      detail: `当前 ${doc.score}`,
      liveDone: doc.score >= 10000,
      careerDone: doc.career.score10k,
    },
    {
      id: 'bonus',
      label: '进入奖励',
      detail: `本局 ${doc.live.bonusEntries} 次`,
      liveDone: doc.live.bonusEntries > 0,
      careerDone: doc.career.bonusOnce,
    },
    {
      id: 'bank',
      label: '清空落靶两次',
      detail: `本局 ${doc.live.bankClears} 次`,
      liveDone: doc.live.bankClears >= 2,
      careerDone: doc.career.bankTwice,
    },
    {
      id: 'clean',
      label: '无倾斜收台',
      detail: cleanDetail,
      liveDone: cleanLive,
      careerDone: doc.career.cleanFinish,
    },
  ]
}
