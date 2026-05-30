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
    duration: "6小时",
    stops: ["灵山大照壁", "祥符禅寺", "灵山大佛", "灵山梵宫", "五印坛城"],
    focus: "重点讲解玄奘与小灵山渊源、祥符禅寺兴衰、灵山大佛造像艺术和佛教文化传承。",
    tag: "深度"
  },
  {
    id: "nature",
    audience: "自然风光游客",
    duration: "5小时",
    stops: ["佛足坛", "九龙灌浴", "菩提大道", "灵山大佛", "灵山精舍"],
    focus: "突出太湖风光、菩提大道、灵山大佛观景和禅意园林。",
    tag: "轻松"
  },
  {
    id: "family",
    audience: "亲子家庭",
    duration: "4小时",
    stops: ["九龙灌浴", "佛手广场", "百子戏弥勒", "灵山梵宫", "五印坛城"],
    focus: "用孩子容易理解的方式讲述佛陀诞生故事，结合祈福、雕塑观察和互动演出提升亲子参与感。",
    tag: "亲子"
  }
];

const encyclopedia = [
  { title: "佛教缘起", subtitle: "玄奘与小灵山", icon: "卍", tone: "gold" },
  { title: "大佛工艺", subtitle: "青铜造像与手印", icon: "佛", tone: "red" },
  { title: "梵宫艺术", subtitle: "木雕壁画与演艺", icon: "宫", tone: "ink" },
  { title: "祈福体验", subtitle: "抱佛脚与圣水", icon: "福", tone: "green" },
  { title: "太湖风光", subtitle: "湖山相映", icon: "山", tone: "blue" },
  { title: "游览礼仪", subtitle: "文明参观提醒", icon: "礼", tone: "orange" }
];

const services = [
  { label: "洗手间", icon: "厕" },
  { label: "素斋", icon: "餐" },
  { label: "停车场", icon: "停" },
  { label: "游客中心", icon: "询" }
];

module.exports = {
  encyclopedia,
  knowledgeBase,
  routes,
  scenic,
  services
};
