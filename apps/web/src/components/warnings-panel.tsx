import { AlertCircle } from "lucide-react";

import { Card } from "@bibliogost/ui";

interface WarningsPanelProps {
  warnings: string[];
}

export default function WarningsPanel({ warnings }: WarningsPanelProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5 p-4">
      <div className="flex gap-3">
        <AlertCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
        <div className="space-y-1">
          <h3 className="text-foreground text-sm font-semibold">Внимание</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            {warnings.map((warning, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
