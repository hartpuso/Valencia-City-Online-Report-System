import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const DisclaimerModal = ({ isOpen, onClose, onAgree }: DisclaimerModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="glass-card w-full max-w-xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-display font-bold text-card-foreground">
                  Terms & Disclaimer
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors text-card-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4 text-card-foreground/80 text-sm leading-relaxed">
                <p>
                  <strong className="text-card-foreground">PLEASE READ CAREFULLY BEFORE PROCEEDING:</strong>
                </p>

                <p>
                  By submitting a request through the Freedom of Information (FOI) Portal of 
                  Valencia City, Bukidnon, you acknowledge and agree to the following terms and conditions:
                </p>

                <div className="space-y-3">
                  <div className="pl-4 border-l-2 border-accent">
                    <h4 className="font-semibold text-card-foreground mb-1">1. Purpose of FOI Requests</h4>
                    <p>
                      This portal is designed to facilitate access to public records and government 
                      information in accordance with Executive Order No. 2, s. 2016. Requests should 
                      be for legitimate purposes and in the public interest.
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-accent">
                    <h4 className="font-semibold text-card-foreground mb-1">2. Personal Information</h4>
                    <p>
                      The personal information you provide will be used solely for processing your 
                      request and communicating the results. Your data will be handled in accordance 
                      with the Data Privacy Act of 2012 (RA 10173).
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-accent">
                    <h4 className="font-semibold text-card-foreground mb-1">3. Response Time</h4>
                    <p>
                      The LGU shall respond to your request within fifteen (15) working days from 
                      receipt. Complex requests may require additional time, and you will be notified 
                      of any extensions.
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-accent">
                    <h4 className="font-semibold text-card-foreground mb-1">4. Exceptions</h4>
                    <p>
                      Certain information may be exempt from disclosure, including but not limited to: 
                      national security matters, personal information of third parties, privileged 
                      communications, and information that may endanger life or safety.
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-accent">
                    <h4 className="font-semibold text-card-foreground mb-1">5. Accuracy of Information</h4>
                    <p>
                      You certify that all information provided in your request is true and accurate 
                      to the best of your knowledge. Providing false information may result in the 
                      denial of your request.
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-accent">
                    <h4 className="font-semibold text-card-foreground mb-1">6. Fees</h4>
                    <p>
                      While filing an FOI request is free, reasonable fees may be charged for 
                      reproduction costs of requested documents.
                    </p>
                  </div>
                </div>

                <p className="pt-4 font-medium text-card-foreground">
                  By clicking "Agree & Continue," you confirm that you have read, understood, 
                  and agree to these terms and conditions.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-border text-card-foreground font-medium transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={onAgree}
                className="btn-gold"
              >
                Agree & Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DisclaimerModal;
