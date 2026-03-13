import { Separator } from "./ui/separator"



const Footer = () => {
  return (
    <footer>
      <Separator />
      <div className='mx-auto flex max-w-7xl justify-center px-4 py-4 sm:px-6'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`}{' '}
          <a href='#' className='hover:underline'>
            DOMISOL
          </a>

        </p>
      </div>
    </footer>
  )
}

export default Footer