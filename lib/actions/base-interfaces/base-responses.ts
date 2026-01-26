export interface BaseListResponse<T> {
    page: number
    limit: number
    total: number
    pageCount: number
    nextPage: boolean
    previousPage: boolean
    data: T[]
}