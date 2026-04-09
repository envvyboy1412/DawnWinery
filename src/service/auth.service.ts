// Register User API
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
  role: "user" | "admin";
  phoneNumber: string;
  profilePictureUrl: string;
};

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Register gagal");
  }

  return data;
}

type LoginPayload = {
  email: string;
  password: string;
};

// Login User API
export async function loginUser(payload: LoginPayload) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Email atau password salah",
    );
  }

  return {
    token: data.token,
    role: data.user.role,
  };
}

//Logout User API
export async function logout(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apiKey: process.env.NEXT_PUBLIC_API_KEY as string,
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Logout gagal");
  }

  return json;
}