import React from 'react';

function Timeline({ timeline, currentStatus }) {
  // Define the standard order flow
  const statusFlow = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
  
  // Create a map of actual timeline events
  const timelineMap = {};
  timeline?.forEach(event => {
    timelineMap[event.status] = event.timestamp;
  });

  // Determine the current step index
  const currentIndex = statusFlow.indexOf(currentStatus);
  
  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / statusFlow.length) * 100;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStepState = (index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'future';
  };

  const getCircleStyle = (state) => {
    if (state === 'completed') return 'bg-green-500 border-green-500';
    if (state === 'current') return 'bg-gray-900 border-gray-900 ring-4 ring-gray-200';
    return 'bg-white border-gray-300';
  };

  const getLineStyle = (state) => {
    if (state === 'completed') return 'bg-green-500';
    return 'bg-gray-200';
  };

  const getTextStyle = (state) => {
    if (state === 'completed' || state === 'current') return 'text-gray-900 font-semibold';
    return 'text-gray-400';
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Order Progress</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
      {statusFlow.map((status, index) => {
        const state = getStepState(index);
        const timestamp = timelineMap[status];
        const isLast = index === statusFlow.length - 1;

        return (
          <div key={status} className="flex gap-4">
            {/* Indicator Column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${getCircleStyle(state)}`}>
                {state === 'completed' && (
                  <svg className="w-full h-full text-white p-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Connecting Line */}
              {!isLast && (
                <div className={`w-0.5 h-16 transition-all duration-300 ${getLineStyle(state)}`}></div>
              )}
            </div>

            {/* Content Column */}
            <div className={`flex-1 ${!isLast ? 'pb-12' : ''}`}>
              <p className={`font-medium transition-colors duration-300 ${getTextStyle(state)}`}>
                {status}
              </p>
              {timestamp ? (
                <p className="text-sm text-gray-500 mt-1">{formatDate(timestamp)}</p>
              ) : (
                <p className="text-sm text-gray-400 mt-1">Pending</p>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default Timeline;
