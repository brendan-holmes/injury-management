# Web App for Injury Management

Uses Express, MongoDB, NodeJS, no front-end frameworks.

Features:
- User authentication using passport and bcrypt
- delete post button
- edit post button

(Screenshot placeholder)

## Todo

### New Features
- Implement separate db access (read/write) for different users
- Update form to include fields like "body part", "side", "intensity", "traumatic event", "date of injury"
- Show "add new injury form" as a button and open form as modal or separate page
- Remove "name" field from injury
- Add home/landing screen
- Show database operation success message to user

### Bugs
- Fix crash from empty form submission
- After update, posts refresh before db change has taken effect
- Fix MaxListenersExceededWarning jongleberry.com/understanding-possible-eventemitter-leaks.html (Appeared when adding Database module)
- Fix favicon not showing on local host only

### Improvements
- Refactor Injury Component
- Refactor express routes to separate file (potentially using Router.js)
- Refactor all references to a "user" as a class
- Layout of new elements
- Improving response messaging after performing fetch or database operations
