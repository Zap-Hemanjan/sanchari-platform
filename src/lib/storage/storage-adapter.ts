export interface UploadInput {
  buffer: Buffer;
  mimeType: string;
}

export interface UploadResult {
  url: string;
}

export interface StorageAdapter {
  upload(input: UploadInput): Promise<UploadResult>;
}
