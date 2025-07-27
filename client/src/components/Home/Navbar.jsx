import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const scrollToSection = (id) => {
    if (currentPath !== '/') {
      navigate(`/#${id}`);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-green-900 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="FitTrack Logo" className="h-12 w-auto" />
          {/* <span className="font-bold text-xl">FitTrack</span> */}
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => navigate('/')}
            className={`hover:text-yellow-400 transition-colors ${currentPath === '/' ? 'text-yellow-400' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-yellow-400 transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-yellow-400 transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={() => navigate('/support')}
            className={`hover:text-yellow-400 transition-colors ${currentPath === '/support' ? 'text-yellow-400' : ''}`}
          >
            Support
          </button>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-green-500 hover:bg-green-400 px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="hover:text-yellow-400 transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
