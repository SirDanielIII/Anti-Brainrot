import { GoogleGenerativeAI } from "@google/generative-ai";
import { get } from "http";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//const prompt = "Explain how AI works";

//const result = await model.generateContent(prompt);
//console.log(result.response.text());

console.log(await get_subtasks_from_goal("Write a research paper on the effect of humidity within a house on mold growth"));
is_website_work_related("Write a research paper on mold growth and humidity", `ai.google.dev`)

async function get_subtasks_from_goal(goal: string) {
    const subtasks = [];
    let prompt = `Given the goal: ${goal}, list the subtasks required to achieve it. Reply with just a
        list of subtasks. Do not use any Markdown or other formatting.
        The subtasks should be created such that they will fit within a single work block of a pomodoro timer`;
    let result = await model.generateContent(prompt);
    //console.log(result.response.text());
    let subtask_list = result.response.text().split("\n");
    subtask_list = subtask_list.filter(subtask => subtask.length > 0);
    subtask_list.forEach(subtask => {
        subtasks.push(subtask);
    });
    return subtasks;
}

async function is_website_work_related(goal: string, site_metadata: string) {
    let prompt = `Given the goal: ${goal}, and the metadata for a site: ${site_metadata},
        determine if the site is work related. Reply with either 'yes' or 'no'`;
    let result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text().trim().toLowerCase() === "yes";
}
