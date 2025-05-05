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

  const handleCheckboxChange = (value: string, list: string[], setter: (val: string[]) => void) => {
    setter(list.includes(value) ? list.filter(item => item !== value) : [...list, value]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const token = await getAuth().currentUser?.getIdToken();
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
      const token = await getAuth().currentUser?.getIdToken();
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
    } catch (err: any) {
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

          <select className="mb-3 w-full border px-2 py-2" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <Input className="mb-3" type="number" placeholder="Age" value={age} onChange={e => setAge(Number(e.target.value))} />

          <div className="mb-4">
            <p className="font-medium mb-1">Lifestyle:</p>
            <div className="flex flex-wrap gap-2">
              {lifestyleOptions.map(option => (
                <label key={option} className="flex items-center gap-2">
                  <Checkbox checked={lifestyle.includes(option)} onCheckedChange={() => handleCheckboxChange(option, lifestyle, setLifestyle)} />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium mb-1">Interests:</p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(option => (
                <label key={option} className="flex items-center gap-2">
                  <Checkbox checked={interest.includes(option)} onCheckedChange={() => handleCheckboxChange(option, interest, setInterest)} />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="w-full bg-primary">Save Changes</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="w-full">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
