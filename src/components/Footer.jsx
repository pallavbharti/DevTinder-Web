// BUG FIX: pehle "fixed bottom-0" tha — lambe page pe content ke upar chadh jata tha.
// Ab normal flow mein sabse neeche aata hai.
function Footer() {
  return (
    <footer className="border-t border-base-300 py-5 text-center text-sm opacity-70">
      <p>© {new Date().getFullYear()} DevTinder · made for developers, by a developer</p>
    </footer>
  );
}

export default Footer;
