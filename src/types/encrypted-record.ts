export enum RecordType {
  text = "text",
  image = "image",
  unencrypted_json = "unencrypted_json",
}
export enum UnencryptedJsonType {
  emc = "encrypted-multiple-content",
}
export type UnencryptedJson = {
  type: UnencryptedJsonType;
  text_ar_id?: string;
  image_ar_id?: string;
};
