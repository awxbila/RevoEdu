"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

type Question = {
  id: string;
  question: string;
  options?: string[];
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
};

type Quiz = {
  id: string;
  title: string;
  courseId: string;
  courseName?: string;
  questions: Question[];
};

export default function TakeQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  // answers: { [questionId: string]: number } (index option yang dipilih)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  async function fetchQuiz() {
    try {
      const token = getTokenClient();
      const data = await apiFetch<Quiz>(`/api/quizzes/${quizId}`, {}, token);
      setQuiz(data);
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
      alert("Gagal memuat quiz");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerChange(questionId: string, optionIndex: number) {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  }

  async function handleSubmit() {
    if (!quiz) return;

    // Check if all questions are answered
    const unanswered = quiz.questions.filter(
      (q) => answers[q.id] === undefined,
    );
    if (unanswered.length > 0) {
      if (
        !confirm(
          `${unanswered.length} pertanyaan belum dijawab. Lanjutkan submit?`,
        )
      ) {
        return;
      }
    }

    // Build answers array: { questionId, selectedAnswer }[]
    // selectedAnswer: 'A' | 'B' | 'C' | 'D'
    const answerPayload = quiz.questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => {
        let idx = answers[q.id];
        let selectedAnswer = undefined;
        if (typeof idx === "number" && idx >= 0 && idx <= 3) {
          selectedAnswer = String.fromCharCode(65 + idx); // 0->A, 1->B, 2->C, 3->D
        }
        return {
          questionId: q.id,
          selectedAnswer,
        };
      });

    setSubmitting(true);
    try {
      const token = getTokenClient();
      const result = await apiFetch<{ score: number; totalQuestions: number }>(
        `/api/quizzes/${quizId}/submit`,
        {
          method: "POST",
          body: JSON.stringify({ answers: answerPayload }),
        },
        token,
      );

      setScore(result.score);
      setShowResult(true);
      // Redirect ke halaman quiz list setelah submit agar score langsung muncul
      setTimeout(() => {
        router.push("/dashboard/student/quizzes");
      }, 1200); // tampilkan result sebentar, lalu redirect
    } catch (err: any) {
      alert(err?.message || "Gagal submit quiz");
    } finally {
      setSubmitting(false);
    }
  }

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

  if (showResult) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Quiz Result</h1>
        </div>

        <div className="quiz-card result-card">
          <h2 style={{ marginBottom: 20, textAlign: "center" }}>
            {quiz.title}
          </h2>

          <div className="score-display">
            <div className="score-circle">
              <div className="score-number">{score}</div>
              <div className="score-total">/ {quiz.questions.length}</div>
            </div>
            <p style={{ marginTop: 20, fontSize: 18, textAlign: "center" }}>
              Correct Answers
            </p>
          </div>

          <div className="result-percentage">
            <strong>
              {((score / quiz.questions.length) * 100).toFixed(1)}%
            </strong>
          </div>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <button
              className="btn-primary"
              onClick={() => router.push("/dashboard/student/quizzes")}
            >
              Back to Quizzes
            </button>
          </div>
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
            <strong>Total Questions:</strong> {quiz.questions.length}
          </p>
          <p>
            <strong>Answered:</strong> {Object.keys(answers).length} /{" "}
            {quiz.questions.length}
          </p>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <div className="questions-container">
          {quiz.questions.map((q, idx) => {
            let options: string[] = [];
            if (Array.isArray(q.options) && q.options.length > 0) {
              options = q.options;
            } else {
              options = [q.optionA, q.optionB, q.optionC, q.optionD].filter(
                Boolean,
              ) as string[];
            }
            return (
              <div key={q.id} className="question-item">
                <h3 className="question-number">Question {idx + 1}</h3>
                <p className="question-text">{q.question}</p>
                <div className="options-list">
                  {options.length > 0 ? (
                    options.map((option, optIdx) => (
                      <label key={optIdx} className="option-label">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={answers[q.id] === optIdx}
                          onChange={() => handleAnswerChange(q.id, optIdx)}
                        />
                        <span className="option-text">
                          {String.fromCharCode(65 + optIdx)}. {option}
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
          })}
        </div>

        <div style={{ marginTop: 30, display: "flex", gap: 10 }}>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
          <button
            className="btn-cancel"
            onClick={() => router.push("/dashboard/student/quizzes")}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
