const jwt = require('jsonwebtoken');

// Middleware to protect routes by checking JWT token
exports.protect = (req, res, next) => {
  // Extracting the token from cookies, body, or headers
  const token =
    req.cookies.token || // Check if token is in cookies
    req.body.token || // Check if token is in the request body
    (req.header("Authorization") && req.header("Authorization").replace("Bearer ", "")); // Check if token is in the Authorization header
  
  // Checking if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  console.log("token -> ", token)

  try {
    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded ", decoded)
    req.user = decoded; // Attach decoded user information to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


// Middleware to check if the user is an admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};
