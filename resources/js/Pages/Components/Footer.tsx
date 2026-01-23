import React from 'react';
import { BiHeart, BiMapPin, BiPhone, BiSend, BiShoppingBag } from 'react-icons/bi';
import { BsArrowRight, BsHeadphones } from 'react-icons/bs';
import { CgMail } from 'react-icons/cg';
import {
  FaCreditCard,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaShoppingBag,
  FaQuestionCircle,
  FaInfoCircle,
  FaBoxOpen,
  FaTags,
  FaBriefcase,
  FaLeaf,
  FaNewspaper
} from 'react-icons/fa';


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
        { name: 'All Products', href: '#', icon: <FaShoppingBag size={16} /> },
        { name: 'New Arrivals', href: '#', icon: <FaBoxOpen size={16} /> },
        { name: 'Best Sellers', href: '#', icon: <FaTags size={16} /> },
        { name: 'Special Offers', href: '#', icon: <FaTags size={16} /> },
    ],
    help: [
        { name: 'Contact Us', href: '#', icon: <FaHeadset size={16} /> },
        { name: 'FAQ', href: '#', icon: <FaQuestionCircle size={16} /> },
        { name: 'Shipping & Delivery', href: '#', icon: <FaTruck size={16} /> },
        { name: 'Returns & Exchanges', href: '#', icon: <FaBoxOpen size={16} /> },
        ],
        about: [
        { name: 'Our Story', href: '#', icon: <FaInfoCircle size={16} /> },
        { name: 'Careers', href: '#', icon: <FaBriefcase size={16} /> },
        { name: 'Sustainability', href: '#', icon: <FaLeaf size={16} /> },
        { name: 'Press', href: '#', icon: <FaNewspaper size={16} /> },
    ]
  };

    const features = [
        { icon: <FaTruck size={20} />, text: 'Free Shipping Over $50' },
        { icon: <FaShieldAlt size={20} />, text: 'Secure Payment' },
        { icon: <FaHeadset size={20} />, text: '24/7 Support' },
        { icon: <FaCreditCard size={20} />, text: 'Easy Returns' },
    ];

    const socialLinks = [
        { icon: <FaFacebookF size={18} />, href: '#', color: 'hover:bg-blue-600 hover:text-white' },
        { icon: <FaTwitter size={18} />, href: '#', color: 'hover:bg-sky-500 hover:text-white' },
        { icon: <FaInstagram size={18} />, href: '#', color: 'hover:bg-pink-600 hover:text-white' },
        { icon: <FaLinkedinIn size={18} />, href: '#', color: 'hover:bg-blue-700 hover:text-white' },
        { icon: <FaYoutube size={18} />, href: '#', color: 'hover:bg-red-600 hover:text-white' },
    ];

  const paymentMethods = [
    { name: 'Visa', icon: 'VISA' },
    { name: 'Mastercard', icon: 'MC' },
    { name: 'PayPal', icon: 'PP' },
    { name: 'Apple Pay', icon: 'AP' },
    { name: 'Google Pay', icon: 'GP' },
  ];

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-100 mt-16">
      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-5 md:px-0 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 group cursor-default">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-5 md:px-0 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BiShoppingBag size={20} className="text-white" />
                </div>
                <span>ShopLogo</span>
              </h2>
              <p className="text-sm text-gray-600 mt-3">
                Premium shopping experience with quality products and exceptional customer service.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <BiPhone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call us anytime</p>
                  <p className="font-semibold text-gray-900">+880 1234-567890</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <CgMail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email us</p>
                  <p className="font-semibold text-gray-900">support@shoplogo.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <BiMapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Visit us</p>
                  <p className="font-semibold text-gray-900">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BiShoppingBag size={18} />
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    {link.name}
                    <BsArrowRight size={12} className="opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BsHeadphones size={18} />
              Help Center
            </h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    {link.name}
                    <BsArrowRight size={12} className="opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CgMail size={18} />
              Newsletter
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe for exclusive deals and updates.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Subscribe</span>
                <BiSend size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Social & Payment Section */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Follow us:</span>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 transition-all duration-300 ${social.color} hover:scale-110`}
                    aria-label={`Follow on ${social.icon.type.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Secure payments:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-default"
                    title={method.name}
                  >
                    {method.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright & Legal */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <p>© {currentYear} ShopLogo. All rights reserved.</p>
                <div className="flex items-center gap-1">
                  <span>Made with</span>
                  <BiHeart size={12} className="text-red-500 fill-red-500 animate-pulse" />
                  <span>in Bangladesh</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                {footerLinks.about.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
              </div>
            </div>

            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                ShopLogo is a registered trademark. All product names, logos, and brands are property of their respective owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
