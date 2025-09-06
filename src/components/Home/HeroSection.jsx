"use client";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full h-auto min-h-screen overflow-hidden flex items-center justify-center bg-[var(--color-secondary)] py-12">
      {/* Background Blurs */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 rounded-full bg-[var(--color-primary)]/30 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-[-150px] right-[-50px] w-96 h-96 rounded-full bg-[var(--color-accent)]/40 blur-3xl animate-pulse-slower"></div>
      <div className="absolute top-[20%] right-[10%] w-60 h-60 rounded-full bg-[var(--color-primary)]/20 blur-2xl animate-bounce-slow"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full text-center lg:text-left mt-50 md:mt-0"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 pb-3 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
            }}
          >
            MealManagerPro
          </h1>
          <p className="text-lg md:text-xl mb-8 text-[var(--color-neutral)]">
            Smart meal planning & tracking made simple. Eat healthier, save time, and manage meals like a pro!
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-[var(--color-primary)]/90 backdrop-blur-sm text-white font-semibold shadow-lg hover:bg-[var(--color-primary)] transition-all"
            >
              Get Started
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl border-2 border-[var(--color-accent)] text-[var(--color-accent)] backdrop-blur-sm font-semibold shadow-lg hover:bg-[var(--color-accent)]/20 transition-all"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full relative flex justify-center items-center mt-50 md:mt-0"
        >
          <div className="absolute top-0 left-10 w-48 h-48 bg-[var(--color-primary)]/40 rounded-2xl shadow-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-36 h-36 bg-[var(--color-accent)]/30 rounded-2xl shadow-xl animate-float-slow"></div>

          <motion.img
            src="https://images.unsplash.com/photo-1743674453123-93356ade2891?q=80&w=434&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Meal 3"
            className="absolute w-44 h-44 rounded-2xl shadow-2xl z-0 bottom-10 left-16"
            animate={{ y: [0, -25, 0], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          />
          <motion.img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Meal 1"
            className="absolute w-40 h-40 rounded-2xl shadow-2xl z-10"
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.img
            src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Meal 2"
            className="absolute w-36 h-36 rounded-2xl shadow-2xl z-20 top-16 right-12"
            animate={{ y: [0, -15, 0], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
