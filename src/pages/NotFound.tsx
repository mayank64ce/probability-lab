import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function NotFound() {
  return (
    <Card>
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
        That route does not exist.
      </p>
      <Link to="/" className="mt-4 inline-block">
        <Button variant="secondary">Back to dashboard</Button>
      </Link>
    </Card>
  );
}
