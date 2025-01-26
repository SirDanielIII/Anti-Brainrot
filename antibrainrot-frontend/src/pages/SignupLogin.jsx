import React, { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";

const SignupLogin = () => {
  const [isRegister, setIsRegister] = useState(true);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="flex items-center justify-center  bg-gray-50 ">
      <div className="mt-4 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-md text-center text-gray-600 mb-4">
          {isRegister
            ? "Join SkillSwap today and start connecting!"
            : "Log in to access your account."}
        </p>

        <div>{isRegister ? <Register /> : <Login />}</div>

        <div className="mt-4 text-center">
          <button
            onClick={toggleForm}
            className="text-blue-600 hover:underline transition duration-300"
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupLogin;
