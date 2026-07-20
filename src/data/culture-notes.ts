/**
 * 真实星空观测台 4.8 —— 重要恒星跨文化说明数据
 *
 * 本文件只保存文化说明文字，不修改恒星坐标、星等、星座/星官连线或天文计算。
 * 西方星座神话常有多个版本，中国星官含义也会随时代和文献变化；
 * 因此文字采用“常见解释/通常解释”的简明表述，供认星学习使用。
 */
window.RSO_CULTURE_NOTES = {
  version: "4.8",
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
