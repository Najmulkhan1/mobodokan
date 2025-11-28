import { Cpu, ShieldCheck, BatteryCharging, Smartphone, Wrench, Zap } from 'lucide-react'

export default function FeaturesMobodokan() {
  const features = [
    {
      title: 'Expert Device Reviews',
      desc: 'Honest, detailed reviews of mobile laptops, tablets, and phones tested by professionals.',
      icon: <Cpu size={24} className="text-indigo-400" />
    },
    {
      title: 'Genuine Parts Sourcing',
      desc: 'Verified parts and components for top mobile laptop brands with trusted quality.',
      icon: <Smartphone size={24} className="text-indigo-400" />
    },
    {
      title: 'Repair Guides & Tutorials',
      desc: 'Step-by-step repair instructions, teardown videos, and maintenance tips.',
      icon: <Wrench size={24} className="text-indigo-400" />
    },
    {
      title: 'Fast Performance Tips',
      desc: 'Practical optimization tricks to boost performance, battery life, and longevity.',
      icon: <Zap size={24} className="text-indigo-400" />
    },
    {
      title: 'Battery Health Support',
      desc: 'Guidance on improving battery cycles, charging efficiency, and device care.',
      icon: <BatteryCharging size={24} className="text-indigo-400" />
    },
    {
      title: 'Secure & Verified Info',
      desc: 'All technical info is checked by certified technicians for accuracy and safety.',
      icon: <ShieldCheck size={24} className="text-indigo-400" />
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Why Tech Enthusiasts Choose Mobodokan
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Your reliable source for everything related to modern mobile computing and genuine parts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative overflow-hidden p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border-t-4 border-indigo-500 dark:border-indigo-600 shadow-lg transition-all duration-500 hover:shadow-2xl hover:bg-white dark:hover:bg-slate-700/50"
          >
            {/* The Swoop / Diagonal Element for Unique Design */}
            <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500 dark:bg-indigo-600 transform rotate-45 translate-x-1/2 -translate-y-1/2 opacity-20 transition-all duration-500 group-hover:opacity-40"></div>

            <div className="flex items-center space-x-4 mb-4">
              {/* Icon Container - Simple and Clean */}
              <div className="flex-shrink-0 p-3 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 transition-colors duration-300 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-600/20">
                {f.icon}
              </div>
              
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {f.title}
              </h3>
            </div>
            
            <p className="text-base text-slate-600 dark:text-slate-300">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}