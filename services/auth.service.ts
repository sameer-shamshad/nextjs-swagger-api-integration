import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { LoginResponse } from "@/machines/auth/LoginMachine";
import { RegistrationResponse } from "@/machines/auth/RegisterMachine";

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const registerWithEmailAndPassword = async (
  email: string, 
  name: string, 
  password: string, 
  confirmPassword: string,
  role: string
): Promise<RegistrationResponse> => {
  // Validate input
  if (email.trim() === '') throw new Error("Email is required.");
  if (name.trim() === '') throw new Error("Name is required.");
  if (password.trim() === '') throw new Error("Password is required.");
  if (confirmPassword.trim() === '') throw new Error("Confirm password is required.");
  if (password !== confirmPassword) throw new Error("Passwords do not match.");
  if (role.trim() === '') throw new Error("Role is required.");
  if (role !== 'Admin' && role !== 'User') throw new Error("The role must be either Admin or User.");

  try {
    const response = await axios.post(`/api/${API_VERSION}/auth/register`, { 
      email, 
      name, 
      password,
      role,
    });

    return response.data;
  } catch (error: unknown) {
    // Extract error message from axios error response
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
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

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<LoginResponse> => {
  // Validate input
  if (email.trim() === '') throw new Error("Email is required.");
  if (password.trim() === '') throw new Error("Password is required.");

  try {
    const response = await axios.post(`/api/${API_VERSION}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      if (status === 400) {
        const errorMessage = responseData?.message || responseData?.data || 'Invalid input. Please check your login details.';
        throw new Error(errorMessage);
      }
    }
    
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Login failed. Please try again.');
  }
}