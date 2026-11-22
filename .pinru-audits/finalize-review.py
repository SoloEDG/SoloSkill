#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
import copy
import json
import subprocess

ROOT = Path('/Users/cool/work/self-project/solo/SoloSkill')
AUDITS = ROOT / '.pinru-audits'
SKILL = Path('/Users/cool/.agents/skills/game-media-frontend-prompts-high')
summary = []
for pid in ['jdk-024', 'jdk-025']:
    project = ROOT / 'origin-project' / pid
    audit = AUDITS / pid
    prompt = project / f'{pid}_提示词_1120.md'
    fingerprint = json.loads(subprocess.check_output(['node', str(SKILL / 'scripts/check-delivery.mjs'), '--fingerprint', str(project), str(prompt)], text=True))
    reviewer = json.loads((audit / 'independent-review.json').read_text())
    assert all(reviewer[k] == v for k, v in fingerprint.items()), f'{pid}: reviewed snapshot changed'
    assert reviewer['independent'] and reviewer['p5Verdict'] == 'pass'
    assert reviewer['p6Verdict'] == 'pending' and reviewer['verdict'] == 'pending'
    tasks = json.loads((audit / 'tasks.json').read_text())
    reviews = {t['id']: t for t in reviewer['tasks']}
    assert len(reviews) == 24 and set(reviews) == {t['id'] for t in tasks}
    for task in tasks:
        review = reviews[task['id']]
        assert review['verdict'] == 'pass' and review['actualDifficulty'] == '困难'
        assert review['difficultyGates'] == {'H1': True, 'H2': True, 'H3': True}
        assert review['simpleSolutionSuffices'] is False
        assert len(set(review['necessaryFiles'])) >= 5
        assert set(review['necessaryFiles']) <= {c['path'] for c in task['changes']}
        assert review['p6Verdict'] == 'pending' and task['p6Workload']['runs'] == []
        task['review'] = copy.deepcopy(review)
        task['review']['author'] = reviewer['author']
        task['review']['reviewer'] = reviewer['reviewer']
        task['review']['independent'] = True
        task['candidateStatus'] = 'p5_pass_pending_p6'
    checks = json.loads((audit / 'runtime-checks.json').read_text())
    required = ['typecheck', 'build', 'structure', 'dockerConfig', 'dockerBuild', 'dockerSmoke', 'browserSmoke']
    for name in required:
        assert checks[name]['status'] == 'passed' and (audit / checks[name]['log']).is_file()
    for log in ['prompt-format.json', 'evidence-integrity.json']:
        assert json.loads((audit / 'logs' / log).read_text())['status'] == 'passed'
    changes = json.loads((audit / 'change-summary.json').read_text())
    acceptance = {
        'schemaVersion': 2,
        'profile': 'existing-candidate-review-12-12',
        'date': '2026-11-22',
        'scope': {'codeGeneration': 12, 'feature': 12, 'bug': 0, 'platformInvalidated': False, 'authorization': '用户明确均未作废，按候选题调整'},
        **fingerprint,
        'status': 'p5_pass_pending_p6',
        'checks': {name: checks[name] for name in required},
        'projectReview': json.loads((audit / 'project-review.json').read_text()),
        'review': {'author': reviewer['author'], 'reviewer': reviewer['reviewer'], 'independent': True, 'verdict': 'pending', 'p5Verdict': 'pass', 'p6Verdict': 'pending', 'log': 'independent-review.md', 'structuredLog': 'independent-review.json'},
        'validation': {'format': 'logs/prompt-format.json', 'references': 'logs/evidence-integrity.json', 'scopeNote': '保留用户现有12+12。调用技能原格式解析器并仅调整本次进程中的类别数量；默认22题check-delivery全量命令未用作本套通过证据。指纹使用原技能命令。P5由独立复核者判断，P6无完整轨迹。'},
        'tasks': tasks,
    }
    (audit / 'acceptance.json').write_text(json.dumps(acceptance, ensure_ascii=False, indent=2) + '\n')
    final_check = {'status': 'passed_for_candidate_review', 'tasks': 24, 'p5Passed': 24, 'p6Pending': 24, 'runtimeChecksPassed': 7, 'reviewHashesMatch': True, 'reviewer': reviewer['reviewer'], 'necessaryFileReferencesMatch': True, 'limitation': '此检查只汇总候选复核；P6未执行，整体不是已收录或平台批准状态。'}
    (audit / 'logs' / 'final-integrity.json').write_text(json.dumps(final_check, ensure_ascii=False, indent=2) + '\n')
    summary.append({'project': pid, 'total': 24, 'changed': len(changes['changed']), 'retained': len(changes['retained']), 'p5Passed': 24, 'p6Pending': 24, **fingerprint})
    print(pid, '24 P5 passes; 24 P6 pending; 7 runtime checks; snapshot and evidence consistent')
(AUDITS / 'review-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
