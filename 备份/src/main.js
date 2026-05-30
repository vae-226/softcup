import { docsContent } from "./data.js";
import {
  addKnowledgeItem,
  buildFeedbackReport,
  chatWithGuide,
  chatWithQwenGuide,
  createLiveSnapshot,
  getAnalytics,
  getAvatarProfiles,
  getKnowledgeBase,
  getRoutes,
  getScenicProfile,
  removeKnowledgeItem,
  saveAvatarProfile,
  startSpotGuide,
  submitVisitorFeedback,
  switchGuideScene,
  switchRoute,
  planRouteToSpot,
  toggleKnowledgeStatus,
  updateVisitorProfile
} from "./service.js";

const scenic = getScenicProfile();

const state = {
  currentView: "tourist",
  adminTab: "overview",
  adminLoggedIn: false,
  adminLoginOpen: false,
  currentMode: "text",
  currentEmotion: "smile",
  activeAvatar: getAvatarProfiles()[0],
  visitorProfile: {
    name: "游客001",
    interest: "history",
    duration: "2小时",
    groupType: "个人",
    language: "中文"
  },
  currentRouteId: "history",
  selectedSpotId: "buddha",
  activeSpotDetail: null,
  messageInput: "",
  lastApiResult: null,
  aiLoading: false,
  voiceDraft: "我对历史文化感兴趣，帮我推荐一条 2 小时路线。",
  newKnowledge: {
    title: "",
    category: "历史文化",
    keywords: "",
    content: ""
  },
  feedbackForm: {
    score: 5,
    emotion: "满意",
    content: ""
  },
  messages: [
    {
      role: "assistant",
      content: "你好，我是灵灵，欢迎来到灵山胜境。你可以问我灵山大佛、九龙灌浴、梵宫、五印坛城、演出时间或亲子路线，也可以点击场景开始导览。",
      meta: "系统欢迎语"
    }
  ]
};

const touristView = document.querySelector("#tourist-view");
const adminView = document.querySelector("#admin-view");
const docsView = document.querySelector("#docs-view");

function renderApp() {
  renderShellNav();
  renderTourist();
  renderAdmin();
  renderDocs();
  bindGlobalNav();
  bindShellEvents();
}

function renderShellNav() {
  const nav = document.querySelector(".nav");
  if (nav) {
    nav.innerHTML = state.adminLoggedIn
      ? `
        <button class="nav-btn ${state.currentView === "tourist" ? "active" : ""}" data-view="tourist">游客导览端</button>
        <button class="nav-btn ${state.currentView === "admin" ? "active" : ""}" data-view="admin">管理后台</button>
        <button class="nav-btn ${state.currentView === "docs" ? "active" : ""}" data-view="docs">方案说明</button>
      `
      : `
        <button class="nav-btn active" data-view="tourist">游客导览端</button>
      `;
  }

  const topbarMeta = document.querySelector(".topbar-meta");
  if (topbarMeta) {
    topbarMeta.innerHTML = `
      <span class="topbar-tag">灵山胜境游客端</span>
      <span class="topbar-tag">V2026.05.29.12</span>
      ${state.adminLoggedIn
        ? `<button class="topbar-login" data-shell-action="logout-admin">退出后台</button>`
        : `<button class="topbar-login" data-shell-action="open-admin-login">管理员登录</button>`}
    `;
  }
}

function bindGlobalNav() {
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.currentView);
    button.onclick = () => {
      if (button.dataset.view === "admin" && !state.adminLoggedIn) {
        state.adminLoginOpen = true;
        renderApp();
        return;
      }
      state.currentView = button.dataset.view;
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
      document.querySelector(`#${button.dataset.view}-view`).classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
      bindGlobalNav();
    };
  });
}

function bindShellEvents() {
  document.querySelectorAll("[data-shell-action]").forEach((button) => {
    button.onclick = () => {
      const action = button.dataset.shellAction;
      if (action === "open-admin-login") {
        state.adminLoginOpen = true;
        renderApp();
      }
      if (action === "close-admin-login") {
        state.adminLoginOpen = false;
        renderApp();
      }
      if (action === "login-admin") {
        const account = document.querySelector("#admin-account")?.value.trim();
        const password = document.querySelector("#admin-password")?.value.trim();
        if (account === "admin" && password === "123456") {
          state.adminLoggedIn = true;
          state.adminLoginOpen = false;
          state.currentView = "admin";
          document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
          document.querySelector("#admin-view").classList.add("active");
          renderApp();
        } else {
          alert("管理员账号或密码错误。演示账号：admin，密码：123456");
        }
      }
      if (action === "logout-admin") {
        state.adminLoggedIn = false;
        state.currentView = "tourist";
        document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
        document.querySelector("#tourist-view").classList.add("active");
        renderApp();
      }
    };
  });
}

