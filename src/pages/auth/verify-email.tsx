import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import apiService from "../../services/apiService";
import { useNotification } from "../../contexts/NotificationContext";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'success' | 'error' | 'idle'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(0);
  
  // Code verification states
  const [code, setCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams]);

  // Poll for verification status every 2 seconds
  useEffect(() => {
    // Only poll if we have an email and are in idle state (waiting for user to verify)
    if (!email || verificationStatus !== 'idle') {
      return;
    }

    const checkVerificationStatus = async () => {
      try {
        const response = await apiService.getPublic(`users/check-verification-status/?email=${encodeURIComponent(email)}`);
        
        if (response.is_verified && response.temp_login_token) {
          // User verified via link, get the temp token and trigger auto-login
          setVerificationStatus('success');
          setTempToken(response.temp_login_token);
        }
      } catch (error: any) {
        // User not found or error - don't do anything, just log
        console.error('Polling error:', error.message);
      }
    };

    // Poll every 2 seconds
    const intervalId = setInterval(checkVerificationStatus, 2000);

    return () => clearInterval(intervalId);
  }, [email, verificationStatus]);

  useEffect(() => {
    // Auto-login after successful verification
    if (verificationStatus === 'success' && tempToken) {
      const autoLogin = async () => {
        try {
          // Use temp login token to get JWT tokens
          const response = await apiService.postPublic('users/temp-login/', { temp_login_token: tempToken });
          
          // Store tokens
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          showNotification({
            type: "success",
            title: "Welcome to DayLight!",
            message: "Your account has been verified and you are now logged in.",
            duration: 4000,
          });
          
          // Reload to update auth state
          window.location.href = '/home';
        } catch (error: any) {
          // Auto-login failed, redirect to login page
          navigate('/auth/login');
        }
      };
      autoLogin();
    }
  }, [verificationStatus, tempToken]);

  const verifyEmail = async (token: string) => {
    try {
      setVerificationStatus('checking');
      // Call the backend to verify the email (public endpoint, no auth required)
      const response = await apiService.getPublic(`users/email-verify/?token=${token}`);
      
      // Backend returns temp login token for auto-login
      if (response.temp_login_token) {
        setTempToken(response.temp_login_token);
      }
      
      setVerificationStatus('success');
    } catch (error: any) {
      setVerificationStatus('error');
      const message = error.message || "Verification failed. The link may be invalid or expired.";
      setErrorMessage(message);
      
      // If token is expired, auto-redirect to registration after 3 seconds
      if (error.expired || message.includes('expired')) {
        setRedirectCountdown(3);
        const timer = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/auth/register');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  const verifyEmailWithCode = async () => {
    if (!code || code.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code');
      return;
    }

    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    try {
      setIsVerifyingCode(true);
      setVerificationStatus('checking');
      setErrorMessage('');
      
      const response = await apiService.postPublic('users/email-verify-code/', {
        code,
        email
      });
      
      if (response.temp_login_token) {
        setTempToken(response.temp_login_token);
      }
      
      setVerificationStatus('success');
    } catch (error: any) {
      const message = error.message || "Verification failed. The code may be invalid or expired.";
      setErrorMessage(message);
      
      // Only redirect if expired, otherwise keep the form visible with error message
      if (error.expired || message.includes('expired')) {
        setVerificationStatus('error');
        setRedirectCountdown(3);
        const timer = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/auth/register');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Invalid code - keep form visible, just show error message
        setVerificationStatus('idle');
        setCode(''); // Clear the code so user can re-enter
      }
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 6 digits
    if (digitsOnly.length <= 6) {
      setCode(digitsOnly);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-blue-100/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_55%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-xl rounded-3xl border border-amber-100 bg-white/90 p-10 text-center shadow-xl shadow-amber-200/40 backdrop-blur">
          {/* Verification Status Icons */}
          {verificationStatus === 'checking' && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}
          {verificationStatus === 'success' && (
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </span>
          )}
          {verificationStatus === 'error' && (
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <ShieldCheck className="h-8 w-8 text-red-600" />
            </span>
          )}
          {verificationStatus === 'idle' && (
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <MailCheck className="h-8 w-8" />
            </span>
          )}

          {/* Headings based on status */}
          {verificationStatus === 'checking' && (
            <h1 className="mt-6 text-3xl font-semibold text-gray-900">
              Verifying your email...
            </h1>
          )}
          {verificationStatus === 'success' && (
            <h1 className="mt-6 text-3xl font-semibold text-gray-900">
              Email verified successfully! 🎉
            </h1>
          )}
          {verificationStatus === 'error' && (
            <h1 className="mt-6 text-3xl font-semibold text-gray-900">
              Verification failed
            </h1>
          )}
          {verificationStatus === 'idle' && (
            <h1 className="mt-6 text-3xl font-semibold text-gray-900">
              Verify Your Email
            </h1>
          )}

          {/* Messages based on status */}
          {verificationStatus === 'checking' && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Please wait while we verify your email address...
            </p>
          )}
          {verificationStatus === 'success' && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Your account has been activated! You can now log in and start using DayLight.
            </p>
          )}
          {verificationStatus === 'error' && (
            <div className="mt-4 space-y-2">
              <p className="text-sm leading-relaxed text-red-600">
                {errorMessage}
              </p>
              {redirectCountdown > 0 && (
                <p className="text-xs text-gray-500">
                  Redirecting to sign up page in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                </p>
              )}
            </div>
          )}
          {verificationStatus === 'idle' && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              We've sent a verification code to your email. Enter it below or click the link in your email.
            </p>
          )}

          {/* Info boxes for idle state */}
          {verificationStatus === 'idle' && (
            <div className="mt-8 space-y-4">
              {/* Show error message if present */}
              {errorMessage && !errorMessage.includes('expired') && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}
              
              <div className="space-y-3 text-left text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-emerald-500" />
                  <p>Enter the 6-digit code from your email to verify your account.</p>
                </div>
                <div className="flex items-start gap-3">
                  <MailCheck className="mt-1 h-5 w-5 text-blue-500" />
                  <p>Click the verification link in your email for instant access.</p>
                </div>
              </div>

              {/* Code Input Form */}
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/50 p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Enter Verification Code
                </label>
                
                {email && (
                  <p className="text-sm text-gray-600 mb-4">
                    Verifying: <span className="font-semibold">{email}</span>
                  </p>
                )}
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={code[i] || ''}
                        onChange={(e) => {
                          const newCode = code.split('');
                          newCode[i] = e.target.value;
                          handleCodeChange(newCode.join(''));
                          // Auto-focus next input
                          if (e.target.value && i < 5) {
                            (e.target.parentElement?.children[i + 1] as HTMLInputElement)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          // Backspace handling
                          if (e.key === 'Backspace' && !code[i] && i > 0) {
                            const target = e.target as HTMLInputElement;
                            const parent = target.parentElement;
                            if (parent) {
                              (parent.children[i - 1] as HTMLInputElement)?.focus();
                            }
                          }
                        }}
                        className="w-full text-center rounded-lg border-2 border-amber-200 bg-white px-4 py-3 text-2xl font-bold focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={verifyEmailWithCode}
                    disabled={isVerifyingCode || code.length !== 6 || !email}
                    className="w-full rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifyingCode ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons - Only show for error state when NOT auto-redirecting */}
          {verificationStatus === 'error' && redirectCountdown === 0 && (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-700"
              >
                Try registering again
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 px-6 py-3 text-sm font-semibold text-amber-600 transition hover:border-amber-300 hover:text-amber-700"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;