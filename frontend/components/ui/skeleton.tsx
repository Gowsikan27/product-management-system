type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`purple-shimmer rounded-xl ${className}`} />;
}
