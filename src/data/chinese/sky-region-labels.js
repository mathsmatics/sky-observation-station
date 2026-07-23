/* Real Sky Observatory data shard.
 * Source dataset key: traditional-regions/traditional.regions.labels.cn.json
 * This JS file is the editable source data for the browser runtime.
 */
window.registerSkyData(
  "traditional-regions/traditional.regions.labels.cn.json",
  {
    type: "FeatureCollection",
    name: "Chinese traditional sky region labels",
    features: [
      {
        type: "Feature",
        properties: {
          id: "ziwei",
          kind: "enclosure",
          name: "紫微垣",
          en: "Purple Forbidden Enclosure",
          level: "major",
          source: "Stellarium/D3-Celestial Chinese asterism wall lines",
          note: "依据左右垣星官连线生成的示意包络，不是现代法定边界。",
          members: ["紫微左垣", "紫微右垣"],
          approximate: true,
        },
        geometry: {
          type: "Point",
          coordinates: [-110, 70],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "taiwei",
          kind: "enclosure",
          name: "太微垣",
          en: "Supreme Palace Enclosure",
          level: "major",
          source: "Stellarium/D3-Celestial Chinese asterism wall lines",
          note: "依据左右垣星官连线生成的示意包络，不是现代法定边界。",
          members: ["太微左垣", "太微右垣"],
          approximate: true,
        },
        geometry: {
          type: "Point",
          coordinates: [185, 10],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "tianshi",
          kind: "enclosure",
          name: "天市垣",
          en: "Heavenly Market Enclosure",
          level: "major",
          source: "Stellarium/D3-Celestial Chinese asterism wall lines",
          note: "依据左右垣星官连线生成的示意包络，不是现代法定边界。",
          members: ["天市左垣", "天市右垣"],
          approximate: true,
        },
        geometry: {
          type: "Point",
          coordinates: [260, 7],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "baihu",
          kind: "symbol",
          name: "西方白虎",
          en: "White Tiger",
          level: "major",
          approximate: true,
          source:
            "Twenty-Eight Mansions longitudinal divisions; modern visualization",
          note: "按二十八宿宿次的赤经范围合并为四象的示意天区，不是 IAU 式法定边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [50, 42],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "zhuque",
          kind: "symbol",
          name: "南方朱雀",
          en: "Vermilion Bird",
          level: "major",
          approximate: true,
          source:
            "Twenty-Eight Mansions longitudinal divisions; modern visualization",
          note: "按二十八宿宿次的赤经范围合并为四象的示意天区，不是 IAU 式法定边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [140, -38],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "qinglong",
          kind: "symbol",
          name: "东方青龙",
          en: "Azure Dragon",
          level: "major",
          approximate: true,
          source:
            "Twenty-Eight Mansions longitudinal divisions; modern visualization",
          note: "按二十八宿宿次的赤经范围合并为四象的示意天区，不是 IAU 式法定边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-125, -38],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "xuanwu",
          kind: "symbol",
          name: "北方玄武",
          en: "Black Tortoise",
          level: "major",
          approximate: true,
          source:
            "Twenty-Eight Mansions longitudinal divisions; modern visualization",
          note: "按二十八宿宿次的赤经范围合并为四象的示意天区，不是 IAU 式法定边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-35, 38],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "southpolar",
          kind: "southpolar",
          name: "近南极星区",
          en: "Near South Polar Region",
          level: "major",
          approximate: true,
          source:
            "Twenty-Eight Mansions longitudinal divisions; modern visualization",
          note: "明末以后增补的近南极星官所在区域的示意带；不是早期三垣二十八宿体系的组成部分。",
        },
        geometry: {
          type: "Point",
          coordinates: [0, -70],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "north-battlefield",
          kind: "battlefield",
          name: "北方战场",
          en: "Northern Battlefield",
          level: "thematic",
          source:
            "Traditional military asterism narrative; CCTV/Chinese astronomy popularization",
          note: "围绕垒壁阵、羽林军、北落师门、天纲、天垒城、八魁等相关星官生成的文化主题示意范围，不是历史文献中的统一边界。",
          members: [
            "垒壁阵",
            "羽林军",
            "北落师门",
            "天纲",
            "天垒城",
            "八魁",
            "𫓧钺",
          ],
          approximate: true,
        },
        geometry: {
          type: "Point",
          coordinates: [-15, -18],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "northwest-battlefield",
          kind: "battlefield",
          name: "西北战场",
          en: "Northwestern Battlefield",
          level: "thematic",
          source:
            "Traditional military/frontier asterism narrative around Mao and Bi",
          note: "以昴、毕附近天街、天大将军及军旅/边塞星官生成的文化主题示意范围，不是标准化天区边界。",
          members: [
            "昴宿",
            "毕宿",
            "天街",
            "天大将军",
            "军南门",
            "天高",
            "天阴",
            "天廪",
            "天仓",
            "天囷",
            "五车",
            "参旗",
            "九斿",
          ],
          approximate: true,
        },
        geometry: {
          type: "Point",
          coordinates: [55, 35],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "south-battlefield",
          kind: "battlefield",
          name: "南方战场",
          en: "Southern Battlefield",
          level: "thematic",
          source: "Traditional southern military asterism narrative",
          note: "围绕翼、轸、角、亢、氐、房、心及库楼、骑官、阵车、青丘等星官生成的文化主题示意范围，不是标准化天区边界。",
          members: [
            "翼宿",
            "轸宿",
            "角宿",
            "亢宿",
            "氐宿",
            "房宿",
            "心宿",
            "青丘",
            "库楼",
            "骑官",
            "车骑",
            "阵车",
            "骑阵将军",
          ],
          approximate: true,
        },
        geometry: {
          type: "Point",
          coordinates: [-150, -40],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-奎宿",
          kind: "mansion",
          name: "奎宿",
          en: "Legs Mansion",
          level: "mansion",
          symbol: "西方白虎",
          symbolEn: "White Tiger",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [14.750499999999988, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-娄宿",
          kind: "mansion",
          name: "娄宿",
          en: "Bond Mansion",
          level: "mansion",
          symbol: "西方白虎",
          symbolEn: "White Tiger",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [30.087999999999994, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-胃宿",
          kind: "mansion",
          name: "胃宿",
          en: "Stomach Mansion",
          level: "mansion",
          symbol: "西方白虎",
          symbolEn: "White Tiger",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [41.67949999999999, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-昴宿",
          kind: "mansion",
          name: "昴宿",
          en: "Hairy Head Mansion",
          level: "mansion",
          symbol: "西方白虎",
          symbolEn: "White Tiger",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [56.75479999999999, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-毕宿",
          kind: "mansion",
          name: "毕宿",
          en: "Net Mansion",
          level: "mansion",
          symbol: "西方白虎",
          symbolEn: "White Tiger",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [64.99450000000002, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-觜宿",
          kind: "mansion",
          name: "觜宿",
          en: "Turtle Beak Mansion",
          level: "mansion",
          symbol: "西方白虎",
          symbolEn: "White Tiger",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [83.96590000000003, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-参宿",
          kind: "mansion",
          name: "参宿",
          en: "Three Stars Mansion",
          level: "mansion",
          symbol: "西方白虎",
          symbolEn: "White Tiger",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [83.71370000000002, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-井宿",
          kind: "mansion",
          name: "井宿",
          en: "Well Mansion",
          level: "mansion",
          symbol: "南方朱雀",
          symbolEn: "Vermilion Bird",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [101.62130000000002, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-鬼宿",
          kind: "mansion",
          name: "鬼宿",
          en: "Ghosts Mansion",
          level: "mansion",
          symbol: "南方朱雀",
          symbolEn: "Vermilion Bird",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [129.53510000000006, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-柳宿",
          kind: "mansion",
          name: "柳宿",
          en: "Willow Mansion",
          level: "mansion",
          symbol: "南方朱雀",
          symbolEn: "Vermilion Bird",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [134.00250000000005, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-星宿",
          kind: "mansion",
          name: "星宿",
          en: "Star Mansion",
          level: "mansion",
          symbol: "南方朱雀",
          symbolEn: "Vermilion Bird",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [142.45360000000005, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-张宿",
          kind: "mansion",
          name: "张宿",
          en: "Extended Net Mansion",
          level: "mansion",
          symbol: "南方朱雀",
          symbolEn: "Vermilion Bird",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [152.36109999999996, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-翼宿",
          kind: "mansion",
          name: "翼宿",
          en: "Wings Mansion",
          level: "mansion",
          symbol: "南方朱雀",
          symbolEn: "Vermilion Bird",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [170.70510000000002, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-轸宿",
          kind: "mansion",
          name: "轸宿",
          en: "Chariot Mansion",
          level: "mansion",
          symbol: "南方朱雀",
          symbolEn: "Vermilion Bird",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-174.6499, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-角宿",
          kind: "mansion",
          name: "角宿",
          en: "Horn Mansion",
          level: "mansion",
          symbol: "东方青龙",
          symbolEn: "Azure Dragon",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-157.51419999999996, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-亢宿",
          kind: "mansion",
          name: "亢宿",
          en: "Neck Mansion",
          level: "mansion",
          symbol: "东方青龙",
          symbolEn: "Azure Dragon",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-144.86270000000002, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-氐宿",
          kind: "mansion",
          name: "氐宿",
          en: "Root Mansion",
          level: "mansion",
          symbol: "东方青龙",
          symbolEn: "Azure Dragon",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-131.69939999999997, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-房宿",
          kind: "mansion",
          name: "房宿",
          en: "Room Mansion",
          level: "mansion",
          symbol: "东方青龙",
          symbolEn: "Azure Dragon",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-119.7097, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-心宿",
          kind: "mansion",
          name: "心宿",
          en: "Heart Mansion",
          level: "mansion",
          symbol: "东方青龙",
          symbolEn: "Azure Dragon",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-112.86609999999996, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-尾宿",
          kind: "mansion",
          name: "尾宿",
          en: "Tail Mansion",
          level: "mansion",
          symbol: "东方青龙",
          symbolEn: "Azure Dragon",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-100.28150000000005, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-箕宿",
          kind: "mansion",
          name: "箕宿",
          en: "Winnowing Basket Mansion",
          level: "mansion",
          symbol: "东方青龙",
          symbolEn: "Azure Dragon",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-86.25250000000005, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-斗宿",
          kind: "mansion",
          name: "斗宿",
          en: "Dipper Mansion",
          level: "mansion",
          symbol: "北方玄武",
          symbolEn: "Black Tortoise",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-79.91210000000001, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-牛宿",
          kind: "mansion",
          name: "牛宿",
          en: "Ox Mansion",
          level: "mansion",
          symbol: "北方玄武",
          symbolEn: "Black Tortoise",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-54.7088, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-女宿",
          kind: "mansion",
          name: "女宿",
          en: "Girl Mansion",
          level: "mansion",
          symbol: "北方玄武",
          symbolEn: "Black Tortoise",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-47.4588, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-虚宿",
          kind: "mansion",
          name: "虚宿",
          en: "Emptiness Mansion",
          level: "mansion",
          symbol: "北方玄武",
          symbolEn: "Black Tortoise",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-39.07709999999997, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-危宿",
          kind: "mansion",
          name: "危宿",
          en: "Rooftop Mansion",
          level: "mansion",
          symbol: "北方玄武",
          symbolEn: "Black Tortoise",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-30.70180000000005, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-室宿",
          kind: "mansion",
          name: "室宿",
          en: "Encampment Mansion",
          level: "mansion",
          symbol: "北方玄武",
          symbolEn: "Black Tortoise",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [-13.933099999999968, 2],
        },
      },
      {
        type: "Feature",
        properties: {
          id: "mansion-壁宿",
          kind: "mansion",
          name: "壁宿",
          en: "Wall Mansion",
          level: "mansion",
          symbol: "北方玄武",
          symbolEn: "Black Tortoise",
          approximate: true,
          source:
            "Twenty-Eight Mansion central-longitude midpoint visualization",
          note: "按相邻宿中心经度中点生成的现代示意宿域，仅用于结构展示，不代表唯一历史边界。",
        },
        geometry: {
          type: "Point",
          coordinates: [2.7029999999999745, 2],
        },
      },
    ],
  },
);
window.registerSkyData(
  "traditional.regions.labels.cn.json",
  window.__RSO_LOCAL_DATA__[
    "traditional-regions/traditional.regions.labels.cn.json"
  ],
);
