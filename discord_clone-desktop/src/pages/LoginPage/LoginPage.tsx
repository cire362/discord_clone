import { useState, useCallback } from "react";
import { loginUser } from "../../api/loginUser";
import { registerUser } from "../../api/registerUser";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";

function Login() {
  const [isRegister, setIsRegester] = useState(true);

  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const [error, setError] = useState<string>();

  const [registerData, setRegisterData] = useState({
    login: "",
    password: "",
    nickname: "",
  });

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#6366f1" },
            links: {
              color: "#4f46e5",
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 1.5,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Создать учетную запись" : "С возвращением!"}
        </h1>

        {isRegister ? (
          <RegisterForm
            setError={setError}
            registerData={registerData}
            error={error}
            setRegisterData={setRegisterData}
            setIsRegester={setIsRegester}
            registerUser={registerUser}
          />
        ) : (
          <LoginForm
            setError={setError}
            loginData={loginData}
            setLoginData={setLoginData}
            error={error}
            setIsRegester={setIsRegester}
            loginUser={loginUser}
          />
        )}
      </div>
    </div>
  );
}

export default Login;
