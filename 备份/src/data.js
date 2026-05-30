export const scenicSpot = {
  name: "灵山胜境",
  city: "江苏·无锡·马山",
  theme: "佛教文化 / 太湖风光 / 祈福体验",
  overview:
    "灵山胜境坐落于江苏省无锡市太湖西北部马山镇，是国家5A级旅游景区、世界佛教论坛永久会址，被誉为“东方佛国”和“太湖佛国”。景区融合佛教文化、自然景观、人文体验与现代艺术科技。",
  highlights: [
    "基于 jqxx 示范景区公开资料包构建知识库",
    "灵山大佛、九龙灌浴、梵宫、五印坛城重点讲解",
    "按历史文化、自然风光、亲子家庭推荐路线",
    "游客行为数据驱动后台分析"
  ]
};

export const scenicSpots = [
  {
    id: "buddha",
    name: "灵山大佛",
    label: "核心地标",
    teaser: "世界最高露天青铜释迦牟尼立像",
    mood: "thinking",
    script: "灵山大佛是景区标志性建筑，体现赵朴初“五方五佛”理念。讲解可围绕佛像手印、216级台阶寓意、青铜铸造工艺和太湖山水格局展开。"
  },
  {
    id: "bath",
    name: "九龙灌浴",
    label: "动态演艺",
    teaser: "佛陀诞生故事的仪式化再现",
    mood: "calm",
    script: "九龙灌浴以“花开见佛”和九条龙吐水为核心场景，再现佛陀诞生故事，是祈福体验和亲子讲解的重点区域。"
  },
  {
    id: "palace",
    name: "灵山梵宫",
    label: "艺术殿堂",
    teaser: "佛教艺术与现代科技融合的代表",
    mood: "smile",
    script: "灵山梵宫被誉为“佛教艺术的卢浮宫”，汇集东阳木雕、敦煌壁画、景泰蓝、琉璃艺术与声光电技术，也是《吉祥颂》演出的重要场所。"
  },
  {
    id: "tantric",
    name: "五印坛城",
    label: "藏传文化",
    teaser: "藏传佛教文化与建筑艺术体验",
    mood: "excited",
    script: "五印坛城集中展现藏传佛教建筑、曼荼罗文化和转经祈福体验，适合对多元佛教文化和建筑艺术感兴趣的游客。"
  }
];

export const knowledgeBase = [
  {
    id: 1,
    title: "灵山胜境概况",
    category: "历史文化",
    keywords: ["灵山", "概况", "历史", "无锡", "太湖", "马山"],
    content:
      "灵山胜境坐落于江苏省无锡市太湖西北部马山镇，地处秦履峰、青龙山、白虎山三山环抱之间，是国家5A级旅游景区、世界佛教论坛永久会址，被誉为“东方佛国”和“太湖佛国”。",
    status: "已启用",
    spotId: "buddha"
  },
  {
    id: 2,
    title: "小灵山佛教缘起",
    category: "核心景点",
    keywords: ["玄奘", "小灵山", "窥基", "佛教", "祥符禅寺"],
    content:
      "唐贞观年间，玄奘法师西行取经归来途经马山，见此地山形酷似印度灵鹫山，遂命名“小灵山”，并嘱咐弟子窥基法师在此住持道场，奠定了此地佛教根基。",
    status: "已启用",
    spotId: "buddha"
  },
  {
    id: 3,
    title: "灵山大佛",
    category: "核心景点",
    keywords: ["灵山大佛", "大佛", "青铜", "五方五佛", "抱佛脚"],
    content:
      "灵山大佛于1997年11月15日落成开光，是景区标志性建筑。讲解重点包括佛像手印含义、216级台阶寓意、青铜铸造工艺以及赵朴初提出的“五方五佛”理念。",
    status: "已启用",
    spotId: "buddha"
  },
  {
    id: 4,
    title: "灵山梵宫",
    category: "佛教艺术",
    keywords: ["梵宫", "吉祥颂", "佛教艺术", "东阳木雕", "敦煌壁画"],
    content:
      "灵山梵宫被誉为“佛教艺术的卢浮宫”，融合菩提伽耶塔风格与中国石窟艺术，内部汇集东阳木雕、敦煌壁画、扬州漆器、景泰蓝、寿山石雕等传统工艺，并运用声光电技术打造沉浸体验。",
    status: "已启用",
    spotId: "palace"
  },
  {
    id: 5,
    title: "九龙灌浴与吉祥颂",
    category: "文旅演艺",
    keywords: ["九龙灌浴", "吉祥颂", "演出", "表演", "祈福"],
    content:
      "九龙灌浴每日约4-5场表演，建议提前到达占位；《吉祥颂》演出通常为10:35、11:30、14:00、16:00，时长约20分钟，具体以景区公告为准。",
    status: "已启用",
    spotId: "bath"
  },
  {
    id: 6,
    title: "实用游览贴士",
    category: "游客服务",
    keywords: ["门票", "餐饮", "素斋", "住宿", "导游", "时间"],
    content:
      "建议春秋季节游览，上午9点前入园可避开高峰。景区内可体验梵宫素斋自助、素面套餐、灵山精舍素斋；导游讲解服务约300元起。游览需穿舒适鞋，并尊重佛教文化场所礼仪。",
    status: "已启用",
    spotId: "palace"
  }
];

