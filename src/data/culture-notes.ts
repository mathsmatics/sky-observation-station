/**
 * 真实星空观测台 5.5.3 —— 重要恒星与星空文化说明数据
 *
 * 本文件只保存文化说明文字，不修改恒星坐标、星等、星座/星官连线或天文计算。
 * 西方星座神话常有多个版本，中国星官含义也会随时代和文献变化；
 * 因此文字采用“常见解释/通常解释”的简明表述，供认星学习使用。
 */
window.RSO_CULTURE_NOTES = {
  version: "5.5.3",
  importantMagnitudeLimit: 2.1,
  description: {
    zh: "重要恒星的跨文化简述。文字为便于学习的简明概括，不替代历史文献原文；同一西方星座可能存在多个神话版本，中国星官含义也可能随时代和文献而变化。",
    en: "Short cross-cultural notes for important stars. These are learning-oriented summaries, not replacements for primary historical sources; Western myths and Chinese interpretations can vary by period and source.",
  },
  sources: [
    {
      name: "International Astronomical Union — The Constellations",
      url: "https://www.iau.org/IAU/Iau/Science/What-we-do/The-Constellations.aspx",
    },
    {
      name: "Hong Kong Space Museum — Chinese star regions, asterisms and star names",
      url: "https://hk.space.museum/sc/web/spm/resources/teachers-corner/constellations-and-myths/glossary-of-chinese-star-regions-asterisms-and-star-names.html",
    },
    {
      name: "Hong Kong Space Museum — Chinese starlore",
      url: "https://hk.space.museum/en/web/spm/resources/teachers-corner/constellations-and-myths/chinese-starlore.html",
    },
    {
      name: "International Dunhuang Programme — The regions of the sky",
      url: "https://idp.bl.uk/discover/learning/chinese-astronomy/articles/the-chinese-sky/the-regions-of-the-sky/",
    },
  ],
  westernConstellations: {
    CMa: {
      zh: "大犬座常被解释为猎人俄里翁（猎户）的猎犬，天狼星是它最醒目的标志。",
      en: "Canis Major is commonly interpreted as one of Orion’s hunting dogs, with Sirius as its dominant star.",
    },
    Car: {
      zh: "船底座来自古代巨船“阿尔戈号”的船底部分；阿尔戈号承载伊阿宋和阿尔戈英雄寻找金羊毛。",
      en: "Carina is the keel of the ancient ship Argo Navis, the vessel of Jason and the Argonauts in the quest for the Golden Fleece.",
    },
    Boo: {
      zh: "牧夫座通常描绘一位牧人或守护者，常被看作驱赶或看守大熊的天空人物；具体神话版本并不唯一。",
      en: "Boötes is usually pictured as a herdsman or guardian associated with the Great Bear; its exact mythological identity varies among traditions.",
    },
    Cen: {
      zh: "半人马座表现半人半马的生物，常与贤者喀戎联系，但不同古典传统的认定并不完全一致。",
      en: "Centaurus represents a centaur and is often associated with the wise Chiron, although classical identifications are not fully uniform.",
    },
    Lyr: {
      zh: "天琴座通常被视为俄耳甫斯的竖琴；其音乐在希腊神话中具有感化万物的力量。",
      en: "Lyra is commonly identified with the lyre of Orpheus, whose music in Greek myth could move living things and even the underworld.",
    },
    Aur: {
      zh: "御夫座意为驾车者，常与雅典传说中的厄里克托尼俄斯联系；星图中也常抱着由五车二代表的母山羊。",
      en: "Auriga is the Charioteer, often linked with Erichthonius; traditional depictions also show him carrying the she-goat marked by Capella.",
    },
    Ori: {
      zh: "猎户座表现强大的猎人俄里翁，是冬季天空最著名的西方星座之一。",
      en: "Orion represents the mighty hunter Orion and is one of the most recognizable constellations of the winter sky.",
    },
    CMi: {
      zh: "小犬座通常被看作猎户的另一只猎犬；南河三是它最亮的恒星。",
      en: "Canis Minor is commonly regarded as Orion’s smaller hunting dog, with Procyon as its brightest star.",
    },
    Eri: {
      zh: "波江座是一条漫长的天河，通常与希腊神话中的厄里达诺斯河联系。",
      en: "Eridanus is a long celestial river, traditionally associated with the mythic river Eridanus.",
    },
    Aql: {
      zh: "天鹰座代表宙斯的鹰；常见故事中，它为宙斯携带雷霆，或把伽倪墨得斯带到奥林匹斯。",
      en: "Aquila represents the eagle of Zeus, said in different stories to carry his thunderbolts or to bring Ganymede to Olympus.",
    },
    Cru: {
      zh: "南十字座是近代西方星座，以醒目的十字形著称，并长期用于南半球航海定向。",
      en: "Crux is a later Western constellation defined by its striking cross shape and has long been important for navigation in the Southern Hemisphere.",
    },
    Tau: {
      zh: "金牛座代表公牛；常见解释是化身为白牛的宙斯把欧罗巴带过海洋。",
      en: "Taurus represents the Bull, commonly linked with Zeus taking the form of a white bull to carry Europa across the sea.",
    },
    Vir: {
      zh: "室女座表现一位少女，常与正义女神阿斯特赖亚，或与农业、丰收相关的女神联系。",
      en: "Virgo represents a maiden, often identified with Astraea or with goddesses connected to agriculture and harvest.",
    },
    Sco: {
      zh: "天蝎座代表追杀俄里翁的巨蝎；在许多神话版本中，它与猎户座被安排在天空的相对季节。",
      en: "Scorpius represents the great scorpion sent against Orion; in many versions the two figures occupy opposite seasons of the sky.",
    },
    Gem: {
      zh: "双子座代表卡斯托耳和波吕丢刻斯（Castor 与 Pollux），象征兄弟情谊、守护与航海。",
      en: "Gemini represents the twins Castor and Pollux, symbols of brotherhood and protectors of travelers and sailors.",
    },
    PsA: {
      zh: "南鱼座表现一条南方之鱼，古典星图中常承接从宝瓶座流出的水。",
      en: "Piscis Austrinus is the Southern Fish, traditionally shown receiving the stream of water poured by Aquarius.",
    },
    Cyg: {
      zh: "天鹅座表现一只天鹅，并与多个希腊故事相联系，包括宙斯化身天鹅和名为 Cycnus 的人物传说。",
      en: "Cygnus represents a swan and is connected with several Greek stories, including Zeus in swan form and figures named Cycnus.",
    },
    Leo: {
      zh: "狮子座通常被解释为赫拉克勒斯十二功业中的尼米亚狮。",
      en: "Leo is commonly identified with the Nemean Lion defeated by Heracles as the first of his Twelve Labours.",
    },
    UMa: {
      zh: "大熊座常与被变成熊的卡利斯托联系；其中最醒目的七星在西方常被称为北斗形或“大勺”。",
      en: "Ursa Major is often linked with Callisto transformed into a bear; its best-known seven-star pattern is the Big Dipper or Plough.",
    },
    UMi: {
      zh: "小熊座包含北极星，在西方航海和辨认北方中极为重要；神话身份常与阿卡斯或小熊传统联系。",
      en: "Ursa Minor contains Polaris and is central to northern navigation; its mythic identity is often linked with Arcas or the Little Bear tradition.",
    },
    Per: {
      zh: "英仙座表现英雄珀耳修斯，他斩杀美杜莎，并救出被锁在海边的安德洛墨达。",
      en: "Perseus represents the hero who slew Medusa and rescued the chained princess Andromeda.",
    },
    Sgr: {
      zh: "人马座表现持弓的射手，通常画成半人马形象；它与具体哪位神话人物对应存在不同说法。",
      en: "Sagittarius is the Archer, usually drawn as a centaur-like figure; traditions differ on the exact mythological identity.",
    },
    And: {
      zh: "仙女座表现安德洛墨达公主，她因母亲的夸耀而被锁在海边，后来被珀耳修斯救出。",
      en: "Andromeda represents the princess chained as a sacrifice after her mother’s boast, and later rescued by Perseus.",
    },
    Ari: {
      zh: "白羊座通常代表载着佛里克索斯逃生、后来留下金羊毛的神羊。",
      en: "Aries represents the ram that carried Phrixus to safety and became the source of the Golden Fleece.",
    },
    Hya: {
      zh: "长蛇座表现一条巨大的水蛇；常见故事把它与乌鸦、杯子以及阿波罗的传说联系起来。",
      en: "Hydra represents a great water serpent and is commonly linked with the story of Apollo, the Crow and the Cup.",
    },
    Oph: {
      zh: "蛇夫座表现手持巨蛇的人，通常与医神阿斯克勒庇俄斯联系，象征治疗与复生知识。",
      en: "Ophiuchus is the Serpent-Bearer, commonly identified with Asclepius and associated with healing and the knowledge of restoring life.",
    },
    Cet: {
      zh: "鲸鱼座在古典传统中更接近“海怪”，通常是被派去威胁安德洛墨达的刻托。",
      en: "Cetus is the Sea Monster of classical tradition, usually the creature sent to threaten Andromeda.",
    },
    Cas: {
      zh: "仙后座表现王后卡西奥佩娅；她的夸耀引发海神惩罚，并使安德洛墨达陷入危机。",
      en: "Cassiopeia represents the boastful queen whose claim of beauty provoked divine punishment and endangered Andromeda.",
    },
    Gru: {
      zh: "天鹤座是近代南天星座，表现一只鹤；它主要属于大航海时代形成的南天命名体系。",
      en: "Grus is an early-modern southern constellation representing a crane, created within the sky-mapping tradition of the Age of Exploration.",
    },
    Pav: {
      zh: "孔雀座是近代南天星座，表现孔雀，主要形成于欧洲航海家绘制南天星空的时期。",
      en: "Pavo is an early-modern southern constellation representing a peacock, introduced during European charting of the southern sky.",
    },
    TrA: {
      zh: "南三角座是近代南天星座，以三颗亮星形成的三角形命名，没有统一的古希腊神话主体。",
      en: "Triangulum Australe is an early-modern southern constellation named for its triangular pattern and has no single classical Greek myth.",
    },
    Vel: {
      zh: "船帆座来自古代巨船“阿尔戈号”的船帆部分，是原阿尔戈船座拆分后的星座。",
      en: "Vela represents the sails of Argo Navis and is one of the modern constellations created from the division of the ancient great ship.",
    },
  },
  chineseAsterisms: {
    天狼: {
      zh: "天狼是独立星官，名称意为“天上的狼”。古代星占中常与边防、兵事和外来威胁等意象相联系。",
      en: "Tianlang, the Celestial Wolf, is an independent asterism traditionally associated with frontier defense, warfare and external threats.",
    },
    老人: {
      zh: "老人星位于南天，传统上象征长寿、太平与德治；它在中国文化中长期具有吉祥意义。",
      en: "The Old Man star in the southern sky traditionally symbolizes longevity, peace and virtuous government.",
    },
    大角: {
      zh: "大角是东方天区的重要星官，位于角宿附近。传统解释常把它视作天廷秩序中的显要标志，并与帝王和时令观测相联系。",
      en: "Dajiao, the Great Horn, is a prominent eastern-sky asterism near the Horn mansion and was associated with celestial authority and seasonal order.",
    },
    南门: {
      zh: "南门意为天上的南方门户，象征通往南方天区的关门或入口。",
      en: "Nanmen, the Southern Gate, represents a celestial gateway opening toward the southern sky.",
    },
    织女: {
      zh: "织女星官以织女一为主星，与河鼓二所代表的牛郎隔银河相望，是牛郎织女故事的核心。",
      en: "The Weaving Girl asterism is centered on Vega and faces the Cowherd across the Milky Way in the famous Chinese love story.",
    },
    五车: {
      zh: "五车意为五辆天车，是北方天空的重要星官，表现天帝出行或运输所用的车辆。",
      en: "Wuche, the Five Chariots, represents celestial vehicles associated with transport and the movements of the heavenly court.",
    },
    参宿: {
      zh: "参宿是西方白虎七宿之一，以参宿一、二、三等腰带三星为骨架，是中国冬季天空最醒目的宿之一。",
      en: "Shen, the Three Stars mansion, is one of the seven mansions of the White Tiger and is built around Orion’s Belt, a major marker of the winter sky.",
    },
    南河: {
      zh: "南河与北河相对，构成天河附近的河道和关隘意象；南河三是其中最亮的一星。",
      en: "Nanhe, the Southern River, is paired with the Northern River as part of the celestial river and gateway imagery.",
    },
    水委: {
      zh: "水委位于南方水域意象中，名称含有水流汇聚或终结之意。",
      en: "Shuiwei belongs to the southern celestial water imagery and its name suggests the gathering or terminal reach of a watercourse.",
    },
    马腹: {
      zh: "马腹意为马的腹部，是南方星空动物形象的一部分。",
      en: "Mafu, the Horse’s Belly, is part of an animal figure in the southern sky.",
    },
    河鼓: {
      zh: "河鼓意为天河边的鼓。河鼓二后来广泛被视为牛郎星，与织女星隔银河相望。",
      en: "Hegu, the River Drum, stands beside the Milky Way; its second star, Altair, became widely identified with the Cowherd.",
    },
    十字架: {
      zh: "十字架属于明末以后吸收欧洲南天知识形成的新星官，直接对应南十字座的十字形。",
      en: "The Cross is a later Chinese asterism introduced with European southern-sky knowledge and corresponds directly to Crux.",
    },
    毕宿: {
      zh: "毕宿是西方白虎七宿之一，“毕”有捕猎用网的含义，因此常被理解为天上的网。",
      en: "Bi, the Net mansion, is one of the White Tiger’s seven mansions; its name refers to a net used for hunting.",
    },
    角宿: {
      zh: "角宿是东方青龙七宿之首，象征青龙的两角，也是传统东方星区序列的起点。",
      en: "Jiao, the Horn mansion, is the first of the Azure Dragon’s seven mansions and represents the dragon’s horns.",
    },
    心宿: {
      zh: "心宿是东方青龙的心脏，心宿二即“大火”。它在古代季节和历法观测中具有重要地位。",
      en: "Xin, the Heart mansion, forms the heart of the Azure Dragon; its second star, Antares, was the Great Fire and an important seasonal marker.",
    },
    北河: {
      zh: "北河与南河相对，构成天河附近的河道、桥梁和关隘体系。",
      en: "Beihe, the Northern River, is paired with the Southern River in the celestial system of waterways and gateways.",
    },
    北落师门: {
      zh: "北落师门通常被解释为天上军营或羽林军区域的门户，具有守卫和军阵意象。",
      en: "Beiluoshimen is traditionally interpreted as a gate of the celestial military encampment, carrying defensive and martial symbolism.",
    },
    天津: {
      zh: "天津意为“天上的渡口”，横跨银河，表现连接银河两岸的桥梁或渡口。",
      en: "Tianjin, the Celestial Ford, crosses the Milky Way and represents a bridge or ferry linking its two banks.",
    },
    轩辕: {
      zh: "轩辕星官以黄帝轩辕为中心，表现帝王、后妃和宗族秩序；轩辕十四是其中最亮的成员。",
      en: "Xuanyuan represents the Yellow Emperor and the imperial family or courtly order; Regulus is its brightest member.",
    },
    弧矢: {
      zh: "弧矢意为弓和箭，是南方天空的军事星官，常被描绘为指向天狼。",
      en: "Hushi, the Bow and Arrow, is a martial asterism in the southern sky and is traditionally pictured as aiming toward the Celestial Wolf.",
    },
    尾宿: {
      zh: "尾宿是东方青龙七宿之一，象征青龙的尾部。",
      en: "Wei, the Tail mansion, is one of the Azure Dragon’s seven mansions and represents the dragon’s tail.",
    },
    南船: {
      zh: "南船意为南方的船，是近南天水域和航行意象中的星官。",
      en: "Nanchuan, the Southern Boat, is a celestial vessel within the water and navigation imagery of the far southern sky.",
    },
    鹤: {
      zh: "鹤是明末以后依据欧洲南天星座加入的新星官，对应天鹤座。",
      en: "The Crane is a later Chinese asterism introduced from European southern-sky charts and corresponds to Grus.",
    },
    天社: {
      zh: "天社意为祭祀土地神的天上社坛，象征国家祭祀和土地秩序。",
      en: "Tianshe, the Celestial Earth-God Altar, represents state ritual and the ordered worship of the land.",
    },
    北斗: {
      zh: "北斗由七颗亮星组成，是中国天空中最重要的星官之一。它既用于辨方和定时，也被赋予天帝车驾、政令与命运秩序等丰富含义。",
      en: "The Northern Dipper is one of the most important Chinese asterisms. It served for direction and seasonal timekeeping and acquired rich meanings connected with celestial government and fate.",
    },
    天船: {
      zh: "天船意为天上的船，表现航行、运输和渡水。",
      en: "Tianchuan, the Celestial Boat, represents navigation, transport and passage over water.",
    },
    箕宿: {
      zh: "箕宿是东方青龙七宿之一，形似簸箕，象征扬谷用的簸箕。",
      en: "Ji, the Winnowing Basket mansion, is one of the Azure Dragon’s seven mansions and represents a basket used to winnow grain.",
    },
    海石: {
      zh: "海石是近南极星区的新星官之一，表现海中的礁石或石块。",
      en: "Haishi, Sea Rock, is a later far-southern asterism representing rocks or reefs in the sea.",
    },
    三角形: {
      zh: "三角形是明末以后吸收欧洲南天星图形成的新星官，对应南三角座。",
      en: "The Triangle is a later Chinese asterism introduced from European southern charts and corresponds to Triangulum Australe.",
    },
    井宿: {
      zh: "井宿是南方朱雀七宿之一，象征水井，也是传统南方天区的重要宿。",
      en: "Jing, the Well mansion, is one of the Vermilion Bird’s seven mansions and represents a well.",
    },
    孔雀: {
      zh: "孔雀是明末以后依据欧洲南天星座加入的新星官，对应孔雀座。",
      en: "The Peacock is a later Chinese asterism introduced from European southern charts and corresponds to Pavo.",
    },
    勾陈: {
      zh: "勾陈位于紫微垣附近，表现环卫天帝的曲折阵列；勾陈一即今天的北极星。",
      en: "Gouchen, the Curved Array, lies near the Purple Forbidden Enclosure and represents an array guarding the heavenly emperor; its first star is Polaris.",
    },
    军市: {
      zh: "军市意为军营中的市场，属于南方军事星官体系。",
      en: "Junshi, the Market for Soldiers, represents the marketplace serving a celestial military camp.",
    },
    星宿: {
      zh: "星宿是南方朱雀七宿之一，名称本身即为“星”，是朱雀身体中部的重要宿。",
      en: "Xing, the Star mansion, is one of the Vermilion Bird’s seven mansions and occupies a central part of that figure.",
    },
    娄宿: {
      zh: "娄宿是西方白虎七宿之一，传统名称常解释为聚集、牵系或牧养相关的意象。",
      en: "Lou, the Bond mansion, is one of the White Tiger’s seven mansions and carries imagery of gathering or binding together.",
    },
    土司空: {
      zh: "土司空是掌管土木营造和工程事务的天官星官。",
      en: "Tusikong, the Master of Works, represents an official responsible for earthworks, construction and engineering.",
    },
    斗宿: {
      zh: "斗宿是北方玄武七宿之首，形似斗，是南斗六星所在的传统天区。",
      en: "Dou, the Dipper mansion, is the first of the Black Tortoise’s seven mansions and contains the Southern Dipper pattern.",
    },
    库楼: {
      zh: "库楼意为兵器库及楼台，是南方天空的军事设施星官。",
      en: "Kulou, the Arsenal and Watchtower, represents military storage and defensive structures in the southern sky.",
    },
    壁宿: {
      zh: "壁宿是北方玄武七宿之一，象征宫室或营垒的墙壁。",
      en: "Bi, the Wall mansion, is one of the Black Tortoise’s seven mansions and represents the wall of a palace or encampment.",
    },
    奎宿: {
      zh: "奎宿是西方白虎七宿之一，传统形象常解释为白虎的腿或足部。",
      en: "Kui, the Legs mansion, is one of the White Tiger’s seven mansions and is traditionally associated with the animal’s legs.",
    },
    北极: {
      zh: "北极星官位于紫微垣核心附近，表现天帝及其宫廷秩序；历史上的“帝星”并不总是今天的北极星。",
      en: "The Northern Pole asterism lies near the core of the Purple Forbidden Enclosure and represents the heavenly emperor and court; the historical imperial pole star was not always today’s Polaris.",
    },
    候: {
      zh: "候星官象征负责观察、等候或侦察的官员。",
      en: "Hou represents an official charged with watching, waiting or scouting.",
    },
    侯: {
      zh: "侯星官通常解释为诸侯或高级贵族在天上的象征。",
      en: "Hou represents a feudal lord or high-ranking noble in the celestial court.",
    },
    大陵: {
      zh: "大陵意为大型陵墓，是北方天空中与墓葬、丧仪相关的星官。",
      en: "Daling, the Great Mausoleum, is a northern asterism associated with tombs and funerary imagery.",
    },
    天大将军: {
      zh: "天大将军表现统率天兵的高级将领，是北方天空的重要军事星官。",
      en: "Tiandajiangjun, the Great General of Heaven, represents a senior commander leading celestial troops.",
    },
  },
};

