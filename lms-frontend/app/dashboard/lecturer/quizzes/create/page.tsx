"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Course = {
  id: string;
  title: string;
};

type Question = {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-3)
};

export default function CreateQuizPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const data = await apiFetch<Course[]>("/api/courses");
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  }

  function addQuestion() {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  }

  function removeQuestion(index: number) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  function updateQuestion(index: number, field: string, value: any) {
    const updated = [...questions];
    if (field === "question") {
      updated[index].question = value;
    } else if (field === "correctAnswer") {
      updated[index].correctAnswer = parseInt(value);
    }
    setQuestions(updated);
  }

  function updateOption(qIndex: number, optIndex: number, value: string) {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!title || !courseId) {
      alert("Judul quiz dan course harus diisi");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question) {
        alert(`Pertanyaan #${i + 1} tidak boleh kosong`);
        return;
      }
      if (q.options.some((opt) => !opt)) {
        alert(`Semua opsi pada pertanyaan #${i + 1} harus diisi`);
        return;
      }
    }

    setLoading(true);
    try {
      await apiFetch("/api/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title,
          courseId,
          questions,
        }),
      });
      alert("Quiz berhasil dibuat!");
      router.push("/dashboard/lecturer/quizzes");
    } catch (err: any) {
      alert(err?.message || "Gagal membuat quiz");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Create New Quiz</h1>
      </div>

      <div className="quiz-card">
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="form-group">
            <label className="form-label">Quiz Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-input"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 15 }}>Questions</h3>
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="question-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <h4>Question #{qIdx + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => removeQuestion(qIdx)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Question Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(qIdx, "question", e.target.value)
                    }
                    placeholder="Enter question"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Options</label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} style={{ marginBottom: 8 }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correctAnswer === optIdx}
                          onChange={() =>
                            updateQuestion(qIdx, "correctAnswer", optIdx)
                          }
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={opt}
                          onChange={(e) =>
                            updateOption(qIdx, optIdx, e.target.value)
                          }
                          placeholder={`Option ${String.fromCharCode(
                            65 + optIdx
                          )}`}
                          required
                          style={{ flex: 1 }}
                        />
                      </label>
                    </div>
                  ))}
                  <small
                    style={{ color: "#666", display: "block", marginTop: 5 }}
                  >
                    Select the correct answer by clicking the radio button
                  </small>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-question"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Creating..." : "Create Quiz"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
