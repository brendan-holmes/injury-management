# Web App for Injury Management

Uses Express, MongoDB, NodeJS, no front-end frameworks.

Features:
- User authentication using passport and bcrypt
- delete post button
- edit post button

(Screenshot placeholder)

## Todo

### Features
- Use username instead of Name field
- Default/guest account

### Bugs
- Fix crash from empty form submission
- After update, posts refresh before db change has taken effect
- Fix MaxListenersExceededWarning jongleberry.com/understanding-possible-eventemitter-leaks.html (Appeared when adding Database module)
- Fix favicon not showing on local host only

### Improvements
- Refactor express routes to separate file (potentially using Router.js)
- Refactor all references to a "user" as a class
- Layout of new elements
- Improving response messaging after performing fetch or database operations
