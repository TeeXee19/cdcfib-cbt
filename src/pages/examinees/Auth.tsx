import { useState} from 'react';
import ExamineeCard from '../../components/molecules/ExamineeCard';
import { useCandidateLoginMutation } from '../../hooks/useAuth';
import { ExamineeAccessPayload } from '../../types/auth.type';
import { handleInputChange, handleSubmitForm } from '../../helpers/utils';
// Assuming a custom hook or function for routing/redirection
// import { useNavigate } from 'react-router-dom'; 

const Auth = () => {

  const [formData, setFormData] = useState<ExamineeAccessPayload>({
    phone_number: "",
    nin: "",
  });
  const { mutate: login, isPending:isLoading, error } = useCandidateLoginMutation()


  return (
    <ExamineeCard
      label="Exam Taker Login"
      question=""
      actionLabel=""
      actionHref="/support"
    >


      <div className="login-container">
        <form onSubmit={(e) => handleSubmitForm(login)(e, formData)}>
          {/* NIN Input Field */}
          <div className="form-group">
            <label htmlFor="nin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              NIN
            </label>
            <input
              id="nin"
              name="nin"
              type="text"
              inputMode="numeric"
              pattern="\d{11}"
              maxLength={11}
              value={formData.nin}
              onChange={(e) => handleInputChange(e, setFormData, formData)}
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
              name="phone_number"
              type="text"
              inputMode="numeric"
              // pattern="\d{11}"
              maxLength={11}
              value={formData.phone_number}
              onChange={(e) => handleInputChange(e, setFormData, formData)}
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
              {error.message}
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