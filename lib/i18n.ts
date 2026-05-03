export const translations = {
  en: {
    // Language Selection
    selectLanguage: "Select Your Language",
    continue: "Continue",

    // Signup Form
    signup: "Sign Up",
    login: "Login",
    farmerName: "Farmer Name",
    age: "Age",
    country: "Country",
    phoneNumber: "Phone Number (Optional)",
    email: "Email (Optional)",
    farmingType: "Type of Farming",
    singleCrop: "Single Crop",
    multipleCrops: "Multiple Crops",
    selectCrops: "Select Your Crops",
    farmLocation: "Farm Location (Optional)",
    state: "State",
    district: "District",
    soilType: "Soil Type",
    farmArea: "Farm Area (Acres)",
    irrigationType: "Irrigation Type",
    carbonCredit: "Interested in Carbon Credit Program",
    createAccount: "Create Account",

    // Crops
    wheat: "Wheat",
    pomegranate: "Pomegranate",
    tomato: "Tomato",
    cotton: "Cotton",
    sugarcane: "Sugarcane",
    rice: "Rice",
    maize: "Maize",
    soybean: "Soybean",
    others: "Others",

    // Soil Types
    sandy: "Sandy",
    loamy: "Loamy",
    clay: "Clay",

    // Irrigation Types
    drip: "Drip",
    flood: "Flood",
    rainfed: "Rainfed",

    // Login
    loginTitle: "Welcome Back",
    password: "Password",
    loginButton: "Login",
    noAccount: "Don't have an account?",
    signupLink: "Sign up here",

    // Dashboard
    welcome: "Welcome",
    dashboard: "Dashboard",
    myProfile: "My Profile",
    logout: "Logout",
  },
  hi: {
    // Language Selection
    selectLanguage: "अपनी भाषा चुनें",
    continue: "जारी रखें",

    // Signup Form
    signup: "साइन अप",
    login: "लॉगिन",
    farmerName: "किसान का नाम",
    age: "उम्र",
    country: "देश",
    phoneNumber: "फोन नंबर (वैकल्पिक)",
    email: "ईमेल (वैकल्पिक)",
    farmingType: "खेती का प्रकार",
    singleCrop: "एक फसल",
    multipleCrops: "कई फसलें",
    selectCrops: "अपनी फसलें चुनें",
    farmLocation: "खेत का स्थान (वैकल्पिक)",
    state: "राज्य",
    district: "जिला",
    soilType: "मिट्टी का प्रकार",
    farmArea: "खेत का क्षेत्रफल (एकड़)",
    irrigationType: "सिंचाई का प्रकार",
    carbonCredit: "कार्बन क्रेडिट कार्यक्रम में रुचि",
    createAccount: "खाता बनाएं",

    // Crops
    wheat: "गेहूं",
    pomegranate: "अनार",
    tomato: "टमाटर",
    cotton: "कपास",
    sugarcane: "गन्ना",
    rice: "चावल",
    maize: "मक्का",
    soybean: "सोयाबीन",
    others: "अन्य",

    // Soil Types
    sandy: "रेतीली",
    loamy: "दोमट",
    clay: "चिकनी",

    // Irrigation Types
    drip: "ड्रिप",
    flood: "बाढ़",
    rainfed: "वर्षा आधारित",

    // Login
    loginTitle: "वापस स्वागत है",
    password: "पासवर्ड",
    loginButton: "लॉगिन",
    noAccount: "कोई खाता नहीं है?",
    signupLink: "यहाँ साइन अप करें",

    // Dashboard
    welcome: "स्वागत है",
    dashboard: "डैशबोर्ड",
    myProfile: "मेरी प्रोफ़ाइल",
    logout: "लॉगआउट",
  },
  mr: {
    // Language Selection
    selectLanguage: "तुमची भाषा निवडा",
    continue: "पुढे चला",

    // Signup Form
    signup: "साइन अप",
    login: "लॉगिन",
    farmerName: "शेतकऱ्याचे नाव",
    age: "वय",
    country: "देश",
    phoneNumber: "फोन नंबर (पर्यायी)",
    email: "ईमेल (पर्यायी)",
    farmingType: "शेतीचा प्रकार",
    singleCrop: "एक पीक",
    multipleCrops: "अनेक पिके",
    selectCrops: "तुमची पिके निवडा",
    farmLocation: "शेताचे स्थान (पर्यायी)",
    state: "राज्य",
    district: "जिल्हा",
    soilType: "मातीचा प्रकार",
    farmArea: "शेताचे क्षेत्रफळ (एकर)",
    irrigationType: "सिंचनाचा प्रकार",
    carbonCredit: "कार्बन क्रेडिट कार्यक्रमात स्वारस्य",
    createAccount: "खाते तयार करा",

    // Crops
    wheat: "गहू",
    pomegranate: "डाळिंब",
    tomato: "टोमॅटो",
    cotton: "कापूस",
    sugarcane: "ऊस",
    rice: "तांदूळ",
    maize: "मका",
    soybean: "सोयाबीन",
    others: "इतर",

    // Soil Types
    sandy: "वालुकामय",
    loamy: "चिकणमाती",
    clay: "चिकणमाती",

    // Irrigation Types
    drip: "ठिबक",
    flood: "पूर",
    rainfed: "पावसावर अवलंबून",

    // Login
    loginTitle: "परत स्वागत आहे",
    password: "पासवर्ड",
    loginButton: "लॉगिन",
    noAccount: "खाते नाही?",
    signupLink: "येथे साइन अप करा",

    // Dashboard
    welcome: "स्वागत आहे",
    dashboard: "डॅशबोर्ड",
    myProfile: "माझी प्रोफाइल",
    logout: "लॉगआउट",
  },
}

export type Language = "en" | "hi" | "mr"
export type TranslationKey = keyof typeof translations.en

export const getTranslation = (language: Language, key: TranslationKey): string => {
  return translations[language][key] || translations.en[key]
}
