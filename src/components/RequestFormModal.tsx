import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, MessageSquare, Send, CheckCircle, MapPin, AlertCircle } from "lucide-react";
import { submitFOIRequest } from "../lib/foiService";

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONCERN_TYPES = [
  "General Inquiry",
  "Document Request",
  "Service Complaint",
  "Suggestion",
  "Report",
  "Other",
];

const RequestFormModal = ({ isOpen, onClose }: RequestFormModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    barangay: "",
    street: "",
    concern: "",
  });
  const [customConcern, setCustomConcern] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const result = await submitFOIRequest({
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        barangay: formData.barangay,
        street: formData.street,
        concern: formData.concern === "Other" ? customConcern : formData.concern,
      });

      if (result.success && result.referenceNumber) {
        setReferenceNumber(result.referenceNumber);
        setIsSubmitted(true);
      } else {
        setError(result.error || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ fullName: "", email: "", contactNumber: "", barangay: "", street: "", concern: "" });
    setCustomConcern("");
    setIsSubmitted(false);
    setError(null);
    setReferenceNumber(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSubmitted ? (
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-card-foreground">
                    Submit FOI Request
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-muted transition-colors text-card-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
                      <User size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Juan Dela Cruz"
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="juan@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
                      <Phone size={16} />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      placeholder="09XX XXX XXXX"
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                  </div>

                  {/* Address Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Barangay */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
                        <MapPin size={16} />
                        Barangay
                      </label>
                      <input
                        type="text"
                        name="barangay"
                        value={formData.barangay}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Mandalagan"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>

                    {/* Street */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
                        <MapPin size={16} />
                        Street
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Main Street"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>
                  </div>

                  {/* Concern/Suggestion */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
                      <MessageSquare size={16} />
                      Type of Concern
                    </label>
                    <select
                      name="concern"
                      value={formData.concern}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    >
                      {CONCERN_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Concern Input */}
                  {formData.concern === "Other" && (
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-card-foreground mb-2">
                        <MessageSquare size={16} />
                        Please specify your concern
                      </label>
                      <input
                        type="text"
                        value={customConcern}
                        onChange={(e) => setCustomConcern(e.target.value)}
                        required
                        placeholder="Enter your concern here..."
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30">
                      <AlertCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Request
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-forest/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-forest" />
                </motion.div>
                <h3 className="text-2xl font-display font-bold text-card-foreground mb-3">
                  Request Submitted!
                </h3>
                <p className="text-card-foreground/70 mb-6">
                  Your FOI request has been successfully submitted. You will receive a 
                  confirmation email with your tracking number shortly.
                </p>
                <p className="text-sm text-card-foreground/60 mb-6">
                  Reference: <span className="font-mono font-bold">{referenceNumber}</span>
                </p>
                <button
                  onClick={handleClose}
                  className="btn-gold"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestFormModal;
