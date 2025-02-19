<template>
    <div class="show-create">
        <a-page-header title="新增演出" @back="router.back()" />

        <a-card class="form-card">
            <a-form :model="formData" @submit="handleSubmit">
                <a-form-item field="name" label="演出名称" :rules="[{ required: true, message: '请输入演出名称' }]">
                    <a-input v-model="formData.name" placeholder="请输入演出名称" />
                </a-form-item>

                <a-form-item field="description" label="演出描述" :rules="[{ required: true, message: '请输入演出描述' }]">
                    <a-textarea v-model="formData.description" placeholder="请输入演出描述" />
                </a-form-item>

                <a-form-item field="startTime" label="开始时间" :rules="[{ required: true, message: '请选择开始时间' }]">
                    <a-date-picker v-model="formData.startTime" show-time placeholder="请选择开始时间" />
                </a-form-item>

                <a-form-item field="endTime" label="结束时间" :rules="[{ required: true, message: '请选择结束时间' }]">
                    <a-date-picker v-model="formData.endTime" show-time placeholder="请选择结束时间" />
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
                        <a-button type="primary" html-type="submit">提交</a-button>
                        <a-button @click="router.back()">取消</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const router = useRouter()

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

const handleSubmit = async () => {
    try {
        // TODO: 调用后端 API 创建演出
        Message.success('创建成功')
        router.push('/shows')
    } catch (error) {
        Message.error('创建失败')
    }
}
</script>

<style scoped>
.show-create {
    padding: 20px;
}

.form-card {
    margin-top: 16px;
}
</style>