import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import {
  Menu, X, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube,
  Send, Paperclip, ArrowRight, Target, Eye, Star, ChevronRight,
  Search, LogOut, Info, Calculator, MessageSquare, User, PhoneCall,
  Camera, Edit2, Home as HomeIcon, TrendingUp, Leaf,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "login" | "home" | "about" | "contact" | "calculator" | "chat" | "profile";

// ─── Image constants ──────────────────────────────────────────────────────────
const IMG = {
  hero:    "https://images.unsplash.com/photo-1616109259043-fd30a7663a5d?w=1400&h=640&fit=crop&auto=format",
  pig1:    "https://images.unsplash.com/photo-1587213128862-80345e23a71a?w=600&h=400&fit=crop&auto=format",
  pig2:    "https://images.unsplash.com/photo-1651592279311-120424784c06?w=600&h=400&fit=crop&auto=format",
  pig3:    "https://images.unsplash.com/photo-1630786784278-e1624802a3a9?w=600&h=400&fit=crop&auto=format",
  pig4:    "https://images.unsplash.com/photo-1696165724169-a85cac5adc44?w=600&h=400&fit=crop&auto=format",
  pig5:    "https://images.unsplash.com/photo-1586348323398-678d15d9e87f?w=600&h=400&fit=crop&auto=format",
  pig6:    "https://images.unsplash.com/photo-1697027948105-902321ea8e29?w=600&h=400&fit=crop&auto=format",
  pigAbout:"https://images.unsplash.com/photo-1697027940563-656a71f90a2d?w=560&h=820&fit=crop&auto=format",
  pigAbout2:"https://images.unsplash.com/photo-1716140238774-42cc9572c2a4?w=420&h=820&fit=crop&auto=format",
  farm1:   "https://images.unsplash.com/photo-1548941489-3e64750ebbaa?w=800&h=520&fit=crop&auto=format",
  farm2:   "https://images.unsplash.com/photo-1646320738147-96a8621308e7?w=800&h=520&fit=crop&auto=format",
  info1:   "https://images.unsplash.com/photo-1622834739467-56c94126f088?w=720&h=500&fit=crop&auto=format",
  info2:   "https://images.unsplash.com/photo-1651592279311-120424784c06?w=720&h=500&fit=crop&auto=format",
  chatImg: "https://images.unsplash.com/photo-1587213128862-80345e23a71a?w=320&h=200&fit=crop&auto=format",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const displayFont = { fontFamily: "'DM Serif Display', serif" };

function Btn({
  children, onClick, variant = "primary", size = "md", className = "", icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] cursor-pointer";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border border-border text-foreground hover:bg-muted",
    ghost:   "text-foreground hover:bg-muted",
    danger:  "text-red-600 hover:bg-red-50",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon}{children}
    </button>
  );
}

