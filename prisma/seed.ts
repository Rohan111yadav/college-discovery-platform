import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.savedCollege.deleteMany({});
  await prisma.comparison.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed default admin/test user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const testUser = await prisma.user.create({
    data: {
      email: "demo@collegehub.com",
      password: hashedPassword,
    },
  });
  console.log(`Created test user: ${testUser.email}`);

  // Seed Colleges
  const collegesData = [
    {
      name: "Indian Institute of Technology (IIT) Bombay",
      location: "Mumbai, Maharashtra",
      fees: 220000, // Annual fees in INR
      rating: 4.9,
      placements: "21.8 LPA Average",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
      description: "A premier public technical and research university located in Powai, Mumbai. Renowned globally for its engineering education, cutting-edge research, and top-tier placement opportunities. IIT Bombay is ranked among the top engineering universities globally and houses state-of-the-art incubation centres.",
      courses: {
        create: [
          { name: "B.Tech in Computer Science and Engineering", duration: "4 Years", fees: 220000 },
          { name: "B.Tech in Electrical Engineering", duration: "4 Years", fees: 220000 },
          { name: "M.Tech in Artificial Intelligence", duration: "2 Years", fees: 90000 },
          { name: "Ph.D in Machine Learning", duration: "3 Years", fees: 45000 }
        ]
      }
    },
    {
      name: "BITS Pilani (Goa Campus)",
      location: "Zuarinagar, Goa",
      fees: 550000,
      rating: 4.7,
      placements: "18.5 LPA Average",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
      description: "Birla Institute of Technology & Science, Goa Campus is one of the premium private technological universities in India. Known for its zero-attendance policy, vibrant campus life, stellar alumni network, and excellent practice school (industry internship) programs.",
      courses: {
        create: [
          { name: "B.E. in Computer Science", duration: "4 Years", fees: 550000 },
          { name: "B.E. in Electronics & Instrumentation", duration: "4 Years", fees: 520000 },
          { name: "M.E. in Software Systems", duration: "2 Years", fees: 380000 }
        ]
      }
    },
    {
      name: "Stanford University",
      location: "Stanford, California, USA",
      fees: 4800000, // INR equivalent (~$58,000 USD)
      rating: 4.9,
      placements: "145,000 USD Average",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
      description: "Located in the heart of Silicon Valley, Stanford University is one of the world's leading teaching and research institutions. Stanford is famous for its entrepreneurial character, academic excellence, proximity to tech giants, and beautiful California campus.",
      courses: {
        create: [
          { name: "B.S. in Computer Science", duration: "4 Years", fees: 4800000 },
          { name: "M.S. in Computer Science (AI Track)", duration: "2 Years", fees: 4200000 },
          { name: "Master of Business Administration (MBA)", duration: "2 Years", fees: 6200000 }
        ]
      }
    },
    {
      name: "Indian Institute of Management (IIM) Ahmedabad",
      location: "Ahmedabad, Gujarat",
      fees: 1250000,
      rating: 4.8,
      placements: "32.7 LPA Average",
      image: "https://images.unsplash.com/photo-1606761568289-447c3e645101?q=80&w=800&auto=format&fit=crop",
      description: "The pinnacle of management education in India, IIM Ahmedabad is widely regarded as one of the best business schools in the Asia-Pacific region. Known for its rigorous case-study methodology, world-class faculty, and historically unparalleled placement figures.",
      courses: {
        create: [
          { name: "Post Graduate Program in Management (PGP / MBA)", duration: "2 Years", fees: 1250000 },
          { name: "Post Graduate Program in Food & Agri-Business Management", duration: "2 Years", fees: 1100000 },
          { name: "Executive PGP in Management", duration: "1 Year", fees: 2200000 }
        ]
      }
    },
    {
      name: "Vellore Institute of Technology (VIT)",
      location: "Vellore, Tamil Nadu",
      fees: 198000,
      rating: 4.2,
      placements: "9.2 LPA Average",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
      description: "VIT is a highly ranked private research university. It is widely famous for its flexible credit system (FFCS), massive modern student housing, strong industrial tie-ups, and a remarkably diverse student body representing all parts of the country and abroad.",
      courses: {
        create: [
          { name: "B.Tech in Information Technology", duration: "4 Years", fees: 198000 },
          { name: "B.Tech in Biotechnology", duration: "4 Years", fees: 175000 },
          { name: "Master of Computer Applications (MCA)", duration: "2 Years", fees: 140000 }
        ]
      }
    },
    {
      name: "Delhi University (St. Stephen's College)",
      location: "New Delhi, Delhi",
      fees: 42000,
      rating: 4.5,
      placements: "8.4 LPA Average",
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=800&auto=format&fit=crop",
      description: "St. Stephen's College is a premier constituent college of the University of Delhi. Widely regarded for its excellent liberal arts, humanities, and science curriculum, St. Stephen's has produced some of the nation's most notable leaders, diplomats, and academics.",
      courses: {
        create: [
          { name: "B.A. (Hons) in Economics", duration: "3 Years", fees: 42000 },
          { name: "B.Sc. (Hons) in Physics", duration: "3 Years", fees: 45000 },
          { name: "M.A. in English Literature", duration: "2 Years", fees: 38000 }
        ]
      }
    }
  ];

  for (const data of collegesData) {
    const college = await prisma.college.create({ data });
    console.log(`Created college: ${college.name} with ${data.courses.create.length} courses`);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
