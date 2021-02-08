const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        console.log(`[DEBUG] Authenticating user ${email}`);
        const user = await getUserByEmail(email);

        if (user == null) {
            console.log('[DEBUG] Error authenticating user. No user with that email');
            return done(null, false, { message: 'No user with that email' });
        }
        
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log(`[DEBUG] User authenticated. User: ${user.name}`);
                return done(null, user);
            } else {
                console.log(`[DEBUG] Error authenticating user. Password incorrect`);
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            console.log(`[DEBUG] Error authenticating user. ${error}`);
            return done(error);
        }
    }

    // Local Strategy also has option passwordField which defaults to 'password', which is our form input name already
    // "options" of local strategy definition need to correspond to authenticateUser parameters
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser(async (id, done) => {
        done(null, await getUserById(id))
    })
}

module.exports = initialize;