
import React, { useState, useEffect } from 'react';
import { BOOK_CONTENT } from './constants';
import { SignatureData } from './types';
import { SignaturePad } from './components/SignaturePad';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  CheckCircle, 
  ShieldCheck, 
  User,
  PenTool,
  Book
} from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSigned, setIsSigned] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [signatureData, setSignatureData] = useState<SignatureData>({
    studentName: '',
    studentSignature: '',
    studentDate: new Date().toLocaleDateString('pt-BR'),
    teacherSignature: '',
    teacherDate: new Date().toLocaleDateString('pt-BR')
  });

  const totalPages = BOOK_CONTENT.pages.length + 1;

  useEffect(() => {
    const saved = localStorage.getItem('class_rules_v3');
    if (saved) {
      setSignatureData(JSON.parse(saved));
      setIsSigned(true);
    }
  }, []);

  const changePage = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      if (dir === 'next' && currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
      if (dir === 'prev' && currentPage > 0) setCurrentPage(currentPage - 1);
      setIsAnimating(false);
    }, 300);
  };

  const saveSignature = () => {
    if (!signatureData.studentName || !signatureData.studentSignature) {
      alert("Por favor, preencha o nome e a assinatura!");
      return;
    }
    localStorage.setItem('class_rules_v3', JSON.stringify(signatureData));
    setIsSigned(true);
    alert("Compromisso registrado com sucesso!");
  };

  const handlePrint = () => window.print();

  const renderPageContent = () => {
    const isSignaturePage = currentPage === BOOK_CONTENT.pages.length;
    const isFirstPage = currentPage === 0;

    if (!isSignaturePage) {
      const page = BOOK_CONTENT.pages[currentPage];
      return (
        <div className={`flex flex-col h-full ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}>
          <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col relative">
            
            {isFirstPage ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center space-y-8">
                <span className="text-9xl mb-4 transform hover:scale-110 transition-transform cursor-default">
                  {page.emoji}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 uppercase tracking-tight border-b-8 border-blue-100 pb-4">
                  {page.title}
                </h2>
                <div className="max-w-2xl space-y-6">
                  {page.content.map((item, idx) => (
                    <p key={idx} className="text-2xl text-slate-700 leading-relaxed font-medium">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-7xl">{page.emoji}</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 uppercase tracking-tight">
                    {page.title}
                  </h2>
                </div>
                <ul className="space-y-6">
                  {page.content.map((item, idx) => (
                    <li key={idx} className={`flex items-start gap-4 text-xl text-slate-700 leading-relaxed group p-3 rounded-xl transition-colors`}>
                      <CheckCircle className={`mt-1 flex-shrink-0 transition-all text-slate-300 group-hover:text-blue-500`} size={24} />
                      <span className="group-hover:text-blue-900 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

          </div>
          <div className="p-4 text-center border-t border-slate-100 text-slate-400 font-bold uppercase tracking-widest text-xs">
            PÁGINA {currentPage + 1} DE {totalPages}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col h-full ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300 p-8 md:p-12 overflow-y-auto relative`}>
        <div className="text-center mb-8">
          <span className="text-7xl mb-4 block">📜</span>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Nosso Compromisso</h2>
          <div className={`bg-white border-2 border-blue-100 p-6 rounded-2xl shadow-inner italic text-xl text-slate-600 leading-relaxed`}>
            “Eu me comprometo a respeitar as regras da nossa sala de aula, cuidar do espaço, respeitar as pessoas e ajudar a manter um ambiente seguro e acolhedor.”
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <div className="flex items-center gap-2 text-blue-800 mb-4 font-bold uppercase">
              <User size={20} /> Aluno
            </div>
            <input
              type="text"
              placeholder="Nome completo"
              value={signatureData.studentName}
              onChange={(e) => setSignatureData({...signatureData, studentName: e.target.value})}
              className="w-full p-3 mb-4 border-b-2 border-slate-200 focus:border-blue-500 outline-none text-lg transition-all"
              disabled={isSigned}
            />
            {isSigned ? (
              <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                {signatureData.studentSignature && <img src={signatureData.studentSignature} alt="Assinatura" className="mx-auto max-h-20" />}
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Registrado em {signatureData.studentDate}</p>
              </div>
            ) : (
              <SignaturePad label="" onSave={(s) => setSignatureData({...signatureData, studentSignature: s})} />
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <div className="flex items-center gap-2 text-blue-800 mb-4 font-bold uppercase">
              <PenTool size={20} /> Educador
            </div>
            <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
              {isSigned ? (
                <>
                  <p className="text-2xl font-serif text-slate-800 italic">José Marcelo</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Validado Digitalmente • {signatureData.teacherDate}</p>
                </>
              ) : (
                <button 
                  onClick={() => setSignatureData({...signatureData, teacherSignature: 'confirmed'})}
                  className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition-colors shadow-lg active:scale-95"
                >
                  Confirmar Presença
                </button>
              )}
            </div>
          </div>
        </div>

        {!isSigned ? (
          <button
            onClick={saveSignature}
            className="mt-8 bg-blue-700 text-white py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <ShieldCheck size={24} /> Finalizar e Assinar Livro
          </button>
        ) : (
          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePrint}
              className="flex-1 no-print bg-emerald-600 text-white py-4 rounded-xl font-bold text-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
            >
              <Printer size={24} /> Imprimir Comprovante
            </button>
            <button
              onClick={() => { localStorage.removeItem('class_rules_v3'); window.location.reload(); }}
              className="px-6 no-print bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition-all"
            >
              Limpar
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
      {/* Cabeçalho */}
      <header className="no-print w-full max-w-5xl flex justify-between items-center mb-6 px-6 bg-white/80 p-5 rounded-3xl backdrop-blur-lg shadow-xl border border-white">
        <div className="flex items-center gap-4">
          <div className="bg-blue-800 p-3 rounded-2xl text-white shadow-lg rotate-[-2deg]">
            <Book size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter leading-none">Sala de aula regras</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em] mt-1">Guia de convivência escolar</p>
          </div>
        </div>
        <div className="text-slate-700 font-bold text-lg md:text-xl flex flex-col items-end">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Docente Responsável</span>
          <span className="text-blue-900">Educador José Marcelo</span>
        </div>
      </header>

      <div className="book-container w-full max-w-5xl h-[80vh] flex shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] rounded-r-3xl overflow-hidden border-y-8 border-r-8 border-white bg-white relative">
        <div className="no-print book-spine h-full hidden md:block z-20"></div>
        
        <div className="flex-1 relative book-page overflow-hidden">
          {renderPageContent()}

          <div className="no-print absolute bottom-6 right-6 flex gap-3 z-20">
            <button 
              onClick={() => changePage('prev')}
              disabled={currentPage === 0}
              className={`p-5 rounded-full shadow-2xl transition-all ${currentPage === 0 ? 'bg-slate-50 text-slate-200' : 'bg-white text-slate-800 hover:bg-blue-50 hover:scale-110 active:scale-90 border-2 border-slate-100'}`}
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={() => changePage('next')}
              disabled={currentPage === totalPages - 1}
              className={`p-5 rounded-full shadow-2xl transition-all ${currentPage === totalPages - 1 ? 'bg-slate-50 text-slate-200' : 'bg-white text-slate-800 hover:bg-blue-50 hover:scale-110 active:scale-90 border-2 border-slate-100'}`}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>

      <footer className="no-print mt-8 text-slate-500 text-xs font-black uppercase tracking-[0.5em] flex items-center gap-6 opacity-60">
        <span>Respeito</span>
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <span>Educação</span>
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <span>Compromisso</span>
      </footer>
    </div>
  );
};

export default App;
