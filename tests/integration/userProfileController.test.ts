// import request from "supertest";
// import { config } from "../../src/config/index";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import app from "../../src/app";

// dotenv.config();

// beforeAll(async () => {
//   await mongoose.connect(config.dbUrl);
// });

// afterAll(async () => {
//   await mongoose.disconnect();
// });

// describe("User Profile Controller Integration Tests", () => {
//   test("should create a new user profile", async () => {
//     const userProfileData = {
//       _id: "test_user_id",
//       profession: "Actor",
//       first_name: "John",
//       last_name: "Doe",
//       actual_age: "1985-05-20",
//       "Playable age": "25-34",
//       gender: "female",
//       skin_type: "#58361A",
//       preferred_roles: ["Detective", "Doctor"],
//       actor_lookalike: ["Toyin Abraham", "Funke Akindele"],
//       background_actor: "yes",
//       additional_skills: ["Singing", "Dancing"],
//       recent_projects: [
//         { project_name: "The Detective Chronicles", producer: "XYZ Studios" },
//         { project_name: "Medical Miracles", producer: "ABC Productions" }
//       ],
//       location: {
//         city: "Abule-Egba",
//         state: "Lagos",
//         country: "United States"
//       },
//       height: "6'0\"",
//       language: {
//         primary_language: "English",
//         other_languages: ["Igbo", "Yoruba"]
//       },
//       link_to_reels: ["https://example.com/reel1", "https://example.com/reel2"],
//       awards: ["Oscar Awards, Best Actor - 2020", "Grammy, Outstanding Performance - 2018"],
//       education: "MSC",
//       headshots: ["https://example.com/headshot1", "https://example.com/headshot2"],
//       film_maker_profile: "https://example.com/filmmakerprofile",
//       company_info: {
//         company_name: "ABC Studios",
//         company_email: "contact@abcstudios.com",
//         company_phone_number: "+1234567890"
//       },
//       company_location: {
//         address: "123 Ola way",
//         city: "Lekki",
//         state: "Lagos",
//         country: "Nigeria"
//       },
//       profile_picture: "https://example.com/profilepic.jpg"
//     };

//     const response = await request(app).post("/api/profile/create").send(userProfileData);

//     expect(response.status).toBe(200);

//   });

//   test("should get user profile by ID", async () => {
//     const userId = "user_id_here";

//     const response = await request(app).get(`/api/profile/get`);

//     expect(response.status).toBe(200);
//     expect(response.body.success).toBe(true);
//     expect(response.body.message).toBe("User profile retrieved successfully");
//   });
// });
// function beforeAll(arg0: () => Promise<void>) {
//   throw new Error("Function not implemented.");
// }

// function afterAll(arg0: () => Promise<void>) {
//   throw new Error("Function not implemented.");
// }

// function expect(status: any) {
//   throw new Error("Function not implemented.");
// }
