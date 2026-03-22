import Navbar from '../components/Navbar'

const styles = {
  hero: {
    padding: '80px 48px',
    textAlign: 'center',
    background: '#ffffff',
  },
  badge: {
    display: 'inline-block',
    background: '#E6F1FB',
    color: '#185FA5',
    fontSize: '13px',
    padding: '6px 16px',
    borderRadius: '20px',
    marginBottom: '24px',
    fontWeight: '500',
  },
  h1: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
  span: {
    color: '#185FA5',
  },
  p: {
    fontSize: '16px',
    color: '#64748b',
    maxWidth: '540px',
    margin: '0 auto 32px',
    lineHeight: '1.7',
  },
  btns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '48px',
  },
  btnPrimary: {
    background: '#185FA5',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
  },
  btnSecondary: {
    background: 'white',
    color: '#185FA5',
    border: '1.5px solid #185FA5',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
  },
  stats: {
    display: 'flex',
    gap: '48px',
    justifyContent: 'center',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#185FA5',
  },
  statLabel: {
    fontSize: '13px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  section: {
    padding: '64px 48px',
    background: '#f8fafc',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: '8px',
  },
  sectionSub: {
    fontSize: '15px',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
  },
  cardIcon: {
    fontSize: '28px',
    marginBottom: '12px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.6',
  },
  roadmap: {
    padding: '64px 48px',
    background: 'white',
    textAlign: 'center',
  },
  roadSteps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '40px',
  },
  roadBox: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px 28px',
    minWidth: '150px',
  },
  roadNum: {
    fontSize: '12px',
    color: '#185FA5',
    fontWeight: '600',
    marginBottom: '4px',
  },
  roadTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '4px',
  },
  roadDesc: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  roadArrow: {
    fontSize: '20px',
    color: '#94a3b8',
  },
  roadFinal: {
    background: '#185FA5',
    borderRadius: '12px',
    padding: '20px 28px',
    minWidth: '150px',
  },
  roadFinalText: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
  },
  roadFinalSub: {
    fontSize: '12px',
    color: '#B5D4F4',
    marginTop: '4px',
  },
  cta: {
    padding: '64px 48px',
    background: '#185FA5',
    textAlign: 'center',
  },
  ctaH2: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '12px',
  },
  ctaP: {
    fontSize: '15px',
    color: '#B5D4F4',
    marginBottom: '28px',
  },
  btnWhite: {
    background: 'white',
    color: '#185FA5',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
  },
  footer: {
    padding: '24px 48px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'white',
  },
  footerLogo: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#185FA5',
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
  },
  footerLink: {
    fontSize: '13px',
    color: '#94a3b8',
  },
}

const features = [
  { icon: '📚', title: 'Theory Notes', desc: 'Easy language mein diagrams aur illustrations ke saath samjho' },
  { icon: '💻', title: 'Coding Ground', desc: 'Live editor mein practice karo — Java, Python, C++' },
  { icon: '🏆', title: 'Mock Tests', desc: 'TCS, Infosys, Amazon style company-wise assessments' },
  { icon: '🤖', title: 'AI Buddy', desc: '24/7 doubt solving — kabhi bhi, koi bhi sawaal poochho' },
  { icon: '🎤', title: 'Mock Interviews', desc: 'AI interviewer se practice karo — instant feedback milega' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Har topic ka progress, streak aur placement readiness score' },
]

function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.badge}>
          India's Placement Platform for Tier-2/3 Engineers
        </div>
        <h1 style={styles.h1}>
          Learn. Practice.<br />
          <span style={styles.span}>Get Placed.</span>
        </h1>
        <p style={styles.p}>
          Foundation se placement tak — structured coding journey
          aur mock tests, bilkul free. Institute ke through access karo.
        </p>
        <div style={styles.btns}>
          <button style={styles.btnPrimary}>Start Learning</button>
          <button style={styles.btnSecondary}>View Roadmap</button>
        </div>
        <div style={styles.stats}>
          <div>
            <div style={styles.statNum}>685+</div>
            <div style={styles.statLabel}>Practice Problems</div>
          </div>
          <div>
            <div style={styles.statNum}>50+</div>
            <div style={styles.statLabel}>Mock Tests</div>
          </div>
          <div>
            <div style={styles.statNum}>500+</div>
            <div style={styles.statLabel}>Students</div>
          </div>
          <div>
            <div style={styles.statNum}>Free</div>
            <div style={styles.statLabel}>For Students</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Sab kuch ek jagah</div>
        <div style={styles.sectionSub}>
          Theory se coding tak — platform nahi badalna padega
        </div>
        <div style={styles.grid}>
          {features.map((f, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardIcon}>{f.icon}</div>
              <div style={styles.cardTitle}>{f.title}</div>
              <div style={styles.cardDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div style={styles.roadmap}>
        <div style={styles.sectionTitle}>Teri learning journey</div>
        <div style={styles.sectionSub}>
          Foundation se shuru karo — job tak pahuncho
        </div>
        <div style={styles.roadSteps}>
          <div style={styles.roadBox}>
            <div style={styles.roadNum}>Step 1</div>
            <div style={styles.roadTitle}>Foundation</div>
            <div style={styles.roadDesc}>Basics, loops, arrays</div>
          </div>
          <div style={styles.roadArrow}>→</div>
          <div style={styles.roadBox}>
            <div style={styles.roadNum}>Step 2</div>
            <div style={styles.roadTitle}>DSA</div>
            <div style={styles.roadDesc}>Trees, graphs, DP</div>
          </div>
          <div style={styles.roadArrow}>→</div>
          <div style={styles.roadBox}>
            <div style={styles.roadNum}>Step 3</div>
            <div style={styles.roadTitle}>Development</div>
            <div style={styles.roadDesc}>MERN / Java track</div>
          </div>
          <div style={styles.roadArrow}>→</div>
          <div style={styles.roadFinal}>
            <div style={styles.roadFinalText}>Job Ready!</div>
            <div style={styles.roadFinalSub}>Placement assured</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={styles.ctaH2}>
          Apni placement journey aaj se shuru karo!
        </h2>
        <p style={styles.ctaP}>
          Institute ke through free access — students ko kuch pay nahi karna
        </p>
        <button style={styles.btnWhite}>Get Started Free</button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLogo}>Competence Lab</div>
        <div style={styles.footerLinks}>
          <span style={styles.footerLink}>About</span>
          <span style={styles.footerLink}>Contact</span>
          <span style={styles.footerLink}>For Institutes</span>
          <span style={styles.footerLink}>Privacy</span>
        </div>
      </div>
    </div>
  )
}

export default Home
