import Image from "next/image";

export function Challenges() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Top Row: Decorations & Title */}
        <div className="flex w-full items-start justify-between relative">
          
          {/* Left Decoration: Vertical gray, horizontal gold */}
          <div className="hidden lg:block relative h-32 w-48 shrink-0">
            <div className="absolute top-0 left-0 w-[1px] h-full bg-gray-400"></div>
            <div className="absolute top-[60%] left-0 w-full h-[3px] bg-gold"></div>
          </div>

          {/* Center Title */}
          <div className="flex-1 lg:px-12 pt-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black uppercase leading-tight tracking-tight">
              Bar Exam Challenges And <br className="hidden lg:block" /> 
              Smarter Solutions
            </h2>
          </div>

          {/* Right Decoration: Stacked Squares */}
          <div className="hidden lg:block relative w-32 h-32 shrink-0">
             {/* Gold square (back, top-right) */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#D6A95B]"></div>
             {/* Navy square (front, bottom-left) */}
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1B2644]"></div>
          </div>
        </div>

        {/* Bottom Row: Image & Text */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Main Image */}
          <div className="w-full lg:w-[55%] relative flex-shrink-0">
            {/* Main Image Container */}
            <div className="w-full aspect-[16/10] bg-neutral-200 border border-neutral-300 rounded-sm overflow-hidden relative">
              <Image 
                src="/students.svg"
                alt="Law students studying together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
                quality={100}
                priority
              />
            </div>
          </div>

          {/* Right Side: Paragraph Text */}
          <div className="w-full lg:w-[45%] flex flex-col justify-start pt-2">
            <p className="text-gray-600 text-lg md:text-[1.1rem] leading-[1.8] font-light">
              Preparing for the bar can be overwhelming—
              but with the right tools, success becomes
              achievable. Our platform simplifies your review
              process by providing structured subjects, real
              past exams, and reliable resources designed
              to strengthen your legal foundation. Study
              efficiently, stay organized, and build the
              confidence you need to pass and excel.
            </p>
            
            {/* Bottom gray accent line under text */}
            <div className="w-64 h-[1px] bg-gray-400 mt-10"></div>
          </div>

        </div>
        
      </div>
    </section>
  );
}

