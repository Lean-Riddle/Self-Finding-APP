document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    let isLoading = false;

    // 添加消息到聊天界面
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 发送消息
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message || isLoading) return;

        // 禁用输入和发送按钮
        messageInput.disabled = true;
        sendButton.disabled = true;
        isLoading = true;

        // 显示用户消息
        addMessage(message, true);
        messageInput.value = '';

        try {
            // 这里将替换为实际的 API 调用
            const response = await fetch('http://14.103.172.196/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer app-8Xe8ITlY9YxNTrUk7wlLVb6r'
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: message
                    }]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                addMessage(data.choices[0].message.content);
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，发生了一些错误，请稍后重试。');
        } finally {
            // 恢复输入和发送按钮
            messageInput.disabled = false;
            sendButton.disabled = false;
            isLoading = false;
            messageInput.focus();
        }
    }

    // 在 fetch 请求中添加 mode: 'cors'
    const response = await fetch('http://14.103.172.196/v1/chat/completions', {
        method: 'POST',
        mode: 'cors',  // 添加这行
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer app-8Xe8ITlY9YxNTrUk7wlLVb6r'
        },
        // ... 其他配置
    });

    // 在 script.js 中添加
    window.addEventListener('message', function(e) {
        console.log('收到小程序消息:', e.data);
    });
    
    // 发送消息到小程序
    function sendMessageToMiniProgram(data) {
        if (window.wx && window.wx.miniProgram) {
            window.wx.miniProgram.postMessage({ data });
        }
    }

    // 事件监听
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
