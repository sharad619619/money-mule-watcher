import Papa from "papaparse";

export interface Transaction {
  transaction_id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  timestamp: Date;
}

export interface ParseResult {
  transactions: Transaction[];
  errors: string[];
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const errors: string[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const transactions: Transaction[] = [];

        results.data.forEach((row: unknown, i: number) => {
          const r = row as Record<string, string>;
          const lineNum = i + 2;

          if (!r.transaction_id || !r.sender_id || !r.receiver_id) {
            errors.push(`Row ${lineNum}: Missing required fields`);
            return;
          }

          const amount = parseFloat(r.amount);
          if (isNaN(amount)) {
            errors.push(`Row ${lineNum}: Invalid amount "${r.amount}"`);
            return;
          }

          const timestamp = new Date(r.timestamp);
          if (isNaN(timestamp.getTime())) {
            errors.push(`Row ${lineNum}: Invalid timestamp "${r.timestamp}"`);
            return;
          }

          transactions.push({
            transaction_id: r.transaction_id.trim(),
            sender_id: r.sender_id.trim(),
            receiver_id: r.receiver_id.trim(),
            amount,
            timestamp,
          });
        });

        resolve({ transactions, errors });
      },
      error: (err) => {
        resolve({ transactions: [], errors: [`Parse error: ${err.message}`] });
      },
    });
  });
}
