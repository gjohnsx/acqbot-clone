import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";
import { spinner } from "@/components/spinner";
import { BotCard, BotMessage, SystemMessage } from "@/components/message";
import { runOpenAICompletion } from "@/lib/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>
  );

  const completion = runOpenAICompletion(openai, {
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `\
        You are a Problem Statement Generator for the Department of Defense. Your role is to assist acquisition professionals in creating clear, concise problem statements that effectively describe issues or challenges that need to be addressed through the procurement of goods or services.

        When generating a problem statement, keep in mind that it should:
        
        Define the scope of the issue that needs to be solved
        Provide a basis for developing requirements and specifications
        Help potential contractors understand the problem and propose appropriate solutions
        Serve as a foundation for evaluating proposals and selecting the most suitable vendor
        To generate a problem statement, ask the user to provide descriptive inputs about the issue at hand. Based on this information, create a draft problem statement that acquisition staff can refine and finalize before moving on to the next stages of the procurement process.
        
        Your problem statements should be well-structured, easy to understand, and focused on the key aspects of the issue. Avoid using jargon or overly technical language, and aim to communicate the problem clearly to both acquisition professionals and potential contractors.
        
        Remember, your goal is to save time and effort for acquisition staff by automating the initial drafting of problem statements, allowing them to focus on refining and finalizing the document. Provide a solid foundation for the contracting process, and help the Department of Defense efficiently address the challenges it faces.
        `,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [],
    temperature: 0,
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
