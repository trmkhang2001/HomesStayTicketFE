export default function Pagination({ page, totalPages, onPageChange }) {
    const goPrev = () => {
      if (page > 1) onPageChange(page - 1);
    };
  
    const goNext = () => {
      if (page < totalPages) onPageChange(page + 1);
    };
  
    return (
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={goPrev}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅️ Trang trước
        </button>
  
        <span className="font-semibold">Trang {page} / {totalPages}</span>
  
        <button
          onClick={goNext}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trang sau ➡️
        </button>
      </div>
    );
  }
  