function TimelineSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Progress Bar Skeleton */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full"></div>
      </div>

      {/* Timeline Steps Skeleton */}
      <div className="space-y-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            {/* Indicator Column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              
              {/* Connecting Line */}
              {i !== 4 && (
                <div className="w-0.5 h-16 bg-gray-200"></div>
              )}
            </div>

            {/* Content Column */}
            <div className={`flex-1 ${i !== 4 ? 'pb-12' : ''}`}>
              <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimelineSkeleton;
