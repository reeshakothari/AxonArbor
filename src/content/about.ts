import type { AboutContent, ImageAsset } from "./types";

const portrait = (file: string, name: string): ImageAsset => ({
  src: `/people/${file}.webp`,
  alt: `Portrait of ${name}`,
  width: 480,
  height: 600,
});

export const about: AboutContent = {
  meta: {
    title: "About Us",
    description:
      "Founded by Richa Singh, Axon Arbor brings together senior advisors, specialist facilitators and global assessment and speaker partners.",
    path: "/about",
  },

  header: {
    eyebrow: "About us",
    heading: "Always have your ear to the ground.",
    lede: "A founder with two decades inside complex organisations, senior HR leaders as advisors, and a network of specialists who have spent years honing their craft.",
  },

  founder: {
    eyebrow: "Founder’s story",
    heading: "Paying two decades of learning forward",
    paragraphs: [
      "More than 20 years of building learning initiatives across complex organisations revealed what drives performance, and what quietly limits it.",
      "Axon Arbor was founded to pay that learning forward: applying experience with intent to build capability, close performance gaps and deliver measurable impact on how people perform and how businesses grow.",
      "Richa’s journey through diverse industries and organisational contexts has given her a distinctive lens for spotting the hidden barriers to performance, and the untapped opportunities for growth.",
    ],
    name: "Richa Singh",
    role: "Founder, Axon Arbor",
    image: {
      src: "/people/richa.webp",
      alt: "Portrait of Richa Singh, founder of Axon Arbor",
      width: 640,
      height: 800,
    },
  },

  advisors: {
    eyebrow: "Our advisors",
    heading: "Counsel from the top of the profession",
    people: [
      {
        name: "Suresh Tripathi",
        bio: "With over 40 years of experience at Tata Steel, SRF, Air India, Sri Educare, SAIL, HCL Perot and Mascon Global, Suresh is a respected leader in the fraternity. He serves as an Independent Director on the boards of several companies and educational institutions.",
        image: portrait("suresh", "Suresh Tripathi"),
      },
      {
        name: "Shailesh Singh",
        bio: "A pre-eminent HR leader with 30 years of shaping world-class people agendas and organisational culture. He is Chief People Officer of Axis Max Life Insurance, and previously worked with GE Energy, GE Electric, GE Capital, SRF Finance, Eicher Tractors and the National Dairy Development Board, strengthening HR processes and strategy across India, Africa and the Middle East.",
        image: portrait("shailesh", "Shailesh Singh"),
      },
      {
        name: "Vikas Baijal",
        bio: "Over 36 years of HR experience across retail, consumer services, technology and hospitality, with exposure across the US, Europe, Asia and Africa; his last corporate role was CHRO for Bata’s India and South Asia operations. An ICF-PCC credentialed leadership and executive coach, Vikas works with CXOs, emerging leaders and high-potential talent on personal effectiveness, career transitions, strategic thinking and influence.",
        image: portrait("vikas", "Vikas Baijal"),
      },
    ],
  },

  facilitators: {
    eyebrow: "Our network of facilitators",
    heading: "Dedicated professionals driving your success",
    people: [
      {
        name: "Swati Adhikary",
        role: "Design Thinking & Innovation",
        bio: "Swati brings deep HR leadership experience from Mphasis, HP, Birlasoft, Syntel (Atos) and Spice Group, where she was Group CHRO. As a Design Thinking specialist she has worked with Decathlon, Lilly, Nestlé, Tata Motors, Axis Max Life, YES Bank and many more across India, Africa, the UK and the US.",
        image: portrait("swati", "Swati Adhikary"),
      },
      {
        name: "Vipul Jain",
        role: "Gen AI",
        bio: "Technology is a humbling tool that, used well, can transform the most complex processes. With more than 200 corporate deliveries across technology and leadership, Vipul runs Gen AI workshops across APAC, South America and Africa.",
        image: portrait("vipul", "Vipul Jain"),
      },
      {
        name: "Vikram Nandwani",
        role: "Communications & HR Branding",
        bio: "Vikram works at the intersection of transformation, communication and visual thinking. With over 25 years of experience, including more than a decade leading an internal communications and HR branding studio, he uses visual storytelling to help organisations build, share and execute strategy. Clients include Infosys, Bajaj Finserv, Axis Max Life, Mphasis and Medline India.",
        image: portrait("vikram", "Vikram Nandwani"),
      },
      {
        name: "R. SreeKumar",
        role: "Behavioural Training",
        bio: "A senior consultant with 26 years of experience and 149 clients to date, SreeKumar is a natural storyteller. He is passionate about Humanocracy, heart-centred servant leadership, influencing and behavioural economics, NLP and the Pygmalion effect.",
        image: portrait("sreekumar", "R. SreeKumar"),
      },
      {
        name: "Vineet Saraiwala",
        role: "Disability Inclusion",
        bio: "Vineet is the founder of Atypical Advantage, a platform for people with disabilities to showcase their talent. He specialises in accessibility, policy design and inclusion programmes.",
        image: portrait("vineet", "Vineet Saraiwala"),
      },
      {
        name: "Rupinder Kaur",
        role: "Executive Coaching",
        bio: "A seasoned coach who runs her own coaching training institute in Pune, Rupinder specialises in executive coaching for senior leaders.",
      },
    ],
  },

  partners: {
    eyebrow: "Our partners",
    heading: "Global tools and voices, locally delivered",
    items: [
      {
        kind: "Assessment partner",
        name: "Strengthscape",
        paragraphs: [
          "Applied to learning, assessments provide feedback and insight that improve both job performance and the way we teach.",
          "Strengthscape has worked with leading brands including Aditya Birla, Adani, Amazon, Dell, Glenmark, Citi, EY and Tata Power, and is the official India partner for:",
        ],
        list: [
          "The Five Behaviors of a Cohesive Team assessment",
          "Evalax Solutions: leadership assessment tools, 360 assessments and culture surveys",
          "Everything DiSC: Workplace, For Leaders, For Sales and Agile EQ",
        ],
        logo: {
          src: "/partners/strengthscape.png",
          alt: "Strengthscape",
          width: 637,
          height: 187,
        },
      },
      {
        kind: "Speakers partner",
        name: "London Speaker Bureau India",
        paragraphs: [
          "London Speaker Bureau is a curated global network of leading CEOs, board members, authors, economists, sportspeople, celebrities, subject-matter experts and thought leaders. Together we curate speaker engagements aligned with your strategic learning and business objectives.",
          "Its focus areas include keynote speakers, executive masterclasses, boardroom advisory and brand collaborations.",
        ],
        stats: [
          { value: "45,000+", label: "engagements delivered" },
          { value: "10,000+", label: "organisations worldwide" },
        ],
        logo: {
          src: "/partners/london-speakers-bureau.webp",
          alt: "London Speaker Bureau India",
          width: 600,
          height: 600,
        },
      },
    ],
  },

  cta: {
    heading: "Meet the people behind the work.",
    body: "Tell us what you’re trying to change. We’ll match the right specialists to your brief.",
    cta: { label: "Schedule a Consultation", href: "/contact" },
  },
};
