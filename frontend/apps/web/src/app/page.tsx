import PagesOverview from '@/components/PagesOverview'
import UserSession from '@/components/UserSession'

const Home = async () => {
  return (
    <div className="bg-cover bg-center text-black min-h-screen flex flex-col">
      <div className="flex-grow">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black md:text-5xl lg:text-6xl text-center">
          PhoBaoBao
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-400 lg:text-xl sm:px-16 xl:px-48 text-center">
          Monitor your baby.
        </p>
        <UserSession />
      </div>
      <hr className="my-8 border-gray-700" />
      <PagesOverview />
    </div>
  )
}

export default Home
