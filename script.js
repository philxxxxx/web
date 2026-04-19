class Cursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.cursorOutline = document.getElementById('cursor-outline');
        this.pos = { x: 0, y: 0 };
        this.posOutline = { x: 0, y: 0 };
        this.hover = false;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
        });

        setInterval(() => {
            this.posOutline.x += (this.pos.x - this.posOutline.x) * 0.25;
            this.posOutline.y += (this.pos.y - this.posOutline.y) * 0.25;
        }, 16);

        this.animate();

        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card, .social-link, .tag, .contact-method');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.setHover(true));
            el.addEventListener('mouseleave', () => this.setHover(false));
        });
    }

    setHover(hover) {
        this.hover = hover;
        this.cursor.classList.toggle('hover', hover);
        this.cursorOutline.classList.toggle('hover', hover);
    }

    animate() {
        this.cursor.style.left = this.pos.x + 'px';
        this.cursor.style.top = this.pos.y + 'px';
        this.cursorOutline.style.left = this.posOutline.x + 'px';
        this.cursorOutline.style.top = this.posOutline.y + 'px';
        requestAnimationFrame(() => this.animate());
    }
}

class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });

        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.menuToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll('.section-header, .about-card, .skill-card, .project-card, .contact-info, .contact-form, .hero-project-card, .hero-content');
        animateElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });

        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    entry.target.style.width = progress + '%';
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }
}

class CounterAnimation {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            // 移除鼠标悬停动效
        });
    }
}

// 项目滚动功能
function initProjectScroll() {
    const scrollContainer = document.querySelector('.projects-scroll');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    if (scrollLeftBtn && scrollRightBtn && scrollContainer) {
        // 计算滚动距离：卡片宽度(300px) + 间距(24px)
        const cardWidth = 300;
        const gap = 24;
        const scrollDistance = cardWidth + gap;
        
        scrollLeftBtn.onclick = function() {
            // 使用平滑滚动
            scrollContainer.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        };
        
        scrollRightBtn.onclick = function() {
            // 使用平滑滚动
            scrollContainer.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        };
    }
}

// 确保在页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectScroll);
} else {
    initProjectScroll();
}

class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>发送中...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        const name = this.form.querySelector('#name').value;
        const email = this.form.querySelector('#email').value;
        const message = this.form.querySelector('#message').value;

        // 飞书机器人Webhook地址
        const webhookUrl = 'https://open.feishu.cn/open-apis/bot/v2/hook/ed631cbf-5ed3-413a-a533-6c83ce22fb8a';
        // 加签密钥（从飞书机器人设置中复制）
        const secret = 'UhOPlMyeOvx8dfJmCiGozf'; // 请替换为实际的密钥

        // 构建飞书消息格式
        const feishuMessage = {
            msg_type: 'text',
            content: {
                text: `网站新留言\n姓名: ${name}\n邮箱: ${email}\n留言: ${message}`
            }
        };

        // 生成时间戳和签名
        const timestamp = Math.floor(Date.now() / 1000); // 使用秒级时间戳
        console.log('生成的时间戳:', timestamp);
        console.log('当前时间:', new Date());
        
        // 生成签名
        this.generateSign(timestamp, secret)
            .then(sign => {
                // 构建完整的请求URL
                const requestUrl = `${webhookUrl}?timestamp=${timestamp}&sign=${sign}`;
                
                console.log('开始发送消息到飞书...');
                console.log('请求URL:', requestUrl);
                console.log('消息内容:', feishuMessage);
                
                // 发送到飞书
                return fetch(requestUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(feishuMessage)
                });
            })
            .then(response => {
                console.log('飞书响应状态:', response.status);
                console.log('飞书响应:', response);
                return response.json(); // 关键：解析 JSON
            })
            .then(data => {
                console.log('飞书返回:', data);
                alert(`感谢您的留言，${name}！我会尽快回复您。`);
            })
            .catch(error => {
                console.error('请求失败:', error);
                alert(`感谢您的留言，${name}！我会尽快回复您。`);
            })
            .finally(() => {
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                const inputs = this.form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
            });
    }

    // 生成签名（飞书官方算法 - 详细日志版）
    generateSign(timestamp, secret) {
        return new Promise((resolve, reject) => {
            try {
                // 飞书的签名算法要求：timestamp + "\n" + secret
                const data = timestamp + "\n" + secret;
                console.log('签名数据:', data);
                console.log('密钥:', secret);
                
                if (window.crypto && window.crypto.subtle) {
                    console.log('使用Web Crypto API生成签名');
                    const encoder = new TextEncoder();
                    const dataBuffer = encoder.encode(data);
                    
                    window.crypto.subtle.digest('SHA-256', dataBuffer)
                        .then(buffer => {
                            // 转换为十六进制字符串
                            const hashArray = Array.from(new Uint8Array(buffer));
                            const sign = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                            console.log('生成的签名:', sign);
                            console.log('签名长度:', sign.length);
                            resolve(sign);
                        })
                        .catch(error => {
                            console.error('签名生成失败:', error);
                            reject(error);
                        });
                } else {
                    console.log('使用降级方案生成签名');
                    // 降级方案：使用简单的哈希
                    let hash = 0;
                    for (let i = 0; i < data.length; i++) {
                        const char = data.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    const sign = Math.abs(hash).toString(16);
                    console.log('降级生成的签名:', sign);
                    resolve(sign);
                }
            } catch (error) {
                console.error('签名生成异常:', error);
                reject(error);
            }
        });
    }
}

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

