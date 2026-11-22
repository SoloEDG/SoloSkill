#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
import json
import subprocess

ROOT = Path('/Users/cool/work/self-project/solo/SoloSkill')
SKILL = Path('/Users/cool/.agents/skills/game-media-frontend-prompts-high')
for pid in ['jdk-024', 'jdk-025']:
    project = ROOT / 'origin-project' / pid
    audit = ROOT / '.pinru-audits' / pid
    prompt = project / f'{pid}_提示词_1120.md'
    fingerprint = json.loads(subprocess.check_output(['node', str(SKILL / 'scripts/check-delivery.mjs'), '--fingerprint', str(project), str(prompt)], text=True))
    (audit / 'fingerprint.json').write_text(json.dumps(fingerprint, indent=2) + '\n')
    tasks = json.loads((audit / 'tasks.json').read_text())
    lines = [f'# {pid} 现有候选题容量复核', '',
             '范围：用户确认均未作废，允许调整候选题；保留12条代码生成+12条Feature，不新增Bug。',
             f'项目快照：`{fingerprint["projectSha256"]}`', f'题面快照：`{fingerprint["promptSha256"]}`', '',
             '以下据最终源码和题面整理。已有时钟、种子、公开视图、集中命令和保存/终结入口均计作可复用基线。独立结论见 independent-review.md；本容量表不自证难度。', '']
    for task in tasks:
        decision = task['designDecision']
        lines += [f'## {task["id"]}：{task["goal"]}', '',
                  f'类别：{task["categoryEvidence"]["category"]}',
                  f'基线复用：{decision["baselineReuse"]}',
                  f'最强常规候选：{decision["simplestApproach"]}',
                  f'剩余决策：{decision["remainingDecision"]}',
                  f'反例：{decision["counterexample"]["steps"]}',
                  f'应得结果：{decision["counterexample"]["expected"]}',
                  '源码：' + ', '.join(sorted({x['path'] for x in task['sourceEvidence']})),
                  'P6：只有工作量预审，尚无完整独立解题轨迹。', '']
    (audit / 'capacity.md').write_text('\n'.join(lines) + '\n')
    print(pid, 'capacity and fingerprint saved')
