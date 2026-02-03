import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const { name, email, password } = formData;
      await register({ name, email, password });
      success('Account created successfully! Welcome to StockWise.');
      navigate('/', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
      error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-slate-100">
            <svg className="w-9 h-9 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Join StockWise to manage your assets efficiently
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          {apiError && (
             <Alert 
               variant="error" 
               className="mb-6" 
               onClose={() => setApiError('')}
             >
               {apiError}
             </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <Input
                 label="Full Name"
                 name="name"
                 type="text"
                 value={formData.name}
                 onChange={handleChange}
                 error={errors.name}
                 placeholder="John Doe"
                 required
                 autoComplete="name"
               />
            </div>

            <div>
               <Input
                 label="Email Address"
                 name="email"
                 type="email"
                 value={formData.email}
                 onChange={handleChange}
                 error={errors.email}
                 placeholder="you@example.com"
                 required
                 autoComplete="email"
               />
            </div>

            <div>
               <Input
                 label="Password"
                 name="password"
                 type="password"
                 value={formData.password}
                 onChange={handleChange}
                 error={errors.password}
                 placeholder="••••••••"
                 required
                 autoComplete="new-password"
               />
            </div>

            <div>
               <Input
                 label="Confirm Password"
                 name="confirmPassword"
                 type="password"
                 value={formData.confirmPassword}
                 onChange={handleChange}
                 error={errors.confirmPassword}
                 placeholder="••••••••"
                 required
                 autoComplete="new-password"
               />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="font-semibold shadow-lg shadow-indigo-500/30"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
