import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===== NAVBAR ===== */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-green-600">
          FinGrow
        </h1>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-gray-700 hover:text-green-600">
            Log in
          </Link>

          <Link
            to="/register"
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          >
            Get started
          </Link>
        </div>
      </nav>


      {/* ===== HERO SECTION ===== */}
      <div className="flex flex-col md:flex-row items-center justify-between px-10 md:px-24 py-20">

        {/* LEFT CONTENT */}
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Grow your money
            <br />
            the smart way
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Take control with all-in-one investment,
            expense tracking, retirement planning
            and more.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 px-8 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
          >
            Get started
          </Link>
        </div>


        {/* RIGHT PHONE IMAGE */}
        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center">
          <img
            src="/mobile-mockup.png"
            alt="Mobile App"
            className="w-72 md:w-96 drop-shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default Home;
