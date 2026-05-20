import type { ParentPinRecord } from "@/types";

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value);
  return toHex(await crypto.subtle.digest("SHA-256", encoded));
}

export async function createParentPin(pin: string): Promise<ParentPinRecord> {
  const salt = randomSalt();
  return {
    salt,
    hash: await sha256(`${salt}:${pin}`),
    updatedAt: new Date().toISOString()
  };
}

export async function verifyParentPin(pin: string, record?: ParentPinRecord) {
  if (!record) return false;
  return sha256(`${record.salt}:${pin}`).then((hash) => hash === record.hash);
}
