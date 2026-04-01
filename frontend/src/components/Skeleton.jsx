import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`}></div>
);

export const PostCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-soft p-3">
    <Skeleton className="aspect-[4/3] w-full" />
    <div className="mt-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

export default Skeleton;
