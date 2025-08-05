"use client";

import { useState } from "react";
import { toast } from "@/components/toast";
import { authClient } from "@/utils/auth-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in both email and password.",
      });
      return;
    }

    await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard"
    }, {
      onSuccess() {
        // toast({
        //   title: "Login successful!",
        //   description: "Welcome back!",
        // });
      },
      onError(ctx) {
        toast({
          title: "Something went wrong.",
          description: ctx.error.message,
        })
      }
    })
  };

  return (
    <div className="flex flex-col p-8 rounded-3xl sm:border-zinc-900 sm:border w-full sm:w-[32rem] shadow-lg">
      <h1 className="text-3xl font-bold">meownel</h1>
      <p>a custom minecraft panel. meowwww mreowww</p>
      <form onSubmit={login} className="flex flex-col justify-evenly items-center mt-4 gap-2">
        <input
          type="email" 
          id="email"
          placeholder="Email" 
          className="p-2 rounded-md border border-zinc-800 text-white w-full focus:border-pink-500 outline-none duration-200" 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="p-2 rounded-md border border-zinc-800 text-white w-full focus:border-pink-500 outline-none duration-200"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="submit" 
          className="bg-pink-500 text-white p-2 rounded-md w-full hover:bg-pink-600 transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
