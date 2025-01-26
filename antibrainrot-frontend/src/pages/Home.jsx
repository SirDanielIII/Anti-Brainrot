import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faBrain,
  faChartLine,
  faQuoteLeft,
  faQuoteRight,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
// import logo from "../assets/images/AntiBrainRot.png"; // Update this path

const Home = () => {
  return (
    <div className="container mx-auto py-20 px-5">
      <header className="mb-20 text-center">
        {/* <img
          src={logo}
          alt="AntiBrainRot Logo"
          className="h-20 w-auto mx-auto mb-6"
        /> */}
        <h1 className="text-6xl font-bold mb-6 text-gray-800">
          Welcome to AntiBrainRot
        </h1>
        <p className="text-2xl text-gray-600 leading-relaxed">
          Stay focused, track your ADHD levels, and boost your productivity.
        </p>
      </header>

      <section className="mb-20">
        <h2 className="text-4xl font-semibold text-gray-800 mb-10 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="feature-item text-center">
            <FontAwesomeIcon
              icon={faCamera}
              size="3x"
              className="text-blue-500 mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Webcam Monitoring
            </h3>
            <p className="text-gray-600">
              Uses your webcam to ensure you're staying focused on your tasks.
            </p>
          </div>
          <div className="feature-item text-center">
            <FontAwesomeIcon
              icon={faBrain}
              size="3x"
              className="text-blue-500 mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ADHD Tracking
            </h3>
            <p className="text-gray-600">
              Monitors and analyzes your focus levels to help manage ADHD
              symptoms.
            </p>
          </div>
          <div className="feature-item text-center">
            <FontAwesomeIcon
              icon={faChartLine}
              size="3x"
              className="text-blue-500 mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Productivity Insights
            </h3>
            <p className="text-gray-600">
              Gain valuable insights into your work patterns and productivity
              levels.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-4xl font-semibold text-gray-800 mb-10 text-center">
          What Our Users Say
        </h2>
        <div className="space-y-10 text-center">
          <FontAwesomeIcon
            icon={faQuoteLeft}
            size="2x"
            className="text-gray-500 mb-4"
          />
          <blockquote className="testimonial text-center text-xl text-gray-600 italic">
            "AntiBrainRot has significantly improved my focus and productivity.
            I can now manage my ADHD symptoms better!"
          </blockquote>
          <p className="text-center text-gray-800">- Sarah K.</p>
          <FontAwesomeIcon
            icon={faQuoteRight}
            size="2x"
            className="text-gray-500 mb-4 mt-4"
          />
          <blockquote className="testimonial text-center text-xl text-gray-600 italic mt-6">
            "This app has been a game-changer for my work-from-home routine. I'm
            more focused and productive than ever!"
          </blockquote>
          <p className="text-center text-gray-800">- Mike T.</p>
        </div>
      </section>

      <section className="text-center mb-20">
        <h2 className="text-4xl font-semibold text-gray-800 mb-10">
          Start Boosting Your Productivity Today
        </h2>
        {/* <p className="text-xl text-gray-600 mb-6">
          Join the AntiBrainRot community and take control of your focus.
        </p>
        <button
          onClick={() => (window.location.href = "/signup-login")}
          className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition duration-300 mb-10"
        >
          <FontAwesomeIcon icon={faUserPlus} size="lg" className="mr-2" />
          Sign Up Now
        </button> */}
      </section>
    </div>
  );
};

export default Home;
