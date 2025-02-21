<script setup lang="ts">
import { ref } from 'vue'
import { IconUser } from '@arco-design/web-vue/es/icon';

const currentTime = ref(new Date().toLocaleTimeString())

// 更新当前时间
setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
}, 1000)
</script>

<template>
    <a-layout-header class="app-header">
        <div class="header-left">
            <h1 class="logo">Newbie Tix 管理端</h1>
        </div>
        <div class="header-right">
            <a-space>
                <a-typography-text type="secondary">{{ currentTime }}</a-typography-text>
                <a-dropdown>
                    <a-space class="user-info">
                        <a-avatar><icon-user /></a-avatar>
                        <span class="username">管理员</span>
                    </a-space>
                    <template #content>
                        <a-doption>个人设置</a-doption>
                        <a-doption>退出登录</a-doption>
                    </template>
                </a-dropdown>
            </a-space>
        </div>
    </a-layout-header>
</template>

<style scoped>
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
}

.header-left {
    display: flex;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-1);
    margin: 0;
}

.header-right {
    display: flex;
    align-items: center;
}

.user-info {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--border-radius-small);
}

.user-info:hover {
    background-color: var(--color-fill-2);
}

.username {
    font-size: 14px;
    color: var(--color-text-1);
}
</style>