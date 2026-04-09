type FetchOptions = {
  token: string;
};

// Get All Food API
export async function getFoods({ token }: FetchOptions) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/foods`,
    {
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil data food");
  }

  return result.data;
}

// Get User Like Food API
export async function getFavoriteFoods({ token }: { token: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/like-foods`,
    {
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil favorite food");
  }

  return data.data;
}

// Get Food By ID API
export async function getFoodDetail(
  foodId: string,
  { token }: FetchOptions
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/foods/${foodId}`,
    {
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Food tidak ditemukan");
  }

  return result.data;
}

// ================= ADMIN FOOD API ================= //
type AdminFetchOptions = {
  token: string;
};

// Creat Food
export async function adminCreateFood(
  payload: {
    name: string;
    description: string;
    ingredients: string[];
    price: number;
    imageUrl: string;
  },
  { token }: { token: string }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/create-food`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Gagal menambah food");
  }

  return data;
}

// Update Food
export async function adminUpdateFood(
  foodId: string,
  payload: {
    name: string;
    description: string;
    ingredients: string[];
    price: number;
    imageUrl: string;
  },
  { token }: { token: string }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/update-food/${foodId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Gagal update food");
  }

  return data;
}

// Delete Food
export async function adminDeleteFood(
  foodId: string,
  { token }: AdminFetchOptions
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/delete-food/${foodId}`,
    {
      method: "DELETE",
      headers: {
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal hapus food");
  }

  return result.data;
}