class PageLoader {
    constructor() {
        this.element = document.getElementById('page-transition');
        this.init();
    }

    init() {
        if (this.element) {
            this.element.style.opacity = '1';
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.element.style.opacity = '0';
                    this.element.style.transform = 'scale(1.1)';
                }, 100);
                
                setTimeout(() => {
                    this.element.style.display = 'none';
                }, 900);
            });
        }
    }
}

class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scroll-progress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            if (this.progressBar) {
                this.progressBar.style.width = progress + '%';
            }
        });
    }
}

class Parallax {
    constructor() {
        this.heroGradient = document.querySelector('.hero-bg-gradient');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (this.heroGradient && scrolled < window.innerHeight) {
                this.heroGradient.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }
}

class MagneticEffect {
    constructor() {
        this.init();
    }

    init() {
        const magneticElements = document.querySelectorAll('.btn');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
}

class Particles {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.maxParticles = 50;
        this.init();
    }

    init() {
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机延迟
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        // 随机持续时间
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        // 随机颜色
        const opacity = Math.random() * 0.6 + 0.2;
        particle.style.background = `rgba(102, 126, 234, ${opacity})`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // 粒子动画结束后重新创建
        particle.addEventListener('animationend', () => {
            this.container.removeChild(particle);
            this.particles = this.particles.filter(p => p !== particle);
            this.createParticle();
        });
    }

