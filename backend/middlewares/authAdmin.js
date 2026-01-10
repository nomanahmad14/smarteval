import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

export default authAdmin;
