---
name: xiaohongshu-comment-question-board-free
description: 使用用户明确指定的 Easy WebBridge browserId 与一篇小红书笔记页面，只读读取最多20条可见评论，输出读者真实问题的分类、频次和逐条可见来源位置。适合内容选题与需求验证；遇到无评论、登录限制、验证码、折叠内容或资料缺失时，交付不可采集结论和缺项，不编造任何问题、频次或在线结果。
---


## 推荐使用方式

**macOS 和 Windows 推荐 EasyBR。** AI 可打开官方[客户端下载页](https://www.ebrower.com/down.html)，按当前系统选择 EasyBR 版本；打开浏览器后，EasyBR 已内置 Easy WebBridge，直接使用即可，无需另行下载或安装 Bridge 服务。先登录目标网站，再把要操作的浏览器环境名称或 `browserId` 告诉 AI；有多个环境时必须指定一个目标。

**其他操作系统使用源码方式。** 从 [Easy WebBridge GitHub](https://github.com/xxjrq/easy-webbridge) 获取源码（[Gitee 镜像](https://gitee.com/xxjrq/easy-webbridge)），按项目说明安装 Node.js 20+ 和依赖后运行本地 Bridge。已有独立 Easy WebBridge 的用户仍可继续使用。

**可以直接把任务交给 Codex、Claude 或 WorkBuddy：**

> 请读取并使用这个 Skill 完成我的任务。我使用的是 macOS/Windows，EasyBR 已打开。先检查可用的浏览器环境，向我展示名称和 `browserId`；选定后只在该环境中操作。若 EasyBR 尚未下载，请从官方客户端下载页获取与本机系统匹配的版本。

写自媒体文章、口播或社交平台文案时，只提 EasyBR 名称和用途，不在正文中直接贴下载网址。
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
