/**
 * eDOC Mobile Prototype - Account View JavaScript
 */

// ========================================
// Common Functions
// ========================================

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText') || toast.querySelector('span');

    if (toast) {
        if (toastText) {
            toastText.textContent = message;
        }
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
}

function goToPage(page) {
    window.location.href = page;
}

function goToSearch() {
    showToast('打开搜索页面');
}

function goToScan() {
    showToast('打开扫码功能');
}

function goToProfile() {
    window.location.href = 'profile.html';
}

// ========================================
// Home Page Functions
// ========================================

// 通知面板
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');

if (notificationBtn && notificationPanel) {
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationPanel.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
        if (!notificationPanel.contains(e.target)) {
            notificationPanel.classList.remove('show');
        }
    });
}

function closeNotification() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.remove('show');
    }
}

// 语音功能
function startVoice() {
    const modal = document.getElementById('voiceModal');
    if (modal) {
        modal.classList.add('show');

        // 模拟3秒后关闭
        setTimeout(() => {
            closeVoiceModal();
            showToast('语音识别：查询订单20260112的COA证书');
        }, 3000);
    }
}

function closeVoiceModal() {
    const modal = document.getElementById('voiceModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// 文档预览
function previewDoc(docType) {
    window.location.href = '../share-view/doc-preview.html';
}

// ========================================
// Library Page Functions
// ========================================

function filterBySystem(system) {
    showToast(`筛选 ${system.toUpperCase()} 系统文档`);
}

function filterByType(type) {
    showToast(`筛选 ${type} 类型文档`);
}

function toggleFilter() {
    const panel = document.getElementById('filterPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

function resetFilter() {
    const options = document.querySelectorAll('.filter-option');
    options.forEach((opt, index) => {
        if (opt.textContent === '全部') {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
    showToast('筛选条件已重置');
}

function applyFilter() {
    toggleFilter();
    showToast('筛选已应用');
}

// 筛选选项点击
document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
        const group = this.closest('.filter-options');
        group.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

// 收藏夹功能
function createFolder() {
    const modal = document.getElementById('folderModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeFolderModal() {
    const modal = document.getElementById('folderModal');
    if (modal) {
        modal.classList.remove('show');
    }
    // 清空输入
    const input = document.getElementById('folderName');
    if (input) input.value = '';
}

function saveFolderName() {
    const input = document.getElementById('folderName');
    const name = input ? input.value.trim() : '';

    if (!name) {
        showToast('请输入收藏夹名称');
        return;
    }

    closeFolderModal();
    showToast(`收藏夹"${name}"已创建`);
}

function openFolder(folderId) {
    showToast(`打开收藏夹: ${folderId}`);
}

// 颜色选择
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

// 分享详情
function viewShareDetail(shareId) {
    showToast(`查看分享详情 #${shareId}`);
}

// ========================================
// Task Page Functions
// ========================================

// 任务详情相关函数在task.html中内联定义

// ========================================
// Profile Page Functions
// ========================================

// 个人中心相关函数在profile.html中内联定义

// ========================================
// Upload Page Functions
// ========================================

// 上传页面相关函数在upload.html中内联定义

// ========================================
// Animation & Effects
// ========================================

// 页面滚动效果
document.addEventListener('scroll', function() {
    const header = document.querySelector('.home-header, .page-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, { passive: true });

// 触摸反馈
document.querySelectorAll('.function-item, .recent-item, .todo-item, .setting-item, .task-card').forEach(item => {
    item.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });

    item.addEventListener('touchend', function() {
        this.style.transform = '';
    });
});

// ========================================
// Modal Close on Backdrop Click
// ========================================

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
});

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // 添加页面入场动画
    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        pageContent.style.opacity = '0';
        pageContent.style.transform = 'translateY(10px)';

        requestAnimationFrame(() => {
            pageContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            pageContent.style.opacity = '1';
            pageContent.style.transform = 'translateY(0)';
        });
    }

    // 初始化下拉刷新提示
    let startY = 0;
    let isPulling = false;

    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!isPulling) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 80 && window.scrollY === 0) {
            // 显示下拉刷新提示
        }
    }, { passive: true });

    document.addEventListener('touchend', function() {
        isPulling = false;
    }, { passive: true });

    console.log('eDOC Account View initialized');
});
