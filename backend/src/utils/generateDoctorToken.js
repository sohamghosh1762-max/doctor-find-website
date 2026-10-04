import jwt from "jsonwebtoken";

const generateDoctorToken = (id) => {
  const secret = process.env.JWT_SECRET || "dev_secret_key_doctorfind_12345";
  return jwt.sign({ id, role: "doctor" }, secret, {
    expiresIn: "30d",
  });
};

export default generateDoctorToken;