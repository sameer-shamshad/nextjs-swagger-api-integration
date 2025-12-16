import axios from "@/lib/axios";

export const registerWithEmailAndPassword = async (
  email: string, 
  name: string, 
  password: string, 
  confirmPassword: string,
  role: string
) => {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  try {
    const response = await axios.post("/api/v1/auth/register", { 
      email, 
      name, 
      password,
      role,
    });
    
    return response.data;
  } catch (error: unknown) {
    // Extract error message from axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { 
        response?: { 
          status?: number;
          data?: { 
            message?: string;
            success?: boolean;
            data?: string;
          } 
        } 
      };
      
      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data;
      
      // Handle specific status codes
      if (status === 400) {
        const errorMessage = responseData?.message || responseData?.data || 'Invalid input. Please check your registration details.';
        throw new Error(errorMessage);
      }
      
      if (status === 409) {
        const errorMessage = responseData?.message || responseData?.data || 'User already exists.';
        throw new Error(errorMessage);
      }
      
      // Handle other error responses
      if (responseData?.message) {
        throw new Error(responseData.message);
      }
      
      if (responseData?.data) {
        throw new Error(responseData.data);
      }
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Registration failed. Please try again.');
  }
}