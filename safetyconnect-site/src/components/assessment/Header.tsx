import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background text-foreground px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm relative">
      <img src="/safetyconnect-logo.png" alt="SafetyConnect" className="h-5 sm:h-6 w-auto" />
      <button
        className="md:hidden p-1"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <a href="#" className="hover:underline">Home</a>
        <a href="https://www.safetyconnect.io/our-story" className="hover:underline">About Us</a>
        <a href="https://www.safetyconnect.io/contact-us" className="hover:underline">Contact Us</a>
        <button className="bg-primary-foreground text-primary px-5 py-2 rounded font-medium text-sm">
          Log In
        </button>
      </nav>
      {open && (
        <nav className="absolute top-full left-0 right-0 bg-background shadow-md border-t border-border flex flex-col items-center gap-4 py-4 text-sm z-50 md:hidden">
          <a href="#" className="hover:underline" onClick={() => setOpen(false)}>Home</a>
          <a href="https://www.safetyconnect.io/our-story" className="hover:underline" onClick={() => setOpen(false)}>About Us</a>
          <a href="https://www.safetyconnect.io/contact-us" className="hover:underline" onClick={() => setOpen(false)}>Contact Us</a>
          <button className="bg-primary-foreground text-primary px-5 py-2 rounded font-medium text-sm">
            Log In
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
