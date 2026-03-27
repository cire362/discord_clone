import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

interface LoginFormProps {
  setError: (msg: string) => void;
  loginData: { login: string; password: string };
  setLoginData: React.Dispatch<
    React.SetStateAction<{ login: string; password: string }>
  >;
  error: string | undefined;
  setIsRegester: (value: boolean) => void;
  loginUser: (data: any) => Promise<any>;
}

function LoginForm({
  setError,
  loginUser,
  loginData,
  setLoginData,
  error,
  setIsRegester,
}: LoginFormProps) {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (data: any) => loginUser(data),
    onSuccess: (res) => {
      if (res.err) {
        setError(res.err);
        return;
      }

      localStorage.setItem("token", res.token);

      navigate("/");
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        loginMutation.mutate(loginData);
      }}
    >
      <label className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
          Login
        </span>
        <input
          className="bg-gray-900 border border-gray-700 text-gray-100 p-3 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          value={loginData.login}
          onChange={(e) =>
            setLoginData({ ...loginData, login: e.target.value })
          }
          type="text"
          minLength={3}
          required
        />
      </label>
      <label className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
          Password
        </span>
        <input
          className="bg-gray-900 border border-gray-700 text-gray-100 p-3 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          type="password"
          minLength={6}
          required
        />
      </label>
      {error ? (
        <p className="text-red-500 text-sm text-center">{error}</p>
      ) : null}
      <div className="flex flex-col items-center mt-4 gap-3">
        <button
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded transition duration-200 shadow-lg shadow-indigo-500/30"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Загрузка" : "Вход"}
        </button>
        <button
          className="text-sm self-start text-indigo-400 hover:text-indigo-300 hover:underline transition"
          type="button"
          onClick={() => setIsRegester(true)}
        >
          Нужен аккаунт? Зарегистрируйтесь
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
