// 获取DOM元素
const intervalInput = document.getElementById('interval');
const restInput = document.getElementById('rest');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const statusDisplay = document.getElementById('status');
const restModal = document.getElementById('rest-modal');
const closeBtn = document.querySelector('.close-btn');
const continueBtn = document.getElementById('continue-btn');
const restTipText = document.getElementById('rest-tip-text');
const getAdviceBtn = document.getElementById('get-advice-btn');
const adviceContent = document.querySelector('.advice-content');
const loading = document.getElementById('loading');
const bambooDecoration = document.querySelector('.bamboo-decoration');

// 计时器变量
let timerInterval;
let totalSeconds;
let isPaused = false;
let isWorking = true;

// 护眼建议列表
const eyeTips = [
    "请远眺20秒，看20英尺（约6米）外的物体。",
    "闭上眼睛，轻轻按摩眼眶周围的穴位。",
    "转动眼球，顺时针和逆时针各10圈。",
    "用热毛巾敷眼睛，缓解眼疲劳。",
    "起身走动，看看窗外的绿色植物。",
    "眨眼20次，保持眼睛湿润。",
    "调整屏幕亮度，使其与环境光线相匹配。",
    "保持正确坐姿，屏幕与眼睛保持一臂距离。",
    "多喝温水，保持身体水分充足。",
    "做眼保健操，缓解眼部肌肉紧张。"
];

// 豆包建议数据
const doubaoAdvices = [
    "长时间用眼后，可以尝试'20-20-20法则'：每20分钟，远眺20秒，看20英尺(约6米)外的物体。这是美国眼科学会推荐的护眼方法。",
    "眼周穴位按摩有助于缓解视疲劳。可以用食指指腹轻轻按摩睛明穴(内眼角)、攒竹穴(眉头)、鱼腰穴(眉中)、丝竹空穴(眉尾)，每个穴位按摩10-15秒。",
    "保持室内适宜的湿度(40%-60%)，可以减少眼睛干涩。使用空调或暖气时，建议配合加湿器使用。",
    "饮食中增加富含维生素A、C、E和叶黄素的食物，如胡萝卜、菠菜、蓝莓、坚果等，有助于维护眼睛健康。",
    "调整电脑屏幕设置：亮度与环境光线匹配，对比度设置为80%-90%，字体大小适中，避免过小的文字增加眼睛负担。",
    "保持正确的坐姿，屏幕中心应略低于眼睛水平，距离眼睛约50-70厘米。这样可以减少颈部和眼睛的疲劳。",
    "避免在强光下或黑暗环境中使用电子设备。夜间使用时，建议开启夜间模式或调低屏幕亮度。",
    "如果出现持续的眼干、眼涩、视力模糊等症状，可能是干眼症或其他眼部问题的信号，建议及时就医检查。"
];

// 移除竹子相关代码
function animateBamboo() {
    // 竹子装饰已移除
    return;
}

// 获取豆包建议 - 一次给出3条随机建议
function getDoubaoAdvice() {
    // 显示加载状态
    adviceContent.innerHTML = '<p>获取建议中...</p>';
    loading.style.display = 'block';
    getAdviceBtn.disabled = true;

    // 模拟API请求延迟
    setTimeout(() => {
        // 随机选择3条不同的豆包建议
        const shuffled = [...doubaoAdvices].sort(() => 0.5 - Math.random());
        const selectedAdvices = shuffled.slice(0, 3);

        // 生成建议HTML
        let adviceHTML = '<ul>';
        selectedAdvices.forEach((advice, index) => {
            adviceHTML += `<li>${index + 1}. ${advice}</li>`;
        });
        adviceHTML += '</ul>';

        adviceContent.innerHTML = adviceHTML;

        // 隐藏加载状态
        loading.style.display = 'none';
        getAdviceBtn.disabled = false;
    }, 1500);
}

// 检查并请求通知权限
function checkNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }
}

// 发送桌面通知
function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2' // 使用Font Awesome图标作为通知图标
        });
    }
}

