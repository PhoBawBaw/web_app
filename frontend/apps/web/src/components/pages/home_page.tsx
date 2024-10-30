import Link from 'next/link';

const StartScreen: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center overflow-hidden">
            <img
                className="w-[300px] h-[300px] mb-8"
                alt="Baby monitoring illustration"
                src="https://cdn.animaapp.com/projects/67178667ef0c327f259c7b14/releases/6717877010fcf50a30bcebb0/img/group-30@2x.png"
            />

            <div className="text-center">
                <h1 className="text-[33px] font-extrabold text-white">Baby Monitoring</h1>
                <p className="text-white text-sm font-light mt-2">당신의 아기를 모니터링하세요!</p>
            </div>

            <div className="mt-12 flex space-x-4">
                <Link href="/login" passHref>
                    <div className="bg-[#2db6a3] text-white text-[22px] font-bold py-3 px-8 rounded-lg cursor-pointer shadow-[0px_15px_30px_rgba(0,0,0,0.3)]">
                        로그인
                    </div>
                </Link>

                <Link href="/register" passHref>
                    <div className="bg-[#d9d9d9] text-[#202322] text-[22px] font-semibold py-3 px-8 rounded-lg cursor-pointer shadow-[0px_15px_30px_rgba(0,0,0,0.3)]">
                        회원가입
                    </div>
                </Link>
                <br></br>
            </div>
        </div>
    );
};

export default StartScreen;
