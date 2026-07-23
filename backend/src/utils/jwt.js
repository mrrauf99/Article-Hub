import json from "jsonwebtoken";

export const generateToken = (payload, expiry) => {
  return json.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiry || "1d",
  });
};

export const verifyToken = (token) => {
  return json.verify(token, process.env.JWT_SECRET);
};
