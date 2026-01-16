/**
 * eDOC Mobile Prototype - Share View JavaScript
 */

// ========================================
// Verify Page Functions
// ========================================

// 验证码输入处理
document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.querySelectorAll('.code-input');

    if (codeInputs.length > 0) {
        codeInputs.forEach((input, index) => {
            // 输入时自动跳转到下一个
            input.addEventListener('input', function(e) {
                const value = e.target.value;

                // 只允许数字和字母
                e.target.value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

                if (e.target.value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }

                // 检查是否全部填写
                checkAllFilled();
            });

            // 退格键处理
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            // 粘贴处理
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

                for (let i = 0; i < pasteData.length && i + index < codeInputs.length; i++) {
                    codeInputs[i + index].value = pasteData[i];
                }

                const nextIndex = Math.min(index + pasteData.length, codeInputs.length - 1);
                codeInputs[nextIndex].focus();
                checkAllFilled();
            });
        });
    }

    // 验证按钮点击
    const btnVerify = document.getElementById('btnVerify');
    if (btnVerify) {
        btnVerify.addEventListener('click', handleVerify);
    }
});

function checkAllFilled() {
    const codeInputs = document.querySelectorAll('.code-input');
    const btnVerify = document.getElementById('btnVerify');

    if (!btnVerify) return;

    let allFilled = true;
    codeInputs.forEach(input => {
        if (!input.value) allFilled = false;
    });

    btnVerify.style.opacity = allFilled ? '1' : '0.6';
}

function handleVerify() {
    const codeInputs = document.querySelectorAll('.code-input');
    let code = '';
    codeInputs.forEach(input => {
        code += input.value;
    });

    if (code.length !== 4) {
        showErrorModal();
        return;
    }

    // 模拟验证 - 任意4位字符都通过
    showSuccessModal();

    setTimeout(() => {
        window.location.href = 'doc-list.html';
    }, 2000);
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function showErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.classList.remove('show');
    }

    // 清空输入并聚焦第一个
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach(input => input.value = '');
    if (codeInputs[0]) codeInputs[0].focus();
}

// ========================================
// Document List Page Functions
// ========================================

function initDocList() {
    // 搜索框功能
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const value = e.target.value;
            clearSearch.style.display = value ? 'block' : 'none';
            filterDocuments(value);
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';
            clearSearch.style.display = 'none';
            filterDocuments('');
        });
    }

    // 全选功能
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.doc-checkbox input');
            checkboxes.forEach(cb => cb.checked = this.checked);
            updateSelectedCount();
        });
    }

    // 单个选择
    const docCheckboxes = document.querySelectorAll('.doc-checkbox input');
    docCheckboxes.forEach(cb => {
        cb.addEventListener('change', function(e) {
            e.stopPropagation();
            updateSelectedCount();
        });
    });

    // 阻止checkbox的点击事件冒泡到doc-item
    document.querySelectorAll('.doc-checkbox').forEach(div => {
        div.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // 更多按钮
    const moreBtn = document.getElementById('moreBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (moreBtn && dropdownMenu) {
        moreBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
    }
}

function toggleGroup(groupId) {
    const group = document.querySelector(`[data-group="${groupId}"]`);
    if (!group) return;

    const header = group.querySelector('.group-header');
    const content = group.querySelector('.group-content');

    header.classList.toggle('collapsed');
    content.classList.toggle('expanded');
}

function filterDocuments(keyword) {
    const items = document.querySelectorAll('.doc-item');
    const lowerKeyword = keyword.toLowerCase();

    items.forEach(item => {
        const title = item.querySelector('.doc-info h4').textContent.toLowerCase();
        if (title.includes(lowerKeyword)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.doc-checkbox input:checked');
    const countSpan = document.getElementById('selectedNum');
    if (countSpan) {
        countSpan.textContent = checkboxes.length;
    }

    // 更新全选状态
    const selectAll = document.getElementById('selectAll');
    const allCheckboxes = document.querySelectorAll('.doc-checkbox input');
    if (selectAll && allCheckboxes.length > 0) {
        selectAll.checked = checkboxes.length === allCheckboxes.length;
    }
}

function previewDoc(element) {
    window.location.href = 'doc-preview.html';
}

function downloadSelected() {
    const selected = document.querySelectorAll('.doc-checkbox input:checked');
    if (selected.length === 0) {
        showToast('请先选择文档');
        return;
    }
    showToast(`正在下载 ${selected.length} 个文档...`);
}

function shareSelected() {
    const selected = document.querySelectorAll('.doc-checkbox input:checked');
    if (selected.length === 0) {
        showToast('请先选择文档');
        return;
    }
    showToast('已复制分享链接');
}

function favoriteSelected() {
    showLoginModal();
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function goToLogin() {
    window.location.href = '../account-view/home.html';
}

function goToRegister() {
    window.location.href = '../account-view/home.html';
}

// ========================================
// Document Preview Page Functions
// ========================================

function initPreview() {
    // 双指缩放
    const container = document.getElementById('previewContainer');
    let scale = 1;
    let startDistance = 0;

    if (container) {
        container.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                startDistance = getDistance(e.touches[0], e.touches[1]);
            }
        });

        container.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const newScale = scale * (currentDistance / startDistance);

                if (newScale >= 0.5 && newScale <= 3) {
                    document.getElementById('previewContent').style.transform = `scale(${newScale})`;
                }
            }
        });

        container.addEventListener('touchend', function(e) {
            if (e.touches.length === 0) {
                const content = document.getElementById('previewContent');
                const transform = content.style.transform;
                const match = transform.match(/scale\(([\d.]+)\)/);
                if (match) {
                    scale = parseFloat(match[1]);
                }
            }
        });

        // 双击重置
        container.addEventListener('dblclick', function() {
            scale = 1;
            document.getElementById('previewContent').style.transform = 'scale(1)';
        });
    }

    // 搜索功能
    const searchInput = document.getElementById('contentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            highlightMatches(e.target.value);
        });
    }
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function toggleSearch() {
    const toolbar = document.getElementById('searchToolbar');
    if (toolbar) {
        toolbar.classList.toggle('show');
        if (toolbar.classList.contains('show')) {
            document.getElementById('contentSearch').focus();
        }
    }
}

