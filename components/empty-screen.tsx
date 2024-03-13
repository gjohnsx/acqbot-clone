import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/external-link";
import { IconArrowRight } from "@/components/ui/icons";

const exampleMessages = [
  {
    heading: "Create a problem statement",
    message:
      "Create a problem statement for the 5G distributed cyber attack network opportunity.",
  },
];

export function EmptyScreen({
  submitMessage,
}: {
  submitMessage: (message: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 mb-4">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to my AcqBot Clone Demo!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is a demo of an interactive chat. It can show you stocks, tell
          you their prices, and even help you buy shares.
        </p>
        <p className="mb-2 leading-normal text-muted-foreground">
          View the prompt I used for the problem statement generator{" "}
          <ExternalLink href="https://github.com/gjohnsx/acqbot-clone/blob/main/app/action.tsx#L122">
            here
          </ExternalLink>
          .
        </p>
        <p className="leading-normal text-muted-foreground">Try an example:</p>
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