function Input({
  label, type = "text", value, onChange, placeholder, prefix,
}: {
  label: string; type?: string; value: string | number;
  onChange: (v: string) => void; placeholder?: string; prefix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${prefix ? "pl-8" : "pl-4"} pr-4 py-3 rounded-xl border border-border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground transition-colors`}
        />
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, onLogout }: { page: Page; setPage: (p: Page) => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const links: { label: string; page: Page; icon: React.ReactNode }[] = [
    { label: "Home",        page: "home",       icon: <HomeIcon size={15} /> },
    { label: "About Us",    page: "about",      icon: <Info size={15} /> },
    { label: "Contact Us",  page: "contact",    icon: <PhoneCall size={15} /> },
    { label: "Profit Calc", page: "calculator", icon: <Calculator size={15} /> },
    { label: "Open Chat",   page: "chat",       icon: <MessageSquare size={15} /> },
    { label: "Profile",     page: "profile",    icon: <User size={15} /> },
  ];
  const nav = (p: Page) => { setPage(p); setOpen(false); };
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => nav("home")} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">🐷</div>
            <span className="font-bold text-xl text-foreground tracking-tight" style={displayFont}>PigTech</span>
          </button>

          <div className="hidden lg:flex items-center gap-0.5">
            {links.map(l => (
              <button key={l.page} onClick={() => nav(l.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === l.page ? "bg-primary/10 text-primary" : "text-foreground/65 hover:text-foreground hover:bg-muted"}`}>
                {l.icon}{l.label}
              </button>
            ))}
            <button onClick={onLogout}
              className="flex items-center gap-1.5 ml-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={15} />Log Out
            </button>
          </div>

          <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {links.map(l => (
            <button key={l.page} onClick={() => nav(l.page)}
              className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${page === l.page ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>
              {l.icon}{l.label}
            </button>
          ))}
          <button onClick={() => { onLogout(); setOpen(false); }}
            className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={15} />Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgot, setForgot] = useState(false);
  const [signUpHint, setSignUpHint] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ─── Login Navbar ─────────────────────────────────────────────── */}
      <nav className="bg-card border-b border-border shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <button className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                🐷
              </div>

              <span
                className="font-bold text-xl text-foreground tracking-tight"
                style={displayFont}
              >
                PigTech
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Login Section ────────────────────────────────────────────── */}
      <main className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-10 sm:py-14">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={IMG.hero}
            alt="Pig farm background"
            className="w-full h-full object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1.5px]" />
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl p-7 sm:p-9">

            {/* Logo */}
            <div className="flex flex-col items-center mb-7">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary flex items-center justify-center text-3xl sm:text-4xl shadow-lg mb-3">
                🐷
              </div>

              <h1
                className="text-3xl font-bold text-foreground"
                style={displayFont}
              >
                PigTech
              </h1>

              <p className="text-muted-foreground text-sm mt-1">
                Smart Pig Farming Platform
              </p>
            </div>

            {/* Login Heading */}
            <h2 className="text-xl font-semibold text-foreground mb-5">
              Log In
            </h2>

            {/* Inputs */}
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="juan@example.com"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
            </div>

            {/* Login Button */}
            <Btn
              variant="primary"
              size="lg"
              onClick={onLogin}
              className="w-full mt-6"
            >
              Login
            </Btn>

            {/* Links */}
            <div className="mt-5 flex items-center justify-between text-sm">
              <button
                onClick={() => setForgot(!forgot)}
                className="text-primary hover:underline font-medium"
              >
                Forgot Password?
              </button>

              <button
                onClick={() => setSignUpHint(!signUpHint)}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="text-primary font-medium">
                  Sign Up
                </span>
              </button>
            </div>

            {/* Forgot Password Message */}
            {forgot && (
              <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
                A password reset link has been sent to your email address.
              </div>
            )}

            {/* Sign Up Message */}
            {signUpHint && (
              <div className="mt-3 p-3 rounded-xl bg-secondary border border-border text-sm text-foreground">
                Create an account at{" "}
                <strong>pigtech.ph/register</strong> to get started.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-base">
              🐷
            </div>

            <span
              className="font-bold text-foreground"
              style={displayFont}
            >
              PigTech
            </span>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-xs sm:text-sm text-center">
            © 2025 PigTech Philippines. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <button
                key={i}
                type="button"
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Icon size={15} />
              </button>
            ))}
          </div>

        </div>
      </footer>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const features = [
    { img: IMG.pig1, tag: "Health",      title: "Health Monitoring",   desc: "Track vitals, vaccinations and medical history for each pig in real-time." },
    { img: IMG.pig2, tag: "Feeding",     title: "Feeding Management",  desc: "Automate feeding schedules and monitor daily nutritional intake per pen." },
    { img: IMG.pig3, tag: "Growth",      title: "Growth Tracking",     desc: "Record weight milestones and compare growth rates across batches." },
    { img: IMG.pig4, tag: "Finance",     title: "Financial Records",   desc: "Log all expenses and income, and generate detailed profitability reports." },
    { img: IMG.pig5, tag: "Breeding",    title: "Breeding Management", desc: "Plan breeding cycles, track sow performance, and maintain genealogy records." },
    { img: IMG.pig6, tag: "Environment", title: "Environment Control", desc: "Monitor pen temperature, humidity and air quality with IoT sensor alerts." },
  ];

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] md:h-[620px] bg-muted">
          <img src={IMG.hero} alt="Pig farm hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest shadow">
                  <Leaf size={12} /> Smart Agriculture
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-5" style={displayFont}>
                  Modern Pig Farming Starts Here
                </h1>
                <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-md">
                  PigTech brings precision agriculture to your farm. Monitor, manage, and maximize the profitability of your pig-raising operation — all from one platform.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Btn size="lg" onClick={() => setPage("calculator")} icon={<TrendingUp size={17} />}>
                    Calculate Your Profit
                  </Btn>
                  <Btn variant="outline" size="lg" onClick={() => setPage("about")}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50">
                    Learn More
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={displayFont}>
            Everything You Need to Farm Smarter
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            From health monitoring to financial planning, PigTech covers every aspect of modern, data-driven pig farming.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wide">
                  {f.tag}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-foreground mb-2 text-base">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.desc}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info cards */}
      <section className="pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        {/* Card 1: image left, text right */}
        <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm grid md:grid-cols-2">
          <div className="h-72 md:h-auto bg-muted min-h-[300px]">
            <img src={IMG.info1} alt="Pig farm management" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Why PigTech?</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={displayFont}>
              Precision Agriculture for Filipino Pig Farmers
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
              Built by farmers, for farmers. PigTech digitizes the daily workflow of pig farming — tracking animals, managing feed, recording expenses — so you spend less time on paperwork and more time growing your livelihood.
            </p>
            <ul className="space-y-3">
              {["Real-time health & weight tracking", "Automated expense and income logging", "Profit projection and calculator tools"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 2: text left, image right */}
        <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm grid md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Profitability</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={displayFont}>
              Know Your Numbers. Grow Your Business.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
              Our built-in Profit Calculator gives instant insight into your financials. Enter your costs, input your selling price, and PigTech shows you exactly where your money is going — and how to maximize your margins with monthly projections.
            </p>
            <div>
              <Btn onClick={() => setPage("calculator")} icon={<ArrowRight size={16} />}>
                Try the Calculator
              </Btn>
            </div>
          </div>
          <div className="h-72 md:h-auto bg-muted order-1 md:order-2 min-h-[300px]">
            <img src={IMG.info2} alt="Pig farm profitability" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-border bg-card py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-base">🐷</div>
            <span className="font-bold text-foreground" style={displayFont}>PigTech</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2025 PigTech Philippines. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                <Icon size={15} />
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={displayFont}>
            About PigTech
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We are a team of agriculture technology professionals passionate about modernizing pig farming across the Philippines.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Col 1: large image */}
          <div className="rounded-2xl overflow-hidden shadow-md bg-muted h-[480px] md:h-[640px]">
            <img src={IMG.pigAbout} alt="Pig farm landscape" className="w-full h-full object-cover" />
          </div>

          {/* Col 2: content */}
          <div className="flex flex-col gap-5">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <p className="text-muted-foreground text-sm leading-relaxed">
                PigTech is a modern digital platform designed to help Filipino pig farmers improve their operations through data-driven tools and smart farm management. Founded in 2023, we serve over <strong className="text-foreground">500 farm operators</strong> across Luzon, Visayas, and Mindanao — tracking more than 12,000 pigs in real time.
              </p>
            </div>

            {[
              {
                icon: <Target size={17} className="text-primary" />,
                title: "Our Mission",
                body: "To empower Filipino pig farmers with accessible, affordable, and intuitive technology that increases productivity, reduces waste, and improves livelihoods nationwide.",
              },
              {
                icon: <Eye size={17} className="text-primary" />,
                title: "Our Vision",
                body: "A future where every pig farmer in the Philippines has access to the same precision tools used by industrial-scale agribusinesses — at a fraction of the cost.",
              },
              {
                icon: <Star size={17} className="text-primary" />,
                title: "Our Goals",
                list: [
                  "Onboard 10,000 farm operators by 2026",
                  "Reduce feed waste by 30% via AI scheduling",
                  "Provide financial literacy tools to rural farmers",
                  "Partner with DA and Bureau of Animal Industry",
                ],
              },
            ].map(card => (
              <div key={card.title} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{card.title}</h3>
                </div>
                {card.body && <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>}
                {card.list && (
                  <ul className="space-y-2">
                    {card.list.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight size={14} className="text-primary mt-0.5 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Col 3: secondary image */}
          <div className="rounded-2xl overflow-hidden shadow-md bg-muted h-64 md:h-[640px]">
            <img src={IMG.pigAbout2} alt="Farm technology" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "500+",  label: "Farm Operators" },
            { value: "12,000+", label: "Pigs Monitored" },
            { value: "₱8M+",  label: "Profit Tracked" },
            { value: "3",     label: "Regions Served" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
              <div className="text-3xl font-bold text-primary mb-1" style={displayFont}>{s.value}</div>
              <div className="text-muted-foreground text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const f = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (v: string) => setForm({ ...form, [k]: v }),
  });

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={displayFont}>Contact Us</h1>
          <p className="text-muted-foreground text-lg">We would love to hear from you. Send us a message and we will respond promptly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6">Send a Message</h2>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Send size={26} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm">We will get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-primary text-sm font-medium hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="Full Name"      placeholder="Juan dela Cruz"     {...f("name")} />
                <Input label="Email Address"  type="email" placeholder="juan@example.com" {...f("email")} />
                <Input label="Subject"        placeholder="How can we help?"    {...f("subject")} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground transition-colors resize-none"
                  />
                </div>
                <Btn size="lg" className="w-full" onClick={() => form.name && form.email && setSent(true)}
                  icon={<Send size={16} />}>
                  Confirm & Send
                </Btn>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: <Phone size={17} className="text-primary" />, label: "Phone",   value: "+63 912 345 6789" },
                  { icon: <Mail size={17} className="text-primary" />,  label: "Email",   value: "hello@pigtech.ph" },
                  { icon: <MapPin size={17} className="text-primary" />, label: "Address", value: "Block 5, Agricultural Ave., Quezon City, Metro Manila, Philippines 1100" },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">{c.label}</div>
                      <div className="text-foreground text-sm">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-5">Follow Us</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { Icon: Facebook,  label: "Facebook",  handle: "@PigTechPH" },
                  { Icon: Twitter,   label: "Twitter",   handle: "@PigTechPH" },
                  { Icon: Instagram, label: "Instagram", handle: "@pigtech.ph" },
                  { Icon: Youtube,   label: "YouTube",   handle: "PigTech PH" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <s.Icon size={17} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.handle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profit Calculator ────────────────────────────────────────────────────────
function CalcPage() {
  const [inp, setInp] = useState({
    numPigs: 50, purchaseCost: 3500, feedCost: 150000,
    medicineCost: 15000, otherExpenses: 10000, sellingPrice: 8500,
  });
  const [sortBy, setSortBy] = useState<"month" | "profit" | "sales">("month");
  const [filterPos, setFilterPos] = useState(false);

  const set = (k: keyof typeof inp) => (v: string) => setInp(p => ({ ...p, [k]: Number(v) }));

  const { totalSales, totalCost, profit, margin } = useMemo(() => {
    const totalSales = inp.numPigs * inp.sellingPrice;
    const totalCost  = inp.numPigs * inp.purchaseCost + inp.feedCost + inp.medicineCost + inp.otherExpenses;
    const profit     = totalSales - totalCost;
    const margin     = totalSales > 0 ? (profit / totalSales) * 100 : 0;
    return { totalSales, totalCost, profit, margin };
  }, [inp]);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const factors = [0.72,0.78,0.85,0.91,0.97,1.04,1.08,1.12,1.07,1.03,0.98,0.95];

  const chartData = useMemo(() => MONTHS.map((month, i) => {
    const f = factors[i];
    return {
      month,
      Sales:  Math.round(totalSales * f / 12),
      Costs:  Math.round(totalCost  * f / 12),
      Profit: Math.round(profit     * f / 12),
    };
  }), [totalSales, totalCost, profit]);

  const tableData = useMemo(() => {
    let data = [...chartData];
    if (filterPos) data = data.filter(d => d.Profit > 0);
    if (sortBy === "profit") data.sort((a, b) => b.Profit - a.Profit);
    else if (sortBy === "sales") data.sort((a, b) => b.Sales - a.Sales);
    return data;
  }, [chartData, sortBy, filterPos]);

  const fmt = (v: number) => `₱${v.toLocaleString("en-PH")}`;
  const pct = (v: number) => `${v.toFixed(1)}%`;

  const statTiles = [
    { label: "Total Sales",      val: fmt(totalSales), bg: "bg-blue-50 border-blue-200",                               txt: "text-blue-700" },
    { label: "Total Cost",       val: fmt(totalCost),  bg: "bg-orange-50 border-orange-200",                           txt: "text-orange-700" },
    { label: "Estimated Profit", val: fmt(profit),     bg: profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200", txt: profit >= 0 ? "text-green-700" : "text-red-600" },
    { label: "Profit Margin",    val: pct(margin),     bg: margin >= 0 ? "bg-primary/5 border-primary/20" : "bg-red-50 border-red-200", txt: margin >= 0 ? "text-primary" : "text-red-600" },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2" style={displayFont}>Profit Calculator</h1>
          <p className="text-muted-foreground">Estimate your farm's profitability based on your costs and selling price.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calculator size={18} className="text-primary" /> Farm Inputs
            </h2>
            <div className="space-y-4">
              <Input label="Number of Pigs"         value={inp.numPigs}        onChange={set("numPigs")}        placeholder="50" />
              <Input label="Purchase Cost / Pig"    value={inp.purchaseCost}   onChange={set("purchaseCost")}   placeholder="3500"  prefix="₱" />
              <Input label="Total Feed Cost"        value={inp.feedCost}       onChange={set("feedCost")}       placeholder="150000" prefix="₱" />
              <Input label="Medicine Cost"          value={inp.medicineCost}   onChange={set("medicineCost")}   placeholder="15000" prefix="₱" />
              <Input label="Other Expenses"         value={inp.otherExpenses}  onChange={set("otherExpenses")}  placeholder="10000" prefix="₱" />
              <Input label="Selling Price / Pig"    value={inp.sellingPrice}   onChange={set("sellingPrice")}   placeholder="8500"  prefix="₱" />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {statTiles.map(s => (
                <div key={s.label} className={`rounded-2xl p-6 border ${s.bg}`}>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">{s.label}</div>
                  <div className={`text-2xl font-bold ${s.txt}`} style={displayFont}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-5">Monthly Projection — Sales / Costs / Profit</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gSales"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gCosts"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#f97316" stopOpacity={0.15}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#2d6a2f" stopOpacity={0.2}/><stop offset="95%" stopColor="#2d6a2f" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b6b5f" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b6b5f" }} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [fmt(v)]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="Sales"  stroke="#3b82f6" fill="url(#gSales)"  strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="Costs"  stroke="#f97316" fill="url(#gCosts)"  strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="Profit" stroke="#2d6a2f" fill="url(#gProfit)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
                <h3 className="font-semibold text-foreground flex-1">Monthly Breakdown</h3>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as "month" | "profit" | "sales")}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                  <option value="month">Sort by Month</option>
                  <option value="profit">Sort by Profit</option>
                  <option value="sales">Sort by Sales</option>
                </select>
                <button
                  onClick={() => setFilterPos(!filterPos)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${filterPos ? "bg-primary text-white border-primary" : "border-border text-foreground hover:bg-muted"}`}>
                  {filterPos ? "All Months" : "Profitable Only"}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      {["Month","Sales","Costs","Profit","Margin"].map(h => (
                        <th key={h} className={`px-4 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wide ${h === "Month" ? "text-left" : "text-right"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => {
                      const m = row.Sales > 0 ? (row.Profit / row.Sales) * 100 : 0;
                      return (
                        <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{row.month}</td>
                          <td className="px-4 py-3 text-right text-blue-700 font-medium">{fmt(row.Sales)}</td>
                          <td className="px-4 py-3 text-right text-orange-700">{fmt(row.Costs)}</td>
                          <td className={`px-4 py-3 text-right font-semibold ${row.Profit >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(row.Profit)}</td>
                          <td className={`px-4 py-3 text-right text-xs font-bold ${m >= 0 ? "text-primary" : "text-red-600"}`}>{pct(m)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
type Msg = { id: number; text?: string; image?: string; from: "me" | "other"; time: string };
type Convo = { id: number; name: string; initials: string; preview: string; time: string; unread?: number; messages: Msg[] };

const initConvos: Convo[] = [
  {
    id: 1, name: "Maria Santos", initials: "MS", time: "10:30 AM", unread: 2,
    preview: "What feed supplement do you recommend?",
    messages: [
      { id: 1, text: "Hi! I saw your farm profile on PigTech. Very impressive setup!", from: "other", time: "10:15 AM" },
      { id: 2, text: "Thank you! We have been using the platform for about 3 months now.", from: "me", time: "10:17 AM" },
      { id: 3, image: IMG.chatImg, from: "other", time: "10:19 AM" },
      { id: 4, text: "Here is one of my batch from last month — healthy litter!", from: "other", time: "10:20 AM" },
      { id: 5, text: "What feed supplement do you recommend for faster weight gain?", from: "other", time: "10:30 AM" },
    ],
  },
  {
    id: 2, name: "Rodel Aquino", initials: "RA", time: "Yesterday",
    preview: "The weekly health report looks good!",
    messages: [
      { id: 1, text: "Good morning! How is the herd doing this week?", from: "other", time: "9:00 AM" },
      { id: 2, text: "All pigs are healthy. No disease flags at all.", from: "me", time: "9:05 AM" },
      { id: 3, text: "The weekly health report looks good! Keep it up.", from: "other", time: "9:10 AM" },
    ],
  },
  {
    id: 3, name: "PigTech Support", initials: "PT", time: "Mon",
    preview: "Your account has been verified.",
    messages: [
      { id: 1, text: "Welcome to PigTech! Your account has been verified. You can now start adding your pigs.", from: "other", time: "8:00 AM" },
      { id: 2, text: "Thank you! Very excited to get started.", from: "me", time: "8:10 AM" },
    ],
  },
  {
    id: 4, name: "Lina Mercado", initials: "LM", time: "Sun",
    preview: "Can I visit your farm this Saturday?",
    messages: [
      { id: 1, text: "Hello! I am from Batangas and would love to learn your system.", from: "other", time: "3:00 PM" },
      { id: 2, text: "Sure! We do farm visits every Saturday morning.", from: "me", time: "3:15 PM" },
      { id: 3, text: "Can I visit your farm this Saturday? I will bring a friend too.", from: "other", time: "3:18 PM" },
    ],
  },
  {
    id: 5, name: "Ben Cruz", initials: "BC", time: "Sat",
    preview: "Profit was up 15% this quarter!",
    messages: [
      { id: 1, text: "Just ran my quarterly report on PigTech.", from: "other", time: "2:00 PM" },
      { id: 2, text: "Profit was up 15% this quarter! The calculator feature is so useful.", from: "other", time: "2:01 PM" },
      { id: 3, text: "That is amazing! Well done, Ben!", from: "me", time: "2:06 PM" },
    ],
  },
];

function ChatPage() {
  const [convos, setConvos]   = useState(initConvos);
  const [activeId, setActive] = useState(1);
  const [text, setText]       = useState("");
  const [query, setQuery]     = useState("");
  const endRef                = useRef<HTMLDivElement>(null);

  const active = convos.find(c => c.id === activeId)!;
  const filtered = convos.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.preview.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeId, active.messages.length]);

  const send = () => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setConvos(prev => prev.map(c => c.id === activeId
      ? { ...c, preview: text, messages: [...c.messages, { id: c.messages.length + 1, text, from: "me", time: now }] }
      : c
    ));
    setText("");
  };

  const avatarBg = (id: number) => ["bg-primary","bg-teal-600","bg-violet-600","bg-rose-500","bg-amber-600"][id % 5];

  return (
    <div className="bg-background" style={{ height: "calc(100vh - 64px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-full">
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden h-full flex">
          {/* Conversation list */}
          <div className="w-72 flex-shrink-0 border-r border-border flex-col hidden sm:flex">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground mb-3">Messages</h2>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map(c => (
                <button key={c.id} onClick={() => setActive(c.id)}
                  className={`w-full text-left p-4 border-b border-border flex items-start gap-3 hover:bg-muted/50 transition-colors ${activeId === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${avatarBg(c.id)}`}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-semibold text-foreground text-sm truncate">{c.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs text-muted-foreground truncate">{c.preview}</span>
                      {c.unread && (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${avatarBg(active.id)}`}>
                {active.initials}
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm">{active.name}</div>
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {active.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col gap-1 max-w-xs lg:max-w-sm ${msg.from === "me" ? "items-end" : "items-start"}`}>
                    {msg.image ? (
                      <div className="rounded-2xl overflow-hidden shadow-sm">
                        <img src={msg.image} alt="Shared image" className="w-52 h-36 object-cover" />
                      </div>
                    ) : (
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.from === "me" ? "bg-primary text-white rounded-br-sm" : "bg-card text-foreground border border-border rounded-bl-sm"}`}>
                        {msg.text}
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex-shrink-0">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={send}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm flex-shrink-0 disabled:opacity-50"
                  disabled={!text.trim()}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Jose Maria Reyes", email: "jose.reyes@pigtech.ph",
    phone: "+63 917 234 5678",  location: "Nueva Ecija, Philippines",
    farmName: "Reyes Family Farm", farmSize: "2.5 hectares",
    joinedDate: "March 15, 2024",  subscription: "Professional Plan",
    region: "Region III – Central Luzon",
  });
  const [draft, setDraft] = useState({ ...profile });

  const initials = profile.name.split(" ").map(n => n[0]).slice(0, 2).join("");

  const editFields: { label: string; key: keyof typeof profile }[] = [
    { label: "Full Name",     key: "name" },
    { label: "Email Address", key: "email" },
    { label: "Phone Number",  key: "phone" },
    { label: "Location",      key: "location" },
    { label: "Farm Name",     key: "farmName" },
    { label: "Farm Size",     key: "farmSize" },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg select-none">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors">
                <Camera size={14} className="text-muted-foreground" />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1" style={displayFont}>{profile.name}</h1>
              <p className="text-muted-foreground text-sm mb-1">{profile.email}</p>
              <p className="text-muted-foreground text-sm mb-3">{profile.farmName} · {profile.location}</p>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                {profile.subscription}
              </span>
            </div>
            <Btn variant="outline" size="sm" icon={<Edit2 size={14} />} onClick={() => { setDraft({ ...profile }); setEditing(!editing); }}>
              {editing ? "Cancel" : "Edit Profile"}
            </Btn>
          </div>
        </div>

        {editing ? (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Edit Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editFields.map(f => (
                <Input key={f.key} label={f.label} value={draft[f.key]}
                  onChange={v => setDraft(p => ({ ...p, [f.key]: v }))} />
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Btn onClick={() => { setProfile({ ...draft }); setEditing(false); }}>Save Changes</Btn>
              <Btn variant="outline" onClick={() => setEditing(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">Account Information</h2>
              <dl className="space-y-4">
                {[
                  { t: "Member Since",  v: profile.joinedDate },
                  { t: "Subscription",  v: profile.subscription },
                  { t: "Region",        v: profile.region },
                  { t: "Phone",         v: profile.phone },
                ].map(i => (
                  <div key={i.t} className="flex justify-between items-start gap-4">
                    <dt className="text-sm text-muted-foreground flex-shrink-0">{i.t}</dt>
                    <dd className="text-sm text-foreground font-medium text-right">{i.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">Farm Details</h2>
              <dl className="space-y-4">
                {[
                  { t: "Farm Name", v: profile.farmName },
                  { t: "Farm Size", v: profile.farmSize },
                  { t: "Location",  v: profile.location },
                  { t: "Region",    v: profile.region },
                ].map(i => (
                  <div key={i.t} className="flex justify-between items-start gap-4">
                    <dt className="text-sm text-muted-foreground flex-shrink-0">{i.t}</dt>
                    <dd className="text-sm text-foreground font-medium text-right">{i.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="sm:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">Activity Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "87",    label: "Active Pigs" },
                  { value: "₱1.2M", label: "Total Revenue" },
                  { value: "34%",   label: "Avg Profit Margin" },
                ].map(s => (
                  <div key={s.label} className="text-center p-5 rounded-xl bg-secondary border border-secondary">
                    <div className="text-2xl font-bold text-primary mb-1" style={displayFont}>{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState<Page>("login");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin  = () => { setLoggedIn(true); setPage("home"); };
  const handleLogout = () => { setLoggedIn(false); setPage("login"); };

  if (!loggedIn || page === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar page={page} setPage={setPage} onLogout={handleLogout} />
      {page === "home"       && <HomePage setPage={setPage} />}
      {page === "about"      && <AboutPage />}
      {page === "contact"    && <ContactPage />}
      {page === "calculator" && <CalcPage />}
      {page === "chat"       && <ChatPage />}
      {page === "profile"    && <ProfilePage />}
    </div>
  );
}
