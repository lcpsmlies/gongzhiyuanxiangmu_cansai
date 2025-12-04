// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPage();
    
    // 设置导航栏交互
    setupNavigation();
    
    // 设置地图交互
    setupMapInteractions();
    
    // 初始化生态数据
    initEcoData();
    
    // 初始化图表
    initChart();
    
    // 设置游戏交互
    setupGameInteractions();
});

// 初始化页面
function initPage() {
    // 设置首页图片
    const heroImg = document.getElementById('hero-img');

    // 尝试加载首页图片
    loadImageWithFallback(
        heroImg,
        'images/home-bg.jpg',
        '定西市梯田风光',
        'fas fa-mountain',
        '定西市 - 黄土高原上的绿色明珠'
    );

    // 设置探索按钮点击事件
    document.getElementById('explore-btn').addEventListener('click', function() {
        document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
    });
}

// 图片加载函数（带备用方案）
function loadImageWithFallback(container, imagePath, altText, fallbackIcon, fallbackText) {
    // 创建图片元素
    const img = new Image();

    // 图片加载成功
    img.onload = function() {
        container.innerHTML = '';
        container.appendChild(img);
        img.alt = altText;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
    };

    // 图片加载失败
    img.onerror = function() {
        container.innerHTML = `
            <div class="image-fallback">
                <i class="${fallbackIcon}"></i>
                <div>${fallbackText}</div>
                <div style="font-size:0.8rem;margin-top:0.5rem;">图片加载中...</div>
            </div>
        `;

        // 尝试加载备用图片
        const fallbackImg = new Image();
        fallbackImg.src = 'images/placeholder.jpg';
        fallbackImg.onload = function() {
            container.innerHTML = '';
            container.appendChild(fallbackImg);
            fallbackImg.alt = altText;
            fallbackImg.style.width = '100%';
            fallbackImg.style.height = '100%';
            fallbackImg.style.objectFit = 'cover';
        };

        fallbackImg.onerror = function() {
            // 如果备用图片也加载失败，保持备用方案
        };
    };

    // 设置图片源
    img.src = imagePath;
}

// 设置导航栏交互
function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // 移动端菜单切换
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // 导航链接点击事件
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 移除所有active类
            document.querySelectorAll('.nav-links a').forEach(item => {
                item.classList.remove('active');
            });

            // 为当前点击的链接添加active类
            this.classList.add('active');

            // 如果是移动端，点击后关闭菜单
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }

            // 滚动到对应部分
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 设置地图交互
function setupMapInteractions() {
    // 地点数据 - 定西市真实地点
    const locations = {
        weishui: {
            title: "渭河定西段",
            icon: "fas fa-tint",
            description: "渭河是黄河的最大支流，流经定西市安定区、陇西县等地。定西段渭河全长约80公里，是陇中地区重要的水资源。近年来通过综合治理，渭河水质和生态环境得到显著改善。",
            imagePath: "images/weishui.jpg",
            fallbackIcon: "fas fa-tint",
            fallbackText: "渭河定西段",
            stats: [
                { label: "河流长度", value: "80公里" },
                { label: "年均流量", value: "25m³/s" },
                { label: "主要功能", value: "灌溉供水" },
                { label: "治理项目", value: "渭河源保护" }
            ],
            coordinates: "北纬35.5°, 东经104.6°",
            weather: "今日: 晴, 12-22°C"
        },
        huajia: {
            title: "华家岭",
            icon: "fas fa-mountain",
            description: "华家岭位于定西市通渭县，海拔2457米，是陇中黄土高原的最高点。岭上建有华家岭林场，是定西市重要的生态屏障和水源涵养地，也是夏季避暑胜地。",
            imagePath: "images/huajia.jpg",
            fallbackIcon: "fas fa-mountain",
            fallbackText: "华家岭",
            stats: [
                { label: "最高海拔", value: "2457米" },
                { label: "森林面积", value: "1.2万公顷" },
                { label: "年均气温", value: "5.8°C" },
                { label: "年降水量", value: "550mm" }
            ],
            coordinates: "北纬35.2°, 东经105.1°",
            weather: "今日: 多云, 8-18°C"
        },
        anding: {
            title: "安定区中心",
            icon: "fas fa-city",
            description: "安定区是定西市政府所在地，政治、经济、文化中心。城区面积约25平方公里，人口约40万。近年来城市面貌焕然一新，基础设施不断完善，被评为省级园林城市。",
            imagePath: "images/anding.jpg",
            fallbackIcon: "fas fa-city",
            fallbackText: "安定区中心",
            stats: [
                { label: "城区面积", value: "25km²" },
                { label: "常住人口", value: "40万人" },
                { label: "建区时间", value: "2003年" },
                { label: "绿地率", value: "36.5%" }
            ],
            coordinates: "北纬35.6°, 东经104.6°",
            weather: "今日: 晴, 14-24°C"
        },
        potato: {
            title: "马铃薯产业园",
            icon: "fas fa-seedling",
            description: "定西市是中国最大的马铃薯生产和加工基地，被誉为'中国马铃薯之乡'。马铃薯种植面积常年稳定在300万亩左右，年产鲜薯500万吨，产业链完整，产品远销国内外。",
            imagePath: "images/potato.jpg",
            fallbackIcon: "fas fa-seedling",
            fallbackText: "马铃薯产业园",
            stats: [
                { label: "种植面积", value: "300万亩" },
                { label: "年产量", value: "500万吨" },
                { label: "深加工率", value: "35%" },
                { label: "从业人数", value: "80万人" }
            ],
            coordinates: "北纬35.4°, 东经104.8°",
            weather: "今日: 晴, 13-23°C"
        },
        yuhu: {
            title: "玉湖公园",
            icon: "fas fa-park",
            description: "玉湖公园位于定西市区，占地面积45公顷，其中水域面积15公顷。公园以'玉湖'为中心，建设了环湖步道、观景亭台、儿童乐园等设施，是市民休闲娱乐的主要场所。",
            imagePath: "images/yuhu.jpg",
            fallbackIcon: "fas fa-park",
            fallbackText: "玉湖公园",
            stats: [
                { label: "公园面积", value: "45公顷" },
                { label: "水域面积", value: "15公顷" },
                { label: "建成时间", value: "2010年" },
                { label: "年接待量", value: "50万人次" }
            ],
            coordinates: "北纬35.6°, 东经104.6°",
            weather: "今日: 晴, 14-24°C"
        }
    };

    // 为每个标记点添加点击事件
    document.querySelectorAll('.marker').forEach(marker => {
        marker.addEventListener('click', function() {
            const locationId = this.getAttribute('data-location');
            const location = locations[locationId];

            if (location) {
                updateLocationInfo(location);

                // 添加点击动画
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transform = 'scale(1.2)';
                }, 300);
            }
        });
    });

    // 初始显示第一个地点信息
    updateLocationInfo(locations.weishui);
}

