import { PrivacyPolicy, TermsAndConditions } from "@/components/legal";
import TabContainer from "@/components/ui/tab-container";

export default function PrivacyPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Legal Documents</h1>
        
        <TabContainer 
          tabs={[
            { id: 'privacy', label: 'Privacy Policy', content: <PrivacyPolicy /> },
            { id: 'terms', label: 'Terms and Conditions', content: <TermsAndConditions /> }
          ]}
        />
      </div>
    );
  }