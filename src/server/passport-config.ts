const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

export function initialize(passport: any, getUserByEmail: any, getUserById: any) {
    const authenticateUser = async (email: string, password: string, done: any) => {
        const user = await getUserByEmail(email);

        if (user === null) {
            return done(null, false, { message: 'No user with that email' });
        }
        
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    }

    // Local Strategy also has option passwordField which defaults to 'password', which is our form input name already
    // "options" of local strategy definition need to correspond to authenticateUser parameters
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user: any, done: any) => {
        done(null, user._id)})
    passport.deserializeUser(async (id: string, done: any) => {
        done(null, await getUserById(id))
    })
}

module.exports = initialize;