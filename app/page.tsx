
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center">
      <div className='h-16 flex items-center justify-between w-full border-b shadow-sm border-gray-primary px-6 bg-white-primary!'>
        <Link href="/"><h1 className='text-black font-bold text-2xl p-2'>ExamPrep</h1></Link>

      </div>
      <div className="max-w-7xl mx-auto flex flex-col justify-between flex-1 px-4 w-full py-20">
        <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
          {/* Left Content */}
          <div className="w-full md:max-w-3xl">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-6">
                🚀 India's Smartest Mock Test Platform
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Crack SSC, Banking, Railway & Government Exams with Confidence
              </h1>

              <p className="text-gray-600 text-lg mb-8">
                Practice unlimited mock tests, previous year questions,
                detailed solutions, AI-powered performance analysis, and
                all-India rankings — all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/tests">
                  <Button className="h-12 px-8">
                    Start Free Test
                  </Button>
                </Link>

                <Link href="/exams">
                  <Button
                    variant="outline"
                    className="h-12 px-8"
                  >
                    Explore Exams
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 mt-10">
              <div>
                <h3 className="text-2xl font-bold">50K+</h3>
                <p className="text-gray-500">Questions</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">100+</h3>
                <p className="text-gray-500">Mock Tests</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">10K+</h3>
                <p className="text-gray-500">Students</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center w-full">
            <Image
              src="/assets/images/hero-exam.png"
              alt="Competitive Exam Preparation"
              width={600}
              height={600}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

