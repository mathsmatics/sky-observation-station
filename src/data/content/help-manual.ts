export type HelpBlock =
  | { type: "paragraph"; html: string }
  | { type: "subheading"; html: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "formula"; html: string }
  | { type: "code"; text: string }
  | { type: "note"; html: string }
  | { type: "warning"; html: string };

export interface HelpSection { id: string; title: string; blocks: HelpBlock[]; }
export interface HelpManual { title: string; sections: HelpSection[]; }

/**
 * 真实星空观测台 5.5.7 结构化帮助文档。
 * 每章末尾包含外部参考链接和对应源码路径；正文按当前代码行为编写。
 */
export const HELP_MANUAL_ZH: HelpManual = {
  "title": "真实星空观测台 5.5.7 完整说明书",
  "sections": [
    {
      "id": "quick-start",
      "title": "1. 快速使用与界面总览",
      "blocks": [
        {
          "type": "paragraph",
          "html": "真实星空观测台是一个完全本地运行的浏览器天文馆。5.5.7 的最小运行包只需要根目录 <code>index.html</code> 与 <code>assets/app.js</code>、<code>assets/app.css</code>；源码包额外包含 TypeScript、数据分片和维护文档。直接双击适合普通使用，本地服务器更适合测试定位权限、缓存和开发者工具。"
        },
        {
          "type": "subheading",
          "html": "第一次使用的推荐顺序"
        },
        {
          "type": "list",
          "items": [
            "打开页面后先确认加载遮罩消失、星点出现。若长时间没有星图，先打开浏览器控制台检查资源或脚本错误。",
            "在“观测地点”搜索城市，或输入纬度、经度；确认地点栏和时区已同步。",
            "设置观测时间。第一次学习建议先点“回到现在”，再用 ±1 小时、±1 天观察变化。",
            "选择“地平坐标 + Airy/Orthographic”理解当地天空；选择“赤道坐标 + Hammer/Winkel Tripel”理解全天星座分布。",
            "按需要打开西方星座、中国星官或双体系；先保持标签较少，再逐渐增加星名和传统天区。",
            "搜索天狼星、北极星、M 31 或月球，观察搜索十字与信息浮窗。",
            "出现异常时打开 DBG，并复制完整诊断文字，而不是只截取一行。"
          ]
        },
        {
          "type": "subheading",
          "html": "界面分区"
        },
        {
          "type": "table",
          "headers": [
            "区域",
            "内容",
            "何时使用",
            "是否保存"
          ],
          "rows": [
            [
              "顶部信息区",
              "项目名、版本、地点和时间摘要",
              "快速确认当前模拟条件",
              "地点与时间本身会保存"
            ],
            [
              "左侧菜单",
              "视图、搜索、文化、地点、时间、图层、状态",
              "绝大多数操作入口",
              "折叠状态和多数控件会保存"
            ],
            [
              "星图主画布",
              "恒星、图层、动态天体、搜索/选择标记",
              "拖动、缩放、点击对象",
              "每个投影/坐标组合保存视角"
            ],
            [
              "Panel 按钮",
              "展开或收起侧栏",
              "需要更大星图区时",
              "保存"
            ],
            [
              "DBG 面板",
              "尺寸、坐标框架、刷新、回滚、模型状态",
              "排错或性能分析",
              "开关状态保存"
            ],
            [
              "重置按钮",
              "清除本项目 localStorage 并恢复默认",
              "旧状态污染或版本升级异常",
              "执行后重新生成默认状态"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "键盘交互小技巧"
        },
        {
          "type": "list",
          "items": [
            "方向键平移星图；长按时由动画循环逐帧推进，而不是依赖浏览器重复 keydown。",
            "时间输入框中，左右键切换年/月/日/时/分字段；上下键按真实日历加减；Enter 提交，Esc 取消当前草稿或移出焦点。",
            "搜索候选中可用上下键选择、Enter 确认、Esc 关闭。",
            "键盘操作前若焦点仍在文本框，方向键会优先编辑文本字段；先点击星图区或按 Esc 再平移。"
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>README.md</code>（项目 README）；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Pointer events</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：requestAnimationFrame</a>；<code>index.html</code>（项目实现）；<code>src/ui/app-shell.ts</code>（项目实现）；<code>src/ui/event-bindings.ts</code>（项目实现）；<code>src/sky/keyboard-pan.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "menu-map",
      "title": "2. 左侧菜单的组织逻辑",
      "blocks": [
        {
          "type": "paragraph",
          "html": "左侧菜单不是按代码模块排列，而是按用户问题排列：先决定“怎么看”，再决定“找什么、显示哪套文化、从哪里和什么时候看”，最后决定“用什么坐标与投影、画哪些图层”。理解这张菜单地图，比逐个背按钮更有效。"
        },
        {
          "type": "table",
          "headers": [
            "菜单组",
            "它回答的问题",
            "典型操作"
          ],
          "rows": [
            [
              "视图控制",
              "怎么看得更近、更大、更整齐？",
              "缩放、重置、全屏、字体缩放、Panel"
            ],
            [
              "搜索",
              "要找什么？",
              "恒星、星座、星官、太阳系天体、DSO、城市"
            ],
            [
              "语言与星空体系",
              "用什么语言和文化语义阅读？",
              "中文/英文、西方/中国/双体系"
            ],
            [
              "观测地点",
              "站在哪里看？",
              "城市、经纬度、IANA 时区、定位"
            ],
            [
              "观测时间",
              "什么时候看？",
              "当地时间输入、快捷跳转、播放"
            ],
            [
              "视图与投影",
              "用哪套坐标轴和展开方法？",
              "地平/赤道/黄道/银河，14 种投影"
            ],
            [
              "显示设置",
              "哪些图层画出来？",
              "星名、连线、边界、网格、银河、DSO、行星"
            ],
            [
              "天体信息",
              "当前选中了什么？",
              "名称、目录号、坐标、物理和文化说明"
            ],
            [
              "状态与 Debug",
              "系统实际按什么运行？",
              "尺寸、框架、刷新耗时、失败回滚"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "保存规则的总体原则"
        },
        {
          "type": "paragraph",
          "html": "稳定的用户偏好通常保存：地点、时区、时间、语言、文化体系、投影、坐标视角、图层、星等阈值、字体和折叠状态。瞬时交互通常不保存：鼠标悬停、拖动中的姿态、候选时间草稿、当前按键状态、临时错误堆栈。这样刷新后能恢复工作环境，又不会把半次操作带到下一次启动。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>README.md</code>（项目 README）；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：localStorage</a>；<code>src/config.ts</code>（项目实现）；<code>src/ui/controls.ts</code>（项目实现）；<code>src/state/storage.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "view-controls",
      "title": "3. 视图控制、缩放、拖动与移动端操作",
      "blocks": [
        {
          "type": "subheading",
          "html": "缩放与星等阈值是两回事"
        },
        {
          "type": "paragraph",
          "html": "缩放改变视场比例：同一批星在屏幕上被放大，局部结构更容易看清。恒星星等阈值决定绘制到多暗的星；把阈值从 5.5 调到 6.5 会增加星点数量，但不等于把相机放大。星名密度又是第三个独立概念，它控制多少恒星名字有资格出现。"
        },
        {
          "type": "subheading",
          "html": "鼠标、触摸板与触摸屏"
        },
        {
          "type": "list",
          "items": [
            "滚轮缩放以光标附近为视觉中心，适合保留正在研究的对象。",
            "按住并拖动改变视图中心；开启天极中轴约束时使用受限欧拉式拖动，关闭时使用四元数自由拖动。",
            "触摸板双指滚动通常被浏览器转换为 wheel；不同系统灵敏度不同，建议小幅连续操作。",
            "手机触摸通过 Pointer Events 统一处理。页面要区分短距离点击与超过 dragThreshold 的拖动，避免点星时误移动。"
          ]
        },
        {
          "type": "subheading",
          "html": "Panel、全屏和字体缩放为什么会触发 resize"
        },
        {
          "type": "paragraph",
          "html": "收起侧栏或进入全屏会改变星图区的 CSS 尺寸。项目重新计算投影天然长宽比、可用视口、DPR 和应用层 mapScale，再同步 map、canvas 与 svg。A+/A− 不只是改文字，还会改变侧栏宽度和控件高度，因此也必须重新测量星图区。"
        },
        {
          "type": "subheading",
          "html": "重置视图"
        },
        {
          "type": "paragraph",
          "html": "重置不是清空所有设置，而是把当前“坐标视角 + 投影”恢复到配置中的默认中心、roll 与 mapScale。地点、时间、语言和图层保持不变。若旧版本保存了错误 center/roll，应使用全局重置清除 localStorage，而不是反复点击视图重置。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Pointer events</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：ResizeObserver</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/sky/pointer-interactions.ts</code>（项目实现）；<code>src/sky/renderer.ts</code>（项目实现）；<code>src/sky/view-mode-switching.ts</code>（项目实现）；<code>src/config.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "search",
      "title": "4. 搜索恒星、星座、星官、行星、深空天体与城市",
      "blocks": [
        {
          "type": "paragraph",
          "html": "天体搜索和城市搜索是两套索引。城市搜索改变观测者位置；天体搜索只改变星图视角和选中对象。输入相同词时，先确认自己使用的是哪个框。"
        },
        {
          "type": "table",
          "headers": [
            "对象类型",
            "可输入示例",
            "定位结果",
            "注意"
          ],
          "rows": [
            [
              "恒星",
              "Sirius、天狼星、Vega、HIP 32349、α CMa",
              "定位具体星点",
              "专名、Bayer、Flamsteed 和目录号可能指同一颗星"
            ],
            [
              "西方星座",
              "Orion、猎户座、Ori",
              "定位星座标签或代表中心",
              "现代星座是天区；连线只是识图图案"
            ],
            [
              "中国星官",
              "天狼、弧矢、天田、紫微垣",
              "定位星官标签中心",
              "星官不是西方星座翻译，一个星官可跨现代星座"
            ],
            [
              "太阳系天体",
              "太阳、Moon、Mars、木星",
              "按当前时间计算位置后定位",
              "位置随时间变化，因此候选动态生成"
            ],
            [
              "深空天体",
              "M 31、C 14、NGC 224、Andromeda Galaxy",
              "定位亮 DSO 点",
              "多目录编号和别名可能指同一对象"
            ],
            [
              "城市",
              "北京、London、Sydney",
              "更新经纬度和时区",
              "城市只是预设，可继续手动微调坐标"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "为什么搜索到不等于一定“肉眼明显”"
        },
        {
          "type": "paragraph",
          "html": "搜索索引可包含名称表中的对象，但显示还受图层开关、当前视场、星等/名称阈值和对象类型影响。深空目标尤其如此：程序画的是方向点和标签，不是曝光照片；M 33 即使被定位，在城市天空也可能极难肉眼看到。"
        },
        {
          "type": "subheading",
          "html": "默认候选与归一化"
        },
        {
          "type": "paragraph",
          "html": "恒星、深空、星座和星官的静态候选会按语言和文化模式缓存；太阳系对象每次搜索时按当前时刻临时加入。输入会统一大小写、空格和常见编号格式，例如 <code>M31</code>、<code>M 31</code> 应尽量归一为同一候选。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iau.org/WG280/WG280/Home.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU 恒星命名工作组</a>；<a href=\"https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA/Hubble：Messier 目录与历史</a>；<a href=\"https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-caldwell-catalog/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA/Hubble：Caldwell 目录</a>；<a href=\"https://dc.zah.uni-heidelberg.de/openngc/q/web/form\" target=\"_blank\" rel=\"noopener noreferrer\">GAVO/OpenNGC：NGC/IC 开放数据库</a>；<code>src/data/object-search-index.ts</code>（项目实现）；<code>src/ui/object-search.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "language-culture",
      "title": "5. 语言与星空体系：UI 文案不等于天空文化",
      "blocks": [
        {
          "type": "paragraph",
          "html": "“语言”控制按钮、状态、对象名称优先字段和说明文字；“星空体系”控制显示西方星座、中国星官或两者。把界面切成英文不会自动把中国星官关闭；把体系切成中国也不会改变数学坐标。"
        },
        {
          "type": "subheading",
          "html": "现代 IAU 星座"
        },
        {
          "type": "paragraph",
          "html": "IAU 的 88 个星座是覆盖全天的正式天区，每个方向都属于某个星座。现代边界在 20 世纪标准化，用于天体归属和命名。星座连线没有同等法律地位：不同星图可以选不同亮星组成识图图案。"
        },
        {
          "type": "subheading",
          "html": "中国星官"
        },
        {
          "type": "paragraph",
          "html": "中国星官是传统星组与制度化天空意象。三垣描绘帝廷、官署和市场；二十八宿沿月道附近组织四象；其他星官涉及道路、田地、军市、器具、官员、动物与祭祀。它们不是把 Orion 翻译成“参宿”，而是在同一批恒星上建立另一套分组和意义。"
        },
        {
          "type": "subheading",
          "html": "双体系显示"
        },
        {
          "type": "paragraph",
          "html": "两套体系同时打开时，共线段可能在屏幕空间做轻微双轨偏移，目的是让两套线都可辨识；真实天球坐标没有被移动。标签密集时应降低星名或关闭部分边界，避免误以为重叠文字是数据错误。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iau.org/Iau/Science/What-we-do/The-Constellations.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU：88 个现代星座与官方边界</a>；<a href=\"https://hk.space.museum/sc/web/spm/resources/teachers-corner/constellations-and-myths/glossary-of-chinese-star-regions-asterisms-and-star-names.html\" target=\"_blank\" rel=\"noopener noreferrer\">香港太空馆：中国星区、星官及星名英译表</a>；<a href=\"https://idp.bl.uk/learning/chinese-astronomy/articles/the-chinese-sky/the-regions-of-the-sky/\" target=\"_blank\" rel=\"noopener noreferrer\">国际敦煌项目：中国天空区域</a>；<code>src/ui/i18n.ts</code>（项目实现）；<code>src/sky/culture-overlays.ts</code>（项目实现）；<code>src/data/culture-notes.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "observer-timezone",
      "title": "6. 观测地点、经纬度与 IANA 时区",
      "blocks": [
        {
          "type": "subheading",
          "html": "经纬度符号"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "正值",
            "负值",
            "影响"
          ],
          "rows": [
            [
              "纬度",
              "北纬",
              "南纬",
              "决定天极高度、可见天区和天体最大高度"
            ],
            [
              "经度",
              "东经",
              "西经",
              "决定地方恒星时与当地子午线"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "地点改变的是“从地球表面哪里看”。因此它会改变 Alt/Az、地平线、天顶方向和地平视角相机；不应让赤道、黄道或银河固定背景相对恒星发生任意漂移。"
        },
        {
          "type": "subheading",
          "html": "为什么保存 IANA 时区，而不是只保存 UTC+8"
        },
        {
          "type": "paragraph",
          "html": "固定偏移只描述某一刻相差几小时，无法表达夏令时、历史规则修改和地区差异。<code>Europe/London</code> 能按日期决定 GMT/BST；<code>Asia/Shanghai</code> 在很早年代可能采用地方平太阳时，出现非整小时偏移。项目用经纬度推断 IANA 区域，再用日期时间库把用户当地时间转换为 UTC 瞬时。"
        },
        {
          "type": "subheading",
          "html": "城市搜索与手动坐标"
        },
        {
          "type": "list",
          "items": [
            "选择城市会同时填写名称、经纬度和时区。",
            "手动修改经纬度后，项目尝试重新匹配时区；边界附近可能和用户行政认知不同，因为时区多边形是技术数据。",
            "“使用我的位置”依赖浏览器权限和安全上下文；file:// 下可能被限制，本地服务器通常更可靠。",
            "更换地点时保持同一个 UTC 瞬时，界面当地时间随新区转换；不要把旧地点钟表时间当成新地点同名钟表时间。"
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iana.org/time-zones\" target=\"_blank\" rel=\"noopener noreferrer\">IANA 时区数据库</a>；<a href=\"https://www.iana.org/time-zones/theory\" target=\"_blank\" rel=\"noopener noreferrer\">IANA tzdb 理论与命名原则</a>；<a href=\"https://aa.usno.navy.mil/faq/alt_az\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：赤道坐标转高度方位</a>；<a href=\"https://moment.github.io/luxon/\" target=\"_blank\" rel=\"noopener noreferrer\">Luxon 日期时间库</a>；<code>src/time/observer-location.ts</code>（项目实现）；<code>src/astronomy/timezone.ts</code>（项目实现）；<code>src/data/cities.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "time-input",
      "title": "7. 时间输入、播放、历法校验与失败回滚",
      "blocks": [
        {
          "type": "subheading",
          "html": "分段输入器"
        },
        {
          "type": "paragraph",
          "html": "时间框看起来是一行，内部是年、月、日、时、分五个字段。点击字段后第一次数字输入替换整个字段；左右键移动字段；上下键按日历单位加减并正确处理月长、闰年和跨年。负年份表示公元前，界面可显示为 BC，但内部必须明确所用的天文年编号或历史纪年转换。"
        },
        {
          "type": "subheading",
          "html": "提交链路"
        },
        {
          "type": "code",
          "text": "候选本地时间\n  → 检查字段范围与真实日历日期\n  → 按观测地 IANA 时区解析\n  → 转换为 UTC 瞬时\n  → 尝试更新太阳系位置、地平相机与星图\n  → 成功：写入 last valid instant 并保存\n  → 失败：恢复旧 instant / 旧 UI，记录 rollback 与错误原因"
        },
        {
          "type": "paragraph",
          "html": "失败回滚不是“掩盖错误”，而是保护稳定状态。若候选时间超出库支持范围、时区解析失败或渲染抛错，不能让半更新状态污染后续操作。Debug 应区分普通 fallback、已恢复 rollback 和 rollback 本身失败。"
        },
        {
          "type": "subheading",
          "html": "快捷跳转与播放"
        },
        {
          "type": "list",
          "items": [
            "±1 小时用于看日周运动；±1 天比较同一钟表时间的恒星提前；±1 月观察季节星空。",
            "任意步长可选择分钟、小时、天、月或年；大步长越大，太阳系近似误差越需要谨慎。",
            "播放速度表示每秒模拟时间推进量。长时间播放应合并同一动画帧内的更新，避免 keydown/定时器堆积重绘。",
            "用户输入的是当地时间，内部天文计算通常使用 UTC/儒略日；显示时再转回当地时间。"
          ]
        },
        {
          "type": "warning",
          "html": "公元前、格里高利历推算、历史地方时与专业古天文历法不是同一问题。本项目采用浏览器/日期库能表达的推算规则，不承诺复原各文明当时实际使用的历法。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iana.org/time-zones\" target=\"_blank\" rel=\"noopener noreferrer\">IANA 时区数据库</a>；<a href=\"https://moment.github.io/luxon/\" target=\"_blank\" rel=\"noopener noreferrer\">Luxon 日期时间库</a>；<a href=\"https://aa.usno.navy.mil/faq/GAST\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：近似恒星时算法</a>；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<code>src/ui/time-fields.ts</code>（项目实现）；<code>src/time/time-input-actions.ts</code>（项目实现）；<code>src/astronomy/time.ts</code>（项目实现）；<code>src/runtime/app-animation.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "layers",
      "title": "8. 图层显示设置逐项说明",
      "blocks": [
        {
          "type": "paragraph",
          "html": "图层开关决定“画什么”，不改变天体本身的坐标。为了识图，可以打开多层；为了观测准备，往往需要关闭部分文化和边界图层，让天空更接近肉眼视觉。"
        },
        {
          "type": "table",
          "headers": [
            "设置",
            "打开后增加什么",
            "适合场景",
            "常见误解"
          ],
          "rows": [
            [
              "恒星星等阈值",
              "更暗的恒星点",
              "模拟肉眼极限、比较星场密度",
              "不是缩放，也不保证城市中可见"
            ],
            [
              "重要恒星名/星名密度",
              "更多恒星文字标签",
              "认星和命名学习",
              "文字阈值和星点阈值分开"
            ],
            [
              "星座线/星座名",
              "西方识图图案和标签",
              "学习 88 星座",
              "连线不是 IAU 边界"
            ],
            [
              "星官线/星官名",
              "中国传统星组和标签",
              "学习三垣二十八宿",
              "不是西方星座翻译"
            ],
            [
              "传统天区/边界",
              "三垣、四象、宿区、战场主题示意",
              "文化结构比较",
              "不是现代法定边界"
            ],
            [
              "IAU 边界",
              "现代星座全天分区线",
              "确认天体属于哪个星座",
              "边界线不是神话图案"
            ],
            [
              "银河",
              "多边形近似的银河带",
              "观察银河与银道坐标关系",
              "不是照片或实时亮度"
            ],
            [
              "黄道",
              "太阳周年路径参考大圆",
              "理解行星聚集区",
              "不是每天随太阳重新画出的尾迹"
            ],
            [
              "赤道网/天赤道",
              "赤经赤纬参考",
              "坐标教学",
              "地平视角下会随时间转"
            ],
            [
              "地平线/地平网",
              "Alt=0 与高度/方位网",
              "当地找方位",
              "不含山脉建筑遮挡"
            ],
            [
              "太阳/月亮/行星",
              "动态天体符号、名称和月相盘",
              "日期与黄道教学",
              "轻量模型，不是专业星历"
            ],
            [
              "亮深空天体",
              "星团、星云、星系等点位",
              "双筒镜/望远镜目标规划",
              "独立 DSO 层，不受恒星阈值控制"
            ]
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://github.com/ofrohn/d3-celestial\" target=\"_blank\" rel=\"noopener noreferrer\">D3-Celestial 项目</a>；<a href=\"https://www.iau.org/Iau/Science/What-we-do/The-Constellations.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU：88 个现代星座与官方边界</a>；<a href=\"https://science.nasa.gov/solar-system/skywatching/planetary-alignments-and-planet-parades/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：行星与黄道附近的视运动</a>；<a href=\"https://dc.zah.uni-heidelberg.de/openngc/q/web/form\" target=\"_blank\" rel=\"noopener noreferrer\">GAVO/OpenNGC：NGC/IC 开放数据库</a>；<code>src/sky/layers.ts</code>（项目实现）；<code>src/sky/celestial-display.ts</code>（项目实现）；<code>src/sky/reference-overlays.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "object-info",
      "title": "9. 点击、信息浮窗、目录字段与复制信息",
      "blocks": [
        {
          "type": "subheading",
          "html": "什么情况下显示"
        },
        {
          "type": "paragraph",
          "html": "点击真正命中的恒星、太阳、月亮、行星、亮深空天体、星座标签或星官标签时，显示选择十字和信息浮窗。点击空白处只清除旧选择，不显示坐标浮窗，也不留下十字。这一行为以当前 5.5.7 代码为准。"
        },
        {
          "type": "subheading",
          "html": "常见字段"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "解释"
          ],
          "rows": [
            [
              "RA / Dec",
              "当前显示链路使用的赤经/赤纬；RA 常以时分秒，Dec 以角度表示"
            ],
            [
              "Alt / Az",
              "当前地点与时刻的高度角/方位角；方位通常从北向东增加"
            ],
            [
              "mag",
              "视星等；数值越小越亮"
            ],
            [
              "B−V",
              "蓝光与可见光星等差，近似反映颜色/温度"
            ],
            [
              "spectral",
              "O/B/A/F/G/K/M 等光谱型及可能的光度级"
            ],
            [
              "HIP / Gaia / HD / HR",
              "不同巡天或星表的唯一/常用编号"
            ],
            [
              "Bayer / Flamsteed",
              "希腊字母+星座属格、数字+星座的传统标识"
            ],
            [
              "desig / catalog / sourceCatalog",
              "DSO 的主编号、目录体系和数据来源"
            ],
            [
              "type / morph",
              "深空对象类别与星系形态等"
            ],
            [
              "dim",
              "目录中的角大小参考，不等于屏幕符号大小"
            ],
            [
              "aliases",
              "Messier、Caldwell、NGC/IC 和常用名等交叉编号"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "文化与复制"
        },
        {
          "type": "paragraph",
          "html": "文化说明是可选增强：有条目就显示来源、含义和关系，没有条目不影响天文数据。浮窗位于控件上层，文字可选择；复制按钮优先使用 Clipboard API，权限受限时应回退到选中文本或 textarea 复制。复制内容适合发给维护者分析，也可用于学习笔记。"
        },
        {
          "type": "subheading",
          "html": "Hipparcos 与 Gaia"
        },
        {
          "type": "paragraph",
          "html": "Hipparcos 是首个专门进行空间天体测量的任务，产生高精度主目录；Gaia 将天体测量扩展到接近二十亿颗恒星和其他对象。项目中的 HIP/Gaia 字段是识别层，不表示当前页面加载了完整 Gaia 数据库。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.esa.int/Science_Exploration/Space_Science/Hipparcos_overview\" target=\"_blank\" rel=\"noopener noreferrer\">ESA：Hipparcos 任务概览</a>；<a href=\"https://www.esa.int/content/view/full/416066\" target=\"_blank\" rel=\"noopener noreferrer\">ESA：Gaia 任务与数据规模</a>；<a href=\"https://www.iau.org/WG280/WG280/Home.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU 恒星命名工作组</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Clipboard.writeText</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/user-select\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：user-select</a>；<code>src/sky/object-picking.ts</code>（项目实现）；<code>src/ui/object-info.ts</code>（项目实现）；<code>src/data/culture-notes.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "celestial-sphere",
      "title": "10. 天球模型：方向地图，不是宇宙壳层",
      "blocks": [
        {
          "type": "paragraph",
          "html": "天球是把观测者包在中心的假想单位球。恒星、行星和深空对象的真实距离差异极大，但星图首先关心“朝哪个方向看”，所以把方向投到球面。星图更像把站在地球上看到的所有方向贴在球上，而不是按物理距离绘制的银河系地图。"
        },
        {
          "type": "subheading",
          "html": "角位置与物理距离"
        },
        {
          "type": "list",
          "items": [
            "两个对象在图上相隔 5°，只表示视线夹角，不说明它们在空间中相距多远。",
            "同一视线附近的恒星可能一个很近、一个很远；深空星系即使图标相邻，物理距离也可相差数亿光年。",
            "星座图案利用投影后的方向关系，成员通常没有共同物理结构。",
            "天体角大小和星图符号大小也不同：程序为可见性放大星点和行星符号。"
          ]
        },
        {
          "type": "subheading",
          "html": "大圆、小圆与天球基本点"
        },
        {
          "type": "paragraph",
          "html": "通过球心的平面与天球相交得到大圆，例如天赤道、黄道、地平圈；不通过球心的纬圈通常是小圆。天顶、天底、天极、春分点等是不同参考系定义的关键方向。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-2/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：天球与参考系统</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/astronomy/coordinates.ts</code>（项目实现）；<code>src/sky/celestial-view.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "vectors-rotation",
      "title": "11. 球面坐标、三维单位向量与旋转",
      "blocks": [
        {
          "type": "paragraph",
          "html": "直接在经纬度上加减容易遇到 ±180° 接缝和极点奇异。更稳健的方法是先把球面经纬度转换成三维单位向量，进行旋转，再转回经纬度。很多“赤道转黄道、自由拖动、岁差”的本质都是换一组三维坐标轴。"
        },
        {
          "type": "formula",
          "html": "<code>x = cos φ · cos λ</code><br><code>y = cos φ · sin λ</code><br><code>z = sin φ</code>"
        },
        {
          "type": "paragraph",
          "html": "这里 λ 是经向角（例如赤经、黄经或银经），φ 是纬向角（赤纬、黄纬或银纬）。向量长度为 1，只保存方向。逆变换可用 <code>λ = atan2(y,x)</code>、<code>φ = asin(z)</code>。"
        },
        {
          "type": "subheading",
          "html": "旋转矩阵与四元数"
        },
        {
          "type": "paragraph",
          "html": "固定坐标系转换常用 3×3 旋转矩阵；连续交互旋转可用单位四元数。矩阵适合明确“从坐标轴 A 到 B”的线性变换，四元数适合组合小旋转、避免欧拉角顺序歧义。无论用哪种表示，最后都要归一化并把角度包装到稳定范围。"
        },
        {
          "type": "code",
          "text": "coord → unitVector\nunitVector → matrix/quaternion rotation\nrotatedVector → atan2/asin → newCoord\nnormalize longitude; clamp latitude"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-2/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：天球与参考系统</a>；<a href=\"https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/MATLAB/req/frames.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL NAIF：参考框架系统</a>；<a href=\"https://ntrs.nasa.gov/citations/19990110711\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：姿态表示与万向节死锁</a>；<code>src/astronomy/coordinates.ts</code>（项目实现）；<code>src/sky/quaternion.ts</code>（项目实现）；<code>src/sky/rotation-controller.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "horizontal-coordinate",
      "title": "12. 地平坐标：你脚下这一刻的天空",
      "blocks": [
        {
          "type": "paragraph",
          "html": "地平坐标以观测者为中心。高度角 Alt 从地平线向上为正，天顶是 +90°，天底是 −90°；方位角 Az 在常见天文学约定中从真北 0° 起，向东增加到 90°、南 180°、西 270°。必须以项目和所用库的内部符号为准，不能只看变量名猜方向。"
        },
        {
          "type": "table",
          "headers": [
            "概念",
            "方向/数值",
            "实际意义"
          ],
          "rows": [
            [
              "天顶",
              "Alt=+90°",
              "头顶正上方"
            ],
            [
              "天底",
              "Alt=−90°",
              "地球另一侧方向"
            ],
            [
              "地平线",
              "Alt=0°",
              "理想数学地平，不含地形"
            ],
            [
              "北/东/南/西点",
              "Az≈0/90/180/270°",
              "地平圈四个基准方向"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "地平坐标依赖地点和时间。同一颗星在北京和东京的高度与方位不同；同一地点过一小时也会改变。纬度决定天极高度和可见赤纬范围，经度和时刻共同决定地方恒星时。"
        },
        {
          "type": "warning",
          "html": "项目地平线不模拟山脉、建筑、树木、大气折射和地理真地平。Alt=−1° 的太阳在现实中仍可能因折射可见；本项目默认不做这类修正。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://aa.usno.navy.mil/faq/alt_az\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：赤道坐标转高度方位</a>；<a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-2/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：天球与参考系统</a>；<code>src/astronomy/coordinates.ts</code>（项目实现）；<code>src/sky/reference-overlays.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "equatorial-coordinate",
      "title": "13. 赤道坐标：赤经、赤纬、春分点与小时角",
      "blocks": [
        {
          "type": "paragraph",
          "html": "赤道坐标把地球赤道和自转轴延伸到天球。天赤道是赤纬 0°，北/南天极是 ±90°。赤经 α 沿天赤道从春分点向东量，通常用 0–24 小时；赤纬 δ 类似地理纬度，用 −90° 到 +90°。"
        },
        {
          "type": "subheading",
          "html": "小时角与地方子午线"
        },
        {
          "type": "formula",
          "html": "<code>H = LST − α</code>"
        },
        {
          "type": "paragraph",
          "html": "H 是小时角，LST 是地方恒星时，α 是赤经。H=0 表示天体正在本地子午线上；H>0 通常表示已过中天向西；H<0 表示尚未中天。把角度包装到 −12h…+12h 或 0…24h 时，要明确显示约定。"
        },
        {
          "type": "subheading",
          "html": "赤道坐标为什么相对稳定但不是永恒不变"
        },
        {
          "type": "paragraph",
          "html": "目录坐标必须绑定参考系和历元，例如 ICRS/J2000。岁差、章动和恒星自行会使“同一物理方向的坐标数值”随参考框架/时间变化。项目保存 J2000 源坐标，再按轻量岁差生成显示历元坐标；这不是恒星图案整体真的扭曲。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://aa.usno.navy.mil/data/siderealtime\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：恒星时</a>；<a href=\"https://aa.usno.navy.mil/faq/ICRS_doc\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：ICRS 与参考系</a>；<a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-1/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：参考系统、岁差与章动</a>；<code>src/astronomy/sidereal.ts</code>（项目实现）；<code>src/astronomy/precession.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "eq-to-horizontal",
      "title": "14. 赤道坐标到地平坐标的数学转换",
      "blocks": [
        {
          "type": "paragraph",
          "html": "给定观测纬度 φ、天体赤纬 δ 和小时角 H，可以计算高度角 h。这个公式把“固定天球方向”与“观测者此刻姿态”连接起来，是本项目地点/时间驱动地平视图的核心。"
        },
        {
          "type": "formula",
          "html": "<code>sin h = sin φ · sin δ + cos φ · cos δ · cos H</code>"
        },
        {
          "type": "paragraph",
          "html": "先求 <code>h = asin(...)</code>。方位角应使用 atan2 形式而不是单一 tan 反函数，以保留象限。USNO 给出一种表达：<code>tan A = −sin H / [tan δ cos φ − sin φ cos H]</code>；实际代码应把分子、分母分别传给 <code>atan2</code>，再按照“北起向东”约定归一化。"
        },
        {
          "type": "subheading",
          "html": "边界情况"
        },
        {
          "type": "list",
          "items": [
            "靠近天顶时方位角变得敏感：所有方位方向在天顶汇聚。",
            "靠近天极时小时角变化未必带来明显高度变化。",
            "浮点误差可能使 asin 输入略超 ±1，代码应 clamp。",
            "东/西经符号、LST 单位小时与角度混用，是最常见的 15 倍错误来源。"
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://aa.usno.navy.mil/faq/alt_az\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：赤道坐标转高度方位</a>；<a href=\"https://aa.usno.navy.mil/faq/GAST\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：近似恒星时算法</a>；<code>src/astronomy/coordinates.ts</code>（项目实现）；<code>src/astronomy/sidereal.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "ecliptic-coordinate",
      "title": "15. 黄道坐标与太阳周年路径",
      "blocks": [
        {
          "type": "paragraph",
          "html": "黄道是地球公转轨道平面投影到天球形成的大圆；从地心视角看，也可理解为太阳一年中相对恒星背景的周年视运动轨迹。黄经 λ 从春分点沿黄道向东量，黄纬 β 垂直于黄道面。"
        },
        {
          "type": "subheading",
          "html": "为什么月亮和行星靠近黄道"
        },
        {
          "type": "paragraph",
          "html": "太阳系主要天体轨道面彼此接近，但都有不同倾角，因此月亮和行星大多分布在黄道附近而不严格落在黄道线上。黄道带是寻找行星的重要区域，但行星“排成一条线”只是投影近似。"
        },
        {
          "type": "subheading",
          "html": "J2000 黄道与 date-of-date 黄道"
        },
        {
          "type": "paragraph",
          "html": "黄道坐标可以绑定 J2000 基准，也可绑定当前日期的赤道/黄道框架。两者混用会导致远日期偏移。项目当前把黄道视角当作固定参考语义：普通时间播放不应反复改写黄道与恒星的相对关系；动态太阳系天体再转换到当前显示框架。"
        },
        {
          "type": "warning",
          "html": "“太阳在黄道上”不等于页面黄道线应该跟着时间整体滑动。太阳位置沿固定参考黄道变化；若整条黄道相对恒星大幅漂移，应检查框架是否双重转换。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-2/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：天球与参考系统</a>；<a href=\"https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/MATLAB/req/frames.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL NAIF：参考框架系统</a>；<a href=\"https://science.nasa.gov/solar-system/skywatching/planetary-alignments-and-planet-parades/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：行星与黄道附近的视运动</a>；<code>src/astronomy/coordinates.ts</code>（项目实现）；<code>src/sky/reference-overlays.ts</code>（项目实现）；<code>src/sky/epoch-frame.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "galactic-coordinate",
      "title": "16. 银河坐标：沿银河面读天空",
      "blocks": [
        {
          "type": "paragraph",
          "html": "银河坐标以银河盘面为基准：银经 l 沿银道面计量，银纬 b 垂直于银道面；b=0° 大致沿银河带，l=0° 指向银心附近，银北极/南极垂直于银河盘。它适合研究银河结构、星云和星团分布，不适合直接告诉你“往东南多少度看”。"
        },
        {
          "type": "subheading",
          "html": "与赤道坐标的关系"
        },
        {
          "type": "paragraph",
          "html": "银河坐标与 ICRS/赤道坐标之间是固定旋转关系。观测地点和一晚中的时间不会改变恒星在银河坐标中的 l、b；只有把银河天球投到本地地平视角时，整个银河带才随地球自转升落。"
        },
        {
          "type": "subheading",
          "html": "本项目的显示原则"
        },
        {
          "type": "paragraph",
          "html": "银河视角使用 D3-Celestial 的 galactic transform，并额外绘制 b=0° 的紫色参考线。银河多边形、恒星和银道参考线必须使用同一转换链；若其中一层又额外岁差，便会出现银河与星点错位。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-2/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：天球与参考系统</a>；<a href=\"https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/MATLAB/req/frames.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL NAIF：参考框架系统</a>；<a href=\"https://www.esa.int/content/view/full/416066\" target=\"_blank\" rel=\"noopener noreferrer\">ESA：Gaia 任务与数据规模</a>；<code>src/sky/celestial-display.ts</code>（项目实现）；<code>src/sky/reference-overlays.ts</code>（项目实现）；<code>src/data/milky-way/milky-way.js</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "equinox-points",
      "title": "17. 春分点、秋分点与天空参考零点",
      "blocks": [
        {
          "type": "paragraph",
          "html": "春分点是太阳从天赤道南侧穿到北侧的交点方向，也是传统赤经 0h 和黄经 0° 的起点；秋分点位于相反交点。这里的“点”是天球方向，不是公历中的某一天。春分日是太阳经过该方向附近的时刻。"
        },
        {
          "type": "subheading",
          "html": "为什么零点会移动"
        },
        {
          "type": "paragraph",
          "html": "地球自转轴受岁差影响，天赤道平面相对恒星背景缓慢改变，两个交点也沿黄道移动。因此“春分点”作为坐标零点与“某颗固定背景星”之间不是永久固定。现代参考系统会明确采用哪个参考历元和模型。"
        },
        {
          "type": "subheading",
          "html": "记忆方式"
        },
        {
          "type": "list",
          "items": [
            "春分点：太阳由南向北过天赤道，北半球天文春季开始。",
            "秋分点：太阳由北向南过天赤道，方向与春分点相反。",
            "赤经和黄经都从春分点起算，但沿不同基准大圆测量。",
            "岁差使“北极星不是永久岗位”，也使坐标零点随世纪缓慢移动。"
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-1/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：参考系统、岁差与章动</a>；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<a href=\"https://aa.usno.navy.mil/faq/ICRS_doc\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：ICRS 与参考系</a>；<code>src/astronomy/precession.ts</code>（项目实现）；<code>src/astronomy/coordinates.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "sidereal-time",
      "title": "18. 地方恒星时与天空为什么每天提前约四分钟",
      "blocks": [
        {
          "type": "paragraph",
          "html": "太阳日以太阳连续两次过中天为基准；恒星日以地球相对远方恒星转一周为基准，约 23 小时 56 分。地球在自转同时沿轨道前进，想让太阳再次回到子午线需要多转一点，因此太阳日比恒星日长约四分钟。"
        },
        {
          "type": "subheading",
          "html": "LST 的意义"
        },
        {
          "type": "paragraph",
          "html": "地方恒星时 LST 可以理解为“当前本地子午线所对应的赤经”。如果 LST=6h，那么 RA≈6h 的天体正在本地子午线附近。经度把格林尼治恒星时转换为地方恒星时，日期和 UTC 决定地球相对于春分点的旋转。"
        },
        {
          "type": "subheading",
          "html": "观测月份的换算"
        },
        {
          "type": "paragraph",
          "html": "同一颗恒星每天约提前 3 分 56 秒到达相同方位，一个月累计接近 2 小时。因此帮助文档中的“适合观测月份”默认指当地标准时约 21:00、目标接近上中天或处于较高位置；若晚一个月观察，可把相似星空提前约两小时。夏令时地区的钟表读数还可能多一小时。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://aa.usno.navy.mil/data/siderealtime\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：恒星时</a>；<a href=\"https://aa.usno.navy.mil/faq/GAST\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：近似恒星时算法</a>；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<code>src/astronomy/sidereal.ts</code>（项目实现）；<code>src/data/culture-notes.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "projection-principles",
      "title": "19. 投影总论：球面为什么不能无失真铺平",
      "blocks": [
        {
          "type": "paragraph",
          "html": "球面有非零高斯曲率，平面为零；无法在整个天空同时保留角度、面积、距离和方向。任何全天星图都在某处变形或切断。理解投影的目标不是寻找“完全正确”的图，而是知道它为哪种任务牺牲了什么。"
        },
        {
          "type": "table",
          "headers": [
            "性质",
            "含义",
            "代价"
          ],
          "rows": [
            [
              "保角",
              "局部角度和小形状较好",
              "面积在边缘可能巨大膨胀"
            ],
            [
              "等面积",
              "相同球面面积画成相同平面面积",
              "局部形状和角度会扭曲"
            ],
            [
              "等距",
              "从特定点/线的距离正确",
              "不是任意两点都正确"
            ],
            [
              "方位正确",
              "从中心出发的方向正确",
              "远离中心变形增加"
            ],
            [
              "折中",
              "没有某项完全正确但总体视觉均衡",
              "不适合严格测量"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "渲染还包含什么"
        },
        {
          "type": "paragraph",
          "html": "标准公式只是第一步。实际星图还要选择中心经纬度、坐标 transform、roll、缩放、裁剪、屏幕比例和 DPR。看起来“星座形状变了”通常是投影变形，不是目录坐标被改。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.usgs.gov/publications/map-projections-a-working-manual\" target=\"_blank\" rel=\"noopener noreferrer\">USGS：Map Projections—A Working Manual</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/sky/projection.ts</code>（项目实现）；<code>src/sky/celestial-display.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "azimuthal-projections",
      "title": "20. 方位类投影：从某个中心看天空",
      "blocks": [
        {
          "type": "paragraph",
          "html": "方位投影把球面围绕一个中心映到平面，特别适合当地全天或围绕目标的局部星图。项目把 Airy、Orthographic、Stereographic、Azimuthal Equidistant、Azimuthal Equal Area 归为地平友好投影。"
        },
        {
          "type": "table",
          "headers": [
            "投影",
            "几何思想",
            "主要性质",
            "变形位置",
            "推荐"
          ],
          "rows": [
            [
              "Airy",
              "折中型方位投影，控制整体误差",
              "视觉平衡",
              "边缘仍变形",
              "默认地平全天"
            ],
            [
              "Orthographic",
              "像从无穷远看球体",
              "球体感强、近中心直观",
              "边缘压扁，背面不可见",
              "直观展示半球"
            ],
            [
              "Stereographic",
              "从球上一极投到相切平面",
              "保角",
              "边缘快速膨胀",
              "局部形状、极区星图"
            ],
            [
              "Azimuthal Equidistant",
              "从中心的径向距离与角距离成比例",
              "中心到各点距离正确",
              "边缘形状拉伸",
              "以观测点/目标为中心测角距"
            ],
            [
              "Azimuthal Equal Area",
              "保证面积比例",
              "等面积",
              "形状在边缘压扁",
              "比较天区面积/密度"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "地平全天的裁剪"
        },
        {
          "type": "paragraph",
          "html": "真实地平天空只需上半球；项目可用 clip/视角中心把天顶附近放在中央。若使用全天方位投影显示完整天球，背面或投影边缘必须明确处理，不能把下半球误当可见天空。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://d3js.org/d3-geo/azimuthal\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：方位投影</a>；<a href=\"https://www.usgs.gov/publications/map-projections-a-working-manual\" target=\"_blank\" rel=\"noopener noreferrer\">USGS：Map Projections—A Working Manual</a>；<code>src/sky/projection.ts</code>（项目实现）；<code>src/sky/celestial-display.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "allsky-projections",
      "title": "21. 全天、圆柱与伪圆柱投影",
      "blocks": [
        {
          "type": "paragraph",
          "html": "全天投影适合比较星座、银河和坐标网的全球结构。不同投影在极区、边缘和面积上取舍不同。项目当前提供 Aitoff、Hammer、Mollweide、Winkel Tripel、Equirectangular、Mercator、Robinson、Sinusoidal 和 HEALPix 等。"
        },
        {
          "type": "formula",
          "html": "<code>Equirectangular: x = λ, y = φ</code><br><code>Mercator: y = ln tan(π/4 + φ/2)</code><br><code>Sinusoidal: x = λ cos φ, y = φ</code>"
        },
        {
          "type": "table",
          "headers": [
            "投影",
            "特点",
            "适用/限制"
          ],
          "rows": [
            [
              "Aitoff",
              "椭圆形全天折中",
              "视觉星图常用，不严格等面积"
            ],
            [
              "Hammer",
              "Aitoff 形式的等面积版本",
              "比较全天密度，边缘形状拉伸"
            ],
            [
              "Mollweide",
              "椭圆等面积，需解辅助角",
              "银河/宇宙背景常见"
            ],
            [
              "Winkel Tripel",
              "综合面积、方向和距离误差的折中",
              "整体地图均衡"
            ],
            [
              "Equirectangular",
              "经纬直接成矩形网格",
              "教学最直观，极区严重拉伸"
            ],
            [
              "Mercator",
              "保角圆柱",
              "极点发散，全天必须裁剪"
            ],
            [
              "Robinson",
              "视觉折中伪圆柱",
              "不严格保角/等面积"
            ],
            [
              "Sinusoidal",
              "等面积，中央经线直",
              "边缘形状扭曲"
            ],
            [
              "HEALPix",
              "分层等面积像素化思想",
              "适合全天数据分区，视觉形状不传统"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "Mollweide 的辅助角通常由隐式方程数值求解。D3/d3-geo-projection 已实现具体公式；本项目不重复手写投影，只配置名称、中心、比例、旋转和画布。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.usgs.gov/publications/map-projections-a-working-manual\" target=\"_blank\" rel=\"noopener noreferrer\">USGS：Map Projections—A Working Manual</a>；<a href=\"https://github.com/d3/d3-geo-projection\" target=\"_blank\" rel=\"noopener noreferrer\">d3-geo-projection：扩展投影</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/sky/projection.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "projection-guide",
      "title": "22. 投影选择指南",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "目的",
            "首选",
            "备选",
            "原因"
          ],
          "rows": [
            [
              "模拟当地上空",
              "Airy / Orthographic",
              "Stereographic",
              "中心直观，适合地平半球"
            ],
            [
              "看全天星座与银河",
              "Hammer / Mollweide / Winkel Tripel",
              "Aitoff / Robinson",
              "边界有限、整体均衡"
            ],
            [
              "学习经纬网和坐标转换",
              "Equirectangular",
              "Sinusoidal",
              "经纬关系直接可见"
            ],
            [
              "保留局部小形状",
              "Stereographic",
              "Mercator（非极区）",
              "保角性质"
            ],
            [
              "比较天区面积或对象密度",
              "Azimuthal Equal Area / Hammer / Mollweide",
              "Sinusoidal",
              "等面积"
            ],
            [
              "获得球体视觉",
              "Orthographic",
              "Airy",
              "像观察球面"
            ],
            [
              "测试像素化全天数据",
              "HEALPix",
              "Mollweide",
              "面向分层等面积思想"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "切换投影会改变屏幕图形，但不会改变天体目录的真实方向。不要根据投影边缘的“拉长”判断星座在天空中真的变形；可以切回局部方位投影或比较角距离。"
        },
        {
          "type": "note",
          "html": "实用做法：先用全天投影定位大区域，再切换 Orthographic/Stereographic 并放大研究局部。每个“坐标视角 + 投影”组合保存自己的 center/mapScale，避免来回切换后丢失工作位置。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.usgs.gov/publications/map-projections-a-working-manual\" target=\"_blank\" rel=\"noopener noreferrer\">USGS：Map Projections—A Working Manual</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/sky/projection.ts</code>（项目实现）；<code>src/state/app-state.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "camera-control",
      "title": "23. 相机中心、缩放、roll、拖动与天极中轴约束",
      "blocks": [
        {
          "type": "paragraph",
          "html": "星图相机可抽象为：当前坐标系中的中心方向、绕视线的 roll、投影类型、内部投影 zoom 和应用层 mapScale。屏幕中心对应某个天球方向；拖动改变中心/姿态；缩放改变角尺度或画布映射。"
        },
        {
          "type": "subheading",
          "html": "自由拖动：四元数抓点式旋转"
        },
        {
          "type": "paragraph",
          "html": "关闭天极中轴约束时，项目把鼠标按下处的天球方向“抓住”，根据拖动前后屏幕反投影方向构造三维旋转并累积到四元数。这样允许自由 roll，不依赖固定经纬轴，跨 ±180° 和接近极点时通常更连续。"
        },
        {
          "type": "subheading",
          "html": "受限拖动：欧拉式中轴约束"
        },
        {
          "type": "paragraph",
          "html": "开启约束时，目标是让当前坐标系的极轴在屏幕上接近竖直，而不是把北极固定在屏幕中心。水平拖动主要改变经向中心，垂直拖动改变纬向中心，roll 被限制/归零或受控，从而保持传统星图“上方有明确北/极轴”的阅读感。"
        },
        {
          "type": "subheading",
          "html": "为什么两种模式都需要"
        },
        {
          "type": "list",
          "items": [
            "四元数模式适合自由探索和避免欧拉角姿态奇异，但用户可能转得“上下颠倒”。",
            "中轴约束适合认星、坐标教学和比较视角，方向稳定，但接近坐标极点时经度不再稳定。",
            "切换模式时应同步当前中心、roll 与控制器状态，清除拖动/键盘残留，避免第一次拖动跳变。"
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://ntrs.nasa.gov/citations/19990110711\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：姿态表示与万向节死锁</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/sky/quaternion.ts</code>（项目实现）；<code>src/sky/rotation-controller.ts</code>（项目实现）；<code>src/sky/view-mode-switching.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "pole-guard",
      "title": "24. 极区保护、万向节死锁与 10°/12° 滞回",
      "blocks": [
        {
          "type": "paragraph",
          "html": "在球面极点附近，所有经线汇聚。纬度接近 ±90° 时，屏幕上很小的横向移动可能对应巨大的经度变化；用欧拉角表示时还会出现两个旋转轴趋于重合的万向节死锁。问题不是鼠标坏了，而是坐标参数在该处退化。"
        },
        {
          "type": "subheading",
          "html": "滞回规则"
        },
        {
          "type": "code",
          "text": "if distanceToCurrentPole <= 10°:\n    poleGuard = ON\nif poleGuard == ON and distanceToCurrentPole >= 12°:\n    poleGuard = OFF"
        },
        {
          "type": "paragraph",
          "html": "进入阈值 10°、退出阈值 12° 不同，是为了防止指针在边界附近来回抖动，导致保护一帧开、一帧关。保护判定既可看指针反投影方向离极点的距离，也可看极点离视图中心的距离。"
        },
        {
          "type": "subheading",
          "html": "保护应该限制什么"
        },
        {
          "type": "paragraph",
          "html": "保护不应完全冻结鼠标。更合理的是限制危险的横向经度跳变、roll 翻转和一次性角速度，同时保留安全的纵向离开极区操作。离开 12° 后恢复正常灵敏度。Debug 中应显示 guard active、触发原因、当前极点屏幕位置和角距离。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://ntrs.nasa.gov/citations/19990110711\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：姿态表示与万向节死锁</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/config.ts</code>（项目实现）；<code>src/sky/rotation-controller.ts</code>（项目实现）；<code>src/ui/debug-overlay.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "stellar-photometry",
      "title": "25. 恒星亮度、颜色、光谱与温度",
      "blocks": [
        {
          "type": "subheading",
          "html": "星等是倒序成绩单"
        },
        {
          "type": "paragraph",
          "html": "视星等 m 描述从地球看起来的亮度：数值越小越亮，负星等比 0 等更亮。相差 5 等对应光通量约 100 倍，因此相差 1 等约 2.512 倍。"
        },
        {
          "type": "formula",
          "html": "<code>m₁ − m₂ = −2.5 log₁₀(F₁/F₂)</code>"
        },
        {
          "type": "paragraph",
          "html": "绝对星等把恒星假想放到 10 秒差距处比较本征亮度；本项目主要显示视星等。现实可见性还受大气消光、光污染、月光、视力和目标高度影响。"
        },
        {
          "type": "subheading",
          "html": "B−V 与光谱型"
        },
        {
          "type": "paragraph",
          "html": "B−V 是蓝色 B 波段与可见 V 波段星等差。较负/较小通常更蓝更热，较大通常更红更冷，但星际消光、金属丰度和光度级会影响解释。O/B/A/F/G/K/M 是按光谱与温度排列的主序列记忆顺序；太阳是 G 型主序星。常见英文口诀 “Oh Be A Fine Girl/Guy, Kiss Me” 只用于记顺序，不替代理解。"
        },
        {
          "type": "table",
          "headers": [
            "光谱型",
            "大致颜色",
            "相对温度印象"
          ],
          "rows": [
            [
              "O",
              "蓝",
              "最高"
            ],
            [
              "B",
              "蓝白",
              "很高"
            ],
            [
              "A",
              "白",
              "高"
            ],
            [
              "F",
              "黄白",
              "中高"
            ],
            [
              "G",
              "黄白",
              "中等，太阳所在"
            ],
            [
              "K",
              "橙",
              "较低"
            ],
            [
              "M",
              "红",
              "较低"
            ]
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/universe/stars/types/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：恒星类型、颜色与演化</a>；<a href=\"https://science.nasa.gov/exoplanets/stars/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：恒星光谱与颜色概览</a>；<code>src/data/star-display.ts</code>（项目实现）；<code>src/sky/celestial-display.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "star-names",
      "title": "26. 恒星命名系统：一颗星为什么有很多名字",
      "blocks": [
        {
          "type": "paragraph",
          "html": "专名、传统标识和目录编号服务不同目的。同一颗星同时叫 Sirius、天狼星、α Canis Majoris、HIP 32349、HD 48915 是正常现象，不是重复对象。项目搜索和信息浮窗尽量把这些标识合并。"
        },
        {
          "type": "table",
          "headers": [
            "体系",
            "格式例子",
            "用途/来源"
          ],
          "rows": [
            [
              "IAU 批准专名",
              "Sirius, Vega",
              "国际统一专名，避免拼写和对象歧义"
            ],
            [
              "Bayer",
              "α CMa",
              "希腊字母 + 星座拉丁属格，常但不总按亮度"
            ],
            [
              "Flamsteed",
              "9 CMa",
              "数字 + 星座，按历史编目顺序/赤经排序背景"
            ],
            [
              "HIP",
              "HIP 32349",
              "Hipparcos 主目录编号"
            ],
            [
              "Gaia",
              "Gaia DR3 source id",
              "Gaia 数据发布中的长整数源标识"
            ],
            [
              "HD",
              "HD 48915",
              "Henry Draper 光谱目录"
            ],
            [
              "HR",
              "HR 2491",
              "Bright Star Catalogue 历史编号"
            ],
            [
              "中国星名",
              "天狼、织女一、河鼓二",
              "传统星官名 + 星官内部序号或专名"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "多星系统"
        },
        {
          "type": "paragraph",
          "html": "肉眼看似一颗的对象可能是双星/多星系统。专名可被批准给具体分量而不是整个系统；目录号也可能指系统质心、分量或不同观测源。页面若只有亮星点表，不应据此断言系统结构。"
        },
        {
          "type": "subheading",
          "html": "防止裸数字"
        },
        {
          "type": "paragraph",
          "html": "星图上的“1、2、3”若脱离上下文很难理解。项目在搜索/浮窗中尝试把 Flamsteed 数字补成“编号 + 星座”，把中文“一/二/三”解释为星官内部序号；D3-Celestial 原生标签字段仍保持兼容，避免破坏第三方渲染。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iau.org/WG280/WG280/Home.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU 恒星命名工作组</a>；<a href=\"https://www.esa.int/Science_Exploration/Space_Science/Hipparcos_overview\" target=\"_blank\" rel=\"noopener noreferrer\">ESA：Hipparcos 任务概览</a>；<a href=\"https://www.esa.int/content/view/full/416066\" target=\"_blank\" rel=\"noopener noreferrer\">ESA：Gaia 任务与数据规模</a>；<code>src/data/star-display.ts</code>（项目实现）；<code>src/data/stars/star-names.js</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "solar-system",
      "title": "27. 太阳、月亮、行星、黄道与月相圆盘",
      "blocks": [
        {
          "type": "paragraph",
          "html": "太阳系天体相对恒星背景移动。太阳周年视运动沿黄道；月球约一个月绕天一周并有较大轨道倾角和复杂摄动；行星轨道面接近黄道，但逆行、冲、合等现象来自地球和行星相对运动。"
        },
        {
          "type": "subheading",
          "html": "当前计算边界"
        },
        {
          "type": "paragraph",
          "html": "太阳和月亮采用 Meeus 风格轻量公式；行星使用简化轨道根数/简单模型，核心目标是天文馆视觉和教学，不是日月食、凌日、掩星或望远镜高精度指向。JPL 的近似行星公式本身也给出特定年代适用范围；超出范围只能看趋势。"
        },
        {
          "type": "subheading",
          "html": "月相计算"
        },
        {
          "type": "formula",
          "html": "<code>elongation = normalize(λmoon − λsun)</code><br><code>illumination ≈ (1 − cos elongation) / 2</code><br><code>age ≈ elongation/360 × 29.530588853 days</code>"
        },
        {
          "type": "paragraph",
          "html": "项目不是只在浮窗写“上弦月”，而是在月球原位置绘制月相盘：先画暗圆，再按每条水平扫描线计算明暗界限，根据 waxing/waning 选择亮面方向，最后画外圈。它是视觉近似；月面北方向、天平动和精确终结线不在当前模型内。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/solar-system/planets/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：太阳系行星</a>；<a href=\"https://science.nasa.gov/solar-system/orbits-and-keplers-laws/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：轨道与开普勒定律</a>；<a href=\"https://svs.gsfc.nasa.gov/5587/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：月相可视化与月球照明</a>；<a href=\"https://ssd.jpl.nasa.gov/planets/approx_pos.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL：行星近似位置与适用范围</a>；<code>src/astronomy/meeus-sun.ts</code>（项目实现）；<code>src/astronomy/meeus-moon.ts</code>（项目实现）；<code>src/astronomy/moon-phase.ts</code>（项目实现）；<code>src/sky/planet-overlay.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "deep-sky",
      "title": "28. 深空天体与 Messier、Caldwell、NGC/IC、SAC、OpenNGC",
      "blocks": [
        {
          "type": "paragraph",
          "html": "深空天体（DSO）是太阳系之外的星团、星云、星系和遗迹等。它们在星图中常以符号和方向点表示，真实形态、表面亮度和角大小需要照片或更复杂的轮廓数据。"
        },
        {
          "type": "table",
          "headers": [
            "目录/来源",
            "范围与历史意义",
            "本项目用途"
          ],
          "rows": [
            [
              "Messier",
              "为避免把彗星状固定天体误认成彗星而形成，现代常用 110 个目标",
              "完整 110 个亮目标点和别名"
            ],
            [
              "Caldwell",
              "Patrick Moore 提出的 109 个业余观测目标，补充非 Messier 尤其南天对象",
              "完整 109 个目标点和交叉编号"
            ],
            [
              "NGC/IC",
              "大型历史星云、星团、星系总目录及补编",
              "作为对象交叉编号和来源字段"
            ],
            [
              "OpenNGC",
              "汇合 NED、HyperLEDA、SIMBAD、HEASARC 等元数据的开放整理",
              "部分坐标、类型、形态、尺寸和别名来源"
            ],
            [
              "SAC",
              "面向业余观测的深空数据库",
              "未来扩展和观测信息参考，当前非全量绘制"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "常见类型缩写"
        },
        {
          "type": "table",
          "headers": [
            "缩写",
            "含义"
          ],
          "rows": [
            [
              "oc",
              "开放星团"
            ],
            [
              "gc",
              "球状星团"
            ],
            [
              "g / s",
              "星系（具体代码需看数据字典）"
            ],
            [
              "pn",
              "行星状星云"
            ],
            [
              "en",
              "发射星云"
            ],
            [
              "rn",
              "反射星云"
            ],
            [
              "dn",
              "暗星云"
            ],
            [
              "sfr",
              "恒星形成区"
            ],
            [
              "snr",
              "超新星遗迹"
            ],
            [
              "neb",
              "泛星云/复合对象"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "项目亮点表当前 228 个点位：Messier 110、Caldwell 109 和 9 个额外亮对象。名称/别名表更大，服务搜索，不表示所有名称条目都在星图上绘制。全量 NGC/IC 会带来空间索引、视场裁剪、标签层级和性能预算问题。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA/Hubble：Messier 目录与历史</a>；<a href=\"https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-caldwell-catalog/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA/Hubble：Caldwell 目录</a>；<a href=\"https://dc.zah.uni-heidelberg.de/openngc/q/web/form\" target=\"_blank\" rel=\"noopener noreferrer\">GAVO/OpenNGC：NGC/IC 开放数据库</a>；<a href=\"https://www.saguaroastro.org/sac-downloads/\" target=\"_blank\" rel=\"noopener noreferrer\">Saguaro Astronomy Club：SAC 深空数据库</a>；<code>src/data/deep-sky/deep-sky-bright.js</code>（项目实现）；<code>src/data/deep-sky/deep-sky-names.js</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "precession-frames",
      "title": "29. 岁差、章动、J2000、ICRS 与 epoch-of-date",
      "blocks": [
        {
          "type": "paragraph",
          "html": "ICRS 是现代天球参考系统；J2000 常作为目录参考历元/取向标签。岁差是地球自转轴长期缓慢改变，章动是在其上的较小周期项；恒星自行则是恒星本身相对太阳系的空间运动投影。它们是不同效应，不能用一个“年份偏移”统称。"
        },
        {
          "type": "subheading",
          "html": "项目的三层思路"
        },
        {
          "type": "code",
          "text": "J2000 / source coordinates\n  → lightweight precession to display epoch\n  → coordinate-view transform\n  → for local sky: hour angle + observer latitude → Alt/Az\n  → projection → screen"
        },
        {
          "type": "paragraph",
          "html": "项目的 epoch-frame 机制把已加载固定图层准备为显示历元，使星点、连线、搜索和点击保持一致。风险在于：若黄道/银河固定视角已经由 D3 transform 处理，又把同一几何额外日期化，就可能双重转换。帮助文档必须既解释理想模型，也明确当前轻量实现的边界。"
        },
        {
          "type": "subheading",
          "html": "SOFA 级算法与轻量模型"
        },
        {
          "type": "paragraph",
          "html": "IAU SOFA 提供 IAU 2006/2000A 岁差章动、地球自转角、恒星时等标准实现。项目没有完整移植 SOFA，而是视觉级轻量岁差；不应把结果标为科研级。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<a href=\"https://aa.usno.navy.mil/faq/ICRS_doc\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：ICRS 与参考系</a>；<a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-1/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：参考系统、岁差与章动</a>；<a href=\"https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/MATLAB/req/frames.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL NAIF：参考框架系统</a>；<code>src/astronomy/precession.ts</code>（项目实现）；<code>src/sky/epoch-frame.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "remote-dates",
      "title": "30. 远日期近似、历史天空与参考框架混用",
      "blocks": [
        {
          "type": "paragraph",
          "html": "离现代越远，误差来源越多：岁差多项式外推、章动缺失、恒星自行缺失、历法/时区推算、ΔT、太阳系轨道摄动和数值精度。恒星图案在几千年尺度大体仍可认，但精确坐标、极点和动态天体误差会扩大。"
        },
        {
          "type": "subheading",
          "html": "“黄道飞走了”通常不是天文事实"
        },
        {
          "type": "paragraph",
          "html": "若远日期下把静态星图几何从 J2000 转到 date-of-date，同时 D3 ecliptic transform 和项目黄道线又各自做一次变换，黄道可能相对恒星越来越偏。这是 source epoch、display epoch 和 view transform 混用或双重转换，不是黄道在真实天空脱离太阳系。"
        },
        {
          "type": "subheading",
          "html": "可靠性分层"
        },
        {
          "type": "table",
          "headers": [
            "内容",
            "现代日期",
            "数千年前后",
            "极远日期"
          ],
          "rows": [
            [
              "恒星相对图案",
              "较可靠",
              "缺自行时逐渐偏差",
              "只作示意"
            ],
            [
              "赤道极点/赤道网",
              "轻量岁差可用",
              "趋势可用、细节有限",
              "外推风险高"
            ],
            [
              "太阳/月球/行星",
              "教学参考",
              "误差增大",
              "不用于事件判断"
            ],
            [
              "IANA 当地时间",
              "现代规则可靠",
              "历史地方时可能奇特",
              "库支持与历法不确定"
            ]
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<a href=\"https://ssd.jpl.nasa.gov/planets/approx_pos.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL：行星近似位置与适用范围</a>；<a href=\"https://science.nasa.gov/learn/basics-of-space-flight/chapter2-1/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：参考系统、岁差与章动</a>；<a href=\"https://www.iana.org/time-zones/theory\" target=\"_blank\" rel=\"noopener noreferrer\">IANA tzdb 理论与命名原则</a>；<code>src/astronomy/precession.ts</code>（项目实现）；<code>src/astronomy/bodies-simple.ts</code>（项目实现）；<code>src/sky/epoch-frame.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "data-sources",
      "title": "31. 数据来源、数据结构与可靠性边界",
      "blocks": [
        {
          "type": "paragraph",
          "html": "项目把“可绘制的天文几何”“名称和别名”“文化长文本”“帮助文档”分开。运行时单文件构建并不意味着源码中应把所有内容混在一个文件；分层是维护边界，bundle 只是发布形式。"
        },
        {
          "type": "table",
          "headers": [
            "类别",
            "用户看到什么",
            "源码/结构",
            "可靠边界"
          ],
          "rows": [
            [
              "恒星目录",
              "星点、星等、颜色、点击",
              "GeoJSON features：id、coordinates、mag、bv 等",
              "亮星/肉眼级子集，不是完整 Gaia"
            ],
            [
              "恒星名称",
              "专名、中文名、目录号",
              "名称映射与属性表",
              "历史来源混合，显示需兼容"
            ],
            [
              "星座线/名称",
              "西方图案与标签",
              "LineString/点标签",
              "连线不是官方边界"
            ],
            [
              "IAU 边界",
              "全天星座分区",
              "边界线数据",
              "应按官方分区理解，数据来源需持续核实"
            ],
            [
              "中国星官/传统天区",
              "线、名、区域示意",
              "自定义 GeoJSON/标签",
              "文化复原，不是现代法定边界"
            ],
            [
              "银河",
              "银河带轮廓",
              "5 个 MultiPolygon 等",
              "示意填充，不是照片/亮度测量"
            ],
            [
              "DSO",
              "228 个亮目标点、名称/别名",
              "点表 + 更大名称表",
              "非全量 NGC/IC"
            ],
            [
              "城市/时区",
              "地点搜索和当地时间",
              "城市表 + tz-lookup/IANA",
              "城市中心坐标，不代替精确观测站"
            ],
            [
              "太阳系",
              "动态符号和月相",
              "轻量公式/轨道参数",
              "教学近似"
            ],
            [
              "文化百科",
              "对象含义、关系、古籍/来源",
              "culture-notes.ts",
              "可选增强，不改坐标"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "每类数据应记录来源、许可证、版本、转换步骤和已知缺口。搜索能找到一个别名，不代表对应对象有完整几何或文化条目；绘制有点位也不代表物理参数齐全。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>docs/DATA_SOURCES.md</code>（项目数据来源说明）；<a href=\"https://www.esa.int/Science_Exploration/Space_Science/Hipparcos_overview\" target=\"_blank\" rel=\"noopener noreferrer\">ESA：Hipparcos 任务概览</a>；<a href=\"https://www.esa.int/content/view/full/416066\" target=\"_blank\" rel=\"noopener noreferrer\">ESA：Gaia 任务与数据规模</a>；<a href=\"https://dc.zah.uni-heidelberg.de/openngc/q/web/form\" target=\"_blank\" rel=\"noopener noreferrer\">GAVO/OpenNGC：NGC/IC 开放数据库</a>；<code>src/data/catalog-registry.ts</code>（项目实现）；<code>src/data/catalog-types.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "western-constellations",
      "title": "32. 西方星座、IAU 边界、连线与文化关系",
      "blocks": [
        {
          "type": "paragraph",
          "html": "现代 88 星座是全天分区。IAU 1922 年确定名单和三字母缩写，随后由 Delporte 标准化边界。对象“位于猎户座”指其坐标落在 Orion 官方天区；页面上的猎户线条只是识图方案。"
        },
        {
          "type": "subheading",
          "html": "古典与近代星座"
        },
        {
          "type": "paragraph",
          "html": "古典星座多继承希腊—罗马和更早近东传统，例如珀耳修斯家族、猎户狩猎、阿尔戈船。近代南天星座常来自航海动物、科学仪器和制图者，例如唧筒、显微镜、望远镜、时钟，不应强行编造希腊神话。"
        },
        {
          "type": "subheading",
          "html": "关系叙事帮助联想"
        },
        {
          "type": "list",
          "items": [
            "仙后座夸耀 → 海神惩罚 → 仙女座被献祭 → 英仙座救援 → 鲸鱼座作为海怪，构成一组秋季故事。",
            "猎户座与大犬、小犬、天兔形成冬季狩猎图；金牛、天蝎分别在不同传统中与猎户冲突。",
            "白羊的金羊毛连接伊阿宋远征，而船底、船帆、船尾是古代阿尔戈船拆分后的现代星座。",
            "宝瓶倾水至南鱼，周围双鱼、鲸鱼、摩羯形成“天海”区域。"
          ]
        },
        {
          "type": "subheading",
          "html": "观测月份怎么读"
        },
        {
          "type": "paragraph",
          "html": "文化数据库的月份按对象代表赤经估算：当地标准时约 21:00、对象接近上中天或较高位置。它不是“整个月只有这个时间可见”；纬度、地平遮挡、夏令时和纬度都会改变实际效果。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iau.org/Iau/Science/What-we-do/The-Constellations.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU：88 个现代星座与官方边界</a>；<a href=\"https://hk.space.museum/sc/web/spm/resources/teachers-corner/constellations-and-myths/glossary-of-western-constellations.html\" target=\"_blank\" rel=\"noopener noreferrer\">香港太空馆：西方星座资料</a>；<code>src/data/western/constellations.js</code>（项目实现）；<code>src/data/western/constellation-lines.js</code>（项目实现）；<code>src/data/western/boundaries.js</code>（项目实现）；<code>src/data/culture-notes.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "chinese-asterisms",
      "title": "33. 中国星官、三垣、二十八宿、四象与传统天区",
      "blocks": [
        {
          "type": "paragraph",
          "html": "中国传统天空不是 88 个大块星座，而是数百个星官组成的制度化图景。星官名称往往直接指人、官、器、建筑、道路、农田、军市、动物或祭祀；理解“为什么这样命名”比只背连线更重要。"
        },
        {
          "type": "subheading",
          "html": "三垣"
        },
        {
          "type": "list",
          "items": [
            "<strong>紫微垣</strong>围绕北天极，像天帝禁城：北极、勾陈、四辅、文昌、天厨、天床等形成宫廷与生活系统。",
            "<strong>太微垣</strong>是中央政府和朝会空间：五帝座、三公、九卿、执法等表现朝廷官署。",
            "<strong>天市垣</strong>是受权力监管的市场城市：帝座代表最高权力，候负责监察，斗/斛是容量尺度，列肆/车肆是商铺，左右垣以诸侯国名围成边界。帝座在市场中并不矛盾，因为传统市场是国家秩序的一部分。"
          ]
        },
        {
          "type": "subheading",
          "html": "二十八宿与四象"
        },
        {
          "type": "paragraph",
          "html": "二十八宿沿月亮运行附近分布，分为东方苍龙、北方玄武、西方白虎、南方朱雀各七宿。每个“宿”是月站/标志区，内部还有众多星官。四象是更大的方向—季节—象征组织，不等于四个单独星座。"
        },
        {
          "type": "subheading",
          "html": "三大战场与主题区域"
        },
        {
          "type": "paragraph",
          "html": "项目的 battlefield 层把井宿边防、天市垣秩序等主题关系可视化，属于教学重构。军市—野鸡—天狼—弧矢是一组典型叙事：军市为军队交易/集结，野鸡作诱饵意象，天狼代表边患，弧矢弓箭指向天狼。它们在同一天区互相解释，而不是孤立词条。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://hk.space.museum/sc/web/spm/resources/teachers-corner/constellations-and-myths/glossary-of-chinese-star-regions-asterisms-and-star-names.html\" target=\"_blank\" rel=\"noopener noreferrer\">香港太空馆：中国星区、星官及星名英译表</a>；<a href=\"https://idp.bl.uk/learning/chinese-astronomy/articles/the-chinese-sky/the-regions-of-the-sky/\" target=\"_blank\" rel=\"noopener noreferrer\">国际敦煌项目：中国天空区域</a>；<a href=\"https://idp.bl.uk/discover/learning/chinese-astronomy/articles/the-chinese-sky/the-constellations/\" target=\"_blank\" rel=\"noopener noreferrer\">国际敦煌项目：中国星官</a>；<a href=\"https://ctext.org/shiji/tian-guan-shu/zhs\" target=\"_blank\" rel=\"noopener noreferrer\">《史记·天官书》电子文本</a>；<code>src/data/chinese/</code>（项目实现）；<code>src/sky/culture-overlays.ts</code>（项目实现）；<code>src/sky/traditional-regions-overlay.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "butiange",
      "title": "34. 丹元子《步天歌》专题：按三垣二十八宿读星官",
      "blocks": [
        {
          "type": "paragraph",
          "html": "《步天歌》用短句描述星官形状、数量、相对位置和辨认顺序，功能接近口传星图索引。不同传本字句可能有差异；本项目引用时标明所用电子文本，不把现代标点或解释冒充原文。读者应把诗句与当前星官连线同时对照。"
        },
        {
          "type": "subheading",
          "html": "四象与七宿顺序"
        },
        {
          "type": "table",
          "headers": [
            "四象",
            "七宿",
            "阅读线索"
          ],
          "rows": [
            [
              "东方苍龙",
              "角、亢、氐、房、心、尾、箕",
              "从龙角、颈、胸腹、心、尾到箕，兼有天门、官署、房舍和农事"
            ],
            [
              "北方玄武",
              "斗、牛、女、虚、危、室、壁",
              "斗量、牛女河汉、庙堂虚危、营室与东壁"
            ],
            [
              "西方白虎",
              "奎、娄、胃、昴、毕、觜、参",
              "文章仓廪、畜牧军政、昴毕雨师、觜参猎场"
            ],
            [
              "南方朱雀",
              "井、鬼、柳、星、张、翼、轸",
              "井水与边防、鬼舆、鸟颈心翼尾和南方交通"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "井宿示例：把诗句变成关系图"
        },
        {
          "type": "paragraph",
          "html": "项目文化条目引用井宿篇中的“军市南门七星出，天狼野鸡在军市，丈人南极老人星，两个弧矢向狼指”等相关句意。阅读时应连成：井宿水利/道路背景 → 军市与南门 → 天狼作为边患 → 野鸡诱敌 → 弧矢射狼 → 更南方老人星。这样诗句不是命令“去结合阅读”，而是直接提供辨认链。"
        },
        {
          "type": "subheading",
          "html": "三垣的阅读"
        },
        {
          "type": "paragraph",
          "html": "三垣不属于四象七宿顺序，而是北天和春秋季高空的重要制度区。紫微读宫城内外，太微读朝廷官署，天市读市场和度量衡。项目帮助页只摘取与当前数据可对应的短句/概述，完整文本请查看章末原文链接。"
        },
        {
          "type": "subheading",
          "html": "分野的谨慎使用"
        },
        {
          "type": "paragraph",
          "html": "分野是古代把天区与地理、诸侯国或州郡联系的天文—政治文化映射。不同年代、文献和学派分配不同；条目必须写明“依据哪一文献/体系”，不能统一复制“文献有差异”作为空话。若来源不足，就不显示具体分野。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://zh.wikisource.org/zh-hans/钦定古今图书集成/历象汇编/乾象典/第053卷\" target=\"_blank\" rel=\"noopener noreferrer\">《古今图书集成》所录《步天歌》</a>；<a href=\"https://ctext.org/shiji/tian-guan-shu/zhs\" target=\"_blank\" rel=\"noopener noreferrer\">《史记·天官书》电子文本</a>；<a href=\"https://idp.bl.uk/discover/learning/chinese-astronomy/collection-items/\" target=\"_blank\" rel=\"noopener noreferrer\">国际敦煌项目：敦煌星图资料</a>；<a href=\"https://hk.space.museum/sc/web/spm/resources/teachers-corner/constellations-and-myths/glossary-of-chinese-star-regions-asterisms-and-star-names.html\" target=\"_blank\" rel=\"noopener noreferrer\">香港太空馆：中国星区、星官及星名英译表</a>；<code>src/data/culture-notes.ts</code>（项目实现）；<code>docs/CULTURE_DATA_GUIDE.md</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "accuracy-misconceptions",
      "title": "35. 精度边界与常见误解",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "现象",
            "常见误解",
            "正确认识",
            "如何验证"
          ],
          "rows": [
            [
              "恒星相对形状稳定但 RA/Dec 变化",
              "目录错了",
              "岁差改变参考坐标轴；恒星自行当前未完整建模",
              "比较 J2000 source 与 display epoch"
            ],
            [
              "月亮/行星与专业软件略有差异",
              "星图所有数据都不准",
              "动态天体模型比固定恒星更简化",
              "在现代日期与 JPL/专业软件比趋势，查看 planetModel"
            ],
            [
              "地平线下仍有现实山景差异",
              "地平线画错",
              "数学地平不含地形、折射",
              "关闭/开启 horizon，查 Alt"
            ],
            [
              "手机画布尺寸变化",
              "天文公式出错",
              "多为 visualViewport/DPR/侧栏布局",
              "看 viewport、canvas CSS/bitmap"
            ],
            [
              "刷新后旧视角回来",
              "重置无效",
              "localStorage 保存旧状态",
              "查看 schema，执行项目重置"
            ],
            [
              "fallback recovered",
              "当前仍失败",
              "表示某次路径失败但已恢复",
              "看最后错误时间与 rollback 状态"
            ],
            [
              "搜索到 DSO 但不明显",
              "坐标错",
              "点位只是方向，表面亮度/图层/缩放影响可见",
              "打开 DSO 层、放大、看坐标和别名"
            ],
            [
              "dim 很大但符号很小",
              "尺寸字段无效",
              "dim 是角大小元数据，符号是可点击标记",
              "读取对象类型和 dim"
            ]
          ]
        },
        {
          "type": "warning",
          "html": "任何“历史某日精确月相/行星位置/日食”结论都不应只依赖本项目。它是教学星图，不是专业星历或法律/考古定年工具。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<a href=\"https://ssd.jpl.nasa.gov/planets/approx_pos.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL：行星近似位置与适用范围</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：ResizeObserver</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：localStorage</a>；<code>src/config.ts</code>（项目实现）；<code>src/ui/debug-overlay.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "frame-diagnosis",
      "title": "36. 坐标框架异常自查",
      "blocks": [
        {
          "type": "paragraph",
          "html": "坐标异常要先区分“相机应该动”与“固定背景不该动”。地平视角随时间/地点转动正常；赤道、黄道、银河视角中的固定恒星、星座线、星官线和银河相互大幅漂移通常不正常。"
        },
        {
          "type": "table",
          "headers": [
            "症状",
            "先看 Debug",
            "正常规则",
            "可能原因"
          ],
          "rows": [
            [
              "改时间后黄道远离恒星背景",
              "coordinate view、D3 transform、source/display epoch、fixedLayerPrecession",
              "黄道固定参考与恒星应保持一致",
              "黄道线与静态几何双重日期转换"
            ],
            [
              "银河相对星点漂移/反转",
              "coordinate view、milky-way feature count、transform",
              "银河与恒星同属固定背景",
              "mw/mwbg mask、ring reverse、epoch hook不一致"
            ],
            [
              "赤道网与星座线错位",
              "frame mode、time affects static layers",
              "赤道网和显示历元要同框架",
              "一层 J2000、一层 date-of-date"
            ],
            [
              "默认视角歪/roll异常",
              "center、roll、saved view、pole constraint",
              "reset 后应回配置默认",
              "旧 localStorage 或模式切换未同步"
            ],
            [
              "时间变化地平视角不动",
              "time affects camera、LST、geopos",
              "horizontal 应随时间动",
              "相机更新被跳过或时间回滚"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "判断口诀"
        },
        {
          "type": "list",
          "items": [
            "<strong>horizontal：</strong>time affects camera = yes；本地天空动。",
            "<strong>equatorial/ecliptic/galactic：</strong>固定框架语义，time affects static layers 应为 no；动态天体更新。",
            "固定图层只在源数据/显示框架真正变化时做昂贵同步；普通缩放、标签开关和时间播放不应重复改写几何。"
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/MATLAB/req/frames.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL NAIF：参考框架系统</a>；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<code>src/sky/epoch-frame.ts</code>（项目实现）；<code>src/sky/reference-overlays.ts</code>（项目实现）；<code>src/sky/view-mode-switching.ts</code>（项目实现）；<code>src/ui/debug-overlay.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "debug-panel",
      "title": "37. Debug 面板字段怎么读",
      "blocks": [
        {
          "type": "paragraph",
          "html": "Debug 不是把内部变量全部堆出来，而是回答“页面多大、当前哪套框架、哪次刷新做了什么、失败是否恢复”。复制报告时应保留字段名、值、时间戳和最近 reason。"
        },
        {
          "type": "table",
          "headers": [
            "字段组",
            "关键字段",
            "异常信号"
          ],
          "rows": [
            [
              "浏览器/布局",
              "innerWidth/Height、visualViewport、pane、sidebar",
              "pane 为 0、可见视口与 canvas 相差很大"
            ],
            [
              "Canvas/SVG",
              "CSS size、bitmap size、DPR、renderMode",
              "bitmap 未乘 DPR、VIEWPORT/FULL 与尺寸矛盾"
            ],
            [
              "坐标/投影",
              "coordinate view、projection、frame mode、D3 transform",
              "ecliptic 却 transform=equatorial 且无设计说明"
            ],
            [
              "时间影响",
              "time affects camera/static layers",
              "fixed frame 的 static layers=yes"
            ],
            [
              "历元",
              "source epoch、display epoch、fixedLayerPrecession count",
              "普通缩放出现大量固定层转换"
            ],
            [
              "交互",
              "pole constraint、pole guard、keyboard pan",
              "keyup 后 keyboard 仍 active、guard 边界抖动"
            ],
            [
              "动态天体",
              "planetModel、moonPhaseModel、illumination",
              "模型标识缺失或 NaN"
            ],
            [
              "刷新性能",
              "fixed sync、Celestial.redraw、resize、follow-up",
              "一次按钮触发多次固定层同步/三连稳定化"
            ],
            [
              "失败恢复",
              "fallback、rollback、last valid instant",
              "rollback failed 比 recovered fallback 更严重"
            ],
            [
              "存储",
              "schema version、saved center/roll",
              "旧 schema 未迁移、非法 center 反复恢复"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "<code>moonPhaseModel = longitude-difference approximation</code> 表示月相是轻量近似；<code>planetModel = simple orbital model</code> 表示行星不是 JPL DE 星历。<code>Keyboard pan: active</code> 只应在按键持续期间出现。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：ResizeObserver</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：requestAnimationFrame</a>；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<code>src/ui/debug-overlay.ts</code>（项目实现）；<code>src/ui/debug-panel.ts</code>（项目实现）；<code>src/sky/renderer.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "troubleshooting",
      "title": "38. 维护者排查流程：从现象到模块",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "问题",
            "先看",
            "数据/模块",
            "下一步"
          ],
          "rows": [
            [
              "星图不显示",
              "控制台、skyReady、canvas、catalog count",
              "loader.js、celestial-display.ts",
              "确认 bundle 顺序和 registerSkyData 标记"
            ],
            [
              "时间变化坐标漂移",
              "frame/time fields、fixed sync reasons",
              "epoch-frame.ts、reference-overlays.ts",
              "记录一次动作内各转换，不要先改 roll"
            ],
            [
              "默认视角不正",
              "saved center/roll、schema",
              "view-mode-switching.ts、storage.ts",
              "清状态后复现，再查重置基准"
            ],
            [
              "点击不准",
              "CSS pixel、DPR、projection point",
              "object-picking.ts、renderer.ts",
              "禁止把 CSS 点击坐标再乘 DPR"
            ],
            [
              "搜索定位错位",
              "candidate displayCoord/sourceCoord",
              "object-search-index.ts、epoch-frame.ts",
              "统一搜索与渲染坐标链"
            ],
            [
              "手机布局异常",
              "visualViewport/pane/canvas",
              "layout.ts、renderer.ts",
              "记录横竖屏和侧栏开关前后尺寸"
            ],
            [
              "银河反色",
              "polygon/ring/mask/clip",
              "milky-way.js、epoch-frame.ts",
              "检查 winding、日期线分段和 mwbg"
            ],
            [
              "极点抖动",
              "pole distance/guard state",
              "rotation-controller.ts",
              "确认 10°/12° 滞回和速度限制"
            ],
            [
              "方向键卡顿",
              "keyboard active、redraw/frame",
              "keyboard-pan.ts、app-animation.ts",
              "合并每帧更新，检查 keyup/blur 清理"
            ],
            [
              "DSO 搜到但不显示",
              "showDeepSky、point count、clip",
              "deep-sky-bright.js、layers.ts",
              "区分名称表命中和绘制点表"
            ],
            [
              "月相方向不对",
              "phaseAngle、waxing、display orientation",
              "moon-phase.ts、planet-overlay.ts",
              "先验证黄经差，再查屏幕翻转/roll"
            ],
            [
              "星名出现裸数字",
              "name fields、language/culture",
              "star-display.ts、star-names.js",
              "按需格式化，不污染原始字段"
            ]
          ]
        },
        {
          "type": "note",
          "html": "固定模板：复现条件 → 复制 Debug → 确认当前构建版本/时间 → 确认状态是否干净 → 找到第一次异常的转换或 redraw reason → 最小改动 → 同一场景前后对比。不要只凭最终截图猜原因。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>docs/ARCHITECTURE_GUIDE.md</code>（项目架构说明）；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Canvas 2D</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：requestAnimationFrame</a>；<code>docs/ARCHITECTURE_GUIDE.md</code>（项目实现）；<code>src/testing/ui-performance-runner.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "browser-runtime",
      "title": "39. 浏览器如何运行这个本地星图",
      "blocks": [
        {
          "type": "paragraph",
          "html": "浏览器先读取 <code>index.html</code>，加载 <code>assets/app.css</code> 和合并后的 <code>assets/app.js</code>。app.js 内按顺序包含 D3、扩展投影、数据注册器和所有数据分片、D3-Celestial、Luxon、tz-lookup、项目 TypeScript bundle。顺序错误会表现为 d3/Celestial/registerSkyData 未定义。"
        },
        {
          "type": "subheading",
          "html": "file:// 与本地服务器"
        },
        {
          "type": "list",
          "items": [
            "file:// 适合离线直开，因为数据已经注册进 app.js，不需要 fetch 外部 JSON。",
            "浏览器定位、剪贴板和部分安全 API 在 file:// 下可能受限。",
            "本地服务器提供正常 HTTP origin，便于 DevTools、缓存控制和权限测试。",
            "页面仍是纯静态文件，不需要后端数据库。"
          ]
        },
        {
          "type": "subheading",
          "html": "初始化链"
        },
        {
          "type": "code",
          "text": "index.html\n→ app.css/app.js\n→ config + culture notes\n→ app state/localStorage restore\n→ local data registry ready\n→ build D3-Celestial config\n→ Celestial.display()\n→ custom overlays and events\n→ first stable frame\n→ optional performance profiler"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>docs/BUILD_GUIDE.md</code>（项目构建说明）；<a href=\"https://github.com/ofrohn/d3-celestial\" target=\"_blank\" rel=\"noopener noreferrer\">D3-Celestial 项目</a>；<a href=\"https://esbuild.github.io/api/\" target=\"_blank\" rel=\"noopener noreferrer\">esbuild 构建 API</a>；<code>index.html</code>（项目实现）；<code>src/main.ts</code>（项目实现）；<code>src/app.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "localstorage",
      "title": "40. localStorage 保存、迁移与重置",
      "blocks": [
        {
          "type": "paragraph",
          "html": "localStorage 是浏览器按 origin 保存少量字符串键值的机制。项目把状态序列化为 JSON，刷新后恢复。file:// 在不同浏览器中的 origin 行为可能不同，因此源码调试建议使用固定 localhost 地址。"
        },
        {
          "type": "table",
          "headers": [
            "保存",
            "不保存"
          ],
          "rows": [
            [
              "语言、文化体系、城市、经纬度、时区、UTC 瞬时",
              "hover、指针按下位置、拖动中的四元数草稿"
            ],
            [
              "投影、坐标视角、每组 center/roll/mapScale",
              "搜索候选列表和未提交输入"
            ],
            [
              "图层开关、星等、星点大小、星名密度、字体、Panel/菜单",
              "临时 fallback 错误对象、动画帧 ID"
            ],
            [
              "Debug 开关、schema version",
              "性能测试当前动作和弹窗引用"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "schema 与错误视角"
        },
        {
          "type": "paragraph",
          "html": "状态结构或默认语义改变时，应提升 storage schema 或提供迁移。标准坐标视角若保存了错误 center/roll，会造成“每次点进去都歪”；仅修改默认配置不会覆盖旧 localStorage。重置按钮只删除本项目 key，然后重新加载默认，不应调用 localStorage.clear() 伤及其他网页。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：localStorage</a>；<code>docs/ARCHITECTURE_GUIDE.md</code>（项目架构说明）；<code>src/state/storage.ts</code>（项目实现）；<code>src/state/defaults.ts</code>（项目实现）；<code>src/app.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "library-roles",
      "title": "41. D3、d3-geo-projection、D3-Celestial 与项目代码的分工",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "组件",
            "负责",
            "不负责"
          ],
          "rows": [
            [
              "D3 v3",
              "选择集、数据绑定、基础 geo/projection 生命周期",
              "项目业务状态、文化语义"
            ],
            [
              "d3-geo-projection",
              "额外地图投影公式",
              "星表/时间/点击"
            ],
            [
              "D3-Celestial",
              "基础星图配置、恒星/DSO/星座/边界/银河层和投影",
              "中国文化百科、IANA 地点、项目 UI、自由拖动策略"
            ],
            [
              "项目代码",
              "状态、时区、坐标语义、覆盖层、搜索、拾取、月相、Debug、帮助、移动端",
              "重写所有基础投影和星表渲染"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "总体拼接方式是：D3-Celestial 先建立基础天球和主 Canvas；项目通过 <code>Celestial.add()</code> 或自定义 redraw 注册太阳系、中国星官、传统天区、参考线、搜索/选择标记；UI 在外层修改状态并触发统一刷新。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<a href=\"https://github.com/d3/d3-geo-projection\" target=\"_blank\" rel=\"noopener noreferrer\">d3-geo-projection：扩展投影</a>；<a href=\"https://github.com/ofrohn/d3-celestial\" target=\"_blank\" rel=\"noopener noreferrer\">D3-Celestial 项目</a>；<code>src/sky/celestial-display.ts</code>（项目实现）；<code>src/sky/culture-overlays.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "projection-implementation",
      "title": "42. 当前投影与坐标视角的实现方法",
      "blocks": [
        {
          "type": "paragraph",
          "html": "“投影”和“坐标视角”是正交概念。投影决定球面如何铺平；坐标视角决定输入经纬度属于地平、赤道、黄道还是银河框架。项目用 config.coordinateViews 指定 D3 transform 和朝向语义，用 projection.ts 保存 14 种投影默认视图。"
        },
        {
          "type": "table",
          "headers": [
            "视角",
            "D3 transform/语义",
            "时间影响相机",
            "时间影响固定图层"
          ],
          "rows": [
            [
              "horizontal",
              "equatorial transform + local-sky camera",
              "是",
              "不应反复改写源几何"
            ],
            [
              "equatorial",
              "equatorial / fixed frame",
              "否（普通播放）",
              "只在显示历元策略明确时同步"
            ],
            [
              "ecliptic",
              "ecliptic / fixed frame",
              "否",
              "否；避免双重日期化"
            ],
            [
              "galactic",
              "galactic / fixed frame",
              "否",
              "否；银河与恒星同框架"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "当前技术债"
        },
        {
          "type": "paragraph",
          "html": "视角语义尚未完全从 D3 transform、epoch-frame 和 reference-overlays 解耦。局部修 center/roll 可能暂时修好一个投影，却破坏另一套框架。长期应建立统一 CoordinateViewSpec：明确 source frame、display frame、camera rule、static-layer policy、default anchor 和 up anchor。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://github.com/ofrohn/d3-celestial\" target=\"_blank\" rel=\"noopener noreferrer\">D3-Celestial 项目</a>；<a href=\"https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/MATLAB/req/frames.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL NAIF：参考框架系统</a>；<code>src/config.ts</code>（项目实现）；<code>src/sky/projection.ts</code>（项目实现）；<code>src/sky/view-mode-switching.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "time-render-chain",
      "title": "43. 坐标视角基准与时间更新链路",
      "blocks": [
        {
          "type": "paragraph",
          "html": "一次时间变化至少涉及：解析新 UTC、计算 LST、更新地平相机、计算太阳/月球/行星、更新状态文字和重绘。是否重算固定星空几何取决于框架策略，不能由 reason 字符串随意决定。"
        },
        {
          "type": "code",
          "text": "time changed\n├─ validate / commit instant\n├─ update sidereal time and observer-dependent values\n├─ if horizontal: update camera center\n├─ update dynamic bodies and moon phase\n├─ static fixed frame: keep geometry unless epoch policy changed\n├─ one coalesced redraw\n└─ save state + debug metrics"
        },
        {
          "type": "paragraph",
          "html": "理想规则：horizontal 的 time affects camera=yes；equatorial/ecliptic/galactic 是 fixed frame，普通播放 time affects static layers=no。epoch-frame.ts、reference-overlays.ts 和 view-mode-switching.ts 必须共享这一约定。"
        },
        {
          "type": "subheading",
          "html": "性能原则"
        },
        {
          "type": "list",
          "items": [
            "同一用户动作内合并重复 redraw。",
            "固定层同步只在 dirty key 变化时执行。",
            "resize 与投影重建分开记录。",
            "异步数据加载完成可请求一次合并重绘，不要每个分片各自三连稳定化。"
          ]
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://aa.usno.navy.mil/data/siderealtime\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：恒星时</a>；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：requestAnimationFrame</a>；<code>src/runtime/app-animation.ts</code>（项目实现）；<code>src/sky/epoch-frame.ts</code>（项目实现）；<code>src/sky/reference-overlays.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "render-pipeline",
      "title": "44. 星图绘制总管线：从数据到屏幕",
      "blocks": [
        {
          "type": "code",
          "text": "registerSkyData(key, payload)\n→ loader.js registry / deep clone\n→ catalog-registry.ts logical paths\n→ celestial-display.ts builds D3-Celestial config\n→ Celestial.display() loads base layers\n→ Celestial.add()/custom redraw registers overlays\n→ renderer.ts synchronizes map/canvas/svg sizes\n→ search/picking caches display coordinates\n→ debug-overlay.ts records frame/model state"
        },
        {
          "type": "subheading",
          "html": "大致图层顺序"
        },
        {
          "type": "list",
          "items": [
            "背景与银河 mask/银河填充。",
            "坐标网格、恒星、亮深空对象。",
            "西方星座线、名称和 IAU 边界。",
            "中国星官线/名、传统天区与标签。",
            "黄道、天赤道、地平线、地平网、银道参考线。",
            "太阳、月亮、行星与月相盘。",
            "搜索 reticle、选择 reticle。",
            "HTML 信息浮窗和 UI 控件（不在 Canvas 图层内）。"
          ]
        },
        {
          "type": "paragraph",
          "html": "实际顺序受 D3-Celestial 的 raw/json layer 注册和项目 overlay redraw 顺序影响。开发者添加新图层时，要明确它是静态数据、动态天体、屏幕标签还是 HTML 覆盖层，并决定是否受坐标 transform、clip、DPR 和时间影响。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://github.com/ofrohn/d3-celestial\" target=\"_blank\" rel=\"noopener noreferrer\">D3-Celestial 项目</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Canvas 2D</a>；<code>src/data/loader.js</code>（项目实现）；<code>src/data/catalog-registry.ts</code>（项目实现）；<code>src/sky/celestial-display.ts</code>（项目实现）；<code>src/sky/renderer.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "base-layers",
      "title": "45. 基础图层：恒星、深空、星座、边界与银河",
      "blocks": [
        {
          "type": "subheading",
          "html": "恒星"
        },
        {
          "type": "paragraph",
          "html": "D3-Celestial 按 stars.limit 过滤星等，用 starSize/exponent 把星等映射为点半径，按 B−V/样式决定颜色。propernameLimit 和内部 zoom 共同影响标签。项目保存原始目录坐标供拾取和信息显示。"
        },
        {
          "type": "subheading",
          "html": "深空"
        },
        {
          "type": "paragraph",
          "html": "dsos 配置控制亮 DSO 点、名称阈值和符号。当前点表精选 228 个对象，名称表更大。深空图标是类型化标记，不按真实角面积绘制。"
        },
        {
          "type": "subheading",
          "html": "西方星座与边界"
        },
        {
          "type": "paragraph",
          "html": "星座线、名称和 IAU 边界由本地数据分片注册给 D3-Celestial。边界诊断统计配对、断点、日期线和极区片段，但不手绘想象边界。"
        },
        {
          "type": "subheading",
          "html": "银河"
        },
        {
          "type": "paragraph",
          "html": "银河数据以 MultiPolygon 轮廓填充，多个透明层叠加形成深浅。它是基础图层，但坐标同步、mask 和投影断裂容易成为复杂问题。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://github.com/ofrohn/d3-celestial\" target=\"_blank\" rel=\"noopener noreferrer\">D3-Celestial 项目</a>；<a href=\"https://www.iau.org/Iau/Science/What-we-do/The-Constellations.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU：88 个现代星座与官方边界</a>；<a href=\"https://dc.zah.uni-heidelberg.de/openngc/q/web/form\" target=\"_blank\" rel=\"noopener noreferrer\">GAVO/OpenNGC：NGC/IC 开放数据库</a>；<code>src/sky/celestial-display.ts</code>（项目实现）；<code>src/data/boundary-diagnostics.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "dso-rendering",
      "title": "46. 深空绘制、别名与目录来源的工程实现",
      "blocks": [
        {
          "type": "paragraph",
          "html": "<code>deep-sky-bright.js</code> 是绘制/点击点表；<code>deep-sky-names.js</code> 是名称和别名表。名称表条目多于点表，所以搜索命中必须检查是否有可绘制坐标，不能假定每个别名都有独立点。"
        },
        {
          "type": "subheading",
          "html": "字段合并"
        },
        {
          "type": "list",
          "items": [
            "<code>id/desig</code>：主显示编号，如 M 31 或 C 14。",
            "<code>messier/caldwell/ngc/ic</code>：交叉目录字段。",
            "<code>objectTitle/aliases</code>：常用名和语言别名。",
            "<code>type/morph</code>：对象类型和星系形态。",
            "<code>mag/dim</code>：目录亮度与角尺寸，缺失时不应伪造。",
            "<code>source/sourceCatalog</code>：记录字段来源，避免把混合整理说成单一权威目录。"
          ]
        },
        {
          "type": "subheading",
          "html": "扩展到全量目录前的要求"
        },
        {
          "type": "paragraph",
          "html": "需要球面空间索引、按视场/星等加载、标签优先级、对象聚类、许可证传播和内存预算。把几万对象一次塞进 Canvas 搜索和每帧遍历，会直接破坏交互性能。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA/Hubble：Messier 目录与历史</a>；<a href=\"https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-caldwell-catalog/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA/Hubble：Caldwell 目录</a>；<a href=\"https://dc.zah.uni-heidelberg.de/openngc/q/web/form\" target=\"_blank\" rel=\"noopener noreferrer\">GAVO/OpenNGC：NGC/IC 开放数据库</a>；<a href=\"https://www.saguaroastro.org/sac-downloads/\" target=\"_blank\" rel=\"noopener noreferrer\">Saguaro Astronomy Club：SAC 深空数据库</a>；<code>src/data/deep-sky/</code>（项目实现）；<code>src/data/object-search-index.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "label-rules",
      "title": "47. 名称显示规则与标签密度",
      "blocks": [
        {
          "type": "paragraph",
          "html": "文字比星点占屏幕空间大得多，因此“全部显示名字”通常不可读。标签系统需要阈值、优先级、碰撞避让和文化/语言选择。"
        },
        {
          "type": "table",
          "headers": [
            "标签",
            "控制方式",
            "避让/风险"
          ],
          "rows": [
            [
              "恒星专名",
              "propernameLimit × 内部 zoom、showStarNames",
              "过密；裸数字/单字序号"
            ],
            [
              "DSO 名称",
              "namesType、nameLimit、showDeepSky",
              "多目录别名重复"
            ],
            [
              "西方星座名",
              "文化模式、D3 label",
              "与中国标签重叠"
            ],
            [
              "中国星官名",
              "自定义 Canvas 文本、星官数据",
              "密集小星官难放置"
            ],
            [
              "传统天区名",
              "detail 档位、约 42px 屏幕避让",
              "代表点不等于区域几何中心"
            ],
            [
              "行星名",
              "动态位置、自定义约 34px 避让",
              "行星接近时名称需错开"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "名称上下文"
        },
        {
          "type": "paragraph",
          "html": "裸 Flamsteed 数字应补星座上下文；中文“一、二、三”可能是星官内部序号，应尽量显示完整星官名或在浮窗解释。标签视觉简化不能改写原始星名数据，否则 D3-Celestial 的字段约定和搜索索引可能失配。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iau.org/WG280/WG280/Home.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU 恒星命名工作组</a>；<a href=\"https://github.com/ofrohn/d3-celestial\" target=\"_blank\" rel=\"noopener noreferrer\">D3-Celestial 项目</a>；<code>src/data/star-display.ts</code>（项目实现）；<code>src/sky/culture-overlays.ts</code>（项目实现）；<code>src/sky/traditional-regions-overlay.ts</code>（项目实现）；<code>src/sky/planet-overlay.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "chinese-overlays",
      "title": "48. 中国文化图层：星官线、星官名、传统天区与主题战场",
      "blocks": [
        {
          "type": "paragraph",
          "html": "<code>culture-overlays.ts</code> 负责中国星官线、名称和中西共线分析；<code>traditional-regions-overlay.ts</code> 负责区域边界与标签。它们是项目覆盖层，不由 D3-Celestial 自动理解。"
        },
        {
          "type": "subheading",
          "html": "传统天区 detail 档位"
        },
        {
          "type": "table",
          "headers": [
            "档位",
            "显示重点"
          ],
          "rows": [
            [
              "major",
              "三垣、四象和主要大区，最清爽"
            ],
            [
              "battlefields",
              "加入井宿边防、天市秩序等主题区域"
            ],
            [
              "mansions",
              "加入二十八宿层级，最密集"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "区域 kind 可区分 enclosure、symbol、southpolar、mansion、battlefield。边界是现代教学可视化复原，不是 IAU 那样的全天法定分区；文化解释来自独立 culture-notes，缺失不影响几何。"
        },
        {
          "type": "subheading",
          "html": "来源与语义"
        },
        {
          "type": "paragraph",
          "html": "星官名称和分区优先对照香港太空馆、国际敦煌项目和古籍。自动生成的通用说明只能作为兜底，重点星官应有人工作关系叙事，例如天市垣的帝座/候/斗斛/列肆，井宿的军市/野鸡/天狼/弧矢。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://hk.space.museum/sc/web/spm/resources/teachers-corner/constellations-and-myths/glossary-of-chinese-star-regions-asterisms-and-star-names.html\" target=\"_blank\" rel=\"noopener noreferrer\">香港太空馆：中国星区、星官及星名英译表</a>；<a href=\"https://idp.bl.uk/learning/chinese-astronomy/articles/the-chinese-sky/the-regions-of-the-sky/\" target=\"_blank\" rel=\"noopener noreferrer\">国际敦煌项目：中国天空区域</a>；<a href=\"https://ctext.org/shiji/tian-guan-shu/zhs\" target=\"_blank\" rel=\"noopener noreferrer\">《史记·天官书》电子文本</a>；<code>src/sky/culture-overlays.ts</code>（项目实现）；<code>src/sky/traditional-regions-overlay.ts</code>（项目实现）；<code>src/data/culture-notes.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "dual-culture-lines",
      "title": "49. 中西双体系共线段的屏幕双轨绘制",
      "blocks": [
        {
          "type": "paragraph",
          "html": "同一对恒星可能同时出现在西方星座线和中国星官线中。若完全重叠，后画的一条会遮住前一条，用户误以为只显示了一套体系。项目把线段端点标准化为经纬坐标 key，检测共线后在屏幕空间沿法线方向做小偏移。"
        },
        {
          "type": "code",
          "text": "normalize endpoints → stable segment key\nif westernKey == chineseKey and cultureMode == both:\n    project endpoints to screen\n    n = perpendicular(unit(p2 - p1))\n    draw western at +offset*n\n    draw chinese at -offset*n\n    short segments: halo / staggered dash"
        },
        {
          "type": "paragraph",
          "html": "这个偏移只用于屏幕可读性，不改变天球坐标、搜索位置或星官/星座成员关系。缩放后偏移应保持 CSS 像素级，而不是固定角度，否则高倍时会离开恒星。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Canvas 2D</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/sky/culture-overlays.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "milky-way-rendering",
      "title": "50. 银河 MultiPolygon、透明填充、断裂线与反色问题",
      "blocks": [
        {
          "type": "paragraph",
          "html": "项目银河不是照片，而是若干 Feature/MultiPolygon 轮廓。绘制流程是 ring 坐标转换、投影、裁剪、填充和多层透明叠加。多层重合区域自然更深。"
        },
        {
          "type": "code",
          "text": "FeatureCollection\n→ Feature\n→ MultiPolygon\n→ Polygon rings\n→ coordinate transform\n→ split/clip at projection discontinuity\n→ screen path\n→ fill + mask"
        },
        {
          "type": "subheading",
          "html": "反色/翻折的常见根因"
        },
        {
          "type": "list",
          "items": [
            "多边形跨 ±180° 经线或投影断裂线，没有先切段，路径连接到画布另一侧。",
            "靠近坐标极点，投影雅可比退化，ring 顺序和裁剪更敏感。",
            "前景银河与背景 mask 使用不同几何或不同历元。",
            "代码对 <code>.milkyWayBg/.mwbg</code> ring 做 reverse，与 Canvas 非零绕组填充规则冲突。",
            "多个透明面误把“外部”当内部，形成整片反色。"
          ]
        },
        {
          "type": "subheading",
          "html": "修复原则"
        },
        {
          "type": "paragraph",
          "html": "银河固定在稳定源框架；普通时间不改写几何。跨断裂线先 split；前景和 mask 使用同一份已裁剪几何；统一 winding 或明确 even-odd 规则；Debug 输出每个 polygon 的可见段数、断裂次数、跨极点标记和面积符号。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Canvas 2D</a>；<code>src/data/milky-way/milky-way.js</code>（项目实现）；<code>src/sky/epoch-frame.ts</code>（项目实现）；<code>src/sky/celestial-display.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "reference-overlays",
      "title": "51. 参考线和网格：地平线、地平网、赤道、黄道与银道",
      "blocks": [
        {
          "type": "paragraph",
          "html": "参考线通常通过在理论曲线上采样大量点，转换到当前显示坐标，再投影成折线。采样太少会棱角明显，太多会增加每帧计算；跨 clip 边界时必须断开路径，不能用直线穿过不可见区。"
        },
        {
          "type": "table",
          "headers": [
            "图层",
            "生成方式",
            "注意"
          ],
          "rows": [
            [
              "地平线",
              "方位 0–360°、Alt=0 采样",
              "依赖地点/时间和当前视角"
            ],
            [
              "地平网",
              "高度 15/30/45/60/75°，方位约每30°",
              "天顶附近经线汇聚"
            ],
            [
              "天赤道",
              "Dec=0 的大圆",
              "date-of-date 与显示框架一致"
            ],
            [
              "赤道网标签",
              "选定 RA/Dec 交点绘字",
              "标签避让和裁剪"
            ],
            [
              "黄道",
              "J2000 黄道点转赤道/当前框架",
              "避免与 epoch transform 双重转换"
            ],
            [
              "银道赤道",
              "b=0° 采样",
              "galactic 视角下应与银河带固定"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "远日期黄道偏移是重点风险：如果黄道采样先转 date-of-date，静态图层又被 epoch-frame 转一次，或 D3 ecliptic transform 再参与，结果会重复。每条参考线都应声明 source frame 和 display frame。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://aa.usno.navy.mil/faq/alt_az\" target=\"_blank\" rel=\"noopener noreferrer\">美国海军天文台：赤道坐标转高度方位</a>；<a href=\"https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/MATLAB/req/frames.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL NAIF：参考框架系统</a>；<a href=\"https://d3js.org/d3-geo\" target=\"_blank\" rel=\"noopener noreferrer\">D3 Geo：球面地理投影</a>；<code>src/sky/reference-overlays.ts</code>（项目实现）；<code>src/astronomy/coordinates.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "planet-overlay",
      "title": "52. 太阳、月亮、行星和月相覆盖层",
      "blocks": [
        {
          "type": "paragraph",
          "html": "项目关闭 D3-Celestial 内置 planets，使用 <code>planet-overlay.ts</code> 自己绘制，便于统一当前时间、轻量算法、名称避让、点击拾取和月相盘。"
        },
        {
          "type": "code",
          "text": "compute body RA/Dec\n→ precess/convert to current display epoch\n→ coordinate-view transform\n→ Celestial.clip(coord)\n→ Celestial.mapProjection(coord)\n→ draw symbol or moon phase disk\n→ place label if >34px from occupied labels\n→ cache screen/display/source coordinates for picking"
        },
        {
          "type": "subheading",
          "html": "月相扫描线"
        },
        {
          "type": "paragraph",
          "html": "月相盘直径取配置最小值和月球符号尺寸中的较大者。对圆内每条 y 扫描线求半弦长度，再按 illumination 计算 terminator x；waxing/waning 决定亮面在屏幕哪侧，最后画描边。若相机 roll 或坐标轴镜像改变，视觉“亮面方向”还需和太阳屏幕方向核对。"
        },
        {
          "type": "subheading",
          "html": "动态位置与搜索"
        },
        {
          "type": "paragraph",
          "html": "动态天体每次搜索时按当前时间加入候选，不能像恒星一样永久缓存 displayCoord。拾取使用约 20 CSS px 半径，并保留 source/epoch/display 三套坐标供浮窗解释。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://svs.gsfc.nasa.gov/5587/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：月相可视化与月球照明</a>；<a href=\"https://science.nasa.gov/solar-system/skywatching/planetary-alignments-and-planet-parades/\" target=\"_blank\" rel=\"noopener noreferrer\">NASA：行星与黄道附近的视运动</a>；<a href=\"https://ssd.jpl.nasa.gov/planets/approx_pos.html\" target=\"_blank\" rel=\"noopener noreferrer\">JPL：行星近似位置与适用范围</a>；<code>src/sky/planet-overlay.ts</code>（项目实现）；<code>src/astronomy/moon-phase.ts</code>（项目实现）；<code>src/data/object-search-index.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "search-reticles",
      "title": "53. 搜索索引、搜索标记与选中标记",
      "blocks": [
        {
          "type": "paragraph",
          "html": "<code>object-search-index.ts</code> 汇总恒星、DSO、星座、星官和当前行星。静态对象按语言/文化模式缓存，输入统一大小写、空格、编号前缀和别名。空搜索可给出亮星建议。"
        },
        {
          "type": "subheading",
          "html": "定位与选中的区别"
        },
        {
          "type": "list",
          "items": [
            "搜索定位：程序主动把目标移到合适视区，并画黄色/强调 reticle。",
            "点击选中：用户在当前屏幕命中对象，画 selection reticle 和浮窗。",
            "两者都必须使用实际显示坐标，不能只用 J2000 source 坐标。",
            "坐标视角切换或时间变化后，动态行星和 epoch display 坐标需要重新计算。"
          ]
        },
        {
          "type": "subheading",
          "html": "DSO 与别名"
        },
        {
          "type": "paragraph",
          "html": "深空搜索读取主 id、desig、Messier/Caldwell/NGC/IC 字段、常用名和 aliases。同一目标应合并候选，避免 M 31、NGC 224 和 Andromeda Galaxy 显示为三个物理对象。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iau.org/WG280/WG280/Home.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU 恒星命名工作组</a>；<a href=\"https://dc.zah.uni-heidelberg.de/openngc/q/web/form\" target=\"_blank\" rel=\"noopener noreferrer\">GAVO/OpenNGC：NGC/IC 开放数据库</a>；<code>src/data/object-search-index.ts</code>（项目实现）；<code>src/ui/object-search.ts</code>（项目实现）；<code>src/sky/layers.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "picking-popup",
      "title": "54. 点击拾取、CSS 像素、反投影与信息浮窗",
      "blocks": [
        {
          "type": "paragraph",
          "html": "拾取在屏幕 CSS 像素空间比较距离：动态太阳系约 20px、恒星约 12px、DSO 约 15px、星座名和星官名约 18px。高分屏 Canvas bitmap 可能是 CSS 尺寸的 DPR 倍，但 D3-Celestial mapProjection 和 PointerEvent client 坐标都以 CSS 像素解释，因此点击坐标不应再乘 DPR。"
        },
        {
          "type": "subheading",
          "html": "命中流程"
        },
        {
          "type": "code",
          "text": "pointer event → canvas bounding rect → CSS x/y\n→ project each visible candidate displayCoord\n→ distance in CSS px\n→ choose nearest within type radius\n→ showObjectInfo + selection reticle\nno candidate → clear selection only"
        },
        {
          "type": "paragraph",
          "html": "空白点击不做反投影浮窗，是 5.5.5 之后的设计选择：避免用户误以为任意方向是“对象”。开发者若未来增加“坐标探针模式”，应做成显式工具，与对象选择模式分开。"
        },
        {
          "type": "subheading",
          "html": "浮窗事件层"
        },
        {
          "type": "paragraph",
          "html": "浮窗需要高 z-index、<code>user-select:text</code>、内部滚动，并在 pointerdown/click/wheel 阻止事件穿透；来源链接使用新窗口和 noopener。关闭浮窗只清 UI 状态，不改星图中心。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Pointer events</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Canvas 2D</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/CSS/user-select\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：user-select</a>；<code>src/sky/object-picking.ts</code>（项目实现）；<code>src/ui/object-info.ts</code>（项目实现）；<code>src/styles.css</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "viewport-performance",
      "title": "55. resize、viewport canvas、DPR 与渲染性能",
      "blocks": [
        {
          "type": "paragraph",
          "html": "<code>projectionCanvasMetrics()</code> 先根据星图区、投影天然 ratio 和 0.96 边距求基础画布，再乘 mapScale 得到虚拟星图。当虚拟宽高都超过视口时进入 VIEWPORT_CANVAS：物理 Canvas 保持视口大小，把视觉放大交给 D3 内部 zoom，避免创建巨型 bitmap。"
        },
        {
          "type": "table",
          "headers": [
            "模式",
            "Canvas CSS/bitmap",
            "优点",
            "代价"
          ],
          "rows": [
            [
              "FULL",
              "完整虚拟星图尺寸 × DPR",
              "低倍全天图完整、实现直观",
              "高倍时内存和清屏成本暴涨"
            ],
            [
              "VIEWPORT_CANVAS",
              "视口尺寸 × DPR，internalZoom 补偿",
              "高倍局部只画可见位图",
              "需要正确同步中心、clip 和标签"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "DPR 与 resize"
        },
        {
          "type": "paragraph",
          "html": "Canvas 的 CSS 宽高决定布局，bitmap 宽高决定像素清晰度。修改 canvas.width/height 会重置上下文状态，项目随后恢复 DPR transform。窗口、visualViewport、横竖屏、Panel 和字体变化都可能触发 resize，应 debounce/coalesce。"
        },
        {
          "type": "subheading",
          "html": "方向键逐帧平移"
        },
        {
          "type": "paragraph",
          "html": "keydown 只设置方向状态，requestAnimationFrame 按时间差推进角度，keyup/blur 清除状态。这样速度与键盘重复率无关，也避免一帧积压多个重绘。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：ResizeObserver</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：requestAnimationFrame</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Canvas 2D</a>；<code>src/sky/renderer.ts</code>（项目实现）；<code>src/sky/keyboard-pan.ts</code>（项目实现）；<code>src/runtime/app-animation.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "performance-profiler",
      "title": "56. UI Performance Profiler：如何测试而不误判",
      "blocks": [
        {
          "type": "paragraph",
          "html": "性能测试由 <code>ENABLE_UI_PERFORMANCE_TEST</code> 一个总开关控制。关闭时不运行测试、不创建报告页；开启后等待首帧稳定，执行少量基线和真实组合场景，最后恢复原状态并弹出可复制纯文本报告。"
        },
        {
          "type": "subheading",
          "html": "状态判定"
        },
        {
          "type": "table",
          "headers": [
            "状态",
            "条件"
          ],
          "rows": [
            [
              "PASS",
              "动作完成、后置状态正确、耗时未超阈值"
            ],
            [
              "SLOW",
              "动作和状态正确，但超过慢操作阈值"
            ],
            [
              "FAILED",
              "控件缺失、抛错、超时或后置状态不符"
            ],
            [
              "INCOMPLETE",
              "测试被刷新/弹窗阻止/框架异常中断"
            ],
            [
              "PASS_WITH_WARNINGS",
              "整体完成但存在慢动作或恢复警告"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "组合测试为何比遍历按钮更有价值"
        },
        {
          "type": "paragraph",
          "html": "真实卡顿常来自链式操作：坐标切换 + 投影 + 图层加载、地平视角 + 时间跳转、银河 + 参考线、键盘连续平移。单个按钮可能很快，组合却触发重复 redraw、fixedLayerSync 和 resize。测试保留少量单项基线，用组合定位实际工作流。"
        },
        {
          "type": "subheading",
          "html": "测量点"
        },
        {
          "type": "list",
          "items": [
            "action total、wait-for-stable。",
            "redraw.total / Celestial.redraw。",
            "fixedLayerSync：次数、耗时、reason、跳过/拦截次数。",
            "canvas.resize.total、skyView.update、follow-up redraw。",
            "state.save、debug.updateOverlay、restoreState。",
            "未来应加 long task、每帧预算、overlay 分层耗时和实际绘制对象数。"
          ]
        },
        {
          "type": "warning",
          "html": "自动测试本身包含等待和恢复时间。报告应把“人为等待”与“主线程执行耗时”分开，否则组合场景总时长不能直接当作用户点击延迟。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：requestAnimationFrame</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：Canvas 2D</a>；<code>src/testing/ui-performance-runner.ts</code>（项目实现）；<code>src/app.ts</code>（项目实现）；<code>src/config.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "technical-debt",
      "title": "57. 当前已知问题与技术债",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "类别",
            "当前状态",
            "后续方向"
          ],
          "rows": [
            [
              "app.ts 装配层",
              "仍约数千行，连接大量 services 和状态桥",
              "拆 application services，但保留单一装配入口"
            ],
            [
              "Debug",
              "字段和诊断文案集中、体量较大",
              "按 layout/frame/performance/error 分模块"
            ],
            [
              "坐标框架",
              "D3 transform、epoch-frame、参考线存在混用风险",
              "统一 CoordinateViewSpec 和 frame contract"
            ],
            [
              "远日期黄道",
              "可能发生双重转换/框架不一致",
              "给每层声明 source/display frame，写回归测试"
            ],
            [
              "银河反色",
              "MultiPolygon winding、mask、断裂线、极点共同作用",
              "稳定源框架、split、统一 fill rule、几何诊断"
            ],
            [
              "固定层性能",
              "历史报告出现重复 fixedLayerSync、stabilization redraw",
              "dirty key 白名单、批处理 redraw、自动基准"
            ],
            [
              "深空规模",
              "当前亮对象精选，不是全量 OpenNGC/SAC",
              "空间索引、按视场加载、标签预算"
            ],
            [
              "文化数据",
              "百科文本增长快",
              "坐标/短摘要/长文化分层，按需加载可能性"
            ],
            [
              "localStorage",
              "错误 center/roll 可长期污染",
              "提升 schema、迁移与安全默认"
            ],
            [
              "构建资料",
              "运行包单文件，源码包需保留可靠脚本",
              "构建校验和版本一致性自动化"
            ]
          ]
        },
        {
          "type": "paragraph",
          "html": "技术债章节不是承诺“下一版一定全部修复”，而是避免维护者把已知限制当新 bug，也避免用局部补丁掩盖跨模块契约问题。每次修改应附可复现报告和前后数据。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>docs/ARCHITECTURE_GUIDE.md</code>（项目架构说明）；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<a href=\"https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame\" target=\"_blank\" rel=\"noopener noreferrer\">MDN：requestAnimationFrame</a>；<code>docs/ARCHITECTURE_GUIDE.md</code>（项目实现）；<code>docs/VERSION_HISTORY.md</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "data-content-management",
      "title": "58. 数据文件、文化内容、帮助文档与 UI 文案管理",
      "blocks": [
        {
          "type": "paragraph",
          "html": "数据分层的核心是“变化频率和职责不同”：恒星/边界几何稳定且体量大；名称表服务搜索；文化百科长文本可不断扩写；帮助文档解释功能；UI 文案需要双语和短句。把它们分开，才能在不改算法的情况下扩充内容。"
        },
        {
          "type": "table",
          "headers": [
            "层",
            "当前入口",
            "维护规则"
          ],
          "rows": [
            [
              "天文目录/几何",
              "src/data/** JS 分片 + catalog-registry.ts",
              "保留注册 key 和结构；记录来源/许可证"
            ],
            [
              "名称/别名",
              "star-names.js、deep-sky-names.js",
              "用于搜索显示，不代表可绘制全量"
            ],
            [
              "文化百科",
              "culture-notes.ts",
              "可选增强，sourceIds 必须有效，不改坐标"
            ],
            [
              "帮助文档",
              "content/help-manual.ts",
              "结构化章节，每章末参考链接"
            ],
            [
              "UI 文案",
              "ui/i18n.ts、text.ts",
              "短文本、稳定 key、避免把百科塞进翻译表"
            ],
            [
              "维护 docs",
              "docs/*.md",
              "面向开发者，必须匹配当前代码和构建"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "未来拆分建议"
        },
        {
          "type": "paragraph",
          "html": "文化文本继续增长时，可拆 <code>culture-extended.ts</code>、<code>butiange.ts</code>、<code>deep-sky-notes.ts</code>；但查询层保持统一接口“有则显示、无则跳过”。帮助文档可按章节模块拆分后在构建时合并，避免单文件过大。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>docs/DATA_SOURCES.md</code>（项目数据来源说明）；<code>docs/CULTURE_DATA_GUIDE.md</code>（项目文化数据维护指南）；<a href=\"https://esbuild.github.io/api/\" target=\"_blank\" rel=\"noopener noreferrer\">esbuild 构建 API</a>；<code>src/data/catalog-registry.ts</code>（项目实现）；<code>src/data/content/help-manual.ts</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "architecture-build",
      "title": "59. 源码架构、构建产物与维护边界",
      "blocks": [
        {
          "type": "subheading",
          "html": "当前源码路径"
        },
        {
          "type": "table",
          "headers": [
            "路径",
            "职责"
          ],
          "rows": [
            [
              "index.html",
              "唯一页面壳和运行入口"
            ],
            [
              "src/main.ts",
              "依次加载配置、文化数据和应用"
            ],
            [
              "src/app.ts",
              "高层状态、服务装配和生命周期协调"
            ],
            [
              "src/config.ts",
              "默认状态、交互、主题、坐标视角和测试总开关"
            ],
            [
              "src/astronomy/*",
              "时间、恒星时、坐标、岁差、太阳/月亮/行星近似"
            ],
            [
              "src/sky/*",
              "投影、渲染、覆盖层、视角、拾取、键盘和指针交互"
            ],
            [
              "src/ui/*",
              "页面骨架、控件、帮助、搜索、对象信息、Debug"
            ],
            [
              "src/state/*",
              "默认状态和保存恢复"
            ],
            [
              "src/data/*",
              "天文目录、名称、文化和内容"
            ],
            [
              "docs/*",
              "架构、构建、来源、版本和维护说明"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "5.5.7 构建边界"
        },
        {
          "type": "paragraph",
          "html": "源码修改集中在 src、vendor、docs 和构建脚本；<code>assets/app.js</code>、<code>assets/app.css</code> 是生成物，不手写。发布运行只需根目录 index.html + assets 两文件；源码包保留 package.json、tsconfig、scripts、vendor 和数据分片以便重建。"
        },
        {
          "type": "subheading",
          "html": "用户操作到屏幕"
        },
        {
          "type": "code",
          "text": "UI event\n→ state/service action\n→ time/coordinate calculation\n→ view transform/projection\n→ base + custom overlays redraw\n→ size/picking caches\n→ debug + storage"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><code>docs/ARCHITECTURE_GUIDE.md</code>（项目架构说明）；<code>docs/BUILD_GUIDE.md</code>（项目构建说明）；<a href=\"https://esbuild.github.io/api/\" target=\"_blank\" rel=\"noopener noreferrer\">esbuild 构建 API</a>；<code>README.md</code>（项目实现）；<code>docs/BUILD_GUIDE.md</code>（项目实现）。"
        }
      ]
    },
    {
      "id": "glossary",
      "title": "60. 术语表与 5.5.7 文档版本说明",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "术语",
            "含义"
          ],
          "rows": [
            [
              "RA / Dec",
              "赤经 / 赤纬"
            ],
            [
              "Alt / Az",
              "高度角 / 方位角"
            ],
            [
              "HA / H",
              "小时角"
            ],
            [
              "LST / GAST",
              "地方恒星时 / 格林尼治视恒星时"
            ],
            [
              "J2000",
              "常用参考历元/取向标签"
            ],
            [
              "epoch-of-date",
              "与当前日期对应的显示参考框架"
            ],
            [
              "ICRS",
              "国际天球参考系统"
            ],
            [
              "ecliptic",
              "黄道/黄道坐标"
            ],
            [
              "galactic",
              "银河坐标"
            ],
            [
              "precession / nutation",
              "岁差 / 章动"
            ],
            [
              "proper motion",
              "恒星自行"
            ],
            [
              "projection",
              "把球面映到平面"
            ],
            [
              "conformal / equal-area",
              "保角 / 等面积"
            ],
            [
              "quaternion",
              "四元数姿态表示"
            ],
            [
              "Euler angles",
              "欧拉角"
            ],
            [
              "gimbal lock",
              "万向节死锁/参数奇异"
            ],
            [
              "DSO",
              "深空天体"
            ],
            [
              "Messier / Caldwell",
              "两套常用亮深空观测目录"
            ],
            [
              "NGC / IC",
              "新总表及索引星表"
            ],
            [
              "SAC / OpenNGC",
              "业余观测数据库 / 现代开放 NGC/IC 整理"
            ],
            [
              "MultiPolygon / ring",
              "多多边形 / 多边形环"
            ],
            [
              "winding / clip",
              "环方向 / 裁剪"
            ],
            [
              "overlay / raw layer",
              "项目覆盖层 / D3-Celestial 原始层"
            ],
            [
              "viewport canvas",
              "高倍时只保留视口大小的物理画布"
            ],
            [
              "DPR",
              "设备像素比"
            ],
            [
              "reticle",
              "搜索或选择十字标记"
            ],
            [
              "ephemeris",
              "星历/天体位置表或计算"
            ],
            [
              "illumination / elongation",
              "照明比例 / 日月或天体角距"
            ],
            [
              "localStorage",
              "浏览器本地键值存储"
            ]
          ]
        },
        {
          "type": "subheading",
          "html": "5.5.7 文档更新"
        },
        {
          "type": "paragraph",
          "html": "本版本把页内说明书扩展为 60 章，覆盖实际 5.5.7 代码中的单文件发布、14 种投影、4 种坐标视角、亮深空目录、文化百科、月相圆盘、对象拾取、viewport canvas、性能测试和已知技术债。每章末附可打开的外部参考资料，并列出相关项目源码路径。"
        },
        {
          "type": "note",
          "html": "说明书会随代码更新。若页面行为与文档冲突，以当前构建的代码和 Debug 为准，并在下一次维护中同步修正文档；不要让旧大纲反向定义不存在的功能。完整版本变化见 <code>docs/VERSION_HISTORY.md</code>。"
        },
        {
          "type": "note",
          "html": "<strong>本章参考资料：</strong><a href=\"https://www.iau.org/Iau/Science/What-we-do/The-Constellations.aspx\" target=\"_blank\" rel=\"noopener noreferrer\">IAU：88 个现代星座与官方边界</a>；<a href=\"https://www.iausofa.org/current-software\" target=\"_blank\" rel=\"noopener noreferrer\">IAU SOFA 基础天文算法库</a>；<code>README.md</code>（项目 README）；<code>docs/ARCHITECTURE_GUIDE.md</code>（项目架构说明）；<code>docs/DATA_SOURCES.md</code>（项目数据来源说明）；<code>docs/VERSION_HISTORY.md</code>（项目实现）；<code>docs/VERSION_HISTORY_DETAILED.md</code>（项目实现）。"
        }
      ]
    }
  ]
};

export const HELP_MANUAL_EN: HelpManual = {
  title: "Real Sky Observatory 5.5.7 Manual (Chinese full edition)",
  sections: HELP_MANUAL_ZH.sections.map((section) => ({
    id: section.id,
    title: section.title,
    blocks: section.blocks,
  })),
};

export function helpManualForLanguage(lang: string): HelpManual {
  return lang === "en" ? HELP_MANUAL_EN : HELP_MANUAL_ZH;
}
