"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function ManageCourses() {
  const token = getTokenClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  async function load() {
    const data = await apiFetch<any[]>("/api/courses", {}, token);
    setCourses(data);
  }

  useEffect(() => {
    load();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();

    if (image) {
      // Upload dengan image
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      try {
        await fetch("/api/courses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        setTitle("");
        setImage(null);
        setImagePreview("");
        load();
      } catch (err) {
        alert("Gagal membuat course dengan image");
      }
    } else {
      // Upload tanpa image
      await apiFetch(
        "/api/courses",
        {
          method: "POST",
          body: JSON.stringify({ title }),
        },
        token
      );
      setTitle("");
      load();
    }
  }

  return (
    <AppShell>
      <h1>Manage Courses</h1>

      <form onSubmit={createCourse} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul course"
            required
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
              width: "100%",
              maxWidth: 300,
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ padding: 8 }}
          />
          {imagePreview && (
            <div style={{ marginTop: 12 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: 200,
                  maxHeight: 150,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
        <button type="submit" style={{ padding: "8px 16px", borderRadius: 6 }}>
          Tambah Course
        </button>
      </form>

      <div style={{ marginTop: 24 }}>
        <h2>Daftar Course</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {courses.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 16,
                border: "1px solid #ddd",
                borderRadius: 8,
                display: "flex",
                gap: 16,
              }}
            >
              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              )}
              <div>
                <h3 style={{ margin: "0 0 8px 0" }}>{c.title}</h3>
                <p style={{ margin: 0, color: "#666" }}>ID: {c.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
