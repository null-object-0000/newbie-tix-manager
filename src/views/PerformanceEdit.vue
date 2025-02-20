<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FileItem, FormInstance, RequestOption } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import type { Performance, PerformanceStatus } from '@/types'
import { PERFORMANCE_STATUS_OPTIONS } from '@/types/constants'

const router = useRouter()
const route = useRoute()

// 表单实例引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Performance>({
    id: undefined,
    title: '',
    coverUrl: '',
    images: [] as string[],
    venue: '',
    status: 'coming_soon' as PerformanceStatus,
    description: '',
    notices: [] as string[]
})

// 状态选项
const statusOptions = PERFORMANCE_STATUS_OPTIONS

// 表单验证规则
const rules = {
    title: [
        { required: true, message: '请输入演出标题' },
        { maxLength: 100, message: '标题长度不能超过100个字符' }
    ],
    coverUrl: [
        { required: true, message: '请上传封面图片' }
    ],
    venue: [
        { required: true, message: '请输入演出场馆' }
    ],
    status: [
        { required: true, message: '请选择演出状态' }
    ],
    description: [
        { required: true, message: '请输入演出描述' },
        { maxLength: 1000, message: '描述长度不能超过1000个字符' }
    ]
}

// 图片上传配置
const uploadConfig = {
    imageType: ['image/jpeg', 'image/png', 'image/gif'],
    maxSize: 5 * 1024 * 1024 // 5MB
}

const uploadLoading = ref(false)
const imageUploadLoading = ref<{ [key: number]: boolean }>({})

// 通用图片上传函数
const uploadImage = async (fileItem: FileItem) => {
    // 验证文件类型
    if (!fileItem.file || !uploadConfig.imageType.includes(fileItem.file.type)) {
        Message.error('只支持 JPG、PNG、GIF 格式的图片')
        return null
    }
    // 验证文件大小
    if (fileItem.file.size > uploadConfig.maxSize) {
        Message.error('图片大小不能超过 ' + uploadConfig.maxSize / 1024 / 1024 + 'MB')
        return null
    }

    try {
        const uploadFormData = new FormData()
        uploadFormData.append('action', 'upload')
        uploadFormData.append('source', fileItem.file)
        uploadFormData.append('format', 'json')

        const response = await fetch('/api/freeimage/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
            method: 'POST',
            body: uploadFormData
        })

        if (!response.ok) {
            throw new Error('上传失败')
        }

        const data = await response.json()
        if (data.status_code === 200 && data.image && data.image.url) {
            Message.success('上传成功')
            return data.image.url
        } else {
            throw new Error(data.error?.message || '上传失败')
        }
    } catch (error) {
        Message.error('上传失败：' + (error instanceof Error ? error.message : '未知错误'))
        return null
    }
}

// 处理封面图片上传
const handleCoverUpload = async (options: RequestOption) => {
    uploadLoading.value = true
    try {
        const url = await uploadImage(options.fileItem)
        if (url) {
            formData.coverUrl = url
        }
    } finally {
        uploadLoading.value = false
    }
}

// 处理相关图片上传
const handleImageUpload = async (options: RequestOption) => {
    const index = formData.images.length
    imageUploadLoading.value[index] = true
    try {
        const url = await uploadImage(options.fileItem)
        if (url) {
            formData.images.push(url)
        }
    } finally {
        imageUploadLoading.value[index] = false
    }
}

// 处理相关图片删除
const handleImageRemove = (index: number) => {
    formData.images.splice(index, 1)
}

// 处理表单提交
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        // TODO: 实现保存逻辑
        Message.success('保存成功')
        router.push('/performances')
    } catch (error) {
        // 表单验证失败
    }
}

// 处理取消
const handleCancel = () => {
    router.back()
}

// 处理添加观演须知
const handleAddNotice = () => {
    formData.notices.push('')
}

// 处理删除观演须知
const handleRemoveNotice = (index: number) => {
    formData.notices.splice(index, 1)
}
</script>

