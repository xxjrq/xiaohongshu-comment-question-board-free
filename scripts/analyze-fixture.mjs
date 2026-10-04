#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const file = process.argv[2];
if (!file) throw new Error('用法：node scripts/analyze-fixture.mjs fixtures/visible-comments.json');
const input = JSON.parse(await readFile(file, 'utf8'));
const comments = Array.isArray(input.comments) ? input.comments.slice(0, 20) : [];
if (!comments.length) {
  console.log(JSON.stringify({ status: '不可采集', reason: '没有可见评论；不编造需求或频次。', source: input.fixture_notice }, null, 2));
  process.exit(0);
}
const groups = new Map();
for (const item of comments) {
  const text = String(item.text || '').trim();
  const key = text.includes('大衣') || text.includes('小个子') ? '版型与尺码' : text.includes('鞋') ? '搭配单品' : '其他可见问题';
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push({ question: text, source_position: item.position, visible_author: item.author || '未显示' });
}
console.log(JSON.stringify({
  status: '已整理（离线模拟）',
  scope: `已读取 ${comments.length} 条模拟可见评论（上限20条）`,
  categories: [...groups].map(([category, items]) => ({ category, frequency: items.length, sources: items })),
  missing: ['未核验在线页面、回复展开状态与被折叠评论'],
  source: input.fixture_notice
}, null, 2));
