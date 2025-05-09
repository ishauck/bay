import authClient from "@/lib/auth-client";
import { useParams, usePathname, useRouter } from "next/navigation";

export function useCurrentOrganization() {
  const orgId = useCurrentOrganizationSlug();
  const data = authClient.useListOrganizations();

  if (orgId && data.data) {
    const elem = data.data?.find((o) => o.slug === orgId);
    return {
      ...data,
      data: elem,
    };
  }


  return {
    ...data,
    data: null,
  };
}

export function useCurrentOrganizationSlug() {
  const { org } = useParams<{ org: string }>();
  return org;
}

export function useSetCurrentOrganizationSlug() {
    const router = useRouter();
    const pathname = usePathname();

    return (orgSlug: string) => {
        const parts = pathname.split('/app/');
        if (parts.length > 1) {
            const remainingPath = parts[1].split('/').slice(1).join('/');
            router.push(`/app/${orgSlug}/${remainingPath}`);
        } else {
            router.push(`/app/${orgSlug}`);
        }
    };
}