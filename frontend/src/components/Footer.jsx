const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            SmartEval
          </h2>
          <p className="text-sm">
            SmartEval is an online quiz and evaluation platform
            designed to help students test, track, and improve
            their knowledge efficiently.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>About</li>
            <li>My Work</li>
            <li>Profile</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Contact</h3>
          <p className="text-sm">Email: support@smarteval.com</p>
          <p className="text-sm">© {new Date().getFullYear()} SmartEval</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;