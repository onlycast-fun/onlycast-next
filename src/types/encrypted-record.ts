export enum RecordType {
  text = "text",
  image = "image",
  mixed = "mixed",
}
export enum UnencryptedJsonType {
  mc = "mixed-content",
}
export type UnencryptedJson = {
  type: UnencryptedJsonType;
  text_ar_id?: string;
  image_ar_id?: string;
};

export type EncryptedRecord = {
  type: RecordType;
  ar_id: string;
  user_id: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
};
