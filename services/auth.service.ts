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
      tenantId: "691583f97f7968a408f2ec05",
    });
    
    // Log response data
    if (response.data) {
      console.log('API Response - success:', response.data.success);
      console.log('API Response - data:', response.data.data);
    }
    
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
      
      // Log error response data if available
      if (responseData) {
        console.log('API Error Response - success:', responseData.success);
        console.log('API Error Response - data:', responseData.data);
      }
      
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