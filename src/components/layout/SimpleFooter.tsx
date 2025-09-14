import { Instagram, Mail, Phone } from "lucide-react";

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-2">The 90 Minute Drip</h3>
            <div className="flex items-center gap-2 mb-1">
              <Phone size={16} />
              <a href="tel:+918139016845" className="hover:underline">+91 81390 16845</a>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Mail size={16} />
              <a href="mailto:the90minutedrip@gmail.com" className="hover:underline">the90minutedrip@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <Instagram size={16} />
              <a href="https://instagram.com/the90minutedrip" target="_blank" rel="noopener noreferrer" className="hover:underline">@the90minutedrip</a>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {currentYear} The 90 Minute Drip. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;