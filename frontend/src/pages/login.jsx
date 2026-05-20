import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    console.log({ username, password });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-3xl p-8 shadow-2xl">

        <div className="flex flex-col items-center mb-8">

          <div className="bg-blue-600 p-4 rounded-full mb-4 text-white shadow-lg shadow-blue-900/30">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 3v5c0 4.97-3.33 9.12-7 10-3.67-.88-7-5.03-7-10V6l7-3z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.75h.01" />
            </svg>
          </div>

          <h1 className="text-white text-3xl font-bold">
            TwinTrust
          </h1>

          <p className="text-slate-400 mt-2 text-center">
            AI-Driven Behavioral Authentication
          </p>

        </div>


        <form className="space-y-5" onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-800
            text-white
            border
            border-slate-700
            focus:outline-none
            focus:border-blue-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-800
            text-white
            border
            border-slate-700
            focus:outline-none
            focus:border-blue-500
            "
          />

          <button
            type="submit"
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            transition
            p-3
            rounded-xl
            text-white
            font-semibold
            "
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;