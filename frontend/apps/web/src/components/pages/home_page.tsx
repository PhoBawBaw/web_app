import Link from 'next/link';

const StartScreen: React.FC = () => {
    return (
        <div className="relative w-screen h-screen bg-[#22c7a9] flex flex-col items-center justify-center overflow-hidden">
            <img
                className="w-[300px] h-[300px] mb-8"
                alt="Baby monitoring illustration"
                src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-30@2x.png"
            />

            <div className="text-center">
                <h1 className="text-[33px] font-extrabold text-white">Baby Monitoring</h1>
                <p className="text-white text-sm font-light mt-2">Order your favorite Meals</p>
            </div>

            {/* Button container */}
            <div className="mt-12 flex space-x-4">
                {/* Login Button */}
                <Link href="/login" passHref>
                    <div className="bg-[#2db6a3] text-white text-[22px] font-bold py-3 px-8 rounded-lg cursor-pointer shadow-md">
                        Log in
                    </div>
                </Link>

                {/* Sign Up Button */}
                <Link href="/register" passHref>
                    <div className="bg-[#d9d9d9] text-[#202322] text-[22px] font-semibold py-3 px-8 rounded-lg cursor-pointer shadow-md">
                        Sign up
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default StartScreen;
