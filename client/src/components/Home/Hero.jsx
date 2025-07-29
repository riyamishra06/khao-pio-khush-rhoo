import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-green-800 to-green-900 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(https://i.pinimg.com/736x/b0/5c/89/b05c89956ca735bc47683693c84267d2.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-green-700/50 to-green-600/30 rounded-3xl p-6 sm:p-8 md:p-12 text-center">
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6">
              Achieve <span className="text-yellow-400">Your Fitness Goals</span> with FitTrack
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 mb-6 sm:mb-8 max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
              Track your nutrition, workouts, and progress all in one place. Join thousands of users transforming their fitness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;