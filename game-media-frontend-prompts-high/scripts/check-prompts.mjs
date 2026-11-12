#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parsePrompts } from "./prompt-format.mjs";

const file = process.argv[2];
if (!file) {
  console.error("用法: node check-prompts.mjs <提示词.md>");
  process.exit(1);
}

let text;
try {
  text = fs.readFileSync(file, "utf8");
} catch (error) {
  console.error(`无法读取提示词文件 ${file}: ${error.message}`);
  process.exit(1);
}

const { errors } = parsePrompts(text);
const base = path.basename(file);
if (!/^[a-z]+-\d{3}_提示词_(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\.md$/u.test(base)) {
  errors.unshift(`文件名 ${base} 不符合 {小写前缀-三位数字}_提示词_{MMDD}.md`);
}
if (errors.length) {
  console.error("提示词格式预检未通过（最多列出 20 项）");
  for (const error of errors.slice(0, 20)) console.error(`- ${error}`);
  process.exit(1);
}

console.log("格式预检通过：10 条 0-1，10 条 Feature 迭代，2 条 Bug 修复，标签均为困难。");
console.log("不代表真实困难；必须完成 check-delivery 与独立源码复核后才能交付。");
