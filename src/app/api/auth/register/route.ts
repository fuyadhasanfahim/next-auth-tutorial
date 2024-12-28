import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                {
                    error: 'Missing email or password',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConnect();
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: 'User already exists',
                },
                {
                    status: 400,
                }
            );
        }

        await UserModel.create({ email, password });

        return NextResponse.json(
            {
                message: 'User created successfully',
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                error: 'Internal server error',
            },
            {
                status: 500,
            }
        );
    }
}
