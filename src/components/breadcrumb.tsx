import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  action?: React.ReactNode
  className?: string
}

export default function Breadcrumb({ items, action, className = "" }: BreadcrumbProps) {
  // Always prepend Home as root breadcrumb item
  const allItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...items,
  ]

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center justify-between flex-wrap gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 mb-6 sm:mb-8 md:mb-10 border-b border-zinc-200 dark:border-white/10 text-xs font-mono ${className}`}
    >
      <ol className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3 w-3 text-zinc-400 dark:text-zinc-600 shrink-0"
                />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-semibold text-zinc-900 dark:text-white truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors shrink-0"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>

      {action && <div className="flex items-center gap-2 shrink-0 max-sm:w-full">{action}</div>}
    </nav>
  )
}
