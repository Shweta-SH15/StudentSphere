import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE, SOCKET_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { getAuth } from "firebase/auth";

const lifestyleOptions = ["Non-smoker", "Early Riser", "Night Owl", "Pet Lover", "Clean"];
const interestOptions = ["Sports", "Music", "Travel", "Food", "Movies"];

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [interest, setInterest] = useState<string[]>([]);
  const [language, setLanguage] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Populate form fields with user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setNationality(user.nationality || "");
      setInterest(user.interest || []);
      setLanguage(user.language || "");
      setBio(user.bio || "");
      setImage(user.profileImage || "");
      setGender(user.gender || "");
      setAge(user.age || "");
      setLifestyle(user.lifestyle || []);
    }
  }, [user]);

  // ✅ Handle checkbox changes for interests and lifestyle
  const handleCheckboxChange = (value: string, list: string[], setter: (val: string[]) => void) => {
    setter(list.includes(value) ? list.filter(item => item !== value) : [...list, value]);
  };

  // ✅ Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const token = await getAuth().currentUser?.getIdToken(true); // Force refresh
      const res = await fetch(`${API_BASE}/upload/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const imageUrl = data.imageUrl;
      setImage(imageUrl);
      setUser((prevUser) => prevUser ? { ...prevUser, profileImage: imageUrl } : null);
      localStorage.setItem("immigrantConnect_user", JSON.stringify({ ...user, profileImage: imageUrl }));
      toast.success("Profile image updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ProfilePage.tsx

const handleSave = async () => {
  try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
          console.error("User not authenticated");
          toast.error("User not authenticated");
          return;
      }

      // Force refresh token to avoid expired tokens
      const token = await currentUser.getIdToken(true);
      console.log("Token:", token);

      const res = await fetch(`${API_BASE}/profile`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              name,
              nationality,
              interest,
              language,
              bio,
              profileImage: image,
              gender,
              age,
              lifestyle,
          }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUser(data);
      localStorage.setItem("immigrantConnect_user", JSON.stringify(data));
      toast("Profile updated successfully!");
      setIsEditing(false);
  } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err.message || "Failed to update profile");
  }
};


  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Profile</h2>

      {!isEditing ? (
        <div className="space-y-4 text-left">
          <img src={image ? `${SOCKET_URL}${image}` : "/uploads/default.png"} className="w-24 h-24 rounded-full mx-auto object-cover" />
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Nationality:</strong> {nationality}</p>
          <p><strong>Interest:</strong> {interest.join(", ")}</p>
          <p><strong>Language:</strong> {language}</p>
          <p><strong>Bio:</strong> {bio}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Age:</strong> {age}</p>
          <p><strong>Lifestyle:</strong> {lifestyle.join(", ")}</p>
          <Button onClick={() => setIsEditing(true)} className="w-full bg-primary">Edit Profile</Button>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-center">
            <img src={image ? `${SOCKET_URL}${image}` : "/uploads/default.png"} alt="Profile" className="w-24 h-24 rounded-full mx-auto object-cover" />
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </div>

          <Input className="mb-3" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <Input className="mb-3" placeholder="Nationality" value={nationality} onChange={e => setNationality(e.target.value)} />
          <Input className="mb-3" placeholder="Language" value={language} onChange={e => setLanguage(e.target.value)} />
          <Textarea className="mb-4" placeholder="Your Bio" value={bio} onChange={e => setBio(e.target.value)} />

          <Button onClick={handleSave} className="w-full bg-primary">Save Changes</Button>
          <Button onClick={() => setIsEditing(false)} variant="outline" className="w-full">Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
