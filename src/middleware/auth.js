import jwt from 'jsonwebtoken';


  export async function authMiddleware(req, res, next) {
    
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log("TOKEN+++++",token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res
            .status(401)
            .json({ message: "Malformed or invalid token" });
        } else if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token has expired" });
        } else {
          return res.status(401).json({ message: "Token verification failed" });
        }
      }

      req.user = decoded;
      next();
    });
  }

