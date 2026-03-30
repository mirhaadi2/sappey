import React, { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { usePageBySlug } from "../api/homepage";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  HelpCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

const PageContent: React.FC = () => {
  const { slug: pathSlug } = useParams<{ slug: string }>();
  const location = useLocation();

  // Determine the correct slug even if accessed via direct footer links
  let slug = pathSlug;
  if (!slug) {
    const path = location.pathname.replace(/^\//, "").toLowerCase();
    const validPaths = ["about", "shipping", "returns", "faqs"];
    if (validPaths.includes(path)) {
      slug = path;
    }
  }

  const { page, isLoading, error } = usePageBySlug(slug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const navLinks = [
    {
      label: "About Sappey",
      path: "/about",
      slug: "about-sappey",
      icon: <ShieldCheck size={18} />,
    },
    {
      label: "Shipping Policy",
      path: "/shipping",
      slug: "shipping-policy",
      icon: <Truck size={18} />,
    },
    {
      label: "Returns & Refunds",
      path: "/returns",
      slug: "returns-and-refunds",
      icon: <RotateCcw size={18} />,
    },
    {
      label: "Help & FAQs",
      path: "/faqs",
      slug: "frequently-asked-questions",
      icon: <HelpCircle size={18} />,
    },
  ];

  if (isLoading) return <PageSkeleton />;

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-50 p-10 rounded-[32px] border border-red-100">
          <h2 className="text-2xl font-bold text-slate-900">
            Information Unavailable
          </h2>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            We couldn't load this policy. It may have been moved or updated.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900">{page.title}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                {page.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
                  <CheckCircle2 size={12} /> Verified Policy
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock size={14} className="text-slate-400" /> Last Updated:
                  March 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 ml-2">
                Help Center
              </h3>
              <nav className="space-y-3">
                {navLinks.map((link) => {
                  const isActive = slug === link.slug;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-300 group ${
                        isActive
                          ? "bg-orange-600 text-white shadow-xl shadow-orange-200 ring-4 ring-orange-50"
                          : "bg-white border border-slate-100 text-slate-600 hover:border-orange-200 hover:shadow-lg"
                      }`}
                    >
                      <span
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-orange-500"
                        }
                      >
                        {link.icon}
                      </span>
                      <span className="font-bold text-[15px]">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Article */}
          <article className="flex-1 max-w-none">
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 md:p-6 relative overflow-hidden">
              {/* Decorative Corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-16 -mt-16"></div>

              <div
                className="prose prose-slate prose-lg max-w-none 
                /* Spacing between paragraphs */
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-10 
                
                /* Spacing between headers and text */
                prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:font-black prose-h3:text-slate-900
                prose-h3:flex prose-h3:items-center prose-h3:gap-4
                prose-h3:before:content-[''] prose-h3:before:w-1.5 prose-h3:before:h-10 prose-h3:before:bg-orange-500 prose-h3:before:rounded-full
                
                /* Spacing for lists */
                prose-li:text-slate-600 prose-li:mb-4 prose-li:ml-4
                prose-ul:mb-10 prose-ol:mb-10
                
                /* Styling for bold/strong text */
                prose-strong:text-slate-900 prose-strong:font-bold prose-strong:bg-orange-50 prose-strong:px-1.5 prose-strong:py-0.5 prose-strong:rounded-md"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-6 leading-relaxed text-slate-600">{children}</p>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-black mt-12 mb-4 text-slate-900 flex items-center gap-3 before:content-[''] before:w-1 before:h-8 before:bg-orange-500 before:rounded">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-6 list-disc ml-6 space-y-2">{children}</ul>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-slate-900 font-semibold">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {page.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Premium Help Banner */}
            <div className="mt-12 bg-slate-900 rounded-xl p-4 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-black mb-4">
                  Still have questions?
                </h2>
                <p className="text-slate-400 text-md max-w-md leading-relaxed">
                  Our farm-to-table support team is available 24/7 to assist
                  with your orders and product inquiries.
                </p>
              </div>
              <button className="relative z-10 bg-orange-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-orange-500 transition-all shadow-2xl shadow-orange-900/20 active:scale-95">
                Contact Sappey Support
              </button>

              {/* Abstract decorative circles */}
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-transparent to-transparent"></div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PageContent;

const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
    <div className="h-4 w-32 bg-slate-200 rounded-full mb-6"></div>
    <div className="h-16 w-1/2 bg-slate-200 rounded-2xl mb-16"></div>
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="hidden lg:block w-72 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
      <div className="flex-1 h-[700px] bg-slate-50 rounded-[40px]"></div>
    </div>
  </div>
);

