import jwt from 'jsonwebtoken'

const authTeacher=async (req ,res ,next)=>{

    try {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({
            success: false,
            message: "Not authorized, login again",
          });
        }
    
        
        const token = authHeader.split(" ")[1];
    
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        
        if (decoded.role !== "teacher") {
          return res.status(403).json({
            success: false,
            message: "Teacher  access only",
          });
        }
    
        
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };
    
        
        next();
    
      } catch (error) {
        console.log(error);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
}

export default authTeacher