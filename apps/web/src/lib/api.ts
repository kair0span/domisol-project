import type { Score } from "@repo/schemas";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchScores = async () => {
    return new Promise<Score[]>((resolve) => {
        setTimeout(async () => {
            const res = await fetch(`${API_URL}/scores/`);
            const data = await res.json();
            resolve(data);
        }, 150);
    });
};

export const fetchScore = async (scoreId: string) => {
    const res = await fetch(`${API_URL}/scores/${scoreId}`)
    const score: Score = await res.json()
    return score
}
