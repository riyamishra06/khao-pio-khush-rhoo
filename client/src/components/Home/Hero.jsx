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
    <div className="bg-gradient-to-br from-green-800 to-green-900 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-green-700/50 to-green-600/30 backdrop-blur-sm rounded-3xl p-12 text-center">
          <div className="relative mb-8">
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Achieve <span className="text-yellow-400">Your Fitness Goals</span> with FitTrack
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Track your nutrition, workouts, and progress all in one place. Join thousands of users transforming their fitness journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="bg-green-700 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="bg-green-700 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
