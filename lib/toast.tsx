import { toast } from "react-toastify"

export const notify = {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg)
}