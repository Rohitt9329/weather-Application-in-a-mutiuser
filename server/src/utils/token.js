const crypto = require("crypto");

const base64Url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const fromBase64Url = (input) => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
};

const signToken = (payload, expiresInSeconds = 60 * 60 * 24 * 7) => {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY is missing");
  }

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };
  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(body))}`;
  const signature = crypto.createHmac("sha256", secret).update(unsignedToken).digest("base64url");

  return `${unsignedToken}.${signature}`;
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET_KEY;
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!secret || !encodedHeader || !encodedPayload || !signature) {
    throw new Error("Invalid token");
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(unsignedToken).digest("base64url");

  if (
    expectedSignature.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  ) {
    throw new Error("Invalid token");
  }

  const header = JSON.parse(fromBase64Url(encodedHeader));

  if (header.alg !== "HS256" || header.typ !== "JWT") {
    throw new Error("Invalid token");
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
};

module.exports = { signToken, verifyToken };
