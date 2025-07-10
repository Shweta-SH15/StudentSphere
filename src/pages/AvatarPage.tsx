import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import getAvatarUrl from "@/lib/getAvatarUrl";

const AvatarPage = () => {
  const { user, token, updateUser } = useAuth();
  const [avatarConfig, setAvatarConfig] = useState("");

  useEffect(() => {
    if (user?.avatarConfig) {
      setAvatarConfig(user.avatarConfig);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatarConfig })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save avatar");

      updateUser(data); // update AuthContext user
      alert("Avatar saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save avatar");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Customize Your Avatar</h2>

      <div className="flex flex-col items-center gap-6">
        <iframe
          src="https://getavataaars.com/"
          title="Avatar Editor"
          width="350"
          height="420"
          className="rounded-lg border-2"
        />

        <label className="text-lg">
          Paste Your Avatar Config Here:
          <input
            type="text"
            value={avatarConfig}
            onChange={(e) => setAvatarConfig(e.target.value)}
            className="mt-2 w-full max-w-md p-2 rounded text-black"
            placeholder="e.g. topType=ShortHair&..."
          />
        </label>

        <img
          src={getAvatarUrl(avatarConfig)}
          alt="Preview Avatar"
          className="w-40 h-40 rounded-full bg-white"
        />

        <button
          onClick={handleSave}
          className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold"
        >
          Save Avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarPage;
