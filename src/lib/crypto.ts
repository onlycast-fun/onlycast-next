export class FrontendCrypto {
  static async formatkeys(keys: { aesKey: string; iv: string; salt: string }) {
    const { aesKey, iv, salt } = keys;
    const keyBytes = Uint8Array.from(atob(aesKey), (c) => c.charCodeAt(0));

    // Import the AES key
    const formatAesKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
    return {
      aesKey: formatAesKey,
      iv: Uint8Array.from(atob(iv), (c) => c.charCodeAt(0)),
      salt: Uint8Array.from(atob(salt), (c) => c.charCodeAt(0)),
    };
  }
  static async encryptText(
    text: string,
    opts: {
      aesKey: CryptoKey;
      iv: Uint8Array;
    }
  ) {
    const { aesKey, iv } = opts;

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      Buffer.from(text, "utf-8")
    );

    return {
      encrypted: new Uint8Array(encryptedData),
    };
  }
  static async encryptFile(
    file: { arrayBuffer: () => BufferSource | PromiseLike<BufferSource> },
    opts: {
      aesKey: CryptoKey;
      iv: Uint8Array;
    }
  ) {
    const { aesKey, iv } = opts;

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      await file.arrayBuffer()
    );

    return {
      encrypted: new Uint8Array(encryptedData),
    };
  }
}
