"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

type Quiz = {
  id: string;
  title: string;
  courseId: string;
  courseName?: string;
  createdAt: string;
  questionCount?: number;
};

export default function LecturerQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    try {
      const token = getTokenClient();
      const data = await apiFetch<Quiz[]>("/api/quizzes/lecturer", {}, token);
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuiz(id: string) {
    if (!confirm("Hapus quiz ini?")) return;
    try {
      const token = getTokenClient();
      await apiFetch(`/api/quizzes/${id}`, { method: "DELETE" }, token);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (err) {
      alert("Gagal menghapus quiz");
    }
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Quiz Management</h1>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Quiz Management</h1>
        <button
          className="btn-create-quiz"
          onClick={() => router.push("/dashboard/lecturer/quizzes/create")}
        >
          + Create Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="quiz-card">
          <p>Belum ada quiz. Klik "Create Quiz" untuk membuat quiz baru.</p>
        </div>
      ) : (
        <div className="quiz-card">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Quiz Title</th>
                <th>Course</th>
                <th>Questions</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, idx) => (
                <tr key={quiz.id}>
                  <td>{idx + 1}</td>
                  <td>{quiz.title}</td>
                  <td>{quiz.courseName || quiz.courseId}</td>
                  <td>{quiz.questionCount || 0}</td>
                  <td>{quiz.createdAt ? quiz.createdAt.slice(0, 10) : "-"}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() =>
                        router.push(`/dashboard/lecturer/quizzes/${quiz.id}`)
                      }
                    >
                      View
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteQuiz(quiz.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
