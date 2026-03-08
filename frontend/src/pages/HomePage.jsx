import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const nav = useNavigate();

  const features = [
    {
      title: "Sentiment Analysis",
      desc: "Automatically classify feedback as Positive, Negative or Neutral using advanced AI algorithms.",
      img: "/Sentiment.png",
    },
    {
      title: "Citizen Feedback",
      desc: "Citizens can easily submit their opinions securely and transparently.",
      img: "/feedback.png",
    },
    {
      title: "Admin Dashboard",
      desc: "Powerful analytics dashboard with insights, reports and recommendations.",
      img: "/Dashboard.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700 text-white relative overflow-hidden">

      {/* Background Blur */}
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30 bottom-0 right-0"></div>

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/10 sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold tracking-wide">
          Public<span className="text-pink-300">Pulse</span>
        </h1>

        <button
          onClick={() => nav("/login")}
          className="bg-white text-purple-700 px-6 py-2 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg"
        >
          Login
        </button>
      </div>

      {/* HERO */}
      <div className="text-center mt-24 px-6 relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Public Opinion <br />
          <span className="text-pink-300">Analysis Platform</span>
        </h1>

        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Analyze citizen feedback on government policies using AI-powered
          sentiment analysis and intelligent recommendations.
        </p>

        <button
          onClick={() => nav("/login")}
          className="mt-10 bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-110 hover:bg-pink-500 hover:text-white transition-all duration-300"
        >
          🚀 Get Started
        </button>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid md:grid-cols-3 gap-10 px-8 md:px-20 mt-28 pb-24 relative z-10">

        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl border border-white/20"
          >
            <img
              src={f.img}
              alt={f.title}
              className="w-full h-44 object-cover rounded-2xl mb-6"
            />

            <h3 className="text-2xl font-bold mb-3 text-pink-300">
              {f.title}
            </h3>

            <p className="opacity-90">
              {f.desc}
            </p>
          </motion.div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="text-center py-6 bg-black/20 backdrop-blur-md">
        <p className="opacity-80">
          © 2026 PublicPulse | Designed with ❤️
        </p>
      </div>

    </div>
  );
}