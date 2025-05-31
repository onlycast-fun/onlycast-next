export class FrontendCrypto {
  static async encryptText(text: string, userId: string | undefined) {
    // 1. 使用PBKDF2从用户ID派生密钥（避免明文存储）
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(userId),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // 2. 增强型密钥派生
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const aesKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    // 3. 生成安全IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 4. 执行加密
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      Buffer.from(text, "utf-8")
    );

    // 5. 封装加密数据包
    return {
      encrypted: new Uint8Array(encryptedData),
      salt: Array.from(salt), // 必须存储的派生盐值
      iv: Array.from(iv),
    };
  }
  static async encryptFile(
    file: { arrayBuffer: () => BufferSource | PromiseLike<BufferSource> },
    userId: string | undefined
  ) {
    // 1. 使用PBKDF2从用户ID派生密钥（避免明文存储）
    const baseKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(userId),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // 2. 增强型密钥派生
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const aesKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    // 3. 生成安全IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 4. 执行加密
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      await file.arrayBuffer()
    );

    // 5. 封装加密数据包
    return {
      encrypted: new Uint8Array(encryptedData),
      salt: Array.from(salt), // 必须存储的派生盐值
      iv: Array.from(iv),
    };
  }
}
