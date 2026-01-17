export interface BaseListResponse {
    page: number
    limit: number
    total: number
    pageCount: number
    nextPage: boolean
    previousPage: boolean
}