// 初始化
function init() {
    // 加载保存的设置
    loadSettings();
    updateTimerDisplay();

    // 检查通知权限
    checkNotificationPermission();

    // 添加事件监听器
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
// 移除关闭按钮和点击外部关闭的功能
// closeBtn.addEventListener('click', closeRestModal);
continueBtn.addEventListener('click', function() {
    // 显示提示信息，告知用户必须等待休息时间结束
    alert('请等待休息时间结束，这对您的眼睛健康很重要！');
});
intervalInput.addEventListener('change', updateTimerDisplay);
restInput.addEventListener('change', saveSettings);
getAdviceBtn.addEventListener('click', getDoubaoAdvice);

// 移除点击模态框外部关闭的功能
// window.addEventListener('click', function(event) {
//     if (event.target === restModal) {
//         closeRestModal();
//     }
// });

    // 添加鼠标悬停在空白区域的事件监听
    document.body.addEventListener('mouseover', function(event) {
        // 检查鼠标是否不在容器上
        if (!document.querySelector('.container').contains(event.target)) {
            document.body.classList.add('hover-blank');
        }
    });

    document.body.addEventListener('mouseout', function(event) {
        // 移除hover-blank类
        document.body.classList.remove('hover-blank');
    });

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        // 如果休息时间到了且页面不可见
        if (document.visibilityState === 'hidden' && !isWorking && timerInterval) {
            // 发送通知
            sendNotification('护眼小助手提醒', '休息时间到了！请远离屏幕休息一下。');
        }
    });

    // 启动竹子动画
    animateBamboo();
}

// 开始计时器
function startTimer() {
    if (isPaused) {
        isPaused = false;
        statusDisplay.textContent = isWorking ? "工作中..." : "休息中...";
    } else {
        // 保存设置
        saveSettings();

        // 设置总秒数
        totalSeconds = isWorking ? intervalInput.value * 60 : restInput.value;
        statusDisplay.textContent = isWorking ? "工作中..." : "休息中...";
    }

    // 禁用开始按钮，启用暂停和重置按钮
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    intervalInput.disabled = true;
    restInput.disabled = true;

    // 清除之前的计时器
    clearInterval(timerInterval);

    // 设置新的计时器
    timerInterval = setInterval(function() {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);

            if (isWorking) {
                // 工作时间结束，显示休息提醒
                showRestModal();
            } else {
                // 休息时间结束，开始工作
                isWorking = true;
                statusDisplay.textContent = "准备开始";
                updateTimerDisplay();
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                resetBtn.disabled = true;
                intervalInput.disabled = false;
                restInput.disabled = false;
            }
        }
    }, 1000);
}

// 暂停计时器
function pauseTimer() {
    isPaused = true;
    clearInterval(timerInterval);
    statusDisplay.textContent = "已暂停";
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// 重置计时器
function resetTimer() {
    clearInterval(timerInterval);
    isPaused = false;
    isWorking = true;
    loadSettings();
    updateTimerDisplay();
    statusDisplay.textContent = "准备开始";
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    intervalInput.disabled = false;
    restInput.disabled = false;
}

// 更新计时器显示
function updateTimerDisplay() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (isWorking && !isPaused && !timerInterval) {
        // 初始状态下显示设置的工作时间
        minutes = parseInt(intervalInput.value);
        seconds = 0;
    }

    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// 显示休息提醒模态框
function showRestModal() {
    // 随机选择一个护眼建议
    const randomTip = eyeTips[Math.floor(Math.random() * eyeTips.length)];
    restTipText.textContent = randomTip + ' 休息时间结束前无法关闭此提示。';

    // 显示模态框
    restModal.style.display = 'block';

    // 更改背景色为更养眼的绿色
    document.body.classList.add('green-bg');

    // 添加休息模式类，使背景完全显示且操作界面透明
    document.body.classList.add('rest-mode');

    // 发送桌面通知
    sendNotification('护眼小助手提醒', '工作时间结束，该休息了！\n' + randomTip);

    // 设置自动关闭计时器
    setTimeout(autoCloseRestModal, parseInt(restInput.value) * 1000);
}

// 关闭休息提醒模态框 - 现在只能通过休息时间结束自动关闭
function closeRestModal() {
    // 移除手动关闭功能，只能通过休息时间结束自动关闭
}

// 自动关闭休息模态框
function autoCloseRestModal() {
    restModal.style.display = 'none';
    document.body.classList.remove('green-bg');

    // 移除休息模式类
    document.body.classList.remove('rest-mode');

    // 开始休息倒计时
    isWorking = false;
    totalSeconds = parseInt(restInput.value);
    startTimer();
}

// 保存设置到本地存储
function saveSettings() {
    const settings = {
        interval: intervalInput.value,
        rest: restInput.value
    };
    localStorage.setItem('eyeProtectionSettings', JSON.stringify(settings));
}

// 从本地存储加载设置
function loadSettings() {
    const settings = localStorage.getItem('eyeProtectionSettings');
    if (settings) {
        const parsedSettings = JSON.parse(settings);
        intervalInput.value = parsedSettings.interval;
        restInput.value = parsedSettings.rest;
    }
    totalSeconds = intervalInput.value * 60;
}

// 初始化应用
init();