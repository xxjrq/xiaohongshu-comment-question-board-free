---
name: xiaohongshu-comment-question-board-free
description: 使用用户明确指定的 Easy WebBridge browserId 与一篇小红书笔记页面，只读读取最多20条可见评论，输出读者真实问题的分类、频次和逐条可见来源位置。适合内容选题与需求验证；遇到无评论、登录限制、验证码、折叠内容或资料缺失时，交付不可采集结论和缺项，不编造任何问题、频次或在线结果。
---

# 小红书评论问答需求板

把一篇笔记中**当前可见**的评论，变成可追溯的读者问题需求板。输入为用户指定的笔记 URL 和 `browserId`；结果为最多 20 条评论的主题分类、频次、逐条来源位置与缺项。没有可见评论就输出“不可采集”，不会用猜测补齐。

## 前置依赖

这是浏览器 Skill，需要安装并连接 [Easy WebBridge](https://github.com/xxjrq/easy-webbridge)；GitHub 不可用时使用 [Gitee 备用地址](https://gitee.com/xxjrq/easy-webbridge)。在目标浏览器加载扩展并确认已连接后，用户提供本次要使用的 `browserId`。不记录、不公开 browserId、会话、Cookie 或登录资料。

运行前先阅读用户本机 Easy WebBridge CLI 的帮助：

```bash
node /path/to/easy-webbridge/cli/easy-webbridge.mjs --help
```

## 执行边界

1. 只选择用户指定的一个 `browserId`，不向全部账号广播。
2. 为本次任务建立唯一 session 与标签组；只复用、关闭自己创建的组，绝不接管或关闭已有页面。
3. 进入指定笔记后先用 `snapshot --text-mode page` 读取可见页面文本；每次滚动或导航后立即刷新 refs。只读取网页可见内容，最多保留 20 条评论。
4. 登录、验证码、风控、账号安全验证或无法判断评论是否可见时暂停，标为不可采集或缺项；不绕过平台保护。
5. 默认只读。即使用户授权填充草稿，也绝不点击最终发布或发送按钮。

## 交付格式

```markdown
# 评论问答需求板
- 采集状态：已整理 / 不可采集
- 范围：可见评论 N/20 条；笔记：<用户提供页面>

| 问题分类 | 频次 | 逐条来源位置 |
| --- | ---: | --- |
| 版型与尺码 | 2 | 评论区第1条：…；评论区第3条：… |

## 缺项与限制
- 未显示评论：…
- 未展开/登录限制：…
```

每条来源必须保留页面上的可见顺序位置和原始可见提问；不要把样例、推测或不可见回复写成采集结果。

## 离线自检

下面的 fixtures 是离线页面资料模拟，专门验证成功与“没有可见评论”分支，不是在线采集测试：

```bash
node scripts/self-test.mjs
node scripts/analyze-fixture.mjs fixtures/visible-comments.json
node scripts/analyze-fixture.mjs fixtures/no-visible-comments.json
```

## 参考与许可

业务适配仅参考 [OpenCLI 小红书 adapter](https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/browser/xiaohongshu.md) 的公开用途说明；本仓库说明、流程与示例均为原创，未复制其实现或源码。许可证见 [LICENSE](LICENSE)。
