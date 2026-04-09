// Upload Image API
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/upload-image`,
    {
      method: "POST",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: formData,
    },
  );

  const data = await res.json();

  if (!res.ok || data?.status !== "OK") {
    throw new Error(data?.message || "Upload image gagal");
  }

  const imageUrl = data?.data?.imageUrl ?? data?.url ?? data?.data?.url ?? null;

  if (!imageUrl) {
    throw new Error("Image URL tidak valid");
  }

  return imageUrl;
}