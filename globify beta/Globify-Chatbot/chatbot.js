// === GLOBIFY AI CHATBOT FUNCTIONALITY ===

class GlobifyChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearButton = document.getElementById('clearChat');
        this.minimizeButton = document.getElementById('minimizeChat');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.suggestions = document.getElementById('suggestions');
        
        this.isTyping = false;
        this.messageHistory = [];
        this.currentSuggestions = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.generateSuggestions();
        this.animateOnLoad();
    }

    bindEvents() {
        // Send message events
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input events
        this.messageInput.addEventListener('input', () => this.handleInput());
        this.messageInput.addEventListener('focus', () => this.showSuggestions());
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

        // Chat controls
        this.clearButton.addEventListener('click', () => this.clearChat());
        this.minimizeButton.addEventListener('click', () => this.toggleMinimize());

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });
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
        
        // AI Response Database
        const responses = {
            // Greetings
            greeting: [
                "Hello! I'm excited to help you with your global business needs. What can I assist you with today?",
                "Hi there! Welcome to Globify. I'm here to help you connect with global opportunities. How can I help?",
                "Greetings! I'm your AI assistant for all things related to global business partnerships. What's on your mind?"
            ],
            
            // Partnership queries
            partners: [
                "Finding the right startup partners is crucial for success! Our AI matching system analyzes over 50 factors including industry compatibility, growth stage, geographic presence, and strategic goals. We currently have over 10,000 verified startups and 2,000+ enterprise clients across 50+ countries. Would you like me to help you create a partnership profile?",
                "Great question about partnerships! Our platform uses advanced AI algorithms to match startups with enterprises based on complementary needs, market presence, and strategic objectives. We've facilitated over 500 successful partnerships with an average deal value of $2.3M. What type of partnership are you looking for?",
                "Partner matching is our specialty! We consider factors like industry vertical, company size, geographic overlap, technology stack, and growth trajectory. Our success rate is 73% for initial meetings and 31% for closed deals. Tell me about your company and ideal partner profile."
            ],
            
            // Pricing information
            pricing: [
                "We offer three tiers: Starter ($299/month) for early-stage companies with basic matching and 10 monthly connections; Professional ($799/month) with advanced AI insights, unlimited connections, and dedicated support; Enterprise (custom pricing) with white-label solutions, API access, and custom integrations. All plans include our global network access. Which tier interests you most?",
                "Our pricing is designed to scale with your needs! Starter plan includes essential features for $299/month, Pro plan at $799/month adds advanced analytics and priority support, and Enterprise solutions are customized based on your requirements. We also offer a 14-day free trial. Would you like to start with a trial?",
                "Flexible pricing for every stage! Our Starter plan ($299/month) is perfect for small startups, Professional ($799/month) suits growing companies, and Enterprise (custom) serves large organizations. Each plan includes different levels of AI matching, support, and global reach. What's your company size and primary needs?"
            ],
            
            // AI and technology
            ai_matching: [
                "Our AI uses machine learning models trained on successful partnership data from 500+ closed deals. We analyze company profiles, market data, financial metrics, and strategic goals to create compatibility scores. The system considers 50+ data points including industry trends, geographic advantages, technology synergies, and cultural fit. Accuracy improves continuously through feedback loops.",
                "The AI matching works through deep analysis of multiple data layers: company fundamentals, market positioning, growth trajectories, and strategic needs. We use natural language processing to understand business descriptions and computer vision for logo/brand analysis. Our algorithm has a 73% success rate for meaningful connections.",
                "Advanced AI algorithms power our matching! We combine structured data (financials, metrics, location) with unstructured data (descriptions, news, social media) to create comprehensive compatibility profiles. Machine learning models predict partnership success probability, and the system learns from every interaction to improve recommendations."
            ],
            
            // Global reach
            global_reach: [
                "Globify operates across 50+ countries with strong presence in North America, Europe, Asia-Pacific, and emerging markets in Latin America and Africa. We have local teams in 12 major business hubs including Silicon Valley, London, Singapore, Dubai, São Paulo, and Bangalore. Our platform supports 15 languages and handles multi-currency transactions with regional compliance expertise.",
                "Our global network spans 6 continents with active communities in 50+ countries. Key markets include USA, UK, Germany, India, Singapore, Australia, Canada, Brazil, and UAE. We've facilitated cross-border partnerships worth over $1.2B total value. Regional expertise helps navigate local business cultures, regulations, and market dynamics.",
                "True global reach with localized expertise! We're active in major startup ecosystems: Silicon Valley, New York, London, Berlin, Tel Aviv, Singapore, Sydney, Toronto, São Paulo, Dubai, Bangalore, and Tokyo. Our platform handles timezone coordination, cultural bridge-building, and regulatory compliance for international partnerships."
            ],
            
            // Company information
            about: [
                "Globify was founded in 2021 with a mission to democratize global business partnerships. We're headquartered in San Francisco with offices in London, Singapore, and São Paulo. Our team includes former executives from Google, Microsoft, Goldman Sachs, and successful startup founders. We're backed by tier-1 VCs including Andreessen Horowitz and Sequoia Capital.",
                "We're a Y Combinator alum (S21) that's revolutionizing how businesses find global partners. Founded by serial entrepreneurs with exits to Fortune 500 companies, we've raised $15M Series A to expand our AI capabilities and global reach. Our advisory board includes former CEOs of unicorn startups and Fortune 500 companies.",
                "Globify emerged from our founders' frustration with traditional business development. After spending months manually searching for partners across different markets, we built an AI solution that's now used by 12,000+ companies. We're venture-backed, globally distributed, and committed to making international business partnerships accessible to everyone."
            ],
            
            // Support and contact
            support: [
                "I'm here 24/7 to help! For immediate assistance, continue chatting with me. For complex technical issues, our human support team is available via email (support@globify.com) or schedule a call through our calendar link. Enterprise clients get dedicated account managers with direct phone lines and priority response within 2 hours.",
                "Multiple support channels available! Chat with me anytime for instant help, email our team at hello@globify.com for detailed inquiries, or book a demo call with our partnership specialists. We also have a comprehensive help center with video tutorials, best practices, and success stories. What specific support do you need?",
                "Our support is as global as our platform! 24/7 AI assistance (that's me!), business hours human support in major timezones, comprehensive knowledge base, weekly webinars, and dedicated success managers for Pro+ clients. We also have active community forums where 12,000+ users share experiences and insights."
            ],
            
            // Default responses
            default: [
                "That's an interesting question! While I focus on Globify's partnership platform, I'd be happy to help you understand how our AI-powered matching can address your specific business needs. Could you tell me more about what you're looking for?",
                "I'd love to help you with that! My expertise is in global business partnerships and Globify's platform capabilities. Is there a specific aspect of international business development or our services you'd like to explore?",
                "Thanks for asking! I specialize in helping businesses understand Globify's partnership ecosystem. Whether you're looking for startup partners, enterprise clients, or global expansion opportunities, I'm here to guide you. What's your main business objective?"
            ]
        };

        // Determine response category
        let category = 'default';
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            category = 'greeting';
        } else if (message.includes('partner') || message.includes('startup') || message.includes('enterprise') || message.includes('match')) {
            category = 'partners';
        } else if (message.includes('price') || message.includes('cost') || message.includes('plan') || message.includes('pricing')) {
            category = 'pricing';
        } else if (message.includes('ai') || message.includes('algorithm') || message.includes('matching') || message.includes('how does')) {
            category = 'ai_matching';
        } else if (message.includes('global') || message.includes('countries') || message.includes('international') || message.includes('worldwide')) {
            category = 'global_reach';
        } else if (message.includes('about') || message.includes('company') || message.includes('who are') || message.includes('founded')) {
            category = 'about';
        } else if (message.includes('support') || message.includes('help') || message.includes('contact') || message.includes('assistance')) {
            category = 'support';
        }

        // Return random response from category
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    generateSuggestions() {
        const suggestions = [
            "How do I get started?",
            "Tell me about success stories",
            "What industries do you cover?",
            "How long does matching take?",
            "Can I see a demo?",
            "What's your success rate?",
            "Do you offer API access?",
            "How do you ensure quality matches?"
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
            this.suggestions.style.display = 'flex';
        }
    }

    hideSuggestions() {
        this.suggestions.style.display = 'none';
    }

    handleInput() {
        const value = this.messageInput.value.trim();
        if (value === '') {
            this.showSuggestions();
        } else {
            this.hideSuggestions();
        }
    }

    clearChat() {
        // Keep the initial welcome message
        const welcomeMessage = this.chatMessages.querySelector('.ai-message');
        this.chatMessages.innerHTML = '';
        if (welcomeMessage) {
            this.chatMessages.appendChild(welcomeMessage.cloneNode(true));
        }
        this.messageHistory = [];
        this.generateSuggestions();
    }

    toggleMinimize() {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.classList.toggle('minimized');
        
        const icon = this.minimizeButton.querySelector('i');
        if (chatContainer.classList.contains('minimized')) {
            icon.className = 'fas fa-plus';
            chatContainer.style.height = '80px';
        } else {
            icon.className = 'fas fa-minus';
            chatContainer.style.height = 'auto';
        }
    }

    handleNavigation(link) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Smooth scroll to section
        const target = link.getAttribute('href');
        if (target.startsWith('#')) {
            const section = document.querySelector(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
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

    animateOnLoad() {
        // Animate elements on page load
        const elements = document.querySelectorAll('.feature-card, .stat, .quick-btn');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in');
            }, index * 100);
        });

        // Animate chat container
        setTimeout(() => {
            document.querySelector('.chat-container').classList.add('slide-up');
        }, 500);
    }
}

