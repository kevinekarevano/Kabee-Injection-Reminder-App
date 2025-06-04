import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // get token from cookies

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user = decoded; // attach user info to request object
    
    next(); // call next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authMiddleware;
