import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full w-full opacity-60">
      <div>
        <Spinner className="size-8" />
      </div>
    </div>
  );
}
