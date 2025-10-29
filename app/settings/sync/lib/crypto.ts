"use client";
function b64(arr: ArrayBuffer){ return btoa(String.fromCharCode(...new Uint8Array(arr))); }
function fromB64(s: string): ArrayBuffer{
  const binary = atob(s);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
async function deriveKey(password: string, salt: ArrayBuffer){
  const enc = new TextEncoder();
  const keyMat = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {name:'PBKDF2', salt, iterations: 120000, hash:'SHA-256'},
    keyMat,
    {name:'AES-GCM', length:256},
    false,
    ['encrypt','decrypt']
  );
}
export async function encryptJSON(obj: any, password: string){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt.buffer);
  const plain = new TextEncoder().encode(JSON.stringify(obj));
  const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv: iv.buffer}, key, plain);
  return { enc:'AES-GCM', v:1, iv:b64(iv.buffer), salt:b64(salt.buffer), data:b64(ct) };
}
export async function decryptJSON(pack: {enc:string; v:number; iv:string; salt:string; data:string}, password: string){
  if (!pack || pack.enc!=='AES-GCM') throw new Error('Unsupported package');
  const iv = fromB64(pack.iv);
  const salt = fromB64(pack.salt);
  const key = await deriveKey(password, salt);
  const ct = fromB64(pack.data);
  const pt = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
  const text = new TextDecoder().decode(pt);
  return JSON.parse(text);
}