/**
 * 星图文化扩展说明。
 *
 * 这些说明是可读的文化资料，不参与坐标、星等、星座线、星官线或投影计算。
 * 文化文本和几何数据分离，方便后续按来源继续扩写，也避免为了讲故事而污染星表。
 */

export type SourceTag =
  | "iau-constellations"
  | "hk-space-museum"
  | "idp-chinese-astronomy"
  | "bu-tian-ge"
  | "ctext-traditional"
  | "mpiwg-fenye"
  | "project-derived";

export interface WesternConstellationCultureNote {
  id: string;
  zhName: string;
  enName: string;
  mythologyZh: string;
  symbolismZh: string;
  relatedConstellations: string[];
  relatedChineseAsterisms?: string[];
  importantStars?: string[];
  bestViewingMonthsNorth?: number[];
  bestViewingMonthsSouth?: number[];
  sourceTags: SourceTag[];
}

export interface ChineseAsterismCultureNote {
  id: string;
  name: string;
  pinyin?: string;
  meaningZh: string;
  system:
    | "three-enclosures"
    | "twenty-eight-mansions"
    | "four-symbols"
    | "battlefields"
    | "south-polar"
    | "other";
  mansion?: string;
  enclosure?: string;
  fourSymbol?: string;
  buTianGeNote?: string;
  fenye?: FenyeNote;
  relatedAsterisms?: string[];
  relatedWesternConstellations?: string[];
  sourceTags: SourceTag[];
}

