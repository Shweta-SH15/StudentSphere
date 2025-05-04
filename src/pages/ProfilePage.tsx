import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE, SOCKET_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem("immigrantConnect_token");

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [interest, setInterest] = useState("");
  const [language, setLanguage] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setNationality(user.nationality || "");
      setInterest(user.interest || "");
      setLanguage(user.language || "");
      setBio(user.bio || "");
      setImage(user.profileImage || "");
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const res = await fetch(`${API_BASE}/upload/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImage(data.imageUrl);
      toast("Profile image updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, nationality, interest, language, bio, profileImage: image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUser(data);
      localStorage.setItem("immigrantConnect_user", JSON.stringify(data));
      toast("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

      <div className="mb-4 text-center">
        <img
          src={image ? `${SOCKET_URL}${image}` : "/uploads/default.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto object-cover"
        />
        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
      </div>

      <Input className="mb-3" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <Input className="mb-3" placeholder="Nationality" value={nationality} onChange={e => setNationality(e.target.value)} />
      <Input className="mb-3" placeholder="Interest" value={interest} onChange={e => setInterest(e.target.value)} />
      <Input className="mb-3" placeholder="Language" value={language} onChange={e => setLanguage(e.target.value)} />
      <Textarea className="mb-4" placeholder="Your Bio" value={bio} onChange={e => setBio(e.target.value)} />

      <Button onClick={handleSave} className="w-full bg-primary hover:bg-secondary">Save Changes</Button>
    </div>
  );
};

export default ProfilePage;
