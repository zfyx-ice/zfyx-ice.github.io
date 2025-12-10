// source/js/typewriter-particlex.js
console.log('🚀 ParticleX 打字机增强版');

// ========== 在这里修改文字 ==========
const TEXTS = [
  "欢迎来到我的博客",
  "分享编程与生活",
  "探索技术前沿",
  "感谢你的访问"
];
// ========== 修改结束 ==========

// ParticleX 专用等待函数
function waitForParticleX() {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 100; // 最多等待10秒
    
    function check() {
      attempts++;
      
      // 检查 ParticleX 特有的元素
      const indicators = [
        // 粒子画布
        document.querySelector('#particles-js canvas'),
        document.querySelector('canvas[data-engine]'),
        document.querySelector('.particles-js-canvas-el'),
        // ParticleX 标题
        document.querySelector('.particlex-title'),
        document.querySelector('.pt-title'),
        document.querySelector('.hero-text'),
        // 或者任何 h1
        document.querySelector('h1')
      ];
      
      const found = indicators.find(el => el !== null);
      
      if (found || attempts >= maxAttempts) {
        console.log(found ? `✅ 找到元素: ${found.className || found.tagName}` : '⚠️ 超时，强制执行');
        setTimeout(resolve, 500); // 额外等待500ms确保完全加载
      } else {
        setTimeout(check, 100);
      }
    }
    
    check();
  });
}

// 增强版标题查找
function findParticleXTitle() {
  // ParticleX 可能的标题选择器（按优先级）
  const selectors = [
    '.particlex-title',           // ParticleX 专用
    '.pt-title',                  // 可能的选择器
    '.hero-text h1',              // hero 区域
    '.hero-content h1',
    '.banner-title',
    '.main-title',
    '.title h1',
    'h1.particle-title',
    'h1.animated',               // 有动画的 h1
    'h1.fadeIn',                 // 淡入效果的 h1
    'h1:not([style*="display:none"])', // 可见的 h1
    'h1'                         // 最后的备选
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent && element.offsetParent !== null) {
      console.log(`✅ 使用选择器: ${selector}`);
      return element;
    }
  }
  
  return null;
}

// 强制提升标题层级
function enhanceTitleVisibility(title) {
  if (!title) return;
  
  // 提升 z-index，确保在粒子之上
  title.style.cssText = `
    position: relative !important;
    z-index: 9999 !important;
    opacity: 1 !important;
    visibility: visible !important;
  `;
  
  // 确保标题容器也提升
  let parent = title.parentElement;
  for (let i = 0; i < 3 && parent; i++) {
    if (parent.style) {
      parent.style.position = 'relative';
      parent.style.zIndex = '9998';
    }
    parent = parent.parentElement;
  }
  
  console.log('✅ 标题层级已提升');
}

// 主函数
async function initParticleXTypewriter() {
  console.log('⏳ 等待 ParticleX 加载...');
  
  try {
    // 等待粒子系统
    await waitForParticleX();
    
    console.log('🔍 查找标题...');
    
    // 查找标题
    let title = findParticleXTitle();
    
    if (!title) {
      console.warn('⚠️ 未找到标题，延迟重试...');
      // 延迟重试
      await new Promise(resolve => setTimeout(resolve, 2000));
      title = findParticleXTitle();
    }
    
    if (!title) {
      console.error('❌ 无法找到标题元素');
      return;
    }
    
    console.log('✅ 找到标题:', title.textContent);
    
    // 提升标题层级
    enhanceTitleVisibility(title);
    
    // 保存原始文本
    const originalText = title.textContent.trim();
    const displayTexts = TEXTS.length > 0 ? TEXTS : [originalText];
    
    // 创建打字机结构
    title.innerHTML = `
      <span class="particlex-typed" style="
        display: inline-block;
        min-width: 10px;
        min-height: 1.2em;
      "></span>
      <span class="particlex-cursor" style="
        display: inline-block;
        width: 3px;
        height: 1.2em;
        background: linear-gradient(to bottom, #64ffda, #00ffaa);
        margin-left: 3px;
        border-radius: 1px;
        box-shadow: 0 0 10px #64ffda, 0 0 20px rgba(100, 255, 218, 0.5);
        animation: particlex-blink 0.8s infinite;
        vertical-align: middle;
        position: relative;
        top: -1px;
      "></span>
    `;
    
    // 添加样式
    const styleId = 'particlex-typewriter-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes particlex-blink {
          0%, 50% { 
            opacity: 1; 
            transform: scaleY(1);
            box-shadow: 0 0 10px #64ffda, 0 0 20px rgba(100, 255, 218, 0.5);
          }
          51%, 100% { 
            opacity: 0.3; 
            transform: scaleY(0.7);
            box-shadow: 0 0 5px #64ffda, 0 0 10px rgba(100, 255, 218, 0.2);
          }
        }
        
        .particlex-typed {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                       0 0 20px rgba(100, 255, 218, 0.6);
          background: linear-gradient(45deg, #fff, #64ffda);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 打字逻辑
    const textEl = title.querySelector('.particlex-typed');
    const cursorEl = title.querySelector('.particlex-cursor');
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
      if (isPaused) return;
      
      const text = displayTexts[textIndex];
      
      // 更新文本
      if (isDeleting) {
        textEl.textContent = text.substring(0, charIndex - 1);
        charIndex--;
        
        // 删除时加速光标
        cursorEl.style.animationDuration = '0.5s';
      } else {
        textEl.textContent = text.substring(0, charIndex + 1);
        charIndex++;
        
        // 打字时正常速度
        cursorEl.style.animationDuration = '0.8s';
      }
      
      // 控制速度
      let speed = isDeleting ? 50 : 100;
      
      // 状态切换
      if (!isDeleting && charIndex === text.length) {
        // 打字完成
        speed = 2000; // 显示2秒
        isDeleting = true;
        cursorEl.style.animationDuration = '1.2s';
      } else if (isDeleting && charIndex === 0) {
        // 删除完成
        isDeleting = false;
        textIndex = (textIndex + 1) % displayTexts.length;
        speed = 1000; // 切换前的暂停
        
        // 切换文本时的特效
        cursorEl.style.animation = 'none';
        setTimeout(() => {
          cursorEl.style.animation = 'particlex-blink 0.8s infinite';
        }, 100);
      }
      
      setTimeout(type, speed);
    }
    
    // 启动打字机
    setTimeout(type, 1500);
    console.log('🎉 ParticleX 打字机已启动');
    
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

// 启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticleXTypewriter);
} else {
  initParticleXTypewriter();
}

// 防止粒子系统覆盖我们的修改
document.addEventListener('DOMNodeInserted', function(e) {
  if (e.target.tagName === 'CANVAS' || 
      e.target.classList?.contains('particles') ||
      e.target.id?.includes('particle')) {
    console.log('🔄 检测到粒子元素插入，重新检查标题');
    setTimeout(() => {
      const title = findParticleXTitle();
      if (title && !title.querySelector('.particlex-typed')) {
        console.log('🔄 标题被覆盖，重新初始化');
        initParticleXTypewriter();
      }
    }, 1000);
  }
});