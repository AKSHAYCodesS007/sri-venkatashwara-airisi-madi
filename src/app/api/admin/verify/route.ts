import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'mandi_session_secret_key_9962119810_secure';

function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [timestamp, signature] = parts;
    const time = parseInt(timestamp, 10);
    if (isNaN(time) || Date.now() - time > 1000 * 60 * 60 * 24 * 7) return false;

    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`admin:${timestamp}`)
      .digest('hex');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session_token')?.value;

  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
