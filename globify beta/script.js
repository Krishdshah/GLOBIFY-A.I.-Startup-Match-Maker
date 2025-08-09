// ===== PREMIUM B2B MATCHMAKING PLATFORM SCRIPTS =====

document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scroll for navigation links
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
    }
  });
});

  // Header scroll effect
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.style.background = 'rgba(13, 13, 13, 0.98)';
      header.style.backdropFilter = 'blur(20px)';
    } else {
      header.style.background = 'rgba(13, 13, 13, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    }
    
    lastScrollTop = scrollTop;
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe feature cards and pricing cards
  const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .stat-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission
      const submitBtn = this.querySelector('.contact-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = 'linear-gradient(135deg, var(--gold-primary), var(--bronze-secondary))';
          this.reset();
        }, 2000);
      }, 1500);
    });
  }

  // Pricing card interactions
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('popular')) {
        this.style.transform = 'translateY(0) scale(1)';
      } else {
        this.style.transform = 'translateY(-5px) scale(1)';
      }
    });
  });

  // Dynamic stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalNumber = target.textContent;
        const isPlus = finalNumber.includes('+');
        const isMoney = finalNumber.includes('$') || finalNumber.includes('₹');
        let numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
          }
          
          let displayValue = Math.floor(current).toLocaleString();
          if (isMoney && finalNumber.includes('$')) {
            displayValue = '$' + displayValue + 'M';
          } else if (isMoney && finalNumber.includes('₹')) {
            displayValue = '₹' + displayValue;
          } else if (isPlus) {
            displayValue = displayValue + '+';
          }
          
          target.textContent = displayValue;
        }, 30);
        
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });

  // Mobile menu toggle (if needed)
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Enhanced connection line animations
  const connectionLines = document.querySelectorAll('.connection-line');
  connectionLines.forEach((line, index) => {
    line.style.animationDelay = `${index * 0.5}s`;
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual, .world-map');
    
    parallaxElements.forEach(element => {
      const speed = 0.3;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

});

// ===== CHATBOT FUNCTIONALITY =====

class GlobifyChatbot {
    constructor() {
        this.chatWidget = document.getElementById('chatbotWidget');
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.minimizeButton = document.getElementById('minimizeChat');
        this.closeButton = document.getElementById('closeChat');
        this.fullscreenButton = document.getElementById('fullscreenChat');
        this.suggestions = document.getElementById('suggestions');
        
        this.isOpen = false;
        this.isMinimized = false;
        this.isFullscreen = false;
        this.isTyping = false;
        this.messageHistory = [];
        this.currentSuggestions = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.generateSuggestions();
        this.showNotification();
        
        // Auto-show notification after 5 seconds for demo
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotification();
            }
        }, 5000);
    }

    bindEvents() {
        // Chat toggle
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        
        // Chat controls
        this.minimizeButton.addEventListener('click', () => this.toggleMinimize());
        this.closeButton.addEventListener('click', () => this.closeChat());
        this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
        
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input handling
        this.messageInput.addEventListener('input', () => this.handleInput());
        this.messageInput.addEventListener('focus', () => this.showSuggestions());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key to exit fullscreen
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
        });
        this.messageInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 200);
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.messageInput.value = message;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatContainer.classList.add('active');
        this.hideNotification();
        
        // Focus input after animation
        setTimeout(() => {
            this.messageInput.focus();
        }, 400);
    }

    closeChat() {
        this.isOpen = false;
        this.isMinimized = false;
        this.isFullscreen = false;
        this.chatContainer.classList.remove('active', 'minimized', 'fullscreen');
        
        // Reset UI elements when closing
        this.chatToggle.style.display = 'block';
        this.minimizeButton.style.display = 'block';
        document.body.style.overflow = '';
        
        // Reset fullscreen button
        const icon = this.fullscreenButton.querySelector('i');
        icon.className = 'fas fa-expand';
        this.fullscreenButton.title = 'Fullscreen';
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.chatContainer.classList.toggle('minimized');
        
        const icon = this.minimizeButton.querySelector('i');
        if (this.isMinimized) {
            icon.className = 'fas fa-plus';
        } else {
            icon.className = 'fas fa-minus';
        }
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.chatContainer.classList.toggle('fullscreen');
        
        // Update fullscreen button icon
        const icon = this.fullscreenButton.querySelector('i');
        if (this.isFullscreen) {
            icon.className = 'fas fa-compress';
            this.fullscreenButton.title = 'Exit Fullscreen';
            
            // Disable minimize in fullscreen mode
            this.minimizeButton.style.display = 'none';
            
            // Hide toggle button when in fullscreen
            this.chatToggle.style.display = 'none';
            
            // Prevent body scroll when in fullscreen
            document.body.style.overflow = 'hidden';
        } else {
            icon.className = 'fas fa-expand';
            this.fullscreenButton.title = 'Fullscreen';
            
            // Re-enable minimize
            this.minimizeButton.style.display = 'block';
            
            // Show toggle button again
            this.chatToggle.style.display = 'block';
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
        
        // Auto-scroll to bottom after fullscreen toggle
        setTimeout(() => {
            this.scrollToBottom();
        }, 300);
    }

    showNotification() {
        this.chatToggle.querySelector('.notification-dot').style.display = 'block';
    }

    hideNotification() {
        this.chatToggle.querySelector('.notification-dot').style.display = 'none';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.hideSuggestions();

        // Show typing indicator
        this.showTyping();

        // Simulate AI response delay
        await this.delay(1000 + Math.random() * 2000);

        // Generate AI response
        const response = await this.generateAIResponse(message);
        this.hideTyping();
        this.addMessage(response, 'ai');

        // Update suggestions
        this.generateSuggestions();
    }

    addMessage(content, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const text = document.createElement('p');
        text.textContent = content;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = this.getCurrentTime();

        messageContent.appendChild(text);
        messageContent.appendChild(time);
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);

        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();

        // Store in history
        this.messageHistory.push({ content, sender, timestamp: new Date() });
    }

    showTyping() {
        this.isTyping = true;
        this.sendButton.disabled = true;

        const typingElement = document.createElement('div');
        typingElement.className = 'message ai-message typing-indicator';
        typingElement.id = 'typing-indicator';
        
        typingElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.sendButton.disabled = false;
        
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    async generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Enhanced AI Response Database with Indian Business Context
        const responses = {
            // Greetings
            greeting: [
                "Hello! I'm excited to help you with your global business needs. As an Indian startup looking to expand globally, I can guide you through regulatory requirements, partnership strategies, and more. What can I assist you with today?",
                "Hi there! Welcome to Globify. I'm here to help Indian businesses connect with global opportunities while ensuring compliance with local and international regulations. How can I help?",
                "Greetings! I'm your AI assistant specializing in global business partnerships for Indian companies. From business registration to international contracts, I'm here to guide you. What's on your mind?"
            ],
            
            // Business Registration & Licensing
            registration: [
                "For global clients, I highly recommend registering your startup as a Private Limited Company, LLP, or OPC in India. Most overseas enterprises prefer dealing with legally registered companies for credibility, contract security, and tax compliance. Registration also helps with opening current accounts and receiving foreign payments. Would you like guidance on the registration process?",
                "Yes, while you can take global clients as a sole proprietor, it's riskier as foreign clients may hesitate due to lower credibility. Incorporating as a Private Limited Company significantly improves trust and makes international contracts much easier. The investment in proper registration pays off when dealing with enterprise clients.",
                "Absolutely! You need an Import Export Code (IEC) from DGFT to receive foreign payments in India, even for IT or SaaS exports. This is mandatory for any service exports. I can guide you through the IEC application process and other compliance requirements for international business."
            ],
            
            // Cross-Border Payments & GST
            payments: [
                "For receiving USD payments from US clients, you can use wire transfers (SWIFT), Wise, or PayPal Business. Your bank will require a FIRC (Foreign Inward Remittance Certificate) for compliance. Make sure to maintain proper documentation for all foreign transactions. Need help with setting up payment processes?",
                "Great news! Exports from India are zero-rated under GST, meaning you don't pay GST on exported services. However, you must file a LUT (Letter of Undertaking) with GST authorities and submit proper export invoices. This applies to IT services, consultancy, and other service exports. Want me to explain the LUT process?",
                "For cross-border payments, ensure you have the right banking setup. You'll need an IEC code, proper invoicing in foreign currency, and compliance with FEMA regulations. Most Indian banks can handle foreign remittances, but some digital solutions like Wise offer better rates and faster processing."
            ],
            
            // NDAs & Contracts
            contracts: [
                "Absolutely! Always sign an NDA before sharing proprietary tech or sensitive business information with foreign clients. Include jurisdiction clauses that suit you - prefer Indian law if possible, or neutral arbitration in countries like Singapore. This protects your intellectual property during the evaluation phase.",
                "Your service contract with overseas clients should include: scope of work, clear timelines, payment terms, intellectual property ownership, dispute resolution method, and governing law. Also specify currency, tax responsibilities, and termination clauses. For Indian companies, it's crucial to clarify which country's laws apply in case of disputes.",
                "For NDAs and contracts, consider the legal framework carefully. If disputes arise, you want resolution mechanisms that are accessible and fair. Singapore and UAE are popular choices for neutral arbitration in Asia. Always have a legal expert review international contracts before signing."
            ],
            
            // Partnership queries
            partners: [
                "Finding the right global partners for Indian startups requires understanding both markets. Our AI system analyzes industry compatibility, regulatory requirements, cultural fit, and business synergies. We help Indian companies navigate international compliance while matching with suitable global enterprises. Currently serving 10,000+ verified startups across 50+ countries.",
                "For Indian businesses expanding globally, partnerships are crucial. We consider factors like your company's legal structure (Pvt Ltd recommended), IEC status, GST compliance, and international experience. Our algorithm matches you with enterprises that understand the Indian market and can support your global expansion journey.",
                "As an Indian startup, your success rate improves significantly with proper legal structure and compliance. We've helped numerous Indian companies secure international partnerships worth $2.3M average deal value. Key factors include business registration, IEC code, proper contracts, and cultural understanding."
            ],
            
            // Pricing information
            pricing: [
                "Our pricing is designed for Indian startups at every stage: Free plan for exploration, Starter (₹3,000/month) for growing companies with unlimited global matches and compliance guidance, Pro (₹12,000/month) with dedicated support for international expansion, legal template access, and priority matching with verified global enterprises. All plans include India-specific compliance guidance.",
                "For Indian businesses, we offer specialized support: regulatory guidance for IEC, GST, and FEMA compliance, contract templates suitable for Indian law, and dedicated assistance for cross-border payment setup. Our Starter plan (₹3,000/month) includes these India-specific features plus unlimited global matching.",
                "Flexible pricing for Indian startups: Free plan covers basic compliance guidance, Starter (₹3,000/month) adds unlimited matching with compliance tracking, Pro (₹12,000/month) includes dedicated legal support, priority enterprise matching, and India-US business corridor expertise. Which stage is your startup at?"
            ],
            
            // AI and technology
            ai_matching: [
                "Our AI is specifically trained on Indian startup success patterns and global partnership data. We analyze your business registration status, compliance readiness, industry vertical, and growth trajectory. The system considers India-specific factors like GST registration, IEC status, and regulatory compliance to match you with suitable global partners who understand the Indian market.",
                "For Indian startups, our algorithm evaluates 50+ data points including legal structure, export readiness, cultural compatibility, and regulatory compliance. We've analyzed 500+ successful India-global partnerships to understand what works. The system learns from each successful match to improve recommendations for Indian businesses.",
                "Our AI combines Indian regulatory requirements with global market dynamics. We assess your compliance status (IEC, GST, business registration), cultural fit with target markets, and readiness for international contracts. This India-specific approach has achieved 73% success rate for meaningful connections with global enterprises."
            ],
            
            // Global reach with India focus
            global_reach: [
                "Globify has strong presence in key markets for Indian businesses: USA (Silicon Valley, New York), UK (London), Singapore, Dubai, Canada (Toronto), and Australia. We understand the India-US corridor, India-Europe partnerships, and emerging opportunities in Southeast Asia and Middle East. Our Bangalore team provides local support with global expertise.",
                "Our network spans 50+ countries with specialized focus on Indian business expansion. Key corridors include India-US (tech partnerships), India-UK (fintech), India-Singapore (regional expansion), and India-UAE (Middle East gateway). We handle timezone coordination, cultural bridge-building, and regulatory compliance for Indian companies going global.",
                "We operate across major startup ecosystems with dedicated support for Indian businesses. Our Bangalore office works closely with Silicon Valley, London, Singapore, and Dubai teams to facilitate smooth international partnerships. We've helped Indian companies navigate regulations in 50+ countries with $1.2B+ total partnership value."
            ],
            
            // Startup Basics
            startup_basics: [
                "Starting a business in India begins with identifying a problem to solve, researching your target audience, and validating your idea before legal registration. You don't need an office - you can register with a residential address. For credibility and easier fundraising, I recommend a Private Limited Company over sole proprietorship, especially for international business.",
                "A solid business plan should outline your business model, target market, value proposition, competition analysis, and revenue streams. Focus on solving a real problem, understand your customers deeply, and validate your concept with an MVP (Minimum Viable Product) before full-scale launch.",
                "For business registration, you have options: Sole Proprietorship (simple but less credible), Private Limited Company (best for credibility and fundraising), LLP (good for partnerships), or OPC (one-person company). For global business, Pvt Ltd is strongly recommended as international clients prefer dealing with registered companies."
            ],

            // Funding & Finance  
            funding_finance: [
                "Indian startups have multiple funding options: bootstrapping (self-funding), angel investors, venture capital, crowdfunding, and government schemes like Startup India Seed Fund. Banks and NBFCs offer business loans, including MUDRA loans for micro-enterprises. Start with bootstrapping to prove your concept before seeking external funding.",
                "Equity funding means raising capital by selling shares of your company to investors. Before approaching investors, ensure you have a solid business plan, validated MVP, clear financial projections, and understand your valuation. Prepare for due diligence - a thorough review of your legal, financial, and operational details.",
                "For loans, you'll need a strong business plan, financial projections, collateral, and good credit history. Government schemes like Stand-up India, MUDRA loans, and Startup India provide easier access to funding. Consider the cost of capital and ensure you can service the debt before taking loans."
            ],

            // Market Research & Strategy
            market_strategy: [
                "Market research is crucial for startup success. Use surveys, interviews, competitor analysis, and tools like Google Trends to understand your market. Identify your target audience by analyzing demographics, interests, and buying behavior. Create buyer personas and validate demand before building your product.",
                "Competitor analysis helps you find market gaps and define your unique selling points. Study their pricing, features, marketing strategies, and customer reviews. An MVP (Minimum Viable Product) with core features helps test market demand without major investment. Iterate based on user feedback.",
                "Understanding your target audience is key to product-market fit. Analyze customer demographics, pain points, buying behavior, and preferences. Use tools like Google Analytics, social media insights, and direct customer feedback. Validate assumptions through real user interactions before scaling."
            ],

            // Scaling & Growth
            scaling_growth: [
                "Expand your business when you have consistent demand, positive cash flow, and operational stability. For international markets, research local regulations, adapt your product to local needs, and consider partnering with local distributors. Globify can help you find the right international partners and navigate compliance.",
                "Franchising allows others to operate under your brand in exchange for fees or royalties. Ensure you have a proven business model, strong brand, and systems in place. Automation is crucial for scaling - use software for accounting, CRM, marketing, and inventory management to improve efficiency.",
                "International expansion requires careful planning: understand local regulations, cultural differences, tax implications, and market preferences. Start with similar markets or where you have existing connections. Consider digital-first approaches to test international demand before physical expansion."
            ],

            // Advanced Business Concepts
            advanced_concepts: [
                "Startup valuation estimates your company's worth during fundraising or acquisition. Methods include DCF (discounted cash flow), comparable company analysis, and revenue multiples. ESOPs (Employee Stock Ownership Plans) give employees company shares as incentives, helping retain talent and align interests.",
                "A cap table is a spreadsheet showing ownership distribution among shareholders. Keep it simple initially and update it with each funding round. Due diligence involves investors thoroughly reviewing your legal, financial, and operational details - maintain organized records and be transparent.",
                "Understanding equity dilution, vesting schedules, liquidation preferences, and anti-dilution provisions is crucial when raising funds. Work with experienced lawyers and financial advisors. Consider the long-term implications of each funding round on your ownership and control."
            ],

            // Licensing & Legal Enhanced
            licensing_legal: [
                "GST registration is mandatory if turnover exceeds ₹20 lakh (₹10 lakh for special category states) or for inter-state supply. MSME registration provides benefits like cheaper loans, subsidies, and easier government tenders. For food businesses, you need FSSAI license, GST registration, and local health trade license.",
                "IEC (Import Export Code) is essential for international business - apply online at DGFT website with PAN, bank details, and address proof. For IT/software services, you may need additional licenses depending on your specific services and target markets. Ensure compliance before starting operations.",
                "Different businesses require different licenses: trading license for retail, professional tax registration, labor license for employees, environmental clearance for manufacturing, etc. Research specific requirements for your industry and location. Non-compliance can lead to penalties and business disruption."
            ],

            // India-specific features
            india_features: [
                "For Indian startups going global, we provide specialized services: business registration guidance (Pvt Ltd recommended), IEC application support, GST compliance for exports, FEMA regulations assistance, international contract templates, cross-border payment setup, and cultural training for global partnerships. Our platform includes India-specific regulatory tracking and compliance alerts.",
                "Key features for Indian businesses include: startup ecosystem guidance, funding strategy advice, legal compliance checking (GST, MSME, IEC), pre-vetted international partners familiar with Indian market, contract templates with Indian law options, payment integration with Indian banks, and dedicated support for regulatory queries.",
                "We've built comprehensive support understanding the Indian startup journey: from idea validation to international expansion. This includes business plan templates, funding readiness assessment, market research tools, competitive analysis, regulatory compliance dashboard, export documentation assistance, and 24/7 support with Indian business hours coverage."
            ],
            
            // Support and contact
            support: [
                "I'm here 24/7 with specialized knowledge of Indian business regulations and global expansion! For regulatory queries about IEC, GST, or international contracts, I can provide immediate guidance. For complex legal matters, our Indian legal partners are available through our Pro plan. Our Bangalore team provides support during Indian business hours.",
                "Multiple support channels for Indian businesses: 24/7 AI assistance (that's me!) with regulatory knowledge, email support at india@globify.com, dedicated India helpline for Pro clients, and partnership with Indian legal experts for contract review. We also provide weekly webinars on topics like GST for exports, international payment setup, and contract negotiations.",
                "Our support is designed for Indian startups going global: instant regulatory guidance, cultural communication tips, legal template access, and connections with Indian entrepreneurs who've successfully expanded internationally. Pro clients get dedicated account managers familiar with Indian business environment and global expansion challenges."
            ],
            
            // Regulatory and Compliance
            compliance: [
                "For Indian startups, compliance is crucial for global success. Key requirements include: business registration (Pvt Ltd recommended), IEC from DGFT for foreign payments, GST registration with LUT filing for zero-rated exports, FEMA compliance for foreign transactions, and proper invoicing in foreign currency. I can guide you through each step.",
                "Indian businesses must ensure regulatory compliance before global expansion. This includes obtaining IEC for export eligibility, understanding GST implications (exports are zero-rated but require LUT), maintaining FIRC documentation for foreign payments, and having proper legal structure for international contracts. Want help with any specific compliance area?",
                "Regulatory compliance checklist for Indian global business: ✓ Business registration (Pvt Ltd/LLP/OPC), ✓ IEC from DGFT, ✓ GST registration with export procedures, ✓ Current account for foreign transactions, ✓ Understanding of FEMA regulations, ✓ Proper contract templates. Missing any of these? I can help!"
            ],
            
            // Default responses
            default: [
                "That's an interesting question! As a specialist in helping Indian businesses expand globally, I'd be happy to help you understand regulatory requirements, partnership strategies, or compliance matters. Could you tell me more about your specific business situation or what you're looking to achieve internationally?",
                "I'd love to help you with that! My expertise covers Indian business regulations, global expansion strategies, and international partnership facilitation. Whether you need guidance on IEC registration, GST for exports, international contracts, or finding the right global partners, I'm here to assist. What specific area would you like to explore?",
                "Thanks for asking! I specialize in helping Indian startups and businesses navigate global expansion. From regulatory compliance (IEC, GST, FEMA) to international partnerships and cross-border payments, I can guide you through the complexities of taking your Indian business global. What's your main business objective or challenge?"
            ]
        };

        // Determine response category with comprehensive startup and business keywords
        let category = 'default';
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good') || message.includes('namaste')) {
            category = 'greeting';
        } else if (message.includes('start') || message.includes('starting') || message.includes('first step') || message.includes('business plan') || message.includes('idea') || message.includes('validate') || message.includes('office') || message.includes('address') || message.includes('residential')) {
            category = 'startup_basics';
        } else if (message.includes('fund') || message.includes('funding') || message.includes('investor') || message.includes('investment') || message.includes('bootstrap') || message.includes('loan') || message.includes('equity') || message.includes('venture capital') || message.includes('angel') || message.includes('mudra') || message.includes('crowdfunding') || message.includes('seed fund')) {
            category = 'funding_finance';
        } else if (message.includes('market research') || message.includes('competitor') || message.includes('competition') || message.includes('mvp') || message.includes('minimum viable') || message.includes('target audience') || message.includes('customer') || message.includes('survey') || message.includes('analysis') || message.includes('trends')) {
            category = 'market_strategy';
        } else if (message.includes('expand') || message.includes('expansion') || message.includes('scale') || message.includes('scaling') || message.includes('grow') || message.includes('growth') || message.includes('international') || message.includes('franchise') || message.includes('automat') || message.includes('operations')) {
            category = 'scaling_growth';
        } else if (message.includes('valuation') || message.includes('esop') || message.includes('cap table') || message.includes('due diligence') || message.includes('equity') || message.includes('shares') || message.includes('stock') || message.includes('dilution') || message.includes('vesting')) {
            category = 'advanced_concepts';
        } else if (message.includes('license') || message.includes('licensing') || message.includes('gst') || message.includes('msme') || message.includes('fssai') || message.includes('trade license') || message.includes('professional tax') || message.includes('labor license') || message.includes('environmental')) {
            category = 'licensing_legal';
        } else if (message.includes('register') || message.includes('registration') || message.includes('pvt ltd') || message.includes('private limited') || message.includes('llp') || message.includes('opc') || message.includes('sole proprietor') || message.includes('company') || message.includes('incorporate')) {
            category = 'startup_basics';
        } else if (message.includes('payment') || message.includes('usd') || message.includes('dollar') || message.includes('wire transfer') || message.includes('paypal') || message.includes('wise') || message.includes('firc') || message.includes('export') || message.includes('lut') || message.includes('zero rated')) {
            category = 'payments';
        } else if (message.includes('nda') || message.includes('contract') || message.includes('agreement') || message.includes('legal') || message.includes('jurisdiction') || message.includes('singapore') || message.includes('arbitration') || message.includes('dispute')) {
            category = 'contracts';
        } else if (message.includes('compliance') || message.includes('iec') || message.includes('import export code') || message.includes('dgft') || message.includes('fema') || message.includes('regulatory') || message.includes('requirement')) {
            category = 'compliance';
        } else if (message.includes('india') || message.includes('indian') || message.includes('bangalore') || message.includes('mumbai') || message.includes('delhi') || message.includes('startup india') || message.includes('rupee') || message.includes('inr')) {
            category = 'india_features';
        } else if (message.includes('partner') || message.includes('enterprise') || message.includes('match') || message.includes('find') || message.includes('collaboration') || message.includes('connect')) {
            category = 'partners';
        } else if (message.includes('price') || message.includes('cost') || message.includes('plan') || message.includes('pricing') || message.includes('tier') || message.includes('₹') || message.includes('rupees')) {
            category = 'pricing';
        } else if (message.includes('ai') || message.includes('algorithm') || message.includes('matching') || message.includes('how does') || message.includes('work') || message.includes('technology')) {
            category = 'ai_matching';
        } else if (message.includes('global') || message.includes('countries') || message.includes('worldwide') || message.includes('reach') || message.includes('usa') || message.includes('uk') || message.includes('dubai')) {
            category = 'global_reach';
        } else if (message.includes('feature') || message.includes('capability') || message.includes('what can') || message.includes('what do') || message.includes('service') || message.includes('offering')) {
            category = 'india_features';
        } else if (message.includes('support') || message.includes('help') || message.includes('contact') || message.includes('assistance') || message.includes('guidance')) {
            category = 'support';
        }

        // Return random response from category
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    generateSuggestions() {
        const suggestions = [
            // Startup Basics
            "How do I write a business plan?",
            "Should I start as sole proprietor or Pvt Ltd?",
            "Do I need an office to register my company?",
            "What's the first step to start a business?",
            
            // Funding & Finance
            "How can I raise funds for my startup?",
            "What is bootstrapping vs equity funding?",
            "Can I get a loan for a new business?",
            "What government schemes are available?",
            
            // Legal & Licensing
            "Do I need GST registration to start?",
            "What is MSME registration?",
            "What licenses do I need for my business?",
            "How to get an IEC for exports?",
            
            // Market Research
            "How do I research my market?",
            "What is an MVP and why is it important?",
            "How to identify my target audience?",
            "Why is competitor analysis important?",
            
            // Scaling & Growth
            "When should I expand my business?",
            "How to enter international markets?",
            "What is franchising?",
            "How to automate operations?",
            
            // Advanced Concepts
            "What is startup valuation?",
            "What are ESOPs?",
            "What is a cap table?",
            "What is due diligence?",
            
            // International Business
            "Do I need business registration for global clients?",
            "How to receive USD payments legally?",
            "Should I sign NDA with foreign clients?",
            "FEMA compliance for foreign payments?"
        ];

        this.currentSuggestions = suggestions.sort(() => 0.5 - Math.random()).slice(0, 4);
        this.updateSuggestionsDisplay();
    }

    updateSuggestionsDisplay() {
        this.suggestions.innerHTML = '';
        this.currentSuggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('span');
            suggestionElement.className = 'suggestion';
            suggestionElement.textContent = suggestion;
            suggestionElement.addEventListener('click', () => {
                this.messageInput.value = suggestion;
                this.sendMessage();
            });
            this.suggestions.appendChild(suggestionElement);
        });
    }

    showSuggestions() {
        if (this.messageInput.value.trim() === '') {
            this.suggestions.classList.add('show');
        }
    }

    hideSuggestions() {
        this.suggestions.classList.remove('show');
    }

    handleInput() {
        const value = this.messageInput.value.trim();
        if (value === '') {
            this.showSuggestions();
        } else {
            this.hideSuggestions();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GlobifyChatbot();
        initializeEnterpriseModal();
    });
} else {
    new GlobifyChatbot();
    initializeEnterpriseModal();
}

