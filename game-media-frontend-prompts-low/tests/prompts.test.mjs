import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { promptBodies, validPromptText } from "./prompt-fixture.mjs";

const checker = fileURLToPath(new URL("../scripts/check-prompts.mjs", import.meta.url));
function check(text, filename = "audit-001_提示词_1112.md") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prompt-check-"));
  try {
    const file = path.join(dir, filename);
    fs.writeFileSync(file, text);
    const result = spawnSync(process.execPath, [checker, file], { encoding: "utf8" });
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("rejects the audited repeated trivial task across all three categories", () => {
  const body = "预览按钮目前写着开始，第一次打开项目的人看不懂用途，希望把文字统一改成播放预览。画布和时间轴同时保持原样，播放、导出与保存仍然使用原有流程，不能改变任何数据。这里是继续使用开始还是使用播放预览，选后者，代价是按钮文字稍长，但原有宽度足够，因此只需要替换现有文字。无论打开旧项目、切换图层还是重复点击，这次调整都只影响按钮显示，所有现有行为均无需新增或重写。验收时查看这个按钮的文字已经改变，点击后仍然执行原有播放动作即可。";
  const result = check(validPromptText(Array(22).fill(body)));
  assert.equal(result.status, 1);
  assert.match(result.output, /重复|雷同|相似/);
});

test("accepts distinct same-domain tasks without certifying their difficulty", () => {
  const result = check(validPromptText());
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /格式预检通过/);
  assert.match(result.output, /不代表真实困难/);
  assert.match(result.output, /check-delivery.*独立源码复核/);
});

test("rejects lightly rewritten duplicates across category boundaries", () => {
  const bodies = [...promptBodies];
  bodies[10] = bodies[0].replaceAll("项目", "作品").replaceAll("同时", "一并");
  const result = check(validPromptText(bodies));
  assert.equal(result.status, 1);
  assert.match(result.output, /gen-01.*feature-01.*相似|gen-01.*feature-01.*雷同/);
});

test("does not require a fixed difficulty keyword vocabulary", () => {
  const bodies = [...promptBodies];
  bodies[0] = "希望为粒子编辑器增加可取消的着色器编译队列，参数面板产生新请求后，渲染器将其送入独立线程，并在编译结束时依据提交序号接纳结果。较早的任务即便晚于新任务结束，也没有资格替换已接纳的程序。停止编辑时应撤销等待中的任务，并释放已分配但不再使用的纹理与缓冲区。考虑设备只允许有限着色资源，队列采用合并连续参数更新的策略，用户确认的关键节点则保有单独任务。编译报错时显示对应参数的诊断位置，继续呈现上一次成功的效果；用户修正后可重新提交，页面中的繁忙标记准确对应队列内尚未结束的工作。";
  const result = check(validPromptText(bodies));
  assert.equal(result.status, 0, result.output);
});

test("rejects missing or extra tasks and non-difficult labels", () => {
  for (const text of [
    validPromptText().replace(/^10\. 【困难】.*\n/m, ""),
    validPromptText() + "3. 【困难】" + promptBodies[0] + "\n",
    validPromptText().replace("【困难】", "【中等】"),
    validPromptText().replace("【困难】", "【地狱】"),
  ]) assert.equal(check(text).status, 1);
});

test("rejects wrong section order, numbering, multiline bodies and Markdown decoration", () => {
  for (const text of [
    validPromptText().replace("**0-1代码生成**", "**Feature迭代**"),
    validPromptText().replace("2. 【困难】", "3. 【困难】"),
    validPromptText().replace("浏览器本地", "浏览器\n本地"),
    validPromptText().replace("浏览器本地", "**浏览器本地**"),
    validPromptText().replace("浏览器本地", "`浏览器本地`"),
  ]) assert.equal(check(text).status, 1);
});

test("enforces length, banned wording and filename", () => {
  for (const body of [promptBodies[0].slice(0, 169), promptBodies[0] + "字".repeat(381), promptBodies[0] + "根因"]) {
    const bodies = [...promptBodies]; bodies[0] = body;
    assert.equal(check(validPromptText(bodies)).status, 1);
  }
  assert.equal(check(validPromptText(), "bad.md").status, 1);
});

test("reports missing input without an uncaught exception", () => {
  const result = spawnSync(process.execPath, [checker, "/not-present/prompt.md"], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /无法读取/);
  assert.doesNotMatch(result.stderr, /node:fs|at Object/);
});

test("parser exposes stable IDs and exact bodies for final acceptance", async () => {
  const { parsePrompts } = await import("../scripts/prompt-format.mjs");
  const result = parsePrompts(validPromptText().replaceAll("\n", "\r\n"));
  assert.deepEqual(result.errors, []);
  assert.equal(result.items.length, 22);
  assert.deepEqual(result.items[0], { id: "gen-01", category: "0-1代码生成", body: promptBodies[0] });
  assert.equal(result.items[10].id, "feature-01");
  assert.equal(result.items[21].id, "bug-02");
});
