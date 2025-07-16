'use client';

import ThemeToggle from "./ThemeToggle";
import HireButton from "./HireButton";
import "./style.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { id } = useParams(); // get ID from URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/Get-Profile", {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid: id }),
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (!user) return <NotFound />;

  return (
    <>
      <ThemeToggle />

      <div className="profile-wrapper">
        <h1 id="artist-name">{user.name}&rsquo;s&nbsp;Profile</h1>

        <img
          className="profile-image"
          src={user.url}
          alt={user.name}
          width={280}
          height={280}
        />

        <div className="profile-details">
          <p><strong>Role:</strong> {user.roal}</p>
          <p><strong>Rate:</strong> ₹{user.rate}/hr</p>
          <p><strong>Description:</strong> {user.description}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>

        <HireButton name={user.name} />

        {user.Video && (
          <div className="video-container">
            <video controls>
              <source src={user.Video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "#fff" }}>
      <h1>❌ Artist not found</h1>
    </div>
  );
}
