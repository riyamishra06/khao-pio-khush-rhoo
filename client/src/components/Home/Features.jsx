import { BarChart3, FileText, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Tracking",
      description: "Easily log your meals, workouts, and daily activities to monitor your progress."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Reports",
      description: "Visualize your progress with detailed reports and analytics to identify trends and areas for improvement."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "MemberShip",
      description: "Unlock premium features like personalized plans, expert tips, and exclusive access by becoming a member."
    }
  ];

  return (
    <section id="features" className="bg-green-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
        <p className="text-green-200 mb-12 max-w-2xl">
          FitTrack offers a comprehensive suite of tools to help you stay on track and achieve your fitness goals.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-green-800/50 backdrop-blur-sm rounded-xl p-8 border border-green-700/30 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-green-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-green-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
