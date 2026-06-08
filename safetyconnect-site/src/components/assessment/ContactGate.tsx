import { useState } from "react";
import RadioQuestion from "./RadioQuestion";
import type { OrgProfile} from "./AssessmentData";
import { INITIAL_ORG_PROFILE } from "./AssessmentData";

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  org: OrgProfile;
}

interface Props {
  initialOrg?: OrgProfile;
  onSubmit: (details: ContactDetails) => void;
  onCancel: () => void;
}

const ContactGate = ({ initialOrg = INITIAL_ORG_PROFILE, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState<OrgProfile>(initialOrg);
  const [showErrors, setShowErrors] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = /^[+\d][\d\s-]{6,}$/.test(phone.trim());
  const valid =
    name.trim().length > 1 &&
    emailValid &&
    phoneValid &&
    org.companyName.trim().length > 0 &&
    !!org.industry &&
    !!org.employees &&
    !!org.designation &&
    !!org.vehicles;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setShowErrors(true);
      return;
    }
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      org: {
        ...org,
        companyName: org.companyName.trim(),
        sites: org.sites.trim(),
        name: name.trim(),      // ADD THIS
        email: email.trim(),    // ADD THIS
        phone: phone.trim(),    // ADD THIS
      },
    });
  };

  const updateOrg = (partial: Partial<OrgProfile>) => setOrg((p) => ({ ...p, ...partial }));
  const fieldClass =
    "w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 font-medium text-sm sm:text-base text-center">
          Get Your Detailed Safety Report
        </div>
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            Enter your contact and organisation details to unlock your personalised report with prioritised action items.
          </p>

          {/* Contact Section */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Contact Details
            </h3>

            <div className="space-y-2">
              <label className="font-medium text-sm">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
                placeholder="Your full name"
              />
              {showErrors && name.trim().length < 2 && (
                <p className="text-destructive text-xs">Please enter your name</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">
                Work Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                placeholder="name@company.com"
              />
              {showErrors && !emailValid && (
                <p className="text-destructive text-xs">Enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
                placeholder="+91 98765 43210"
              />
              {showErrors && !phoneValid && (
                <p className="text-destructive text-xs">Enter a valid phone number</p>
              )}
            </div>
          </div>

          {/* Organisation Profile */}
          <div className="space-y-5 pt-2 border-t">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground pt-4">
              Organisation Profile
            </h3>

            <div className="space-y-2">
              <label className="font-medium text-sm">
                Company Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={org.companyName}
                onChange={(e) => updateOrg({ companyName: e.target.value })}
                className={fieldClass}
                placeholder="Enter your company name"
              />
              {showErrors && !org.companyName.trim() && (
                <p className="text-destructive text-xs">This field is required</p>
              )}
            </div>

            <RadioQuestion
              label="Industry"
              required
              options={["Manufacturing", "Construction", "Logistics/Transport", "Oil and Gas", "Utilities", "Warehousing", "Facility Management", "Other"]}
              value={org.industry}
              onChange={(v) => updateOrg({ industry: v })}
              showError={showErrors}
            />

            <RadioQuestion
              label="Number of Employees"
              required
              options={["Less than 100", "100 - 500", "500 - 1000", "1000 - 5000", "More than 5000"]}
              value={org.employees}
              onChange={(v) => updateOrg({ employees: v })}
              showError={showErrors}
            />

            <div className="space-y-2">
              <label className="font-medium text-sm">Number of operational sites / branches</label>
              <input
                type="text"
                value={org.sites}
                onChange={(e) => updateOrg({ sites: e.target.value })}
                className={fieldClass}
                placeholder="Enter number"
              />
            </div>

            <RadioQuestion
              label="Respondent designation"
              required
              options={["Safety Head / HSE Manager", "Operations Manager", "Plant / Site Manager", "HR / L&D", "Business Head", "Safety Officer / Engineer", "Other"]}
              value={org.designation}
              onChange={(v) => updateOrg({ designation: v })}
              showError={showErrors}
            />

            <RadioQuestion
              label="Does your organization operate vehicles as part of business operations?"
              required
              options={["Yes", "No"]}
              value={org.vehicles}
              onChange={(v) => updateOrg({ vehicles: v })}
              showError={showErrors}
            />
          </div>

          <div className="flex justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm border border-input hover:bg-muted"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm bg-next-btn text-accent-foreground hover:opacity-90"
            >
              View Detailed Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactGate;
