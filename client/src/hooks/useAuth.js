import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  selectCurrentUser,
  selectCurrentToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectUserRole,
  selectIsAdmin,
  setCredentials,
  logout as logoutAction,
  setLoading,
} from '../store/slices/authSlice';
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useRegisterAdminMutation,
  useVerifyTokenQuery,
} from '../store/api/authApi';
import { formatErrorMessage, SUCCESS_MESSAGES } from '../utils/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const userRole = useSelector(selectUserRole);
  const isAdmin = useSelector(selectIsAdmin);

  // Mutations
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();
  const [registerAdmin, { isLoading: isRegisterAdminLoading }] = useRegisterAdminMutation();

  // Verify token query (only run if token exists)
  const { 
    data: verifyData, 
    isLoading: isVerifyLoading,
    error: verifyError 
  } = useVerifyTokenQuery(undefined, {
    skip: !token,
  });

  // Login function
  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const result = await loginUser(credentials).unwrap();
      
      // Extract user data from the response
      const userData = result.user || result.admin || {
        email: credentials.email,
        role: credentials.role,
      };

      dispatch(setCredentials({
        token: result.token,
        user: userData,
      }));

      toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      
      // Navigate based on role
      if (credentials.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

      return { success: true };
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Register function
  const register = async (userData, isAdminRegistration = false) => {
    try {
      dispatch(setLoading(true));
      
      const mutation = isAdminRegistration ? registerAdmin : registerUser;
      const result = await mutation(userData).unwrap();
      
      // Extract user data from the response
      const userInfo = result.user || result.admin || {
        email: userData.email,
        username: userData.username,
        role: userData.role || 'user',
      };

      dispatch(setCredentials({
        token: result.token,
        user: userInfo,
      }));

      toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
      
      // Navigate based on role
      if (isAdminRegistration || userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

      return { success: true };
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Logout function
  const logout = () => {
    dispatch(logoutAction());
    toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    navigate('/');
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  // Check if user is authenticated and has specific role
  const isAuthorized = (requiredRole) => {
    return isAuthenticated && hasRole(requiredRole);
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isRegisterLoading || isRegisterAdminLoading || isVerifyLoading,
    userRole,
    isAdmin,
    
    // Actions
    login,
    register,
    logout,
    
    // Utilities
    hasRole,
    hasAnyRole,
    isAuthorized,
    
    // Verification
    verifyData,
    verifyError,
  };
};
