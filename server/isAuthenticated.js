// ###################################### AUTHORIZE MIDDLEWARE FOR THE BE

const isAuthenticated = (req, res, next) => {
    console.log("authenticating", req.url, req.session.user);
    if (!req.session.user || req.session.user.isActive === 0) {
        return res.status(401).send({
            response: "User not authorized",
        });
    }

    next();
}

module.exports = isAuthenticated;