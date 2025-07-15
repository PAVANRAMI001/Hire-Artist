"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./upgrade.css";

export default function UpgradePage() {
  const router = useRouter();

  const avatarInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    
    roal: "",
    rate: "",
    phone: "",
    description: ""
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) body.append(key, val);
      });

      if (avatarFile) body.append("file", avatarFile);   // ⬅ avatar
      if (videoFile) body.append("video", videoFile);     // ⬅ video

      const res = await fetch("/api/upgrade-client", {
        method: "PUT",
        credentials: "include",
        body
      });

      if (!res.ok) throw new Error(await res.text());

      alert("You are now a developer! 🎉");
      router.push("/hiring");
    } catch (err) {
      setError(err.message || "Upgrade failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="upgrade-container">
      <h1>Upgrade to Developer</h1>
      <p>Fill the fields below to become a developer and start listing gigs.</p>

      <form className="upgrade-form" onSubmit={handleSubmit}>
        {error && <p className="upgrade-error">{error}</p>}

        {/* Avatar upload */}
        <div className="upgrade-avatar">
          {preview ? (
            <img src={preview} alt="avatar" />
          ) : (
            <div className="upgrade-placeholder">No&nbsp;Image</div>
          )}
          <button type="button" onClick={() => avatarInputRef.current?.click()}>
            Upload Avatar
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </div>

        {/* Form fields */}
        

        <label>
          Skill / Role
          <input name="roal" value={form.roal} onChange={handleChange} required />
        </label>

        <label>
          Rate (₹ / hr)
          <input name="rate" value={form.rate} onChange={handleChange} required />
        </label>

        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        {/* Video upload */}
        <label>
          Intro Video
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            onChange={handleVideoChange}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Upgrading…" : "Upgrade Now"}
        </button>
      </form>
    </div>
  );
}
