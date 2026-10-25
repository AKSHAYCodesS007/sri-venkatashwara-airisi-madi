import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'mandi_internal_session_signature_desk_2026';

function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`admin:${timestamp}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const expectedUser = (process.env.ADMIN_USERNAME || '').trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || '').trim();

    if (!expectedUser || !expectedPass) {
      return NextResponse.json(
        { success: false, error: 'Server authentication configuration missing.' },
        { status: 500 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const trimmedUser = String(username).trim();
    const trimmedPass = String(password).trim();

    const isUserValid = trimmedUser === expectedUser;
    const isPassValid = trimmedPass === expectedPass;

    if (!isUserValid || !isPassValid) {
      // Artificial delay to prevent brute-force timing attacks
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(
        { success: false, error: 'Invalid administrative credentials. Access denied.' },
        { status: 401 }
      );
    }

    const sessionToken = createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'Admin session authenticated successfully',
    });

    response.cookies.set({
      name: 'admin_session_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error processing authentication' },
      { status: 500 }
    );
  }
}
