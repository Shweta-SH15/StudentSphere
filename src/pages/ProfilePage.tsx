// export default ProfilePage;

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
const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

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

  // Fetch profile on mount (always from DB)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken(true);
        const res = await fetch(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load profile");
        setUser(data);
      } catch (err: any) {
        console.error("Error loading profile:", err);
        toast.error(err.message);
      }
    };
    if (getAuth().currentUser) fetchProfile();
  }, [setUser]);

  // Populate form when user changes
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setNationality(user.nationality || "");
    setInterest(user.interest || []);
    setLanguage(user.language || "");
    setBio(user.bio || "");
    setImage(user.profileImage || "");
    setGender(user.gender || "");
    setAge(user.age || "");
    setLifestyle(user.lifestyle || []);
  }, [user]);

  const handleCheckboxChange = (
    value: string,
    list: string[],
    setter: (val: string[]) => void
  ) => {
    setter(list.includes(value)
      ? list.filter(item => item !== value)
      : [...list, value]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const token = await getAuth().currentUser?.getIdToken(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE}/upload/profile`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImage(data.imageUrl);
      setUser(prev => prev ? { ...prev, profileImage: data.imageUrl } : null);
      toast.success("Profile image updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = await getAuth().currentUser?.getIdToken(true);
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
          lifestyle
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUser(data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const imgSrc = image.startsWith("http") ? image : `${SOCKET_URL}${image}`;

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Profile</h2>
      {!isEditing ? (
        <div className="space-y-4 text-left">
          <img
            src={imgSrc || "/uploads/default.png"}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
          <p><strong>Name:</strong>        {name}</p>
          <p><strong>Nationality:</strong> {nationality}</p>
          <p><strong>Interest:</strong>    {interest.join(", ")}</p>
          <p><strong>Language:</strong>    {language}</p>
          <p><strong>Bio:</strong>         {bio}</p>
          <p><strong>Gender:</strong>      {gender}</p>
          <p><strong>Age:</strong>         {age}</p>
          <p><strong>Lifestyle:</strong>   {lifestyle.join(", ")}</p>
          <Button onClick={() => setIsEditing(true)} className="w-full bg-primary">
            Edit Profile
          </Button>
        </div>
      ) : (
        <form className="space-y-4">
          <div className="text-center">
            <img
              src={imgSrc || "/uploads/default.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto object-cover mb-2"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>
          <Input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Nationality" value={nationality} onChange={e => setNationality(e.target.value)} />
          <div>
            <p className="mb-1 font-medium">Interest</p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(opt => (
                <label key={opt} className="flex items-center space-x-1">
                  <Checkbox
                    checked={interest.includes(opt)}
                    onCheckedChange={() =>
                      handleCheckboxChange(opt, interest, setInterest)
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <Input placeholder="Language" value={language} onChange={e => setLanguage(e.target.value)} />
          <Textarea placeholder="Your Bio" value={bio} onChange={e => setBio(e.target.value)} />
          <div>
            <p className="mb-1 font-medium">Gender</p>
            <select
              className="w-full rounded px-3 py-2 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] focus:outline-none focus:ring focus:ring-[hsl(var(--primary))]"
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              {genderOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

          </div>
          <Input
            type="number"
            placeholder="Age"
            value={age}
            onChange={e => setAge(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <div>
            <p className="mb-1 font-medium">Lifestyle</p>
            <div className="flex flex-wrap gap-2">
              {lifestyleOptions.map(opt => (
                <label key={opt} className="flex items-center space-x-1">
                  <Checkbox
                    checked={lifestyle.includes(opt)}
                    onCheckedChange={() =>
                      handleCheckboxChange(opt, lifestyle, setLifestyle)
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handleSave} className="flex-1 bg-primary">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
