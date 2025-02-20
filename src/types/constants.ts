/** 演出状态描述映射 */
export const PERFORMANCE_STATUS_MAP = {
    coming_soon: '待开售',
    on_sale: '售票中',
    sold_out: '已售罄'
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