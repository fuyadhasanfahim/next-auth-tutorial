import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './dbConnect';
import UserModel from '@/models/user.model';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Enter your email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Enter your password',
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials.');
                }

                try {
                    await dbConnect();

                    const user = await UserModel.findOne({
                        email: credentials.email,
                    });

                    if (!user) {
                        throw new Error('No user found with email.');
                    }

                    const isValid = await compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValid) {
                        throw new Error('Invalid password.');
                    }

                    return {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.log('Auth error', error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            return session;
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        signIn: async ({ user, account }) => {
            if (account?.provider === 'credentials') {
                return true;
            } else {
                return false;
            }
        },
    },
    pages: {
        signIn: '/login',
        error: '/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET!,
};
