<template>
    <a-modal :visible="visible" :title="title" @cancel="handleCancel" @ok="handleOk">
        <a-form :model="formData" ref="formRef">
            <a-form-item field="name" label="场次名称" :rules="[{ required: true, message: '请输入场次名称' }]">
                <a-input v-model="formData.name" placeholder="请输入场次名称" :readonly="isView" />
            </a-form-item>

            <a-form-item field="timeRange" label="时间段" :rules="[{ required: true, message: '请选择时间段' }]">
                <a-range-picker v-model="formData.timeRange" show-time format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']" :readonly="isView" @change="handleTimeRangeChange" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FormInstance } from '@arco-design/web-vue';
import type { Session } from '@/types/session';

interface Props {
    visible: boolean;
    mode: 'create' | 'edit' | 'view';
    sessionData?: Partial<Session>;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    mode: 'create',
    sessionData: () => ({}),
});

const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
    (e: 'submit', data: Props['sessionData']): void;
}>();

const formRef = ref<FormInstance>();
const formData = ref<Props['sessionData'] & { timeRange: (string | number | Date)[] }>({ 
    ...props.sessionData,
    timeRange: props.sessionData?.startTime && props.sessionData?.endTime
        ? [new Date(props.sessionData.startTime), new Date(props.sessionData.endTime)]
        : []
});

const handleTimeRangeChange = (value: (Date | string | number | undefined)[] | undefined, date: (Date | undefined)[] | undefined, dateStrings: (string | undefined)[] | undefined) => {
    if (date && date[0] && date[1]) {
        formData.value.startTime = date[0].toISOString();
        formData.value.endTime = date[1].toISOString();
    }
};

const title = computed(() => {
    const titleMap = {
        create: '新增场次',
        edit: '编辑场次',
        view: '查看场次',
    };
    return titleMap[props.mode];
});

const isView = computed(() => props.mode === 'view');

const handleCancel = () => {
    emit('update:visible', false);
};

const handleOk = async () => {
    if (!formRef.value) return false;

    try {
        await formRef.value.validate();
        emit('submit', formData.value);
        emit('update:visible', false);
        return true;
    } catch (error) {
        return false;
    }
};
</script>