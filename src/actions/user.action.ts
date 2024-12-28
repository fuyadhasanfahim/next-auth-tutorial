'use client';

import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

export async function LoginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (!result || !result.ok) {
            throw new Error(result?.error || 'Login failed');
        }

        console.log('Login successful:', result);
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        redirect('/');
    }
}

export async function RegisterAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const res = await fetch('https://next-auth-tutorial-sigma.vercel.app/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error('Registration failed');
        }

        await res.json();
    } catch (error) {
        console.error('Registration error:', error);
    }
}
