const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { v4: uuidv4 } = require("uuid");

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    user_id: uuidv4(),
                    googleId: profile.id,
                    full_name: profile.displayName,
                    email: profile.emails[0].value,
                    profile_pic: profile.photos[0].value
                };

                try {
                    let user = await User.findOne({ googleId: profile.id })

                    if(user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user); 
                    }

                } catch (error) {
                    console.error("Error while google login", error);
                }
            }
        )
    );

    passport.serializeUser((user, cb) => {
        process.nextTick(() => {
            return cb(null, {
                id: user.id,
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                profile_pic: user.profile_pic,
                bio: user.bio
            });
        });
    });

    passport.deserializeUser((user, cb) => {
        process.nextTick(() => {
            return cb(null, user);
        });
    });
};
