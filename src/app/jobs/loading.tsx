import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function JobsLoading() {
  return (
    <div className="container-page py-10">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-20 w-full rounded-lg" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
