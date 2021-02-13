function Nav () {
    return (
        <div className="nav">
            <p className="nav-item title">Aegle: Injury Management</p>
            <p className="nav-item signed-in">Signed in as </p> 
            <form className="nav-item" action="/api/users/logout?_method=DELETE" method="POST">
                <button className="nav-item" type="submit">Log Out</button>
            </form>
        </div>
    );
}

export default Nav;

