// app/signin/page.tsx (Server Component)
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/constants';
import SigninForm from './form';

export default async function SignInPage() {
    const session = cookies().get(SESSION_COOKIE_NAME)?.value || null;

    return (
        <SigninForm session={session} />
    );
}
