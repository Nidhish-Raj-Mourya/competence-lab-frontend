import { Link } from 'react-router-dom'

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 48px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#185FA5',
  },
  links: {
    display: 'flex',
    gap: '32px',
    listStyle: 'none',
  },
  link: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
  },
  btn: {
    background: '#185FA5',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  }
}

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Competence Lab</div>
      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/roadmap" style={styles.link}>Roadmap</Link></li>
        <li><Link to="/tests" style={styles.link}>Tests</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
      </ul>
      <button style={styles.btn}>Get Started</button>
    </nav>
  )
}

export default Navbar