export interface FenyeNote {
  mansion: string;
  ancientRegion: string;
  modernApproximation: string;
  caution: string;
}

export interface BrightStarCultureNote {
  hip: number;
  rankByVisualMagnitude: number;
  displayNameZh: string;
  nameExplanationZh?: string;
  sourceTags: SourceTag[];
}

const SOURCE_IAU: SourceTag[] = ["iau-constellations"];
const SOURCE_TRADITION: SourceTag[] = [
  "hk-space-museum",
  "idp-chinese-astronomy",
  "bu-tian-ge",
];
const FENYE_CAUTION =
  "分野是传统天文—地理对应体系，不是现代行政区，也不是科学地理边界；不同文献对应会有差异。";

function monthsForRa(raDeg: number): number[] {
  const raHours = (((raDeg % 360) + 360) % 360) / 15;
  const center = Math.round(((raHours + 12) % 24) / 2) || 12;
  return [center - 1 || 12, center, center + 1 > 12 ? 1 : center + 1];
}

export const WESTERN_CONSTELLATION_CULTURE: Record<
  string,
  WesternConstellationCultureNote
> = {
  Ori: {
    id: "Ori",
    zhName: "猎户座",
    enName: "Orion",
    mythologyZh:
      "猎户座常见版本表现巨人猎人俄里翁。他与金牛、大犬、小犬、天兔和天蝎构成一组完整的冬季神话链：猎人追逐猎物，猎犬相随，而天蝎在另一季节升起，象征追杀俄里翁的巨蝎。",
    symbolismZh:
      "象征狩猎、力量和冬季夜空的标志性形象。腰带三星也是很多文化中的辨星入口。",
    relatedConstellations: ["Tau", "CMa", "CMi", "Lep", "Sco"],
    relatedChineseAsterisms: ["参宿", "伐(附官)", "厕"],
    importantStars: ["Betelgeuse", "Rigel", "Bellatrix"],
    bestViewingMonthsNorth: monthsForRa(83),
    bestViewingMonthsSouth: monthsForRa(83),
    sourceTags: SOURCE_IAU,
  },
  Tau: {
    id: "Tau",
    zhName: "金牛座",
    enName: "Taurus",
    mythologyZh:
      "常见希腊版本中，金牛与化身白牛的宙斯和欧罗巴故事相连；在猎户故事链里，它也是俄里翁面前的公牛。昴星团和毕宿星团让金牛座兼具神话和肉眼观测价值。",
    symbolismZh: "象征公牛、春季农事、力量和黄道上的重要标志。",
    relatedConstellations: ["Ori", "Aur", "Ari", "Gem"],
    relatedChineseAsterisms: ["毕宿", "昴宿"],
    importantStars: ["Aldebaran", "Pleiades"],
    bestViewingMonthsNorth: monthsForRa(68),
    bestViewingMonthsSouth: monthsForRa(68),
    sourceTags: SOURCE_IAU,
  },
  CMa: {
    id: "CMa",
    zhName: "大犬座",
    enName: "Canis Major",
    mythologyZh:
      "大犬座通常是猎户的猎犬之一，紧随猎人穿过冬季天空。天狼星是全天最亮恒星，使这个星座在中西传统中都极醒目。",
    symbolismZh: "象征猎犬、追随和冬季南方天空的亮星标记。",
    relatedConstellations: ["Ori", "CMi", "Lep"],
    relatedChineseAsterisms: ["天狼", "弧矢"],
    importantStars: ["Sirius"],
    bestViewingMonthsNorth: monthsForRa(101),
    bestViewingMonthsSouth: monthsForRa(101),
    sourceTags: SOURCE_IAU,
  },
  CMi: {
    id: "CMi",
    zhName: "小犬座",
    enName: "Canis Minor",
    mythologyZh:
      "小犬座常被解释为猎户的另一只猎犬。南河三与天狼星、参宿四一起构成冬季大三角，是辨认冬季星空的实用标志。",
    symbolismZh: "象征小猎犬、随从和冬季星空导航。",
    relatedConstellations: ["Ori", "CMa", "Gem"],
    relatedChineseAsterisms: ["南河"],
    importantStars: ["Procyon"],
    bestViewingMonthsNorth: monthsForRa(113),
    bestViewingMonthsSouth: monthsForRa(113),
    sourceTags: SOURCE_IAU,
  },
  Sco: {
    id: "Sco",
    zhName: "天蝎座",
    enName: "Scorpius",
    mythologyZh:
      "天蝎座常见版本是被派去惩罚或追杀俄里翁的巨蝎。它与猎户座分处相对季节，形成“猎户落下，天蝎升起”的戏剧性天空关系。",
    symbolismZh: "象征危险、复仇、夏季南方天空和银河中心附近的明亮星群。",
    relatedConstellations: ["Ori", "Oph", "Sgr", "Lup"],
    relatedChineseAsterisms: ["心宿", "尾宿"],
    importantStars: ["Antares", "Shaula", "Sargas"],
    bestViewingMonthsNorth: monthsForRa(247),
    bestViewingMonthsSouth: monthsForRa(247),
    sourceTags: SOURCE_IAU,
  },
  And: {
    id: "And",
    zhName: "仙女座",
    enName: "Andromeda",
    mythologyZh:
      "仙女座表现被锁在海边等待献祭的公主安德洛墨达。她的故事与仙后、仙王、英仙、鲸鱼和飞马相连，是秋季北天最完整的希腊神话星座群之一。",
    symbolismZh: "象征受难、救援、王族命运和秋季星空神话链。",
    relatedConstellations: ["Cas", "Cep", "Per", "Cet", "Peg"],
    importantStars: ["Alpheratz", "Mirach", "Andromeda Galaxy"],
    bestViewingMonthsNorth: monthsForRa(11),
    bestViewingMonthsSouth: monthsForRa(11),
    sourceTags: SOURCE_IAU,
  },
  Cas: {
    id: "Cas",
    zhName: "仙后座",
    enName: "Cassiopeia",
    mythologyZh:
      "仙后座表现王后卡西奥佩娅。常见故事中，她夸耀自己或女儿比海中仙女更美，引发海神惩罚，最终牵连安德洛墨达。",
    symbolismZh: "象征王后、夸耀、惩罚和北天 W 形辨星标志。",
    relatedConstellations: ["And", "Cep", "Per", "Cet"],
    relatedChineseAsterisms: ["阁道", "王良"],
    importantStars: ["Schedar", "Caph"],
    bestViewingMonthsNorth: monthsForRa(15),
    bestViewingMonthsSouth: monthsForRa(15),
    sourceTags: SOURCE_IAU,
  },
  Cep: {
    id: "Cep",
    zhName: "仙王座",
    enName: "Cepheus",
    mythologyZh:
      "仙王座表现埃塞俄比亚国王刻甫斯，是仙后和仙女座故事中的父亲角色。它靠近北天极，常年可见于北半球高纬天空。",
    symbolismZh: "象征王权、父亲和北天极附近的王族星座群。",
    relatedConstellations: ["Cas", "And", "Per", "Cet"],
    importantStars: ["Alderamin"],
    bestViewingMonthsNorth: monthsForRa(330),
    bestViewingMonthsSouth: monthsForRa(330),
    sourceTags: SOURCE_IAU,
  },
  Per: {
    id: "Per",
    zhName: "英仙座",
    enName: "Perseus",
    mythologyZh:
      "英仙座表现英雄珀耳修斯。他斩杀美杜莎，并在回程中救下安德洛墨达。大陵五所在的魔头形象来自美杜莎之首。",
    symbolismZh: "象征英雄、除怪、救援和秋冬交界的银河星区。",
    relatedConstellations: ["And", "Cas", "Cep", "Cet", "Peg"],
    relatedChineseAsterisms: ["大陵", "天船"],
    importantStars: ["Mirfak", "Algol"],
    bestViewingMonthsNorth: monthsForRa(50),
    bestViewingMonthsSouth: monthsForRa(50),
    sourceTags: SOURCE_IAU,
  },
  Cet: {
    id: "Cet",
    zhName: "鲸鱼座",
    enName: "Cetus",
    mythologyZh:
      "鲸鱼座在古典语境中更接近海怪刻托，它被派去威胁安德洛墨达，后来被珀耳修斯击败。",
    symbolismZh: "象征海怪、混沌海洋和秋季南方大面积暗淡天区。",
    relatedConstellations: ["And", "Cas", "Cep", "Per", "Psc"],
    importantStars: ["Mira", "Diphda"],
    bestViewingMonthsNorth: monthsForRa(25),
    bestViewingMonthsSouth: monthsForRa(25),
    sourceTags: SOURCE_IAU,
  },
  Peg: {
    id: "Peg",
    zhName: "飞马座",
    enName: "Pegasus",
    mythologyZh:
      "飞马座表现有翼神马珀伽索斯，常与珀耳修斯、美杜莎和英雄旅行故事相连。秋季大四边形是辨认它的关键。",
    symbolismZh: "象征飞马、灵感、远行和秋季天空框架。",
    relatedConstellations: ["And", "Per", "Equ", "Psc"],
    relatedChineseAsterisms: ["室宿", "壁宿"],
    importantStars: ["Markab", "Scheat", "Algenib"],
    bestViewingMonthsNorth: monthsForRa(340),
    bestViewingMonthsSouth: monthsForRa(340),
    sourceTags: SOURCE_IAU,
  },
  UMa: {
    id: "UMa",
    zhName: "大熊座",
    enName: "Ursa Major",
    mythologyZh:
      "大熊座常见版本与卡利斯托变熊的故事有关。北斗七星是这个星座中最醒目的部分，在西方常称 Big Dipper 或 Plough，在中国则是独立且极重要的北斗星官。",
    symbolismZh: "象征大熊、北方、导航、季节和北天秩序。",
    relatedConstellations: ["UMi", "Boo", "CVn", "Dra"],
    relatedChineseAsterisms: ["北斗"],
    importantStars: ["Dubhe", "Merak", "Alioth"],
    bestViewingMonthsNorth: monthsForRa(170),
    bestViewingMonthsSouth: monthsForRa(170),
    sourceTags: SOURCE_IAU,
  },
  UMi: {
    id: "UMi",
    zhName: "小熊座",
    enName: "Ursa Minor",
    mythologyZh:
      "小熊座包含北极星。它常与大熊座故事相连，也因靠近北天极而在航海、辨向和天球学习中具有特殊意义。",
    symbolismZh: "象征小熊、北极、方向和天球旋转轴附近的稳定参照。",
    relatedConstellations: ["UMa", "Dra", "Cep"],
    relatedChineseAsterisms: ["勾陈", "北极"],
    importantStars: ["Polaris", "Kochab"],
    bestViewingMonthsNorth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bestViewingMonthsSouth: [],
    sourceTags: SOURCE_IAU,
  },
  Boo: {
    id: "Boo",
    zhName: "牧夫座",
    enName: "Boötes",
    mythologyZh:
      "牧夫座常被描绘为牧人、驱熊者或守护者，和大熊座的关系密切。不同古典传统对其身份解释不完全一致。",
    symbolismZh: "象征牧人、守护、春季北天和大角星的明亮标记。",
    relatedConstellations: ["UMa", "CVn", "CrB", "Vir"],
    relatedChineseAsterisms: ["大角"],
    importantStars: ["Arcturus"],
    bestViewingMonthsNorth: monthsForRa(220),
    bestViewingMonthsSouth: monthsForRa(220),
    sourceTags: SOURCE_IAU,
  },
  CVn: {
    id: "CVn",
    zhName: "猎犬座",
    enName: "Canes Venatici",
    mythologyZh:
      "猎犬座是近代星座，表现牧夫牵着追逐大熊的两只猎犬。它不像古典黄道星座那样有统一古希腊神话，却在春季深空天体中很重要。",
    symbolismZh: "象征猎犬、追逐和春季北天深空目标区域。",
    relatedConstellations: ["Boo", "UMa"],
    importantStars: ["Cor Caroli"],
    bestViewingMonthsNorth: monthsForRa(195),
    bestViewingMonthsSouth: monthsForRa(195),
    sourceTags: SOURCE_IAU,
  },
  Lyr: {
    id: "Lyr",
    zhName: "天琴座",
    enName: "Lyra",
    mythologyZh:
      "天琴座通常代表俄耳甫斯的琴。常见故事中，俄耳甫斯的音乐能感动人、动物甚至冥府。",
    symbolismZh: "象征音乐、诗歌、感化力量和夏季大三角。",
    relatedConstellations: ["Cyg", "Aql", "Her"],
    relatedChineseAsterisms: ["织女"],
    importantStars: ["Vega"],
    bestViewingMonthsNorth: monthsForRa(280),
    bestViewingMonthsSouth: monthsForRa(280),
    sourceTags: SOURCE_IAU,
  },
  Cyg: {
    id: "Cyg",
    zhName: "天鹅座",
    enName: "Cygnus",
    mythologyZh:
      "天鹅座和多个天鹅故事有关，包括宙斯化身天鹅、或名为 Cycnus 的人物传说。它横卧银河，是夏秋季最醒目的星座之一。",
    symbolismZh: "象征天鹅、飞翔、银河和夏季大三角。",
    relatedConstellations: ["Lyr", "Aql", "Cep", "Vul"],
    relatedChineseAsterisms: ["天津"],
    importantStars: ["Deneb", "Albireo"],
    bestViewingMonthsNorth: monthsForRa(305),
    bestViewingMonthsSouth: monthsForRa(305),
    sourceTags: SOURCE_IAU,
  },
  Aql: {
    id: "Aql",
    zhName: "天鹰座",
    enName: "Aquila",
    mythologyZh:
      "天鹰座代表宙斯的鹰。常见版本中，它为宙斯携带雷霆，或把伽倪墨得斯带到奥林匹斯。",
    symbolismZh: "象征鹰、雷霆、神使和银河两岸的牛郎织女故事对应区。",
    relatedConstellations: ["Lyr", "Cyg", "Sge", "Del"],
    relatedChineseAsterisms: ["河鼓"],
    importantStars: ["Altair"],
    bestViewingMonthsNorth: monthsForRa(297),
    bestViewingMonthsSouth: monthsForRa(297),
    sourceTags: SOURCE_IAU,
  },
  Her: {
    id: "Her",
    zhName: "武仙座",
    enName: "Hercules",
    mythologyZh:
      "武仙座表现英雄赫拉克勒斯。它与北冕、天龙、蛇夫等邻近星座有神话与天空位置关系，是夏季北天的大型暗淡星座。",
    symbolismZh: "象征英雄、试炼、力量和十二功业传统。",
    relatedConstellations: ["CrB", "Dra", "Oph", "Lyr"],
    importantStars: ["Rasalgethi"],
    bestViewingMonthsNorth: monthsForRa(258),
    bestViewingMonthsSouth: monthsForRa(258),
    sourceTags: SOURCE_IAU,
  },
  Oph: {
    id: "Oph",
    zhName: "蛇夫座",
    enName: "Ophiuchus",
    mythologyZh:
      "蛇夫座通常与医神阿斯克勒庇俄斯相连，手持巨蛇。它位于黄道经过的天空区域，但不是传统黄道十二宫之一。",
    symbolismZh: "象征医术、复生知识、蛇和黄道附近的大型夏季星座。",
    relatedConstellations: ["Ser", "Sco", "Sgr", "Her"],
    relatedChineseAsterisms: ["天市垣", "候"],
    importantStars: ["Rasalhague"],
    bestViewingMonthsNorth: monthsForRa(258),
    bestViewingMonthsSouth: monthsForRa(258),
    sourceTags: SOURCE_IAU,
  },
  Sgr: {
    id: "Sgr",
    zhName: "人马座",
    enName: "Sagittarius",
    mythologyZh:
      "人马座表现持弓射手，常画成半人马形象。它位于银河中心方向，神话形象和观测价值都很强。",
    symbolismZh: "象征射手、远方目标、银河中心和夏季南方天空。",
    relatedConstellations: ["Sco", "Cap", "Oph", "CrA"],
    relatedChineseAsterisms: ["斗宿", "箕宿"],
    importantStars: ["Kaus Australis", "Nunki"],
    bestViewingMonthsNorth: monthsForRa(285),
    bestViewingMonthsSouth: monthsForRa(285),
    sourceTags: SOURCE_IAU,
  },
  Ari: {
    id: "Ari",
    zhName: "白羊座",
    enName: "Aries",
    mythologyZh:
      "白羊座通常代表载着佛里克索斯逃离危险的神羊，后来留下金羊毛，引出伊阿宋和阿尔戈英雄的远征故事。",
    symbolismZh: "象征公羊、黄道起点传统、春季和金羊毛神话。",
    relatedConstellations: ["Tau", "Psc", "Cet", "And"],
    relatedChineseAsterisms: ["娄宿", "胃宿"],
    importantStars: ["Hamal"],
    bestViewingMonthsNorth: monthsForRa(35),
    bestViewingMonthsSouth: monthsForRa(35),
    sourceTags: SOURCE_IAU,
  },
  Gem: {
    id: "Gem",
    zhName: "双子座",
    enName: "Gemini",
    mythologyZh:
      "双子座代表卡斯托耳和波吕丢刻斯，两兄弟一个凡人、一个不朽，常被视为兄弟情谊和守护航海者的象征。",
    symbolismZh: "象征双生、兄弟、守护和冬春交界的黄道星座。",
    relatedConstellations: ["Ori", "CMi", "Cnc", "Tau"],
    relatedChineseAsterisms: ["井宿", "北河"],
    importantStars: ["Castor", "Pollux"],
    bestViewingMonthsNorth: monthsForRa(105),
    bestViewingMonthsSouth: monthsForRa(105),
    sourceTags: SOURCE_IAU,
  },
  Cnc: {
    id: "Cnc",
    zhName: "巨蟹座",
    enName: "Cancer",
    mythologyZh:
      "巨蟹座常与赫拉克勒斯大战九头蛇时被赫拉派去干扰他的螃蟹相连。它本身较暗，但鬼星团让它很适合观测教学。",
    symbolismZh: "象征螃蟹、黄道、暗淡星座中的显著星团。",
    relatedConstellations: ["Gem", "Leo", "Hya"],
    relatedChineseAsterisms: ["鬼宿"],
    importantStars: ["Praesepe"],
    bestViewingMonthsNorth: monthsForRa(130),
    bestViewingMonthsSouth: monthsForRa(130),
    sourceTags: SOURCE_IAU,
  },
  Leo: {
    id: "Leo",
    zhName: "狮子座",
    enName: "Leo",
    mythologyZh:
      "狮子座通常被解释为赫拉克勒斯十二功业中的尼米亚狮。轩辕十四位于狮心附近，是春季夜空的重要亮星。",
    symbolismZh: "象征狮子、王权、勇力和春季黄道星座。",
    relatedConstellations: ["Cnc", "Vir", "LMi", "Hya"],
    relatedChineseAsterisms: ["轩辕"],
    importantStars: ["Regulus", "Denebola"],
    bestViewingMonthsNorth: monthsForRa(155),
    bestViewingMonthsSouth: monthsForRa(155),
    sourceTags: SOURCE_IAU,
  },
  Vir: {
    id: "Vir",
    zhName: "室女座",
    enName: "Virgo",
    mythologyZh:
      "室女座常被解释为正义女神阿斯特赖亚，或与农业和丰收女神相连。它也是春季星系团所在的大型黄道星座。",
    symbolismZh: "象征少女、正义、谷物、丰收和春季星系天区。",
    relatedConstellations: ["Leo", "Lib", "Boo", "Crv"],
    relatedChineseAsterisms: ["角宿", "亢宿"],
    importantStars: ["Spica"],
    bestViewingMonthsNorth: monthsForRa(195),
    bestViewingMonthsSouth: monthsForRa(195),
    sourceTags: SOURCE_IAU,
  },
  Lib: {
    id: "Lib",
    zhName: "天秤座",
    enName: "Libra",
    mythologyZh:
      "天秤座表现天平，常与正义、衡量和秋分附近太阳所在的传统联想相连。古代也曾和天蝎座的爪部有关。",
    symbolismZh: "象征衡量、公平、平衡和黄道上的尺度意象。",
    relatedConstellations: ["Vir", "Sco", "Ser"],
    relatedChineseAsterisms: ["氐宿"],
    importantStars: ["Zubenelgenubi", "Zubeneschamali"],
    bestViewingMonthsNorth: monthsForRa(225),
    bestViewingMonthsSouth: monthsForRa(225),
    sourceTags: SOURCE_IAU,
  },
  Cap: {
    id: "Cap",
    zhName: "摩羯座",
    enName: "Capricornus",
    mythologyZh:
      "摩羯座表现半羊半鱼的海山羊，常与潘神逃避怪物时化身入水的故事相连。",
    symbolismZh: "象征山羊鱼、冬至点传统和黄道南部暗淡星座。",
    relatedConstellations: ["Sgr", "Aqr", "PsA"],
    relatedChineseAsterisms: ["牛宿"],
    importantStars: ["Deneb Algedi"],
    bestViewingMonthsNorth: monthsForRa(315),
    bestViewingMonthsSouth: monthsForRa(315),
    sourceTags: SOURCE_IAU,
  },
  Aqr: {
    id: "Aqr",
    zhName: "宝瓶座",
    enName: "Aquarius",
    mythologyZh:
      "宝瓶座表现倒水者，常与伽倪墨得斯或天上司水人物相连。水流常被画向南鱼座。",
    symbolismZh: "象征水、倾注、雨季和秋季黄道区域。",
    relatedConstellations: ["Cap", "Psc", "PsA", "Peg"],
    relatedChineseAsterisms: ["女宿", "虚宿", "危宿"],
    importantStars: ["Sadalsuud", "Sadalmelik"],
    bestViewingMonthsNorth: monthsForRa(335),
    bestViewingMonthsSouth: monthsForRa(335),
    sourceTags: SOURCE_IAU,
  },
  Psc: {
    id: "Psc",
    zhName: "双鱼座",
    enName: "Pisces",
    mythologyZh:
      "双鱼座表现两条鱼，常见版本与阿佛洛狄忒和厄洛斯为躲避怪物化为鱼有关。它跨越春分点附近，是黄道十二宫之一。",
    symbolismZh: "象征双鱼、逃避、连接和秋季暗淡黄道天区。",
    relatedConstellations: ["Aqr", "Ari", "Peg", "Cet"],
    relatedChineseAsterisms: ["室宿", "壁宿"],
    importantStars: ["Alrescha"],
    bestViewingMonthsNorth: monthsForRa(10),
    bestViewingMonthsSouth: monthsForRa(10),
    sourceTags: SOURCE_IAU,
  },
  Cru: {
    id: "Cru",
    zhName: "南十字座",
    enName: "Crux",
    mythologyZh:
      "南十字座是近代西方星座，以醒目的十字形命名。它没有统一古希腊神话主体，却在南半球航海和辨向中极重要。",
    symbolismZh: "象征南方、十字形、航海方向和南天标志。",
    relatedConstellations: ["Cen", "Mus", "Car"],
    relatedChineseAsterisms: ["十字架"],
    importantStars: ["Acrux", "Mimosa", "Gacrux"],
    bestViewingMonthsNorth: monthsForRa(187),
    bestViewingMonthsSouth: monthsForRa(187),
    sourceTags: SOURCE_IAU,
  },
  Cen: {
    id: "Cen",
    zhName: "半人马座",
    enName: "Centaurus",
    mythologyZh:
      "半人马座表现半人半马的生物，常与贤者喀戎联系。它包含南门二所在的近邻恒星系统，也是南天最重要星座之一。",
    symbolismZh: "象征半人马、智慧、南天亮星和南十字附近的导航区域。",
    relatedConstellations: ["Cru", "Lup", "Car"],
    relatedChineseAsterisms: ["南门", "马腹"],
    importantStars: ["Alpha Centauri", "Hadar"],
    bestViewingMonthsNorth: monthsForRa(200),
    bestViewingMonthsSouth: monthsForRa(200),
    sourceTags: SOURCE_IAU,
  },
  Car: {
    id: "Car",
    zhName: "船底座",
    enName: "Carina",
    mythologyZh:
      "船底座来自古代巨船阿尔戈号的船底部分。阿尔戈号承载伊阿宋和阿尔戈英雄寻找金羊毛。",
    symbolismZh: "象征航船、远征、南天银河和老人星所在的明亮区域。",
    relatedConstellations: ["Vel", "Pup", "Pyx", "Cen", "Cru"],
    relatedChineseAsterisms: ["老人", "南船"],
    importantStars: ["Canopus", "Miaplacidus", "Eta Carinae"],
    bestViewingMonthsNorth: monthsForRa(130),
    bestViewingMonthsSouth: monthsForRa(130),
    sourceTags: SOURCE_IAU,
  },
  Vel: {
    id: "Vel",
    zhName: "船帆座",
    enName: "Vela",
    mythologyZh:
      "船帆座是原阿尔戈船座拆分后的船帆部分，与船底、船尾和罗盘共同保留古代巨船意象。",
    symbolismZh: "象征航行、风帆和南天银河。",
    relatedConstellations: ["Car", "Pup", "Pyx"],
    relatedChineseAsterisms: ["南船"],
    importantStars: ["Suhail", "Regor"],
    bestViewingMonthsNorth: monthsForRa(145),
    bestViewingMonthsSouth: monthsForRa(145),
    sourceTags: SOURCE_IAU,
  },
  Pup: {
    id: "Pup",
    zhName: "船尾座",
    enName: "Puppis",
    mythologyZh:
      "船尾座是阿尔戈号的船尾部分，和船底座、船帆座一起构成被拆分后的阿尔戈船传统。",
    symbolismZh: "象征船尾、航程和冬春南天银河。",
    relatedConstellations: ["Car", "Vel", "Pyx"],
    relatedChineseAsterisms: ["天社", "南船"],
    importantStars: ["Naos"],
    bestViewingMonthsNorth: monthsForRa(120),
    bestViewingMonthsSouth: monthsForRa(120),
    sourceTags: SOURCE_IAU,
  },
  Phe: {
    id: "Phe",
    zhName: "凤凰座",
    enName: "Phoenix",
    mythologyZh:
      "凤凰座是近代南天星座，来自欧洲航海时代对南天星空的命名传统，不属于古典希腊 48 星座。",
    symbolismZh: "象征凤凰、重生和南天新星座体系。",
    relatedConstellations: ["Gru", "Tuc", "Eri"],
    bestViewingMonthsNorth: monthsForRa(20),
    bestViewingMonthsSouth: monthsForRa(20),
    sourceTags: SOURCE_IAU,
  },
  Pav: {
    id: "Pav",
    zhName: "孔雀座",
    enName: "Pavo",
    mythologyZh:
      "孔雀座是近代南天星座，表现孔雀。它主要形成于欧洲航海家绘制南天星空的时期。",
    symbolismZh: "象征孔雀、南天异域动物和近代星图传统。",
    relatedConstellations: ["Ind", "Tel", "Aps"],
    relatedChineseAsterisms: ["孔雀"],
    bestViewingMonthsNorth: monthsForRa(305),
    bestViewingMonthsSouth: monthsForRa(305),
    sourceTags: SOURCE_IAU,
  },
};

