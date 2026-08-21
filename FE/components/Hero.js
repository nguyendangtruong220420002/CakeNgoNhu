export default function Hero() {
  return (
    <section className="px-4 pt-12 pb-16 md:pt-20 md:pb-24 text-center max-w-3xl mx-auto">
      <span className="inline-block bg-accent/50 text-text text-sm px-4 py-1 rounded-full mb-4">
        Tiệm bánh kem thủ công
      </span>
      <h1 className="font-serif text-3xl md:text-5xl text-text leading-tight mb-4">
        Bánh kem tươi, làm thủ công cho từng dịp đặc biệt
      </h1>
      <p className="text-text/70 text-base md:text-lg mb-8">
        Sinh nhật, cưới hỏi, kem tươi, fondant — đặt bánh theo yêu cầu, giao tận nơi hoặc nhận tại tiệm.
      </p>
      <a
        href="/san-pham"
        className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl transition-colors"
      >
        Xem mẫu bánh
      </a>
    </section>
  );
}
