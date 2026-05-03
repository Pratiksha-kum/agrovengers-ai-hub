// Syngenta Cropwise AI AgentHub - Complete Platform JavaScript
// Advanced farm intelligence platform with 10 AI agents

class SyngentaAIAgentHub {
    constructor() {
        this.currentSection = 'hero';
        this.currentLanguage = 'en';
        this.voiceActive = false;
        this.negotiationActive = false;
        this.charts = {};
        this.animations = {};
        this.aiAgents = new Map();
        this.marketData = this.initializeMarketData();
        this.farmerProfiles = this.initializeFarmerProfiles();
        this.sustainabilityData = this.initializeSustainabilityData();
        
        this.init();
    }

    init() {
        console.log('🌱 Initializing Syngenta Cropwise AI AgentHub...');
        this.setupEventListeners();
        this.initializeAIAgents();
        this.setupNavigation();
        this.setupHeroAnimations();
        this.setupVoiceInterface();
        this.setupNegotiationPlatform();
        this.setupSustainabilityTracking();
        this.setupTrainingModules();
        this.setupModals();
        this.startRealTimeUpdates();
        this.initializeCharts();
        
        // Show hero section by default
        this.showSection('hero');
        this.showWelcomeSequence();
        
        console.log('✅ Syngenta AI AgentHub fully initialized!');
    }

    // Data Initialization
    initializeMarketData() {
        return {
            cotton: { price: 5800, trend: 'up', change: 400, premium: 400, region: 'Maharashtra' },
            soybean: { price: 4600, trend: 'stable', change: 0, premium: 300, region: 'Gujarat' },
            corn: { price: 2100, trend: 'up', change: 150, premium: 200, region: 'Karnataka' },
            sugarcane: { price: 3200, trend: 'stable', change: 0, premium: 150, region: 'Maharashtra' }
        };
    }

    initializeFarmerProfiles() {
        return [
            {
                name: 'राजेश पाटील (Rajesh Patil)',
                location: 'Pune, Maharashtra',
                crop: 'Cotton',
                improvement: '28% yield increase',
                products: 'ADEPIDYN + Premium Seeds',
                story: 'Syngenta AI helped me choose the right protection and seeds. My cotton quality improved significantly.'
            },
            {
                name: 'सुनीता देशपांडे (Sunita Deshpande)',
                location: 'Nashik, Maharashtra', 
                crop: 'Soybean',
                improvement: '₹45,000 additional income',
                products: 'Miravis Neo + Premium Varieties',
                story: 'Disease prevention with Miravis Neo and quality seeds gave me premium market prices.'
            }
        ];
    }

    initializeSustainabilityData() {
        return {
            carbonReduction: 22,
            waterEfficiency: 28,
            soilHealth: 19,
            biodiversity: 8.2,
            creditsEarned: 2847,
            monthlyGrowth: 234,
            marketValue: 427050
        };
    }

