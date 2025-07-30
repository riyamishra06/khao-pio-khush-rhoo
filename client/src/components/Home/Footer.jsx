import { Dumbbell } from 'lucide-react';
import logo from '../../assets/logo.png'; // ✅ Adjust path based on your folder

const Footer = () => {
  return (
    <footer className="bg-green-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* LOGO SECTION */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="FitTrack Logo" className="h-10 w-auto" /> {/* ✅ Logo instead of text */}
            </div>
            <p className="text-green-300">Your comprehensive fitness tracking solution.</p>
          </div>

          {/* COMPANY LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-green-300">
              <li><button className="hover:text-white transition-colors">About</button></li>
              <li><button className="hover:text-white transition-colors">Careers</button></li>
              <li><button className="hover:text-white transition-colors">Blog</button></li>
            </ul>
          </div>

          {/* SUPPORT LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-green-300">
              <li><button className="hover:text-white transition-colors">Contact</button></li>
              <li><button className="hover:text-white transition-colors">Help Center</button></li>
              <li><button className="hover:text-white transition-colors">Community</button></li>
            </ul>
          </div>

          {/* LEGAL LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-green-300">
              <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT SECTION */}
        <div className="border-t border-green-800 pt-8 text-center">
          <p className="text-green-400">© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
