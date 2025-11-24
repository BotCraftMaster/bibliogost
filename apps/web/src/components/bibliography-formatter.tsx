"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Copy, Download, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button, Card, Label, Spinner, Textarea } from "@bibliogost/ui";

import { useTRPC } from "~/trpc/react";
import WarningsPanel from "./warnings-panel";

export default function BibliographyFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [gostVersion, setGostVersion] = useState<"2018" | "2008">("2018");
  const [warnings, setWarnings] = useState<string[]>([]);
  const trpc = useTRPC();
  const processMutation = useMutation(
    trpc.citation.process.mutationOptions({
      onSuccess: (data) => {
        const formatted = data.results
          .map((r, idx) => `${idx + 1}. ${r.formatted}`)
          .join("\n");

        setOutput(formatted);

        const allWarnings = data.results.flatMap((r) => r.warnings);
        if (data.totalWarnings > 0) {
          allWarnings.unshift(
            `Обработано: ${data.totalSuccess}/${data.totalProcessed} ссылок`,
          );
        }
        setWarnings(allWarnings);

        toast.success("Обработка завершена успешно");
      },
      onError: () => {
        setWarnings([
          "Ошибка при обработке. Убедитесь, что GROBID сервер запущен.",
        ]);
        toast.error("Ошибка при обработке");
      },
    }),
  );

  const handleFormat = () => {
    if (!input.trim()) {
      return;
    }

    processMutation.mutate({
      text: input,
      style: gostVersion === "2018" ? "gost-2018" : "gost-2008",
    });
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(output);
    toast.success("Скопировано в буфер обмена");
  };

  const handleDownloadDocx = () => {
    toast.info("Функция скачивания DOCX будет доступна в ближайшее время");
  };

  const handleDownloadPdf = () => {
    toast.info("Функция скачивания PDF будет доступна в ближайшее время");
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="space-y-8">
        {/* Input Section */}
        <Card className="bg-card border p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="input-text"
                className="text-foreground text-sm font-semibold"
              >
                Вставьте список литературы
              </Label>
              <Textarea
                id="input-text"
                placeholder="Вставьте текст из Word, PDF или веб-сайта…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-48 resize-none text-base"
              />
              <p className="text-muted-foreground text-xs">
                Нумерация и лишние символы удаляются автоматически
              </p>
            </div>

            {/* Version Selector */}
            <div className="border-border flex flex-wrap items-center justify-between gap-4 border-t pt-2">
              <span className="text-foreground text-sm font-medium">
                Версия стандарта:
              </span>
              <div className="flex gap-2">
                <Button
                  variant={gostVersion === "2018" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGostVersion("2018")}
                  className="font-medium"
                >
                  ГОСТ 2018
                </Button>
                <Button
                  variant={gostVersion === "2008" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGostVersion("2008")}
                  className="font-medium"
                >
                  ГОСТ 2008
                </Button>
              </div>
            </div>

            {/* Format Button */}
            <Button
              onClick={handleFormat}
              disabled={!input.trim() || processMutation.isPending}
              size="lg"
              className="w-full font-semibold sm:w-auto"
            >
              {processMutation.isPending ? (
                <>
                  <Spinner />
                  Обработка…
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Преобразовать
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Warnings */}
        {warnings.length > 0 && <WarningsPanel warnings={warnings} />}

        {/* Output Section */}
        {output && (
          <Card className="bg-card border p-6 sm:p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="output-text"
                  className="text-foreground text-sm font-semibold"
                >
                  Готовый список
                </Label>
                <Textarea
                  id="output-text"
                  value={output}
                  readOnly
                  className="bg-muted min-h-48 resize-none text-base"
                />
              </div>

              {/* Export Buttons */}
              <div className="border-border flex flex-wrap gap-2 border-t pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2 bg-transparent"
                >
                  <Copy className="h-4 w-4" />
                  Копировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadDocx}
                  className="gap-2 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  .docx
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  className="gap-2 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  .pdf
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
