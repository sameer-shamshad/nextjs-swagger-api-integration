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
    const response = await axios.post("/api/auth/register", { 
      email, 
      name, 
      password,
      role,
    });
    return response.data;
  } catch (error: unknown) {
    // Extract error message from axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Registration failed. Please try again.');
  }
}