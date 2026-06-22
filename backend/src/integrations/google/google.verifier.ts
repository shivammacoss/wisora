import { OAuth2Client } from 'google-auth-library';
import { env } from '@config/env';
import { UnauthorizedError } from '@common/errors';

/**
 * Infrastructure adapter that verifies a Google ID token (the credential the
 * frontend "Sign in with Google" button produces) and returns a trusted profile.
 * Isolated here so the auth domain never imports the Google SDK directly.
 */
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export interface GoogleProfile {
  email: string;
  name: string;
  googleId: string;
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new UnauthorizedError('Google sign-in is not configured on the server');
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    throw new UnauthorizedError('Invalid Google credential');
  }

  if (!payload?.email || !payload.email_verified) {
    throw new UnauthorizedError('Google account email is not verified');
  }

  return {
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0],
    googleId: payload.sub,
  };
}
