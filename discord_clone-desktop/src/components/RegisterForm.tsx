interface RegisterFormProps {
  setError: (msg: string) => void;
  registerData: { login: string; password: string; nickname: string };
  setRegisterData: React.Dispatch<
    React.SetStateAction<{ login: string; password: string; nickname: string }>
  >;
  error: string | undefined;
  setIsRegester: (value: boolean) => void;
  registerUser: (data: any) => Promise<any>;
}

function RegisterForm({
  setError,
  registerUser,
  registerData,
  setRegisterData,
  error,
  setIsRegester,
}: RegisterFormProps) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        const res = await registerUser(registerData);
        if (res.err) {
          setError(res.err);
          return;
        }
        console.log(res);
        setRegisterData({ login: "", password: "", nickname: "" });
      }}
    >
      <label className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
          Login
        </span>
        <input
          className="bg-gray-900 border border-gray-700 text-gray-100 p-3 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          value={registerData.login}
          onChange={(e) =>
            setRegisterData({ ...registerData, login: e.target.value })
          }
          type="text"
          minLength={3}
          required
        />
      </label>
      <label className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
          Nickname
        </span>
        <input
          className="bg-gray-900 border border-gray-700 text-gray-100 p-3 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          value={registerData.nickname}
          onChange={(e) =>
            setRegisterData({ ...registerData, nickname: e.target.value })
          }
          type="text"
          required
        />
      </label>
      <label className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
          Password
        </span>
        <input
          className="bg-gray-900 border border-gray-700 text-gray-100 p-3 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          value={registerData.password}
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
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
        >
          Зарегистрироваться
        </button>
        <button
          className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition"
          type="button"
          onClick={() => setIsRegester(false)}
        >
          Уже есть аккаунт?
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
