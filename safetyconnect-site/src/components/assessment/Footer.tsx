import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-footer text-footer-foreground mt-8 sm:mt-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
      <div className="space-y-4">
        <img src="/safetyconnect-logo-white.png" alt="SafetyConnect" className="h-6 sm:h-8 w-auto" />
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Lewes, Delaware<br />16192 Coastal Highway Lewes De 19958, USA</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Hyderabad, India<br />We Work, Financial District, Gachibowli, Hyderabad 500032, India</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-xs sm:text-sm tracking-wider mb-3 sm:mb-4">QUICK LINKS</h3>
        <ul className="space-y-2 text-xs sm:text-sm">
          <li><a href="https://www.safetyconnect.io/our-story" className="hover:underline">About Company</a></li>
          <li><a href="https://iotrl.freshteam.com/jobs" className="hover:underline">Hiring</a></li>
          <li><a href="https://www.safetyconnect.io/pricing-plans" className="hover:underline">Pricing & Plans</a></li>
          <li><a href="https://app.safetyconnect.io/?_gl=1*wgkfpl*_gcl_au*MTA4MjUzNDU5NC4xNzc0NTAxMzY1" className="hover:underline">Driver Safety Sign In</a></li>
          <li><a href="https://app.safetyconnect.io/process-safety" className="hover:underline">Process Safety Sign In</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-xs sm:text-sm tracking-wider mb-3 sm:mb-4">NEED HELP</h3>
        <ul className="space-y-2 text-xs sm:text-sm">
          <li><a href="https://www.safetyconnect.io/terms-and-condition" className="hover:underline">Terms & Conditions</a></li>
          <li><a href="https://www.safetyconnect.io/privacy-and-policy" className="hover:underline">Privacy Policy</a></li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><span>info@iotrl.io</span></li>
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><span>+919100030072</span></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-xs sm:text-sm tracking-wider mb-3 sm:mb-4">SUBSCRIBE TO OUR NEWSLETTER</h3>
        <div className="flex">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-3 py-2 text-sm rounded-l bg-background text-foreground border-none focus:outline-none"
          />
          <button className="bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded-r">
            Subscribe
          </button>
        </div>
      </div>
    </div>
    <div className="text-center py-4 text-xs sm:text-sm border-t border-white/20">
      © 2026 SafetyConnect. All rights reserved.
    </div>
  </footer>
);

export default Footer;