    initializeAIAgents() {
        const agents = [
            { id: 'crop-guardian', name: 'Crop Guardian', success: 96, specialty: 'Crop Protection', status: 'active' },
            { id: 'seed-sage', name: 'Seed Sage', success: 92, specialty: 'Seeds Division', status: 'active' },
            { id: 'kisan-mitra', name: 'किसान मित्र', success: 89, specialty: 'Negotiation', status: 'active' },
            { id: 'market-oracle', name: 'Market Oracle', success: 95, specialty: 'Price Intelligence', status: 'active' },
            { id: 'crop-whisperer', name: 'Crop Whisperer', success: 91, specialty: 'Voice Assistant', status: 'active' },
            { id: 'rotation-master', name: 'Rotation Master', success: 88, specialty: 'Crop Optimizer', status: 'active' },
            { id: 'sustainability-tracker', name: 'Sustainability Tracker', success: 93, specialty: 'ESG Intelligence', status: 'active' },
            { id: 'disease-detective', name: 'Disease Detective', success: 94, specialty: 'Diagnostic AI', status: 'active' },
            { id: 'weather-warrior', name: 'Weather Warrior', success: 97, specialty: 'Climate AI', status: 'active' },
            { id: 'contract-creator', name: 'Contract Creator', success: 90, specialty: 'Legal AI', status: 'active' }
        ];

        agents.forEach(agent => {
            this.aiAgents.set(agent.id, {
                ...agent,
                lastActivity: new Date(),
                interactions: Math.floor(Math.random() * 1000) + 500,
                recommendations: Math.floor(Math.random() * 50) + 20
            });
        });
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation events
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Language selector
        const globalLanguage = document.getElementById('globalLanguage');
        if (globalLanguage) {
            globalLanguage.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Resize handler for responsive charts
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Visibility change for performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    handleGlobalClick(event) {
        const target = event.target.closest('[data-action], [data-section], .nav-btn, .cta-btn, .demo-btn, .try-command, .btn');
        if (!target) return;

        event.preventDefault();
        
        // Navigation buttons
        if (target.classList.contains('nav-btn') || target.hasAttribute('data-section')) {
            const section = target.getAttribute('data-section');
            if (section) {
                this.showSection(section);
                this.updateActiveNav(section);
            }
        }
        
        // Action buttons
        const action = target.getAttribute('data-action');
        if (action) {
            this.handleAction(action, target);
        }
        
        // CTA and Demo buttons
        if (target.classList.contains('cta-btn')) {
            this.startAIJourney();
        } else if (target.classList.contains('demo-btn')) {
            this.showSection('voice');
            this.updateActiveNav('voice');
        }
        
        // Voice command buttons
        if (target.classList.contains('try-command')) {
            const command = target.closest('.sample-card').getAttribute('data-command');
            this.executeVoiceCommand(command);
        }
        
        // Generic button handlers
        this.handleButtonClick(target);
    }

    handleAction(action, target) {
        switch (action) {
            case 'start-journey':
                this.startAIJourney();
                break;
            case 'watch-demo':
                this.showSection('voice');
                this.updateActiveNav('voice');
                break;
            default:
                console.log('Action not handled:', action);
        }
    }

    handleButtonClick(button) {
        const buttonText = button.textContent.trim();
        
        // AI Agent interactions
        if (button.closest('.agent-card')) {
            const agentCard = button.closest('.agent-card');
            this.activateAgent(agentCard);
        }
        
        // Product recommendations
        if (buttonText.includes('Get AI Recommendation')) {
            this.showProductRecommendation(button);
        }
        
        // Voice interface
        if (button.id === 'mainVoiceBtn' || button.classList.contains('voice-btn-large')) {
            this.toggleVoiceInterface();
        }
        
        // Negotiation platform
        if (button.id === 'startAdvancedNegotiation') {
            this.startAdvancedNegotiation();
        } else if (button.id === 'acceptDeal') {
            this.acceptNegotiationDeal();
        } else if (button.id === 'counterOffer') {
            this.makeCounterOffer();
        } else if (button.id === 'getAdvice') {
            this.getAIAdvice();
        }
        
        // Training modules
        if (button.closest('.module-card')) {
            const moduleCard = button.closest('.module-card');
            this.startTrainingModule(moduleCard);
        }
        
        // Modal controls
        if (button.classList.contains('modal-close')) {
            this.closeModal();
        } else if (button.id === 'startSetup') {
            this.startFarmSetup();
        }
        
        // Sustainability actions
        if (buttonText.includes('Sell Credits')) {
            this.sellCarbonCredits();
        }
        
        // Upload and diagnostic
        if (buttonText.includes('Upload Image')) {
            this.simulateDiseaseDetection();
        }
        
        // Seed and variety selection
        if (buttonText.includes('Select Variety') || buttonText.includes('Accept Rotation')) {
            this.selectSeedVariety(button);
        }
    }

    // Navigation System
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                    this.updateActiveNav(section);
                }
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Initialize section-specific functionality
            setTimeout(() => {
                this.initializeSection(sectionId);
            }, 100);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            return true;
        }
        return false;
    }

    updateActiveNav(activeSection) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        const activeBtn = document.querySelector(`[data-section="${activeSection}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    initializeSection(sectionId) {
        switch (sectionId) {
            case 'hero':
                this.animateHeroStats();
                break;
            case 'agents':
                this.animateAgentCards();
                break;
            case 'protection':
                this.initializeProtectionCenter();
                break;
            case 'seeds':
                this.initializeSeedsHub();
                break;
            case 'voice':
                this.initializeVoiceDemo();
                break;
            case 'negotiation':
                this.initializeNegotiationPlatform();
                break;
            case 'sustainability':
                this.initializeSustainabilityTracking();
                this.createSustainabilityCharts();
                break;
            case 'training':
                this.initializeTrainingCenter();
                break;
        }
    }

    // Hero Section Animations
    setupHeroAnimations() {
        // Animate hero elements on load
        setTimeout(() => {
            this.animateHeroStats();
        }, 500);
    }

    animateHeroStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            this.animateCounter(stat, 0, target, 2000);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(progress) {
        return 1 - Math.pow(1 - progress, 3);
    }

    showWelcomeSequence() {
        setTimeout(() => {
            this.showNotification('🌱 Welcome to Syngenta Cropwise AI AgentHub!', 'success');
        }, 1000);
        
        setTimeout(() => {
            this.showNotification('🤖 10 AI Agents ready to assist you', 'info');
        }, 3000);
    }

    startAIJourney() {
        this.showModal('successModal');
        this.trackEvent('ai-journey-started');
    }

    // AI Agent System
    animateAgentCards() {
        const agentCards = document.querySelectorAll('.agent-card');
        agentCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    activateAgent(agentCard) {
        const agentName = agentCard.querySelector('h3').textContent;
        
        // Visual feedback
        agentCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            agentCard.style.transform = '';
        }, 200);
        
        // Show agent activation
        this.showNotification(`🤖 ${agentName} activated and ready!`, 'success');
        
        // Simulate agent response
        setTimeout(() => {
            this.simulateAgentResponse(agentName);
        }, 1500);
    }

    simulateAgentResponse(agentName) {
        const responses = {
            'Crop Guardian': 'Analyzing your crop protection needs. Recommending ADEPIDYN for optimal results.',
            'Seed Sage': 'Based on your soil data, NK Corn Hybrids will provide 25% higher yield.',
            'किसान मित्र': 'आपकी फसल के लिए उचित मूल्य ₹5,650 प्रति क्विंटल है।',
            'Market Oracle': 'Real-time analysis shows 15% price increase opportunity in next 7 days.',
            'Crop Whisperer': 'Voice command ready. Say "मेरी फसल की जांच करें" to start diagnosis.',
            'Disease Detective': 'No diseases detected. Your crop health score is 9.2/10.',
            'Weather Warrior': 'Favorable weather next week. Optimal time for harvesting.',
            'Sustainability Tracker': 'You can earn 150 additional carbon credits this season.',
            'Rotation Master': 'Recommend switching to soybeans next season for 28% profit boost.',
            'Contract Creator': 'Smart contract template ready. Digital signature integration active.'
        };
        
        const response = responses[agentName] || 'Agent activated successfully!';
        this.showNotification(`💬 ${agentName}: ${response}`, 'info');
    }

    // Voice Interface System
    initializeVoiceDemo() {
        this.setupVoiceControls();
        this.updateVoiceLanguage();
    }

    setupVoiceControls() {
        const voiceBtn = document.getElementById('mainVoiceBtn');
        const languageOptions = document.querySelectorAll('.language-option');
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceInterface();
            });
        }
        
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                this.setVoiceLanguage(lang);
            });
        });
    }

    toggleVoiceInterface() {
        const voiceBtn = document.getElementById('mainVoiceBtn');
        this.voiceActive = !this.voiceActive;
        
        if (this.voiceActive) {
            voiceBtn.classList.add('active');
            this.startVoiceListening();
        } else {
            voiceBtn.classList.remove('active');
            this.stopVoiceListening();
        }
    }

    startVoiceListening() {
        this.updateConversationStatus('Listening...', 'listening');
        
        // Simulate voice recognition
        setTimeout(() => {
            this.simulateVoiceInput();
        }, 2000);
    }

    stopVoiceListening() {
        this.updateConversationStatus('Ready to listen', 'ready');
    }

    simulateVoiceInput() {
        const commands = {
            en: {
                input: "What price can I get for my cotton?",
                response: "Based on current market analysis, your premium cotton can fetch ₹5,650 per quintal with quality bonus."
            },
            hi: {
                input: "मेरे कपास की कीमत क्या मिल सकती है?",
                response: "वर्तमान बाजार विश्लेषण के आधार पर, आपके प्रीमियम कपास की कीमत गुणवत्ता बोनस के साथ ₹5,650 प्रति क्विंटल मिल सकती है।"
            },
            mr: {
                input: "माझ्या कापसाची किंमत काय मिळू शकते?",
                response: "सध्याच्या बाजारपेठेच्या विश्लेषणानुसार, तुमच्या प्रीमियम कापसाला गुणवत्ता बोनससह ₹5,650 प्रति क्विंटल मिळू शकते।"
            }
        };
        
        const command = commands[this.currentLanguage] || commands.en;
        
        this.addConversationMessage('user', command.input);
        
        setTimeout(() => {
            this.addConversationMessage('ai', command.response);
            this.voiceActive = false;
            const voiceBtn = document.getElementById('mainVoiceBtn');
            if (voiceBtn) voiceBtn.classList.remove('active');
            this.updateConversationStatus('Ready to listen', 'ready');
        }, 1500);
    }

    setVoiceLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update active language option
        document.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        
        // Update voice interface language
        this.updateVoiceLanguage();
    }

    updateVoiceLanguage() {
        const greetings = {
            en: "Hello! How can I help you with crop pricing today?",
            hi: "नमस्कार! आज मैं फसल की कीमत में आपकी कैसे मदद कर सकता हूं?",
            mr: "नमस्कार! आज मी पीक किंमतीमध्ये तुमची कशी मदत करू शकतो?"
        };
        
        this.addConversationMessage('system', greetings[this.currentLanguage] || greetings.en);
    }

    executeVoiceCommand(command) {
        const responses = {
            pricing: "AI analyzing your crop quality and current market conditions...",
            disease: "Image analysis in progress. Disease detection algorithm running...",
            seeds: "Evaluating your soil conditions and climate data for optimal seed recommendations..."
        };
        
        this.showNotification(`🎤 Voice command: ${command}`, 'info');
        
        setTimeout(() => {
            this.showNotification(`🤖 ${responses[command]}`, 'success');
        }, 1000);
    }

    addConversationMessage(type, message) {
        const history = document.getElementById('voiceHistory');
        if (!history) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `conversation-message ${type}`;
        
        const speakers = {
            system: '🤖 Crop Whisperer',
            user: '👨‍🌾 You',
            ai: '🤖 AI Response'
        };
        
        messageDiv.innerHTML = `
            <span class="speaker">${speakers[type] || 'System'}:</span>
            <span class="message">${message}</span>
        `;
        
        history.appendChild(messageDiv);
        history.scrollTop = history.scrollHeight;
    }

    updateConversationStatus(status, type) {
        const statusElement = document.querySelector('.conversation-status span');
        const indicator = document.querySelector('.status-indicator');
        
        if (statusElement) statusElement.textContent = status;
        if (indicator) {
            indicator.className = `status-indicator ${type}`;
        }
    }

    // Negotiation Platform
    setupNegotiationPlatform() {
        this.negotiationData = {
            crop: 'Cotton',
            quality: 'Premium',
            quantity: '500 quintals',
            basePrice: 5200,
            negotiatedPrice: 5650,
            sustainabilityBonus: 150,
            totalValue: 2900000
        };
    }

    initializeNegotiationPlatform() {
        this.updateMarketPrices();
        this.startPriceUpdates();
    }

    updateMarketPrices() {
        const priceItems = document.querySelectorAll('.price-item');
        priceItems.forEach(item => {
            const cropType = [...item.classList].find(cls => cls !== 'price-item');
            const data = this.marketData[cropType];
            
            if (data) {
                const priceElement = item.querySelector('.current-price');
                const trendElement = item.querySelector('.price-trend');
                
                if (priceElement) priceElement.textContent = `₹${data.price.toLocaleString()}`;
                if (trendElement) {
                    trendElement.textContent = data.change > 0 ? `+₹${data.change}` : `₹${data.change}`;
                    trendElement.className = `price-trend ${data.trend}`;
                }
            }
        });
    }

    startAdvancedNegotiation() {
        this.negotiationActive = true;
        this.showNotification('🤝 AI Negotiation started! Watch the agents work for you.', 'success');
        
        // Animate negotiation progress
        this.animateNegotiationProgress();
        
        // Simulate negotiation flow
        setTimeout(() => {
            this.simulateNegotiationSteps();
        }, 1000);
    }

    animateNegotiationProgress() {
        const progressBar = document.querySelector('.negotiation-progress .progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Negotiation ${progress}% Complete`;
            
            if (progress >= 100) {
                clearInterval(interval);
                this.showNotification('✅ Negotiation completed successfully!', 'success');
            }
        }, 200);
    }

    simulateNegotiationSteps() {
        const steps = [
            { time: 1000, message: 'किसान मित्र analyzing crop quality and market conditions...' },
            { time: 3000, message: 'Market Oracle providing real-time price intelligence...' },
            { time: 5000, message: 'Buyer agent evaluating offer and market demand...' },
            { time: 7000, message: 'Sustainability bonus calculated based on farming practices...' },
            { time: 9000, message: 'Final price negotiated with quality premiums!' }
        ];
        
        steps.forEach(step => {
            setTimeout(() => {
                this.showNotification(`🔄 ${step.message}`, 'info');
            }, step.time);
        });
    }

    acceptNegotiationDeal() {
        this.showNotification('✅ Deal accepted! Generating smart contract...', 'success');
        
        setTimeout(() => {
            this.showNotification('📋 Smart contract generated and ready for digital signature!', 'success');
        }, 2000);
    }

    makeCounterOffer() {
        const newPrice = this.negotiationData.negotiatedPrice + 100;
        this.negotiationData.negotiatedPrice = newPrice;
        
        this.showNotification(`💰 Counter offer made: ₹${newPrice.toLocaleString()} per quintal`, 'info');
        
        setTimeout(() => {
            this.showNotification('🤖 AI analyzing counter offer feasibility...', 'info');
            
            setTimeout(() => {
                this.showNotification('✅ Counter offer accepted by buyer!', 'success');
            }, 2000);
        }, 1000);
    }

    getAIAdvice() {
        const advice = [
            'Consider highlighting your sustainable farming practices for premium pricing',
            'Market trends show 12% price increase expected in next 2 weeks',
            'Your crop quality rating of 9.2/10 supports higher price negotiation',
            'Recommend bundling with carbon credits for additional ₹200/quintal'
        ];
        
        const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
        this.showNotification(`💡 AI Advice: ${randomAdvice}`, 'info');
    }

    startPriceUpdates() {
        setInterval(() => {
            if (this.currentSection === 'negotiation') {
                this.updateMarketPricesRealTime();
            }
        }, 10000);
    }

    updateMarketPricesRealTime() {
        Object.keys(this.marketData).forEach(crop => {
            const variance = (Math.random() - 0.5) * 100;
            this.marketData[crop].price = Math.max(
                this.marketData[crop].price + variance,
                this.marketData[crop].price * 0.95
            );
            this.marketData[crop].change = Math.round(variance);
            this.marketData[crop].trend = variance > 0 ? 'up' : variance < 0 ? 'down' : 'stable';
        });
        
        this.updateMarketPrices();
    }

    // Crop Protection Center
    initializeProtectionCenter() {
        this.setupProductRecommendations();
        this.setupDiseaseDetection();
    }

    setupProductRecommendations() {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            product.addEventListener('mouseenter', () => {
                this.showProductHighlight(product);
            });
        });
    }

    showProductRecommendation(button) {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        const recommendations = {
            'ADEPIDYN®': 'Perfect for your cotton crop. Apply 200ml per acre for optimal pest control.',
            'Miravis® Neo': 'Recommended for disease prevention. Apply during vegetative growth stage.',
            'Acuron®': 'Ideal for weed control in corn. Expect 5-15 more bushels per acre.',
            'Cruiser®': 'Apply as seed treatment for early season protection and root development.'
        };
        
        const recommendation = recommendations[productName] || 'Product recommendation available.';
        this.showNotification(`🛡️ ${productName}: ${recommendation}`, 'success');
    }

    simulateDiseaseDetection() {
        const uploadZone = document.getElementById('imageUpload');
        const resultDiv = document.getElementById('diagnosticResult');
        
        if (uploadZone) uploadZone.classList.add('hidden');
        if (resultDiv) {
            resultDiv.classList.remove('hidden');
            this.animateDetectionResult();
        }
        
        this.showNotification('📸 Image uploaded successfully! AI analysis in progress...', 'info');
        
        setTimeout(() => {
            this.showNotification('✅ Analysis complete: Healthy crop detected with 96% confidence!', 'success');
        }, 3000);
    }

    animateDetectionResult() {
        const result = document.getElementById('diagnosticResult');
        if (result) {
            result.style.opacity = '0';
            result.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                result.style.transition = 'all 0.5s ease-out';
                result.style.opacity = '1';
                result.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // Seeds & Varieties Hub
    initializeSeedsHub() {
        this.setupVarietySelections();
        this.setupRotationPlanner();
    }

    setupVarietySelections() {
        const varietyCards = document.querySelectorAll('.variety-card');
        varietyCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectVariety(card);
            });
        });
    }

    selectVariety(card) {
        // Remove previous selections
        document.querySelectorAll('.variety-card').forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        
        const varietyName = card.querySelector('h3').textContent;
        this.showNotification(`🌱 ${varietyName} selected for your farm!`, 'success');
        
        // Show additional recommendations
        setTimeout(() => {
            this.showVarietyRecommendations(varietyName);
        }, 1000);
    }

    showVarietyRecommendations(varietyName) {
        const recommendations = {
            'NK Corn Hybrids': 'Recommended planting density: 75,000 plants/ha. Best planting window: March-April.',
            'Syngenta Soybeans': 'Optimal row spacing: 45cm. Apply Rhizobium inoculation for best results.',
            'Vegetable Seeds': 'Greenhouse cultivation recommended. Maintain 65-70% humidity for optimal growth.'
        };
        
        const recommendation = recommendations[varietyName];
        if (recommendation) {
            this.showNotification(`📋 Growing Tips: ${recommendation}`, 'info');
        }
    }

    selectSeedVariety(button) {
        const card = button.closest('.variety-card') || button.closest('.suggestion-card');
        if (card) {
            const varietyName = card.querySelector('h3, .crop-name').textContent;
            this.showNotification(`✅ ${varietyName} added to your planting plan!`, 'success');
            
            // Visual feedback
            button.textContent = '✓ Selected';
            button.classList.remove('btn--primary', 'btn--outline');
            button.classList.add('btn--success');
        }
    }

    setupRotationPlanner() {
        const cropSelect = document.querySelector('.rotation-interface select');
        if (cropSelect) {
            cropSelect.addEventListener('change', (e) => {
                this.updateRotationSuggestion(e.target.value);
            });
        }
    }

    updateRotationSuggestion(currentCrop) {
        const suggestions = {
            Cotton: { crop: 'Soybean', icon: '🫘', benefits: ['Soil nitrogen fixation', '28% profit increase', 'Reduced input costs'] },
            Soybean: { crop: 'Corn', icon: '🌽', benefits: ['High yield potential', 'Market demand strong', 'Efficient land use'] },
            Corn: { crop: 'Cotton', icon: '🌿', benefits: ['Premium fiber quality', 'Export opportunities', 'Higher margins'] },
            Sugarcane: { crop: 'Vegetable rotation', icon: '🥬', benefits: ['Diversified income', 'Quick cash flow', 'Soil health improvement'] }
        };
        
        const suggestion = suggestions[currentCrop];
        if (suggestion) {
            this.displayRotationSuggestion(suggestion);
        }
    }

    displayRotationSuggestion(suggestion) {
        const cropIcon = document.querySelector('.crop-icon');
        const cropName = document.querySelector('.crop-name');
        const benefits = document.querySelectorAll('.benefit');
        
        if (cropIcon) cropIcon.textContent = suggestion.icon;
        if (cropName) cropName.textContent = suggestion.crop;
        
        benefits.forEach((benefit, index) => {
            if (suggestion.benefits[index]) {
                benefit.textContent = `✓ ${suggestion.benefits[index]}`;
            }
        });
    }

    // Sustainability Tracking
    initializeSustainabilityTracking() {
        this.updateSustainabilityMetrics();
        this.setupCarbonCreditsMarketplace();
    }

    updateSustainabilityMetrics() {
        const metrics = document.querySelectorAll('.carbon-metric .metric-value');
        const values = ['22%', '+28%', '+19%', '8.2/10'];
        
        metrics.forEach((metric, index) => {
            if (values[index]) {
                setTimeout(() => {
                    this.animateMetricValue(metric, values[index]);
                }, index * 200);
            }
        });
    }

    animateMetricValue(element, finalValue) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            element.textContent = finalValue;
        }, 100);
    }

    setupCarbonCreditsMarketplace() {
        this.updateCreditPortfolio();
    }

    updateCreditPortfolio() {
        const portfolioItems = document.querySelectorAll('.portfolio-value');
        const values = ['2,847 credits', '₹4,27,050', '+234 credits'];
        
        portfolioItems.forEach((item, index) => {
            if (values[index]) {
                item.textContent = values[index];
            }
        });
    }

    sellCarbonCredits() {
        const currentCredits = this.sustainabilityData.creditsEarned;
        const saleAmount = Math.floor(currentCredits * 0.3);
        const revenue = saleAmount * 150; // ₹150 per credit
        
        this.showNotification(`💰 Selling ${saleAmount} carbon credits for ₹${revenue.toLocaleString()}`, 'info');
        
        setTimeout(() => {
            this.sustainabilityData.creditsEarned -= saleAmount;
            this.sustainabilityData.marketValue += revenue;
            this.updateCreditPortfolio();
            this.showNotification(`✅ Carbon credits sold successfully! Revenue: ₹${revenue.toLocaleString()}`, 'success');
        }, 2000);
    }

    createSustainabilityCharts() {
        this.createCarbonImpactChart();
    }

    createCarbonImpactChart() {
        const ctx = document.getElementById('carbonImpactChart');
        if (!ctx || this.charts.carbonImpact) return;
        
        try {
            this.charts.carbonImpact = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Carbon Reduction', 'Water Efficiency', 'Soil Health', 'Biodiversity'],
                    datasets: [{
                        data: [22, 28, 19, 8.2],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating carbon impact chart:', error);
        }
    }

    // Training System
    initializeTrainingCenter() {
        this.setupTrainingModules();
        this.displaySuccessStories();
    }

    setupTrainingModules() {
        // Training modules are handled by global click handler
        this.updateTrainingProgress();
    }

    startTrainingModule(moduleCard) {
        const moduleName = moduleCard.querySelector('h3').textContent;
        const isCompleted = moduleCard.querySelector('.progress-text').textContent.includes('Completed');
        
        if (isCompleted) {
            this.showNotification(`📜 Viewing certificate for: ${moduleName}`, 'info');
        } else {
            this.showNotification(`🎓 Starting training module: ${moduleName}`, 'success');
            this.simulateTrainingProgress(moduleCard);
        }
    }

    simulateTrainingProgress(moduleCard) {
        const progressBar = moduleCard.querySelector('.progress-fill');
        const progressText = moduleCard.querySelector('.progress-text');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${progress}% Complete`;
            
            if (progress >= 100) {
                clearInterval(interval);
                progressText.textContent = 'Completed ✅';
                this.showNotification('🏆 Training module completed! Certificate earned.', 'success');
            }
        }, 100);
    }

    updateTrainingProgress() {
        // Training progress is already set in HTML
    }

    displaySuccessStories() {
        // Success stories carousel functionality
        this.startStoriesCarousel();
    }

    startStoriesCarousel() {
        const stories = document.querySelectorAll('.story-card');
        let currentStory = 0;
        
        setInterval(() => {
            if (stories.length > 1) {
                stories[currentStory].classList.remove('active');
                currentStory = (currentStory + 1) % stories.length;
                stories[currentStory].classList.add('active');
            }
        }, 5000);
    }

    // Modal System
    setupModals() {
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(close => {
            close.addEventListener('click', () => {
                this.closeModal();
            });
        });
        
        // Close modal on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }

    startFarmSetup() {
        this.closeModal();
        this.showSection('agents');
        this.updateActiveNav('agents');
        this.showNotification('🚀 Farm setup initiated! Explore your AI agents.', 'success');
    }

    // Chart Initialization
    initializeCharts() {
        setTimeout(() => {
            this.createDashboardCharts();
        }, 1000);
    }

    createDashboardCharts() {
        // Charts are created when their respective sections are initialized
    }

    // Real-time Updates
    startRealTimeUpdates() {
        // Market price updates
        setInterval(() => {
            if (this.currentSection === 'negotiation') {
                this.updateMarketPricesRealTime();
            }
        }, 15000);
        
        // Agent activity updates
        setInterval(() => {
            this.updateAgentActivity();
        }, 30000);
        
        // Sustainability metrics updates
        setInterval(() => {
            if (this.currentSection === 'sustainability') {
                this.updateSustainabilityData();
            }
        }, 45000);
    }

    updateAgentActivity() {
        this.aiAgents.forEach((agent, id) => {
            agent.lastActivity = new Date();
            agent.interactions += Math.floor(Math.random() * 5);
        });
    }

    updateSustainabilityData() {
        this.sustainabilityData.creditsEarned += Math.floor(Math.random() * 10);
        this.sustainabilityData.monthlyGrowth += Math.floor(Math.random() * 5);
        this.updateCreditPortfolio();
    }

    // Language System
    changeLanguage(language) {
        this.currentLanguage = language;
        this.updateUILanguage(language);
        this.showNotification(`🌐 Language changed to ${language.toUpperCase()}`, 'info');
    }

    updateUILanguage(language) {
        // Update voice interface language
        this.setVoiceLanguage(language);
        
        // Update other UI elements as needed
        const languageTexts = {
            en: { greeting: 'Welcome to Syngenta AI AgentHub' },
            hi: { greeting: 'सिंजेंटा AI एजेंटहब में आपका स्वागत है' },
            mr: { greeting: 'सिंजेंटा AI एजेंटहबमध्ये आपले स्वागत आहे' }
        };
        
        // Apply language-specific updates
    }

    // Utility Functions
    handleKeyboard(event) {
        // Keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    this.showSection('hero');
                    break;
                case '2':
                    event.preventDefault();
                    this.showSection('agents');
                    break;
                case 'v':
                    event.preventDefault();
                    this.showSection('voice');
                    break;
            }
        }
        
        // Escape key to close modals
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }

    handleResize() {
        // Redraw charts on resize
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }

    pauseAnimations() {
        // Pause resource-intensive animations when tab is not visible
        document.querySelectorAll('.voice-wave, .status-indicator').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        // Resume animations when tab becomes visible
        document.querySelectorAll('.voice-wave, .status-indicator').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const styles = {
            info: 'background: #1FB8CD; color: white;',
            success: 'background: #00A859; color: white;',
            warning: 'background: #FF6B35; color: white;',
            error: 'background: #DC2626; color: white;'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            ${styles[type] || styles.info}
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: var(--font-family-base);
            font-size: 14px;
            font-weight: 500;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    trackEvent(eventName, data = {}) {
        console.log(`📊 Event tracked: ${eventName}`, data);
        // Analytics integration would go here
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// CSS Animations for JavaScript
const additionalStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        animation: slideInRight 0.3s ease-out;
    }
    
    .variety-card.selected {
        border-color: var(--syngenta-primary);
        background: var(--syngenta-light);
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
    }
    
    .btn--success {
        background: var(--color-success);
        color: white;
        border-color: var(--color-success);
    }
    
    .btn--success:hover {
        background: var(--syngenta-dark);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the platform when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing Syngenta Cropwise AI AgentHub...');
    
    // Initialize the platform
    window.syngentaPlatform = new SyngentaAIAgentHub();
    
    // Live chat bubble interaction
    const liveChat = document.getElementById('liveChat');
    if (liveChat) {
        liveChat.addEventListener('click', () => {
            window.syngentaPlatform.showNotification('💬 Live support connected! How can we help you today?', 'success');
        });
    }
    
    console.log('✅ Syngenta Cropwise AI AgentHub fully operational!');
    console.log('🌱 Empowering farmers with AI-powered intelligence');
});

// Export for potential external use
if (typeof window !== 'undefined') {
    window.SyngentaAIAgentHub = SyngentaAIAgentHub;
}
