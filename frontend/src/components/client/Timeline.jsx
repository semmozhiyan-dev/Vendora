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
    if (state === 'completed') return 'text-[#0A0A0A] font-semibold';
    if (state === 'current') return 'text-[#0A0A0A] font-semibold';
    return 'text-gray-400';
  };

  const getStepLabel = (status) => {
    const labels = {
      PENDING: 'Order placed',
      PAID: 'Payment confirmed',
      SHIPPED: 'Out for delivery',
      DELIVERED: 'Delivered',
    };

    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="rounded-[24px] border border-gray-200 bg-[#FAFAFA] px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">Tracking</p>
            <p className="mt-1 text-sm font-medium text-[#0A0A0A]">Order progress</p>
          </div>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-[#0A0A0A]">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#0A0A0A] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {statusFlow.map((status, index) => {
          const state = getStepState(index);
          const timestamp = timelineMap[status];
          const isLast = index === statusFlow.length - 1;

          return (
            <div key={status} className="flex gap-4 sm:gap-5">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${getCircleStyle(state)}`}
                >
                  {state === 'completed' ? (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : state === 'current' ? (
                    <div className="h-3 w-3 rounded-full bg-white" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                  )}
                </div>

                {!isLast && <div className={`w-px flex-1 transition-all duration-300 ${getLineStyle(state)}`} />}
              </div>

              <div className={`flex-1 rounded-[24px] border px-5 py-4 transition-all duration-300 sm:px-6 ${state === 'completed' ? 'border-emerald-200 bg-emerald-50/70' : state === 'current' ? 'border-[#0A0A0A] bg-white shadow-sm' : 'border-gray-200 bg-white'}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className={`text-sm uppercase tracking-[0.22em] ${getTextStyle(state)}`}>{getStepLabel(status)}</p>
                    <p className="mt-1 text-sm text-gray-500">{status}</p>
                  </div>
                  <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${state === 'completed' ? 'bg-emerald-100 text-emerald-700' : state === 'current' ? 'bg-[#0A0A0A] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {state}
                  </span>
                </div>
                {timestamp ? (
                  <p className="mt-3 text-sm text-gray-500">{formatDate(timestamp)}</p>
                ) : (
                  <p className="mt-3 text-sm text-gray-400">Pending</p>
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
