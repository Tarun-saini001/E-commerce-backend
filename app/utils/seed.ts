import bcrypt from "bcrypt";
import User from "@app/modules/onboarding/models/user";
import { ROLES } from "@app/config/constants";

export const seedData = async () => {
    try {

        const hashPassword = async (password: string) => {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        };

        const users = [
            {
                fullName: "Demo User",
                email: "user@yopmail.com",
                countryCode: "+1",
                phone: "9876543210",
                password: await hashPassword("Test@123"),
                role: ROLES.USER,
                isEmailVerified: true,
                isPasswordSet: true
            },
            {
                fullName: "Demo Admin",
                email: "admin@yopmail.com",
                countryCode: "+91",
                phone: "9876543201",
                password: await hashPassword("Test@123"),
                role: ROLES.ADMIN,
                isEmailVerified: true,
                isPasswordSet: true
            },
        ];

        for (const user of users) {
            await User.updateOne(
                { email: user.email },
                { $set: user },
                { upsert: true, new: true }
            );
        }

        console.log("Seeded successfully!");

    } catch (error) {
        console.error("Error seeding users:", error);
    }
};
