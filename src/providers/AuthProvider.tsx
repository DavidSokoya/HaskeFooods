import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js";
import {supabase }from '@/lib/supabase'


type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
  isAdmin: boolean;
};
const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
})


const AuthProvider = ({children}: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    const fetchSession = async () => {
      const {data: {session}} = await supabase.auth.getSession()
      setSession(session);
      if (session) {
        // fetch profile
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data || null);
      };
      setLoading(false);
    };
    fetchSession()
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [])
  
  console.log(profile)
  return (
    <AuthContext.Provider value={{session, loading, profile, isAdmin: profile?.group === "ADMIN"}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext)