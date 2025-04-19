import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={`flex items-start gap-3 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className={`space-y-2 ${i % 2 === 0 ? "items-start" : "items-end"}`}>
            <Skeleton className={`h-24 w-[250px] rounded-lg ${i % 2 === 0 ? "ml-0" : "ml-auto"}`} />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
