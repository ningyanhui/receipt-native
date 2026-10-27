Title: 全网刷屏的 Claude Opus 5.5 一句话出片，完整教程来了！

URL Source: https://zhuanlan.zhihu.com/p/2089616300544993151

Markdown Content:
`Claude Opus 5.5`，一个文本模型，现在会做视频了。

上周 [Anthropic](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Anthropic&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJBbnRocm9waWMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.MShlmOufLQm8G6xi1tceZIzNopmoDOkizZZLXYFYWCY&zhida_source=entity) 发布 `Claude Opus 5.5` 时，只字未提视频的事儿。然而自发布当晚起，网上一波又一波 `Claude Opus 5.5` 生成的动画视频开始疯传，15 秒动效秀场、自带旁白的科普短片、搭配钢琴曲的产品宣传片，甚至还有一个两分半的手绘风 MV。

一周之内，单条视频最高播放量突破 1893 万。[马斯克](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E9%A9%AC%E6%96%AF%E5%85%8B&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLpqazmlq_lhYsiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.RXJETZ2GbH8aAqM6ktQatpyBk26zb5uK_NP1skFeEeI&zhida_source=entity)第一时间吃瓜，「Wow」。

![Image 1](https://picx.zhimg.com/v2-ef7bee94ad7b7450524ec287c35e5187_1440w.jpg)

网友们已经嗨起来了，「一句提示词，一次性出片，[After Effects](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=After+Effects&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJBZnRlciBFZmZlY3RzIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjg0NzU3ODU3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.-AI1jvCqMntJpP27XqgBbWv0DzaasT_xnymsn1PN5zE&zhida_source=entity) 可以卸载了。」

真的假的？

* * *

先说结论。

**一句话出片，是真的**。那句在全网疯传的提示词，确实只有一句话。你把它投喂给 `Claude Opus 5.5`，xHigh 推理等级，几十分钟后你会得到一个带音效的 15 秒动画短片。

但有一个前提。

那些点赞上万、马斯克亲自转发的作品，背后远不只一句话。有人对着电脑讲了 5 分钟，Claude 自己干了 12 个小时；有人写了 9500 字符的提示词，还搭建了 Skill 和示例。

所以，**一句话能出片，但出不了好片。**

`Claude Opus 5.5` 不是视频模型，它不会生成像素。

它生成的是代码。

整个流程可以总结为三步。第一步，`Claude Opus 5.5` 写一个网页动画；第二步，用[无头浏览器](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E6%97%A0%E5%A4%B4%E6%B5%8F%E8%A7%88%E5%99%A8&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLml6DlpLTmtY_op4jlmagiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9._02JQJaZ5moIDnXRfya1icanxyj5p7KdGsCeQ3Rgn2I&zhida_source=entity)（一个没有界面、在后台运行的 Chrome 浏览器）逐帧截图；第三步，由 [FFmpeg](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=FFmpeg&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJGRm1wZWciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.yXmoZix1kPtiB1wn9-x86M3AIlukZAd8ZhrRztvWQtA&zhida_source=entity) 把几千张截图拼接成 MP4 视频。

关键在于第一步里的一个机制。网页中有一个函数名为 `seek(t)`，你给它任意一个时间点，它就能画出那一瞬间的完整画面。浏览器按每秒 30 帧的速度依次调用这个函数、截图、再调用下一个时间点。一段 15 秒的视频就是 450 张截图。因为画面完全由时间参数决定，不依赖系统时钟，所以同一份代码跑多少遍结果都一样。

所有代码都装在一个 index.html 文件里，这就是那些爆火视频背后的神秘魔法。

冷知识，就连配乐都是 `Claude Opus 5.5` 用代码搓出来的。

Claude 自己听不见声音，但它可以用 [Python](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Python&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJQeXRob24iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.VvHbP_s730Hnxz32sAcPhHEAVXi3JI1gHyK-w-p0Pr0&zhida_source=entity) 代码把音符、和弦、音效写成[数学函数](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E6%95%B0%E5%AD%A6%E5%87%BD%E6%95%B0&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLmlbDlrablh73mlbAiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.ex7bYiF6--fklmW3xCghkS6EEEguXgmIfCjYmIsNh60&zhida_source=entity)，再合成为一段完整的配乐。节拍卡点也不在话下。它先用 [numpy](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=numpy&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJudW1weSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI4NDc1Nzg1NywiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.IjVdbyIYqV-J3rNyU4NdXWmLWXlGxBy8RNinXQDvO3g&zhida_source=entity) 分析音轨波形，算出每一拍落在第几毫秒，然后把画面的动作和音效精确地对齐到这些时间点上。所以你听到的每一声「蹦沙卡拉卡」，都是 `Claude Opus 5.5` 计算好的，误差在一帧以内。

## **—开始前，你需要做这些准备**

四样。

*   [Node.js](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Node.js&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJOb2RlLmpzIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjg0NzU3ODU3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.ifSbNGtTxGn-DFyv-DjsBwaawue0HJne30FbqPptPeM&zhida_source=entity)（22 及以上版本）
*   FFmpeg
*   Chrome（安装 [Playwright](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Playwright&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJQbGF5d3JpZ2h0IiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjg0NzU3ODU3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.Pr4BzQNqd0itnPiiS6THrxpGLAGwp_jsXlD--ZHHjjE&zhida_source=entity) 时自带）
*   [Python 3](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Python+3&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJQeXRob24gMyIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI4NDc1Nzg1NywiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.oHPz4wh0pZFn6-YdC13eWUZWlEohKsKlLzqgeVjqEoY&zhida_source=entity)（分析音乐和合成配乐时要用到）

所有这些前置要求让 Agent 帮你安装就好。

然后是 [Claude Code](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Claude+Code&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJDbGF1ZGUgQ29kZSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI4NDc1Nzg1NywiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.oqMLKulRjADP-7-9DRA7aiX-xVHFAEA9FtKlMmw95Fg&zhida_source=entity)。在终端里输入 `/model`，模型选择 `Claude Opus 5.5`。`Claude Opus 5.5` 默认推理等级是 `medium`，但做视频建议调高点。15 秒的片子，`xHigh` 就够了。`max` 也行，但 `max` 容易想太多，很慢。

## **—两个方法任你挑**

### **—[HyperFrames](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=HyperFrames&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJIeXBlckZyYW1lcyIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI4NDc1Nzg1NywiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.HQFpZ_-WQOS3IA4RI5GANfwAK8udOlLk_pxRKP40vpc&zhida_source=entity)（新手推荐）**

HyperFrames 是 [HeyGen](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=HeyGen&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJIZXlHZW4iLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.niCeUMuCsW22aInaOtNQA_qCxucZ7oeV2o3CA-9r1lI&zhida_source=entity)（做数字人视频的那家公司）开源的渲染框架，GitHub 5.58 万 star。核心思路，`Claude Opus 5.5` 负责生成普通网页，HyperFrames 负责逐帧截图、输出 MP4。本地渲染不消耗 HeyGen 额度。

![Image 2](https://pic1.zhimg.com/v2-e2c91875dbbf8aeb12f2b67bf4b73602_1440w.jpg)

一行代码安装，或者让 Agent 帮你搞定。

安装时勾选「Core Skills」就够了。预览命令 `npx hyperframes preview`，渲染命令 `npx hyperframes render --output video.mp4`。

HeyGen 自己分享过一个经验。他们早期试过 [Remotion](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Remotion&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJSZW1vdGlvbiIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI4NDc1Nzg1NywiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.qXFuInc9SbFYXg4qExyFREWnAzCXxjOh50asAJFwZwU&zhida_source=entity)，觉得 React 那条路是对的，但发现框架约束越多，AI 产出就越保守、越重复。换回纯 HTML 之后，创意才回来了。

### **—Remotion（适合长视频）**

Remotion 是一个用 React 写代码做视频的框架，GitHub 6.16 万 star，比 HyperFrames 更早火出圈。它的思路是把视频当成 React 组件来写，每一帧都是帧号的函数，适合需要反复迭代、多人协作的长视频项目。

![Image 3](https://picx.zhimg.com/v2-a22e0f1f9c16832f0664edf871ecbaef_1440w.jpg)

```
npx create-video --yes --blank --no-tailwind my-video
cd my-video && npm install
npx remotion skills add
npm run dev
```

`npm run dev` 启动预览，另开一个终端跑 `claude`。渲染命令 `npx remotion render`。

Remotion 个人及 3 人以下团队免费用。

那你应该选哪个？15 秒 - 1 分钟的短片，HyperFrames 更省事。3 分钟以上的长视频，Remotion 的 React 组件更好维护。

其实还有第三个方法，什么都不安装。`Claude Opus 5.5` 默认会从零写一个 index.html，用 Playwright 逐帧截图，FFmpeg 合成。但安装了[渲染框架](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=2&q=%E6%B8%B2%E6%9F%93%E6%A1%86%E6%9E%B6&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLmuLLmn5PmoYbmnrYiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MiwiemRfdG9rZW4iOm51bGx9.ALnjZOouFSAUO7qae5AFh0LofH2bkiFnCsvTI5kUtBk&zhida_source=entity)后，它能自己预览、检查、纠错，这个反馈循环才是做出高质量视频的关键。

## **—6 个提示词焚诀**

重点来了。

### **—01｜一句话**

`make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out.`

这是用 `Claude Opus 5.5` 做视频最早火出圈的提示词。

它为什么有效？因为「[求职作品集](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E6%B1%82%E8%81%8C%E4%BD%9C%E5%93%81%E9%9B%86&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLmsYLogYzkvZzlk4Hpm4YiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.3gIIInoNZl1_x1fagtCADJUQXAYYJJvZyZh0AKOSevk&zhida_source=entity)」本身就有固定格式，模型知道该怎么展示。15 秒不长不短，正好放得下 6 到 8 个镜头。

**但有一个坑。**

用同一句提示词做出来的视频长得太像了。红黑配米白底，结尾几乎清一色都是「CLAUDE · MOTION DESIGNER」。

![Image 4](https://pic1.zhimg.com/v2-48653067356f388debd3c657554b07d8_1440w.jpg)

### **—02｜加三行秒变品牌宣传片**

```
Make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out.

Make it a video to introduce http://typingmind.com

Use actual product screenshot/logo/assets
Must have music and motion must match the music

Do it like a real professional production video, not like a demo or prototype. Try again, ultracode.
```

品牌素材 Claude 自己会去对应的官网抓取，不需要你提供太多指令。

结尾那句「Try again, ultracode.」也很重要，别漏了。

### **—03｜提供参考视频**

点名一种风格比纯文字描述有效得多，不提供参考视频 `Claude Opus 5.5` 可能就退回默认样式了。

先安装 HyperFrames 或 Remotion，再安装 `21st.dev` 组件库。

![Image 5](https://pic1.zhimg.com/v2-e272b3797a773b92793aca32e29af116_1440w.jpg)

然后你可以把品牌素材和参考视频一股脑发送给 `Claude Opus 5.5`，问它要 3 套[分镜](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E5%88%86%E9%95%9C&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLliIbplZwiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.p2N637HH9j9n1pQ-0hZmFOxqrLcafL-5701ESETzaxQ&zhida_source=entity)方案。选定分镜后先生成每个场景的静态画面，确定了再让画面动起来。

在整个过程中，你都可以像导演一样给模型反馈。

### **—04｜[XML 规格文档](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=XML+%E8%A7%84%E6%A0%BC%E6%96%87%E6%A1%A3&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJYTUwg6KeE5qC85paH5qGjIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjg0NzU3ODU3LCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.CC-yOF2SVrQkX4H7x2uR7ziVqhzrRHFLCpggHS-jOtM&zhida_source=entity)**

提示词，完全不用局限于一段文字，它也可以是一份结构化的 XML 规格文档。

你可以把想要生成的视频拆分为四层内容。第一层**定义输入**，你需要的 UI 状态、配色方案、配乐节拍。第二层**给定视觉方向**，比如一个形状全程不剪切，通过形变和模糊切换内容，光标驱动所有交互，弹簧运动等等。第三层**确定节拍**，每分钟多少拍、几个小节、每一拍画面上都有什么事情发生。第四层**约束渲染**，单个 HTML 文件、分辨率、从 `seek(t)` 计算。

那你还得自学 XML 语言？完全不用。把我上面这段话发给 Agent，让它帮你搞定 XML 规格文档，你只需要负责视频创意。

### **—05｜子智能体团队**

在 `~/.claude/agents` 目录下新建 4 个子智能体，你就能把视频生成的工作安排给不同智能体。一个专门拆解参考视频（用 FFmpeg 抽帧来分析参考视频的节奏和转场），一个负责画分镜，主会话负责搭建场景和渲染视频，最后一个负责审核挑毛病。

这套流程的好处是可以挂机，几个[智能体](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=4&q=%E6%99%BA%E8%83%BD%E4%BD%93&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLmmbrog73kvZMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6NCwiemRfdG9rZW4iOm51bGx9.aNJuXWYP3JDg6yourv_UFXylvRrvInJCGvRxuEwpTn0&zhida_source=entity)轮流挑错改错，睡一觉醒来活儿就干完了。

一位网友用这个方法做了一个黑洞交互实验，`Claude Opus 5.5` 全程工作 5 小时 28 分钟，按 API 价格换算大约 90 美元。

### **—06｜导演脚本**

这可能是最顶级的玩法。

提示词本身变成了一份导演脚本，长度可以达到 9500 字符甚至更多。核心思路是把 Claude Code 当成一整个[影视制作](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E5%BD%B1%E8%A7%86%E5%88%B6%E4%BD%9C&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLlvbHop4bliLbkvZwiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.Np5OkbScAiZEBh7P49v2HH9HmkAcJQh4YEK7DeMCf9g&zhida_source=entity)团队来用。你给它原曲、参考视频和各种 API key（生图、生视频、配音），让它先画[角色设定](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E8%A7%92%E8%89%B2%E8%AE%BE%E5%AE%9A&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLop5LoibLorr7lrpoiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.GiJl1wp2ontzz1cwZAGzYcvDLxs1D94534McPbGSezE&zhida_source=entity)，再用视频模型生成底片，最后用 JavaScript 在底片上重新描绘一遍。

小细节，推荐用 Claude Code CLI。配音可以考虑 [Gemini](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Gemini&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJHZW1pbmkiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.i_QXhhTNQVvuQHiAxT1tcvp64aTs3EVbKNw0kO1n3kE&zhida_source=entity) 3.8 [TTS](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=TTS&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJUVFMiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.xnkP_0nt1_JrytBCuc5ONT0LFGWx25nyE9lFzuvwh8U&zhida_source=entity)，动效用 [Manim](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=Manim&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiJNYW5pbSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI4NDc1Nzg1NywiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.WNpz0mixymG2RHgEtxlO7O4GKPhmGQJ909ZjES68HDo&zhida_source=entity) 或 HyperFrames。

## **—Claude Opus 5.5 是 token [刺客](https://zhida.zhihu.com/search?content_id=284757857&content_type=Article&match_order=1&q=%E5%88%BA%E5%AE%A2&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3OTMyNTc2NjgsInEiOiLliLrlrqIiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyODQ3NTc4NTcsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.eqHMIvRfLaKEGtpxYikW2JqMBg6xNcmBkzMvIfYWGY0&zhida_source=entity)吗**

先说结论：**不便宜，只建议 Claude 订阅用户尝试。**

我自己实测用 `Claude Opus 5.5` 生成了两个 15 秒视频，这是真实消耗。

第一条裸提示词，用 HyperFrames 渲染，换算成 API 总费用 81.77 美元，实际工作时间 2 小时 44 分钟，5383 行代码。

第二条加禁用清单，通过 Three.js 渲染，换算成 API 总费用 102.32 美元，实际工作时间 4 小时 47 分钟，5455 行代码。因为 3D 渲染更复杂，消耗比上个测试大约多 25%。

![Image 6](https://pic4.zhimg.com/v2-28b6b7f4127d27e9d769a46ffd508c2b_1440w.jpg)

两个视频加起来，大约消耗了我本周 Claude Max 20x 额度的 10-15%。

谢谢你能看到这里。我是木易，每天帮你先一步看见 AI。这篇如果有用，顺手**点个赞和在看**，转给身边用 AI 的朋友。想第一时间收到更新，给我**加个星标⭐**。我们明天见。
