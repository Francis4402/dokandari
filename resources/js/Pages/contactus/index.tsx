import { useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaExclamationCircle,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeadset,
  FaComments,
  FaQuestionCircle,
  FaArrowLeft,
} from "react-icons/fa";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageProps } from "@/types";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";

gsap.registerPlugin(ScrollTrigger);

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const ContactUsPage = ({auth}: PageProps) => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const {data, setData, post, processing, reset} = useForm({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Contact information
  const contactInfo = {
    email: "support@multivendor.com",
    phone: "+880 1234-567890",
    address: "123 Business Center, Gulshan 1, Dhaka 1212",
    workingHours: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed",
    socialMedia: {
      facebook: "https://facebook.com/multivendor",
      twitter: "https://twitter.com/multivendor",
      instagram: "https://instagram.com/multivendor",
      linkedin: "https://linkedin.com/company/multivendor"
    }
  };

  // FAQ Data
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How long does it take to get a response?",
      answer: "We typically respond within 24 hours during business days. For urgent matters, please call our support line for immediate assistance."
    },
    {
      id: 2,
      question: "What information should I include in my message?",
      answer: "Please include your order number (if applicable), a detailed description of your issue, and any relevant screenshots or documents that can help us understand your concern better."
    },
    {
      id: 3,
      question: "Can I track my support ticket?",
      answer: "Yes! Once you submit a ticket, you'll receive a confirmation email with a ticket number that you can use to track the status of your request through our support portal."
    },
    {
      id: 4,
      question: "What are your business hours?",
      answer: "Our customer support team is available Monday through Friday from 9:00 AM to 6:00 PM, and Saturdays from 10:00 AM to 4:00 PM. Emergency support is available 24/7 for critical issues."
    },
    {
      id: 5,
      question: "Do you offer phone support?",
      answer: "Yes, we offer phone support for urgent matters. You can reach us at +880 1234-567890 during business hours. For non-urgent inquiries, we recommend using the contact form for faster processing."
    },
    {
      id: 6,
      question: "How can I become a seller on your platform?",
      answer: "Visit our 'Become a Seller' page to apply. You'll need to provide business documentation, complete a verification process, and agree to our terms and conditions. Our onboarding team will guide you through the process."
    }
  ];

  // Departments
  const departments = [
    {
      id: 1,
      name: "Customer Support",
      email: "support@multivendor.com",
      phone: "+880 1234-567891",
      description: "For order issues, returns, and general inquiries",
      icon: <FaHeadset className="h-6 w-6" />
    },
    {
      id: 2,
      name: "Technical Support",
      email: "tech@multivendor.com",
      phone: "+880 1234-567892",
      description: "For website issues and technical problems",
      icon: <FaComments className="h-6 w-6" />
    },
    {
      id: 3,
      name: "Seller Support",
      email: "sellers@multivendor.com",
      phone: "+880 1234-567893",
      description: "For seller account and store management",
      icon: <FaUser className="h-6 w-6" />
    },
    {
      id: 4,
      name: "Business Inquiries",
      email: "business@multivendor.com",
      phone: "+880 1234-567894",
      description: "For partnership and business opportunities",
      icon: <FaQuestionCircle className="h-6 w-6" />
    }
  ];

  const validateForm = () => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
  };


  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        });
      }

      if (formRef.current) {
        gsap.from(formRef.current, {
          scrollTrigger: {
            trigger: formRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        });
      }

      if (contactRef.current) {
        const cards = contactRef.current.querySelectorAll('.contact-card');
        gsap.from(cards, {
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          },
          y: 60,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const ContactCard = ({ info, index }: { info: any; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: -8,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    return (
      <div
        ref={cardRef}
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 contact-card cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
            {info.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{info.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{info.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${info.email}`} className="text-amber-600 hover:text-amber-700 transition-colors">
                  {info.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${info.phone}`} className="text-gray-700 hover:text-amber-600 transition-colors">
                  {info.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout user={auth.user}>
      <Head title="Contact Us">
        <meta name="description" content="Get in touch with our team. We're here to help you with any questions or concerns." />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Success Modal */}
        <Transition appear show={showSuccessModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setShowSuccessModal(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                    <div className="text-center">
                      <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <FaCheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">
                        Message Sent Successfully!
                      </Dialog.Title>
                      <p className="text-gray-600 mb-6">
                        Thank you for contacting us. We've received your message and will get back to you within 24 hours.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowSuccessModal(false)}
                          className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                        >
                          Continue Browsing
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div ref={headerRef} className="mb-12 text-center">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 justify-center">
              <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
              <FaArrowLeft className="h-4 w-4" />
              <span className="text-gray-900 font-medium">Contact Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help! Reach out to our team and we'll respond as soon as possible.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div ref={formRef} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <FaPaperPlane className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                      <p className="text-gray-600">Fill out the form below and we'll get back to you soon</p>
                    </div>
                  </div>

                  {submitSuccess && !showSuccessModal && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <FaCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Message sent successfully!</p>
                        <p className="text-sm text-green-700">We'll contact you within 24 hours.</p>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                      <FaExclamationCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800">Error sending message</p>
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <FaUser className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                              errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FaExclamationCircle className="h-4 w-4" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                              errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <FaExclamationCircle className="h-4 w-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                          errors.subject ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="What is this regarding?"
                      />
                      {errors.subject && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <FaExclamationCircle className="h-4 w-4" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none ${
                          errors.message ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Please provide detailed information about your inquiry..."
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <FaExclamationCircle className="h-4 w-4" />
                          {errors.message}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-gray-500 flex justify-end">
                        {data.message.length} characters
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>
                      <p className="mt-3 text-sm text-gray-500 text-center">
                        By submitting this form, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-amber-500 to-orange-500 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

                <div className="space-y-8 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Email</h3>
                      <a href={`mailto:${contactInfo.email}`} className="hover:underline">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaPhone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Phone</h3>
                      <a href={`tel:${contactInfo.phone}`} className="hover:underline">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Address</h3>
                      <p>{contactInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaClock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Working Hours</h3>
                      <p className="whitespace-pre-line">{contactInfo.workingHours}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <a
                      href={contactInfo.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <FaFacebook className="h-6 w-6" />
                    </a>
                    <a
                      href={contactInfo.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <FaTwitter className="h-6 w-6" />
                    </a>
                    <a
                      href={contactInfo.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <FaInstagram className="h-6 w-6" />
                    </a>
                    <a
                      href={contactInfo.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <FaLinkedin className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Departments Section */}
          <div ref={contactRef} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Direct Support</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Contact specific departments for specialized assistance with your inquiries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, index) => (
                <ContactCard key={dept.id} info={dept} index={index} />
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find quick answers to common questions</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FaQuestionCircle className="h-5 w-5 text-amber-500" />
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                      </div>
                      <div className={`transform transition-transform ${activeFAQ === faq.id ? 'rotate-180' : ''}`}>
                        <FaArrowLeft className="h-4 w-4 text-gray-500 rotate-90" />
                      </div>
                    </button>

                    <div
                      className={`px-6 overflow-hidden transition-all duration-300 ${
                        activeFAQ === faq.id ? 'py-4 border-t border-gray-200' : 'max-h-0 py-0'
                      }`}
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-10 pt-8 border-t border-gray-200">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors cursor-pointer">
                <FaHeadset className="h-5 w-5" />
                <span className="font-medium">Still have questions? Chat with us live</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Live chat available Monday-Friday, 9AM-6PM
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Visit Our Office</h2>
                  <p className="text-gray-300">Come meet our team in person</p>
                </div>
                <a
                  href="https://maps.google.com/?q=123+Business+Center+Gulshan+Dhaka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <FaMapMarkerAlt className="h-5 w-5" />
                  Get Directions
                </a>
              </div>

              {/* Map Placeholder */}
              <div className="h-64 md:h-80 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FaMapMarkerAlt className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-gray-300 text-sm">Our location in Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactUsPage;
