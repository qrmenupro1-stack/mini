# متجر MiniWatch التجريبي

موقع عربي بسيط فيه 3 ساعات بأسعار €3 و€4 و€10، ويربط زر الشراء مباشرةً بـStripe Checkout.

## ما الذي يفعله الموقع؟

1. يختار المستخدم ساعة.
2. يضغط **اشترِ الآن**.
3. تفتح صفحة الدفع الآمنة التابعة لـStripe.
4. بعد الدفع يرجع إلى صفحة نجاح تتحقق من Stripe أن العملية مدفوعة فعلًا.

لا يوجد تسجيل حساب، ولا سلة مشتريات، ولا عنوان شحن.

## النشر المجاني على Cloudflare Pages

### 1) ارفع الملفات إلى GitHub

- أنشئ مستودعًا جديدًا في GitHub.
- ارفع **محتويات هذا المجلد** كما هي، بما فيها مجلدا `public` و`functions`.

### 2) اربط GitHub مع Cloudflare

من Cloudflare:

- افتح **Workers & Pages**.
- اختر **Create application** ثم **Pages** ثم **Connect to Git**.
- اختر مستودع GitHub.
- Framework preset: اختر **None**.
- Build command: اكتب `exit 0`.
- Build output directory: اكتب `public`.
- اضغط Deploy.

### 3) أضف مفتاح Stripe

بعد أول نشر:

- افتح مشروعك في Cloudflare.
- ادخل إلى **Settings → Variables and Secrets**.
- اضغط **Add**.
- الاسم: `STRIPE_SECRET_KEY`
- القيمة: مفتاح Stripe الذي يبدأ بـ`sk_live_` للدفع الحقيقي.
- اختر **Encrypt** ثم Save.
- أعد النشر من صفحة Deployments.

لا تضع مفتاح Stripe داخل GitHub أو ملفات الموقع، ولا ترسله في المحادثات.

## تجربة الدفع

افتح رابط الموقع الذي ينتهي بـ`pages.dev`، واضغط على ساعة €3 ثم ادفع ببطاقة Belfius Visa.

تم ضبط 3D Secure على `automatic` حتى يسمح Stripe والبنك بالإعفاء عندما تكون العملية مؤهلة. لا يستطيع الموقع ضمان عدم طلب تأكيد من Belfius؛ القرار النهائي يبقى للبنك.