function closeSearch() {
    const toolbar = document.getElementById('searchToolbar');
    if (toolbar) {
        toolbar.classList.remove('show');
        clearHighlights();
    }
}

function highlightMatches(keyword) {
    clearHighlights();

    if (!keyword) {
        document.getElementById('matchCount').textContent = '0';
        return;
    }

    const content = document.getElementById('previewContent');
    const text = content.innerHTML;
    const regex = new RegExp(`(${keyword})`, 'gi');

    let matchCount = 0;
    const newText = text.replace(regex, function(match) {
        matchCount++;
        return `<mark class="highlight">${match}</mark>`;
    });

    content.innerHTML = newText;
    document.getElementById('matchCount').textContent = matchCount;
}

function clearHighlights() {
    const highlights = document.querySelectorAll('mark.highlight');
    highlights.forEach(mark => {
        const text = document.createTextNode(mark.textContent);
        mark.parentNode.replaceChild(text, mark);
    });
}

function prevMatch() {
    showToast('上一个匹配项');
}

function nextMatch() {
    showToast('下一个匹配项');
}

function downloadDoc() {
    showToast('开始下载文档...');
}

function shareDoc() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function shareToWechat() {
    closeShareModal();
    showToast('正在打开微信...');
}

function shareToMoments() {
    closeShareModal();
    showToast('正在打开朋友圈...');
}

function copyLink() {
    closeShareModal();

    // 模拟复制
    const link = 'https://edoc.company.com/s/ABC123XYZ';
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link);
    }

    showToast('链接已复制到剪贴板');
}

function generateQR() {
    closeShareModal();
    showToast('二维码已生成');
}

function favoriteDoc() {
    // 检查是否登录（这里模拟未登录状态）
    showLoginModal();
}

function showDocInfo() {
    const modal = document.getElementById('docInfoModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeDocInfo() {
    const modal = document.getElementById('docInfoModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function copyText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    }
    showToast(`已复制: ${text}`);
}

function previewFromInfo() {
    closeDocInfo();
}

function downloadFromInfo() {
    closeDocInfo();
    showToast('开始下载文档...');
}

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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 根据页面类型初始化
    if (document.querySelector('.doc-list-page')) {
        initDocList();
    }

    if (document.querySelector('.preview-page')) {
        initPreview();
    }
});
