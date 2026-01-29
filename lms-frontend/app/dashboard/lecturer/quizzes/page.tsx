"use client";

import { useEffect, useState } from "react";
import { getStudentSubmitCount } from "./studentSubmitCount";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";
const QuizSubmissionsModal = dynamic(() => import("./QuizSubmissionsModal"), {
  ssr: false,
});

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
  const [submitCounts, setSubmitCounts] = useState<{
    [quizId: string]: number;
  }>({});
  const [modalQuizId, setModalQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    try {
      const token = getTokenClient();
      // Ambil semua course yang dipegang dosen
      const courses = await apiFetch<any[]>(
        "/api/courses/my-courses",
        {},
        token,
      );
      // Fetch semua quiz dari setiap course
      const allQuizzes = await Promise.all(
        courses.map((c) =>
          apiFetch<Quiz[]>(`/api/quizzes/course/${c.id}`, {}, token).catch(
            () => [],
          ),
        ),
      );
      // Map courseName ke setiap quiz
      const quizzesWithCourseName = allQuizzes.flat().map((quiz) => {
        const course = courses.find((c: any) => c.id == quiz.courseId);
        return { ...quiz, courseName: course ? course.title : quiz.courseId };
      });
      setQuizzes(quizzesWithCourseName);

      // Fetch jumlah student submit untuk setiap quiz
      const submitCountsObj: { [quizId: string]: number } = {};
      await Promise.all(
        quizzesWithCourseName.map(async (quiz) => {
          try {
            submitCountsObj[quiz.id] = await getStudentSubmitCount(quiz.id);
          } catch {
            submitCountsObj[quiz.id] = 0;
          }
        }),
      );
      setSubmitCounts(submitCountsObj);
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
                <th>Student Submit</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, idx) => (
                <tr key={quiz.id}>
                  <td>{idx + 1}</td>
                  <td>{quiz.title}</td>
                  <td>{quiz.courseName}</td>
                  <td>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 15,
                        textDecoration: "underline",
                      }}
                      onClick={() => setModalQuizId(quiz.id)}
                    >
                      {typeof submitCounts[quiz.id] === "number"
                        ? submitCounts[quiz.id]
                        : 0}
                    </button>
                  </td>
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
          {modalQuizId && (
            <QuizSubmissionsModal
              quizId={modalQuizId}
              open={!!modalQuizId}
              onClose={() => setModalQuizId(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
