import Link from "next/link";
import { Briefcase } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getTheme } from "@/lib/theme-server";
import { getCurrentUser } from "@/lib/auth";
import { listNotifications, unreadCount } from "@/lib/notifications/service";
import { NavLinks } from "./nav-links";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

export async function Navbar() {
  const [dict, locale, theme, user] = await Promise.all([
    getDictionary(),
    getLocale(),
    getTheme(),
    getCurrentUser()
  ]);

  let bell = null;
  if (user) {
    const [items, unread] = await Promise.all([
      listNotifications(10).catch(() => []),
      unreadCount().catch(() => 0)
    ]);
    bell = <NotificationBell items={items} unread={unread} labels={dict.notifications} />;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:gap-6">
        {/* Left: hamburger (mobile) + logo + primary nav (LinkedIn/Indeed style) */}
        <div className="flex items-center gap-2 md:gap-8">
          <MobileMenu labels={dict.nav} />

          <Link href="/" className="flex items-center gap-2" aria-label="İş Cibində">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-fg">
              <Briefcase className="h-4 w-4" />
            </span>
            <span className="hidden font-display text-lg font-bold tracking-tight text-ink sm:inline">
              İş Cibində
            </span>
          </Link>

          <NavLinks className="hidden md:flex" labels={dict.nav} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle current={theme} label={dict.common.themeLabel} />
          <LanguageSwitcher current={locale} label={dict.common.languageLabel} />
          {bell}
          <SignedIn>
            <ButtonLink href="/dashboard" variant="secondary" size="sm">
              {dict.nav.dashboard}
            </ButtonLink>
            <UserButton
              appearance={{ elements: { avatarBox: "h-8 w-8" } }}
              userProfileMode="navigation"
              userProfileUrl="/dashboard/candidate/profile"
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink sm:block"
            >
              {dict.nav.signIn}
            </Link>
            <ButtonLink href="/sign-up" size="sm">
              {dict.nav.signUp}
            </ButtonLink>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
