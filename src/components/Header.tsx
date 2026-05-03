import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="header">
      <h1 className="header-title">X風</h1>
      {user && (
        <div className="header-right">
          <span className="header-email">{user.email}</span>
          <button className="btn btn-outline" onClick={handleLogout}>ログアウト</button>
        </div>
      )}
    </header>
  )
}
