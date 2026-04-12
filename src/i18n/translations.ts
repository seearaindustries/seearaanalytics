// ─── All UI strings for EN and HI ─────────────────────────────────────────────
export type TranslationKeys = {
  // App
  appTitle: string;
  appSubtitle: string;

  // Auth
  signIn: string;
  email: string;
  password: string;
  emailRequired: string;
  loginFailed: string;
  signOut: string;

  // Nav tabs
  dashboard: string;
  newEntry: string;
  logs: string;

  // Form
  editEntry: string;
  date: string;
  recipe: string;
  batchCode: string;
  kneader: string;
  kneaderCapacity: string;
  totalOrder: string;
  noBatches: string;
  shift: string;
  morning: string;
  evening: string;
  night: string;
  submit: string;
  update: string;
  cancel: string;
  required: string;
  mustBeNumber: string;
  missingFields: string;
  fillRequired: string;

  // Logs
  recentLogs: string;
  actions: string;
  noLogs: string;
  logDetail: string;

  // Alerts
  success: string;
  entrySaved: string;
  entryUpdated: string;
  error: string;
  deleteTitle: string;
  deleteMessage: string;
  delete: string;
  cancelBtn: string;

  // Language toggle
  switchToHindi: string;
  switchToEnglish: string;
};

export type Lang = 'en' | 'hi';

export const translations: Record<Lang, TranslationKeys> = {
  en: {
    appTitle: 'SEEARA INDUSTRIES',
    appSubtitle: 'Production Management',
    signIn: 'Sign In',
    email: 'Email',
    password: 'Password',
    emailRequired: 'Email and password are required.',
    loginFailed: 'Login failed. Please try again.',
    signOut: 'Sign Out',
    dashboard: 'Dashboard',
    newEntry: 'New Entry',
    logs: 'Logs',
    editEntry: 'Edit Production Log',
    date: 'Date',
    recipe: 'Recipe',
    batchCode: 'Batch Code',
    kneader: 'Kneader',
    kneaderCapacity: 'Kneader Capacity',
    totalOrder: 'Total Order',
    noBatches: 'Batches',
    shift: 'Shift',
    morning: 'Morning',
    evening: 'Evening',
    night: 'Night',
    submit: 'Submit Log',
    update: 'Update Entry',
    cancel: 'Cancel Edit',
    required: 'is required',
    mustBeNumber: 'Total Order must be a number',
    missingFields: 'Missing Fields',
    fillRequired: 'Please fill in all required fields.',
    recentLogs: 'Recent Logs',
    actions: 'Action',
    noLogs: 'No logs found.',
    logDetail: 'Log Detail',
    success: 'Success',
    entrySaved: 'Entry saved successfully.',
    entryUpdated: 'Entry updated successfully.',
    error: 'Error',
    deleteTitle: 'Delete Entry',
    deleteMessage: 'Are you sure you want to delete this log?',
    delete: 'Delete',
    cancelBtn: 'Cancel',
    switchToHindi: 'हिंदी',
    switchToEnglish: 'English',
  },
  hi: {
    appTitle: 'सियरा इंडस्ट्रीज',
    appSubtitle: 'उत्पादन प्रबंधन',
    signIn: 'साइन इन करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    emailRequired: 'ईमेल और पासवर्ड आवश्यक हैं।',
    loginFailed: 'लॉगिन विफल। कृपया पुनः प्रयास करें।',
    signOut: 'साइन आउट',
    dashboard: 'डैशबोर्ड',
    newEntry: 'नई प्रविष्टि',
    logs: 'लॉग',
    editEntry: 'उत्पादन लॉग संपादित करें',
    date: 'दिनांक',
    recipe: 'रेसिपी',
    batchCode: 'बैच कोड',
    kneader: 'नीडर',
    kneaderCapacity: 'नीडर क्षमता',
    totalOrder: 'कुल ऑर्डर',
    noBatches: 'बैच संख्या',
    shift: 'शिफ्ट',
    morning: 'सुबह',
    evening: 'शाम',
    night: 'रात',
    submit: 'लॉग जमा करें',
    update: 'प्रविष्टि अपडेट करें',
    cancel: 'संपादन रद्द करें',
    required: 'आवश्यक है',
    mustBeNumber: 'कुल ऑर्डर एक संख्या होनी चाहिए',
    missingFields: 'अपूर्ण फ़ील्ड',
    fillRequired: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
    recentLogs: 'हालिया लॉग',
    actions: 'कार्रवाई',
    noLogs: 'कोई लॉग नहीं मिला।',
    logDetail: 'लॉग विवरण',
    success: 'सफल',
    entrySaved: 'प्रविष्टि सहेजी गई।',
    entryUpdated: 'प्रविष्टि अपडेट की गई।',
    error: 'त्रुटि',
    deleteTitle: 'प्रविष्टि हटाएं',
    deleteMessage: 'क्या आप वाकई इस लॉग को हटाना चाहते हैं?',
    delete: 'हटाएं',
    cancelBtn: 'रद्द करें',
    switchToHindi: 'हिंदी',
    switchToEnglish: 'English',
  },
};