// 更新地点信息面板
function updateLocationInfo(location) {
    // 更新标题
    document.getElementById('location-title').textContent = location.title;

    // 更新图标
    const iconElement = document.getElementById('location-icon');
    iconElement.innerHTML = `<i class="${location.icon}"></i>`;

    // 更新图片
    const imageContainer = document.getElementById('location-image-container');
    loadImageWithFallback(
        imageContainer,
        location.imagePath,
        location.title,
        location.fallbackIcon,
        location.fallbackText
    );

    // 更新描述
    document.getElementById('location-description').textContent = location.description;

    // 更新统计数据
    const statsElement = document.getElementById('location-stats');
    statsElement.innerHTML = location.stats.map(stat => `
        <div class="stat-item">
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');

    // 更新坐标和天气
    document.getElementById('coordinates').textContent = `坐标: ${location.coordinates}`;
    document.getElementById('weather').textContent = `天气: ${location.weather}`;
}

// 初始化生态数据
function initEcoData() {
    // 设置进度条动画
    const progressBars = {
        'water-progress': { width: '68.5%', color: '#2196f3' },
        'air-progress': { width: '91.3%', color: '#00bcd4' },
        'potato-progress': { width: '85%', color: '#81c784' },
        'sunshine-progress': { width: '75%', color: '#ff9800' }
    };

    // 延迟设置进度条宽度，以便看到动画效果
    setTimeout(() => {
        for (const [id, config] of Object.entries(progressBars)) {
            const bar = document.getElementById(id);
            bar.style.width = config.width;
            bar.style.backgroundColor = config.color;
        }
    }, 500);
}

// 初始化图表
function initChart() {
    const ctx = document.getElementById('greening-chart').getContext('2d');

    // 图表数据 - 定西市森林覆盖率增长数据
    const data = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [{
            label: '森林覆盖率（%）',
            data: [12.5, 13.8, 15.2, 16.7, 18.3],
            backgroundColor: 'rgba(141, 110, 99, 0.2)',
            borderColor: 'rgba(141, 110, 99, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(141, 110, 99, 1)',
            pointRadius: 5,
            fill: true,
            tension: 0.4
        }]
    };

    // 图表配置
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 10,
                    max: 20,
                    title: {
                        display: true,
                        text: '森林覆盖率 (%)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    };

    // 创建图表
    new Chart(ctx, config);
}

// 设置游戏交互
function setupGameInteractions() {
    let treeCount = 0;
    const goal = 50000;
    const forestArea = document.getElementById('forest-area');
    const treeCountElement = document.getElementById('tree-count');
    const progressPercentElement = document.getElementById('progress-percent');
    const treeProgressBar = document.getElementById('tree-progress');
    const plantButton = document.getElementById('plant-tree-btn');
    const resetButton = document.getElementById('reset-btn');

    // 从本地存储加载已植树数量
    const savedTreeCount = localStorage.getItem('dingxi-tree-count');
    if (savedTreeCount) {
        treeCount = parseInt(savedTreeCount);
        updateTreeDisplay();
    }

    // 植树按钮点击事件
    plantButton.addEventListener('click', function() {
        // 增加树的数量
        treeCount++;

        // 保存到本地存储
        localStorage.setItem('dingxi-tree-count', treeCount.toString());

        // 更新显示
        updateTreeDisplay();

        // 添加树到森林区域
        addTreeToForest();

        // 添加按钮动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);

        // 如果达到目标，显示祝贺信息
        if (treeCount === goal) {
            setTimeout(() => {
                alert(`恭喜！您已成功为定西市黄土高原种下${goal.toLocaleString()}棵树！\n感谢您对定西市生态建设的贡献！`);
            }, 500);
        }

        // 每100棵树显示鼓励信息
        if (treeCount > 0 && treeCount % 100 === 0) {
            showEncouragementMessage(treeCount);
        }
    });

    // 显示鼓励信息
    function showEncouragementMessage(count) {
        const messages = [
            `太棒了！您已种下${count.toLocaleString()}棵树！`,
            `定西市的绿化事业感谢您的贡献！`,
            `每棵树都是黄土高原上的一点绿色希望！`,
            `继续努力，让定西变得更绿更美！`,
            `您正在为定西市的生态建设贡献力量！`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // 创建临时提示
        const tip = document.createElement('div');
        tip.textContent = randomMessage;
        tip.style.position = 'fixed';
        tip.style.bottom = '20px';
        tip.style.right = '20px';
        tip.style.backgroundColor = '#8d6e63';
        tip.style.color = 'white';
        tip.style.padding = '10px 15px';
        tip.style.borderRadius = '5px';
        tip.style.zIndex = '1000';
        tip.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        tip.style.animation = 'fadeInOut 3s ease-in-out';

        document.body.appendChild(tip);

        // 3秒后移除提示
        setTimeout(() => {
            tip.remove();
        }, 3000);
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);

    // 重置按钮点击事件
    resetButton.addEventListener('click', function() {
        if (confirm("确定要重置植树计数吗？这将清除所有已种植的树。")) {
            treeCount = 0;
            localStorage.setItem('dingxi-tree-count', '0');
            updateTreeDisplay();
            clearForest();
        }
    });

    // 更新植树显示
    function updateTreeDisplay() {
        // 更新计数
        treeCountElement.textContent = treeCount.toLocaleString();

        // 计算进度百分比
        const percent = Math.min(100, (treeCount / goal) * 100);
        progressPercentElement.textContent = `${percent.toFixed(1)}%`;

        // 更新进度条
        treeProgressBar.style.width = `${percent}%`;

        // 根据进度改变颜色
        if (percent < 30) {
            treeProgressBar.style.backgroundColor = '#ff5722';
        } else if (percent < 70) {
            treeProgressBar.style.backgroundColor = '#ff9800';
        } else {
            treeProgressBar.style.backgroundColor = '#689f38';
        }
    }

    // 添加树到森林区域
    function addTreeToForest() {
        // 创建树元素
        const treeElement = document.createElement('div');
        treeElement.className = 'tree';

        // 随机树的大小变化
        const size = 0.7 + Math.random() * 0.6;
        treeElement.style.transform = `scale(${size})`;

        // 随机树的颜色变化（黄土高原植被颜色）
        const hue = 100 + Math.random() * 30; // 绿色系变化
        const saturation = 40 + Math.random() * 30; // 饱和度较低
        const color = `hsl(${hue}, ${saturation}%, 35%)`;

        treeElement.innerHTML = `
            <div class="tree-crown" style="background-color:${color};"></div>
            <div class="tree-trunk"></div>
        `;

        // 随机位置
        treeElement.style.position = 'relative';
        treeElement.style.left = `${Math.random() * 10 - 5}px`;

        // 添加到森林区域
        forestArea.appendChild(treeElement);

        // 如果森林区域有占位符，移除它
        const placeholder = forestArea.querySelector('.tree-placeholder');
        if (placeholder && treeCount > 0) {
            placeholder.style.display = 'none';
        }

        // 限制显示的树的数量
        const trees = forestArea.querySelectorAll('.tree');
        if (trees.length > 150) {
            trees[0].remove();
        }
    }

    // 清空森林区域
    function clearForest() {
        forestArea.innerHTML = `
            <div class="tree-placeholder">
                <i class="fas fa-tree"></i>
                <p>这里将显示您种下的树</p>
            </div>
        `;
    }

    // 初始加载时显示已种植的树
    function loadExistingTrees() {
        if (treeCount > 0) {
            // 移除占位符
            const placeholder = forestArea.querySelector('.tree-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // 添加树（但不超过150棵）
            const treesToAdd = Math.min(Math.floor(treeCount / 100), 150);
            for (let i = 0; i < treesToAdd; i++) {
                addTreeToForest();
            }
        }
    }
    
    // 页面加载时显示已存在的树
    loadExistingTrees();
}

// 页面滚动时更新导航栏活动状态
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});