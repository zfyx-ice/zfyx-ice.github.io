// source/js/dark-mode.js
// ParticleX 主题黑夜模式

(function() {
  console.log('🌙 ParticleX 黑夜模式加载');
  
  // 配置
  const CONFIG = {
    // 存储键名
    STORAGE_KEY: 'particlex_dark_mode',
    
    // 默认模式（auto: 自动, light: 白天, dark: 黑夜）
    defaultMode: 'auto',
    
    // 自动模式的时间设置（24小时制）
    darkStartHour: 18, // 晚上6点开始黑夜模式
    darkEndHour: 8,    // 早上8点结束黑夜模式
    
    // 主题颜色
    lightColors: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      text: '#333333',
      accent: '#64ffda'
    },
    darkColors: {
      primary: '#121212',
      secondary: '#1e1e1e',
      text: '#e0e0e0',
      accent: '#00ffaa'
    }
  };
  
  // 初始化
  function initDarkMode() {
    // 创建切换按钮
    createToggleButton();
    
    // 应用当前模式
    applyDarkMode(getCurrentMode());
    
    // 监听系统主题变化
    if (window.matchMedia) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeMediaQuery.addListener(handleSystemThemeChange);
    }
    
    console.log('✅ 黑夜模式初始化完成');
  }
  
  // 创建切换按钮
  function createToggleButton() {
    // 如果按钮已存在，跳过
    if (document.getElementById('dark-mode-toggle')) return;
    
    // 创建按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dark-mode-toggle';
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.innerHTML = `
      <span class="light-icon">🌞</span>
      <span class="dark-icon">🌙</span>
      <span class="auto-icon">🤖</span>
    `;
    toggleBtn.title = '切换黑夜模式';
    
    // 样式
    const style = document.createElement('style');
    style.textContent = `
      .dark-mode-toggle {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        cursor: pointer;
        font-size: 24px;
        color: white;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      
      .dark-mode-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }
      
      .dark-mode-toggle .light-icon,
      .dark-mode-toggle .dark-icon,
      .dark-mode-toggle .auto-icon {
        position: absolute;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .dark-mode-toggle[data-mode="light"] .light-icon {
        opacity: 1;
        transform: scale(1);
      }
      .dark-mode-toggle[data-mode="light"] .dark-icon,
      .dark-mode-toggle[data-mode="light"] .auto-icon {
        opacity: 0;
        transform: scale(0.5);
      }
      
      .dark-mode-toggle[data-mode="dark"] .dark-icon {
        opacity: 1;
        transform: scale(1);
      }
      .dark-mode-toggle[data-mode="dark"] .light-icon,
      .dark-mode-toggle[data-mode="dark"] .auto-icon {
        opacity: 0;
        transform: scale(0.5);
      }
      
      .dark-mode-toggle[data-mode="auto"] .auto-icon {
        opacity: 1;
        transform: scale(1);
      }
      .dark-mode-toggle[data-mode="auto"] .light-icon,
      .dark-mode-toggle[data-mode="auto"] .dark-icon {
        opacity: 0;
        transform: scale(0.5);
      }
      
      /* 黑夜模式样式 */
      .dark-mode body {
        background-color: ${CONFIG.darkColors.primary} !important;
        color: ${CONFIG.darkColors.text} !important;
        transition: background-color 0.5s ease, color 0.5s ease;
      }
      
      .dark-mode .header,
      .dark-mode .navbar,
      .dark-mode .site-header {
        background-color: ${CONFIG.darkColors.secondary} !important;
        border-bottom-color: #333 !important;
      }
      
      .dark-mode .post,
      .dark-mode .card,
      .dark-mode .article,
      .dark-mode .content {
        background-color: ${CONFIG.darkColors.secondary} !important;
        color: ${CONFIG.darkColors.text} !important;
        border-color: #333 !important;
      }
      
      .dark-mode a {
        color: ${CONFIG.darkColors.accent} !important;
      }
      
      .dark-mode code,
      .dark-mode pre {
        background-color: #2d2d2d !important;
        color: #f8f8f2 !important;
      }
      
      .dark-mode .footer {
        background-color: ${CONFIG.darkColors.primary} !important;
        color: ${CONFIG.darkColors.text} !important;
      }
      
      /* ParticleX 粒子调整 */
      .dark-mode canvas {
        filter: brightness(0.7) contrast(1.2);
      }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(toggleBtn);
    
    // 点击事件
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const currentMode = getCurrentMode();
      let nextMode;
      
      // 切换顺序：auto → light → dark → auto
      switch (currentMode) {
        case 'auto':
          nextMode = 'light';
          break;
        case 'light':
          nextMode = 'dark';
          break;
        case 'dark':
          nextMode = 'auto';
          break;
        default:
          nextMode = 'auto';
      }
      
      // 保存设置
      localStorage.setItem(CONFIG.STORAGE_KEY, nextMode);
      
      // 应用新模式
      applyDarkMode(nextMode);
      
      // 更新按钮状态
      this.setAttribute('data-mode', nextMode);
      
      // 显示提示
      showNotification(`已切换为${getModeName(nextMode)}模式`);
    });
    
    // 设置初始状态
    const initialMode = getCurrentMode();
    toggleBtn.setAttribute('data-mode', initialMode);
  }
  
  // 获取当前模式
  function getCurrentMode() {
    // 1. 检查本地存储
    const savedMode = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (savedMode) return savedMode;
    
    // 2. 检查时间（如果是auto模式）
    if (CONFIG.defaultMode === 'auto') {
      return shouldUseDarkMode() ? 'dark' : 'light';
    }
    
    // 3. 返回默认
    return CONFIG.defaultMode;
  }
  
  // 判断是否应该使用黑夜模式（基于时间）
  function shouldUseDarkMode() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // 如果当前时间在黑暗时间段内
    return currentHour >= CONFIG.darkStartHour || currentHour < CONFIG.darkEndHour;
  }
  
  // 应用黑夜模式
  function applyDarkMode(mode) {
    // 移除现有模式类
    document.body.classList.remove('dark-mode', 'light-mode', 'auto-mode');
    
    // 根据模式应用
    let shouldBeDark = false;
    
    switch (mode) {
      case 'dark':
        shouldBeDark = true;
        break;
      case 'light':
        shouldBeDark = false;
        break;
      case 'auto':
        shouldBeDark = shouldUseDarkMode();
        document.body.classList.add('auto-mode');
        break;
    }
    
    // 添加对应类
    if (shouldBeDark) {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
      
      // 更新meta标签（用于iOS等）
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', CONFIG.darkColors.primary);
      }
    } else {
      document.body.classList.add('light-mode');
      document.documentElement.setAttribute('data-theme', 'light');
      
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', CONFIG.lightColors.primary);
      }
    }
    
    // 更新按钮状态
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('data-mode', mode);
    }
    
    console.log(`🎨 应用${getModeName(mode)}模式`);
  }
  
  // 处理系统主题变化
  function handleSystemThemeChange(e) {
    const currentMode = getCurrentMode();
    if (currentMode === 'auto') {
      applyDarkMode('auto');
    }
  }
  
  // 获取模式名称
  function getModeName(mode) {
    const names = {
      'light': '白天',
      'dark': '黑夜',
      'auto': '自动'
    };
    return names[mode] || mode;
  }
  
  // 显示通知
  function showNotification(message) {
    // 如果已经有通知，先移除
    const oldNotice = document.getElementById('theme-notice');
    if (oldNotice) oldNotice.remove();
    
    // 创建通知元素
    const notice = document.createElement('div');
    notice.id = 'theme-notice';
    notice.textContent = message;
    notice.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
      animation-fill-mode: forwards;
    `;
    
    // 添加动画
    const noticeStyle = document.createElement('style');
    noticeStyle.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(noticeStyle);
    
    document.body.appendChild(notice);
    
    // 3秒后自动移除
    setTimeout(() => {
      if (notice.parentNode) {
        notice.remove();
      }
    }, 3000);
  }
  
  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
  } else {
    initDarkMode();
  }
})();