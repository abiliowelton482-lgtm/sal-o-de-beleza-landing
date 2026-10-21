import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Scissors, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  Droplets, 
  Check, 
  ShoppingBag,
  Tag,
  Plus,
  Minus,
  Menu,
  X,
  Heart
} from 'lucide-react';
import LocationsMap from './components/LocationsMap'; // Versão light/clean

const CURRENT_YEAR = new Date().getFullYear();

// Dados para o agendamento
const SERVICES = [
  { id: 1, name: 'Corte Feminino & Escova', price: 120.00, duration: '60 min', desc: 'Design de corte atualizado e escova modeladora perfeita' },
  { id: 2, name: 'Coloração & Mechas', price: 350.00, duration: '180 min', desc: 'Transformação de cor com proteção capilar e técnicas modernas' },
  { id: 3, name: 'Spa Capilar & Nutrição', price: 180.00, duration: '50 min', desc: 'Tratamento profundo com óleos essenciais e massagem relaxante' },
  { id: 4, name: 'Manicure & Pedicure Spa', price: 70.00, duration: '60 min', desc: 'Cuidado completo para unhas, com esfoliação e hidratação' }
];

const STYLISTS = [
  { id: 1, name: 'Ana Silva', rating: 4.9, icon: '👩🏻‍🦰', phone: '5579981232255', role: 'Especialista em Mechas & Cor' },
  { id: 2, name: 'Carla Dias', rating: 4.8, icon: '👩🏽', phone: '5579981232255', role: 'Hair Stylist & Visagista' },
  { id: 3, name: 'Juliana Castro', rating: 5.0, icon: '👱🏻‍♀️', phone: '5579981232255', role: 'Nail Designer' }
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

// Partículas delicadas que flutuam suavemente por toda a página
const FLOATING_PARTICLES = [
  { id: 1, left: '4%', size: 16, duration: '20s', delay: '-2s', drift: '55px', opacity: 0.65, type: 'petal' },
  { id: 2, left: '10%', size: 10, duration: '17s', delay: '-9s', drift: '-40px', opacity: 0.6, type: 'bokeh' },
  { id: 3, left: '16%', size: 14, duration: '24s', delay: '-5s', drift: '60px', opacity: 0.55, type: 'sparkle' },
  { id: 4, left: '22%', size: 18, duration: '22s', delay: '-14s', drift: '-45px', opacity: 0.6, type: 'petal' },
  { id: 5, left: '29%', size: 11, duration: '19s', delay: '-7s', drift: '35px', opacity: 0.55, type: 'bokeh' },
  { id: 6, left: '36%', size: 15, duration: '26s', delay: '-18s', drift: '-55px', opacity: 0.65, type: 'petal' },
  { id: 7, left: '43%', size: 13, duration: '18s', delay: '-3s', drift: '45px', opacity: 0.6, type: 'sparkle' },
  { id: 8, left: '50%', size: 17, duration: '23s', delay: '-11s', drift: '-35px', opacity: 0.58, type: 'petal' },
  { id: 9, left: '57%', size: 10, duration: '20s', delay: '-6s', drift: '40px', opacity: 0.6, type: 'bokeh' },
  { id: 10, left: '64%', size: 16, duration: '25s', delay: '-15s', drift: '-50px', opacity: 0.65, type: 'petal' },
  { id: 11, left: '71%', size: 13, duration: '21s', delay: '-8s', drift: '30px', opacity: 0.6, type: 'sparkle' },
  { id: 12, left: '78%', size: 11, duration: '16s', delay: '-12s', drift: '-35px', opacity: 0.55, type: 'bokeh' },
  { id: 13, left: '84%', size: 17, duration: '24s', delay: '-4s', drift: '50px', opacity: 0.62, type: 'petal' },
  { id: 14, left: '90%', size: 12, duration: '19s', delay: '-16s', drift: '-40px', opacity: 0.58, type: 'sparkle' },
  { id: 15, left: '95%', size: 15, duration: '22s', delay: '-10s', drift: '-30px', opacity: 0.6, type: 'petal' }
];

// Dados dos Produtos do Salão (Home Care)
const PRODUCTS = [
  {
    id: 1,
    name: 'Máscara de Reconstrução Profunda',
    category: 'Cabelo',
    price: 145.00,
    oldPrice: 180.00,
    volume: '250g',
    rating: 4.9,
    badge: 'Mais Vendido',
    desc: 'Devolve a massa capilar e repara danos extremos de descoloração e química.',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Reconstrução imediata da fibra capilar',
      'Proteção contra quebra e pontas duplas',
      'Brilho intenso e maciez incomparável',
      'Fórmula rica em queratina e aminoácidos'
    ]
  },
  {
    id: 2,
    name: 'Sérum Reparador de Pontas',
    category: 'Finalizadores',
    price: 89.90,
    oldPrice: null,
    volume: '50ml',
    rating: 5.0,
    badge: 'Essencial',
    desc: 'Óleo leve que sela as cutículas, elimina o frizz e proporciona brilho espelhado sem pesar.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Blend de óleos de argan, macadâmia e ojon',
      'Proteção térmica e contra raios UV',
      'Toque seco e absorção rápida',
      'Fragrância floral sofisticada'
    ]
  },
  {
    id: 3,
    name: 'Protetor Térmico Leave-in',
    category: 'Finalizadores',
    price: 95.00,
    oldPrice: null,
    volume: '150ml',
    rating: 4.8,
    badge: 'Uso Diário',
    desc: 'Protege os fios do calor do secador e chapinha, facilitando o desembaraço.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Proteção térmica até 230°C',
      'Ação anti-frizz duradoura',
      'Facilita a escovação e o deslizamento',
      'Pode ser usado em cabelos úmidos ou secos'
    ]
  },
  {
    id: 4,
    name: 'Shampoo Hidratante Sem Sulfato',
    category: 'Cabelo',
    price: 85.00,
    oldPrice: 105.00,
    volume: '300ml',
    rating: 4.9,
    badge: 'Limpeza Suave',
    desc: 'Limpa delicadamente preservando a cor e a hidratação natural dos fios.',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Prolonga a durabilidade da cor',
      'Livre de sulfatos, parabenos e petrolatos',
      'Espuma cremosa e nutritiva',
      'Ideal para cabelos coloridos ou com química'
    ]
  },
  {
    id: 5,
    name: 'Creme Hidratante para Mãos e Cutículas',
    category: 'Unhas',
    price: 45.00,
    oldPrice: null,
    volume: '60g',
    rating: 4.8,
    badge: 'Novidade',
    desc: 'Fórmula ultra-hidratante que previne o ressecamento das mãos e fortalece as unhas.',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Hidratação profunda sem toque pegajoso',
      'Previne o envelhecimento precoce das mãos',
      'Amolece as cutículas facilitando a manutenção',
      'Aroma delicado de lavanda e baunilha'
    ]
  },
  {
    id: 6,
    name: 'Kit Cronograma Capilar Luxo',
    category: 'Kits',
    price: 299.00,
    oldPrice: 380.00,
    volume: '3 Máscaras (250g cada)',
    rating: 5.0,
    badge: 'Economize R$ 81',
    desc: 'O tratamento completo (Hidratação, Nutrição e Reconstrução) para fios impecáveis em casa.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Rotina completa para recuperar qualquer tipo de dano',
      'Resultados de salão na primeira aplicação',
      'Acompanha espátula e necessaire exclusiva',
      'Ideal para manter mechas e alisamentos'
    ]
  }
];

