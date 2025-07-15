"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./profileSidebar.css";

export default function ProfileSidebar({ onClose }) {
  const router = useRouter();
  const fileInput = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [isView, setView] = useState(false);
  

  const [preview, setPreview] = useState("");
  // ⬆️  put this just above your render/return block

  const [form, setForm] = useState({
    user_roal: "",
    name: "",
    password: "",
    description: "",
    roal: "",
    rate: "",
    phone: "",
    url: "",
    Video: ""
  });

  const fetchedOnce = useRef(false);
  
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    (async () => {
      try {
        const authRes = await fetch("/api/auth-user", { credentials: "include" });
        if (!authRes.ok) return router.push("/login");

        const { username } = await authRes.json();
        const profRes = await fetch("/api/find-loggedUser-data", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });

        if (!profRes.ok) throw new Error(await profRes.text());
        const profile = await profRes.json();

        setForm({
          user_id:profile._id,
          user_roal: profile.user_roal || "",
          name: profile.name || "",
          password: "",
          description: profile.description || "",
          roal: profile.roal || "",
          rate: profile.rate || "",
          phone: profile.phone || "",
          url: profile.url || "",
          Video: profile.Video || ""
        });

        setPreview(profile.url || "");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);


  useEffect(() => {
    if (isView && form.user_id) {
      router.push(`/hiring/${form.user_id}`);
    }
  }, [isView, form.user_id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, file }));
  };
  const handleVideoChange=(e)=>{
    const video=e.target.files[0];
    if(!video) return;
    setForm((prev)=>({...prev,video }));
  }
  const deleteProfile=async ()=>{
    const res=await fetch('/api/delete-profile', {
      method: "DELETE",
      credentials: "include"
    });
    const result=await res.json();
    if(result){
      alert("The Profile Deleted!");
      router.push("/");
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") body.append(k, v);
      });
      const res = await fetch("/api/update-profile", {
        method: "PUT",
        credentials: "include",
        body
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Profile updated 🎉");
      onClose?.();
      router.refresh();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const isClient = form.user_roal === "custumer";
  if (loading) return <div className="ps-loader">Loading…</div>;

  return (
    <div className="ps-container glass">
      <button className="ps-close" onClick={onClose}>✖</button>
      <h2>Your Profile</h2>
      {isClient ? (
        <div className="be-member fade-in">
          <h2>WelCome!, Mr.{form.name}</h2>
          <h2>Be&nbsp;our&nbsp;member!</h2>
          <p>Unlock premium features by upgrading your membership.</p>
          <button className="btn primary" onClick={() => router.push("/upgrade-client")}>
            Upgrade&nbsp;Now
          </button>
          <button className="btn logout" onClick={async () => {
            await fetch("/api/logout", { credentials: "include" });
            router.push("/");
          }}>
            🚪 Logout
          </button>
        </div>
      ) : (
        <>
        <div className="cont">
          <div className="ps-avatar pulse">
            {preview ? (
              <img src={preview} alt="avatar" />
            ) : (
              <div className="ps-placeholder">No&nbsp;Image</div>
            )}
          </div>

          <h3>{form.name}</h3>
          <div className="button-row">
            <button className="btn" onClick={() =>{ setView(true);
              setEdit(false)
            }}>👁 View Your Profile!</button>
            <button className="btn" onClick={() =>{
               setEdit(true);
               setView(false)}}>✏ Edit Your Profile!</button>
          </div>

          

          {isEdit && (
            <>
            <form className="fade-in profile-edit" onSubmit={handleSubmit}>
              <h2>Edit Profile</h2>
              {error && <p className="ps-error">{error}</p>}

              
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFile}
              />
              <button
                type="button"
                className="btn"
                onClick={() => fileInput.current?.click()}
              >
                Update Image
              </button>

              name:<input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
              password:<input name="password" type="password" value={form.password} onChange={handleChange} placeholder="New Password" />
              description:<textarea name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Description" />
              roal:<input name="roal" value={form.roal} onChange={handleChange} placeholder="Role" />
              rate:<input name="rate" value={form.rate} onChange={handleChange} placeholder="Rate (₹/hr)" />
              phone:<input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
              Video:<input type="file" name="Video" onChange={handleVideoChange} placeholder="Demo Video URL" />
              <div className="btn-row">
              <button className="btn save" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
              </div>
            </form>
            <div className="btn-row">
            <button className="delete btn" onClick={()=>deleteProfile()}>
              Delete Your Profile!
            </button>
            </div>
            </>
          )}

          <button className="btn logout" onClick={async () => {
            await fetch("/api/logout", { credentials: "include" });
            router.push("/");
          }}>
            🚪 Logout
          </button>
          </div>
        </>
      )}
    </div>
  );
}