<template>
    <div class="performance-edit">
        <a-typography-title :heading="3" style="margin-bottom: 24px">
            {{ route.params.id ? '编辑演出' : '新增演出' }}
        </a-typography-title>

        <a-card>
            <a-form ref="formRef" :model="formData" :rules="rules" @submit="handleSubmit">
                <a-form-item field="title" label="演出标题">
                    <a-input v-model="formData.title" placeholder="请输入演出标题" allow-clear />
                </a-form-item>

                <a-form-item field="coverUrl" label="封面图片">
                    <a-upload :custom-request="handleCoverUpload" :show-file-list="false" accept="image/*">
                        <template #upload-button>
                            <div class="upload-demo">
                                <div class="upload-wrapper">
                                    <div v-if="formData.coverUrl" class="upload-preview">
                                        <img :src="formData.coverUrl" alt="封面图片" />
                                        <div class="upload-preview-mask">
                                            <icon-edit />
                                            <div class="upload-preview-text">更换图片</div>
                                        </div>
                                    </div>
                                    <div v-else-if="uploadLoading" class="upload-loading">
                                        <a-spin />
                                        <div class="upload-loading-text">上传中...</div>
                                    </div>
                                    <div v-else class="upload-placeholder">
                                        <icon-plus />
                                        <div class="upload-placeholder-text">上传封面图片</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-upload>
                </a-form-item>

                <a-form-item label="相关图片">
                    <div class="image-list">
                        <div v-for="(image, index) in formData.images" :key="index" class="image-item">
                            <div class="image-preview">
                                <img :src="image" alt="相关图片" />
                                <div class="image-preview-mask">
                                    <a-button type="text" status="danger" @click="handleImageRemove(index)">
                                        <template #icon><icon-delete /></template>
                                    </a-button>
                                </div>
                            </div>
                        </div>
                        <a-upload :custom-request="handleImageUpload" :show-file-list="false" accept="image/*">
                            <template #upload-button>
                                <div class="upload-demo">
                                    <div class="upload-wrapper">
                                        <div v-if="imageUploadLoading[formData.images.length]" class="upload-loading">
                                            <a-spin />
                                            <div class="upload-loading-text">上传中...</div>
                                        </div>
                                        <div v-else class="upload-placeholder">
                                            <icon-plus />
                                            <div class="upload-placeholder-text">添加图片</div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </a-upload>
                    </div>
                </a-form-item>

                <a-form-item field="venue" label="演出场馆">
                    <a-input v-model="formData.venue" placeholder="请输入演出场馆" allow-clear />
                </a-form-item>

                <a-form-item field="status" label="演出状态">
                    <a-select v-model="formData.status" :options="statusOptions" placeholder="请选择演出状态" />
                </a-form-item>

                <a-form-item field="description" label="演出描述">
                    <a-textarea v-model="formData.description" placeholder="请输入演出描述"
                        :auto-size="{ minRows: 4, maxRows: 8 }" />
                </a-form-item>

                <a-form-item label="观演须知">
                    <div v-for="(notice, index) in formData.notices" :key="index" class="notice-item">
                        <a-textarea v-model="formData.notices[index]" placeholder="请输入观演须知"
                            :auto-size="{ minRows: 2, maxRows: 4 }" />
                        <a-button type="text" status="danger" @click="handleRemoveNotice(index)">删除</a-button>
                    </div>
                    <a-button type="outline" @click="handleAddNotice">添加观演须知</a-button>
                </a-form-item>

                <a-form-item>
                    <a-space>
                        <a-button type="primary" html-type="submit">保存</a-button>
                        <a-button @click="handleCancel">取消</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<style scoped>
.performance-edit {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
}

.notice-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: flex-start;
}

.notice-item :deep(.arco-textarea-wrapper) {
    flex: 1;
}

.upload-demo {
    width: 100%;
}

.upload-wrapper {
    width: 140px;
    height: 140px;
    border: 1px dashed var(--color-neutral-3);
    border-radius: 4px;
    overflow: hidden;
}

.upload-preview {
    width: 100%;
    height: 100%;
    position: relative;
}

.upload-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload-preview-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s;
}

.upload-preview:hover .upload-preview-mask {
    opacity: 1;
}

.upload-preview-text {
    margin-top: 8px;
    font-size: 14px;
}

.upload-loading {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-text-3);
}

.upload-loading-text {
    margin-top: 8px;
    font-size: 14px;
}

.upload-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-text-3);
    cursor: pointer;
}

.upload-placeholder:hover {
    border-color: rgb(var(--primary-6));
    color: rgb(var(--primary-6));
}

.upload-placeholder-text {
    margin-top: 8px;
    font-size: 14px;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.image-item {
    width: 140px;
}

.image-preview {
    width: 100%;
    height: 140px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-preview-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.image-preview:hover .image-preview-mask {
    opacity: 1;
}
</style>