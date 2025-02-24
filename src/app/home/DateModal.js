export default function DateModal({ isOpen, onClose, selectedDate }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {selectedDate.toLocaleDateString('default', { 
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            {/* Add your modal content here */}
            <p>Add events or details for this date</p>
          </div>
  
          <div className="flex justify-end gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Close
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }