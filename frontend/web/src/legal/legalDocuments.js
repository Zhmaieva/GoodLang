export const PRIVACY_POLICY_SECTIONS = [
    {
        title: "Personal Data",
        paragraphs: [
            "We store only the personal data necessary for the proper functioning of the application. Such data includes the user’s email address and the results of answers to tasks, including: scores, completion time, and grammar rule codes. We do not store the full text of user answers.",
            "We also reserve the right to collect additional analytical and technical metadata in order to improve service quality, optimize application performance, and develop new features.",
            "Processing of users’ personal data is carried out in accordance with the applicable legislation of Ukraine, as well as the General Data Protection Regulation (GDPR) of the European Union where applicable.",
        ],
    },
    {
        title: "Deletion of Personal Data",
        paragraphs: [
            "Upon the user’s request, we may completely delete all personal data stored on our servers related to that user. This includes the user’s email address, service usage history, task answer results (scores, completion time, and grammar rule codes), analytical and technical metadata, as well as any other information directly or indirectly related to that user.",
            "To delete personal data, the user must contact us via email.",
        ],
    },
    {
        title: "Payments and Third-Party Services",
        paragraphs: [
            "To process payments, we use the third-party payment service Stripe. We transfer only the user’s email address to Stripe and are not responsible for how Stripe processes this information.",
            "Other data that Stripe may collect on its payment page is governed by Stripe’s own policies and does not fall under the Terms of Use of this application.",
            "Subscription management, payment processing, and charges are governed by the Stripe payment service. We do not directly control payment operations and are not responsible for technical aspects of Stripe’s operation.",
        ],
    },
    {
        title: "Notifications",
        paragraphs: [
            "We reserve the right to send users emails necessary for the operation of the service, including login confirmations, service notifications, and notifications about changes to the Terms of Use.",
            "We may also send marketing and informational emails about service updates. You can opt out of marketing and non-essential informational emails by clicking the corresponding link in one of these emails or by contacting us at goodlang.app@gmail.com.",
        ],
    },
    {
        title: "Cookie Policy",
        paragraphs: [
            "We use only essential cookies required for secure authentication and payment processing. These cookies are necessary for the proper functioning of the website and cannot be disabled. We also use analytical cookies to improve the service, which you can decline before they are set.",
        ],
    },
    {
        title: "Changes to the Policy",
        paragraphs: [
            "We reserve the right to modify these Terms of Use. In the event of significant changes, we undertake to notify the user by email using the email address provided during registration.",
        ],
    },
    {
        title: "Contact Information",
        paragraphs: [
            "All official communication regarding the use of the service is conducted via email: goodlang.app@gmail.com",
        ],
    },
];

export const TERMS_OF_SERVICE_SECTIONS = [
    {
        title: "1. General Provisions",
        paragraphs: [
            "GoodLang, “we”, “the service” — an online platform for learning English through translation with instant AI feedback, provided under the GoodLang brand and operated by its owners.",
            "User, “you” — an individual who accesses the GoodLang service, registers for it, or uses its functionality regardless of whether a paid subscription is active.",
            "Subscription — paid access to extended functionality of the GoodLang service under the terms described in these rules.",
            "By using the GoodLang service, you confirm that you have read these Terms of Use and agree to them. If you do not agree with these terms, please stop using the service.",
        ],
    },
    {
        title: "2. Use of the Service",
        paragraphs: [
            "The user agrees to use the service in good faith and in accordance with its intended purpose. Abuse of the service, attempts to gain unauthorized access, automation of interactions with the application, sending spam, or intentionally interfering with the operation of the service are prohibited.",
            "The service may be used by persons who have reached the age of 18, as well as by children aged 3 and older exclusively with the consent of their parents or legal guardians. By using the service, you confirm that either: 1) you are 18 years old and use the service personally; or 2) you are the parent or legal guardian of a child using the service, or have permission to act on their behalf in relation to the child.",
        ],
    },
    {
        title: "3. Personal Data",
        paragraphs: PRIVACY_POLICY_SECTIONS[0].paragraphs,
    },
    {
        title: "4. Deletion of Personal Data",
        paragraphs: PRIVACY_POLICY_SECTIONS[1].paragraphs,
    },
    {
        title: "5. Payments and Third-Party Services",
        paragraphs: [
            ...PRIVACY_POLICY_SECTIONS[2].paragraphs,
            "Subscriptions renew automatically unless canceled before the end of the current billing cycle.",
            "Subscription management, including cancellation, is available through the appropriate link to the Stripe page within the application, as well as by contacting us via email.",
            "The user may cancel the subscription at any time at their own discretion. If the subscription is canceled, payments for the already paid period are non-refundable, but paid functionality remains available until the end of the current billing cycle.",
            "We reserve the right to change the subscription price at any time in the national currency of Ukraine — the hryvnia, which is the primary currency of the service. If payment is made in another currency, conversion is performed by the Stripe payment service, and we are not responsible for the conversion rate or any additional fees that may apply.",
            "In the event of a price change for a specific subscription, we undertake to notify users with an active subscription via email before such changes take effect.",
            "When the subscription price changes, the new price applies only from the beginning of the next billing cycle, while the price for users with an active subscription remains unchanged until the end of the current payment period.",
            "We use third-party code libraries to ensure the functioning of the product. For generating PDF documents, we use Puppeteer (Apache 2.0 License). More information: https://github.com/puppeteer/puppeteer/blob/main/LICENSE.",
        ],
    },
    {
        title: "6. Notifications",
        paragraphs: PRIVACY_POLICY_SECTIONS[3].paragraphs,
    },
    {
        title: "7. Cookie Policy",
        paragraphs: PRIVACY_POLICY_SECTIONS[4].paragraphs,
    },
    {
        title: "8. Service Availability and Refunds",
        paragraphs: [
            "We do not guarantee uninterrupted or continuous availability of the service and are not responsible for temporary unavailability of the application.",
            "Upon user request, we may review cases related to subscription cancellation or refund requests. We do not guarantee a full or partial refund. The refund amount may be less than the full billing cycle or may be denied at the discretion of the application administration.",
            "We do not provide refunds for products such as “Marathon” or other similar products with special access conditions, including cases where automatic termination of the service is specified.",
        ],
    },
    {
        title: "9. Limitation of Liability",
        paragraphs: [
            "The service is provided “as is.” We do not guarantee specific learning outcomes and are not responsible for any direct or indirect consequences resulting from the use of the service.",
        ],
    },
    {
        title: "10. Termination of Services",
        paragraphs: [
            "We reserve the right to terminate the provision of services at any time without explanation.",
            "The use of third-party tools to automate interaction with the application or intentional attempts to interfere with its operation constitute sufficient grounds to suspend access to the service for a specific user.",
        ],
    },
    {
        title: "11. Changes to the Terms of Use",
        paragraphs: PRIVACY_POLICY_SECTIONS[5].paragraphs,
    },
    {
        title: "12. Contact Information",
        paragraphs: PRIVACY_POLICY_SECTIONS[6].paragraphs,
    },
];
