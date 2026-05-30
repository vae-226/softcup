const scenic = {
  name: "灵山胜境",
  location: "江苏无锡太湖西北部马山镇",
  guideName: "灵灵",
  theme: "佛教文化 / 太湖风光 / 祈福体验"
};

const knowledgeBase = [
  {
    id: "buddha",
    spotName: "灵山大佛",
    title: "灵山大佛",
    keywords: ["灵山大佛", "大佛", "青铜", "五方五佛", "抱佛脚", "216级"],
    mood: "thinking",
    answer:
      "灵山大佛是灵山胜境的标志性景点，于1997年落成开光。讲解重点包括赵朴初先生提出的“五方五佛”理念、216级登云道的祈福寓意、青铜铸造工艺，以及登顶抱佛脚的体验。"
  },
  {
    id: "bath",
    spotName: "九龙灌浴",
    title: "九龙灌浴",
    keywords: ["九龙灌浴", "表演", "佛诞", "祈福", "圣水"],
    mood: "smile",
    answer:
      "九龙灌浴以莲花盛开、九龙吐水和太子佛像升起为核心场景，再现佛陀诞生故事。它适合亲子讲解和祈福体验，表演结束后还可以接取祈福圣水。"
  },
  {
    id: "palace",
    spotName: "灵山梵宫",
    title: "灵山梵宫",
    keywords: ["灵山梵宫", "梵宫", "吉祥颂", "佛教艺术", "演出"],
    mood: "calm",
    answer:
      "灵山梵宫被称为佛教艺术的殿堂，融合东阳木雕、敦煌壁画、景泰蓝、琉璃艺术和声光电技术，也是《吉祥颂》演出的重要场所。"
  }
];

const routes = [
  {
    id: "history",
    audience: "历史文化爱好者",
    displayTitle: "历史朝圣之旅",
    category: "历史文化",
    duration: "6小时",
    displayDuration: "2.5小时",
    image: "/assets/guide/route-history.jpg",
    path: "祥符禅寺 → 灵山大佛 → 玄奘纪念堂",
    hashTag: "#历史",
    stops: ["灵山大照壁", "祥符禅寺", "灵山大佛", "灵山梵宫", "五印坛城"],
    focus: "重点讲解玄奘与小灵山渊源、祥符禅寺兴衰、灵山大佛造像艺术和佛教文化传承。",
    tag: "深度"
  },
  {
    id: "family",
    audience: "亲子家庭",
    displayTitle: "文化探秘之旅",
    category: "建筑艺术",
    duration: "4小时",
    displayDuration: "3小时",
    image: "/assets/guide/route-culture.jpg",
    path: "灵山梵宫 → 五印坛城 → 九龙灌浴",
    hashTag: "#文化",
    stops: ["九龙灌浴", "佛手广场", "百子戏弥勒", "灵山梵宫", "五印坛城"],
    focus: "用孩子容易理解的方式讲述佛陀诞生故事，结合祈福、雕塑观察和互动演出提升亲子参与感。",
    tag: "亲子"
  },
  {
    id: "nature",
    audience: "自然风光游客",
    displayTitle: "自然禅意之旅",
    category: "自然风光",
    duration: "5小时",
    displayDuration: "2小时",
    image: "/assets/guide/route-nature.jpg",
    path: "太湖漫步 → 小灵山登高 → 禅意生态步道",
    hashTag: "#自然",
    stops: ["佛足坛", "九龙灌浴", "菩提大道", "灵山大佛", "灵山精舍"],
    focus: "突出太湖风光、菩提大道、灵山大佛观景和禅意园林。",
    tag: "轻松"
  }
];

const encyclopedia = [
  { title: "灵山大佛", subtitle: "88米青铜大佛，东方佛之代表", icon: "佛", tone: "gold" },
  { title: "九龙灌浴", subtitle: "动态再现佛祖诞生场景", icon: "泉", tone: "ink" },
  { title: "灵山梵宫", subtitle: "东方佛教艺术殿堂", icon: "宫", tone: "red" },
  { title: "五印坛城", subtitle: "藏传佛教体验中心", icon: "城", tone: "gold" },
  { title: "祥符禅寺", subtitle: "千年古刹，玄奘赐名", icon: "寺", tone: "green" },
  { title: "玄奘与灵山", subtitle: "开启灵山佛教千年文脉", icon: "卷", tone: "orange" }
];

const services = [
  { label: "洗手间", icon: "厕" },
  { label: "餐厅", icon: "餐" },
  { label: "停车场", icon: "停" },
  { label: "游客中心", icon: "询" }
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
  costume: "禅意青瓷款",
  voice: "温婉解说",
  style: "佛系禅意",
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
  suggestion: "建议增加“九龙灌浴”互动引导，游客对此环节的提问频率上升了 12%。"
};

const adminKnowledge = [
  {
    title: "灵山大佛历史",
    category: "历史文化",
    spot: "灵山胜境",
    status: "已启用",
    statusClass: "enabled"
  },
  {
    title: "九龙灌浴演艺时间",
    category: "游客服务",
    spot: "灵山胜境",
    status: "已启用",
    statusClass: "enabled"
  },
  {
    title: "梵宫艺术讲解词",
    category: "佛教艺术",
    spot: "灵山梵宫",
    status: "待审核",
    statusClass: "pending"
  }
];

const feedbacks = [
  {
    score: 5,
    stars: ["lit", "lit", "lit", "lit", "lit"],
    sentiment: "Positive",
    time: "10 mins ago",
    content: "讲解很清晰，非常有文化内涵，声音也很好听。",
    action: "采纳为金牌讲解词"
  },
  {
    score: 3,
    stars: ["lit", "lit", "lit", "", ""],
    sentiment: "Neutral",
    time: "1 hour ago",
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
  services
};
