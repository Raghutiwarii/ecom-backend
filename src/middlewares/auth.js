import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user to request object (not res)
    req.user = decoded;

    return true;
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).send({
      message: "Invalid or expired token",
    });
  }
};
