'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Palette,
  LayoutTemplate,
  Settings,
  Layers,
  ExternalLink,
} from 'lucide-react'
import styles from './sidebar.module.css'

const NAV = [
  {
    group: 'Build',
    items: [
      { href: '/tokens', label: 'Tokens', icon: Palette },
      { href: '/components', label: 'Components', icon: Layers },
      { href: '/preview', label: 'Preview', icon: LayoutTemplate },
    ],
  },
  {
    group: 'Project',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoMark}>DS</span>
        <span className={styles.logoText}>Builder</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map((group) => (
          <div key={group.group} className={styles.group}>
            <span className={styles.groupLabel}>{group.group}</span>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.navItem} ${active ? styles.active : ''}`}
                >
                  <Icon size={14} strokeWidth={1.8} />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className={styles.footerLink}
        >
          <ExternalLink size={12} />
          Docs
        </a>
        <span className={styles.version}>v0.0.0</span>
      </div>
    </aside>
  )
}
