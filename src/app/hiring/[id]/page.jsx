import { connectDB } from "@/app/utils/db";
import { ProfilePic } from "@/app/api/models/profile";
import ThemeToggle from "./ThemeToggle"; // 👈 add the switcher
import HireButton from "./HireButton";

import "./style.css";                  // 👈 load the fancy styles

/* Pre‑render artist pages */
export async function generateStaticParams() {
  await connectDB();
  const users = await ProfilePic.find({ user_roal: "artist" });
  return users.map((u) => ({ id: u._id.toString() }));
}

export default async function ProfilePage({ params }) {
  const { id } =await params;
  await connectDB();

  const user = await ProfilePic.findOne({ _id: id, user_roal: "artist" });
  if (!user) return <NotFound />;

  return (
    <>
      <ThemeToggle />

      <div className="profile-wrapper">
        <h1 id="artist-name">{user.name}&rsquo;s&nbsp;Profile</h1>

        {/* Avatar */}
        <img
          className="profile-image"
          src={user.url}
          alt={user.name}
          width={280}
          height={280}
        />

        {/* Details */}
        <div className="profile-details">
          <p>
            <strong>Role:</strong> {user.roal}
          </p>
          <p>
            <strong>Rate:</strong> ₹{user.rate}/hr
          </p>
          <p>
            <strong>Description:</strong> {user.description}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
        </div>

        {/* Hire button */}
        <HireButton name={user.name} />


        {/* Demo video */}
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

/* Very simple fallback UI */
function NotFound() {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "#fff" }}>
      <h1>❌ Artist not found</h1>
    </div>
  );
}
