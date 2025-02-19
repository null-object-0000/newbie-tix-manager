<template>
    <div class="container">
        <a-card class="card" :bordered="false">
            <template #title>编辑演出</template>
            <a-form :model="formData" @submit="handleSubmit">
                <a-form-item field="name" label="演出名称" :rules="[{ required: true, message: '请输入演出名称' }]">
                    <a-input v-model="formData.name" placeholder="请输入演出名称" />
                </a-form-item>

                <a-form-item field="description" label="演出介绍" :rules="[{ required: true, message: '请输入演出介绍' }]">
                    <a-textarea v-model="formData.description" placeholder="请输入演出介绍" />
                </a-form-item>

                <a-form-item field="startTime" label="开始时间" :rules="[{ required: true, message: '请选择开始时间' }]">
                    <a-date-picker v-model="formData.startTime" show-time format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择开始时间" />
                </a-form-item>

                <a-form-item field="endTime" label="结束时间" :rules="[{ required: true, message: '请选择结束时间' }]">
                    <a-date-picker v-model="formData.endTime" show-time format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择结束时间" />
                </a-form-item>

                <a-form-item field="venue" label="演出地点" :rules="[{ required: true, message: '请输入演出地点' }]">
                    <a-input v-model="formData.venue" placeholder="请输入演出地点" />
                </a-form-item>

                <a-form-item field="priceRange" label="票价范围" :rules="[{ required: true, message: '请输入票价范围' }]">
                    <a-input v-model="formData.priceRange" placeholder="请输入票价范围，例如：180-580元" />
                </a-form-item>

                <a-form-item field="organizer" label="主办方" :rules="[{ required: true, message: '请输入主办方' }]">
                    <a-input v-model="formData.organizer" placeholder="请输入主办方名称" />
                </a-form-item>

                <a-form-item field="contact" label="联系方式" :rules="[{ required: true, message: '请输入联系方式' }]">
                    <a-input v-model="formData.contact" placeholder="请输入联系方式" />
                </a-form-item>

                <a-form-item>
                    <a-space>
                        <a-button type="primary" html-type="submit">保存</a-button>
                        <a-button @click="router.back()">取消</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

interface FormData {
    name: string
    description: string
    startTime: string
    endTime: string
    venue: string
    priceRange: string
    organizer: string
    contact: string
}

const formData = ref<FormData>({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    venue: '',
    priceRange: '',
    organizer: '',
    contact: ''
})

// 获取演出详情
const fetchShowDetail = async () => {
    try {
        // TODO: 调用后端 API 获取演出详情
        // 模拟数据
        const showData = {
            name: '2024年春节音乐会',
            description: '一场充满节日气氛的音乐盛宴',
            startTime: '2024-02-10 19:30:00',
            endTime: '2024-02-10 21:30:00',
            venue: '国家大剧院音乐厅',
            priceRange: '180-580元',
            organizer: '国家大剧院',
            contact: '010-12345678'
        }
        formData.value = showData
    } catch (error) {
        Message.error('获取演出详情失败')
    }
}

// 提交表单
const handleSubmit = async () => {
    try {
        // TODO: 调用后端 API 更新演出信息
        Message.success('更新成功')
        router.push(`/shows/${id}`)
    } catch (error) {
        Message.error('更新失败')
    }
}

onMounted(() => {
    fetchShowDetail()
})
</script>

<style scoped>
.container {
    padding: 20px;
}

.card {
    max-width: 800px;
    margin: 0 auto;
}
</style>