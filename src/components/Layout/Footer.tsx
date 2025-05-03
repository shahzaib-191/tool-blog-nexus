
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">Tool</span>
              <span className="text-2xl font-bold text-tool-teal">Nexus</span>
            </Link>
            <p className="text-gray-300">
              All-in-one platform for powerful web tools and comprehensive resources
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          {/* Tool Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tool Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=Productivity%20%26%20Utility" className="text-gray-300 hover:text-white transition-colors">
                  Productivity & Utility
                </Link>
              </li>
              <li>
                <Link to="/?category=SEO%20%26%20Marketing" className="text-gray-300 hover:text-white transition-colors">
                  SEO & Marketing
                </Link>
              </li>
              <li>
                <Link to="/?category=Image%20%26%20Video" className="text-gray-300 hover:text-white transition-colors">
                  Image & Video
                </Link>
              </li>
              <li>
                <Link to="/?category=AI%20%26%20Writing" className="text-gray-300 hover:text-white transition-colors">
                  AI & Writing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} ToolNexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
