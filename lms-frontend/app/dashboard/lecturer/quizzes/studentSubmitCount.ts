import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export async function getStudentSubmitCount(quizId: string): Promise<number> {
  const token = getTokenClient();
  // Ganti endpoint sesuai backend kamu jika berbeda
  const submissions = await apiFetch<any[]>(
    `/api/quizzes/${quizId}/submissions`,
    {},
    token,
  );
  return Array.isArray(submissions) ? submissions.length : 0;
}
