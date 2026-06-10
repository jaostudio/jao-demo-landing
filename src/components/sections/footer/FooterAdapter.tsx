import Link from "next/link";

interface Props {
  name: string;
  email?: string;
  phone?: string;
}

export function FooterAdapter({ name, email, phone }: Props) {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-12 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{name}</h3>
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-2 block text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                {email}
              </a>
            )}
            {phone && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{phone}</p>
            )}
          </div>
          <div className="md:col-span-2 flex items-end justify-end gap-6">
            <Link href="/privacy" className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300">
              Terms of Service
            </Link>
            <p className="text-xs text-neutral-400 dark:text-neutral-600">
              &copy; {new Date().getFullYear()} {name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
