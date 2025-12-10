const { createApp } = Vue;

createApp({
    data() {
        return {
            step: 0,
            isLoading: false,
            showResults: false,
            showBrowse: false,
            showHelpModal: false,
            selectedPerfume: null,
            resultFilter: 'all',
            searchQuery: '',
            browseSeasonFilter: '',
            browseVibeFilter: '',
            browsePerfumes: [],
            favorites: [],
            toasts: [],
            toastId: 0,
            currentLoadingMessage: 0,
            loadingMessages: [
                'Analyzing your preferences...',
                'Matching fragrance notes...',
                'Calculating compatibility...',
                'Finding perfect matches...'
            ],
            userAnswers: {
                season: '',
                vibe: '',
                occasion: ''
            },
            questions: [
                {
                    text: "What's your season?",
                    subtitle: "Choose the weather you'll be wearing this fragrance in",
                    emoji: "🌤️",
                    options: [
                        { text: "Summer", value: "summer", icon: "☀️", desc: "Hot & Sunny" },
                        { text: "Winter", value: "winter", icon: "❄️", desc: "Cold & Cozy" },
                        { text: "Spring", value: "spring", icon: "🌸", desc: "Fresh & Mild" },
                        { text: "Autumn", value: "autumn", icon: "🍂", desc: "Cool & Crisp" }
                    ]
                },
                {
                    text: "What's your vibe?",
                    subtitle: "The energy and personality you want to project",
                    emoji: "✨",
                    options: [
                        { text: "Fresh & Clean", value: "fresh", icon: "🧼", desc: "Bright & Airy" },
                        { text: "Sweet & Alluring", value: "sweet", icon: "🍭", desc: "Warm & Inviting" },
                        { text: "Dark & Mysterious", value: "dark", icon: "🌚", desc: "Bold & Complex" },
                        { text: "Professional", value: "woody", icon: "💼", desc: "Refined & Mature" }
                    ]
                },
                {
                    text: "What's the occasion?",
                    subtitle: "Where will you be wearing this fragrance?",
                    emoji: "📍",
                    options: [
                        { text: "Date Night", value: "date", icon: "🍷", desc: "Romance" },
                        { text: "Office", value: "office", icon: "💻", desc: "Work" },
                        { text: "Gym / Sport", value: "sport", icon: "💪", desc: "Active" },
                        { text: "Everyday", value: "daily", icon: "👕", desc: "Casual" }
                    ]
                }
            ],
            // THE DATABASE (Complete Collection)
            database: [
                // --- ACQUA DI PARMA ---
                {
                    name: "Acqua di Parma Arancia di Capri",
                    brand: "Acqua di Parma",
                    image: "",
                    tags: ["summer", "fresh", "daily", "spring"],
                    type: "Citrus Aromatic",
                    description: "Relaxing orange, mandarin, and caramel. Italian sunshine."
                },
                {
                    name: "Acqua di Parma Bergamotto di Calabria",
                    brand: "Acqua di Parma",
                    image: "",
                    tags: ["summer", "fresh", "daily", "office"],
                    type: "Woody Aromatic",
                    description: "Authentic, sharp bergamot and ginger. Crisp and dry."
                },
                {
                    name: "Acqua di Parma Colonia Essenza",
                    brand: "Acqua di Parma",
                    image: "",
                    tags: ["summer", "spring", "office", "fresh"],
                    type: "Citrus",
                    description: "Sophisticated neroli and citrus. The tuxedo of fresh scents."
                },
                {
                    name: "Acqua di Parma Fico di Amalfi",
                    brand: "Acqua di Parma",
                    image: "",
                    tags: ["summer", "fresh", "daily", "spring"],
                    type: "Fruity Floral",
                    description: "Fig nectar, pink pepper, and jasmine. Creamy and sunny."
                },
                {
                    name: "Acqua di Parma Mandarino di Sicilia",
                    brand: "Acqua di Parma",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Citrus Aromatic",
                    description: "Green, raw mandarin peel. Very photorealistic and zesty."
                },

                // --- AMOUAGE ---
                {
                    name: "Amouage Beach Hut Man",
                    brand: "Amouage",
                    image: "",
                    tags: ["summer", "spring", "fresh", "daily"],
                    type: "Woody Aromatic",
                    description: "Mint, ivy, and vetiver. Green, dry, and extremely potent."
                },
                {
                    name: "Amouage Epic Man",
                    brand: "Amouage",
                    image: "",
                    tags: ["winter", "autumn", "dark", "woody"],
                    type: "Oriental Woody",
                    description: "Incense, oud, and spices. A journey along the Silk Road."
                },
                {
                    name: "Amouage Interlude Man",
                    brand: "Amouage",
                    image: "",
                    tags: ["winter", "dark", "woody"],
                    type: "Smoky Amber",
                    description: "The 'Blue Beast'. Oregano, incense, and leather. Nuclear power."
                },
                {
                    name: "Amouage Lyric Man",
                    brand: "Amouage",
                    image: "",
                    tags: ["winter", "date", "dark", "spring"],
                    type: "Oriental Floral",
                    description: "A dark, soapy rose with lime and pine. Poetic and unique."
                },
                {
                    name: "Amouage Reflection Man",
                    brand: "Amouage",
                    image: "",
                    tags: ["spring", "office", "date", "fresh"],
                    type: "Woody Floral",
                    description: "Jasmine, neroli, and sandalwood. Clean, powdery, and elegant."
                },

                // --- ARMANI ---
                {
                    name: "Acqua di Giò EDT",
                    brand: "Giorgio Armani",
                    image: "",
                    tags: ["summer", "fresh", "office", "daily"],
                    type: "Aquatic",
                    description: "The 90s classic. Marine notes, lime, and jasmine."
                },
                {
                    name: "Acqua di Giò Profondo",
                    brand: "Giorgio Armani",
                    image: "",
                    tags: ["summer", "fresh", "office", "daily", "sport"],
                    type: "Marine Aromatic",
                    description: "Modern marine notes with green mandarin. Deep and blue."
                },
                {
                    name: "Acqua di Giò Profumo",
                    brand: "Giorgio Armani",
                    image: "",
                    tags: ["summer", "office", "date", "woody"],
                    type: "Aquatic Aromatic",
                    description: "Sea notes mixed with incense and patchouli. Mature masterpiece."
                },
                {
                    name: "Armani Code",
                    brand: "Giorgio Armani",
                    image: "",
                    tags: ["winter", "date", "office"],
                    type: "Spicy Oriental",
                    description: "Tonka bean, leather, and olive blossom. Smooth and spicy."
                },

                // --- BDK ---
                {
                    name: "Gris Charnel Extrait",
                    brand: "BDK Parfums",
                    image: "",
                    tags: ["winter", "autumn", "date", "woody"],
                    type: "Woody Spicy",
                    description: "Cardamom, black tea, and sandalwood. Creamy, dark, and rich."
                },

                // --- BURBERRY ---
                {
                    name: "Burberry London for Men",
                    brand: "Burberry",
                    image: "",
                    tags: ["winter", "autumn", "date"],
                    type: "Spicy Oriental",
                    description: "Cinnamon, tobacco, and leather. Christmas in a bottle."
                },

                // --- BVLGARI ---
                {
                    name: "Bvlgari Aqva Pour Homme",
                    brand: "Bvlgari",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Aquatic",
                    description: "Seaweed and ocean notes. Deep, dark, and salty water."
                },
                {
                    name: "Bvlgari Man In Black",
                    brand: "Bvlgari",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Floral Oriental",
                    description: "Rum, spices, and leather. Warm and boozy."
                },
                {
                    name: "Bvlgari Le Gemme Tygar",
                    brand: "Bvlgari",
                    image: "",
                    tags: ["summer", "spring", "fresh", "daily", "office"],
                    type: "Citrus Amber",
                    description: "Sparkling grapefruit and ambroxan. Simple but luxurious."
                },

                // --- BYREDO ---
                {
                    name: "Bal d'Afrique",
                    brand: "Byredo",
                    image: "",
                    tags: ["spring", "summer", "fresh", "office"],
                    type: "Woody Floral",
                    description: "Vetiver, tagetes, and lemon. Creamy, clean, and artistic."
                },

                // --- CHANEL ---
                {
                    name: "Allure Homme Edition Blanche",
                    brand: "Chanel",
                    image: "",
                    tags: ["summer", "spring", "date", "fresh"],
                    type: "Oriental Citrus",
                    description: "Lemon and creamy vanilla. Like a high-end lemon meringue pie."
                },
                {
                    name: "Allure Homme Sport",
                    brand: "Chanel",
                    image: "",
                    tags: ["summer", "sport", "gym", "fresh"],
                    type: "Woody Spicy",
                    description: "Orange, sea notes, and aldehydes. Sharp and energetic."
                },
                {
                    name: "Allure Homme Sport Eau Extrême",
                    brand: "Chanel",
                    image: "",
                    tags: ["spring", "summer", "gym", "daily"],
                    type: "Aromatic Musk",
                    description: "Mint, tonka bean, and musk. Creamy freshness."
                },
                {
                    name: "Bleu de Chanel EDT",
                    brand: "Chanel",
                    image: "",
                    tags: ["summer", "office", "daily", "fresh"],
                    type: "Woody Aromatic",
                    description: "Grapefruit, ginger, and incense. Sharp, professional, and clean."
                },
                {
                    name: "Bleu de Chanel EDP",
                    brand: "Chanel",
                    image: "",
                    tags: ["autumn", "office", "date", "daily"],
                    type: "Woody Aromatic",
                    description: "Amber, citrus, and woods. Richer and smoother than the EDT."
                },
                {
                    name: "Platinum Égoïste",
                    brand: "Chanel",
                    image: "",
                    tags: ["spring", "office", "fresh", "daily"],
                    type: "Woody Floral",
                    description: "Lavender, rosemary, and geranium. The ultimate barbershop scent."
                },

                // --- CREED ---
                {
                    name: "Creed Aventus",
                    brand: "Creed",
                    image: "",
                    tags: ["spring", "summer", "office", "date", "daily"],
                    type: "Chypre Fruity",
                    description: "Pineapple, birch tar, and musk. The King of men's fragrance."
                },
                {
                    name: "Creed Aventus Cologne",
                    brand: "Creed",
                    image: "",
                    tags: ["summer", "fresh", "sport", "daily"],
                    type: "Fruity Aromatic",
                    description: "Mandarin, ginger, and pink pepper. A fresher, lighter Aventus."
                },
                {
                    name: "Creed Erolfa",
                    brand: "Creed",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Chypre",
                    description: "Melon, lime, and sea salt. Like sailing on a yacht."
                },
                {
                    name: "Creed Green Irish Tweed",
                    brand: "Creed",
                    image: "",
                    tags: ["spring", "office", "daily", "fresh"],
                    type: "Woody Floral",
                    description: "Lemon verbena, violet leaf, and iris. A walk through the Irish countryside."
                },
                {
                    name: "Creed Millésime Impérial",
                    brand: "Creed",
                    image: "",
                    tags: ["summer", "fresh", "office", "daily"],
                    type: "Woody Floral",
                    description: "Sea salt and fruit notes. Gold standard aquatic."
                },
                {
                    name: "Creed Silver Mountain Water",
                    brand: "Creed",
                    image: "",
                    tags: ["spring", "summer", "fresh", "daily"],
                    type: "Aromatic",
                    description: "Tea, black currant, and musk. Icy mountain air."
                },
                {
                    name: "Creed Viking",
                    brand: "Creed",
                    image: "",
                    tags: ["autumn", "winter", "office", "daily"],
                    type: "Woody Aromatic",
                    description: "Peppermint, pink pepper, and sandalwood. Fiery and masculine."
                },
                {
                    name: "Creed Virgin Island Water",
                    brand: "Creed",
                    image: "",
                    tags: ["summer", "sweet", "daily"],
                    type: "Citrus Gourmand",
                    description: "Lime, coconut, and white rum. Tropical cocktail in a bottle."
                },

                // --- DIOR ---
                {
                    name: "Bois d'Argent",
                    brand: "Dior",
                    image: "",
                    tags: ["autumn", "office", "date", "woody"],
                    type: "Woody Chypre",
                    description: "Iris, myrrh, and honey. Mysterious and ethereal."
                },
                {
                    name: "Dior Homme (2020)",
                    brand: "Dior",
                    image: "",
                    tags: ["office", "daily", "woody"],
                    type: "Woody",
                    description: "Iso E Super, cedar, and bergamot. Modern and woody."
                },
                {
                    name: "Dior Homme Original",
                    brand: "Dior",
                    image: "",
                    tags: ["date", "office", "winter", "sweet"],
                    type: "Woody Floral",
                    description: "Iris, cardamom, and cocoa. Powdery and romantic."
                },
                {
                    name: "Dior Homme Cologne",
                    brand: "Dior",
                    image: "",
                    tags: ["summer", "fresh", "gym", "daily"],
                    type: "Citrus Aromatic",
                    description: "Bergamot blossom and musk. Like a crisp white shirt."
                },
                {
                    name: "Dior Homme Intense",
                    brand: "Dior",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Woody Floral",
                    description: "Iris, pear, and ambrette. Lipsticky, chocolatey, and sexy."
                },
                {
                    name: "Dior Homme Sport",
                    brand: "Dior",
                    image: "",
                    tags: ["summer", "sport", "gym", "fresh"],
                    type: "Woody Aromatic",
                    description: "Lemon, pink pepper, and woods. Sharp and energetic."
                },
                {
                    name: "Fève Délicieuse",
                    brand: "Dior",
                    image: "",
                    tags: ["winter", "sweet", "date"],
                    type: "Oriental Vanilla",
                    description: "Tonka bean, caramel, and cherry. Pure gourmand luxury."
                },
                {
                    name: "Gris Dior",
                    brand: "Dior",
                    image: "",
                    tags: ["spring", "autumn", "office", "date"],
                    type: "Floral Chypre",
                    description: "Rose, oakmoss, and patchouli. Grey, melancholy, and beautiful."
                },
                {
                    name: "Oud Ispahan",
                    brand: "Dior",
                    image: "",
                    tags: ["winter", "date", "dark"],
                    type: "Oriental Floral",
                    description: "Oud, rose, and labdanum. Barnyard funk and classy rose."
                },
                {
                    name: "Sauvage EDT",
                    brand: "Dior",
                    image: "",
                    tags: ["summer", "spring", "daily", "party"],
                    type: "Aromatic Fougere",
                    description: "Bergamot, pepper, and ambroxan. Loud and mass appealing."
                },
                {
                    name: "Tobacolor",
                    brand: "Dior",
                    image: "",
                    tags: ["winter", "sweet", "dark"],
                    type: "Oriental",
                    description: "Honey, tobacco, and plum. Sticky sweet hookah tobacco."
                },
                {
                    name: "Vanilla Diorama",
                    brand: "Dior",
                    image: "",
                    tags: ["winter", "sweet", "date"],
                    type: "Oriental Vanilla",
                    description: "Rum, orange, and vanilla. Boozy and warm."
                },

                // --- DOLCE & GABBANA ---
                {
                    name: "Light Blue Eau Intense",
                    brand: "Dolce & Gabbana",
                    image: "",
                    tags: ["summer", "fresh", "sport", "daily"],
                    type: "Aquatic",
                    description: "Grapefruit, sea water, and musk. Salty and extremely long-lasting."
                },
                {
                    name: "The One for Men EDP",
                    brand: "Dolce & Gabbana",
                    image: "",
                    tags: ["autumn", "winter", "date", "daily"],
                    type: "Amber Spicy",
                    description: "Amber, ginger, and tobacco. Cozy, romantic, and masculine."
                },

                // --- EX NIHILO ---
                {
                    name: "Blue Talisman",
                    brand: "Ex Nihilo",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Woody Fruity",
                    description: "Pear, ginger, and musk. A modern, geometric blue scent."
                },
                {
                    name: "Fleur Narcotique",
                    brand: "Ex Nihilo",
                    image: "",
                    tags: ["spring", "fresh", "daily"],
                    type: "Floral Fruity",
                    description: "Lychee, peony, and orange blossom. Airy and addictive."
                },
                {
                    name: "The Hedonist",
                    brand: "Ex Nihilo",
                    image: "",
                    tags: ["spring", "summer", "office"],
                    type: "Woody Aromatic",
                    description: "Ginger, akigalawood, and cedar. Sharp and vibrating."
                },

                // --- FREDERIC MALLE ---
                {
                    name: "French Lover",
                    brand: "Frederic Malle",
                    image: "",
                    tags: ["autumn", "office", "green"],
                    type: "Woody Aromatic",
                    description: "Angelica, cedar, and vetiver. Dry, green, and sophisticated."
                },
                {
                    name: "Portrait of a Lady",
                    brand: "Frederic Malle",
                    image: "",
                    tags: ["winter", "date", "dark", "floral"],
                    type: "Oriental Floral",
                    description: "Massive dose of rose and patchouli. Dark, gothic masterpiece."
                },

                // --- GIVENCHY ---
                {
                    name: "Play Intense",
                    brand: "Givenchy",
                    image: "",
                    tags: ["winter", "sweet", "club"],
                    type: "Oriental Fougere",
                    description: "Coffee, amyris wood, and pink pepper. Sweet and playful."
                },

                // --- GUCCI ---
                {
                    name: "Gucci by Gucci Pour Homme",
                    brand: "Gucci",
                    image: "",
                    tags: ["autumn", "office", "date"],
                    type: "Chypre Woody",
                    description: "Cypress, violet, and tobacco. Elegant and understated."
                },
                {
                    name: "Gucci Pour Homme II",
                    brand: "Gucci",
                    image: "",
                    tags: ["spring", "office", "daily"],
                    type: "Woody Spicy",
                    description: "Tea, cinnamon, and violet leaf. The ultimate calming tea scent."
                },

                // --- GUERLAIN ---
                {
                    name: "Ambre Narguilé",
                    brand: "Hermès", // Technically Hermessence line
                    image: "",
                    tags: ["winter", "sweet", "gourmand"],
                    type: "Oriental Spicy",
                    description: "Honey, cinnamon, and caramel. Warm apple pie."
                },
                {
                    name: "Cherry Oud",
                    brand: "Guerlain",
                    image: "",
                    tags: ["winter", "date", "dark"],
                    type: "Fruity Oud",
                    description: "Dark cherry and leather oud. Mysterious and fruity."
                },
                {
                    name: "Cuir Béluga",
                    brand: "Guerlain",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Leather",
                    description: "White suede and vanilla. Extremely smooth and luxurious."
                },
                {
                    name: "Fève Gourmande",
                    brand: "Guerlain",
                    image: "",
                    tags: ["winter", "sweet", "gourmand"],
                    type: "Gourmand",
                    description: "Cocoa, rose, and smoke. Like a chocolate dessert."
                },
                {
                    name: "L'Homme Idéal EDT",
                    brand: "Guerlain",
                    image: "",
                    tags: ["autumn", "office", "sweet"],
                    type: "Woody Aromatic",
                    description: "Almond and amaretto. Nutty and masculine."
                },
                {
                    name: "L'Instant de Guerlain",
                    brand: "Guerlain",
                    image: "",
                    tags: ["autumn", "date", "office"],
                    type: "Woody Spicy",
                    description: "Cocoa, patchouli, and star anise. Classy gentlemen's scent."
                },
                {
                    name: "Spiritueuse Double Vanille",
                    brand: "Guerlain",
                    image: "",
                    tags: ["winter", "sweet", "date"],
                    type: "Oriental Vanilla",
                    description: "Boozy vanilla and incense. The gold standard of vanilla."
                },
                {
                    name: "Tobacco Honey",
                    brand: "Guerlain",
                    image: "",
                    tags: ["winter", "sweet", "dark"],
                    type: "Woody Oriental",
                    description: "Raw honey and dry tobacco. Very powerful."
                },
                {
                    name: "Tonka Impériale",
                    brand: "Guerlain",
                    image: "",
                    tags: ["winter", "sweet", "date"],
                    type: "Oriental Woody",
                    description: "Almond, tonka, and tobacco. Rich and nutty."
                },

                // --- HERMES ---
                {
                    name: "Eau des Merveilles",
                    brand: "Hermès",
                    image: "",
                    tags: ["autumn", "daily", "fresh"],
                    type: "Woody Oriental",
                    description: "Orange, amber, and woods. Sparkly and unique."
                },
                {
                    name: "Eau des Merveilles Bleue",
                    brand: "Hermès",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Aquatic",
                    description: "Sea notes and patchouli. Mineral and oceanic."
                },
                {
                    name: "Terre d'Hermès EDT",
                    brand: "Hermès",
                    image: "",
                    tags: ["autumn", "office", "daily", "spring"],
                    type: "Woody Chypre",
                    description: "Orange, flint, and vetiver. Earthy and professional."
                },
                {
                    name: "Terre d'Hermès Parfum",
                    brand: "Hermès",
                    image: "",
                    tags: ["autumn", "office", "daily"],
                    type: "Woody Chypre",
                    description: "Smoother, richer version of the original. More oakmoss."
                },
                {
                    name: "Terre d'Hermès Eau Givrée",
                    brand: "Hermès",
                    image: "",
                    tags: ["summer", "fresh", "gym"],
                    type: "Citrus Aromatic",
                    description: "Citron, juniper berry, and pepper. Icy cold earth."
                },
                {
                    name: "Un Jardin Sur Le Nil",
                    brand: "Hermès",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Floral Fruity",
                    description: "Green mango, lotus, and tomato leaf. A garden by the river."
                },
                {
                    name: "Voyage d'Hermès EDT",
                    brand: "Hermès",
                    image: "",
                    tags: ["spring", "office", "fresh"],
                    type: "Woody Floral",
                    description: "Cardamom, lemon, and spices. Airy and gin-like."
                },
                {
                    name: "Voyage d'Hermès Parfum",
                    brand: "Hermès",
                    image: "",
                    tags: ["autumn", "office", "date"],
                    type: "Woody Floral",
                    description: "More amber and woods than the EDT. Warmer and denser."
                },

                // --- INITIO ---
                {
                    name: "Absolute Aphrodisiac",
                    brand: "Initio",
                    image: "",
                    tags: ["winter", "date", "sweet", "sexy"],
                    type: "Oriental Spicy",
                    description: "Vanilla, amber, and musk. Animalic and seductive."
                },
                {
                    name: "Musk Therapy",
                    brand: "Initio",
                    image: "",
                    tags: ["spring", "fresh", "daily", "clean"],
                    type: "Woody Floral",
                    description: "Blackcurrant, white sandalwood, and musk. Pure therapy."
                },
                {
                    name: "Narcotic Delight",
                    brand: "Initio",
                    image: "",
                    tags: ["winter", "date", "sweet", "club"],
                    type: "Oriental Vanilla",
                    description: "Cherry, cognac, and vanilla. Intoxicating and sweet."
                },
                {
                    name: "Oud for Greatness",
                    brand: "Initio",
                    image: "",
                    tags: ["winter", "dark", "date", "woody"],
                    type: "Woody Spicy",
                    description: "Natural oud, saffron, and nutmeg. Bold and spiritual."
                },
                {
                    name: "Paragon",
                    brand: "Initio",
                    image: "",
                    tags: ["autumn", "daily", "office", "woody"],
                    type: "Woody Spicy",
                    description: "Palo santo, sage, and lavender. Calming and meditative."
                },
                {
                    name: "Rehab",
                    brand: "Initio",
                    image: "",
                    tags: ["spring", "daily", "office", "sweet"],
                    type: "Woody Aromatic",
                    description: "Lavender, tobacco, and vanilla. Creamy and smooth."
                },
                {
                    name: "Side Effect",
                    brand: "Initio",
                    image: "",
                    tags: ["winter", "date", "sweet", "club"],
                    type: "Oriental",
                    description: "Rum, tobacco, and cinnamon. Boozy and addictive."
                },

                // --- JEAN PAUL GAULTIER ---
                {
                    name: "Le Male Le Parfum",
                    brand: "JPG",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Oriental",
                    description: "Cardamom, lavender, and vanilla. The Captain's scent."
                },
                {
                    name: "Le Beau Le Parfum",
                    brand: "JPG",
                    image: "",
                    tags: ["summer", "sweet", "club"],
                    type: "Woody Amber",
                    description: "Coconut, pineapple, and tonka. Intense tropical vibes."
                },
                {
                    name: "Le Beau Paradise Garden",
                    brand: "JPG",
                    image: "",
                    tags: ["summer", "fresh", "green"],
                    type: "Aquatic Green",
                    description: "Coconut water, fig, and salt. Green and watery."
                },

                // --- JO MALONE ---
                {
                    name: "Myrrh & Tonka",
                    brand: "Jo Malone",
                    image: "",
                    tags: ["winter", "autumn", "sweet"],
                    type: "Oriental",
                    description: "Lavender, myrrh, and almond. Warm and resinous."
                },
                {
                    name: "Oud & Bergamot",
                    brand: "Jo Malone",
                    image: "",
                    tags: ["autumn", "office", "woody"],
                    type: "Oriental",
                    description: "Crisp bergamot and dry oud. Clean and mysterious."
                },
                {
                    name: "Wood Sage & Sea Salt",
                    brand: "Jo Malone",
                    image: "",
                    tags: ["summer", "spring", "daily", "fresh"],
                    type: "Aromatic",
                    description: "Sea salt, sage, and grapefruit. breezy coastal air."
                },

                // --- KILIAN ---
                {
                    name: "Angels' Share",
                    brand: "Kilian",
                    image: "",
                    tags: ["winter", "date", "sweet", "gourmand"],
                    type: "Oriental Vanilla",
                    description: "Cognac, cinnamon, and praline. Boozy apple pie."
                },
                {
                    name: "Angels' Share on the Rocks",
                    brand: "Kilian",
                    image: "",
                    tags: ["winter", "date", "fresh"],
                    type: "Oriental",
                    description: "A fresher, lighter take on the original boozy DNA."
                },
                {
                    name: "Back to Black",
                    brand: "Kilian",
                    image: "",
                    tags: ["winter", "date", "sweet", "dark"],
                    type: "Oriental Woody",
                    description: "Honey, tobacco, and cherry. Powdery aphrodisiac."
                },
                {
                    name: "Black Phantom",
                    brand: "Kilian",
                    image: "",
                    tags: ["winter", "gourmand", "dark"],
                    type: "Oriental Vanilla",
                    description: "Coffee, rum, and chocolate. A pirate ship dessert."
                },
                {
                    name: "Moonlight in Heaven",
                    brand: "Kilian",
                    image: "",
                    tags: ["summer", "date", "sweet"],
                    type: "Aromatic",
                    description: "Mango, coconut, and rice. Creamy tropical night."
                },
                {
                    name: "Smoking Hot",
                    brand: "Kilian",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Oriental Spicy",
                    description: "Apple hookah tobacco. Smoky and sweet."
                },
                {
                    name: "Straight to Heaven",
                    brand: "Kilian",
                    image: "",
                    tags: ["autumn", "date", "woody"],
                    type: "Woody Spicy",
                    description: "Rum, cedar, and dried fruits. Dry and boozy."
                },

                // --- LOUIS VUITTON ---
                {
                    name: "Afternoon Swim",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Citrus",
                    description: "Mandarin orange explosion. Pure Vitamin C."
                },
                {
                    name: "California Dream",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Citrus",
                    description: "Mandarin, musk, and pear. A sunset in a bottle."
                },
                {
                    name: "Imagination",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["spring", "summer", "daily", "office"],
                    type: "Citrus Aromatic",
                    description: "Ambroxan, chinese black tea, and citron. Clean luxury."
                },
                {
                    name: "L'Immensité",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["spring", "summer", "office", "fresh"],
                    type: "Spicy Amber",
                    description: "Grapefruit, ginger, and amber. Sharp and masculine."
                },
                {
                    name: "Ombre Nomade",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["winter", "dark", "date", "oud"],
                    type: "Oriental Woody",
                    description: "Oud, raspberry, and benzoin. Dark, smoky, and eternal."
                },
                {
                    name: "On The Beach",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Citrus Aromatic",
                    description: "Yuzu, neroli, and sand. Bright and sandy."
                },
                {
                    name: "Pacific Chill",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["summer", "fresh", "sweet"],
                    type: "Aromatic Fruity",
                    description: "Blackcurrant, mint, and lemon. Like a detox smoothie."
                },
                {
                    name: "Symphony",
                    brand: "Louis Vuitton",
                    image: "",
                    tags: ["summer", "fresh", "sweet"],
                    type: "Citrus",
                    description: "Grapefruit and ginger zest. Sparkly and high-end."
                },

                // --- MAISON CRIVELLI ---
                {
                    name: "Ambre Chromatique",
                    brand: "Maison Crivelli",
                    image: "",
                    tags: ["autumn", "winter", "incense"],
                    type: "Amber Floral",
                    description: "Incense, pink pepper, and amber. Dry and resinous."
                },
                {
                    name: "Oud Maracujá",
                    brand: "Maison Crivelli",
                    image: "",
                    tags: ["winter", "fruit", "oud", "dark"],
                    type: "Leather Fruity",
                    description: "Passionfruit and oud leather. Exotic and smoky."
                },

                // --- MAISON FRANCIS KURKDJIAN ---
                {
                    name: "Baccarat Rouge 540 EDP",
                    brand: "MFK",
                    image: "",
                    tags: ["winter", "date", "sweet", "daily"],
                    type: "Oriental Floral",
                    description: "Saffron, amberwood, and burnt sugar. Airy and sweet."
                },
                {
                    name: "Gentle Fluidity Silver",
                    brand: "MFK",
                    image: "",
                    tags: ["spring", "office", "fresh", "gym"],
                    type: "Aromatic",
                    description: "Juniper berries, nutmeg, and gin. Metallic and crisp."
                },
                {
                    name: "Grand Soir",
                    brand: "MFK",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Amber",
                    description: "Amber, vanilla, and tonka. Golden Paris night."
                },
                {
                    name: "Oud Satin Mood",
                    brand: "MFK",
                    image: "",
                    tags: ["winter", "date", "sweet", "rose"],
                    type: "Oriental Woody",
                    description: "Violet, rose, and vanilla oud. Smooth like satin fabric."
                },

                // --- MAISON MARGIELA ---
                {
                    name: "By the Fireplace",
                    brand: "Replica",
                    image: "",
                    tags: ["winter", "cozy", "sweet"],
                    type: "Woody",
                    description: "Chestnut, vanilla, and burning wood. Literally a fireplace."
                },
                {
                    name: "Jazz Club",
                    brand: "Replica",
                    image: "",
                    tags: ["winter", "date", "boozy"],
                    type: "Leather",
                    description: "Rum, tobacco, and vanilla. A brooklyn jazz club."
                },

                // --- MANCERA ---
                {
                    name: "Cedrat Boise",
                    brand: "Mancera",
                    image: "",
                    tags: ["spring", "summer", "daily", "office"],
                    type: "Citrus Aromatic",
                    description: "Lemon, blackcurrant, and leather. Versatile fruity wood."
                },
                {
                    name: "French Riviera",
                    brand: "Mancera",
                    image: "",
                    tags: ["summer", "fresh", "marine"],
                    type: "Aquatic",
                    description: "Sea salt, citrus, and pine. A coastal drive."
                },

                // --- MARC-ANTOINE BARROIS ---
                {
                    name: "Ganymede",
                    brand: "Marc-Antoine Barrois",
                    image: "",
                    tags: ["autumn", "office", "fresh", "mineral"],
                    type: "Woody Spicy",
                    description: "Mineral notes, suede, and akigalawood. Metallic and alien."
                },

                // --- MEMO PARIS ---
                {
                    name: "African Leather",
                    brand: "Memo Paris",
                    image: "",
                    tags: ["winter", "autumn", "spicy"],
                    type: "Leather",
                    description: "Cardamom, cumin, and leather. Spicy rather than leathery."
                },
                {
                    name: "French Leather",
                    brand: "Memo Paris",
                    image: "",
                    tags: ["autumn", "date", "rose"],
                    type: "Leather",
                    description: "Rose, lime, and suede. A soft handbag leather."
                },

                // --- MONTALE ---
                {
                    name: "Arabians Tonka",
                    brand: "Montale",
                    image: "",
                    tags: ["winter", "sweet", "club", "beast"],
                    type: "Oriental Woody",
                    description: "Sugar, tonka, and oud. Massive projection and sweetness."
                },

                // --- NISHANE ---
                {
                    name: "Ani",
                    brand: "Nishane",
                    image: "",
                    tags: ["winter", "sweet", "date"],
                    type: "Oriental Floral",
                    description: "Ginger, vanilla, and blackcurrant. Bright opening, creamy drydown."
                },
                {
                    name: "Fan Your Flames",
                    brand: "Nishane",
                    image: "",
                    tags: ["winter", "dark", "boozy"],
                    type: "Gourmand",
                    description: "Coconut, rum, and tobacco. Tropical night out."
                },
                {
                    name: "Hacivat",
                    brand: "Nishane",
                    image: "",
                    tags: ["summer", "spring", "daily", "office"],
                    type: "Chypre",
                    description: "Pineapple, grapefruit, and oakmoss. Woody and citrusy."
                },

                // --- PARFUMS DE MARLY ---
                {
                    name: "Althair",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["winter", "sweet", "date"],
                    type: "Oriental Vanilla",
                    description: "Bourbon vanilla, cinnamon, and praline. Sweet and airy."
                },
                {
                    name: "Carlisle",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["winter", "dark", "date"],
                    type: "Floral Fruity",
                    description: "Nutmeg, apple, and patchouli. Dark and mysterious."
                },
                {
                    name: "Greenley",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["spring", "summer", "fresh", "green"],
                    type: "Citrus Aromatic",
                    description: "Green apple, cashmere wood, and oakmoss. Crisp forest scent."
                },
                {
                    name: "Haltane",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["winter", "office", "woody"],
                    type: "Woody Aromatic",
                    description: "Praline, oud, and saffron. Sweet and woody."
                },
                {
                    name: "Herod",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["winter", "date", "sweet", "tobacco"],
                    type: "Woody Spicy",
                    description: "Tobacco leaf, vanilla, and cinnamon. Warm and cozy."
                },
                {
                    name: "Layton",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["autumn", "date", "club", "daily"],
                    type: "Oriental Floral",
                    description: "Apple, vanilla, and cardamom. Mass appealing King."
                },
                {
                    name: "Oajan",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["winter", "sweet", "gourmand"],
                    type: "Oriental",
                    description: "Honey, cinnamon, and amber. Pure apple pie."
                },
                {
                    name: "Pegasus",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["spring", "office", "sweet"],
                    type: "Oriental Fougere",
                    description: "Metallic almond, vanilla, and lavender. Clean and powdery."
                },
                {
                    name: "Pegasus Exclusif",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["winter", "dark", "woody"],
                    type: "Oriental Woody",
                    description: "Darker almond with oud and guaiac wood."
                },
                {
                    name: "Percival",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["summer", "daily", "office", "fresh"],
                    type: "Citrus Aromatic",
                    description: "Lavender, mandarin, and musk. Blue shower gel luxury."
                },
                {
                    name: "Sedley",
                    brand: "Parfums de Marly",
                    image: "",
                    tags: ["summer", "fresh", "office"],
                    type: "Woody Aromatic",
                    description: "Mint, lemon, and rosemary. Like Sprite on ice."
                },

                // --- ROJA PARFUMS ---
                {
                    name: "Elysium Pour Homme",
                    brand: "Roja Parfums",
                    image: "",
                    tags: ["summer", "office", "daily", "fresh"],
                    type: "Aromatic Fougere",
                    description: "Grapefruit, vetiver, and ambergris. Bright and uplifting."
                },
                {
                    name: "Isola Blu",
                    brand: "Roja Parfums",
                    image: "",
                    tags: ["summer", "fresh", "office", "luxury"],
                    type: "Citrus Chypre",
                    description: "Lime, lemon, and cut grass. Extremely high quality citrus."
                },

                // --- SOSPIRO ---
                {
                    name: "Vibrato",
                    brand: "Sospiro",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Citrus Floral",
                    description: "Zesty grapefruit and ginger with powdery musk. Beast mode freshie."
                },

                // --- TOM FORD ---
                {
                    name: "Black Orchid",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["winter", "dark", "date", "floral"],
                    type: "Oriental Floral",
                    description: "Truffle, orchid, and chocolate. Gothic and unisex."
                },
                {
                    name: "Eau de Soleil Blanc",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Floral Oriental",
                    description: "Citrus, coconut, and pistachio. Lighter version of Soleil Blanc."
                },
                {
                    name: "Grey Vetiver",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["office", "spring", "fresh", "clean"],
                    type: "Woody Spicy",
                    description: "Vetiver, grapefruit, and sage. The ultimate CEO scent."
                },
                {
                    name: "Mandarino di Amalfi",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["summer", "fresh", "daily"],
                    type: "Citrus Aromatic",
                    description: "Lemon, grapefruit, and mint. Italian coast vibes."
                },
                {
                    name: "Neroli Portofino",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["summer", "fresh", "clean"],
                    type: "Citrus Aromatic",
                    description: "Neroli, bergamot, and orange blossom. Crisp soapy water."
                },
                {
                    name: "Noir de Noir",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["winter", "date", "dark", "rose"],
                    type: "Chypre Floral",
                    description: "Dark rose, truffle, and patchouli. Vampiric romance."
                },
                {
                    name: "Noir Extreme",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Oriental Woody",
                    description: "Kulfi dessert, cardamom, and vanilla. Tasty and seductive."
                },
                {
                    name: "Oud Wood",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["autumn", "office", "date", "woody"],
                    type: "Woody Spicy",
                    description: "Rare oud, sandalwood, and cardamom. Smooth and classy."
                },
                {
                    name: "Soleil Blanc",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["summer", "sweet", "daily"],
                    type: "Floral Amber",
                    description: "Coconut, tuberose, and ylang-ylang. Expensive sunscreen."
                },
                {
                    name: "Tobacco Vanille",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["winter", "sweet", "dark"],
                    type: "Oriental Spicy",
                    description: "Tobacco leaf and vanilla. Rich, sweet, and powerful."
                },
                {
                    name: "Tuscan Leather",
                    brand: "Tom Ford",
                    image: "",
                    tags: ["winter", "dark", "badboy"],
                    type: "Leather",
                    description: "Leather, raspberry, and saffron. Smells like a brick of cash."
                },

                // --- VIKTOR&ROLF ---
                {
                    name: "Spicebomb",
                    brand: "Viktor&Rolf",
                    image: "",
                    tags: ["winter", "autumn", "daily", "spicy"],
                    type: "Woody Spicy",
                    description: "Pepper, cinnamon, and tobacco. A grenade of spices."
                },
                {
                    name: "Spicebomb Extreme",
                    brand: "Viktor&Rolf",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Oriental Spicy",
                    description: "More tobacco and vanilla than the original. Cozy and warm."
                },

                // --- XERJOFF ---
                {
                    name: "40 Knots",
                    brand: "Xerjoff",
                    image: "",
                    tags: ["summer", "marine", "salty"],
                    type: "Aromatic Aquatic",
                    description: "Salt, sea water, and woody notes. A yacht club scent."
                },
                {
                    name: "Erba Pura",
                    brand: "Xerjoff",
                    image: "",
                    tags: ["summer", "sweet", "party"],
                    type: "Oriental",
                    description: "Fruit basket explosion and white musk. Loud and sweet."
                },
                {
                    name: "More Than Words",
                    brand: "Xerjoff",
                    image: "",
                    tags: ["winter", "date", "rose"],
                    type: "Oriental Woody",
                    description: "Oud, fruit, and rose. Artistic and heavy."
                },
                {
                    name: "Naxos",
                    brand: "Xerjoff",
                    image: "",
                    tags: ["winter", "autumn", "sweet", "date"],
                    type: "Aromatic Spicy",
                    description: "Honey, tobacco, and lavender. Sicilian masterpiece."
                },
                {
                    name: "Renaissance",
                    brand: "Xerjoff",
                    image: "",
                    tags: ["summer", "fresh", "citrus"],
                    type: "Citrus Aromatic",
                    description: "Lemon, mint, and tangerine. Realistic Italian citrus garden."
                },
                {
                    name: "Starlight",
                    brand: "Xerjoff",
                    image: "",
                    tags: ["winter", "sweet", "spicy"],
                    type: "Oriental Spicy",
                    description: "Cardamom and cinnamon bomb. Warm and festive."
                },
                {
                    name: "Torino21",
                    brand: "Xerjoff",
                    image: "",
                    tags: ["summer", "sport", "fresh"],
                    type: "Aromatic Green",
                    description: "Mint, basil, and lemon. Sharp and cooling."
                },

                // --- YVES SAINT LAURENT ---
                {
                    name: "Babycat",
                    brand: "YSL",
                    image: "",
                    tags: ["winter", "sweet", "dark"],
                    type: "Oriental Spicy",
                    description: "Vanilla, suede, and incense. Smoky vanilla leather."
                },
                {
                    name: "L'Homme",
                    brand: "YSL",
                    image: "",
                    tags: ["spring", "office", "daily", "ginger"],
                    type: "Woody Floral",
                    description: "Ginger, bergamot, and cedar. The perfect office scent."
                },
                {
                    name: "La Nuit de L'Homme",
                    brand: "YSL",
                    image: "",
                    tags: ["winter", "date", "sweet"],
                    type: "Woody Spicy",
                    description: "Cardamom and cedar. The ultimate romantic date scent."
                },
                {
                    name: "MYSLF Le Parfum",
                    brand: "YSL",
                    image: "",
                    tags: ["spring", "daily", "sweet"],
                    type: "Floral Woody",
                    description: "Orange blossom and woods. Modern, sweet, and clean."
                },
                {
                    name: "Tuxedo",
                    brand: "YSL",
                    image: "",
                    tags: ["winter", "date", "formal"],
                    type: "Chypre",
                    description: "Patchouli, amber, and spices. High-class elegance."
                },
                {
                    name: "Y Eau de Parfum",
                    brand: "YSL",
                    image: "",
                    tags: ["spring", "summer", "daily", "office"],
                    type: "Aromatic Fougere",
                    description: "Apple, sage, and ginger. Sharp, blue, and powerful."
                }
            ],
            topMatches: []
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.step - 1];
        },
        uniqueBrands() {
            const brands = [...new Set(this.database.map(p => p.brand))];
            return brands.length;
        },
        filteredResults() {
            let results = this.topMatches;
            
            if (this.resultFilter === 'high') {
                results = results.filter(p => p.score >= 90);
            } else if (this.resultFilter === 'favorites') {
                results = results.filter(p => this.isFavorite(p));
            }
            
            return results;
        }
    },
    mounted() {
        this.loadFavorites();
        this.browsePerfumes = [...this.database];
    },
    methods: {
        // Navigation
        startQuiz() {
            this.step = 1;
            this.showBrowse = false;
        },
        
        goHome() {
            if (this.step > 0 && this.step <= this.questions.length) {
                if (this.step > 1) {
                    this.step--;
                } else {
                    this.resetQuiz();
                }
            } else {
                this.resetQuiz();
            }
        },
        
        browseAll() {
            this.showBrowse = true;
            this.browsePerfumes = [...this.database];
        },
        
        toggleHelp() {
            this.showHelpModal = !this.showHelpModal;
        },
        
        // Question Flow
        selectOption(value) {
            if (this.step === 1) this.userAnswers.season = value;
            if (this.step === 2) this.userAnswers.vibe = value;
            if (this.step === 3) this.userAnswers.occasion = value;

            if (this.step < this.questions.length) {
                this.step++;
            } else {
                this.calculateResults();
            }
        },
        
        jumpToQuestion(questionNum) {
            if (questionNum <= this.step && questionNum > 0) {
                this.step = questionNum;
            }
        },
        
        // Results Calculation
        calculateResults() {
            this.step++;
            this.isLoading = true;
            this.currentLoadingMessage = 0;
            
            // Cycle through loading messages
            const messageInterval = setInterval(() => {
                this.currentLoadingMessage = (this.currentLoadingMessage + 1) % this.loadingMessages.length;
            }, 500);

            setTimeout(() => {
                clearInterval(messageInterval);
                this.runAlgorithm();
                this.isLoading = false;
                this.showResults = true;
            }, 2000);
        },
        
        runAlgorithm() {
            const scoredPerfumes = this.database.map(perfume => {
                let score = 0;
                let maxScore = 3;
                let matchedTags = [];

                // Direct tag matching
                if (perfume.tags.includes(this.userAnswers.season)) {
                    score++;
                    matchedTags.push(this.userAnswers.season);
                }
                if (perfume.tags.includes(this.userAnswers.vibe)) {
                    score++;
                    matchedTags.push(this.userAnswers.vibe);
                }
                if (perfume.tags.includes(this.userAnswers.occasion)) {
                    score++;
                    matchedTags.push(this.userAnswers.occasion);
                }
                
                // Smart matching logic
                if (this.userAnswers.vibe === 'fresh') {
                    if (perfume.tags.includes('sport')) score += 0.5;
                    if (perfume.type.toLowerCase().includes('aquatic')) score += 0.3;
                    if (perfume.type.toLowerCase().includes('citrus')) score += 0.3;
                }
                
                if (this.userAnswers.vibe === 'dark') {
                    if (perfume.tags.includes('woody')) score += 0.5;
                    if (perfume.type.toLowerCase().includes('oriental')) score += 0.3;
                    if (perfume.type.toLowerCase().includes('leather')) score += 0.3;
                }
                
                if (this.userAnswers.vibe === 'sweet') {
                    if (perfume.type.toLowerCase().includes('vanilla')) score += 0.3;
                    if (perfume.type.toLowerCase().includes('gourmand')) score += 0.3;
                }

                // Calculate percentage
                let percentage = Math.round((score / maxScore) * 100);
                
                // Bonus for versatile daily fragrances
                if (percentage < 100 && perfume.tags.includes('daily') && this.userAnswers.occasion === 'daily') {
                    percentage = Math.min(100, percentage + 10);
                }
                
                // Add season to perfume object for display
                const season = perfume.tags.find(tag => ['summer', 'winter', 'spring', 'autumn'].includes(tag));
                
                return { 
                    ...perfume, 
                    score: percentage,
                    season: season,
                    matchedTags 
                };
            });

            // Sort and get top 10 matches
            this.topMatches = scoredPerfumes
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
        },
        
        // Display helpers
        getMatchClass(score) {
            if (score >= 90) return 'perfect';
            if (score >= 75) return 'great';
            return 'good';
        },
        
        getPreferenceSummary() {
            const parts = [];
            if (this.userAnswers.season) parts.push(this.capitalizeFirst(this.userAnswers.season));
            if (this.userAnswers.vibe) {
                const vibeMap = {
                    'fresh': 'Fresh',
                    'sweet': 'Sweet',
                    'dark': 'Dark',
                    'woody': 'Professional'
                };
                parts.push(vibeMap[this.userAnswers.vibe]);
            }
            if (this.userAnswers.occasion) {
                const occasionMap = {
                    'date': 'Date Night',
                    'office': 'Office',
                    'sport': 'Sport',
                    'daily': 'Everyday'
                };
                parts.push(occasionMap[this.userAnswers.occasion]);
            }
            return parts.join(', ');
        },
        
        capitalizeFirst(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        // Favorites
        toggleFavorite(perfume) {
            const index = this.favorites.findIndex(f => f.name === perfume.name);
            if (index > -1) {
                this.favorites.splice(index, 1);
                this.showToast('Removed from favorites', 'success');
            } else {
                this.favorites.push(perfume);
                this.showToast('Added to favorites!', 'success');
            }
            this.saveFavorites();
        },
        
        isFavorite(perfume) {
            return this.favorites.some(f => f.name === perfume.name);
        },
        
        saveFavorites() {
            try {
                localStorage.setItem('scentAlgoFavorites', JSON.stringify(this.favorites));
            } catch (e) {
                console.error('Failed to save favorites:', e);
            }
        },
        
        loadFavorites() {
            try {
                const saved = localStorage.getItem('scentAlgoFavorites');
                if (saved) {
                    this.favorites = JSON.parse(saved);
                }
            } catch (e) {
                console.error('Failed to load favorites:', e);
            }
        },
        
        // Detail Modal
        showDetails(perfume) {
            this.selectedPerfume = perfume;
        },
        
        closeDetails() {
            this.selectedPerfume = null;
        },
        
        // Browse & Search
        filterBrowse() {
            let results = [...this.database];
            
            // Filter by search query
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                results = results.filter(p => 
                    p.name.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.type.toLowerCase().includes(query)
                );
            }
            
            // Filter by season
            if (this.browseSeasonFilter) {
                results = results.filter(p => p.tags.includes(this.browseSeasonFilter));
            }
            
            // Filter by vibe
            if (this.browseVibeFilter) {
                results = results.filter(p => p.tags.includes(this.browseVibeFilter));
            }
            
            this.browsePerfumes = results;
        },
        
        // Share
        shareResults() {
            const text = `I found my perfect fragrances on Scent Algorithm! My top match: ${this.topMatches[0].name} by ${this.topMatches[0].brand}`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'My Scent Algorithm Results',
                    text: text
                }).catch(err => console.log('Share cancelled'));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(text).then(() => {
                    this.showToast('Results copied to clipboard!', 'success');
                }).catch(() => {
                    this.showToast('Could not share results', 'error');
                });
            }
        },
        
        // Toast Notifications
        showToast(message, type = 'success') {
            const id = this.toastId++;
            const toast = { id, message, type };
            this.toasts.push(toast);
            
            setTimeout(() => {
                const index = this.toasts.findIndex(t => t.id === id);
                if (index > -1) {
                    this.toasts.splice(index, 1);
                }
            }, 3000);
        },
        
        getToastIcon(type) {
            const icons = {
                success: 'ph-fill ph-check-circle',
                error: 'ph-fill ph-x-circle',
                info: 'ph-fill ph-info'
            };
            return icons[type] || icons.info;
        },
        
        // Reset
        resetQuiz() {
            this.step = 0;
            this.showResults = false;
            this.showBrowse = false;
            this.userAnswers = {
                season: '',
                vibe: '',
                occasion: ''
            };
            this.topMatches = [];
            this.resultFilter = 'all';
        }
    }
}).mount('#app');
