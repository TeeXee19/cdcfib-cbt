import React, { useState, useEffect } from 'react';
import ExamineeCard from '@/components/molecules/ExamineeCard';
// Assuming a custom hook or function for routing/redirection
// import { useNavigate } from 'react-router-dom'; 

const Auth = () => {
  const [nin, setNin] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const navigate = useNavigate(); // For redirection

  const simulateLoginAPI = (ninValue: string, phoneValue: string): Promise<{ token: string; user: { id: number; name: string } }> => {
    // This is where the actual API call (e.g., axios.post('/login', ...)) would go
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ninValue === '11111111111' && phoneValue === '08012345678') {
          resolve({
            token: 'mock-jwt-token-12345',
            user: { id: 101, name: 'Candidate X' }
          });
        } else {
          // General error for security (prevents leaking which field is wrong)
          reject(new Error("Invalid NIN or Phone Number. Please try again."));
        }
      }, 1500); // Simulate network latency
    });
  };
  // ----------------------------------------------------

  const validateInputs = () => {
    setError('');

    if (!/^\d{11}$/.test(nin)) {
      setError('National Identification Number (NIN) must be exactly 11 digits.');
      return false;
    }

    if (!/^0\d{10}$/.test(phone)) {
      setError('Phone Number must be in a valid 11-digit Nigerian format (e.g., 08012345678).');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. SIMULATE API CALL
      const response = await simulateLoginAPI(nin, phone);

      // 2. HANDLE SUCCESS
      const { token } = response;

      // Store the token (Crucial step for authentication)
      localStorage.setItem('authToken', token);

      // 3. REDIRECT
      // navigate('/exam-taker/dashboard'); 
      console.log('Login successful! Redirecting to dashboard...');

    } catch (err: unknown) {
      // 4. HANDLE ERROR
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during login.');
      }
      localStorage.removeItem('authToken'); // Ensure token is cleared on failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>, maxLength: number) => {
    const sanitizedValue = e.target.value.replace(/\D/g, '');
    const limitedValue = sanitizedValue.slice(0, maxLength);
    setState(limitedValue);
  };

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <ExamineeCard
      label="Exam Taker Login"
      question=""
      actionLabel=""
      actionHref="/support"
    >


      <div className="login-container">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* NIN Input Field */}
          <div className="form-group">
            <label htmlFor="nin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              NIN
            </label>
            <input
              id="nin"
              name="nin"
              type="tel"
              inputMode="numeric"
              pattern="\d{11}"
              maxLength={11}
              value={nin}
              onChange={(e) => handleNumberInputChange(e, setNin, 11)}
              placeholder="e.g., 12345678901"
              required
              aria-describedby="nin-help"
              className="w-full text-sm rounded-lg border-2 border-gray-300 bg-white dark:bg-[#101110] text-gray-900 dark:text-[#C4C4C4] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-2 sm:p-2.5 lg:p-3"
            />
            <p id="nin-help" className="mt-1 text-xs text-blue-800 italic dark:text-gray-400">
              <span className='inline-block w-2 h-2 mr-1 bg-blue-800 rounded-full'></span>
              Your 11-digit National Identification Number.
            </p>
          </div>

          {/* Phone Number Input Field */}
          <div className="form-group">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="\d{11}"
              maxLength={11}
              value={phone}
              onChange={(e) => handleNumberInputChange(e, setPhone, 11)}
              placeholder="e.g., 08012345678"
              required
              aria-describedby="phone-help"
              className="w-full text-sm rounded-lg border-2 border-gray-300 bg-white dark:bg-[#101110] text-gray-900 dark:text-[#C4C4C4] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 p-2 sm:p-2.5 lg:p-3"
            />
            <p id="phone-help" className="mt-1 text-xs text-blue-800 italic dark:text-gray-400">
              <span className='inline-block w-2 h-2 mr-1 bg-blue-800 rounded-full'></span>
              The phone number registered for the exam.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <p className="text-sm text-red-600 font-medium">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-[45px] md:h-[50px] px-4 py-2 text-sm md:text-lg font-bold text-white rounded-lg bg-gradient-to-r from-green-700 to-green-900 flex items-center justify-center transition-opacity duration-200 disabled:opacity-50"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="false"
                  aria-label="Loading"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Logging In...</span>
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>
      </div>
    </ExamineeCard>
  );
};

export default Auth;