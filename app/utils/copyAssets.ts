import * as path from "path";
import * as shell from "shelljs";

// Copy views folder ( email templates )
const viewsSrc = path.resolve(__dirname, "../views");
const viewsDest = path.resolve(__dirname, "../../dist/app");

shell.mkdir("-p", viewsDest);
shell.cp("-R", viewsSrc, viewsDest);

// Copy locales ( translations )
const localesSrc = path.resolve(__dirname, "../locales");
const localesDest = path.resolve(__dirname, "../../dist/app");

shell.mkdir("-p", localesDest);
shell.cp("-R", localesSrc, localesDest);

console.log("Build successful");