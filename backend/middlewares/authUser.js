import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check token existence & format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Ensure this token belongs to a STUDENT
    if (decoded.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access only",
      });
    }

    // 5. Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // 6. Continue to controller
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;