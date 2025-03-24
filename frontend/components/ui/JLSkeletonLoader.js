export const JLSkeletonLoader = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="job-listing-box flex flex-col p-4 mb-4 animate-pulse">
        <div className="flex flex-row justify-between items-center">
          <div className="bg-placeholder rounded-full w-8 h-6"></div>
          <div className="bg-placeholder rounded w-4 h-5"></div>
        </div>

        <div className="bg-placeholder h-5 mt-2 rounded w-full"></div>
        <div className="bg-placeholder h-3 mt-2 w-1/2 rounded"></div>
        <div className="bg-placeholder h-3 mt-2 w-1/3 rounded"></div>

        <div className="flex flex-row items-center mt-4">
          <div className="bg-placeholder rounded-full w-6 h-4"></div>
          <div className="bg-placeholder h-3 ml-2 w-1/3 rounded"></div>
        </div>

        <div className="flex flex-row items-center mt-2">
          <div className="bg-placeholder rounded-full w-6 h-4"></div>
          <div className="bg-placeholder h-3 ml-2 w-1/3 rounded"></div>
        </div>

        <div className="flex flex-row items-center mt-2">
          <div className="bg-placeholder rounded-full w-6 h-4"></div>
          <div className="bg-placeholder h-3 ml-2 w-1/4 rounded"></div>
        </div>

        <div className="flex flex-row items-center mt-2">
          <div className="bg-placeholder rounded-full w-6 h-4"></div>
          <div className="bg-placeholder h-3 ml-2 w-1/4 rounded"></div>
        </div>

        <div className="bg-placeholder h-3 mt-4 rounded w-full"></div>
        <div className="bg-placeholder h-3 mt-1 rounded w-full"></div>
        <div className="bg-background h-0 mt-1 rounded w-screen"></div>
      </div>
    </div>
  );
};
