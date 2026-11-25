import { useState } from "react";
import { Camera, Pencil, Save, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const interestOptions = ["Male", "Female", "Both"];
const maxProfileImageSize = 5 * 1024 * 1024;

const getProfileForm = (user) => ({
  name: user?.name || "",
  age: user?.age ?? "",
  gender: user?.gender || "",
  interestedIn: user?.interestedIn || "",
  bio: user?.bio || "",
  image: user?.image || "",
});

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read the selected image."));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { loading, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => getProfileForm(authUser));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleImageChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > maxProfileImageSize) {
      toast.error("Choose a profile image smaller than 5 MB.");
      return;
    }

    try {
      const image = await readImageAsDataUrl(file);
      setFormData((currentData) => ({ ...currentData, image }));
    } catch (error) {
      console.error("Profile image could not be read:", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to read the selected image.",
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedUser = await updateProfile({
      ...formData,
      age: Number(formData.age),
    });

    if (updatedUser) {
      setFormData(getProfileForm(updatedUser));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(getProfileForm(authUser));
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">
            Your account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">My profile</h1>
          <p className="mt-1 text-slate-600">
            View and update the details people see on your profile.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
          <div className="h-28 bg-gradient-to-r from-pink-500 to-rose-400" />

          <div className="px-6 pb-8 sm:px-8">
            <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow">
                {formData.image ? (
                  <img
                    alt={`${formData.name || "Your"} profile`}
                    className="h-full w-full object-cover"
                    src={formData.image}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <User aria-hidden="true" size={48} />
                  </div>
                )}
              </div>

              {!isEditing && (
                <button
                  className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-pink-600 px-4 py-2.5 font-semibold text-white transition hover:bg-pink-700 sm:self-auto"
                  onClick={() => setIsEditing(true)}
                  type="button"
                >
                  <Pencil aria-hidden="true" size={17} />
                  Edit profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form
                aria-busy={loading}
                className="mt-8 space-y-5"
                onSubmit={handleSubmit}
              >
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                    htmlFor="profile-image"
                  >
                    Profile photo
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Camera aria-hidden="true" size={17} />
                    Choose image
                    <input
                      accept="image/*"
                      className="sr-only"
                      id="profile-image"
                      onChange={handleImageChange}
                      type="file"
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                      htmlFor="profile-name"
                    >
                      Name
                    </label>
                    <input
                      autoComplete="name"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      id="profile-name"
                      name="name"
                      onChange={handleChange}
                      required
                      type="text"
                      value={formData.name}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                      htmlFor="profile-age"
                    >
                      Age
                    </label>
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      id="profile-age"
                      max="120"
                      min="18"
                      name="age"
                      onChange={handleChange}
                      required
                      step="1"
                      type="number"
                      value={formData.age}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                      htmlFor="profile-gender"
                    >
                      Gender
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      id="profile-gender"
                      name="gender"
                      onChange={handleChange}
                      required
                      value={formData.gender}
                    >
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                      htmlFor="profile-interested-in"
                    >
                      Interested in
                    </label>
                    <select
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      id="profile-interested-in"
                      name="interestedIn"
                      onChange={handleChange}
                      required
                      value={formData.interestedIn}
                    >
                      {interestOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                    htmlFor="profile-email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-500"
                    id="profile-email"
                    readOnly
                    type="email"
                    value={authUser?.email || ""}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Email addresses cannot be changed here.
                  </p>
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                    htmlFor="profile-bio"
                  >
                    About me
                  </label>
                  <textarea
                    className="min-h-28 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    id="profile-bio"
                    name="bio"
                    onChange={handleChange}
                    placeholder="Tell people a little about yourself"
                    value={formData.bio}
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                    disabled={loading}
                    onClick={handleCancel}
                    type="button"
                  >
                    <X aria-hidden="true" size={17} />
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-2.5 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                    type="submit"
                  >
                    <Save aria-hidden="true" size={17} />
                    {loading ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {authUser?.name || "Your name"}
                  {authUser?.age ? (
                    <span className="ml-2 font-normal text-slate-500">
                      {authUser.age}
                    </span>
                  ) : null}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{authUser?.email}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Gender
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {authUser?.gender || "Not set"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Interested in
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      {authUser?.interestedIn || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    About me
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-slate-700">
                    {authUser?.bio || "Add a short bio to tell people about yourself."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
