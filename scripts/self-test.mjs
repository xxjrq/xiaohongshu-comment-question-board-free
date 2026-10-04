#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';

const root = resolve(import.meta.dirname, '..');
for (const name of ['SKILL.md', 'manifest.yaml', 'agents/openai.yaml', 'icon-512.png', 'fixtures/visible-comments.json', 'fixtures/no-visible-comments.json']) {
  if (!existsSync(resolve(root, name))) throw new Error(`缺少 ${name}`);
}
const manifest = readFileSync(resolve(root, 'manifest.yaml'), 'utf8');
if (!manifest.includes('name: xiaohongshu-comment-question-board-free') || !manifest.includes('self_test: node scripts/self-test.mjs')) throw new Error('manifest 核心字段无效');
for (const metadata of [manifest, readFileSync(resolve(root, 'agents/openai.yaml'), 'utf8')]) {
  for (const field of ['display_name', 'short_description', 'default_prompt', 'icon_small', 'icon_large']) {
    const value = metadata.match(new RegExp(`^  ${field}: "([^"\\n]+)"$`, 'm'))?.[1];
    if (!value) throw new Error(`interface 字符串需加引号：${field}`);
    if (field === 'default_prompt' && !value.includes('$xiaohongshu-comment-question-board-free')) throw new Error('默认提示需显式调用本 Skill');
    if (field === 'short_description' && ([...value].length < 25 || [...value].length > 64)) throw new Error('短描述长度错误');
    if (field.startsWith('icon_')) {
      const target = resolve(root, value), local = relative(root, target);
      if (local.startsWith('..') || isAbsolute(local) || !existsSync(target)) throw new Error('图标必须存在于 Skill 包内');
    }
  }
}
const skill = readFileSync(resolve(root, 'SKILL.md'), 'utf8');
if (!skill.startsWith('---\nname: xiaohongshu-comment-question-board-free\n')) throw new Error('SKILL frontmatter 无效');
const success = execFileSync(process.execPath, ['scripts/analyze-fixture.mjs', 'fixtures/visible-comments.json'], { cwd: root, encoding: 'utf8' });
const failure = execFileSync(process.execPath, ['scripts/analyze-fixture.mjs', 'fixtures/no-visible-comments.json'], { cwd: root, encoding: 'utf8' });
for (const [branch, original, result] of [['success', 'visible-comments.json', success], ['failure', 'no-visible-comments.json', failure]]) {
  if (readFileSync(resolve(root, `fixtures/${branch}-input.json`), 'utf8') !== readFileSync(resolve(root, `fixtures/${original}`), 'utf8')) throw new Error('输入包装副本必须保持原始资料');
  if (readFileSync(resolve(root, `fixtures/${branch}-result.json`), 'utf8') !== result) throw new Error('公开结果必须与实际离线脚本一致');
}
if (!success.includes('版型与尺码') || !success.includes('"frequency": 2') || !failure.includes('不可采集')) throw new Error('fixture 分支验证失败');
console.log('self-test passed: 文件、离线成功样例与无评论失败分支均已验证。');
