import {
  Button,
  Link,
  Text,
} from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';

export const WelcomeEmail = ({ data }) => (
  <EmailLayout preview="You're now ready to login to SonicJs!">
    <Text style={paragraph}>
      Hi {data.firstName},<br /><br />
      Thanks for submitting your account information. You're now ready to
      login to SonicJs!
    </Text>
    <Button style={button} href="https://sonicjs.com/login">
      Login to SonicJs
    </Button>
    <Text style={paragraph}>
      If you haven't already {' '}
      <Link style={anchor} href="https://sonicjs.com/docs">
      reviewed the docs
      </Link>{' '}
      , you might find them handy.
    </Text>
    <Text style={paragraph}>— The SonicJs team</Text>
  </EmailLayout>
);

export default WelcomeEmail;

// Styles for the unique content
const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const anchor = {
  color: '#556cd6',
};

const button = {
  backgroundColor: '#656ee8',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '10px',
};