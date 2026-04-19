import { Injectable, signal, effect } from '@angular/core';

export type Lang = 'en' | 'ar';

type Dictionary = Record<Lang, Record<string, string>>;

@Injectable({
  providedIn: 'root',
})
export class TranslateService {

  private readonly STORAGE_KEY = 'app_lang';

  lang = signal<Lang>(this.getInitialLang());

  private dictionary: Dictionary = {
    en: {
      LOGIN: 'Login',
      LOGOUT: 'Logout',
      HOME: 'Home',
      WELCOME: 'Welcome Back!',
      ABOUT_US: 'About Us',
      GOLD_PRICES:'Gold Prices',
      SHOP:'shop',
      HERO_TITLE: 'GOLDERA is',
  HERO_SUBTITLE: 'the leading gold Company in Egypt',
  HERO_SUBTITLE_2: 'And The Middle East',
  HERO_DESC: `Established in 2020, licensed under Egyptian law by the Investment Authority and the Hallmark and Weights Authority #455497. Goldera specializes in gold manufacturing, 24K gold bars, 21K gold coins, and gold import/export.`,
MY_PROFILE:'My profile',
ORDERS:'Orders',
ADDRESSES:'Addresses',
 MAKING_CHARGES:'Making Charges',
 CONFIRM_LOGOUT:'Confirm Logout', 
 LOG_OUT_SURE:'Are you sure you want to logout?',
 CANCEL:'Cancel',
 lOGOUT:'logout',
 LIVE_DASHBOARD: 'Live Trading Dashboard',
  LIVE: 'Live',
  CHART_TITLE: 'Gold Price Trends (18K, 24K, 21K)',
  VIEW_PRICES: 'View Live Prices',
  LIVE_GOLD:'LIVE GOLD PRICES',
  LIVE_DESC:   'Real-time pricing updated every second' ,
  LOADING_GOLD:'Loading gold prices...',
  GOLD:'Gold',
  PRICES:'Prices',
  SELL:'Sell',
  BUY:'buy',
  LAST_UPDATE:'Last updated',
  VIEW_DETAILS:'View Details Prices',
  WHY_GOLDERA:'Why Choose Goldera  ?',
   CARD_SECURITY_TITLE: "Bank-Level Security",
    CARD_SECURITY_DESC: "256-bit SSL encryption and high security",

    CARD_SUPPORT_TITLE: "24/7 Support",
    CARD_SUPPORT_DESC: "Instant real-time support anytime",

    CARD_CERTIFIED_TITLE: "Certified Gold",
    CARD_CERTIFIED_DESC: "Officially certified pure gold",

    CARD_DELIVERY_TITLE: "Secure Delivery",
    CARD_DELIVERY_DESC: "Insured and safe delivery",
    BEST_SELLING:'Our Best Selling',
    PRODUCTS_SECTION:'Our Gold Products Selection',
    NO_DESCRIPTION:'no descreption',
    WEIGHT:'Weight',
    PURITY:'Purity',
    PIECE:'Pieces',
    PRICE:'Price',
    EGP:'EGP',
    VIEW:'View',
    VIEW_ALL_PRODUCTS:'View All Products',
  LOGIN_SUBTITLE: "Sign in to continue your gold trading journey with us.",
  CREATE_ACCOUNT: "Create Account",
  SIGN_IN: "Sign In",
  EMAIL_OR_PHONE: "Email or Phone",
  PASSWORD: "Password",
  LOADING: "Loading...",
  FORGOT_PASSWORD: "Forgot your password?"

      
    },
    ar: {
      LOGIN: 'تسجيل الدخول',
      LOGOUT: 'تسجيل الخروج',
      HOME: 'الرئيسية',
      WELCOME: 'مرحبا',
      ABOUT_US: 'من نحن',
      GOLD_PRICES:'اسعار الذهب ',
      SHOP:'المتجر',
        HERO_TITLE: 'جولديرا هي',
  HERO_SUBTITLE: 'الشركة الرائدة في مجال الذهب في مصر',
  HERO_SUBTITLE_2: 'وفي الشرق الأوسط',
  HERO_DESC: `تأسست عام 2020، مرخصة طبقًا للقانون المصري من هيئة الاستثمار و هيئة الدمغة والموازين رقم 455497. تتخصص جولديرا في تصنيع الذهب، سبائك ذهب عيار 24، عملات ذهب عيار 21، واستيراد وتصدير الذهب.`,
   MY_PROFILE:'حسابي الشخصي',
   ORDERS:'الطلبات',
   ADDRESSES:'العناوين',
  MAKING_CHARGES:'مصنعية الذهب',
  CONFIRM_LOGOUT:'تأكيد الخروج' ,
  LOG_OUT_SURE:'هل انت متأكد من تسجيل الخروج',
  CANCEL:'الغاء',
  lOGOUT:'تسجيل الخروج ',
  LIVE_DASHBOARD: 'لوحة التداول المباشر',
  LIVE: 'مباشر',
  CHART_TITLE: 'تغيرات أسعار الذهب (18، 21، 24)',
  VIEW_PRICES: 'عرض الأسعار المباشرة',
LIVE_GOLD:'أسعار الذهب المباشرة',
LIVE_DESC:'تسعير مباشر يُحدث كل ثانية',
LOADING_GOLD:'تحميل اسعار الذهب ...',
GOLD:'الذهب',
PRICES:'اسعار',
SELL:'شراء',
BUY:'بيع',
LAST_UPDATE:'اخر تحديث',
VIEW_DETAILS:'عرض الاسعار التفصيلية ',
WHY_GOLDERA:'لماذا تختار جولد ايرا؟',
 CARD_SECURITY_TITLE: "أمان بمستوى البنوك",
    CARD_SECURITY_DESC: "تشفير 256 بت وأمان عالي",

    CARD_SUPPORT_TITLE: "دعم 24/7",
    CARD_SUPPORT_DESC: "دعم فوري في أي وقت",

    CARD_CERTIFIED_TITLE: "ذهب معتمد",
    CARD_CERTIFIED_DESC: "ذهب نقي معتمد رسميًا",

    CARD_DELIVERY_TITLE: "توصيل آمن",
  CARD_DELIVERY_DESC: "توصيل مؤمن وآمن",
  BEST_SELLING:'افضل المبيعات',
  PRODUCTS_SECTION:'مجموعة منتجات الذهب المختارة لدينا',
  NO_DESCRIPTION:'لا يوجد وصف',
  WEIGHT:'الوزن',
  PURITY:'النقاء',
  PIECE:'عدد القطع ',
  PRICE:'السعر',
  EGP:'جنية مصري',
  VIEW:'عرض',
  VIEW_ALL_PRODUCTS:'عرض جميع المنتجات',
    LOGIN_SUBTITLE: "سجل الدخول لمتابعة رحلتك في تداول الذهب معنا",
  CREATE_ACCOUNT: "إنشاء حساب",
  SIGN_IN: "تسجيل الدخول",
  EMAIL_OR_PHONE: "البريد الإلكتروني أو رقم الهاتف",
  PASSWORD: "كلمة المرور",
  LOADING: "جاري التحميل...",
  FORGOT_PASSWORD: "هل نسيت كلمة المرور؟"

}
  }

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, this.lang());

      document.documentElement.setAttribute('lang', this.lang());
      document.documentElement.setAttribute(
        'dir',
        this.lang() === 'ar' ? 'rtl' : 'ltr'
      );
    });
  }

  // 🔥 تحديد اللغة الافتراضية بشكل آمن
  private getInitialLang(): Lang {
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved === 'ar' || saved === 'en') {
      return saved;
    }

    return 'en';
  }

  // تغيير اللغة
  setLang(lang: Lang) {
    this.lang.set(lang);
  }

  // ترجمة key
  translate(key: keyof typeof this.dictionary['en']): string {
    return this.dictionary[this.lang()]?.[key] ?? key;
  }
}