export const routes = [
  {
    id: "history",
    audience: "历史文化爱好者",
    duration: "6 小时",
    pace: "深度步行",
    stops: ["灵山大照壁", "佛手广场", "祥符禅寺", "灵山大佛", "灵山梵宫", "五印坛城"],
    focus: "重点讲解玄奘与小灵山渊源、祥符禅寺兴衰、灵山大佛造像艺术和佛教文化传承。",
    tags: ["佛教文化", "深度讲解", "适合研学"]
  },
  {
    id: "nature",
    audience: "自然风光游客",
    duration: "5 小时",
    pace: "轻松漫游",
    stops: ["佛足坛", "九龙灌浴", "菩提大道", "灵山大佛", "曼飞龙塔", "灵山精舍"],
    focus: "突出太湖风光、青龙山白虎山环抱格局、禅意园林和大佛观景平台。",
    tags: ["太湖风光", "拍照", "轻松"]
  },
  {
    id: "family",
    audience: "亲子家庭",
    duration: "4 小时",
    pace: "互动体验",
    stops: ["九龙灌浴", "佛手广场", "百子戏弥勒", "灵山梵宫", "五印坛城"],
    focus: "用生动语言讲述佛陀诞生故事，结合祈福、雕塑观察和互动演出降低理解门槛。",
    tags: ["亲子", "祈福互动", "轻松"]
  }
];

export const analytics = {
  serviceCountToday: 1824,
  serviceCountWeek: 11890,
  avgResponseSeconds: 3.6,
  satisfaction: 94.2,
  responseAccuracy: 92.8,
  emotionTrend: [
    { day: "周一", value: 72 },
    { day: "周二", value: 78 },
    { day: "周三", value: 80 },
    { day: "周四", value: 76 },
    { day: "周五", value: 88 },
    { day: "周六", value: 93 },
    { day: "周日", value: 91 }
  ],
  feedbacks: [
    {
      user: "游客A12",
      score: 5,
      emotion: "满意",
      content: "喜欢夜游灯彩和数字人语音讲解，路线推荐节省了排队时间。"
    },
    {
      user: "游客B07",
      score: 3,
      emotion: "中性",
      content: "问答准确，但在湿地区域语音识别受风噪影响。"
    },
    {
      user: "游客C31",
      score: 5,
      emotion: "惊喜",
      content: "亲子模式中的互动任务提高了孩子参与感。"
    }
  ]
};

export const avatarProfiles = [
  {
    id: "classic",
    name: "云舒",
    costume: "宋风青绿披帛",
    voice: "温润女声",
    style: "亲和讲解型",
    mood: "smile",
    summary: "整体风格温和、可靠，适合多数游客日常导览。"
  },
  {
    id: "scholar",
    name: "岫文",
    costume: "书院长衫",
    voice: "沉稳男声",
    style: "文史专家型",
    mood: "calm",
    summary: "更适合研学团、历史文化深度讲解。"
  }
];

export const docsContent = {
  architecture: [
    "游客端：支持文本输入、语音录入按钮、数字人口型和表情状态反馈、推荐路线展示。",
    "AI 中枢：多模态大模型负责理解游客意图；RAG 知识库负责景区事实问答；推荐引擎基于兴趣标签和游览时段生成路线。",
    "管理后台：知识库管理、数字人配置、感受度分析、运营指标大屏。",
    "可落地扩展：将当前静态数据服务替换为 FastAPI 或 Flask + 向量数据库 + 实时 TTS/ASR 即可进入工程化部署。"
  ],
  tech: [
    "多模态大模型：可接入 Qwen-Omni、GLM-4.1V、GPT-4o 等支持语音、视觉、文本协同的模型。",
    "语音能力：Whisper 或 FunASR 负责语音识别，Paraformer、Edge-TTS、ChatTTS 负责语音合成。",
    "知识库：景区公开资料分块、向量化入库，结合关键词过滤和重排保障事实性准确率。",
    "数字人：可接 Live2D + Web Audio 驱动口型，也可对接开源 2D 数字人或 Unreal、Unity 方案。"
  ]
};
