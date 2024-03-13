import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OpportunityPreparationPage() {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Details</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="opportunityOwner">Opportunity Owner</Label>
          <Input id="opportunityOwner" value="Space Force" />
        </div>
        <div>
          <Label htmlFor="private">Private</Label>
          <Input
            id="private"
            value="This opportunity will be visible only to you"
          />
        </div>
        <div>
          <Label htmlFor="opportunityName">Opportunity Name</Label>
          <Input
            id="opportunityName"
            value="5G Distributed Cyber Attack Network"
          />
        </div>
        <div>
          <Label htmlFor="accountName">Account Name</Label>
          <Input id="accountName" value="CDMO" />
        </div>
        <div>
          <Label htmlFor="agencyCustomer">Agency Customer</Label>
          <Input id="agencyCustomer" value="Air Force Research Lab" />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input id="type" value="Tradewind" />
        </div>
      </div>
    </>
  );
}
