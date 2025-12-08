const { createApp } = Vue;

createApp({
    data() {
        return {
            step: 0,
            isLoading: false,
            showResults: false,
            userAnswers: {
                season: '',
                vibe: '',
                occasion: ''
            },
            // THE QUESTIONS
            questions: [
                {
                    text: "What season is it mostly?",
                    options: [
                        { text: "Summer / Hot", value: "summer", icon: "☀️" },
                        { text: "Winter / Cold", value: "winter", icon: "❄️" },
                        { text: "Spring / Fresh", value: "spring", icon: "🌱" },
                        { text: "Autumn / Mild", value: "autumn", icon: "🍂" }
                    ]
                },
                {
                    text: "What vibe are you going for?",
                    options: [
                        { text: "Fresh & Clean", value: "fresh", icon: "🧼" },
                        { text: "Sweet & Sexy", value: "sweet", icon: "🍭" },
                        { text: "Dark & Mysterious", value: "dark", icon: "🌚" },
                        { text: "Professional", value: "woody", icon: "💼" }
                    ]
                },
                {
                    text: "Where are you going?",
                    options: [
                        { text: "Date Night", value: "date", icon: "🍷" },
                        { text: "Office / Work", value: "office", icon: "💻" },
                        { text: "Gym / Sport", value: "sport", icon: "💪" },
                        { text: "Daily Wear", value: "daily", icon: "👕" }
                    ]
                }
            ],
            // THE DATABASE (Extracted from your PDF)
            database: [
                // --- FRESH / SUMMER / CITRUS ---
                {
                    name: "Acqua di Parma Arancia di Capri",
                    brand: "Acqua di Parma",
                    image: "", 
                    tags: ["summer", "fresh", "daily", "office", "spring"],
                    type: "Citrus Aromatic",
                    description: "Relaxing orange, mandarin, and lemon. Like an Italian vacation in a bottle."
                },
                {
                    name: "Acqua di Parma Fico di Amalfi",
                    brand: "Acqua di Parma",
                    image: "", 
                    tags: ["summer", "fresh", "daily", "spring"],
                    type: "Fruity Floral",
                    description: "Fig nectar, pink pepper, and jasmine. Sweet, creamy, and sunny."
                },
                {
                    name: "Creed Aventus",
                    brand: "Creed",
                    image: "", 
                    tags: ["spring", "summer", "office", "date", "daily"],
                    type: "Chypre Fruity",
                    description: "The King. Pineapple, birch tar, and musk. Confident and universally loved."
                },
                {
                    name: "Creed Virgin Island Water",
                    brand: "Creed",
                    image: "", 
                    tags: ["summer", "sweet", "daily"],
                    type: "Citrus Gourmand",
                    description: "Lime, coconut, and white rum. Literally smells like a tropical cocktail."
                },
                {
                    name: "Roja Elysium",
                    brand: "Roja Parfums",
                    image: "", 
                    tags: ["summer", "spring", "office", "fresh", "daily"],
                    type: "Aromatic Fougere",
                    description: "An explosion of high-quality citrus and vetiver. Extremely sophisticated."
                },
                {
                    name: "Xerjoff Torino21",
                    brand: "Xerjoff",
                    image: "", 
                    tags: ["summer", "sport", "fresh", "gym"],
                    type: "Aromatic Green",
                    description: "Mint, basil, and lemon. Ice-cold freshness perfect for high heat."
                },
                {
                    name: "Louis Vuitton Afternoon Swim",
                    brand: "Louis Vuitton",
                    image: "", 
                    tags: ["summer", "fresh", "daily", "sport"],
                    type: "Citrus",
                    description: "Pure mandarin orange energy. Simple, linear, and incredibly refreshing."
                },
                 {
                    name: "Nishane Wūlóng Chá",
                    brand: "Nishane",
                    image: "", 
                    tags: ["summer", "spring", "fresh", "office", "daily"],
                    type: "Green Citrus",
                    description: "The most realistic tea scent. Oolong tea, bergamot, and fig."
                },

                // --- MARINE / AQUATIC ---
                {
                    name: "Orto Parisi Megamare",
                    brand: "Orto Parisi",
                    image: "", 
                    tags: ["summer", "winter", "dark", "daily"],
                    type: "Marine Musk",
                    description: "A dark, stormy ocean. Eternal longevity. Do not overspray."
                },
                {
                    name: "Acqua di Giò Profondo",
                    brand: "Giorgio Armani",
                    image: "", 
                    tags: ["summer", "fresh", "office", "daily", "sport"],
                    type: "Marine Aromatic",
                    description: "Modern marine notes with green mandarin. Professional and clean."
                },
                {
                    name: "Tom Ford Oud Wood",
                    brand: "Tom Ford",
                    image: "", 
                    tags: ["autumn", "winter", "office", "date", "woody"],
                    type: "Woody Spicy",
                    description: "Rosewood, cardamom, and oud. Classy, restrained, and mysterious."
                },

                // --- WINTER / GOURMAND / SWEET ---
                {
                    name: "Kilian Angels' Share",
                    brand: "Kilian",
                    image: "", 
                    tags: ["winter", "autumn", "sweet", "date"],
                    type: "Amber Vanilla",
                    description: "Cognac, cinnamon, and praline. Warm apple pie booziness."
                },
                {
                    name: "Parfums de Marly Layton",
                    brand: "Parfums de Marly",
                    image: "", 
                    tags: ["autumn", "winter", "sweet", "date", "daily"],
                    type: "Floral Spicy",
                    description: "Apple, vanilla, and cardamom. Mass appealing and seductive."
                },
                 {
                    name: "Parfums de Marly Herod",
                    brand: "Parfums de Marly",
                    image: "", 
                    tags: ["winter", "sweet", "dark", "date"],
                    type: "Tobacco Vanille",
                    description: "Warm tobacco leaf and vanilla pod. Cozy and comforting."
                },
                {
                    name: "Xerjoff Naxos",
                    brand: "Xerjoff",
                    image: "", 
                    tags: ["winter", "autumn", "sweet", "daily", "date"],
                    type: "Aromatic Spicy",
                    description: "Honey, tobacco, and lavender. Sicilian luxury in a bottle."
                },
                {
                    name: "Maison Francis Kurkdjian Grand Soir",
                    brand: "MFK",
                    image: "", 
                    tags: ["winter", "date", "sweet", "dark"],
                    type: "Amber",
                    description: "Pure amber and vanilla. Resinous, glowing, and golden."
                },
                {
                    name: "Tom Ford Tobacco Vanille",
                    brand: "Tom Ford",
                    image: "", 
                    tags: ["winter", "sweet", "dark"],
                    type: "Spicy Oriental",
                    description: "Opulent tobacco leaf and aromatic spices. Powerful and distinct."
                },
                {
                    name: "Jean Paul Gaultier Le Male",
                    brand: "JPG",
                    image: "", 
                    tags: ["winter", "sweet", "date", "club"],
                    type: "Oriental Fougere",
                    description: "Mint, lavender and vanilla. The classic clubbing king."
                },

                // --- DARK / WOODY / SPICY ---
                {
                    name: "Dior Sauvage Elixir",
                    brand: "Dior",
                    image: "", 
                    tags: ["winter", "autumn", "dark", "woody", "date"],
                    type: "Spicy Woody",
                    description: "Concentrated lavender, licorice, and sandalwood. A modern masterpiece."
                },
                {
                    name: "Amouage Interlude Man",
                    brand: "Amouage",
                    image: "", 
                    tags: ["winter", "dark", "woody"],
                    type: "Smoky Amber",
                    description: "The 'Blue Beast'. Oregano, incense, and leather. Powerful and challenging."
                },
                {
                    name: "Terre d'Hermès",
                    brand: "Hermès",
                    image: "", 
                    tags: ["autumn", "spring", "woody", "office", "daily"],
                    type: "Earthy Citrus",
                    description: "Orange, gunflint, and vetiver. Mature, earthy, and serious."
                },
                 {
                    name: "Oud for Greatness",
                    brand: "Initio",
                    image: "", 
                    tags: ["winter", "autumn", "dark", "date", "woody"],
                    type: "Oud Spicy",
                    description: "Natural oud wood, nutmeg, and saffron. Majestic and spiritual."
                },
                {
                    name: "Louis Vuitton Ombre Nomade",
                    brand: "Louis Vuitton",
                    image: "", 
                    tags: ["winter", "dark", "woody", "date"],
                    type: "Oud Rose",
                    description: "Oud, raspberry, and benzoin. Dark, smoky, and luxurious."
                },
                
                // --- DATE NIGHT / SEXY ---
                {
                    name: "Yves Saint Laurent La Nuit de L'Homme",
                    brand: "YSL",
                    image: "", 
                    tags: ["winter", "autumn", "date", "sweet"],
                    type: "Spicy Woody",
                    description: "Cardamom and cedar. The ultimate romantic date night scent."
                },
                {
                    name: "Dolce & Gabbana The One EDP",
                    brand: "D&G",
                    image: "", 
                    tags: ["autumn", "winter", "date", "daily"],
                    type: "Amber Spicy",
                    description: "Amber, ginger, and tobacco. Cozy, masculine, and intimate."
                },
                {
                    name: "Viktor&Rolf Spicebomb Extreme",
                    brand: "Viktor&Rolf",
                    image: "", 
                    tags: ["winter", "sweet", "date", "club"],
                    type: "Spicy Oriental",
                    description: "Tobacco, cumin, and black pepper. Explosive and warm."
                },
                {
                    name: "Azzaro Wanted by Night",
                    brand: "Azzaro",
                    image: "", 
                    tags: ["winter", "sweet", "club", "date"],
                    type: "Woody Spicy",
                    description: "Cinnamon, cedar, and tobacco. Sweet and bad-boy vibes."
                }
            ],
            topMatches: []
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.step - 1];
        }
    },
    methods: {
        nextStep() {
            this.step++;
        },
        selectOption(value) {
            // Save answer based on current step
            if (this.step === 1) this.userAnswers.season = value;
            if (this.step === 2) this.userAnswers.vibe = value;
            if (this.step === 3) this.userAnswers.occasion = value;

            if (this.step < this.questions.length) {
                this.step++;
            } else {
                this.calculateResults();
            }
        },
        calculateResults() {
            this.step++; // Move to loading state
            this.isLoading = true;

            // Simulate calculation delay for cool effect
            setTimeout(() => {
                this.runAlgorithm();
                this.isLoading = false;
                this.showResults = true;
            }, 1500);
        },
        runAlgorithm() {
            const scoredPerfumes = this.database.map(perfume => {
                let score = 0;
                let maxScore = 3; 

                // Tag Matching Logic
                if (perfume.tags.includes(this.userAnswers.season)) score++;
                if (perfume.tags.includes(this.userAnswers.vibe)) score++;
                if (perfume.tags.includes(this.userAnswers.occasion)) score++;
                
                // Vibe Matching Fallbacks (e.g., 'Fresh' vibe also matches 'sport' tags)
                if (this.userAnswers.vibe === 'fresh' && perfume.tags.includes('sport')) score += 0.5;
                if (this.userAnswers.vibe === 'dark' && perfume.tags.includes('woody')) score += 0.5;

                // Calculate %
                let percentage = Math.round((score / maxScore) * 100);
                
                // Versatility Bonus for Daily drivers
                if (percentage < 100 && perfume.tags.includes('daily') && this.userAnswers.occasion === 'daily') {
                    percentage += 10; 
                }
                
                if (percentage > 100) percentage = 100;

                return { ...perfume, score: percentage };
            });

            // Sort by score (Highest first) and take top 5
            this.topMatches = scoredPerfumes
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
        },
        resetQuiz() {
            this.step = 0;
            this.showResults = false;
            this.userAnswers = {};
        }
    }
}).mount('#app');
