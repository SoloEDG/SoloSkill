#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Evidence integrity only; semantic judgments belong to the independent reviewer."""
from pathlib import Path
import json
import re
import sys

ROOT = Path('/Users/cool/work/self-project/solo/SoloSkill')
errors = []
for pid in sys.argv[1:] or ['jdk-024', 'jdk-025']:
    project = ROOT / 'origin-project' / pid
    audit = ROOT / '.pinru-audits' / pid
    prompts = {}
    category = None
    for line in (project / f'{pid}_提示词_1120.md').read_text().splitlines():
        if line == '**0-1代码生成**':
            category = 'gen'
        elif line == '**Feature迭代**':
            category = 'feature'
        elif m := re.match(r'^(\d+)\. 【困难】(.+)$', line):
            prompts[f'{category}-{int(m[1]):02d}'] = m[2]
    tasks = json.loads((audit / 'tasks.json').read_text())
    local_errors = []
    if len(tasks) != 24 or {t['id'] for t in tasks} != set(prompts):
        local_errors.append('Task IDs/counts do not match the 12+12 scope')
    for task in tasks:
        tid = task['id']
        body = prompts[tid]
        def fail(message):
            local_errors.append(f'{tid}: {message}')
        if task.get('prompt', body) != body:
            fail('recorded prompt differs from current prompt')
        for field in ['hardConstraints', 'features']:
            for item in task.get(field, []):
                if not item.get('quote') or item['quote'] not in body:
                    fail(f'{field} quote is not verbatim')
        decision = task.get('designDecision', {})
        for field in ['tension', 'baselineReuse', 'simplestApproach', 'remainingDecision', 'correctnessImpact']:
            if not decision.get(field):
                fail(f'designDecision.{field} missing')
        counter = decision.get('counterexample', {})
        if not counter.get('constraintQuote') or counter['constraintQuote'] not in body:
            fail('counterexample quote is not verbatim')
        if not counter.get('whyRoutineFixFails'):
            fail('counterexample has no routine-fix analysis')
        for item in task.get('sourceEvidence', []):
            p = project / item['path']
            if not p.is_file() or item.get('quote', '') not in p.read_text():
                fail(f'source quote missing: {item["path"]}')
        paths = set()
        for item in task.get('changes', []):
            p = Path(item['path'])
            if p.is_absolute() or '..' in p.parts or p.suffix not in ['.ts', '.tsx', '.vue'] or p.name == 'index.ts' or p.name.endswith('.d.ts'):
                fail(f'not an eligible business file: {p}')
            if item['action'] == 'modify' and not (project / p).is_file():
                fail(f'modify path does not exist: {p}')
            if item['action'] == 'add' and (project / p).exists():
                fail(f'add path already exists: {p}')
            if not item.get('reason'):
                fail(f'file necessity missing: {p}')
            paths.add(str(p))
        if len(paths) < 5:
            fail('fewer than five proposed business files')
        if not {'normal', 'boundary'} <= {a['kind'] for a in task.get('acceptance', [])}:
            fail('normal/boundary acceptance missing')
        workload = task.get('p6Workload', {})
        if workload.get('status') not in ['pending', 'estimated'] or workload.get('runs') != []:
            fail('P6 must remain unmeasured for this review')
    output = {'scope': 'existing candidates, 12 generation + 12 Feature', 'status': 'failed' if local_errors else 'passed', 'tasks': len(tasks), 'errors': local_errors, 'limitation': 'References/paths/fields only; does not establish P5 semantics or measured P6.'}
    (audit / 'logs' / 'evidence-integrity.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    errors += [f'{pid}: {x}' for x in local_errors]
    print(pid, output['status'], len(local_errors), 'errors')
for error in errors:
    print(error)
sys.exit(bool(errors))
