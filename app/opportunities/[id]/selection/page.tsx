import { Separator } from "@/components/ui/separator";
// import { AccountForm } from "@/app/examples/forms/account/account-form";

export default function OpportunitySelectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Selection</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      {/* <AccountForm /> */}
    </div>
  );
}
