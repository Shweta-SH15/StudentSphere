import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const ProfilePictureUploader = () => {
  const { user, updateUser } = useAuth(); // assuming updateUser updates user context + localStorage
  const [preview, setPreview] = useState(user?.profileImage ? `http://localhost:5000${user.profileImage}` : "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // show instant preview
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast("Please select an image file");

    setUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/api/upload/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("immigrantConnect_token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // ✅ Update user object
      const updatedUser = { ...user, profileImage: data.imageUrl };
      updateUser(updatedUser);
      toast("Profile picture updated!");

    } catch (err: any) {
      toast.error(err.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Profile Picture</h2>

      <div className="mb-4">
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover border mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <Button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="bg-primary hover:bg-secondary"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default ProfilePictureUploader;
