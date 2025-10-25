import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        logo: { type: String, default: "" },
        primaryColor: { type: String, default: "#000000" },
        secondaryColor: { type: String, default: "#000000" },
    },
    { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
