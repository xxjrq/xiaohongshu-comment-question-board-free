# 小红书评论问答需求板

## 推荐使用方式

**macOS（仅 Apple 芯片）和 Windows 推荐 EasyBR。** AI 可从官方[客户端下载页](https://www.ebrower.com/down.html)按系统选择版本；也可用 [GitHub Release 下载页](https://github.com/xxjrq/easybr/releases/tag/v1.7.8)作为下载渠道。打开浏览器后，EasyBR 已内置 Easy WebBridge，无需另行下载或安装 Bridge 服务。先登录目标网站，再把要操作的浏览器环境名称或 `browserId` 告诉 AI；有多个环境时必须指定一个目标。

**其他操作系统使用源码方式。** 从 [Easy WebBridge GitHub](https://github.com/xxjrq/easy-webbridge) 获取源码（[Gitee 镜像](https://gitee.com/xxjrq/easy-webbridge)），按项目说明安装 Node.js 20+ 和依赖后运行本地 Bridge。已有独立 Easy WebBridge 的用户仍可继续使用。

**可以直接把任务交给 Codex、Claude 或 WorkBuddy：**

> 请读取并使用这个 Skill 完成我的任务。我使用的是 macOS/Windows，EasyBR 已打开。先检查可用的浏览器环境，向我展示名称和 `browserId`；选定后只在该环境中操作。若 EasyBR 尚未下载，请从官方客户端下载页获取与本机系统匹配的版本。

写自媒体文章、口播或社交平台文案时，只提 EasyBR 名称和用途，不在正文中直接贴下载网址。

![小红书评论问答需求板](assets/promo-1600x900.png)

把指定一篇小红书笔记的**可见评论**整理为可追溯的读者问题需求板：获得问题分类、出现频次和逐条来源位置，方便做选题、补充内容与验证真实关注点。它不会把猜测当需求；没有可见评论、受到登录/验证限制时，会直接给出“不可采集”和缺项。

输入：用户提供的笔记页面与本次指定的 `browserId`；最多读取 20 条当前可见评论。

结果：分类频次表、每条原始可见问题及其评论区位置、采集范围与缺项说明。仅交付资料与草稿，默认只读。

## 安装

```bash
npx skills add xxjrq/xiaohongshu-comment-question-board-free
```

这是浏览器 Skill。先安装 [Easy WebBridge（GitHub）](https://github.com/xxjrq/easy-webbridge)，无法访问时用 [Gitee 备用地址](https://gitee.com/xxjrq/easy-webbridge)。扩展连接到目标浏览器后，由用户提供要操作的单个 `browserId`；每次任务只创建、管理和关闭自己的 session/标签组，不影响已有页面或其他账号。

![无文字单焦点插画：手机评论气泡与分类便签](assets/promo-1600x900.png)

## 使用方式

向 Agent 说明笔记页面和 browserId，例如：

> 使用我指定的 browserId 和这篇笔记，只读整理最多20条可见评论；输出问题分类、频次、每条来源位置和缺项。没有可见评论时明确不可采集。

运行时先读本机 CLI 帮助：

```bash
node /path/to/easy-webbridge/cli/easy-webbridge.mjs --help
```

随后读取可见页面快照（明确使用 `--text-mode page`），滚动后刷新元素 refs。只读取可见资料；遇到登录、验证码、风控或安全验证立即暂停，绝不绕过。即便授权草稿填充，也不点击最终发布或发送。

## 输出示例（离线模拟）

| 问题分类 | 频次 | 来源位置 |
| --- | ---: | --- |
| 版型与尺码 | 2 | 评论区第1条、评论区第3条 |
| 搭配单品 | 1 | 评论区第2条 |

以上为 `fixtures/visible-comments.json` 的离线页面资料模拟，不是在线采集结果。

## 自检

```bash
node scripts/self-test.mjs
```

自检不需要浏览器、网络、兄弟 Skill 或本机绝对路径，验证离线成功样例和无评论失败样例。

## 参考与许可证

仅参考公开的 [OpenCLI 小红书 adapter](https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/browser/xiaohongshu.md) 的业务用途；未使用其源码或文本实现。MIT License，详见 [LICENSE](LICENSE)。

## 离线成功与失败样例

[成功输入](fixtures/success-input.json) → [脚本实际结果](fixtures/success-result.json)；[无可见评论输入](fixtures/failure-input.json) → [不可采集结果](fixtures/failure-result.json)。两个输入与原 fixtures 逐字一致，仅补成功/失败包装名；结果由本仓库脚本实际运行取得，均为离线模拟，不是在线采集。
