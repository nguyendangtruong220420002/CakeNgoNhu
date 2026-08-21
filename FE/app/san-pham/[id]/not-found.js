export default function ProductNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-2xl text-text mb-2">Không tìm thấy mẫu bánh</h1>
      <p className="text-text/70 mb-6">Mẫu bánh này có thể đã ngừng bán hoặc không tồn tại.</p>
      <a
        href="/san-pham"
        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors"
      >
        Xem các mẫu bánh khác
      </a>
    </main>
  );
}
