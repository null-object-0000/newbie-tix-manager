/** 演出状态描述映射 */
export const PERFORMANCE_STATUS_MAP = {
    COMING_SOON: '待开售',
    ON_SALE: '售票中',
    SOLD_OUT: '已售罄',
    OFFLINE: '已下架',
} as const

/** 演出状态选项（用于下拉选择） */
export const PERFORMANCE_STATUS_OPTIONS = PERFORMANCE_STATUS_MAP
    ? Object.entries(PERFORMANCE_STATUS_MAP).map(([value, label]) => ({ label, value }))
    : []

/** 演出状态筛选选项（包含全部选项） */
export const PERFORMANCE_STATUS_FILTER_OPTIONS = [
    { label: '全部', value: '' },
    ...PERFORMANCE_STATUS_OPTIONS
]