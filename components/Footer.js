export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="max-w-2xl mx-auto px-8 py-6 mt-4">
      <p className="font-body text-xs text-stone-400 text-center">
        &copy; {year} Trevor Ezaki. All rights reserved.
      </p>
    </footer>
  );
}
