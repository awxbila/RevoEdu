"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const token = getTokenClient();
    apiFetch(`/api/quizzes/${id}`, {}, token)
      .then(setQuiz)
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Loading Quiz...</h1>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Quiz Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          {quiz.courseName || quiz.courseId}
        </p>
      </div>

      <div className="quiz-card">
        <div className="quiz-info">
          <p>
            <strong>Total Questions:</strong>{" "}
            {quiz.questions?.length || quiz.questionCount || 0}
          </p>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <div className="questions-container">
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((q: any, idx: number) => {
              let options: string[] = [];
              if (Array.isArray(q.options) && q.options.length > 0) {
                options = q.options;
              } else {
                options = [q.optionA, q.optionB, q.optionC, q.optionD].filter(
                  Boolean,
                ) as string[];
              }
              // Jawaban benar bisa berupa 'A', 'B', 'C', 'D' atau index
              let correctIdx = -1;
              if (typeof q.correctAnswer === "number")
                correctIdx = q.correctAnswer;
              else if (typeof q.correctAnswer === "string") {
                const idx = ["A", "B", "C", "D"].indexOf(q.correctAnswer);
                if (idx >= 0) correctIdx = idx;
              }
              return (
                <div key={idx} className="question-item">
                  <h3 className="question-number">Question {idx + 1}</h3>
                  <p className="question-text">{q.question}</p>
                  <div className="options-list">
                    {options.length > 0 ? (
                      options.map((option, optIdx) => (
                        <label
                          key={optIdx}
                          className="option-label"
                          style={
                            correctIdx === optIdx
                              ? {
                                  background: "#dcfce7",
                                  border: "1px solid #16a34a",
                                  fontWeight: 600,
                                }
                              : {}
                          }
                        >
                          <span className="option-text">
                            {String.fromCharCode(65 + optIdx)}. {option}
                            {correctIdx === optIdx && (
                              <span style={{ color: "#16a34a", marginLeft: 8 }}>
                                (Jawaban Benar)
                              </span>
                            )}
                          </span>
                        </label>
                      ))
                    ) : (
                      <span style={{ color: "#b91c1c", fontStyle: "italic" }}>
                        No options available
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div>Tidak ada soal.</div>
          )}
        </div>

        <div style={{ marginTop: 30, display: "flex", gap: 10 }}>
          <button className="btn-cancel" onClick={() => router.back()}>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
