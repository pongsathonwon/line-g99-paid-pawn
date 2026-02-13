function QueryLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-yellow-300 border-t-transparent animate-spin" />
      <p className="text-gray-500 text-sm">กำลังโหลดข้อมูล...</p>
    </div>
  );
}

export default QueryLoading;
