import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the Freedom of Information (FOI)?",
    answer: "FOI is a mechanism that allows citizens to access information held by the government, promoting transparency and accountability in governance.",
  },
  {
    question: "How long does it take to process my request?",
    answer: "Standard requests are processed within 15 working days. Complex requests may take longer, and you will be notified of any extensions.",
  },
  {
    question: "Is there a fee for filing an FOI request?",
    answer: "Filing an FOI request is free. However, reasonable fees may apply for reproduction costs of requested documents.",
  },
  {
    question: "What information can I request?",
    answer: "You can request any government records, documents, or information that is not classified or exempt under the law.",
  },
 
  {
    question: "Can my request be denied?",
    answer: "Yes, certain information is exempt from disclosure, including national security matters, personal data of third parties, and privileged communications.",
  },
];

const FAQButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="floating-btn"
        aria-label="Open FAQ"
      >
        <HelpCircle size={24} />
      </motion.button>

      {/* FAQ Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-primary">
                <div>
                  <h2 className="text-xl font-display font-bold text-primary-foreground">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-sm text-primary-foreground/70">
                    Find answers to common questions
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors text-primary-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FAQ List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-xl border border-border overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-card-foreground">
                          {faq.question}
                        </span>
                        <motion.div
                          animate={{ rotate: openIndex === index ? 180 : 0 }}
                          className="shrink-0"
                        >
                          <ChevronDown size={18} className="text-muted-foreground" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 text-sm text-card-foreground/70">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border bg-muted/30">
                <p className="text-sm text-card-foreground/60 text-center">
                  Still have questions?{" "}
                  <a href="#contact" className="text-accent font-medium hover:underline">
                    Contact us
                  </a>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FAQButton;
