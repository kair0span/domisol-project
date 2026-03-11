
import { createFileRoute } from '@tanstack/react-router'
import { fetchScore } from "#/lib/api";

export const Route = createFileRoute('/scores/$scoreId')({
  component: ScorePage,
  loader: ({ params }) => fetchScore(params.scoreId)

})

function ScorePage() {
  const score = Route.useLoaderData()
  const { title, composer, lyricist } = score;

  return (
    <div className='flex flex-col text-center mt-8'>
      <h1 className='text-3xl font-bold text-gray-300 mb-2'>{title}</h1>
      <h2 className='text-xl font-bold text-gray-300 mb-4'> {composer}</h2>
      <h2 className='text-xl font-bold text-gray-300 mb-4'> {lyricist}</h2>
    </div>)
}