const generateUpcomingDays = () => {
  const days = [];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const fullDayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const shortMonthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();
    const isSunday = dayOfWeek === 0;

    days.push({
      id: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
      dayNum: d.getDate(),
      monthNum: String(d.getMonth() + 1).padStart(2, '0'),
      dayShort: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : dayNames[dayOfWeek],
      dayFull: fullDayNames[dayOfWeek],
      monthName: shortMonthNames[d.getMonth()],
      monthFull: monthNames[d.getMonth()],
      isClosed: isSunday,
    });
  }
  return days;
};

export default function SalaoBelezaLandingPage() {
  const parallaxRef = useRef(null);
  const heroRef = useRef(null);
  
  const availableDays = useMemo(() => generateUpcomingDays(), []);
  
  // Estados do Agendamento
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedStylist, setSelectedStylist] = useState(STYLISTS[0]);
  const [selectedDate, setSelectedDate] = useState(() => availableDays.find(d => !d.isClosed) || availableDays[0]);
  const [selectedTime, setSelectedTime] = useState('15:00');
  const [customerName, setCustomerName] = useState('');
  const [nameError, setNameError] = useState(false);

  // Confirmação via WhatsApp
  const handleConfirmBooking = () => {
    if (!customerName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    const lines = [
      `Olá, *${selectedStylist.name}*! Meu nome é *${customerName.trim()}*.`,
      '',
      'Gostaria de confirmar meu agendamento no *Nexus Beauty Studio*:',
      '',
      `• *Serviço:* ${selectedService.name} (R$ ${selectedService.price.toFixed(2).replace('.', ',')})`,
      `• *Profissional:* ${selectedStylist.name}`,
      `• *Data:* ${selectedDate.dayFull}, ${selectedDate.dayNum} de ${selectedDate.monthFull}`,
      `• *Horário:* ${selectedTime}`,
      `• *Total:* R$ ${selectedService.price.toFixed(2).replace('.', ',')}`,
      '',
      'Podemos confirmar a reserva?'
    ];

    const text = lines.join('\n');
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${selectedStylist.phone}&text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  // Estados da Loja de Produtos
  const [selectedProductCategory, setSelectedProductCategory] = useState('Todos');
  const [quantities, setQuantities] = useState({});
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getQuantity = (id) => quantities[id] || 1;
  const updateQuantity = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleBuyProduct = (product) => {
    const qty = getQuantity(product.id);
    const total = (product.price * qty).toFixed(2).replace('.', ',');
    const lines = [
      'Olá! Gostaria de comprar na loja do *Nexus Beauty Studio*:',
      '',
      `• *Produto:* ${product.name}`,
      `• *Categoria:* ${product.category} (${product.volume})`,
      `• *Quantidade:* ${qty} unidade${qty > 1 ? 's' : ''}`,
      `• *Valor Unitário:* R$ ${product.price.toFixed(2).replace('.', ',')}`,
      `• *Valor Total:* R$ ${total}`,
      '',
      'Gostaria de saber sobre a pronta entrega ou retirada no salão.'
    ];
    const encodedText = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5579981232255&text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredProducts = useMemo(() => {
    if (selectedProductCategory === 'Todos') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedProductCategory);
  }, [selectedProductCategory]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Efeito de Parallax Suave
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const fadeProgress = Math.min(1, Math.max(0, scrollY / 380));
          
          if (parallaxRef.current) {
            parallaxRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
          }
          if (heroRef.current) {
            heroRef.current.style.opacity = String(1 - fadeProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-[#fffcfd] text-gray-600 overflow-x-hidden min-h-screen font-sans selection:bg-pink-200 selection:text-pink-900">
      
      {/* Camada Fixa 1 (z-0): Orbes de Luz e Ondas de Seda que acompanham a página inteira */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Orbes de Luz / Aurora Pastel em Movimento Contínuo */}
        <div className="absolute top-[5%] right-[8%] w-[360px] sm:w-[520px] h-[360px] sm:h-[520px] bg-pink-300/25 rounded-full blur-[110px] animate-orb-slow"></div>
        <div className="absolute top-[36%] left-[-5%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-rose-200/30 rounded-full blur-[115px] animate-orb-reverse"></div>
        <div className="absolute bottom-[5%] right-[15%] w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] bg-fuchsia-200/25 rounded-full blur-[110px] animate-orb-slow"></div>

        {/* Ondas de Seda Delicadas espalhadas pela altura da tela */}
        <svg
          className="absolute inset-x-0 top-[10%] w-full h-[360px] opacity-50 animate-silk-sway"
          viewBox="0 0 1440 320"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 C320,260 520,40 880,140 C1160,215 1320,90 1440,130"
            stroke="url(#silkGrad1)"
            strokeWidth="1.8"
          />
          <path
            d="M0,210 C380,90 640,270 1020,160 C1240,95 1360,180 1440,150"
            stroke="url(#silkGrad2)"
            strokeWidth="1.4"
          />
          <defs>
            <linearGradient id="silkGrad1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="silkGrad2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0" />
              <stop offset="50%" stopColor="#f472b6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="absolute inset-x-0 bottom-[8%] w-full h-[360px] opacity-45 animate-silk-sway"
          style={{ animationDelay: '-8s' }}
          viewBox="0 0 1440 320"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C400,240 720,30 1120,180 C1280,235 1380,120 1440,150"
            stroke="url(#silkGrad1)"
            strokeWidth="1.6"
          />
          <path
            d="M0,220 C300,100 760,260 1140,120 C1300,70 1390,160 1440,190"
            stroke="url(#silkGrad2)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Camada Fixa 2 (z-20): Pétalas, Brilhos e Bokeh Flutuantes que seguem pela página inteira */}
      <div className="fixed inset-0 z-20 pointer-events-none overflow-hidden">
        {FLOATING_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="floating-particle"
            style={{
              left: p.left,
              '--p-duration': p.duration,
              '--p-delay': p.delay,
              '--p-drift': p.drift,
              '--p-opacity': p.opacity
            }}
          >
            {p.type === 'petal' && (
              <div
                style={{ width: p.size, height: p.size * 0.72 }}
                className="rounded-tl-full rounded-br-full rounded-tr-sm rounded-bl-sm bg-gradient-to-br from-pink-400/75 to-rose-300/50 shadow-[0_2px_10px_rgba(244,114,182,0.3)] rotate-45"
              />
            )}
            {p.type === 'bokeh' && (
              <div
                style={{ width: p.size, height: p.size }}
                className="rounded-full bg-pink-400/60 blur-[1px] shadow-[0_0_12px_rgba(236,72,153,0.45)]"
              />
            )}
            {p.type === 'sparkle' && (
              <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" className="text-pink-400/80 drop-shadow-[0_0_6px_rgba(236,72,153,0.35)]">
                <path
                  d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* 1. Header Clean */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 px-5 sm:px-6 lg:px-20 py-3.5 sm:py-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo NEXUS Beauty */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-gray-900 flex items-center gap-1.5 font-sans leading-none">
                  NEXUS <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-semibold mt-1">Beauty Studio</span>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-pink-500 transition-colors cursor-pointer">Início</button>
              <button onClick={() => scrollToSection('servicos')} className="hover:text-pink-500 transition-colors cursor-pointer">Serviços</button>
              <button onClick={() => scrollToSection('produtos')} className="hover:text-pink-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                <span>Produtos</span>
                <span className="text-[9px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-bold">Loja</span>
              </button>
              <button onClick={() => scrollToSection('agendamento')} className="hover:text-pink-500 transition-colors cursor-pointer">Agendamento</button>
              <button onClick={() => scrollToSection('galeria')} className="hover:text-pink-500 transition-colors cursor-pointer">Galeria</button>
              <button onClick={() => scrollToSection('localizacao')} className="hover:text-pink-500 transition-colors cursor-pointer">Localização</button>
            </nav>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => scrollToSection('agendamento')}
                className="hidden md:flex bg-gray-900 hover:bg-pink-500 text-white font-bold px-5 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300 items-center gap-2 shadow-md transform hover:scale-105 cursor-pointer"
              >
                <span>Agendar Horário</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:text-pink-500 transition-colors bg-gray-50 border border-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menu Dropdown Mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1 pb-2 bg-white">
              <button onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left px-4 py-3 text-sm font-medium text-gray-800 hover:bg-pink-50 rounded-lg">Início</button>
              <button onClick={() => { setMobileMenuOpen(false); scrollToSection('servicos'); }} className="text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-pink-50 rounded-lg">Serviços</button>
              <button onClick={() => { setMobileMenuOpen(false); scrollToSection('produtos'); }} className="text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-pink-50 rounded-lg">Produtos</button>
              <button onClick={() => { setMobileMenuOpen(false); scrollToSection('agendamento'); }} className="text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-pink-50 rounded-lg">Agendamento</button>
              <button onClick={() => { setMobileMenuOpen(false); scrollToSection('galeria'); }} className="text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-pink-50 rounded-lg">Galeria</button>
              <button onClick={() => { setMobileMenuOpen(false); scrollToSection('localizacao'); }} className="text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-pink-50 rounded-lg">Localização</button>
            </div>
          )}
        </header>

        {/* 2. Hero Section */}
        <section className="relative w-full min-h-[calc(100svh-70px)] sm:min-h-[85vh] flex flex-col justify-center px-5 sm:px-6 lg:px-20 pt-20 sm:pt-12 pb-16 overflow-hidden">
          {/* Imagem de fundo nítida de estúdio de beleza mantida no início */}
          <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full pointer-events-none z-0">
            <div ref={parallaxRef} className="w-full h-full will-change-transform">
              <img
                src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=85&w=1920&auto=format&fit=crop"
                className="w-full h-full object-cover opacity-45 sm:opacity-75 lg:opacity-90 object-center saturate-110 contrast-105"
                alt="Estúdio de Beleza Profissional"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#fffcfd] via-[#fffcfd]/85 lg:via-[#fffcfd]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#fffcfd] via-transparent to-transparent"></div>
          </div>

          <div ref={heroRef} className="max-w-7xl mx-auto w-full flex flex-col items-center text-center sm:items-start sm:text-left gap-6 z-10">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-200 bg-pink-50 text-pink-600 text-xs font-bold tracking-widest uppercase shadow-sm">
              <Heart className="w-3.5 h-3.5 shrink-0" />
              <span>Cuidado, Beleza & Sofisticação</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Sua beleza, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
                nossa obra de arte.
              </span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-lg max-w-md sm:max-w-xl leading-relaxed font-medium">
              Ambiente acolhedor, profissionais especialistas e produtos premium. Uma experiência desenhada para elevar sua autoestima e realçar sua melhor versão.
            </p>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={() => scrollToSection('agendamento')}
                className="w-full sm:w-auto bg-gray-900 hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-full text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
              >
                <span>Agendar Meu Momento</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => scrollToSection('servicos')}
                className="w-full sm:w-auto bg-white border border-gray-200 hover:border-pink-300 text-gray-700 font-semibold py-4 px-7 rounded-full text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                Ver Serviços
              </button>
            </div>
          </div>
        </section>

        {/* 3. Seção "O Que Fazemos" (Bento Grid Clean) */}
        <section id="servicos" className="px-6 lg:px-20 py-20 bg-transparent relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center sm:text-left">
              <p className="text-xs font-bold text-pink-500 tracking-widest uppercase mb-2">ESPECIALIDADES</p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Experiências de Beleza</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Mechas & Iluminação', desc: 'Loiros, morenas iluminadas e correção de cor com proteção estrutural.', icon: <Sparkles className="w-6 h-6" /> },
                { title: 'Corte & Visagismo', desc: 'Design que valoriza o formato do seu rosto e expressa sua personalidade.', icon: <Scissors className="w-6 h-6" /> },
                { title: 'Terapia Capilar', desc: 'Tratamentos profundos para saúde do couro cabeludo e fios radiantes.', icon: <Droplets className="w-6 h-6" /> },
                { title: 'Nail Bar & Spa', desc: 'Esmaltação em gel, alongamentos e spa para mãos e pés.', icon: <Star className="w-6 h-6" /> }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 hover:border-pink-200 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 shadow-sm hover:shadow-md">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Sistema de Agendamento */}
        <section id="agendamento" className="px-6 lg:px-20 py-20 relative bg-pink-50/15">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div>
                  <p className="text-xs font-bold text-pink-500 tracking-widest uppercase mb-2">RESERVA FÁCIL</p>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Agende em instantes pelo WhatsApp.
                  </h2>
                </div>
                <p className="text-gray-600">Escolha o serviço, sua profissional favorita e o melhor horário. Simples, rápido e direto.</p>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 shadow-sm">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <div className="text-xs">
                    <p className="text-gray-900 font-semibold">Horário de Atendimento</p>
                    <p className="text-gray-500">Segunda a Sábado: 09:00 às 20:00</p>
                  </div>
                </div>
              </div>

              {/* Hub Interativo Claro */}
              <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Serviços */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-gray-900 text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" /> 1. Escolha o serviço
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {SERVICES.map((serv) => (
                        <div key={serv.id} onClick={() => setSelectedService(serv)}
                          className={`border rounded-2xl p-3.5 cursor-pointer transition-all ${
                            selectedService.id === serv.id ? 'bg-pink-50 border-pink-300' : 'bg-gray-50 border-gray-100 hover:border-pink-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="text-gray-900 font-semibold text-sm">{serv.name}</h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-pink-600 font-bold text-sm">R$ {serv.price.toFixed(2).replace('.', ',')}</span>
                                <span className="text-gray-500 text-xs">• {serv.duration}</span>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedService.id === serv.id ? 'bg-pink-500 text-white' : 'border border-gray-300'}`}>
                              {selectedService.id === serv.id && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profissionais */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-gray-900 text-sm font-bold flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-500" /> 2. Profissional
                    </h4>
                    <div className="flex flex-col gap-2.5">
                      {STYLISTS.map((stylist) => (
                        <div key={stylist.id} onClick={() => setSelectedStylist(stylist)}
                          className={`border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                            selectedStylist.id === stylist.id ? 'bg-pink-50 border-pink-300' : 'bg-gray-50 border-gray-100 hover:border-pink-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{stylist.icon}</div>
                            <div>
                              <h5 className="text-gray-900 text-sm font-semibold">{stylist.name}</h5>
                              <p className="text-xs text-gray-500">{stylist.role}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedStylist.id === stylist.id ? 'bg-pink-500 text-white' : 'border border-gray-300'}`}>
                            {selectedStylist.id === stylist.id && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Datas e Horários */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-gray-900 text-sm font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-500" /> 3. Data e Hora
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {availableDays.slice(0, 4).map((day) => (
                        <button key={day.id} onClick={() => !day.isClosed && setSelectedDate(day)}
                          className={`p-2 rounded-xl text-center border cursor-pointer ${
                            day.isClosed ? 'opacity-40 bg-gray-100 cursor-not-allowed' :
                            selectedDate.id === day.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:border-pink-300 text-gray-700'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-semibold block">{day.dayShort}</span>
                          <span className="text-sm font-bold block">{day.dayNum}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {TIME_SLOTS.slice(0, 8).map((time) => (
                        <button key={time} onClick={() => setSelectedTime(time)}
                          className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                            selectedTime === time ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-gray-200 hover:border-pink-300 text-gray-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confirmação */}
                  <div className="flex flex-col justify-between bg-gray-50 border border-gray-200 rounded-2xl p-5">
                    <h4 className="text-gray-900 text-sm font-bold mb-3">4. Confirmação</h4>
                    
                    <input
                      type="text"
                      placeholder="Seu Nome Completo"
                      value={customerName}
                      onChange={(e) => { setCustomerName(e.target.value); setNameError(false); }}
                      className={`w-full bg-white border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none mb-2 ${
                        nameError ? 'border-red-500' : 'border-gray-300 focus:border-pink-400'
                      }`}
                    />
                    {nameError && (
                      <p className="text-red-500 text-[11px] mb-2 font-medium">
                        Por favor, informe seu nome para confirmar.
                      </p>
                    )}

                    <div className="flex justify-between items-center mb-4 mt-2">
                      <span className="text-sm text-gray-600 font-medium">Total:</span>
                      <span className="text-xl font-black text-pink-600">R$ {selectedService.price.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <button onClick={handleConfirmBooking}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" /> CONFIRMAR VIA WHATSAPP
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Loja Home Care */}
        <section id="produtos" className="px-6 lg:px-20 py-20 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-pink-200 bg-pink-50 text-pink-600 text-xs font-bold tracking-widest uppercase mb-3">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>LINHA HOME CARE EXCLUSIVA</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Cuidados Home Care</h2>
              <p className="text-gray-600 mt-2">Mantenha a saúde e o brilho do salão em casa com nossos produtos premium.</p>
            </div>

            {/* Filtros por Categoria */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {['Todos', 'Cabelo', 'Finalizadores', 'Unhas', 'Kits'].map((cat) => {
                const isActive = selectedProductCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedProductCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-200 scale-105'
                        : 'bg-gray-50 hover:bg-pink-50 text-gray-600 border border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const qty = getQuantity(product.id);
                return (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
                    <div
                      onClick={() => setActiveProductModal(product)}
                      className="relative h-56 bg-gray-100 cursor-pointer group overflow-hidden"
                    >
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 text-[10px] font-bold bg-pink-500 text-white px-2.5 py-1 rounded-full shadow-sm">{product.badge}</span>
                      <span className="absolute bottom-3 right-3 text-xs font-bold bg-white/90 backdrop-blur-sm text-gray-800 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {product.rating}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">{product.category}</span>
                          <span className="text-[11px] text-gray-400">{product.volume}</span>
                        </div>
                        <h3
                          onClick={() => setActiveProductModal(product)}
                          className="text-lg font-bold text-gray-900 mt-1 hover:text-pink-500 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-xs mt-2 line-clamp-2">{product.desc}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div>
                            {product.oldPrice && (
                              <span className="text-xs text-gray-400 line-through mr-1.5">
                                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                            <span className="text-xl font-black text-gray-900">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                          </div>
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, -1)}
                              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-600 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-gray-900">{qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-600 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveProductModal(product)}
                            className="bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-pink-600 border border-gray-200 hover:border-pink-200 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Detalhes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBuyProduct(product)}
                            className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-pink-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Tag className="w-3.5 h-3.5" /> Pedir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal de Detalhes do Produto */}
          {activeProductModal && (
            <div
              onClick={() => setActiveProductModal(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
              >
                <button
                  type="button"
                  onClick={() => setActiveProductModal(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-pink-50 border border-gray-200 text-gray-600 hover:text-pink-600 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="md:col-span-5 relative bg-pink-50/40 flex items-center justify-center p-4 min-h-[240px]">
                  <img
                    src={activeProductModal.image}
                    alt={activeProductModal.name}
                    className="w-full h-full max-h-[320px] object-cover rounded-2xl shadow-md"
                  />
                  <span className="absolute top-6 left-6 text-xs font-bold text-white bg-pink-500 px-3 py-1 rounded-full shadow">
                    {activeProductModal.badge}
                  </span>
                </div>

                <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="text-pink-500 font-bold uppercase">{activeProductModal.category}</span>
                      <span>•</span>
                      <span>{activeProductModal.volume}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900">{activeProductModal.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">{activeProductModal.desc}</p>

                    {activeProductModal.benefits && (
                      <div className="mt-4 bg-pink-50/60 border border-pink-100 rounded-2xl p-4">
                        <p className="text-[11px] font-bold text-pink-600 uppercase tracking-wider mb-2">Benefícios</p>
                        <div className="flex flex-col gap-1.5">
                          {activeProductModal.benefits.map((b, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                              <Check className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-gray-400 block">Valor Total:</span>
                      <span className="text-2xl font-black text-pink-600">
                        R$ {(activeProductModal.price * getQuantity(activeProductModal.id)).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleBuyProduct(activeProductModal);
                        setActiveProductModal(null);
                      }}
                      className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-pink-200 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Pedir no WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 6. Galeria Clean */}
        <section id="galeria" className="px-6 lg:px-20 py-20 bg-pink-50/15">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
              <p className="text-xs font-bold text-pink-500 tracking-widest uppercase mb-2">NOSSO ESPAÇO & RESULTADOS</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Inspiração & Transformações</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-auto md:h-[440px]">
              <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden group relative h-[260px] md:h-auto shadow-md border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=900&auto=format&fit=crop"
                  alt="Ambiente Nexus Beauty Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent flex items-end p-6">
                  <span className="text-white font-bold text-lg">Ambiente Acolhedor & Sofisticado</span>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden group relative h-[180px] md:h-auto shadow-md border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop"
                  alt="Mechas e Iluminação"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="rounded-3xl overflow-hidden group relative h-[180px] md:h-auto shadow-md border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop"
                  alt="Visagismo e Penteados"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="col-span-2 rounded-3xl overflow-hidden group relative h-[180px] md:h-auto shadow-md border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=900&auto=format&fit=crop"
                  alt="Cuidado Capilar e Spa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7. Localização & Unidades (Mapa Light/Clean) */}
        <section id="localizacao" className="px-6 lg:px-20 py-20 bg-transparent">
          <LocationsMap />
        </section>

        {/* Footer Minimalista */}
        <footer className="border-t border-gray-200 py-10 px-6 lg:px-20 bg-white text-gray-500 text-xs text-center md:text-left">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Sparkles className="w-4 h-4 text-pink-500" /> NEXUS Beauty Studio
            </div>
            <p>© {CURRENT_YEAR} Todos os direitos reservados.</p>
          </div>
        </footer>

      </div>
    </div>
  );
}

