import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Users, FileText } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const features = [
    {
      icon: Shield,
      title: "Transparency",
      description: "Promoting open governance and accountability in local government operations.",
    },
    {
      icon: Users,
      title: "Citizen Empowerment",
      description: "Enabling citizens to participate in governance through access to information.",
    },
    {
      icon: FileText,
      title: "Easy Access",
      description: "Streamlined process for requesting and receiving government documents.",
    },
  ];

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
            className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-card-foreground">
                  Why This Exists
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-card-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <p className="text-card-foreground/80 leading-relaxed">
                  The Freedom of Information (FOI) Portal of Valencia City, Bukidnon was established 
                  in accordance with Executive Order No. 2, s. 2016, which mandates full public 
                  disclosure and transparency in government transactions.
                </p>

                <p className="text-card-foreground/80 leading-relaxed">
                  This portal serves as your gateway to access government records, documents, 
                  and information held by the Local Government Unit of Valencia City. We believe 
                  that an informed citizenry is essential for a thriving democracy.
                </p>

                {/* Features */}
                <div className="grid gap-4 mt-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-forest/5"
                    >
                      <div className="p-2 rounded-lg bg-accent/20">
                        <feature.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
                        <p className="text-sm text-card-foreground/70">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-card-foreground/60 italic">
                    "The essence of Government is power; and power, lodged as it must be in human hands, 
                    will ever be liable to abuse." — James Madison
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={onClose}
                  className="btn-gold"
                >
                  Got It
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
