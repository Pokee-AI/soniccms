import { Button, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";


export const OTPEmail= ( data ) => (
  <EmailLayout preview="Let's get your email confirmed!" baseUrl={data.baseUrl}>
    <Text style={paragraph}>Hi {data.firstName},</Text>
    <Text style={paragraph}>Please find your one-time password below:</Text>
    <Text style={otp}>{data.otp ?? "ABC123"} </Text>

    <Text style={paragraph}>
      Your one-time password will expire in {data.expirationTime}.
    </Text>
    <hr style={hr} />
    <Text style={paragraph}>
      Didn't request this? Please ignore this email.
    </Text>
    <hr style={hr} />
    <Text style={paragraph}>— The SonicJs team</Text>
  </EmailLayout>
);

export default OTPEmail;

// Styles for the unique content
const paragraph = {
  color: "#171717",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  fontFamily:
    "Gabarito, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const otp = {
  color: "#ffffff",
  fontSize: "46px",
  lineHeight: "48px",
  textAlign: "center" as const,
  backgroundColor: "#171717",
  padding: "40px",
  margin: "60px",
  borderRadius: "8px",
  fontFamily:
    "Gabarito, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
};
const anchor = {
  color: "#784cd9",
};

const hr = {
  borderColor: "#e8e8e8",
  margin: "20px 0",
};

const button = {
  backgroundColor: "#171717",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "10px",
  fontFamily:
    "Gabarito, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
};
