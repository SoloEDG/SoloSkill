import type { FlipRules, Order } from '../../../shared/types';
import { ORDER_LABELS, throughput, updateRule } from '../model/settings';
interface Props { rules: FlipRules; disabled: boolean; onChange: (rules: FlipRules) => void }
export function RulesPanel({ rules,disabled,onChange }: Props) {
  return <section className="panel rules-panel"><div className="panel-title"><h2>翻转规则</h2><span className="mini-icon">↗</span></div>
    <fieldset disabled={disabled}><label>启动顺序<select value={rules.order} onChange={e => onChange(updateRule(rules,'order',e.target.value as Order))}>{Object.entries(ORDER_LABELS).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    <label>同时翻点上限 <output>{rules.capacity} <small>枚</small></output><input type="range" min="1" max="48" value={rules.capacity} onChange={e => onChange(updateRule(rules,'capacity',+e.target.value))}/></label>
    <label>单片翻转 <output>{rules.duration} <small>ms</small></output><input type="range" min="80" max="400" step="10" value={rules.duration} onChange={e => onChange(updateRule(rules,'duration',+e.target.value))}/></label>
    <label>启动间隔 <output>{rules.stagger} <small>ms</small></output><input type="range" min="0" max="40" step="1" value={rules.stagger} onChange={e => onChange(updateRule(rules,'stagger',+e.target.value))}/></label></fieldset>
    <div className="throughput"><span>理论吞吐</span><b className="mono">{throughput(rules)}<small> 枚 / 秒</small></b></div>
  </section>;
}
