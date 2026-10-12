import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function NotFound() {
  return (
    <Card>
      <h1 className="text-2xl font-extrabold">Page not found</h1>
      <p className="text-ink-muted mt-2">That route does not exist.</p>
      <Link to="/" className="mt-5 inline-block">
        <Button variant="secondary">Back to dashboard</Button>
      </Link>
    </Card>
  );
}
