import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ChevronDown, 
  X, 
  MessageCircle, 
  HelpCircle 
} from 'lucide-react';

export default function FaqsPage() {
  const { siteContent, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = useMemo(() => {
    return siteContent.faqs.filter(faq => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
      }
      return true;
    });
  }, [siteContent.faqs, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-28 pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span>Policies & Clarifications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Everything you need to know about vehicle pickups, M-Pesa payments, security deposits, and safari driver arrangements.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions (e.g. M-Pesa, driver, airport delivery, deposit)..."
            className="w-full pl-10 pr-8 py-3 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                  isOpen ? 'border-blue-300 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`p-1.5 rounded-full transition-transform duration-200 ${
                    isOpen ? 'bg-blue-50 text-blue-600 rotate-180' : 'text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Help */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-3">
          <h4 className="font-bold text-base text-slate-900">Still have questions?</h4>
          <p className="text-xs text-slate-500">Our customer team is on standby 24/7 to assist with your rental itinerary.</p>
          <div className="pt-1 flex justify-center gap-3">
            <a
              href={`https://wa.me/${siteContent.brand.whatsapp}?text=Hello%20EliteRide`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>
            <button
              onClick={() => navigateTo('contact')}
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700"
            >
              Direct Inquiry
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
