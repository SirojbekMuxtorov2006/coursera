"use client";

import { useState, useCallback } from "react";
import { Play, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadPyodide } from "pyodide";

interface CodePlaygroundProps {
  defaultCode?: string;
  language?: "javascript" | "python";
}

export function CodePlayground({
  defaultCode = '// Write your code here\nconsole.log("Hello, World!");',
  language = "javascript",
}: CodePlaygroundProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);

    try {
      if (language === "javascript") {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: unknown[]) => {
          logs.push(args.map(String).join(" "));
        };

        try {
          const fn = new Function(code);
          fn();
        } catch (err) {
          logs.push(`Error: ${err instanceof Error ? err.message : String(err)}`);
        }

        console.log = originalLog;
        setOutput(logs);
      } else {
        setPyodideLoading(true);
        const py = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/",
        });
        setPyodideReady(true);

        // capture stdout
        const out: string[] = [];
        py.setStdout({
          batched: (s: string) => {
            if (s.trim().length) out.push(s.trimEnd());
          },
        });
        py.setStderr({
          batched: (s: string) => {
            if (s.trim().length) out.push(`Error: ${s.trimEnd()}`);
          },
        });

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await py.runPythonAsync(code);
        } catch (err) {
          out.push(`Error: ${err instanceof Error ? err.message : String(err)}`);
        }

        setOutput(out.length ? out : ["(no output)"]);
      }
    } catch (err) {
      setOutput([`Error: ${err instanceof Error ? err.message : String(err)}`]);
    } finally {
      setPyodideLoading(false);
      setIsRunning(false);
    }
  }, [code, language]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(defaultCode);
    setOutput([]);
  };

  return (
    <div className="rounded-xl border overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            {language === "javascript" ? "script.js" : "script.py"}
          </span>
          {language === "python" && (
            <span className="text-xs text-muted-foreground ml-2">
              {pyodideLoading ? "Loading Python..." : pyodideReady ? "Pyodide ready" : "Pyodide"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={copyCode} className="h-7 gap-1.5">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCode} className="h-7 gap-1.5">
            <RotateCcw className="h-3 w-3" />
            <span className="text-xs">Reset</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={runCode}
            disabled={isRunning}
            className="h-7 gap-1.5"
          >
            <Play className="h-3 w-3" />
            <span className="text-xs">{isRunning ? "Running..." : "Run"}</span>
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="grid md:grid-cols-2 divide-x">
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 bg-[#0d1117] text-[#c9d1d9] font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-[#0d1117] p-4 h-64 overflow-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 font-mono">
            <span>OUTPUT</span>
          </div>
          {output.length === 0 ? (
            <p className="text-xs text-muted-foreground font-mono">
              Click &quot;Run&quot; to execute your code...
            </p>
          ) : (
            <div className="space-y-1">
              {output.map((line, i) => (
                <pre
                  key={i}
                  className={cn(
                    "text-sm font-mono whitespace-pre-wrap",
                    line.startsWith("Error")
                      ? "text-red-400"
                      : "text-emerald-400"
                  )}
                >
                  {line}
                </pre>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
