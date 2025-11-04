import { Redirect } from 'expo-router';

export default function Index() {
  // Check if user is logged in - for now redirect to login
  const isLoggedIn = false;
  
  if (isLoggedIn) {
    return <Redirect href="/(main)/dashboard" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
