"use client";

import type { NextPage } from "next";
import { FaArrowUp, FaGithub, FaYoutube, FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";

function smoothScrollTo(targetY: number, duration = 1500) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const percent = Math.min(progress / duration, 1);

    // Ease-in-out function
    const easeInOut =
      percent < 0.5
        ? 2 * percent * percent
        : -1 + (4 - 2 * percent) * percent;

    window.scrollTo(0, startY + distance * easeInOut);

    if (progress < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const Home: NextPage = () => {
  const [showButton, setShowButton] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroHeight = document.getElementById("topMain")?.offsetHeight || 600;

      if (currentY > heroHeight && currentY < lastScrollY) {
        // past hero and scrolling up
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    const topMain = document.getElementById("topMain");
    if (topMain) {
      const targetY = topMain.offsetTop;
      smoothScrollTo(targetY, 1000);
    }
  };

  const scrollToAbout = () => {
    const topMain = document.getElementById("about");
    if (topMain) {
      const targetY = topMain.offsetTop;
      smoothScrollTo(targetY, 1000);
    }
  };

  const scrollToProject = () => {
    const topMain = document.getElementById("projects");
    if (topMain) {
      const targetY = topMain.offsetTop;
      smoothScrollTo(targetY, 1000);
    }
  };

  const scrollToContact = () => {
    const topMain = document.getElementById("contact");
    if (topMain) {
      const targetY = topMain.offsetTop;
      smoothScrollTo(targetY, 1000);
    }
  };

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track window size safely
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize(); // set initial size
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Show back-to-top button after scrolling down a bit (client-side only)
  useEffect(() => {
    const handleShowButton = () => {
      setShowButton(window.scrollY > 100);
    };

    // Only attach in browser
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleShowButton);
      // initialize
      handleShowButton();
      return () => window.removeEventListener("scroll", handleShowButton);
    }
  }, []);

  return (
    <main className="relative bg-black text-gray-100 font-sans cursor-default overflow-hidden">
      <header
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-auto
              bg-white/10 backdrop-blur-md border border-white/10 shadow-md 
              transition-transform duration-300 z-50 mt-6
              rounded-xl px-4 py-2
              ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <nav className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 text-white text-sm sm:text-md md:text-lg font-medium tracking-wide">
          <a onClick={scrollToAbout} className="hover:text-gray-300">About</a>
          <a onClick={scrollToProject} className="hover:text-gray-300">Projects</a>
          <a onClick={scrollToContact} className="hover:text-gray-300">Contact</a>
        </nav>
      </header>

      {/* Animated Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Cyan */}
        <div
          className="absolute w-96 h-96 bg-linear-to-br from-cyan-500 to-transparent rounded-full blur-3xl opacity-20"
          style={{
            top: "10%",
            left: "10%",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.05}px, ${(mousePosition.y - windowSize.height / 2) * 0.05}px)`
          }}
        ></div>
        {/* Large Yellow */}
        <div
          className="absolute w-80 h-80 bg-linear-to-br from-yellow-400 to-transparent rounded-full blur-3xl opacity-20"
          style={{
            top: "50%",
            right: "5%",
            animationDelay: "1s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.08}px, ${(mousePosition.y - windowSize.height / 2) * 0.08}px)`
          }}
        ></div>
        {/* Large Blue */}
        <div
          className="absolute w-96 h-96 bg-linear-to-br from-blue-500 to-transparent rounded-full blur-3xl opacity-20"
          style={{
            bottom: "10%",
            left: "30%",
            animationDelay: "2s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.06}px, ${(mousePosition.y - windowSize.height / 2) * 0.06}px)`
          }}
        ></div>

        {/* Medium Purple */}
        <div
          className="absolute w-72 h-72 bg-linear-to-br from-purple-500 to-transparent rounded-full blur-2xl opacity-15"
          style={{
            top: "25%",
            right: "20%",
            animationDelay: "0.5s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.07}px, ${(mousePosition.y - windowSize.height / 2) * 0.07}px)`
          }}
        ></div>
        {/* Medium Pink */}
        <div
          className="absolute w-64 h-64 bg-linear-to-br from-pink-500 to-transparent rounded-full blur-2xl opacity-15"
          style={{
            bottom: "25%",
            right: "25%",
            animationDelay: "1.5s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.065}px, ${(mousePosition.y - windowSize.height / 2) * 0.065}px)`
          }}
        ></div>
        {/* Medium Green */}
        <div
          className="absolute w-60 h-60 bg-linear-to-br from-green-500 to-transparent rounded-full blur-2xl opacity-15"
          style={{
            top: "60%",
            left: "15%",
            animationDelay: "0.3s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.075}px, ${(mousePosition.y - windowSize.height / 2) * 0.075}px)`
          }}
        ></div>

        {/* Small Orange */}
        <div
          className="absolute w-48 h-48 bg-linear-to-br from-orange-500 to-transparent rounded-full blur-xl opacity-20"
          style={{
            top: "35%",
            left: "65%",
            animationDelay: "1.2s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.09}px, ${(mousePosition.y - windowSize.height / 2) * 0.09}px)`
          }}
        ></div>
        {/* Small Red */}
        <div
          className="absolute w-40 h-40 bg-linear-to-br from-red-500 to-transparent rounded-full blur-xl opacity-20"
          style={{
            bottom: "20%",
            right: "10%",
            animationDelay: "0.8s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.095}px, ${(mousePosition.y - windowSize.height / 2) * 0.095}px)`
          }}
        ></div>
        {/* Small Indigo */}
        <div
          className="absolute w-56 h-56 bg-linear-to-br from-indigo-500 to-transparent rounded-full blur-xl opacity-15"
          style={{
            top: "70%",
            right: "35%",
            animationDelay: "0.2s",
              transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.085}px, ${(mousePosition.y - windowSize.height / 2) * 0.085}px)`
          }}
        ></div>
        {/* Small Teal */}
        <div
          className="absolute w-44 h-44 bg-linear-to-br from-teal-500 to-transparent rounded-full blur-xl opacity-15"
          style={{
            top: "15%",
            right: "40%",
            animationDelay: "1.7s",
            transform: `translate(${(mousePosition.x - windowSize.width / 2) * 0.095}px, ${(mousePosition.y - windowSize.height / 2) * 0.095}px)`
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section
        id="topMain"
        className="relative h-screen flex flex-col justify-center items-center bg-transparent text-white px-4 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Hi, I'm Sean.</h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl">
          Front-End Developer | Mobile App Developer
        </p>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 bg-black text-gray-200 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">About Me</h2>
        <p className="max-w-xl sm:max-w-2xl text-sm sm:text-base md:text-lg">
          I'm a developer passionate about building robust authentication flows,
          admin dashboards, and polished user experiences.
        </p>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen flex flex-col justify-center items-center bg-black text-gray-200 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
          <div className="p-4 sm:p-6 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Portfolio Website</h3>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              A sleek one-page portfolio built with Next.js & Tailwind.
            </p>
          </div>
          <div className="p-4 sm:p-6 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Firebase Auth Flow</h3>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              Robust authentication with modular config and error handling.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 bg-black text-gray-200 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Contact</h2>
        <p className="text-sm sm:text-base md:text-lg">Let's build something together!</p>
        <a
          href="mailto:your.email@example.com"
          className="mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 text-sm sm:text-base"
        >
          Email Me
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-10 sm:py-20 px-4 sm:px-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} Sean. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6 text-lg sm:text-xl">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaGithub />
            </a>
            <a href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaFacebook />
            </a>
            <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaYoutube />
            </a>
          </div>
        </div>
      </footer>

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 
               bg-white/10 backdrop-blur-md 
               text-white w-12 h-12 flex items-center justify-center 
               rounded-full shadow-lg 
               border border-white/10 
               hover:bg-white/30 hover:scale-105 transition
               hover:shadow-xl hover:shadow-indigo-400/20"
          aria-label="Back to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </main>
  );
};

export default Home;