// Enhanced Scroll Effects
class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.handleHeaderScroll();
        this.setupIntersectionObserver();
    }

    handleHeaderScroll() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(13, 13, 13, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(13, 13, 13, 0.9)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements
        document.querySelectorAll('.feature-card, .stat').forEach(el => {
            observer.observe(el);
        });
    }
}

// Statistics Counter Animation
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = element.textContent;
        const isNumber = !isNaN(target);
        
        if (isNumber) {
            const targetNum = parseInt(target);
            let current = 0;
            const increment = targetNum / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetNum) {
                    element.textContent = targetNum;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 30);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GlobifyChatbot();
    new ScrollEffects();
    new StatsCounter();
    
    // Add some Easter eggs
    console.log('🌐 Welcome to Globify AI Chatbot!');
    console.log('💡 Try typing "easter egg" in the chat for a surprise!');
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus chat input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('messageInput').focus();
    }
    
    // Escape to clear chat input
    if (e.key === 'Escape') {
        document.getElementById('messageInput').blur();
    }
});

// Add some fun interactions
document.addEventListener('click', (e) => {
    // Create ripple effect on buttons
    if (e.target.matches('button') || e.target.closest('button')) {
        const button = e.target.matches('button') ? e.target : e.target.closest('button');
        createRipple(e, button);
    }
});

function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.3);
        transform: scale(0);
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