function renderTourist() {
  const snapshot = createLiveSnapshot();
  const route = snapshot.routes.find((item) => item.id === state.currentRouteId) || snapshot.routes[0];
  const selectedSpot = snapshot.spots.find((item) => item.id === state.selectedSpotId) || snapshot.spots[0];

  touristView.innerHTML = `
    <section class="hero">
      <div class="panel hero-card">
        <div class="section-title">
          <div>
            <h2>${scenic.name}</h2>
            <p>${scenic.city} · ${scenic.theme}</p>
          </div>
          <span class="badge">游客交互端</span>
        </div>
        <p class="muted">${scenic.overview}</p>
        <div class="hero-highlights">
          ${scenic.highlights.map((item) => `<span class="pill">${item}</span>`).join("")}
        </div>
        <div class="grid-4" style="margin-top:18px;">
          <div class="status-card">
            <strong>${snapshot.analytics.avgResponseSeconds}s</strong>
            <span>平均响应</span>
          </div>
          <div class="status-card">
            <strong>${snapshot.analytics.responseAccuracy}%</strong>
            <span>问答准确率</span>
          </div>
          <div class="status-card">
            <strong>${snapshot.analytics.satisfaction}%</strong>
            <span>游客满意度</span>
          </div>
          <div class="status-card">
            <strong>${snapshot.analytics.serviceCountToday}</strong>
            <span>今日服务人次</span>
          </div>
        </div>
      </div>

      <div class="panel hero-card digital-human">
        <div class="section-title">
          <div>
            <h2>数字人导游</h2>
            <p>${state.activeAvatar.name} · ${state.activeAvatar.costume} · ${state.activeAvatar.voice}</p>
          </div>
          <span class="tag"><span class="dot"></span>在线接待</span>
        </div>
        <div class="avatar-stage">
          <div class="halo"></div>
          <div class="avatar">
            <div class="head">
              <div class="hair"></div>
              <div class="brow left"></div>
              <div class="brow right"></div>
              <div class="eye left"></div>
              <div class="eye right"></div>
              <div class="mouth ${state.currentEmotion}" id="mouth"></div>
            </div>
            <div class="body">
              <div class="sash"></div>
            </div>
          </div>
          <div class="scenery">
            <div class="hill one"></div>
            <div class="hill two"></div>
            <div class="hill three"></div>
          </div>
        </div>
        <div class="expression-row">
          <span class="tag">表情状态：${emotionLabel(state.currentEmotion)}</span>
          <span class="tag">当前讲解：${selectedSpot.name}</span>
          <span class="tag">语言：${state.visitorProfile.language}</span>
          <span class="tag">AI接口：千问 Qwen 优先 / 本地RAG降级</span>
        </div>
        <div class="avatar-picker">
          ${snapshot.avatars.map((avatar) => `
            <button class="avatar-choice ${avatar.id === state.activeAvatar.id ? "active" : ""}" data-action="choose-avatar" data-avatar-id="${avatar.id}">
              <strong>${avatar.name}</strong>
              <span>${avatar.voice} · ${avatar.style}</span>
            </button>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="tourist-workbench">
      <div class="tourist-left">
        <div class="panel pad">
          <div class="panel-title">
            <div>
              <h3>场景导览</h3>
              <p>点击景点卡片，数字人切换讲解上下文</p>
            </div>
          </div>
          <div class="spot-grid">
            ${snapshot.spots.map((spot) => `
              <button class="spot-card ${spot.id === state.selectedSpotId ? "active" : ""}" data-action="select-spot" data-spot-id="${spot.id}">
                <strong>${spot.name}</strong>
                <span>${spot.label}</span>
                <small>${spot.teaser}</small>
                <em>进入讲解</em>
              </button>
            `).join("")}
          </div>
          ${renderSpotDetail(selectedSpot, snapshot)}
        </div>

        <div class="panel chat-panel">
          <div class="ai-chat-head">
            <div>
          <h3>和灵灵 AI 导游对话</h3>
              <p>直接输入任何景区问题，系统会优先调用千问 qwen-plus。</p>
            </div>
            <span class="badge">${state.aiLoading ? "千问生成中" : "千问已接入"}</span>
          </div>
          <div class="quick-ai-composer">
            <input id="quick-ai-input" value="${escapeHtml(state.messageInput)}" placeholder="例如：我现在在灵山大佛，像真人导游一样给我讲讲这里。">
            <button class="primary-btn" data-action="send-quick-ai">${state.aiLoading ? "生成中..." : "问 AI 导游"}</button>
          </div>
          <div class="toolbar pad" style="padding:14px 16px 0;">
            <div class="segmented">
              <button class="${state.currentMode === "text" ? "active" : ""}" data-action="switch-mode" data-mode="text">文本问答</button>
              <button class="${state.currentMode === "voice" ? "active" : ""}" data-action="switch-mode" data-mode="voice">语音模式</button>
            </div>
            <button class="ghost-btn" data-action="quick-question" data-question="夜游演艺几点开始？">夜游时间</button>
            <button class="ghost-btn" data-action="quick-question" data-question="哪里适合拍照看晚霞？">拍照推荐</button>
            <button class="ghost-btn" data-action="quick-question" data-question="我带孩子来玩，推荐亲子路线。">亲子路线</button>
          </div>
          <div class="chat-messages">
            ${state.messages.map(renderMessage).join("")}
          </div>
          <div class="composer">
            <textarea id="message-input" placeholder="请输入问题，或者点击上方快捷问题。">${escapeHtml(state.messageInput)}</textarea>
            <div class="input-row">
              <div class="tag">
                ${state.currentMode === "voice"
                  ? `<span class="signal-bar"><span></span><span></span><span></span><span></span></span> 语音识别准备中`
                  : "文本输入已启用"}
              </div>
              <div class="toolbar">
                <button class="secondary-btn" data-action="fill-voice">填充语音示例</button>
                <button class="primary-btn" data-action="send-message">${state.aiLoading ? "AI生成中..." : "发送给数字人"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tourist-right">
        <div class="panel pad">
          <div class="panel-title">
            <div>
              <h3>游客档案</h3>
              <p>兴趣偏好会影响路线和讲解重点</p>
            </div>
          </div>
          <div class="field-grid">
            <label class="field">
              <span>游客昵称</span>
              <input id="visitor-name" value="${escapeHtml(state.visitorProfile.name)}">
            </label>
            <label class="field">
              <span>出行类型</span>
              <select id="visitor-group">
                ${["个人", "情侣", "亲子家庭", "研学团队"].map((item) => `
                  <option value="${item}" ${item === state.visitorProfile.groupType ? "selected" : ""}>${item}</option>
                `).join("")}
              </select>
            </label>
            <label class="field">
              <span>兴趣方向</span>
              <select id="visitor-interest">
                <option value="history" ${state.visitorProfile.interest === "history" ? "selected" : ""}>历史文化</option>
                <option value="nature" ${state.visitorProfile.interest === "nature" ? "selected" : ""}>自然风光</option>
                <option value="family" ${state.visitorProfile.interest === "family" ? "selected" : ""}>亲子互动</option>
                <option value="service" ${state.visitorProfile.interest === "service" ? "selected" : ""}>便民服务</option>
              </select>
            </label>
            <label class="field">
              <span>可游览时长</span>
              <select id="visitor-duration">
                ${["1小时", "2小时", "3小时", "半天"].map((item) => `
                  <option value="${item}" ${item === state.visitorProfile.duration ? "selected" : ""}>${item}</option>
                `).join("")}
              </select>
            </label>
            <label class="field">
              <span>讲解语言</span>
              <select id="visitor-language">
                ${["中文", "English", "日语", "无障碍模式"].map((item) => `
                  <option value="${item}" ${item === state.visitorProfile.language ? "selected" : ""}>${item}</option>
                `).join("")}
              </select>
            </label>
            <div class="field">
              <span>推荐操作</span>
              <button class="primary-btn" data-action="save-profile">更新偏好并重算路线</button>
            </div>
          </div>
        </div>

        <div class="panel pad">
          <div class="panel-title">
            <div>
              <h3>个性化路线</h3>
              <p>当前推荐给 ${state.visitorProfile.name}</p>
            </div>
          </div>
          <div class="route-switcher">
            ${snapshot.routes.map((item) => `
              <button class="route-switch ${item.id === state.currentRouteId ? "active" : ""}" data-action="select-route" data-route-id="${item.id}">
                ${item.audience}
              </button>
            `).join("")}
          </div>
          ${renderRouteCard(route)}
          <div class="list-item" style="margin-top:14px;">
            <h4>讲解重点</h4>
            <p>${selectedSpot.script}</p>
          </div>
        </div>

        <div class="panel pad">
          <div class="panel-title">
            <div>
              <h3>快速提问</h3>
              <p>游客常问问题，一键开始对话</p>
            </div>
          </div>
          <div class="quick-question-grid">
            ${[
              "灵山大佛最值得看什么？",
              "九龙灌浴几点表演？",
              "带孩子怎么玩不累？",
              "梵宫有什么艺术亮点？",
              "帮我安排半日路线",
              "哪里适合拍太湖风光？"
            ].map((question) => `
              <button class="ghost-btn" data-action="quick-question" data-question="${question}">${question}</button>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
    ${state.adminLoginOpen ? renderAdminLoginModal() : ""}
  `;

  bindTouristEvents();
}

function renderAdmin() {
  const snapshot = createLiveSnapshot();
  const report = buildFeedbackReport();
  if (!state.adminLoggedIn) {
    adminView.innerHTML = `
      <section class="panel pad admin-locked">
        <h2>管理后台</h2>
        <p class="muted">后台包含知识库、接口监控、游客反馈和运营数据，仅管理员可见。</p>
        <button class="primary-btn" data-shell-action="open-admin-login">管理员登录</button>
      </section>
    `;
    return;
  }
  const tabs = [
    ["overview", "运营概览"],
    ["knowledge", "知识库"],
    ["avatar", "数字人配置"],
    ["report", "游客报告"]
  ];

  adminView.innerHTML = `
    <section class="section-title" style="margin-bottom:18px;">
      <div>
        <h2>管理后台</h2>
        <p>一套完整的运营控制台，覆盖知识库管理、导游配置、游客洞察和服务监控</p>
      </div>
      <span class="badge">管理员视角</span>
    </section>

    <div class="tab-row admin-tabs">
      ${tabs.map(([id, label]) => `
        <button class="tab-btn ${state.adminTab === id ? "active" : ""}" data-action="switch-admin-tab" data-tab="${id}">
          ${label}
        </button>
      `).join("")}
    </div>

    ${state.adminTab === "overview" ? renderAdminOverview(snapshot) : ""}
    ${state.adminTab === "knowledge" ? renderAdminKnowledge(snapshot) : ""}
    ${state.adminTab === "avatar" ? renderAdminAvatar(snapshot) : ""}
    ${state.adminTab === "report" ? renderAdminReport(snapshot, report) : ""}
    <section style="margin-top:18px;">${renderApiLogPanel(snapshot)}</section>
  `;

  bindAdminEvents();
}

function renderAdminLoginModal() {
  return `
    <div class="modal-mask">
      <div class="login-modal">
        <div class="panel-title">
          <div>
            <h3>管理员登录</h3>
            <p>登录后进入知识库、数据大屏和接口监控后台</p>
          </div>
          <button class="ghost-btn" data-shell-action="close-admin-login">关闭</button>
        </div>
        <div class="field-grid">
          <label class="field full">
            <span>账号</span>
            <input id="admin-account" value="admin">
          </label>
          <label class="field full">
            <span>密码</span>
            <input id="admin-password" type="password" value="123456">
          </label>
          <button class="primary-btn" data-shell-action="login-admin">进入后台</button>
        </div>
      </div>
    </div>
  `;
}

function renderAdminOverview(snapshot) {
  return `
    <section class="kpi-grid" style="margin-top:18px;">
      <div class="kpi-card">
        <strong>${snapshot.analytics.serviceCountToday}</strong>
        <div>今日服务人次</div>
        <div class="metric-trend up">较昨日 +12.6%</div>
      </div>
      <div class="kpi-card">
        <strong>${snapshot.analytics.serviceCountWeek}</strong>
        <div>本周累计服务</div>
        <div class="metric-trend up">夜游高峰最明显</div>
      </div>
      <div class="kpi-card">
        <strong>${snapshot.analytics.satisfaction}%</strong>
        <div>游客满意度</div>
        <div class="metric-trend up">由反馈动态计算</div>
      </div>
      <div class="kpi-card">
        <strong>${snapshot.analytics.avgResponseSeconds}s</strong>
        <div>平均响应时延</div>
        <div class="metric-trend down">弱网区域待优化</div>
      </div>
    </section>

    <section class="grid-2">
      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>情绪趋势</h3>
            <p>游客满意度和交互活跃度综合趋势</p>
          </div>
        </div>
        <div class="chart-box">
          ${snapshot.analytics.emotionTrend.map((item) => `
            <div class="bar-col">
              <div class="bar" style="height:${item.value * 1.6}px;"></div>
              <span>${item.day}</span>
            </div>
          `).join("")}
        </div>
        <p class="chart-caption">数据可用于答辩中展示服务质量持续改善。</p>
      </div>

      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>实时热点</h3>
            <p>当前游客最常提问的问题与关注场景</p>
          </div>
        </div>
        <div class="hot-list">
          ${snapshot.analytics.hotQuestions.map((item, index) => `
            <div class="list-item">
              <h4>TOP ${index + 1}</h4>
              <p>${item}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderAdminKnowledge(snapshot) {
  return `
    <section class="grid-2" style="margin-top:18px;">
      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>知识库列表</h3>
            <p>支持新增、启停和删除知识条目</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>文档名称</th>
                <th>分类</th>
                <th>关键词</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${snapshot.knowledge.map((item) => `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.category}</td>
                  <td>${item.keywords.slice(0, 3).join(" / ")}</td>
                  <td>${item.status}</td>
                  <td>
                    <div class="table-actions">
                      <button class="ghost-btn small-btn" data-action="toggle-kb" data-kb-id="${item.id}">
                        ${item.status === "已启用" ? "停用" : "启用"}
                      </button>
                      <button class="ghost-btn small-btn danger-btn" data-action="delete-kb" data-kb-id="${item.id}">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>新增知识条目</h3>
            <p>模拟上传资料包并实时更新问答基础</p>
          </div>
        </div>
        <div class="field-grid">
          <label class="field">
            <span>文档名称</span>
            <input id="kb-title" value="${escapeHtml(state.newKnowledge.title)}">
          </label>
          <label class="field">
            <span>分类</span>
            <select id="kb-category">
              ${["历史文化", "核心景点", "自然风光", "游客服务", "文旅演艺", "交通安全"].map((item) => `
                <option value="${item}" ${item === state.newKnowledge.category ? "selected" : ""}>${item}</option>
              `).join("")}
            </select>
          </label>
          <label class="field full">
            <span>关键词</span>
            <input id="kb-keywords" value="${escapeHtml(state.newKnowledge.keywords)}" placeholder="用逗号分隔，例如 夜游, 演艺, 灯光">
          </label>
          <label class="field full">
            <span>内容摘要</span>
            <textarea id="kb-content" placeholder="请输入景区知识内容。">${escapeHtml(state.newKnowledge.content)}</textarea>
          </label>
          <div class="field full">
            <button class="primary-btn" data-action="add-kb">保存到知识库</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAdminAvatar(snapshot) {
  return `
    <section class="grid-2" style="margin-top:18px;">
      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>数字人形象管理</h3>
            <p>名称、服装、声音、角色风格可即时生效</p>
          </div>
        </div>
        <div class="avatar-config">
          <div class="avatar-preview">
            <div class="mini-avatar">
              <div class="head">
                <div class="hair"></div>
                <div class="eye left"></div>
                <div class="eye right"></div>
                <div class="mouth ${state.currentEmotion}"></div>
              </div>
              <div class="body">
                <div class="sash"></div>
              </div>
            </div>
          </div>
          <div class="field-grid">
            <label class="field">
              <span>数字人档案</span>
              <select id="avatar-select">
                ${snapshot.avatars.map((item) => `
                  <option value="${item.id}" ${item.id === state.activeAvatar.id ? "selected" : ""}>${item.name}</option>
                `).join("")}
              </select>
            </label>
            <label class="field">
              <span>声音风格</span>
              <input id="avatar-voice" value="${escapeHtml(state.activeAvatar.voice)}">
            </label>
            <label class="field">
              <span>服装主题</span>
              <input id="avatar-costume" value="${escapeHtml(state.activeAvatar.costume)}">
            </label>
            <label class="field">
              <span>服务角色</span>
              <input id="avatar-style" value="${escapeHtml(state.activeAvatar.style)}">
            </label>
            <label class="field full">
              <span>形象设定</span>
              <textarea id="avatar-summary">${escapeHtml(state.activeAvatar.summary || "突出景区文化气质、亲和陪伴感和稳定讲解能力。")}</textarea>
            </label>
            <div class="field full">
              <button class="primary-btn" data-action="save-avatar-config">保存配置</button>
            </div>
          </div>
        </div>
      </div>

      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>能力挂载清单</h3>
            <p>答辩时可直接说明的工程模块</p>
          </div>
        </div>
        <div class="feedback-list">
          ${[
            "ASR: Whisper / FunASR，用于游客语音转文本",
            "TTS: Edge-TTS / ParaTTS，用于拟人化语音播报",
            "LLM: 多模态大模型负责问答与情绪生成",
            "RAG: 本地景区知识库检索增强保障事实正确性",
            "Avatar Engine: Live2D 或 2D 数字人驱动口型和表情"
          ].map((item) => `
            <div class="list-item">
              <p>${item}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderAdminReport(snapshot, report) {
  return `
    <section class="grid-2" style="margin-top:18px;">
      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>游客感受度报告</h3>
            <p>基于聊天记录和反馈表单实时汇总</p>
          </div>
        </div>
        <div class="grid-3">
          <div class="mini-stat">
            <strong>${report.positiveRate}%</strong>
            <div>积极反馈</div>
          </div>
          <div class="mini-stat">
            <strong>${report.neutralRate}%</strong>
            <div>中性反馈</div>
          </div>
          <div class="mini-stat">
            <strong>${report.negativeRate}%</strong>
            <div>待改善反馈</div>
          </div>
        </div>
        <div class="report-card" style="margin-top:16px;">
          <h4>关键词聚合</h4>
          <div class="route-meta">
            ${report.keywords.map((item) => `<span class="pill">${item}</span>`).join("")}
          </div>
        </div>
        <div class="report-card" style="margin-top:16px;">
          <h4>优化建议</h4>
          <ul>
            ${report.advice.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="panel pad">
        <div class="panel-title">
          <div>
            <h3>反馈明细</h3>
            <p>游客满意度、情绪和服务建议</p>
          </div>
        </div>
        <div class="feedback-list">
          ${snapshot.analytics.feedbacks.map((item) => `
            <div class="list-item">
              <h4>${item.user} · ${item.sentiment}</h4>
              <p>${item.summary}</p>
              <p style="margin-top:8px;"><strong>建议：</strong>${item.suggestion}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderDocs() {
  docsView.innerHTML = `
    <section class="doc-layout">
      <div class="panel doc-hero">
        <div class="section-title">
          <div>
            <h2>方案说明</h2>
            <p>这一页给答辩、视频录制和文档讲解使用</p>
          </div>
          <div class="doc-actions">
            <span class="badge">完整交互闭环</span>
            <span class="badge">可升级到真实后端</span>
          </div>
        </div>
        <p class="muted">系统以游客导览和后台运营双端闭环为核心，重点展示多模态交互、景区知识问答、个性化路线、游客洞察和数字人配置能力。</p>
      </div>

      <div class="grid-3">
        <div class="panel doc-section">
          <h3>业务价值</h3>
          <ul>
            <li>缓解旺季导游资源紧张问题，支撑 7x24 小时讲解服务。</li>
            <li>通过数字人增强陪伴感，提升景区品牌记忆点。</li>
            <li>用数据分析替代管理盲区，帮助景区持续优化。</li>
          </ul>
        </div>
        <div class="panel doc-section">
          <h3>核心技术</h3>
          <ul>
            ${docsContent.tech.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        <div class="panel doc-section">
          <h3>系统架构</h3>
          <ul>
            ${docsContent.architecture.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderApiResult() {
  if (!state.lastApiResult) {
    return `
      <div class="api-result">
        <strong>最近接口</strong>
        <span>等待游客或管理员操作</span>
      </div>
    `;
  }

  return `
    <div class="api-result">
      <strong>${state.lastApiResult.method} ${state.lastApiResult.endpoint}</strong>
      <span>${state.lastApiResult.message}</span>
      <small>${state.lastApiResult.requestId} · ${state.lastApiResult.time}</small>
    </div>
  `;
}

function renderApiLogPanel(snapshot) {
  const logs = snapshot.apiLogs || [];
  return `
    <div class="panel pad">
      <div class="panel-title">
        <div>
          <h3>接口调用监控</h3>
          <p>每个按钮都会写入一条 Mock API 调用记录</p>
        </div>
      </div>
      <div class="api-log-list">
        ${logs.length ? logs.map((item) => `
          <div class="api-log-item">
            <strong>${item.method} ${item.endpoint}</strong>
            <span>${item.message}</span>
            <small>${item.requestId} · ${item.time}</small>
          </div>
        `).join("") : `
          <div class="api-log-item">
            <strong>暂无调用</strong>
            <span>点击问答、路线、知识库或数字人配置按钮后会出现记录。</span>
          </div>
        `}
      </div>
    </div>
  `;
}

function renderSpotDetail(spot, snapshot) {
  const related = snapshot.knowledge.filter((item) => item.spotId === spot.id);
  return `
    <div class="spot-detail">
      <div class="panel-title">
        <div>
          <h3>${spot.name}详情</h3>
          <p>${spot.label} · ${spot.teaser}</p>
        </div>
      </div>
      <p class="muted">${spot.script}</p>
      <div class="route-meta" style="margin-top:12px;">
        ${related.map((item) => `<span class="pill">${item.title}</span>`).join("") || `<span class="pill">暂无关联知识</span>`}
      </div>
      <div class="toolbar" style="margin-top:14px;">
        <button class="primary-btn" data-action="start-spot-guide" data-spot-id="${spot.id}">开始数字人讲解</button>
        <button class="secondary-btn" data-action="plan-to-spot" data-spot-id="${spot.id}">规划到此</button>
        <button class="ghost-btn" data-action="voice-spot-guide" data-spot-id="${spot.id}">语音讲解</button>
      </div>
    </div>
  `;
}

function bindTouristEvents() {
  touristView.querySelectorAll("[data-action]").forEach((element) => {
    element.onclick = handleTouristAction;
  });
  touristView.querySelectorAll("#message-input, #quick-ai-input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendAiMessage(input.value);
      }
    });
  });
}

function bindAdminEvents() {
  adminView.querySelectorAll("[data-action]").forEach((element) => {
    element.onclick = handleAdminAction;
  });
}

async function handleTouristAction(event) {
  const action = event.currentTarget.dataset.action;

  if (action === "switch-mode") {
    state.currentMode = event.currentTarget.dataset.mode;
    renderTourist();
    return;
  }

  if (action === "choose-avatar") {
    const avatar = getAvatarProfiles().find((item) => item.id === event.currentTarget.dataset.avatarId);
    if (!avatar) return;
    state.activeAvatar = avatar;
    state.currentEmotion = avatar.mood;
    state.messages.push({
      role: "assistant",
      content: `已切换为${avatar.name}。接下来我会用“${avatar.style}”风格继续陪你游览灵山胜境。`,
      meta: "数字人形象切换"
    });
    renderApp();
    animateMouth();
    return;
  }

  if (action === "select-spot") {
    state.selectedSpotId = event.currentTarget.dataset.spotId;
    const api = switchGuideScene(state.selectedSpotId);
    state.lastApiResult = api;
    const selectedSpot = api.data.spot;
    state.currentEmotion = selectedSpot?.mood || "smile";
    state.messages.push({
      role: "assistant",
      content: `已切换到${selectedSpot.name}讲解模式。${selectedSpot.script}`,
      meta: "场景导览"
    });
    renderTourist();
    animateMouth();
    return;
  }

  if (action === "start-spot-guide" || action === "voice-spot-guide") {
    const spotId = event.currentTarget.dataset.spotId;
    const mode = action === "voice-spot-guide" ? "voice" : "text";
    const api = startSpotGuide(spotId, mode);
    state.lastApiResult = api;
    state.selectedSpotId = spotId;
    state.currentMode = mode;
    state.currentEmotion = api.data.spot.mood;
    state.messages.push({
      role: "assistant",
      content: `${api.message}。${api.data.script}`,
      meta: mode === "voice" ? "语音讲解接口" : "景点讲解接口"
    });
    renderApp();
    animateMouth();
    return;
  }

  if (action === "plan-to-spot") {
    const spotId = event.currentTarget.dataset.spotId;
    const api = planRouteToSpot(spotId, state.visitorProfile.interest);
    state.lastApiResult = api;
    state.selectedSpotId = spotId;
    state.currentRouteId = api.data.route.id;
    state.messages.push({
      role: "assistant",
      content: `${api.message}，预计 ${api.data.eta} 到达。${api.data.navigationTips.join(" ")}`,
      meta: "路线规划接口"
    });
    renderApp();
    return;
  }

  if (action === "quick-question") {
    state.messageInput = event.currentTarget.dataset.question;
    renderTourist();
    return;
  }

  if (action === "fill-voice") {
    state.currentMode = "voice";
    state.messageInput = state.voiceDraft;
    renderTourist();
    return;
  }

  if (action === "save-profile") {
    state.visitorProfile = {
      name: document.querySelector("#visitor-name").value.trim() || "游客001",
      groupType: document.querySelector("#visitor-group").value,
      interest: document.querySelector("#visitor-interest").value,
      duration: document.querySelector("#visitor-duration").value,
      language: document.querySelector("#visitor-language").value
    };
    state.lastApiResult = updateVisitorProfile(state.visitorProfile);
    state.currentRouteId = recommendedRouteId(state.visitorProfile.interest);
    state.currentEmotion = interestEmotion(state.visitorProfile.interest);
    state.messages.push({
      role: "assistant",
      content: `好的，已更新你的游览偏好。我已为你切换到${routeNameById(state.currentRouteId)}，讲解会更偏向${interestLabel(state.visitorProfile.interest)}。`,
      meta: "偏好更新"
    });
    renderApp();
    animateMouth();
    return;
  }

  if (action === "select-route") {
    state.currentRouteId = event.currentTarget.dataset.routeId;
    state.lastApiResult = switchRoute(state.currentRouteId);
    state.messages.push({
      role: "assistant",
      content: `已为你切换到${routeNameById(state.currentRouteId)}。如果需要，我可以继续细讲每个站点的停留建议。`,
      meta: "路线切换"
    });
    renderTourist();
    animateMouth();
    return;
  }

  if (action === "submit-feedback") {
    state.feedbackForm = {
      score: Number(document.querySelector("#feedback-score").value),
      emotion: document.querySelector("#feedback-emotion").value,
      content: document.querySelector("#feedback-content").value.trim()
    };
    state.lastApiResult = submitVisitorFeedback({
      user: state.visitorProfile.name,
      score: state.feedbackForm.score,
      emotion: state.feedbackForm.emotion,
      content: state.feedbackForm.content
    });
    state.feedbackForm.content = "";
    alert("反馈已提交，后台报告已同步更新。");
    renderApp();
    return;
  }

  if (action === "send-message") {
    await sendAiMessage(document.querySelector("#message-input").value);
    return;
  }

  if (action === "send-quick-ai") {
    await sendAiMessage(document.querySelector("#quick-ai-input").value);
  }
}

async function sendAiMessage(rawValue) {
  const value = rawValue.trim();
  if (!value || state.aiLoading) return;

  state.messageInput = "";
  state.messages.push({
    role: "user",
    content: value,
    meta: state.currentMode === "voice" ? "游客语音输入" : "游客文本输入"
  });
  state.aiLoading = true;
  renderApp();
  scrollChatToBottom();

  const api = await chatWithQwenGuide(value, {
    channel: state.currentMode,
    interest: state.visitorProfile.interest,
    spotId: state.selectedSpotId,
    visitorName: state.visitorProfile.name
  });

  state.aiLoading = false;
  state.lastApiResult = api;
  const reply = api.data;
  state.currentEmotion = reply.emotion;
  state.currentRouteId = reply.route.id;
  state.messages.push({
    role: "assistant",
    content: reply.answer,
    meta: reply.provider === "qwen"
      ? `AI来源：千问 ${reply.model} · ${reply.sourceTitle}`
      : `本地降级：${reply.sourceTitle} · ${reply.error || "未启用千问接口"}`
  });
  renderApp();
  animateMouth();
  scrollChatToBottom();
}

function scrollChatToBottom() {
  requestAnimationFrame(() => {
    const chat = document.querySelector(".chat-messages");
    if (chat) chat.scrollTop = chat.scrollHeight;
  });
}

function handleAdminAction(event) {
  const action = event.currentTarget.dataset.action;

  if (action === "switch-admin-tab") {
    state.adminTab = event.currentTarget.dataset.tab;
    renderAdmin();
    return;
  }

  if (action === "toggle-kb") {
    state.lastApiResult = toggleKnowledgeStatus(event.currentTarget.dataset.kbId);
    renderAdmin();
    return;
  }

  if (action === "delete-kb") {
    state.lastApiResult = removeKnowledgeItem(event.currentTarget.dataset.kbId);
    renderApp();
    return;
  }

  if (action === "add-kb") {
    const title = document.querySelector("#kb-title").value.trim();
    const category = document.querySelector("#kb-category").value;
    const keywords = document.querySelector("#kb-keywords").value.trim();
    const content = document.querySelector("#kb-content").value.trim();
    if (!title || !content) {
      alert("请先填写文档名称和内容摘要。");
      return;
    }
    state.lastApiResult = addKnowledgeItem({ title, category, keywords, content });
    state.newKnowledge = { title: "", category: "历史文化", keywords: "", content: "" };
    alert("知识条目已入库，游客端问答可立即使用。");
    renderApp();
    return;
  }

  if (action === "save-avatar-config") {
    const nextProfile = {
      ...state.activeAvatar,
      voice: document.querySelector("#avatar-voice").value.trim(),
      costume: document.querySelector("#avatar-costume").value.trim(),
      style: document.querySelector("#avatar-style").value.trim(),
      summary: document.querySelector("#avatar-summary").value.trim()
    };
    state.lastApiResult = saveAvatarProfile(nextProfile);
    state.activeAvatar = nextProfile;
    alert("数字人配置已保存，游客端已同步更新。");
    renderApp();
    return;
  }
}

adminView.addEventListener("change", (event) => {
  if (event.target.id === "avatar-select") {
    const profile = getAvatarProfiles().find((item) => item.id === event.target.value);
    if (profile) {
      state.activeAvatar = profile;
      state.currentEmotion = profile.mood;
      renderApp();
    }
  }
});

function renderMessage(message) {
  return `
    <div class="bubble ${message.role}">
      <div>${escapeHtml(message.content)}</div>
      <small>${escapeHtml(message.meta || "")}</small>
    </div>
  `;
}

function renderRouteCard(route) {
  return `
    <div class="route-card">
      <h4>${route.audience}</h4>
      <p class="muted">${route.focus}</p>
      <div class="route-meta">
        <span class="tag">${route.duration}</span>
        <span class="tag">${route.pace}</span>
        ${route.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <div class="route-meta">
        ${route.stops.map((stop) => `<span class="route-stop">${stop}</span>`).join("")}
      </div>
    </div>
  `;
}

function routeNameById(id) {
  const route = getRoutes().find((item) => item.id === id);
  return route ? route.audience : "推荐路线";
}

function recommendedRouteId(interest) {
  return {
    history: "history",
    nature: "nature",
    family: "family",
    service: "family"
  }[interest] || "history";
}

function interestEmotion(interest) {
  return {
    history: "thinking",
    nature: "smile",
    family: "excited",
    service: "calm"
  }[interest] || "smile";
}

function interestLabel(interest) {
  return {
    history: "历史文化",
    nature: "自然风光",
    family: "亲子互动",
    service: "便民服务"
  }[interest] || "综合导览";
}

function emotionLabel(emotion) {
  return {
    smile: "微笑讲解",
    calm: "平和陪伴",
    thinking: "思考回答",
    excited: "活泼互动"
  }[emotion] || "自然讲解";
}

function animateMouth() {
  const mouth = document.querySelector("#mouth");
  const brows = document.querySelectorAll(".brow");
  if (!mouth) return;
  mouth.classList.add("talking");
  brows.forEach((item) => {
    item.style.transform = state.currentEmotion === "thinking" ? "translateY(-2px)" : "translateY(0)";
  });
  setTimeout(() => mouth.classList.remove("talking"), 550);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

state.currentRouteId = recommendedRouteId(state.visitorProfile.interest);
state.currentEmotion = state.activeAvatar.mood;
renderApp();
