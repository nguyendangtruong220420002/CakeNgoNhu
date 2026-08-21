export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-2xl text-text mb-2">Không tìm thấy trang</h1>
      <p className="text-text/70 mb-6">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
      <a
        href="/"
        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors"
      >
        Về trang chủ
      </a>
    </main>
  );
}
