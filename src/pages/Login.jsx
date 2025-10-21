import React, { useState, useContext } from "react";
import { Mail, Lock, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { loginMutation } = useContext(AuthContext);
  

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          setSuccessMessage("Login successful!");
          setTimeout(() => {
            window.location.href = "https://cezugwu.github.io/zentro/";
          }, 2000);
        },
        onError: () => {
          setErrorMessage("Invalid username or password!");
          setTimeout(() => setErrorMessage(""), 2500);
        },
      }
    );
  };

  return (
    <div className="min-h-screen h-screen w-full bg-black/40 backdrop-blur-sm overflow-y-auto flex justify-center items-start py-10 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg animate-fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 
                focus:ring-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                placeholder="Enter your username" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 
                focus:ring-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg 
            shadow-md hover:shadow-lg transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-6">
          Don't have an account?{" "}
          <a
            href="#/register"
            className="text-blue-600 font-medium hover:underline transition-all"
          >
            Register
          </a>
        </p>
      </div>
    </div> 
  );
};

export default Login;
