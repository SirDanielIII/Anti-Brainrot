import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyB9y02AMzPkSduuZE3kjaYS5nP2C5Z9GQk";
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function get_subtasks_from_goal(goal) {
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

export async function get_next_goal_from_subtasks(subtasks) {
  let prompt = `Given the sequence of steps:\n${subtasks.join('\n')}\n\nCreate the next task in the sequence. Your reply should not end with punctiation.`;
  console.log(prompt);
  let result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text().trim();
}

export async function is_website_work_related(goal, site_metadata) {
  let prompt = `Given the goal: ${goal}, and the metadata for a site: ${site_metadata},
        determine if the site is work related. Reply with either 'yes' or 'no'`;
  let result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text().trim().toLowerCase() === "yes";
}