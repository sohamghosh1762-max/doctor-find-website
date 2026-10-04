import jwt from "jsonwebtoken";

const generateToken = (id, role = "patient") => {
  const secret = process.env.JWT_SECRET || "dev_secret_key_doctorfind_12345";
  return jwt.sign({ id, role }, secret, {
    expiresIn: "7d",
  });
};

export default generateToken;