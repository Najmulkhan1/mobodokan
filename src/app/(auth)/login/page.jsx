"use client";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
export default function Login() {

  const { register, handleSubmit } = useForm();
  const { loginUser, googleLogin } = useAuth();

  const handleFormSubmit = (data) => {
    console.log(data);
    loginUser(data.email, data.password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      })
  };

  const handleGoogleLogin = () => {
    console.log('google login');
    
    googleLogin()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error logging in with Google:', error);
      })
  };

  return (
    <div className="bg-base-100 flex justify-center pt-30">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="mt-6">
          <h3 className="text-center text-4xl font-semibold px-3">
            Login to your account
          </h3>
          <p className="text-center text-sm text-gray-500">
            Enter your email below to login to your account
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <fieldset className="fieldset space-y-2">
              {/* email */}
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" {...register("email")} />
              </div>

              {/* password */}
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  {...register("password")}
                />
              </div>

              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>

              <button type="submit" className="btn btn-neutral mt-4">Login</button>
            </fieldset>
          </form>

          <button onClick={handleGoogleLogin} className="btn mt-5 bg-base-100 border-[#e5e5e5]">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>

          <h2>
            Don&apos;t have an account? <Link className="text-blue-500 underline" href="/register">Register</Link>
          </h2>
        </div>
      </div>
    </div>
  );
}
