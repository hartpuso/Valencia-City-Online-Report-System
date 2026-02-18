import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AboutModal from "./AboutModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", action: () => setShowAbout(true) },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Logo />

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                item.href ? (
                  <a key={item.label} href={item.href} className="nav-link">
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="nav-link"
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block py-2 text-foreground hover:text-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action?.();
                        setIsOpen(false);
                      }}
                      className="block py-2 text-foreground hover:text-accent transition-colors w-full text-left"
                    >
                      {item.label}
                    </button>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
};

export default Navbar;

const Logo = () => {
  const location = useLocation();
  const onLanding = location.pathname === "/";

  // Prefer an actual logo file in /public (e.g. /logo.png).
  const logoSrc = "/logo.png";

  return (
    <div className="flex items-center gap-3">
      <Link to="/" className="flex items-center gap-3">
        {onLanding ? (
          <img
            src={logoSrc}
            alt="Valencia logo"
            className="w-25 h-20 object-contain"
          />
        ) : (
          <div className="w-10 h-10 bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">V</span>
          </div>
        )}

        <div className="hidden sm:block">
          <p className="font-display font-bold text-foreground text-sm md:text-base">Valencia City</p>
          <p className="text-xs text-muted-foreground">Online Report System</p>
        </div>
      </Link>
    </div>
  );
};
