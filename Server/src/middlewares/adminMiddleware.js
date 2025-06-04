const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, proceed to the next middleware or route handler
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admins only." }); // User is not admin, send error response
  }
};

export default adminMiddleware;
