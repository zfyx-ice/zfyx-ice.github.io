// source/js/live2d-bottom-right.js
// 右下角 Live2D 看板娘

(function() {
  console.log('🎀 右下角看板娘加载中...');
  
  // ========== 配置区域（在这里修改） ==========
  const CONFIG = {
    // 模型选择（选一个）
    model: {
      // 推荐模型：
      name: 'hibiki',  // 响（可爱型）
      
      // 模型URL（根据上面的name自动选择，也可以直接指定）
      jsonPath: '',  // 留空会自动选择
    },
    
    // 显示设置 - 右下角
    display: {
      position: 'right',      // 'right' = 右下角
      width: 180,             // 宽度（像素）
      height: 350,            // 高度（像素）
      hOffset: -20,           // 水平偏移：负数向左，正数向右
      vOffset: -20,           // 垂直偏移：负数向上，正数向下
      opacity: 0.9,           // 透明度
      mobileScale: 0.7,       // 移动端缩放
    },
    
    // 对话设置
    dialog: {
      enable: true,           // 启用对话
      showTime: 6000,         // 显示时间（毫秒）
      messages: [             // 自定义消息
        "你好呀~我是看板娘！",
        "我在右下角陪着你哦~",
        "博客内容很精彩呢！",
        "今天也要开心哦！",
        "喜欢就多来看看吧~",
        "我会一直在这里的！"
      ],
      useHitokoto: true,      // 使用一言API
    },
    
    // 交互设置
    interaction: {
      hoverTips: true,        // 鼠标悬停提示
      clickEffects: true,     // 点击特效
      autoTalk: true,         // 自动对话
      talkInterval: 30000,    // 对话间隔（毫秒）
    }
  };
  // ========== 配置结束 ==========
  
  // 模型库
  const MODEL_LIBRARY = {
    hibiki: {
      name: '响',
      jsonPath: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-hijiki/assets/hijiki.model.json'
    },
    shizuku: {
      name: '雫',
      jsonPath: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-shizuku/assets/shizuku.model.json'
    },
    koharu: {
      name: '小春',
      jsonPath: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-koharu/assets/koharu.model.json'
    },
    miku: {
      name: '初音未来',
      jsonPath: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-miku/assets/miku.model.json'
    },
    haru: {
      name: '春',
      jsonPath: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-haru/assets/haru.model.json'
    },
    tororo: {
      name: 'とろろ',
      jsonPath: 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d-widget-model-tororo/assets/tororo.model.json'
    }
  };
  
  // 设置模型路径
  if (!CONFIG.model.jsonPath && MODEL_LIBRARY[CONFIG.model.name]) {
    CONFIG.model.jsonPath = MODEL_LIBRARY[CONFIG.model.name].jsonPath;
    console.log(`📦 使用模型：${MODEL_LIBRARY[CONFIG.model.name].name}`);
  }
  
  // 主函数
  function initLive2D() {
    // 检查是否支持
    if (!isSupportWebGL()) {
      console.warn('⚠️ 浏览器不支持 WebGL，无法显示看板娘');
      return;
    }
    
    // 加载 Live2D
    if (typeof L2Dwidget !== 'undefined') {
      setupLive2D();
    } else {
      loadLive2DLibrary();
    }
  }
  
  // 检查 WebGL 支持
  function isSupportWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }
  
  // 加载 Live2D 库
  function loadLive2DLibrary() {
    console.log('📚 加载 Live2D 库...');
    
    // 加载 L2Dwidget
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.x/lib/L2Dwidget.min.js';
    script.async = true;
    
    script.onload = function() {
      console.log('✅ Live2D 库加载完成');
      setupLive2D();
    };
    
    script.onerror = function() {
      console.error('❌ Live2D 库加载失败');
      showFallbackWidget();
    };
    
    document.head.appendChild(script);
  }
  
  // 设置 Live2D
  function setupLive2D() {
    console.log('🎨 初始化看板娘（右下角）...');
    
    // 初始化配置
    L2Dwidget.init({
      model: {
        jsonPath: CONFIG.model.jsonPath,
        scale: 1
      },
      display: {
        superSample: 2,                      // 超采样
        width: CONFIG.display.width,         // 宽度
        height: CONFIG.display.height,       // 高度
        position: CONFIG.display.position,   // 位置：右下角
        hOffset: CONFIG.display.hOffset,     // 水平偏移
        vOffset: CONFIG.display.vOffset,     // 垂直偏移
        opacity: CONFIG.display.opacity,     // 透明度
        mobile: {
          show: true,
          scale: CONFIG.display.mobileScale
        }
      },
      dialog: {
        enable: CONFIG.dialog.enable,
        hitokoto: CONFIG.dialog.useHitokoto,
        custom: CONFIG.dialog.messages,
        script: {
          'tap body': CONFIG.dialog.messages,
          'mouseover *': '你在看我吗？',
          'tap face': '讨厌，不要戳脸啦~'
        }
      },
      react: {
        opacityDefault: 0.9,
        opacityOnHover: 1.0
      },
      dev: {
        border: false
      }
    });
    
    // 添加自定义样式
    addCustomStyles();
    
    // 添加交互功能
    if (CONFIG.interaction.autoTalk) {
      setupAutoTalk();
    }
    
    console.log('✅ 右下角看板娘初始化完成！');
  }
  
  // 添加自定义样式
  function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 右下角看板娘样式 */
      #live2d-widget {
        right: 0 !important;
        bottom: 0 !important;
        z-index: 9998 !important;
        pointer-events: auto !important;
      }
      
      /* 对话框样式 */
      .live2d-widget-dialog {
        position: fixed !important;
        right: 200px !important;
        bottom: 300px !important;
        min-width: 200px !important;
        max-width: 300px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border-radius: 15px !important;
        padding: 12px 18px !important;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15) !important;
        border: 2px solid #64ffda !important;
        color: #333 !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        animation: dialog-popup 0.3s ease !important;
        z-index: 9999 !important;
      }
      
      .live2d-widget-dialog::before {
        content: '' !important;
        position: absolute !important;
        right: -10px !important;
        bottom: 20px !important;
        width: 0 !important;
        height: 0 !important;
        border-top: 10px solid transparent !important;
        border-bottom: 10px solid transparent !important;
        border-left: 10px solid #64ffda !important;
      }
      
      @keyframes dialog-popup {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      /* 工具提示 */
      .live2d-tooltip {
        position: fixed !important;
        right: 180px !important;
        bottom: 350px !important;
        background: rgba(100, 255, 218, 0.9) !important;
        color: white !important;
        padding: 6px 12px !important;
        border-radius: 8px !important;
        font-size: 12px !important;
        z-index: 10000 !important;
        animation: tooltip-fade 0.3s ease !important;
      }
      
      @keyframes tooltip-fade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* 移动端适配 */
      @media (max-width: 768px) {
        #live2d-widget {
          transform: scale(${CONFIG.display.mobileScale}) !important;
          transform-origin: right bottom !important;
        }
        
        .live2d-widget-dialog {
          right: 150px !important;
          bottom: 250px !important;
          max-width: 250px !important;
        }
      }
      
      @media (max-width: 480px) {
        #live2d-widget {
          transform: scale(0.6) !important;
        }
        
        .live2d-widget-dialog {
          right: 120px !important;
          bottom: 200px !important;
          max-width: 200px !important;
          font-size: 12px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // 设置自动对话
  function setupAutoTalk() {
    let talkTimer;
    
    function showRandomMessage() {
      if (!CONFIG.dialog.enable) return;
      
      const messages = CONFIG.dialog.messages;
      if (messages && messages.length > 0) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        showCustomDialog(randomMsg);
      }
    }
    
    // 延迟开始自动对话
    setTimeout(() => {
      showRandomMessage();
      talkTimer = setInterval(showRandomMessage, CONFIG.interaction.talkInterval);
    }, 10000);
    
    // 页面可见性变化时暂停/恢复
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        clearInterval(talkTimer);
      } else {
        talkTimer = setInterval(showRandomMessage, CONFIG.interaction.talkInterval);
      }
    });
  }
  
  // 显示自定义对话框
  function showCustomDialog(text) {
    // 移除旧的对话框
    const oldDialog = document.querySelector('.live2d-custom-dialog');
    if (oldDialog) oldDialog.remove();
    
    // 创建新对话框
    const dialog = document.createElement('div');
    dialog.className = 'live2d-custom-dialog live2d-widget-dialog';
    dialog.textContent = text;
    dialog.style.cssText = `
      position: fixed;
      right: 200px;
      bottom: 300px;
      z-index: 10000;
    `;
    
    document.body.appendChild(dialog);
    
    // 自动消失
    setTimeout(() => {
      if (dialog.parentNode) {
        dialog.style.opacity = '0';
        dialog.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          if (dialog.parentNode) dialog.remove();
        }, 500);
      }
    }, CONFIG.dialog.showTime);
  }
  
  // 备用方案：显示静态图片
  function showFallbackWidget() {
    console.log('🖼️ 使用备用静态看板娘');
    
    const container = document.createElement('div');
    container.id = 'fallback-live2d';
    container.style.cssText = `
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 150px;
      height: 300px;
      z-index: 9998;
      pointer-events: none;
    `;
    
    const img = document.