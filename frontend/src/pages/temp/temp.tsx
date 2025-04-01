"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@hooks/use-auth";
import { Alert, AlertDescription } from "@components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/path-to-your/theme-provider"; // Update this path

export default function TempPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect to the page they were trying to access
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <form
        className="flex flex-col gap-3 w-full max-w-md rounded-2xl shadow-lg dark:bg-gray-900 bg-white p-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-1.5 mb-2">
          <h3 className="text-2xl font-bold dark:text-white">
            Login to Taktix
          </h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-2 dark:bg-red-900/20 dark:border-red-800 dark:text-white rounded-lg"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col">
          <label className="mb-1 font-semibold dark:text-white text-gray-800">
            Email
          </label>
          <div className="flex items-center border dark:border-gray-700 border-gray-300 rounded-lg h-12 px-3 dark:bg-gray-800 bg-gray-50 focus-within:border-blue-500 transition-colors">
            <svg
              className="w-5 h-5 dark:text-gray-400 text-gray-500"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <g id="Layer_3" data-name="Layer 3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input
              type="email"
              className="ml-2 bg-transparent border-none outline-none w-full h-full dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-col mt-1">
          <div className="flex items-center justify-between">
            <label className="font-semibold dark:text-white text-gray-800">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center border dark:border-gray-700 border-gray-300 rounded-lg h-12 px-3 dark:bg-gray-800 bg-gray-50 focus-within:border-blue-500 transition-colors mt-1">
            <svg
              className="w-5 h-5 dark:text-gray-400 text-gray-500"
              viewBox="-64 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
            </svg>
            <input
              type="password"
              className="ml-2 bg-transparent border-none outline-none w-full h-full dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="remember"
            className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 dark:border-gray-700 border-gray-300 dark:bg-gray-800 bg-gray-100"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label
            htmlFor="remember"
            className="text-sm dark:text-white text-gray-800"
          >
            Remember me
          </label>
        </div>

        <button
          className="mt-5 mb-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg w-full transition-colors duration-200 ease-in-out disabled:bg-blue-800 disabled:opacity-70"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-sm dark:text-white text-gray-800">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t dark:border-gray-700 border-gray-300 w-full absolute"></div>
          <span className="relative dark:bg-gray-900 bg-white px-2 text-sm dark:text-white text-gray-600">
            Or continue with
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-1/2 py-3 px-4 border dark:border-gray-700 border-gray-300 rounded-lg dark:bg-gray-800 bg-white dark:text-white text-gray-800 hover:border-blue-500 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FBBB00"
                d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
                c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
                C103.821,274.792,107.225,292.797,113.47,309.408z"
              ></path>
              <path
                fill="#518EF8"
                d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
                c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
                c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
              ></path>
              <path
                fill="#28B446"
                d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
                c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
                c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
              ></path>
              <path
                fill="#F14336"
                d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
                c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
                C318.115,0,375.068,22.126,419.404,58.936z"
              ></path>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-1/2 py-3 px-4 border dark:border-gray-700 border-gray-300 rounded-lg dark:bg-gray-800 bg-white dark:text-white text-gray-800 hover:border-blue-500 transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 22.773 22.773"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <g>
                <g>
                  <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"></path>
                  <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"></path>
                </g>
              </g>
            </svg>
            Apple
          </button>
        </div>
      </form>
    </div>
  );
}
