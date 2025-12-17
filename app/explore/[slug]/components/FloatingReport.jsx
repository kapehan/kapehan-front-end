import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCoffee } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { MdReport } from "react-icons/md";
import { createCoffeeShopReports } from "../../../../services/commonService";
import ReportSuccessModal from "./ReportSuccessModal";

// Props: open (bool), onClose (func), shopName (string)
export default function FloatingReportModal({ open, onClose, shopName = "", shopId }) {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "reportType") setReportType(value);
    if (name === "description") setDescription(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!shopId) throw new Error("Missing shop ID.");
      await createCoffeeShopReports(shopId, {
        shopName,
        reportType,
        description,
      });
      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      setError("Failed to submit report. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-xl font-whyte-bold text-stone-800">
                  Report Coffee Shop Info
                </h2>
                <p className="text-sm text-stone-600">
                  Help us keep Kapehan accurate by reporting incorrect or
                  missing info.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 transition-colors rounded-lg hover:bg-stone-100"
            >
              <FaTimes />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Report Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Coffee Shop Name (readonly) */}
            <div>
              <label className="block text-sm font-whyte-medium text-stone-700 mb-2">
                Coffee Shop Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="shopName"
                  value={shopName}
                  readOnly
                  className="w-full pl-4 pr-4 py-3 border border-stone-300 rounded-lg bg-stone-100 text-stone-700 focus:outline-none"
                />
              </div>
            </div>

            {/* What to report dropdown */}
            <div>
              <label className="block text-sm font-whyte-medium text-stone-700 mb-2">
                What to report
              </label>
              <div className="relative">
                <select
                  name="reportType"
                  value={reportType}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                >
                  <option value="" key="report-type-placeholder">Select what to report</option>
                  <option value="Amenities" key="report-type-amenities">Amenities</option>
                  <option value="Vibes" key="report-type-vibes">Vibes</option>
                  <option value="Payment Options" key="report-type-payment">Payment Options</option>
                  <option value="Hours" key="report-type-hours">Hours</option>
                </select>
              </div>
            </div>

            {/* Description textarea */}
            <div>
              <label className="block text-sm font-whyte-medium text-stone-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={description}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[100px] resize-vertical"
                  placeholder="Describe the issue or missing info in detail..."
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-lg font-whyte-bold hover:shadow-lg transition-all duration-300 mt-6 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </motion.div>
      </div>
      <ReportSuccessModal show={showSuccess} onClose={() => {
        setShowSuccess(false);
        onClose();
      }} />
    </AnimatePresence>
  );
}

// FloatingReportButton: styled trigger button for opening the modal
export function FloatingReportButton({ onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        aria-label="Report coffee shop"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="
          group inline-flex items-center rounded-full
          text-amber-700
          px-3 md:px-4 py-2 md:py-2
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-500
          cursor-pointer
          min-h-[44px] min-w-[44px]
          bg-transparent
        "
      >
        <MdReport className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 px-3 py-1 rounded bg-stone-800 text-white text-xs font-whyte-medium shadow-lg whitespace-nowrap">
          Report
        </div>
      )}
    </div>
  );
}
