/** 演出状态类型 - 表示演出当前销售状态 */
export type PerformanceStatus = 'on_sale' | 'coming_soon' | 'sold_out'

/** 演出信息 - 包含演出的所有基本信息和状态 */
export interface Performance {
    /** 演出ID，唯一标识 */
    id?: number
    /** 演出标题 */
    title: string
    /** 封面图片URL */
    coverUrl: string
    /** 演出相关图片列表 */
    images: string[]
    /** 演出场馆 */
    venue: string
    /** 演出状态（在售/即将开售/售罄） */
    status: PerformanceStatus
    /** 演出详细描述 */
    description: string
    /** 观演须知列表 */
    notices: string[]
}

/** 演出场次信息 - 包含具体场次的时间和票务信息 */
export interface PerformanceSession {
    /** 场次ID，唯一标识 */
    id: number
    /** 场次标题（可选，为空时使用场次演出开始时间作为标题） */
    title?: string
    /** 场次售卖开始时间 */
    startSaleTime: string
    /** 场次售卖结束时间 */
    endSaleTime: string
    /** 场次演出开始时间 */
    startShowTime: string
    /** 场次演出结束时间 */
    endShowTime: string
    /** 场次状态（在售/即将开售/售罄） */
    status: PerformanceStatus
}

/** 票档信息 - 包含票价、区域和库存信息 */
export interface PerformanceTicket {
    /** 票档ID，唯一标识 */
    id: number
    /** 票档标题 */
    title: string
    /** 票价 */
    price: number
    /** 总库存数量 */
    totalStock: number
}

/** 订单状态类型 - 表示订单的处理状态 */
export type OrderStatus = 'unpaid' | 'paid' | 'cancelled' | 'completed'

/** 订单信息 - 包含订单的完整信息，包括演出、票档和支付等详情 */
export interface Order {
    /** 订单编号，用于显示 */
    orderNo: string
    /** 订单状态 */
    status: OrderStatus
    /** 订单创建时间 */
    createTime: string
    /** 支付完成时间（可选） */
    payTime?: string
    /** 关联的演出ID */
    performanceId: number
    /** 场次ID */
    sessionId: number
    /** 票档ID */
    ticketId: number
    /** 单张票价 */
    price: number
    /** 购买数量 */
    quantity: number
    /** 票面总价（单价×数量） */
    totalAmount: number
    /** 实付金额（总价+服务费） */
    finalAmount: number

    /** 状态显示文本 */
    statusText?: string
}