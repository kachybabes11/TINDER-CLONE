import mongoose from "mongoose";
import dns from "node:dns"
import "dotenv/config"
import User from "../models/user.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"])

const DEFAULT_PASSWORD = "Password123!";

const profiles = [
  {
    name: "Amara Okafor",
    email: "amara.okafor@example.com",
    age: 24,
    gender: "Female",
    interestedIn: "Male",
    bio: "Soft life enthusiast. I love good food, spontaneous road trips and conversations that last until 3am.",
    image: "https://i.pravatar.cc/500?img=47",
  },
  {
    name: "Daniel Brooks",
    email: "daniel.brooks@example.com",
    age: 27,
    gender: "Male",
    interestedIn: "Female",
    bio: "Software engineer by day, amateur chef by night. Looking for someone to explore the world with.",
    image: "https://i.pravatar.cc/500?img=12",
  },
  {
    name: "Zara Williams",
    email: "zara.williams@example.com",
    age: 22,
    gender: "Female",
    interestedIn: "Both",
    bio: "Art, music, fashion and everything in between. Let's get lost in a bookstore.",
    image: "https://i.pravatar.cc/500?img=44",
  },
  {
    name: "Michael Carter",
    email: "michael.carter@example.com",
    age: 29,
    gender: "Male",
    interestedIn: "Female",
    bio: "Gym, football, travelling and discovering hidden food spots. Bonus points if you love dogs.",
    image: "https://i.pravatar.cc/500?img=13",
  },
  {
    name: "Chiamaka Eze",
    email: "chiamaka.eze@example.com",
    age: 25,
    gender: "Female",
    interestedIn: "Male",
    bio: "Big on intentional connections, good music and trying restaurants I've never heard of.",
    image: "https://i.pravatar.cc/500?img=49",
  },
  {
    name: "Ethan Miller",
    email: "ethan.miller@example.com",
    age: 26,
    gender: "Male",
    interestedIn: "Female",
    bio: "Photographer, coffee addict and weekend traveller. Show me your favourite sunset spot.",
    image: "https://i.pravatar.cc/500?img=14",
  },
  {
    name: "Nneka Johnson",
    email: "nneka.johnson@example.com",
    age: 23,
    gender: "Female",
    interestedIn: "Male",
    bio: "A little chaotic, very ambitious. I enjoy dancing, movies and making memories.",
    image: "https://i.pravatar.cc/500?img=45",
  },
  {
    name: "Noah Anderson",
    email: "noah.anderson@example.com",
    age: 28,
    gender: "Male",
    interestedIn: "Both",
    bio: "Introvert until you mention music or football. Looking for genuine vibes.",
    image: "https://i.pravatar.cc/500?img=15",
  },
  {
    name: "Tomi Adeyemi",
    email: "tomi.adeyemi@example.com",
    age: 26,
    gender: "Female",
    interestedIn: "Male",
    bio: "Book lover, foodie and aspiring world traveller. I will probably steal your fries.",
    image: "https://i.pravatar.cc/500?img=48",
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    age: 30,
    gender: "Male",
    interestedIn: "Female",
    bio: "Entrepreneur with a soft spot for old-school romance. Let's make ordinary days special.",
    image: "https://i.pravatar.cc/500?img=11",
  },
  {
    name: "Adaeze Obi",
    email: "adaeze.obi@example.com",
    age: 21,
    gender: "Female",
    interestedIn: "Both",
    bio: "Creative soul. I love concerts, beach days and people who don't take themselves too seriously.",
    image: "https://i.pravatar.cc/500?img=46",
  },
  {
    name: "Lucas Thompson",
    email: "lucas.thompson@example.com",
    age: 25,
    gender: "Male",
    interestedIn: "Female",
    bio: "Fitness enthusiast, gamer and occasional terrible dancer. Let's see where this goes.",
    image: "https://i.pravatar.cc/500?img=16",
  },
  {
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    age: 27,
    gender: "Female",
    interestedIn: "Male",
    bio: "I appreciate thoughtful gestures, deep conversations and a really good playlist.",
    image: "https://i.pravatar.cc/500?img=43",
  },
  {
    name: "David Robinson",
    email: "david.robinson@example.com",
    age: 24,
    gender: "Male",
    interestedIn: "Female",
    bio: "Music producer, football fan and lover of spontaneous adventures.",
    image: "https://i.pravatar.cc/500?img=17",
  },
  {
    name: "Bisi Akinola",
    email: "bisi.akinola@example.com",
    age: 28,
    gender: "Female",
    interestedIn: "Male",
    bio: "Career-driven but never too busy for good company. I love travelling and trying new cuisines.",
    image: "https://i.pravatar.cc/500?img=41",
  },
  {
    name: "Alexander Reed",
    email: "alex.reed@example.com",
    age: 31,
    gender: "Male",
    interestedIn: "Female",
    bio: "Architect who appreciates beautiful spaces, beautiful minds and beautiful experiences.",
    image: "https://i.pravatar.cc/500?img=18",
  },
  {
    name: "Fatima Bello",
    email: "fatima.bello@example.com",
    age: 23,
    gender: "Female",
    interestedIn: "Male",
    bio: "Lover of sunsets, poetry and meaningful connections. Let's exchange playlists.",
    image: "https://i.pravatar.cc/500?img=42",
  },
  {
    name: "Ryan Mitchell",
    email: "ryan.mitchell@example.com",
    age: 27,
    gender: "Male",
    interestedIn: "Both",
    bio: "Adventure seeker. Hiking, swimming and finding new places are my favourite things.",
    image: "https://i.pravatar.cc/500?img=19",
  },
  {
    name: "Kemi Balogun",
    email: "kemi.balogun@example.com",
    age: 25,
    gender: "Female",
    interestedIn: "Male",
    bio: "Fashion girl with an unhealthy love for dessert. Looking for someone who can make me laugh.",
    image: "https://i.pravatar.cc/500?img=40",
  },
  {
    name: "Benjamin Scott",
    email: "ben.scott@example.com",
    age: 29,
    gender: "Male",
    interestedIn: "Female",
    bio: "Lawyer, amateur footballer and a fan of spontaneous weekend plans.",
    image: "https://i.pravatar.cc/500?img=20",
  },
  {
    name: "Ifeoma Nwosu",
    email: "ifeoma.nwosu@example.com",
    age: 24,
    gender: "Female",
    interestedIn: "Both",
    bio: "Music is my love language. Concerts, road trips and random adventures welcome.",
    image: "https://i.pravatar.cc/500?img=39",
  },
  {
    name: "Christopher Evans",
    email: "chris.evans@example.com",
    age: 26,
    gender: "Male",
    interestedIn: "Female",
    bio: "Tech guy who enjoys cooking, travelling and learning something new every day.",
    image: "https://i.pravatar.cc/500?img=21",
  },
  {
    name: "Maya Thompson",
    email: "maya.thompson@example.com",
    age: 22,
    gender: "Female",
    interestedIn: "Male",
    bio: "Sunshine mixed with a little sarcasm. I love photography, coffee and dancing.",
    image: "https://i.pravatar.cc/500?img=38",
  },
  {
    name: "Samuel Clark",
    email: "sam.clark@example.com",
    age: 32,
    gender: "Male",
    interestedIn: "Female",
    bio: "Business owner. I value honesty, consistency and people who are comfortable being themselves.",
    image: "https://i.pravatar.cc/500?img=22",
  },
  {
    name: "Tolu Martins",
    email: "tolu.martins@example.com",
    age: 27,
    gender: "Female",
    interestedIn: "Male",
    bio: "Interior design, good food and spontaneous trips. I believe laughter makes everything better.",
    image: "https://i.pravatar.cc/500?img=37",
  },
  {
    name: "Nathan Cooper",
    email: "nathan.cooper@example.com",
    age: 23,
    gender: "Male",
    interestedIn: "Both",
    bio: "Student, gamer and music lover. Always down for an adventure or a movie marathon.",
    image: "https://i.pravatar.cc/500?img=23",
  },
  {
    name: "Grace Ojo",
    email: "grace.ojo@example.com",
    age: 30,
    gender: "Female",
    interestedIn: "Male",
    bio: "A woman with goals and a soft heart. I love travel, good conversations and intentional people.",
    image: "https://i.pravatar.cc/500?img=36",
  },
  {
    name: "Matthew Hall",
    email: "matt.hall@example.com",
    age: 28,
    gender: "Male",
    interestedIn: "Female",
    bio: "Sports, fitness and exploring new restaurants. I make a pretty good breakfast too.",
    image: "https://i.pravatar.cc/500?img=24",
  },
  {
    name: "Zainab Musa",
    email: "zainab.musa@example.com",
    age: 26,
    gender: "Female",
    interestedIn: "Both",
    bio: "Creative, curious and always learning. Looking for someone to share experiences with.",
    image: "https://i.pravatar.cc/500?img=35",
  },
  {
    name: "Andrew Baker",
    email: "andrew.baker@example.com",
    age: 25,
    gender: "Male",
    interestedIn: "Female",
    bio: "Music festival enthusiast, football fan and lover of spontaneous adventures.",
    image: "https://i.pravatar.cc/500?img=25",
  },
  {
    name: "Sarah James",
    email: "sarah.james@example.com",
    age: 29,
    gender: "Female",
    interestedIn: "Male",
    bio: "I love meaningful conversations, weekend getaways and discovering hidden gems.",
    image: "https://i.pravatar.cc/500?img=34",
  },
  {
    name: "Joseph Morgan",
    email: "joseph.morgan@example.com",
    age: 27,
    gender: "Male",
    interestedIn: "Female",
    bio: "Doctor by profession, comedian by personality. Looking for someone genuine.",
    image: "https://i.pravatar.cc/500?img=26",
  },
  {
    name: "Rita Ekanem",
    email: "rita.ekanem@example.com",
    age: 24,
    gender: "Female",
    interestedIn: "Male",
    bio: "Beach lover, travel addict and hopeless romantic. I appreciate the little things.",
    image: "https://i.pravatar.cc/500?img=33",
  },
  {
    name: "William Foster",
    email: "will.foster@example.com",
    age: 30,
    gender: "Male",
    interestedIn: "Both",
    bio: "Photographer and creative director. I enjoy art, culture and exploring different perspectives.",
    image: "https://i.pravatar.cc/500?img=27",
  },
  {
    name: "Damilola James",
    email: "dami.james@example.com",
    age: 23,
    gender: "Female",
    interestedIn: "Male",
    bio: "A little bit of everything: fashion, food, movies and spontaneous adventures.",
    image: "https://i.pravatar.cc/500?img=32",
  },
  {
    name: "Joshua Perry",
    email: "josh.perry@example.com",
    age: 24,
    gender: "Male",
    interestedIn: "Female",
    bio: "Music lover and football enthusiast. I believe the best relationships start with friendship.",
    image: "https://i.pravatar.cc/500?img=28",
  },
  {
    name: "Victoria Cole",
    email: "victoria.cole@example.com",
    age: 31,
    gender: "Female",
    interestedIn: "Male",
    bio: "Independent, ambitious and always looking for my next adventure. Let's make memories.",
    image: "https://i.pravatar.cc/500?img=31",
  },
  {
    name: "Daniel Foster",
    email: "dan.foster@example.com",
    age: 22,
    gender: "Male",
    interestedIn: "Both",
    bio: "University student, aspiring entrepreneur and lover of good music.",
    image: "https://i.pravatar.cc/500?img=29",
  },
  {
    name: "Esther Chukwu",
    email: "esther.chukwu@example.com",
    age: 28,
    gender: "Female",
    interestedIn: "Male",
    bio: "Foodie, traveller and lover of thoughtful conversations. Good energy only.",
    image: "https://i.pravatar.cc/500?img=30",
  },
  {
    name: "Oliver Hayes",
    email: "oliver.hayes@example.com",
    age: 33,
    gender: "Male",
    interestedIn: "Female",
    bio: "Entrepreneur, fitness enthusiast and lover of simple pleasures. Let's explore life together.",
    image: "https://i.pravatar.cc/500?img=51",
  },
  {
    name: "Deborah Frank",
    email: "deborah.frank@example.com",
    age: 25,
    gender: "Female",
    interestedIn: "Both",
    bio: "A creative mind with a soft spot for art, music and spontaneous plans.",
    image: "https://i.pravatar.cc/500?img=52",
  },
  {
    name: "Isaac Turner",
    email: "isaac.turner@example.com",
    age: 29,
    gender: "Male",
    interestedIn: "Female",
    bio: "Engineer, traveller and amateur chef. Let's find the best jollof rice in town.",
    image: "https://i.pravatar.cc/500?img=53",
  },
  {
    name: "Precious Nnamdi",
    email: "precious.nnamdi@example.com",
    age: 21,
    gender: "Female",
    interestedIn: "Male",
    bio: "I love fashion, photography and spending time with people who make me laugh.",
    image: "https://i.pravatar.cc/500?img=54",
  },
  {
    name: "Gabriel King",
    email: "gabriel.king@example.com",
    age: 26,
    gender: "Male",
    interestedIn: "Female",
    bio: "Avid reader, gym enthusiast and fan of deep conversations over coffee.",
    image: "https://i.pravatar.cc/500?img=55",
  },
  {
    name: "Michelle Adams",
    email: "michelle.adams@example.com",
    age: 27,
    gender: "Female",
    interestedIn: "Both",
    bio: "Life is too short for boring conversations. Let's laugh, travel and try new things.",
    image: "https://i.pravatar.cc/500?img=56",
  },
];

export const seedUsers = async () => {
  try {
    const users = profiles.map((profile) => ({
      ...profile,
      password: DEFAULT_PASSWORD,
    }));

    // Avoid duplicate email errors when running the seed more than once.
    const operations = users.map((user) => ({
      updateOne: {
        filter: { email: user.email },
        update: {
          $setOnInsert: user,
        },
        upsert: true,
      },
    }));

    const result = await User.bulkWrite(operations);

    console.log("User seeding completed!");
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Already existed: ${result.matchedCount}`);
    console.log(`Total profiles provided: ${profiles.length}`);
  } catch (error) {
    console.error("User seeding failed:", error);
    throw error;
  }
};

const runSeed = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected!");

    await seedUsers();

    console.log("Seeding finished successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

runSeed();