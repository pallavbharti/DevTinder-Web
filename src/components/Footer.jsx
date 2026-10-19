function Footer() {
  return (
    <footer className="border-t border-base-content/10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-base-content/50">
        <p>© {new Date().getFullYear()} DevTinder · Built with the MERN stack</p>
        <p className="font-mono text-xs">
          <span className="text-success">●</span> status: online
        </p>
      </div>
    </footer>
  );
}

export default Footer;
