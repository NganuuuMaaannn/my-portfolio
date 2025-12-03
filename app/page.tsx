"use client";

import type { NextPage } from "next";
import { FaArrowUp, FaGithub, FaYoutube, FaFacebook, FaLinkedin } from "react-icons/fa";
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

  const scrollToTop = () => {
    const topMain = document.getElementById("topMain");
    if (topMain) {
      const targetY = topMain.offsetTop;
      smoothScrollTo(targetY, 1000);
    }
  };

  // Show button only after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-gray-50 text-gray-900 font-sans cursor-default">
      {/* Hero Section */}
      <section
        id="topMain"
        className="h-screen flex flex-col justify-center items-center bg-linear-to-b from-blue-500 to-indigo-600 text-white"
      >
        <h1 className="text-5xl font-bold">Hi, I'm Sean.</h1>
        <p className="mt-4 text-xl">
          Front-End Developer | Mobile App Developer
        </p>
      </section>

      {/* About Section */}
      <section className="h-screen flex flex-col justify-center items-center px-8">
        <h2 className="text-4xl font-bold mb-4">About Me</h2>
        <p className="max-w-2xl text-center text-lg">
          I'm a developer passionate about building robust authentication flows,
          admin dashboards, and polished user experiences.
        </p>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="h-screen flex flex-col justify-center items-center bg-gray-100 px-8"
      >
        <h2 className="text-4xl font-bold mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold">Portfolio Website</h3>
            <p className="mt-2 text-gray-600">
              A sleek one-page portfolio built with Next.js & Tailwind.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold">Firebase Auth Flow</h3>
            <p className="mt-2 text-gray-600">
              Robust authentication with modular config and error handling.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="h-screen flex flex-col justify-center items-center px-8 bg-indigo-50"
      >
        <h2 className="text-4xl font-bold mb-4">Contact</h2>
        <p className="text-lg">Let's build something together!</p>
        <a
          href="mailto:your.email@example.com"
          className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Email Me
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-20 px-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Sean. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-xl"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            {/* <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-xl"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a> */}
            <a
              href="https://facebook.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-xl"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://youtube.com/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-xl"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow hover:bg-indigo-700"
          aria-label="Back to top"
        >
          <FaArrowUp size={20} className="transition hover:animate-bounce" />
        </button>
      )}
    </main>
  );
};

export default Home;
