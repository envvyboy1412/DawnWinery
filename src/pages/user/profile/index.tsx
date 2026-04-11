import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Toaster, toast } from "sonner";
import { getMyProfile, updateProfile } from "@/service/user.service";
import { uploadImage } from "@/service/images.service";
import imageCompression from "browser-image-compression";

export default function ProfilePage() {
  useAuthGuard();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await getMyProfile(token);
      setUser(data);
      setPreviewImage(data.profilePictureUrl ?? "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenModal = () => {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setPhoneNumber(user.phoneNumber ?? "");
    setProfilePicture(null);
    setOpenModal(true);
  };


const handleFileChange = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    toast.error("File harus berupa gambar");
    return;
  }

  let finalFile = file;

  if (file.size > 1 * 1024 * 1024) {
    finalFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });
  }

  setProfilePicture(finalFile);
  setPreviewImage(URL.createObjectURL(finalFile));
};

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    let profilePictureUrl: string | undefined;

    if (profilePicture) {
      profilePictureUrl = await uploadImage(profilePicture);
    }

    await updateProfile({
      token,
      name,
      email,
      phoneNumber,
      profilePictureUrl,
    });

    toast.success("Profil berhasil diperbarui 🎉");
    window.dispatchEvent(new Event("user-updated"));
    setOpenModal(false);
    fetchProfile();
  } catch (err: any) {
    console.log(err);


    toast.error(err.message || "Gagal memperbarui profil");
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-[#3E3F29]">
      <Navbar />

      <main className="flex-1 px-6 py-12">
        <section className="max-w-3xl mx-auto rounded-2xl p-6 border-0 shadow-lg shadow-[#7D8D86] bg-[#7D8D86] ">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {user && (
            <>
              <h1 className="text-3xl font-bold mb-8 text-[#F1F0E4] text-center">
                MY ACCOUNT
              </h1>

              <div className="flex flex-col items-center text-center p-4 space-y-3">
                <img
                  src={user.profilePictureUrl || "/avatar-placeholder.png"}
                  className="w-32 h-32 rounded-full object-cover"
                />

                <h2 className="text-xl font-semibold text-[#F1F0E4]">
                  {user.name}
                </h2>
                <p className="text-[#F1F0E4]">{user.email}</p>
                <p className="capitalize text-[#F1F0E4]">{user.role}</p>
                <p className="text-[#F1F0E4]">{user.phoneNumber}</p>

                <button
                  onClick={handleOpenModal}
                  className="mt-4 px-4 py-2 bg-[#BCA88D] text-white rounded"
                >
                  Update Profile
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />

      <Toaster position="top-center" richColors />

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl p-6 bg-[#3E3F29]">
            <h2 className="text-xl font-bold text-center mb-6 text-[#F1F0E4]">
              Edit User Profile
            </h2>

            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#7D8D86]"
                placeholder="Name"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#7D8D86]"
                placeholder="Email"
              />

              <div className="flex flex-col items-center gap-3">
                <img
                  src={previewImage || "/avatar-placeholder.png"}
                  className="w-40 h-40 object-cover rounded-md"
                />

                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer px-4 py-2 rounded bg-[#7D8D86] text-white text-sm"
                >
                  Pilih Foto
                </label>
              </div>

              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded px-3 py-2 bg-[#7D8D86]"
                placeholder="Phone Number"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}