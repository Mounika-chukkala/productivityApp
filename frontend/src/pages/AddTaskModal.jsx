import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function AddTaskModal({ show, setShow, step, setStep, formData, setFormData, handleSubmit, todayDate }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex justify-center items-start pt-20 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-[90%] max-w-md shadow-lg overflow-hidden"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#3D550C]">
                {step < 4 ? `Step ${step} of 4` : "Submit Task"}
              </h2>
              <button onClick={() => setShow(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {step === 1 && (
                <>
                  <label className="block text-sm text-gray-600">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#81B622]"
                    placeholder="Enter title..."
                  />
                  <label className="block mt-4 text-sm text-gray-600">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#81B622]"
                    rows={3}
                    placeholder="Optional description..."
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <label className="block text-sm text-gray-600">Scheduled Date *</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    min={todayDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#81B622]"
                  />
                  <label className="block mt-4 text-sm text-gray-600">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    min={formData.scheduledDate || todayDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#81B622]"
                  />
                </>
              )}
              {step === 3 && (
                <>
                  <label className="block text-sm text-gray-600">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#81B622]"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <label className="block mt-4 text-sm text-gray-600">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#81B622]"
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </>
              )}
              {step === 4 && (
                <>
                  <label className="block text-sm text-gray-600">Reminder Time</label>
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#81B622]"
                  />
                </>
              )}
            </div>

            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-[#F0F4E3]">
              <button
                disabled={step === 1}
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Prev
              </button>
              {step < 4 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="px-4 py-2 bg-[#81B622] text-white hover:bg-[#3D550C] rounded transition"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleSubmit();
                    setShow(false);
                    setStep(1);
                  }}
                  className="px-4 py-2 bg-[#3D550C] text-white hover:bg-[#81B622] rounded transition"
                >
                  Submit
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddTaskModal;
