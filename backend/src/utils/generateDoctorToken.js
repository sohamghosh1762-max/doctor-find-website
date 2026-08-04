import jwt from "jsonwebtoken";

const generateDoctorToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export default generateDoctorToken;