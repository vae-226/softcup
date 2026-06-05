const scenic = {
  name: "灵山胜境",
  location: "江苏无锡太湖西北部马山镇",
  guideName: "灵灵",
  theme: "佛教文化 / 太湖风光 / 祈福体验",
  apiBase: "http://127.0.0.1:8000"
};

const knowledgeBase = [
  {
    id: "buddha",
    spotName: "灵山大佛",
    title: "灵山大佛",
    keywords: ["灵山大佛", "大佛", "青铜", "抱佛脚", "登云道", "216级"],
    mood: "smile",
    image: "/assets/guide/route-history.jpg",
    answer: "灵山大佛是灵山胜境的标志性景点，1997年落成开光，高88米。讲解重点包括“五方五佛”文化理念、216级登云道寓意、青铜铸造工艺，以及登顶抱佛脚的祈福体验。"
  },
  {
    id: "bath",
    spotName: "九龙灌浴",
    title: "九龙灌浴",
    keywords: ["九龙灌浴", "表演", "佛诞", "圣水", "几点", "亲子"],
    mood: "smile",
    image: "/assets/guide/route-culture.jpg",
    answer: "九龙灌浴以莲花盛开、九龙吐水和太子佛像升起为核心场景，再现佛陀诞生故事。它适合亲子讲解和祈福体验，具体场次请以景区当日公告为准。"
  },
  {
    id: "palace",
    spotName: "灵山梵宫",
    title: "灵山梵宫",
    keywords: ["灵山梵宫", "梵宫", "艺术", "吉祥颂", "演出", "建筑"],
    mood: "calm",
    image: "/assets/guide/player-thumb.jpg",
    answer: "灵山梵宫被称为佛教艺术殿堂，融合东阳木雕、敦煌壁画、景泰蓝、琉璃工艺和声光电技术，也是大型演出《吉祥颂》的重要场所。建议预留较完整的参观时间。"
  },
  {
    id: "tantric",
    spotName: "五印坛城",
    title: "五印坛城",
    keywords: ["五印坛城", "藏传", "转经", "坛城", "曼荼罗"],
    mood: "calm",
    image: "/assets/guide/route-nature.jpg",
    answer: "五印坛城集中展示藏传佛教建筑、曼荼罗文化和转经祈福体验。游客可以在这里观察色彩、纹样与空间仪式感，理解汉传与藏传佛教建筑艺术的差异。"
  },
  {
    id: "service",
    spotName: "游客服务",
    title: "游览服务",
    keywords: ["餐饮", "素斋", "停车", "厕所", "游客中心", "半日", "路线", "购票"],
    mood: "calm",
    image: "/assets/guide/route-culture.jpg",
    answer: "建议上午入园避开高峰，穿舒适鞋。餐饮可关注素斋、素面套餐和景区简餐；路线可按历史文化、自然风光或亲子家庭三类选择。"
  }
];

const routes = [
  {
    id: "history",
    audience: "历史文化爱好者",
    displayTitle: "历史朝圣之旅",
    category: "历史文化",
    duration: "6小时",
    displayDuration: "6小时",
    image: "/assets/guide/route-history.jpg",
    path: "祥符禅寺 -> 灵山大佛 -> 灵山梵宫 -> 五印坛城",
    hashTag: "#历史",
    stops: ["祥符禅寺", "灵山大佛", "灵山梵宫", "五印坛城"],
    focus: "重点讲解灵山历史、祥符禅寺兴衰、灵山大佛造像艺术和佛教文化传承。",
    tag: "深度"
  },
  {
    id: "family",
    audience: "亲子家庭",
    displayTitle: "亲子祈福之旅",
    category: "亲子互动",
    duration: "4小时",
    displayDuration: "4小时",
    image: "/assets/guide/route-culture.jpg",
    path: "九龙灌浴 -> 佛手广场 -> 百子戏弥勒 -> 灵山梵宫",
    hashTag: "#亲子",
    stops: ["九龙灌浴", "佛手广场", "百子戏弥勒", "灵山梵宫"],
    focus: "用孩子容易理解的方式讲佛陀诞生故事，结合祈福、雕塑观察和互动演出提升参与感。",
    tag: "轻松"
  },
  {
    id: "nature",
    audience: "自然风光游客",
    displayTitle: "自然禅意之旅",
    category: "自然风光",
    duration: "5小时",
    displayDuration: "5小时",
    image: "/assets/guide/route-nature.jpg",
    path: "菩提大道 -> 灵山大佛 -> 曼飞龙塔 -> 灵山精舍",
    hashTag: "#自然",
    stops: ["九龙灌浴", "菩提大道", "灵山大佛", "曼飞龙塔", "灵山精舍"],
    focus: "突出太湖风光、菩提大道、灵山大佛观景和禅意园林。",
    tag: "慢游"
  }
];

