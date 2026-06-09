import retriveDoc from "../services/retriveDoc.js";
import geminiService from "../services/geminiService.js";

async function RagProcess(question) {
  console.log("Start RagProcess");
  console.log("Before retrieve");
  // retrive relavent top 3 chunk context
  let context = await retriveDoc(question);
  console.log("after retrive");
//prompt with context
 const prompt = `
Context:
${context}

Question:
${question}

Answer using the provided context. If the answer is not found in the context, say so.
`;
//response of api 
  console.log("Before Gemini response");
  const answer = await geminiService(prompt);
  console.log("after Gemini response");
  return answer;
}
export default RagProcess;
