import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
interface ProductDialogProps {
    id: string
}
export function ProductDialog({ id }: ProductDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={`ghost`}>View</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit profile</DialogTitle>
                This is dialog baby
            </DialogContent>
        </Dialog>
    )
}