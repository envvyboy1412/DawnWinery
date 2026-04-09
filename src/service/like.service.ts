type FetchOptions = {
  token: string;
};

// Like API
export async function likeFood(
  foodId: string,
  { token }: FetchOptions
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ foodId }),
    }
  );

  if (!response.ok) {
    throw new Error("Gagal like food");
  }
}

// Unlike API
export async function unlikeFood(
  foodId: string,
  { token }: FetchOptions
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/unlike`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ foodId }),
    }
  );

  if (!response.ok) {
    throw new Error("Gagal unlike food");
  }
}