const encyclopedia = [
  { title: "灵山大佛", subtitle: "88米青铜大佛，东方佛教文化代表", icon: "佛", tone: "gold" },
  { title: "九龙灌浴", subtitle: "动态再现佛陀诞生场景", icon: "浴", tone: "ink" },
  { title: "灵山梵宫", subtitle: "东方佛教艺术殿堂", icon: "宫", tone: "red" },
  { title: "五印坛城", subtitle: "藏传佛教体验中心", icon: "坛", tone: "gold" },
  { title: "祥符禅寺", subtitle: "千年古刹，承载灵山文脉", icon: "寺", tone: "green" },
  { title: "游客服务", subtitle: "餐饮、停车、问询和应急服务", icon: "服", tone: "orange" }
];

const services = [
  { label: "洗手间", icon: "厕", detail: "根据当前位置推荐最近洗手间，支持无障碍设施提示。" },
  { label: "餐饮", icon: "餐", detail: "推荐素斋、素面、简餐和亲子友好餐饮点。" },
  { label: "停车场", icon: "停", detail: "展示停车区、接驳路线和离园建议。" },
  { label: "游客中心", icon: "问", detail: "提供咨询、失物招领、应急服务和投诉建议入口。" }
];

const tickets = [
  { id: "adult", name: "成人票", price: 198, desc: "适用于普通成人游客，演示版为模拟购票。" },
  { id: "student", name: "学生票", price: 99, desc: "适用于学生游客，入园需携带有效证件。" },
  { id: "family", name: "亲子套票", price: 328, desc: "一大一小亲子套票，适合家庭轻松游览。" }
];

const adminMetrics = [
  { label: "今日服务人次", value: "1,280", delta: "+5%", tone: "red" },
  { label: "本周服务人次", value: "8,450", delta: "+12%", tone: "gold" },
  { label: "平均响应时间", value: "1.2s", progress: 20, tone: "ink" },
  { label: "游客满意度", value: "98.5%", tone: "gold" },
  { label: "问答准确率", value: "96%", progress: 96, tone: "red", layoutClass: "metric-wide" }
];

const avatarConfig = {
  name: "灵灵",
  costume: "青绿禅意导览服",
  voice: "温柔讲解音",
  style: "可爱亲和",
  summary: "以灵山胜境佛教文化、太湖风光和祈福体验为核心，保持亲和、可信、简洁的导游表达。"
};

const sentimentReport = {
  trends: [
    { label: "开心 / 满意", value: 75, tone: "gold" },
    { label: "平静 / 专注", value: 20, tone: "gray" },
    { label: "困惑 / 抱怨", value: 5, tone: "red" }
  ],
  focusTags: [
    { label: "演出时间", value: "45%" },
    { label: "素食餐饮", value: "30%" },
    { label: "交通接驳", value: "15%" },
    { label: "文创周边", value: "10%" }
  ],
  suggestion: "建议增加“九龙灌浴”互动引导，游客对此环节的提问频率明显较高。"
};

const adminKnowledge = [
  { title: "灵山大佛历史", category: "历史文化", spot: "灵山胜境", status: "已启用", statusClass: "enabled" },
  { title: "九龙灌浴演艺时间", category: "游客服务", spot: "九龙灌浴", status: "已启用", statusClass: "enabled" },
  { title: "梵宫艺术讲解词", category: "佛教艺术", spot: "灵山梵宫", status: "待审核", statusClass: "pending" }
];

const feedbacks = [
  {
    score: 5,
    stars: ["lit", "lit", "lit", "lit", "lit"],
    sentiment: "Positive",
    time: "10分钟前",
    content: "讲解很清楚，非常有文化内容，声音也很好听。",
    action: "采纳为金牌讲解词"
  },
  {
    score: 3,
    stars: ["lit", "lit", "lit", "", ""],
    sentiment: "Neutral",
    time: "1小时前",
    content: "找不到去梵宫的路，希望能有更直接的导航引导。",
    action: "补充路线引导"
  }
];

module.exports = {
  adminKnowledge,
  adminMetrics,
  avatarConfig,
  encyclopedia,
  feedbacks,
  knowledgeBase,
  routes,
  scenic,
  sentimentReport,
  services,
  tickets
};
