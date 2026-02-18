import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onSubmitClick: () => void;
}

const HeroSection = ({ onSubmitClick }: HeroSectionProps) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20"
      style={{ background: "var(--hero-gradient)" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6"
            >
              <FileText size={16} />
              <span>Valencia City, Bukidnon</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Valencia City {" "}
              <span className="text-accent">Online Report System</span>{" "}
              
            </h1>

            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
              An accessible, centralized, and efficient online reporting system that enables timely submission, routing, monitoring, and response to citizens concerns and feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmitClick}
                className="btn-gold inline-flex items-center justify-center gap-2 animate-pulse-glow"
              >
                Submit a Request
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>

          {/* Illustration removed per request */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
