import { describe, it, expect, vi, beforeEach } from "vitest";

const { uploadMock } = vi.hoisted(() => ({ uploadMock: vi.fn() }));

vi.mock("cloudinary", () => ({
  v2: {
    uploader: { upload: uploadMock },
  },
}));

import { CloudinaryStorageAdapter } from "@/lib/storage/cloudinary-storage";

beforeEach(() => {
  uploadMock.mockReset();
});

describe("CloudinaryStorageAdapter", () => {
  it("uploads the buffer as a data URI and returns the secure_url", async () => {
    uploadMock.mockResolvedValue({
      secure_url: "https://res.cloudinary.com/demo/image/upload/v1/abc.png",
    });

    const adapter = new CloudinaryStorageAdapter();
    const buffer = Buffer.from("fake-image-bytes");

    const result = await adapter.upload({ buffer, mimeType: "image/png" });

    expect(uploadMock).toHaveBeenCalledTimes(1);
    const [dataUri] = uploadMock.mock.calls[0];
    expect(dataUri).toBe(`data:image/png;base64,${buffer.toString("base64")}`);
    expect(result.url).toBe(
      "https://res.cloudinary.com/demo/image/upload/v1/abc.png",
    );
  });

  it("propagates an error if the upload fails", async () => {
    uploadMock.mockRejectedValue(new Error("cloudinary is down"));

    const adapter = new CloudinaryStorageAdapter();
    await expect(
      adapter.upload({ buffer: Buffer.from("x"), mimeType: "image/jpeg" }),
    ).rejects.toThrow("cloudinary is down");
  });
});
