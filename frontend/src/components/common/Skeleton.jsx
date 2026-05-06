export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-3">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </td>
    </tr>
  );
};
