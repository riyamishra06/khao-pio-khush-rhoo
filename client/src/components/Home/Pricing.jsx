import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Annual",
      price: "365",
      period: "/year",
      features: [
        "Unlimited Tracking",
        "Detailed Reports",
        "Community Access",
        "Priority Support"
      ]
    },
    {
      name: "Lifetime",
      price: "5000",
      period: "/20 years",
      features: [
        "Unlimited Tracking",
        "Detailed Reports",
        "Community Access",
        "Priority Support",
        "Lifetime Access"
      ]
    }
  ];

  return (
    <section id="pricing" className="bg-green-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Pricing Plans</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="bg-green-800/50 backdrop-blur-sm rounded-xl p-8 border border-green-700/30 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <h3 className="text-xl font-bold text-white mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-green-200">{plan.period}</span>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold mb-6 transition-colors">Choose Plan</button>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-green-200">
                    <Check className="w-5 h-5 text-green-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">Try Demo</h3>
          <p className="text-green-200 mb-6">Explore FitTrack with limited features. No sign-up required.</p>
          <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">Try Demo</button>
        </div>
      </div>
    </section>
  );
};
export default Pricing;

