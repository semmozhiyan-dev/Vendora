import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const termsRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    const trimmedForm = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    if (!trimmedForm.fullName) {
      errors.fullName = "Full name is required";
    }

    if (!trimmedForm.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedForm.email)) {
      errors.email = "Valid email is required";
    }

    if (trimmedForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (trimmedForm.password !== trimmedForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!termsRef.current?.checked) {
      errors.terms = "You must agree to the terms and conditions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register", {
        name: form.fullName,
        email: form.email,
        password: form.password,
      });

      const { success, token, user: newUser } = res.data;

      if (!success) {
        setError("Registration failed");
        toast.error("Registration failed");
        return;
      }

      login(token, newUser);
      toast.success("Account created successfully! Welcome to Vendora.");
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Email may already exist.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#0A0A0A] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C9A84C]" /> Vendora
            </div>
            <h1 className="mt-10 max-w-md text-5xl font-black tracking-tight text-white lg:text-6xl">
              Create your premium account.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-300">
              Join to save addresses, track orders, and enjoy a refined shopping experience.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-relaxed text-gray-200">"Clear, premium, and trustworthy from signup to checkout."</p>
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Designed for modern commerce</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#C9A84C] shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#C9A84C]" /> Vendora
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-[#0A0A0A]">Create account</h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">Join Vendora today with a cleaner, premium sign-up flow.</p>
            </div>

            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border bg-[#FAFAFA] px-4 py-3.5 text-gray-900 placeholder-gray-400 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 ${
                      validationErrors.fullName ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {validationErrors.fullName && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border bg-[#FAFAFA] px-4 py-3.5 text-gray-900 placeholder-gray-400 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 ${
                      validationErrors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border bg-[#FAFAFA] px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 ${
                        validationErrors.password ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={`w-full rounded-2xl border bg-[#FAFAFA] px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:border-[#C9A84C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 ${
                        validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input 
                    type="checkbox" 
                    id="terms"
                    ref={termsRef}
                    className="h-4 w-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                  />
                  <label htmlFor="terms" className="cursor-pointer text-xs text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="font-semibold text-[#0A0A0A] transition hover:text-[#C9A84C]">Terms of Service</a> and{' '}
                    <a href="#" className="font-semibold text-[#0A0A0A] transition hover:text-[#C9A84C]">Privacy Policy</a>
                  </label>
                </div>
                {validationErrors.terms && (
                  <p className="-mt-3 text-xs text-red-600">{validationErrors.terms}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0A0A0A] py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">Or sign up with</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#0A0A0A] transition hover:text-[#C9A84C]">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
