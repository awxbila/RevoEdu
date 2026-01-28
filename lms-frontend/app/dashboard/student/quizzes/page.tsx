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
  questionCount?: number;
  isCompleted?: boolean;
  score?: number;
  deadline?: string;
};

export default function StudentQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    try {
      const token = getTokenClient();
      const data = await apiFetch<Quiz[]>("/api/quizzes/student", {}, token);
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Available Quizzes</h1>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <button
        className="btn-back"
        style={{ marginBottom: 16 }}
        onClick={() => router.push("/dashboard/student")}
      >
        ← Back to Dashboard
      </button>
      <div className="quiz-header">
        <h1>Available Quizzes</h1>
      </div>

      <table className="quiz-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Course</th>
            <th>Questions</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, idx) => {
            const now = new Date();
            const deadline = quiz.deadline ? new Date(quiz.deadline) : null;
            const isOverdue = deadline && now > deadline && !quiz.isCompleted;
            return (
              <tr key={quiz.id}>
                <td>{idx + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.courseName || quiz.courseId}</td>
                <td>{quiz.questionCount || 0}</td>
                <td>
                  {deadline
                    ? deadline.toLocaleString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </td>
                <td>
                  {quiz.isCompleted ? (
                    <span className="status-completed">Completed</span>
                  ) : isOverdue ? (
                    <span
                      className="status-overdue"
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      Overdue
                    </span>
                  ) : (
                    <span className="status-pending">Not Started</span>
                  )}
                </td>
                <td>{quiz.score !== undefined ? quiz.score : "-"}</td>
                <td>
                  {quiz.isCompleted ? (
                    <button
                      className="btn-view"
                      onClick={() =>
                        router.push(
                          `/dashboard/student/quizzes/${quiz.id}/result`,
                        )
                      }
                    >
                      View Result
                    </button>
                  ) : isOverdue ? (
                    <button
                      className="btn-overdue"
                      disabled
                      style={{
                        color: "white",
                        background: "red",
                        cursor: "not-allowed",
                      }}
                    >
                      Not Available
                    </button>
                  ) : (
                    <button
                      className="btn-start"
                      onClick={() =>
                        router.push(`/dashboard/student/quizzes/${quiz.id}`)
                      }
                    >
                      Start Quiz
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