export const TWENTY_EIGHT_MANSION_CULTURE: Record<
  string,
  ChineseAsterismCultureNote
> = {
  角宿: {
    id: "角宿",
    name: "角宿",
    pinyin: "Jiao Xiu",
    meaningZh: "东方苍龙七宿之首，象征龙角，也是二十八宿序列的重要起点。",
    system: "twenty-eight-mansions",
    mansion: "角宿",
    fourSymbol: "东方苍龙",
    buTianGeNote:
      "《步天歌》按宿次描述角宿及其统领星官，可作为东方七宿开篇理解。",
    fenye: {
      mansion: "角宿",
      ancientRegion: "兖州 / 郑等说法",
      modernApproximation: "常见说法大致牵涉今河南、山东一带，具体随文献而变。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["亢宿", "大角", "南门"],
    relatedWesternConstellations: ["Vir", "Boo"],
    sourceTags: SOURCE_TRADITION,
  },
  亢宿: {
    id: "亢宿",
    name: "亢宿",
    pinyin: "Kang Xiu",
    meaningZh: "象征东方苍龙的颈部或咽喉，承接角宿之后的龙身结构。",
    system: "twenty-eight-mansions",
    mansion: "亢宿",
    fourSymbol: "东方苍龙",
    buTianGeNote: "《步天歌》用宿星和附属星官描述其在东方龙象中的位置。",
    fenye: {
      mansion: "亢宿",
      ancientRegion: "兖州 / 郑等说法",
      modernApproximation: "常见说法大致牵涉今河南、山东一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["角宿", "氐宿"],
    sourceTags: SOURCE_TRADITION,
  },
  氐宿: {
    id: "氐宿",
    name: "氐宿",
    pinyin: "Di Xiu",
    meaningZh: "东方苍龙的根部或胸腹附近星宿，名称常解释为根基。",
    system: "twenty-eight-mansions",
    mansion: "氐宿",
    fourSymbol: "东方苍龙",
    buTianGeNote: "传统宿次中位于亢宿之后、房宿之前。",
    fenye: {
      mansion: "氐宿",
      ancientRegion: "兖州 / 宋等说法",
      modernApproximation: "常见说法大致牵涉今河南东部、山东西南一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["亢宿", "房宿"],
    sourceTags: SOURCE_TRADITION,
  },
  房宿: {
    id: "房宿",
    name: "房宿",
    pinyin: "Fang Xiu",
    meaningZh: "东方苍龙腹部附近的星宿，传统上也有天驷、房室等象征。",
    system: "twenty-eight-mansions",
    mansion: "房宿",
    fourSymbol: "东方苍龙",
    buTianGeNote: "《步天歌》将房宿与周边从官、钩钤等星官同区描述。",
    fenye: {
      mansion: "房宿",
      ancientRegion: "豫州 / 宋等说法",
      modernApproximation: "常见说法大致牵涉今河南、安徽北部一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["氐宿", "心宿"],
    sourceTags: SOURCE_TRADITION,
  },
  心宿: {
    id: "心宿",
    name: "心宿",
    pinyin: "Xin Xiu",
    meaningZh: "东方苍龙的心脏。心宿二即“大火”，在古代时令观测中十分重要。",
    system: "twenty-eight-mansions",
    mansion: "心宿",
    fourSymbol: "东方苍龙",
    buTianGeNote: "心宿在传统文献中常作为显著时令星宿理解。",
    fenye: {
      mansion: "心宿",
      ancientRegion: "豫州 / 宋等说法",
      modernApproximation: "常见说法大致牵涉今河南东部、安徽北部一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["房宿", "尾宿"],
    relatedWesternConstellations: ["Sco"],
    sourceTags: SOURCE_TRADITION,
  },
  尾宿: {
    id: "尾宿",
    name: "尾宿",
    pinyin: "Wei Xiu",
    meaningZh: "东方苍龙的尾部，接续心宿之后。",
    system: "twenty-eight-mansions",
    mansion: "尾宿",
    fourSymbol: "东方苍龙",
    buTianGeNote: "《步天歌》将尾宿与箕宿相邻描述，形成青龙尾部结构。",
    fenye: {
      mansion: "尾宿",
      ancientRegion: "幽州 / 燕等说法",
      modernApproximation: "常见说法大致牵涉今河北北部、北京、辽宁一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["心宿", "箕宿"],
    sourceTags: SOURCE_TRADITION,
  },
  箕宿: {
    id: "箕宿",
    name: "箕宿",
    pinyin: "Ji Xiu",
    meaningZh: "形似簸箕，象征扬谷用具，是东方苍龙七宿最后一宿。",
    system: "twenty-eight-mansions",
    mansion: "箕宿",
    fourSymbol: "东方苍龙",
    buTianGeNote: "作为东方七宿收束，常与斗宿进入北方玄武序列相接。",
    fenye: {
      mansion: "箕宿",
      ancientRegion: "幽州 / 燕等说法",
      modernApproximation: "常见说法大致牵涉今河北北部、北京、辽宁一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["尾宿", "斗宿"],
    sourceTags: SOURCE_TRADITION,
  },
  斗宿: {
    id: "斗宿",
    name: "斗宿",
    pinyin: "Dou Xiu",
    meaningZh: "北方玄武七宿之首，形似斗，包含南斗六星的传统意象。",
    system: "twenty-eight-mansions",
    mansion: "斗宿",
    fourSymbol: "北方玄武",
    buTianGeNote: "《步天歌》以斗宿开启北方玄武七宿。",
    fenye: {
      mansion: "斗宿",
      ancientRegion: "吴越等说法",
      modernApproximation: "常见说法大致牵涉今江苏南部、浙江、上海一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["箕宿", "牛宿"],
    sourceTags: SOURCE_TRADITION,
  },
  牛宿: {
    id: "牛宿",
    name: "牛宿",
    pinyin: "Niu Xiu",
    meaningZh: "北方玄武七宿之一，与牛、牵牛等农耕和银河意象相连。",
    system: "twenty-eight-mansions",
    mansion: "牛宿",
    fourSymbol: "北方玄武",
    buTianGeNote: "牛宿在银河附近，与女宿、虚宿组成北方宿次。",
    fenye: {
      mansion: "牛宿",
      ancientRegion: "吴越等说法",
      modernApproximation: "常见说法大致牵涉今江浙一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["斗宿", "女宿", "河鼓"],
    sourceTags: SOURCE_TRADITION,
  },
  女宿: {
    id: "女宿",
    name: "女宿",
    pinyin: "Nü Xiu",
    meaningZh: "北方玄武七宿之一，名称与女子、女工或织作意象有关。",
    system: "twenty-eight-mansions",
    mansion: "女宿",
    fourSymbol: "北方玄武",
    buTianGeNote: "女宿与牛宿、虚宿相邻，在银河附近的传统结构中理解。",
    fenye: {
      mansion: "女宿",
      ancientRegion: "吴越等说法",
      modernApproximation: "常见说法大致牵涉今江浙一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["牛宿", "虚宿"],
    sourceTags: SOURCE_TRADITION,
  },
  虚宿: {
    id: "虚宿",
    name: "虚宿",
    pinyin: "Xu Xiu",
    meaningZh: "北方玄武七宿之一，名称有空虚、丘墟等象征解释。",
    system: "twenty-eight-mansions",
    mansion: "虚宿",
    fourSymbol: "北方玄武",
    buTianGeNote: "虚宿承接女宿，连接危宿。",
    fenye: {
      mansion: "虚宿",
      ancientRegion: "青州 / 齐等说法",
      modernApproximation: "常见说法大致牵涉今山东半岛及周边。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["女宿", "危宿"],
    sourceTags: SOURCE_TRADITION,
  },
  危宿: {
    id: "危宿",
    name: "危宿",
    pinyin: "Wei Xiu",
    meaningZh: "北方玄武七宿之一，常解释为高处、屋脊或危险处的意象。",
    system: "twenty-eight-mansions",
    mansion: "危宿",
    fourSymbol: "北方玄武",
    buTianGeNote: "危宿与室宿、壁宿构成玄武后段。",
    fenye: {
      mansion: "危宿",
      ancientRegion: "青州 / 齐等说法",
      modernApproximation: "常见说法大致牵涉今山东一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["虚宿", "室宿"],
    sourceTags: SOURCE_TRADITION,
  },
  室宿: {
    id: "室宿",
    name: "室宿",
    pinyin: "Shi Xiu",
    meaningZh: "北方玄武七宿之一，象征宫室、营室或居处。",
    system: "twenty-eight-mansions",
    mansion: "室宿",
    fourSymbol: "北方玄武",
    buTianGeNote: "室宿常与壁宿合看，构成房屋和墙壁意象。",
    fenye: {
      mansion: "室宿",
      ancientRegion: "并州 / 卫等说法",
      modernApproximation: "常见说法大致牵涉今山西、河北南部一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["危宿", "壁宿"],
    sourceTags: SOURCE_TRADITION,
  },
  壁宿: {
    id: "壁宿",
    name: "壁宿",
    pinyin: "Bi Xiu",
    meaningZh: "北方玄武七宿之一，象征宫室或营垒的墙壁。",
    system: "twenty-eight-mansions",
    mansion: "壁宿",
    fourSymbol: "北方玄武",
    buTianGeNote: "壁宿收束北方玄武七宿，并与西方白虎的奎宿相接。",
    fenye: {
      mansion: "壁宿",
      ancientRegion: "并州 / 卫等说法",
      modernApproximation: "常见说法大致牵涉今山西、河北一带。",
      caution: FENYE_CAUTION,
    },
    relatedAsterisms: ["室宿", "奎宿"],
    sourceTags: SOURCE_TRADITION,
  },
};

const whiteTiger = ["奎宿", "娄宿", "胃宿", "昴宿", "毕宿", "觜宿", "参宿"];
const vermilionBird = ["井宿", "鬼宿", "柳宿", "星宿", "张宿", "翼宿", "轸宿"];

whiteTiger.forEach((name) => {
  TWENTY_EIGHT_MANSION_CULTURE[name] ||= {
    id: name,
    name,
    meaningZh: `${name}属于西方白虎七宿。具体星官含义在不同文献中解释略有差异，应结合《步天歌》和传统星官图阅读。`,
    system: "twenty-eight-mansions",
    mansion: name,
    fourSymbol: "西方白虎",
    buTianGeNote:
      "《步天歌》按宿次描述本宿及其附属星官，是理解二十八宿顺序的重要文本。",
    fenye: {
      mansion: name,
      ancientRegion: "鲁 / 赵 / 魏等分野说法",
      modernApproximation:
        "常见说法大致牵涉今山东、河北、河南北部一带，具体随文献不同。",
      caution: FENYE_CAUTION,
    },
    sourceTags: SOURCE_TRADITION,
  };
});

vermilionBird.forEach((name) => {
  TWENTY_EIGHT_MANSION_CULTURE[name] ||= {
    id: name,
    name,
    meaningZh: `${name}属于南方朱雀七宿，是南方天区宿次的一部分。`,
    system: "twenty-eight-mansions",
    mansion: name,
    fourSymbol: "南方朱雀",
    buTianGeNote: "《步天歌》按朱雀七宿顺序描述南方星官结构。",
    fenye: {
      mansion: name,
      ancientRegion: "秦 / 周 / 楚等分野说法",
      modernApproximation:
        "常见说法大致牵涉今陕西、河南、湖北、湖南一带，具体随文献不同。",
      caution: FENYE_CAUTION,
    },
    sourceTags: SOURCE_TRADITION,
  };
});

export const CHINESE_ASTERISM_CULTURE: Record<
  string,
  ChineseAsterismCultureNote
> = {
  ...TWENTY_EIGHT_MANSION_CULTURE,
  紫微垣: {
    id: "紫微垣",
    name: "紫微垣",
    meaningZh:
      "紫微垣象征天帝居所和核心宫廷，是三垣中最接近北天极的区域。左右垣可理解为环卫帝座的宫墙。",
    system: "three-enclosures",
    enclosure: "紫微垣",
    buTianGeNote:
      "《步天歌》把三垣作为独立大区描述，紫微垣代表北极附近的天廷核心。",
    relatedAsterisms: ["北极", "勾陈", "紫微左垣", "紫微右垣"],
    sourceTags: SOURCE_TRADITION,
  },
  太微垣: {
    id: "太微垣",
    name: "太微垣",
    meaningZh:
      "太微垣常象征朝廷、政务和百官议政空间。左右垣像宫墙，两侧星官共同构成天上朝会场所。",
    system: "three-enclosures",
    enclosure: "太微垣",
    buTianGeNote:
      "《步天歌》将太微垣作为三垣之一，和紫微、天市共同构成北天制度空间。",
    relatedAsterisms: ["太微左垣", "太微右垣", "五帝座"],
    sourceTags: SOURCE_TRADITION,
  },
  天市垣: {
    id: "天市垣",
    name: "天市垣",
    meaningZh:
      "天市垣象征市场、交易、度量衡和城市空间，是三垣中商业和物资流通意象最强的一垣。",
    system: "three-enclosures",
    enclosure: "天市垣",
    buTianGeNote:
      "《步天歌》天市垣篇明确以市场、车肆、列肆、斗斛等星官组织其意义。",
    relatedAsterisms: ["天市左垣", "天市右垣", "帝座", "斗", "斛"],
    sourceTags: SOURCE_TRADITION,
  },
  东方青龙: {
    id: "东方青龙",
    name: "东方青龙",
    meaningZh:
      "东方青龙由角、亢、氐、房、心、尾、箕七宿组成，象征东方、春季和龙形天区。",
    system: "four-symbols",
    fourSymbol: "东方青龙",
    sourceTags: SOURCE_TRADITION,
  },
  北方玄武: {
    id: "北方玄武",
    name: "北方玄武",
    meaningZh:
      "北方玄武由斗、牛、女、虚、危、室、壁七宿组成，象征北方、冬季和龟蛇合体形象。",
    system: "four-symbols",
    fourSymbol: "北方玄武",
    sourceTags: SOURCE_TRADITION,
  },
  西方白虎: {
    id: "西方白虎",
    name: "西方白虎",
    meaningZh:
      "西方白虎由奎、娄、胃、昴、毕、觜、参七宿组成，象征西方、秋季和虎形天区。",
    system: "four-symbols",
    fourSymbol: "西方白虎",
    sourceTags: SOURCE_TRADITION,
  },
  南方朱雀: {
    id: "南方朱雀",
    name: "南方朱雀",
    meaningZh:
      "南方朱雀由井、鬼、柳、星、张、翼、轸七宿组成，象征南方、夏季和鸟形天区。",
    system: "four-symbols",
    fourSymbol: "南方朱雀",
    sourceTags: SOURCE_TRADITION,
  },
  北方战场: {
    id: "北方战场",
    name: "北方战场",
    meaningZh:
      "当前项目中的北方战场是基于垒壁阵、羽林军、北落师门等军事星官生成的文化主题示意区，表现防御、军营和边塞意象。",
    system: "battlefields",
    relatedAsterisms: ["垒壁阵", "羽林军", "北落师门", "天垒城"],
    sourceTags: ["project-derived"],
  },
  西北战场: {
    id: "西北战场",
    name: "西北战场",
    meaningZh:
      "当前项目中的西北战场围绕昴宿、毕宿、天大将军、五车等星官生成，表现军阵、车马、仓储和西北方位主题。传统解释存在差异。",
    system: "battlefields",
    relatedAsterisms: ["昴宿", "毕宿", "天大将军", "五车"],
    sourceTags: ["project-derived"],
  },
  南方战场: {
    id: "南方战场",
    name: "南方战场",
    meaningZh:
      "当前项目中的南方战场围绕翼宿、轸宿、角宿、亢宿、库楼、骑官等星官生成，表现南方军事设施和车骑阵列主题。传统解释存在差异。",
    system: "battlefields",
    relatedAsterisms: ["翼宿", "轸宿", "角宿", "亢宿", "库楼", "骑官"],
    sourceTags: ["project-derived"],
  },
};

export const CULTURE_SOURCE_LABELS: Record<SourceTag, string> = {
  "iau-constellations": "IAU constellation materials",
  "hk-space-museum": "Hong Kong Space Museum Chinese starlore",
  "idp-chinese-astronomy": "International Dunhuang Programme Chinese astronomy",
  "bu-tian-ge": "Danyuanzi Bu Tian Ge",
  "ctext-traditional": "ctext / traditional Chinese astronomy references",
  "mpiwg-fenye": "MPIWG fenye research description",
  "project-derived": "project-derived visualization note",
};

