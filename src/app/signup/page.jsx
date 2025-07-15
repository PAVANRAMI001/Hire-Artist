'use client';
import { useState, useRef , useEffect} from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

export default function UploadPage() {
  const route=useRouter();
  const [type_custumer, setTypeCustumer] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [roal, setRoal] = useState('');
  const [rate, setRate] = useState('');
  const [description, setDesctiption] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const videoInputRef = useRef();

  useEffect(() => {
    let timer; // ✅ define it in the outer scope
  
    if (status === "✅ Signup Sucessful!") {
      timer = setTimeout(() => {
        route.replace('/');   // ⏰ Go home after 3s
      }, 1500);
    }
  
    return () => clearTimeout(timer); // ✅ always safe
  }, [status]);
  
  const handleUpload = async () => {
    if (!userName || !password) {
      setStatus('⚠️ Please fill in both fields!');
      return;
    }
  
    setLoading(true); // ✅ Start loading
    setStatus('');
  
    const formData = new FormData();
    formData.append('name', userName);
    formData.append('password', password);
  
    if (type_custumer === "Developer") {
      formData.append('file', selectedFile);
      formData.append('roal', roal);
      formData.append('rate', rate);
      formData.append('description', description);
      formData.append('phone', phone);
      formData.append('Video', selectedVideo);
    }
  
    try {
      const res = await fetch(`/api/upload/${type_custumer}`, {
        method: 'POST',
        body: formData,
      });
  
      const result = await res.json();
      setStatus(result.success ? '✅ Signup Sucessful!' : '❌ Signup failed OR id may already exist!');
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('❌ Upload failed.');
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };
  

  const handleFileDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (type === 'image') setSelectedFile(file);
    else if (type === 'video') setSelectedVideo(file);
  };

  return (
    <div className="upload-container">
      <div className="floating-bg"></div>

      {!type_custumer && (
        <div className="choose-wrapper fade-in">
          <h2>Choose your role to start</h2>
          <button onClick={() => setTypeCustumer("Custumer")} className="choose-btn">I’m a Customer</button>
          <button onClick={() => setTypeCustumer("Developer")} className="choose-btn">I’m a Developer</button>
        </div>
      )}

      {type_custumer && (
        <div className="upload-card glass fade-in-up">
          <h1>🚀 Upload Your Profile</h1>
          <p className="sub-text">Let’s get you on board!</p>

          <input className="input" type="text" placeholder="👤 Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input className="input" type="password" placeholder="🔒 Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {type_custumer === "Developer" && (
            <>
              <input className="input" type="text" placeholder="🎯 Role" value={roal} onChange={(e) => setRoal(e.target.value)} />
              <input className="input" type="text" placeholder="💰 Rate" value={rate} onChange={(e) => setRate(e.target.value)} />
              <input className="input" type="text" placeholder="📝 Description" value={description} onChange={(e) => setDesctiption(e.target.value)} />
              <input className="input" type="text" placeholder="📞 Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <div
                className="drop-zone"
                name="image"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFileDrop(e, 'image')}
                onClick={() => fileInputRef.current.click()}
              >
                {selectedFile ? <p>📸 {selectedFile.name}</p> : <p>📸 Drop or click to upload profile picture</p>}
                <input ref={fileInputRef} type="file" hidden onChange={(e) => setSelectedFile(e.target.files[0])} />
              </div>

              <div
                className="drop-zone"
                name="Video"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFileDrop(e, 'video')}
                onClick={() => videoInputRef.current.click()}
              >
                {selectedVideo ? <p>🎥 {selectedVideo.name}</p> : <p>🎥 Drop or click to upload intro video</p>}
                <input ref={videoInputRef} type="file" hidden onChange={(e) => setSelectedVideo(e.target.files[0])} />
              </div>
            </>
          )}

<button
  onClick={handleUpload}
  className="upload-btn"
  disabled={loading}
>
  {loading ? 'Signing...' : 'Submit 🚀'}
</button>

          {status && <p className="status">{status}</p>}
          
        </div>
      )}
    </div>
  );
}
