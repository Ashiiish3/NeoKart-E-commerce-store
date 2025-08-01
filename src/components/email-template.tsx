import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface VerificationObj {
  userName: string;
  emailToken: string;
}

// email template for verification
export function VerificationEmail({ userName, emailToken }: VerificationObj) {
  return (
    <Html>
      <Head />
      <Preview>Verification Code!</Preview>
      <Body>
          <Section style={{ textAlign: "left" }} >
            <Heading><b>Hello {userName}</b></Heading>
            <Text>
              This is Your Email verification code (OTP): <b>{emailToken}</b>
            </Text>
            <p>
              Do not share this code.
              If you did not request this code, please ignore this email.
            </p>
          </Section>
      </Body>
    </Html>
  );
}

export default VerificationEmail;
