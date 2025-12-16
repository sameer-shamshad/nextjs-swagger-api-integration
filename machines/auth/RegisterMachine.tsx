import { registerWithEmailAndPassword } from "@/services/auth.service";
import { assign, fromPromise, setup } from "xstate";

interface RegistrationResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            tenantId: string;
            isEmailVerified: boolean;
            status: string;
            createdAt: string;
            updatedAt: string;
            [key: string]: unknown;
        };
        expiresIn: number;
    };
}

interface RegistrationContext {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    role: string;
    error: string | null;
    successMessage: string | null;
    registrationResponse: RegistrationResponse | null;
}

const initialContext: RegistrationContext = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'Admin',
    error: null,
    successMessage: null,
    registrationResponse: null,
}

const registerMachine = setup({
    types: {
        context: {} as RegistrationContext,
        events: {} as
            | { type: 'CHANGE_FIELD'; field: keyof RegistrationContext; value: RegistrationContext[keyof RegistrationContext] }
            | { type: 'SUBMIT' }
            | { type: 'RESET' },
    },
    actors: {
        registerWithEmailAndPassword: fromPromise(async ({ input }: { input: { email: string; name: string; password: string; confirmPassword: string; role: string } }) => {
            const response = await registerWithEmailAndPassword(input.email, input.name, input.password, input.confirmPassword, input.role);
            return response;
        }),
    },
    actions: {
        changeField: assign(({ context, event }) => {
            if (event.type !== 'CHANGE_FIELD') return context;
            return {
                ...context,
                [event.field]: event.value,
                error: null, // Clear error when user starts typing
            };
        }),
        setError: assign(({ context, event }) => {
            const error = (event as unknown as { error: Error | unknown }).error;
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            return { ...context, error: errorMessage };
        }),
        clearForm: assign(() => initialContext),
        clearError: assign(({ context }) => ({ ...context, error: null })),
        storeSuccessMessage: assign(({ context, event }) => {
            const output = (event as unknown as { output: RegistrationResponse }).output;
            return { 
                ...context, 
                successMessage: output?.data?.user?.name ? `Welcome, ${output.data.user.name}! Registration successful!` : 'Registration successful!',
                registrationResponse: output || null,
            };
        }),
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCcxQJawC5mQWQEMBjAC3QDswA6dCAGzAGIBhACQEEA5AcQFEB9AGIBJXgBkAIgG0ADAF1EoAA4B7WOizoV5RSAAeiAOwBGKgE4zANhlmAzGeOGArE+MAmABwAaEAE9Exg7mTrbG7gAsgWYeth4eAL7xPqgY2LiEpBTUtAyMAMoAqgBCeMIAKrIKSCCq6praugYInrbmhpYuhrbWlpbuPv4IoYZU3SaGHsYyk+HRiclomDj4xGSUNPRMhSXlUsZVymoaWjrVTZHmFlfXVx6WA4hmTqOGs5OGMl22bsYJSSApJbpVZZKiwACuACMALYaTTkKCMCDabLkABuKgA1tRAWkVpl1hCYXCKFAEBQMUQCPVyJVKrpascGmcjJ8qD8bKEfj8+sYHkMZM9wk5BcZehZDB8zPMAYs8Rk1tQibCsPDEbhkCpkFQlHRqQAzLXQqi45YK0HKkkI8nolRUml0+QMo40xqIWxdKjWOxmNwTGScty2fluINUCZmQUeQVPJzRwwy03AglK8FEIhwWCMPTYanUAj65YACimAYAlIwk-jFWC0xnYLB6dVGa6WQhDGHLN9DL7bMK43Z+ZMqLNbjJbE43JZQ25Ev9yCoIHBdFXzZRnXUTm6EABaSxUAOHo9H4zhfl7g-Hq8BhP-Vcg9Y5MAbpmnUBNSzhKgeNzjmdOaxxz5PxEDcOwqBCCJQm+LsXCcRM5TNB9U2JVVSRfVt30QScPAgz4f2FSxJnce4QIFVpoiedoRU8cIENSJCU1rdNMwwrc2zuNxzGFMDPksHtojPMjvlMSNpw8J5bFsGQ-XCSw53iIA */
    id: 'registerMachine',
    initial: 'idle',
    context: initialContext,
    states: {
        idle: {
            on: {
                CHANGE_FIELD: { actions: 'changeField' },
                SUBMIT: {
                    target: 'submitting',
                    actions: 'clearError',
                },
            },
        },
        submitting: {
            invoke: {
                src: 'registerWithEmailAndPassword',
                input: ({ context }: { context: RegistrationContext }) => ({
                    email: context.email,
                    name: context.name,
                    password: context.password,
                    confirmPassword: context.confirmPassword,
                    role: context.role,
                }),
                onDone: {
                    target: 'success',
                    actions: 'storeSuccessMessage',
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

export default registerMachine;