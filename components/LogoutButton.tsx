import useUser from "../lib/useUser";
import { useRouter } from "next/router";
import fetchJson from "../lib/fetchJson";
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

export default function LogoutButton() {
  const { mutateUser } = useUser();
  const router = useRouter();

  return (
    <>
      <Button
        component={Link}
        variant="outlined"
        href="/api/logout"
        onClick={async (e) => {
          e.preventDefault();
          mutateUser(
            await fetchJson("/api/logout", { method: "POST" }),
            false,
          );
          router.push("/");
        }}
      >
        Logout
      </Button>
    </>
  );
}