// === ENTERPRISE MODAL FUNCTIONALITY ===
function initializeEnterpriseModal() {
    const modal = document.getElementById('enterpriseModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const enterpriseBtn = document.getElementById('enterpriseBtn');
    const contactSalesBtn = document.getElementById('contactSales');
    
    if (!modal || !enterpriseBtn) return;
    
    // Open modal
    enterpriseBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal functions
    const closeModal = () => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.8) translateY(-50px)';
        }
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    };
    
    // Close modal events
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Prevent modal content click from closing modal
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Contact sales functionality
    if (contactSalesBtn) {
        contactSalesBtn.addEventListener('click', () => {
            // Create email mailto link with pre-filled content
            const subject = encodeURIComponent('Enterprise Solution Inquiry - Globify');
            const body = encodeURIComponent(`Hello Globify Team,

I'm interested in learning more about your enterprise solutions for our organization.

Company Details:
- Company Name: [Your Company Name]
- Industry: [Your Industry]
- Employee Count: [Number of Employees]
- Current Location: [Your Location]
- Target Markets: [Markets you want to expand to]

I would like to discuss:
- Custom pricing options
- Implementation timeline
- Integration capabilities
- Support and training

Please contact me to schedule a consultation.

Best regards,
[Your Name]
[Your Title]
[Your Phone Number]`);
            
            const mailtoLink = `mailto:enterprise@globify.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            // Show notification
            showEnterpriseNotification('Opening your email client...', 'info');
            
            // Close modal after a short delay
            setTimeout(() => {
                closeModal();
            }, 1000);
        });
    }
}

// Show notification function
function showEnterpriseNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `enterprise-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if they don't exist
    if (!document.querySelector('#enterprise-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'enterprise-notification-styles';
        style.textContent = `
            .enterprise-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-charcoal);
                color: var(--white-text);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                border: 1px solid var(--gold-primary);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10002;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideInNotification 0.3s ease-out;
                max-width: 300px;
            }
            
            .enterprise-notification.info {
                border-color: var(--gold-primary);
            }
            
            .enterprise-notification.success {
                border-color: #4CAF50;
                color: #4CAF50;
            }
            
            .enterprise-notification.error {
                border-color: #F44336;
                color: #F44336;
            }
            
            @keyframes slideInNotification {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInNotification 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
