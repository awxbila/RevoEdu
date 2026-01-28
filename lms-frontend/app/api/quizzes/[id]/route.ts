import { NextRequest, NextResponse } from "next/server";
import { mockQuizzes } from "../mockQuizzes";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const quiz = mockQuizzes.find((q) => q.id === id);

  if (!quiz) {
    return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
  }

  // Remove correctAnswer from questions when sending to client
  const sanitizedQuiz = {
    ...quiz,
    questions: quiz.questions.map(({ correctAnswer, ...q }) => q),
  };

  return NextResponse.json(sanitizedQuiz);
}
