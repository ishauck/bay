import { FormShareMenu } from "@/components/form/form-share-menu";

export default function FormLayout({ children }: { children: React.ReactNode }) {
    return <div>
        {children}
        <FormShareMenu />
    </div>;
}