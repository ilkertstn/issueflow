export function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-blue-900/20 p-6 mb-6">
        <div className="text-6xl">🛠️</div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">
        Bakım Modu
      </h1>
      <p className="text-slate-400 max-w-md">
        Sistem şu anda planlı bakım çalışması nedeniyle geçici olarak hizmet dışıdır. 
        Lütfen daha sonra tekrar deneyiniz.
      </p>
    </div>
  );
}
