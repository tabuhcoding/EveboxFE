export default function ShowingDetailLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="h-6 bg-gray-300 w-1/4 rounded-md" />
      </div>

      <div className="border-t-2 border-[#0C4762] mt-2 mb-4"></div>

      {/* Event Title */}
      <div className="h-8 bg-gray-300 w-2/4 mx-auto rounded-md"></div>

      {/* Seat Map */}
      <div className="seat-map mt-6">
        <div className="h-40 bg-gray-300 rounded-md mb-6"></div>
      </div>

      {/* Event Date and Time */}
      <h2 className="h-6 bg-gray-300 w-1/4 mb-3 mt-6 rounded-md"></h2>
      <div className="detail-event max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-3 mb-6">
        <p className="h-4 bg-gray-300 w-3/4 mb-2 rounded-md"></p>
        <p className="h-4 bg-gray-300 w-3/4 mb-2 rounded-md"></p>
        <p className="h-4 bg-gray-300 w-3/4 mb-2 rounded-md"></p>
      </div>

      {/* Ticket Types */}
      <h2 className="h-6 bg-gray-300 w-1/4 mb-3 mt-6 rounded-md"></h2>
      <div className="h-40 bg-gray-300 rounded-md mb-6"></div>
    </div>
  );
}