    animateParticles() {
        // 粒子动画由CSS处理
    }
}

class ImageLazyLoad {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.onload = () => {
                            image.classList.add('loaded');
                        };
                        image.classList.remove('lazy');
                        imageObserver.unobserve(image);
                    }
                });
            });

            this.images.forEach(image => {
                imageObserver.observe(image);
            });
        } else {
            // 回退方案
            this.images.forEach(image => {
                image.src = image.dataset.src;
                image.classList.add('loaded');
                image.classList.remove('lazy');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Cursor();
    new Navbar();
    new ScrollAnimations();
    new CounterAnimation();
    new ProjectCards();
    new FormHandler();
    new SmoothScroll();
    new ScrollProgress();
    new PageLoader();
    new Parallax();
    new MagneticEffect();
    new Particles();
    new ImageLazyLoad();

    const style = document.createElement('style');
    style.textContent = `
        .section-header,
        .about-card,
        .skill-card,
        .project-card,
        .contact-info,
        .contact-form,
        .hero-project-card,
        .hero-content {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section-header.revealed,
        .about-card.revealed,
        .skill-card.revealed,
        .project-card.revealed,
        .contact-info.revealed,
        .contact-form.revealed,
        .hero-project-card.revealed,
        .hero-content.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-card.revealed .skill-progress {
            width: var(--progress, 90%);
        }
        
        .particle {
            will-change: transform, opacity;
        }
    `;
    document.head.appendChild(style);
});

// 项目详情模态框功能
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.modalContent = document.getElementById('modal-project-content');
        this.closeButton = document.getElementById('close-modal');
        this.projectLinks = document.querySelectorAll('.project-link');
        this.projectCards = document.querySelectorAll('.project-card, .hero-project-card');
        this.projectData = this.getProjectData();
        this.init();
    }

    getProjectData() {
        return {
            1: {
                id: 1,
                title: '数据分析平台',
                category: 'Web应用',
                description: '现代化数据分析平台，实时处理和可视化大规模数据。该平台采用React和D3.js构建，提供直观的数据可视化界面，支持多种数据源接入和实时数据分析。系统具有强大的数据处理能力，能够处理TB级别的数据，并提供实时监控和预警功能。',
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20SaaS%20dashboard%20interface%20dark%20theme%20with%20neon%20accents&image_size=landscape_16_9',
                tags: ['React', 'D3.js', 'Node.js', 'MongoDB', 'Express'],
                details: {
                    '技术栈': 'React, D3.js, Node.js, MongoDB',
                    '项目时间': '2023年6月 - 2023年12月',
                    '项目规模': '中型',
                    '主要功能': '数据可视化、实时监控、预警系统'
                }
            },
            2: {
                id: 2,
                title: '健康管理App',
                category: '移动应用',
                description: '简洁高效的健康数据追踪应用，帮助用户记录和分析日常健康数据。该应用使用React Native开发，支持iOS和Android平台，集成了多种健康数据追踪功能，包括步数统计、睡眠监测、饮食记录等。应用还提供个性化的健康建议和目标设置功能。',
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20app%20interface%20with%20gradient%20design%20ios%20style&image_size=landscape_4_3',
                tags: ['React Native', 'Firebase', 'Redux', 'Expo'],
                details: {
                    '技术栈': 'React Native, Firebase, Redux',
                    '项目时间': '2023年3月 - 2023年8月',
                    '项目规模': '小型',
                    '主要功能': '健康数据追踪、睡眠监测、饮食记录'
                }
            },
            3: {
                id: 3,
                title: '时尚电商平台',
                category: '电商网站',
                description: '高端时尚品牌的在线购物体验，提供优雅的用户界面和流畅的购物流程。该平台使用Next.js构建，集成了Stripe支付系统和GraphQL API，支持多种支付方式和国际配送。网站采用响应式设计，确保在各种设备上都能提供良好的购物体验。',
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=e-commerce%20website%20design%20minimalist%20fashion%20store&image_size=landscape_4_3',
                tags: ['Next.js', 'Stripe', 'GraphQL', 'Tailwind CSS'],
                details: {
                    '技术栈': 'Next.js, Stripe, GraphQL',
                    '项目时间': '2023年9月 - 2024年2月',
                    '项目规模': '大型',
                    '主要功能': '在线购物、支付系统、国际配送'
                }
            },
            4: {
                id: 4,
                title: '智能客服系统',
                category: 'AI应用',
                description: '基于大语言模型的智能对话系统，为企业提供24/7的客户服务支持。该系统使用Python和OpenAI API构建，能够理解和回答客户的各种问题，提供个性化的服务体验。系统还支持多语言翻译和情感分析功能，确保与客户的有效沟通。',
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20interface%20modern%20dark%20design%20futuristic&image_size=landscape_4_3',
                tags: ['Python', 'OpenAI', 'FastAPI', 'NLP'],
                details: {
                    '技术栈': 'Python, OpenAI, FastAPI',
                    '项目时间': '2023年11月 - 2024年3月',
                    '项目规模': '中型',
                    '主要功能': '智能对话、多语言支持、情感分析'
                }
            },
            5: {
                id: 5,
                title: '个人作品集网站',
                category: '作品集',
                description: '现代化个人作品集网站，展示项目和技能。该网站使用纯HTML、CSS和JavaScript构建，采用响应式设计，确保在各种设备上都能提供良好的浏览体验。网站集成了多种交互效果和动画，包括滚动动画、悬停效果和粒子背景。',
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20portfolio%20website%20design%20dark%20theme&image_size=landscape_4_3',
                tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
                details: {
                    '技术栈': 'HTML, CSS, JavaScript',
                    '项目时间': '2024年1月 - 2024年2月',
                    '项目规模': '小型',
                    '主要功能': '项目展示、技能展示、联系表单'
                }
            }
        };
    }

    init() {
        // 为项目链接添加点击事件
        this.projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const projectCard = link.closest('.project-card');
                if (projectCard) {
                    const projectId = projectCard.dataset.projectId;
                    this.openModal(projectId);
                }
            });
        });

        // 为项目卡片添加点击事件
        this.projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // 避免点击链接时重复触发
                if (!e.target.closest('.project-link')) {
                    const projectId = card.dataset.projectId;
                    if (projectId) {
                        this.openModal(projectId);
                    }
                }
            });
        });

        // 为关闭按钮添加点击事件
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // 点击模态框外部关闭
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // 按ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const project = this.projectData[projectId];
        if (!project) return;

        // 填充模态框内容
        this.modalContent.innerHTML = `
            <div class="modal-project-header">
                <span class="modal-project-category">${project.category}</span>
                <h2 class="modal-project-title">${project.title}</h2>
            </div>
            <div class="modal-project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="modal-project-description">
                ${project.description}
            </div>
            <div class="modal-project-details">
                <h4>项目详情</h4>
                <ul>
                    ${Object.entries(project.details).map(([key, value]) => `
                        <li>
                            <span>${key}</span>
                            <span>${value}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="modal-project-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <div class="modal-project-cta">
                <button class="btn btn-primary" onclick="window.open('https://github.com', '_blank')">
                    <span>查看代码</span>
                    <i class="fab fa-github"></i>
                </button>
                <button class="btn btn-secondary" onclick="window.open('https://example.com', '_blank')">
                    <span>访问项目</span>
                    <i class="fas fa-external-link-alt"></i>
                </button>
            </div>
        `;

        // 显示模态框
        if (this.modal) {
            this.modal.classList.add('active');
            this.modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // 恢复背景滚动
        }
    }
}

// 添加到DOMContentLoaded
const originalDOMContentLoaded = document.addEventListener;
document.addEventListener = function(event, listener) {
    if (event === 'DOMContentLoaded') {
        const originalListener = listener;
        listener = function() {
            originalListener();
            new ProjectModal();
        };
    }
    return originalDOMContentLoaded.call(this, event, listener);
};