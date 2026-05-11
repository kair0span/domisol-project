


const Footer = () => {
  return (
    <footer>
      <div className='mx-auto flex max-w-7xl justify-center px-4 py-4 sm:px-6'>
        <p className='text-center text-balance text-sm'>
          {`©${new Date().getFullYear()}`}{' '}
          <a href='https://kireva.de' className='hover:underline'>
            DOMISOL
          </a>

        </p>
      </div>
    </footer>
  )
}

export default Footer