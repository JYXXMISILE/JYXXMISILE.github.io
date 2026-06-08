# Personal Archive

一个可以直接托管在 GitHub Pages 上的静态个人网站。页面采用暗色日系文艺博客风格，首屏带废墟城市原画背景和开屏打字动画，用来发布个人日志和艺术作品。

## 本地预览

在这个文件夹运行：

```bash
python3 -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

## 日常维护

- 修改站点名称、个人简介、联系方式：编辑 `site.json`
- 发布一篇新日志：在 `posts.json` 顶部新增一条记录
- 发布一个新作品：把图片直接放在主目录，再在 `artworks.json` 新增一条记录
- 如果作品暂时没有图片，把 `image` 留空即可，页面会显示占位视觉

## GitHub Pages 部署

1. 把本文件夹推送到 GitHub 仓库。
2. 在仓库设置里进入 `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。
5. 保存后等待 GitHub 生成访问地址。

## 内容格式示例

日志：

```json
{
  "title": "标题",
  "date": "2026-06-08",
  "category": "Note",
  "excerpt": "列表里的摘要",
  "body": ["第一段", "第二段"],
  "tags": ["创作", "日志"]
}
```

作品：

```json
{
  "title": "作品名",
  "year": "2026",
  "medium": "Photography",
  "size": "Series",
  "image": "your-image.jpg",
  "summary": "作品卡片上的短说明",
  "statement": "打开详情后显示的作品阐释"
}
```
