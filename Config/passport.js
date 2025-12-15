// config/passport.js
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const prisma = new PrismaClient();
// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    // Check if token is blacklisted
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token) {
      const blacklisted = await prisma.tokenBlacklist.findUnique({
        where: { token }
      });
      if (blacklisted && blacklisted.expiresAt > new Date()) {
        return done(null, false);
      }
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(payload.id) } });
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          passwordHash: "",  // no password for google users
          googleId: profile.id,
        } 
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));



