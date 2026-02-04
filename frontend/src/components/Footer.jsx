const Footer = () => {
  return (
    <footer className="bg-[#006D5E] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-5 grid md:grid-cols-3 gap-4">

        {/* Left */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">
            SmartEval
          </h2>
          <p className="text-xs leading-relaxed">
            Online quiz and evaluation platform for
            smart learning.
          </p>
        </div>

        {/* Middle */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-1">
            Quick Links
          </h3>
          <ul className="space-y-1 text-xs">
            <li>Home</li>
            <li>About</li>
            <li>My Work</li>
            <li>Profile</li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-1">
            Contact
          </h3>
          <p className="text-xs">support@smarteval.com</p>
          <p className="text-xs mt-1">
            © {new Date().getFullYear()} SmartEval
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;