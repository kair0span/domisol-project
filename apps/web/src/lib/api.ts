import type { ScoreResponse, CreateScore } from "@repo/schemas";
const API_URL = import.meta.env.VITE_API_URL;

export type { CreateScore };

export const fetchScores = async () => {
  return new Promise<ScoreResponse[]>((resolve) => {
    setTimeout(async () => {
      const res = await fetch(`${API_URL}/scores/`);
      const data = await res.json();
      resolve(data);
    }, 150);
  });
};

export const fetchScore = async (scoreId: string) => {
  const res = await fetch(`${API_URL}/scores/${scoreId}`);
  const score: ScoreResponse = await res.json();
  return score;
};

export const addScore = async (score: CreateScore) => {
  const res = await fetch(`${API_URL}/scores/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(score),
  });
  const data: CreateScore = await res.json();
  return data;
};

export const updateScore = async (scoreId: string, score: CreateScore) => {
  const res = await fetch(`${API_URL}/scores/${scoreId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(score),
  });
  const data: CreateScore = await res.json();
  return data;
};

export const deleteScore = async (scoreId: string) => {
  const res = await fetch(`${API_URL}/scores/${scoreId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return res.json();
};
