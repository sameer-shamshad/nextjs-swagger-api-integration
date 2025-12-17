import { assign, fromPromise, setup } from "xstate";
import { RegistrationResponse } from "./RegisterMachine";
import { loginWithEmailAndPassword } from "@/services/auth.service";

export type LoginResponse = RegistrationResponse;

interface LoginContext {
  email: string;
  password: string;
  showPassword: boolean;
  error: string | null;
  authResponse: LoginResponse | null;
}

const initialContext: LoginContext = {
  email: '',
  password: '',
  showPassword: false,
  error: null,
  authResponse: null,
};

const loginMachine = setup({
  types: {
    context: {} as LoginContext,
    events: {} as
      | { type: 'CHANGE_FIELD'; field: 'email' | 'password'; value: string }
      | { type: 'TOGGLE_PASSWORD_VISIBILITY' }
      | { type: 'SUBMIT' }
      | { type: 'RESET' },
  },
  actors: {
    login: fromPromise(async ({ input: { email, password } }: { input: { email: string; password: string } }) => {
      const response = await loginWithEmailAndPassword(email, password);
      return response;
    }),
  },
  actions: {
    togglePasswordVisibility: assign(({ context }) => ({ ...context, showPassword: !context.showPassword })),
    changeField: assign(({ context, event }) => {
      if (event.type !== 'CHANGE_FIELD') return context;
      
      return { ...context, [event.field]: event.value };
    }),
    setError: assign(({ context, event }) => {
      const error = (event as unknown as { error: Error | unknown }).error;
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      return { ...context, error: errorMessage };
    }),
    clearError: assign(({ context }) => ({ ...context, error: null })),
    clearForm: assign(() => initialContext),
    storeAuth: assign(({ context, event }) => {
      const output = (event as unknown as { output: LoginResponse }).output;
      return { ...context, authResponse: output };
    }),
  },
}).createMachine({
  id: 'loginMachine',
  initial: 'idle',
  context: initialContext,
  states: {
    idle: {
      on: {
        TOGGLE_PASSWORD_VISIBILITY: { actions: 'togglePasswordVisibility' },
        CHANGE_FIELD: { 
          actions: ['changeField', 'clearError'],
        },
        SUBMIT: {
          target: 'submitting',
          actions: 'clearError',
        },
      },
    },
    submitting: {
      invoke: {
        src: 'login',
        input: ({ context }) => ({
          email: context.email,
          password: context.password,
        }),
        onDone: {
          target: 'success',
          actions: 'storeAuth',
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    success: {
      after: {
        4000: { target: 'idle', actions: 'clearForm' },
      },
    },
  },
});

export default loginMachine;