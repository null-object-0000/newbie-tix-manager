<template>
    <a-modal :visible="visible" :title="title" @update:visible="(val) => emit('update:visible', val)" @ok="handleSubmit" @cancel="handleCancel">
        <a-form ref="formRef" :model="formData" :rules="rules">
            <a-form-item field="name" label="票档名称" :rules="[{ required: true, message: '请输入票档名称' }]">
                <a-input v-model="formData.name" placeholder="请输入票档名称" :disabled="mode === 'view'" />
            </a-form-item>

            <a-form-item field="price" label="票价" :rules="[{ required: true, message: '请输入票价' }]">
                <a-input-number v-model="formData.price" placeholder="请输入票价" :min="0" :precision="2" :disabled="mode === 'view'" />
            </a-form-item>

            <a-form-item field="totalSeats" label="总座位数" :rules="[{ required: true, message: '请输入总座位数' }]">
                <a-input-number v-model="formData.totalSeats" placeholder="请输入总座位数" :min="0" :precision="0" :disabled="mode === 'view'" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormInstance } from '@arco-design/web-vue'
import type { TicketTier } from '@/types/ticketTier'

const props = defineProps<{
    visible: boolean
    mode: 'create' | 'edit' | 'view'
    ticketTierData?: Partial<TicketTier>
}>()

const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void
    (e: 'submit', data: Partial<TicketTier>): void
}>()

const formRef = ref<FormInstance>()
const formData = ref<Partial<TicketTier>>({
    name: '',
    price: 0,
    totalSeats: 0,
    ...props.ticketTierData
})

const title = computed(() => {
    const titleMap = {
        create: '新增票档',
        edit: '编辑票档',
        view: '查看票档'
    }
    return titleMap[props.mode]
})

const handleSubmit = async () => {
    if (props.mode === 'view') {
        emit('update:visible', false)
        return
    }

    const valid = await formRef.value?.validate()
    if (valid) {
        emit('submit', formData.value)
    }
}

const handleCancel = () => {
    emit('update:visible', false)
}
</script>