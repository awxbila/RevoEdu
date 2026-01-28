"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerCoursesPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [courseName, setCourseName] = useState("");
  const [courseInfo, setCourseInfo] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [modules, setModules] = useState([
    { title: "", description: "", file: null as File | null, fileType: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState<string>("");
  const router = useRouter();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleModuleFileChange(
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0] || null;
    setModules((prev) =>
      prev.map((m, i) =>
        i === idx ? { ...m, file, fileType: file ? file.type : "" } : m,
      ),
    );
  }

  function handleModuleChange(idx: number, field: string, value: string) {
    setModules((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );
  }

  function addModule() {
    setModules((prev) => [
      ...prev,
      { title: "", description: "", file: null, fileType: "" },
    ]);
  }

  function removeModule(idx: number) {
    setModules((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    (async () => {
      setIsSubmitting(true);
      setSubmitProgress("Membuat course...");
      try {
        const token = getTokenClient();
        if (!token) {
          alert("Unauthorized. Silakan login dulu.");
          setIsSubmitting(false);
          setSubmitProgress("");
          return;
        }
        let body: FormData | string;
        let options: RequestInit;
        if (image) {
          // Jika upload image, pakai FormData
          body = new FormData();
          body.append("title", courseName);
          body.append("description", courseInfo);
          body.append("code", courseCode);
          body.append("image", image);
          options = { method: "POST", body };
        } else {
          // Tanpa image, pakai JSON
          body = JSON.stringify({
            title: courseName,
            description: courseInfo,
            code: courseCode,
          });
          options = { method: "POST", body };
        }
        // Push course
        const newCourse = await apiFetch<Course>(
          "/api/courses",
          options,
          token,
        );
        const courseId = newCourse.id || newCourse.data?.id;
        if (!courseId)
          throw new Error("Gagal mendapatkan id course dari backend");
        // Upload modules satu per satu
        for (let i = 0; i < modules.length; i++) {
          const mod = modules[i];
          if (!mod.title) continue; // title wajib
          if (mod.file) {
            // Validasi tipe dan ukuran file
            const allowedTypes = [
              "application/pdf",
              "video/mp4",
              "video/webm",
              "video/ogg",
            ];
            const maxSize = 25 * 1024 * 1024; // 25MB
            if (!allowedTypes.includes(mod.file.type)) {
              alert(`Tipe file module ke-${i + 1} tidak didukung.`);
              continue;
            }
            if (mod.file.size > maxSize) {
              alert(`Ukuran file module ke-${i + 1} melebihi 25MB.`);
              continue;
            }
          }
          setSubmitProgress(`Upload module ${i + 1} dari ${modules.length}...`);
          const modForm = new FormData();
          modForm.append("title", mod.title);
          if (mod.description) modForm.append("description", mod.description);
          if (mod.file) modForm.append("file", mod.file); // key file
          await apiFetch(
            `/api/courses/${courseId}/modules`,
            { method: "POST", body: modForm },
            token,
          );
        }
        setSubmitProgress("Selesai! Course & modules berhasil dipush.");
        setTimeout(() => {
          setSubmitProgress("");
          router.push("/dashboard/lecturer/activity");
        }, 1200);
        setCourseName("");
        setCourseInfo("");
        setCourseCode("");
        setImage(null);
        setImagePreview("");
        setModules([{ title: "", description: "", file: null, fileType: "" }]);
      } catch (err: any) {
        alert("Gagal push course/modules: " + (err?.message || err));
        setSubmitProgress("");
      } finally {
        setIsSubmitting(false);
      }
    })();
  }

  return (
    <AppShell>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}
      >
        {isSubmitting && (
          <div style={{ marginBottom: 16, color: "#0369a1", fontWeight: 600 }}>
            {submitProgress || "Sedang diproses..."}
          </div>
        )}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {/* Kiri: Upload Image */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ fontWeight: 600 }}>Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: 8 }}
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
          {/* Kanan: Info Course & Lecturer */}
          <div style={{ flex: 2 }}>
            <label style={{ fontWeight: 600 }}>Course Name</label>
            <input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              style={{
                width: "100%",
                marginBottom: 16,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
            <label style={{ fontWeight: 600 }}>Course Code</label>
            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
              style={{
                width: "100%",
                marginBottom: 16,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
            {/* Lecturer info fields removed as requested */}
          </div>
        </div>
        <label style={{ fontWeight: 600 }}>
          Course Info (Short Description)
        </label>
        <textarea
          value={courseInfo}
          onChange={(e) => setCourseInfo(e.target.value)}
          placeholder="Enter a short description about the course"
          required
          style={{
            width: "100%",
            marginBottom: 16,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ddd",
            minHeight: 60,
          }}
        />
        {/* Modules */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 16 }}>Modules</h3>
          {modules.map((mod, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <input
                  value={mod.title}
                  onChange={(e) =>
                    handleModuleChange(idx, "title", e.target.value)
                  }
                  placeholder={`Module ${idx + 1} Title`}
                  required
                  style={{
                    flex: 2,
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />
                {modules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeModule(idx)}
                    style={{
                      background: "#eee",
                      border: 0,
                      borderRadius: 6,
                      padding: "0 12px",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <textarea
                value={mod.description}
                onChange={(e) =>
                  handleModuleChange(idx, "description", e.target.value)
                }
                placeholder="Module Description"
                required
                style={{
                  width: "100%",
                  minHeight: 60,
                  marginBottom: 8,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="file"
                accept="application/pdf,video/*"
                onChange={(e) => handleModuleFileChange(idx, e)}
                style={{ marginBottom: 8 }}
              />
              {mod.file && (
                <div style={{ fontSize: 13, color: "#555" }}>
                  File: {mod.file.name} ({mod.fileType})
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addModule}
            style={{
              background: "#e0f2fe",
              color: "#0369a1",
              border: 0,
              borderRadius: 6,
              padding: "6px 18px",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            + Add Module
          </button>
        </div>
        {/* Push Button */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 32 }}
        >
          <button
            type="submit"
            style={{
              background: isSubmitting ? "#a3a3a3" : "#22c55e",
              color: "white",
              fontWeight: 700,
              fontSize: 18,
              border: 0,
              borderRadius: 8,
              padding: "12px 48px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Push"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

// Tambahkan tipe Course minimal sesuai kebutuhan id
interface Course {
  id: number;
  [key: string]: any;
}
