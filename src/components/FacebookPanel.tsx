import { motion } from "framer-motion";
import { Facebook, ExternalLink } from "lucide-react";
import { useEffect } from "react";

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

const FacebookPanel = () => {
  useEffect(() => {
    // Load Facebook SDK
    const loadFacebookSDK = () => {
      if (document.getElementById("facebook-jssdk")) {
        // SDK already loaded, just re-parse
        if (window.FB) {
          window.FB.XFBML.parse();
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877F2]/10 text-[#1877F2] text-sm font-medium mb-4">
            <Facebook size={16} />
            <span>Social Updates</span>
          </div>
          <h2 className="section-title">Latest Updates from LGU</h2>
          <p className="text-card-foreground/70 max-w-2xl mx-auto">
            Stay connected with the latest news and announcements from Valencia City Local Government Unit.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Facebook Page Plugin - Live Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-muted/30 rounded-2xl p-4 md:p-6 border border-border overflow-hidden"
          >
            <div className="flex flex-col items-center">
              {/* Facebook Page Plugin */}
              <div 
                className="fb-page w-full" 
                data-href="https://www.facebook.com/LGUCityofValencia"
                data-tabs="timeline"
                data-width="500"
                data-height="600"
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
              >
                <blockquote 
                  cite="https://www.facebook.com/LGUCityofValencia" 
                  className="fb-xfbml-parse-ignore"
                >
                  <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
                    <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center mb-4 animate-pulse">
                      <Facebook className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-card-foreground/60 text-center">
                      Loading Facebook updates...
                    </p>
                  </div>
                </blockquote>
              </div>
              
              {/* Fallback link */}
              <a
                href="https://www.facebook.com/LGUCityofValencia"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm font-medium hover:bg-[#1877F2]/90 transition-colors"
              >
                Visit Page on Facebook
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

          {/* Quick Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ruby"></span>
                Stay Informed
              </h3>
              <p className="text-sm text-card-foreground/70 leading-relaxed">
                Follow our official Facebook page for real-time updates on city programs, 
                events, public advisories, and important announcements from the 
                Local Government Unit of Valencia City.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Community Engagement
              </h3>
              <p className="text-sm text-card-foreground/70 leading-relaxed">
                Join the conversation! Like, comment, and share posts to stay 
                connected with your local community and government initiatives.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              <h3 className="font-display font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest"></span>
                Transparency Commitment
              </h3>
              <p className="text-sm text-card-foreground/70 leading-relaxed">
                As part of our commitment to open governance, we regularly post 
                updates about city projects, budget allocations, and public services.
              </p>
            </div>

            <a
              href="https://www.facebook.com/LGUCityofValencia"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  <span className="font-medium text-card-foreground">
                    @LGUCityofValencia
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-card-foreground/50 group-hover:text-[#1877F2] transition-colors" />
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FacebookPanel;
