import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">V</span>
              </div>
              <div>
                <p className="font-display font-bold text-primary-foreground">Valencia City</p>
                <p className="text-xs text-primary-foreground/60">Online Report System</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Promoting transparency and open governance through the Freedom of Information Portal 
              of Valencia City, Bukidnon.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About FOI", "Submit Request", "FAQs"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin size={16} className="shrink-0 mt-0.5 text-accent" />
                <span>City Hall, Valencia City, Bukidnon, Philippines</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone size={16} className="shrink-0 text-accent" />
                <span>(088) 222-1234</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail size={16} className="shrink-0 text-accent" />
                <span>foi@valenciacity.gov.ph</span>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="font-display font-semibold text-primary-foreground mb-4">Office Hours</h4>
            <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
              <Clock size={16} className="shrink-0 mt-0.5 text-accent" />
              <div>
                <p>Monday - Friday</p>
                <p className="font-medium text-primary-foreground">8:00 AM - 5:00 PM</p>
                <p className="mt-2 text-xs text-primary-foreground/50">
                  Closed on weekends and holidays
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Valencia City LGU. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/40">
            <span className="w-2 h-2 rounded-full bg-ruby animate-pulse"></span>
            <span>In compliance with Executive Order No. 2, s. 2016</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
