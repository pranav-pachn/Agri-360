import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Fixed Mock Google Login with better error handling
export function MockGoogleLoginFixed({ onSuccess, onError }) {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const generateUniqueEmail = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `demo.farmer.${timestamp}.${random}@gmail.com`;
  };

  const handleMockGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // Generate unique email to avoid conflicts
      const timestamp = Date.now();
      const mockGoogleUser = {
        email: generateUniqueEmail(),
        name: 'Demo Farmer',
        picture: `https://picsum.photos/seed/farmer${timestamp}/40/40.jpg`,
        googleId: `google_${timestamp}`,
        loginMethod: 'google'
      };

      console.log('Mock Google Login:', mockGoogleUser);

      // Create a unique password for Google users
      const googlePassword = `google-auth-${mockGoogleUser.googleId}`;

      // Try to sign in with existing credentials first
      let { data, error } = await signIn({
        email: mockGoogleUser.email,
        password: googlePassword
      });

      // If user doesn't exist, create a new account
      if (error && error.message.includes('Invalid login credentials')) {
        console.log('User not found, creating new account...');
        
        const { data: signUpData, error: signUpError } = await signUp({
          email: mockGoogleUser.email,
          password: googlePassword,
          options: {
            data: {
              name: mockGoogleUser.name,
              picture: mockGoogleUser.picture,
              login_method: 'google',
              google_id: mockGoogleUser.googleId
            }
          }
        });

        if (signUpError) {
          console.error('Mock Google signup error:', signUpError);
          
          // Handle rate limiting with multiple retries
          if (signUpError.message.includes('rate limit')) {
            console.log('Rate limit detected, implementing retry strategy...');
            
            let retryCount = 0;
            const maxRetries = 3;
            let retryData = null;
            let retryError = signUpError;
            
            while (retryCount < maxRetries && retryError) {
              retryCount++;
              console.log(`Retry attempt ${retryCount}/${maxRetries}`);
              
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
              
              // Generate new unique email for retry
              const retryUser = {
                ...mockGoogleUser,
                email: generateUniqueEmail(),
                googleId: `google_retry_${timestamp}_${retryCount}`
              };
              
              const retryPassword = `google-auth-${retryUser.googleId}`;
              
              const retryResult = await signUp({
                email: retryUser.email,
                password: retryPassword,
                options: {
                  data: {
                    name: retryUser.name,
                    picture: retryUser.picture,
                    login_method: 'google',
                    google_id: retryUser.googleId
                  }
                }
              });
              
              retryData = retryResult.data;
              retryError = retryResult.error;
              
              if (!retryError) {
                console.log(`Retry ${retryCount} successful`);
                break;
              }
            }
            
            if (retryError) {
              console.error('All retry attempts failed:', retryError);
              
              // Final fallback - create a local mock user without Supabase
              console.log('Using local fallback authentication...');
              
              const fallbackUser = {
                id: `local_${timestamp}`,
                email: mockGoogleUser.email,
                name: mockGoogleUser.name,
                picture: mockGoogleUser.picture,
                googleId: mockGoogleUser.googleId,
                loginMethod: 'google',
                created_at: new Date().toISOString(),
                user_metadata: {
                  name: mockGoogleUser.name,
                  picture: mockGoogleUser.picture,
                  login_method: 'google',
                  google_id: mockGoogleUser.googleId
                }
              };
              
              if (onSuccess) {
                onSuccess({
                  ...mockGoogleUser,
                  supabaseUser: fallbackUser,
                  supabaseSession: { access_token: 'mock_token', user: fallbackUser },
                  fallback: true
                });
              }
              
              return;
            } else {
              console.log('Retry successful');
              data = retryData;
              error = null;
            }
          } else {
            if (onError) onError(signUpError);
            return;
          }
        } else {
          console.log('Mock Google account created successfully');
          data = signUpData;
          error = null;
        }
      }

      if (error) {
        console.error('Mock Google auth error:', error);
        if (onError) onError(error);
      } else {
        console.log('Successfully logged in with Mock Google');
        console.log('Supabase user:', data.user);
        console.log('Supabase session:', data.session);
        
        if (onSuccess) {
          onSuccess({
            ...mockGoogleUser,
            supabaseUser: data.user,
            supabaseSession: data.session
          });
        }
      }
      
    } catch (error) {
      console.error('Mock Google login error:', error);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleMockGoogleLogin}
      className="google-login-button"
      type="button"
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="loading-spinner"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.20455C17.64 8.56637 17.5827 7.95274 17.4764 7.36364H9V10.845H13.6843C13.4854 11.9705 12.8236 12.9232 11.8464 13.5614V15.8198H14.8264C16.5909 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.8264 15.8198L11.8464 13.5614C11.0414 14.1014 10.0109 14.4205 9 14.4205C6.65591 14.4205 4.67182 13.1068 3.96409 11.2773H0.785455V12.6409C2.13636 15.3195 4.87636 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 11.2773C3.78409 10.7373 3.68182 10.1591 3.68182 9.5C3.68182 8.84091 3.78409 8.26273 3.96409 7.72273V6.35909H0.785455C0.286364 7.34955 0 8.45045 0 9.5C0 10.5495 0.286364 11.6505 0.785455 12.6409L3.96409 11.2773Z" fill="#FBBC05"/>
            <path d="M9 4.57955C10.3214 4.57955 11.5077 5.03364 12.4405 5.92545L15.0218 3.34409C13.4632 1.89136 11.4255 1 9 1C4.87636 1 2.13636 3.68045 0.785455 6.35909L3.96409 7.72273C4.67182 5.89318 6.65591 4.57955 9 4.57955Z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google (Demo)</span>
        </>
      )}
    </button>
  );
}
