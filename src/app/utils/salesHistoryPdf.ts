import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import notoSansJapaneseUrl from "@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff?url";
import type { Sale } from "../types";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const PAGE_MARGIN = 42;
const TABLE_HEADER_HEIGHT = 20;
const ROW_HEIGHT = 18;
const TEXT_COLOR = rgb(0.08, 0.08, 0.08);
const MUTED_TEXT_COLOR = rgb(0.32, 0.32, 0.32);
const BORDER_COLOR = rgb(0.72, 0.72, 0.72);
const HEADER_FILL = rgb(0.94, 0.94, 0.94);

type SalesHistoryPdfFilters = {
  searchQuery: string;
  paymentMethod: "all" | "cash" | "qr";
  dateFrom: string;
  dateTo: string;
};

type SalesHistoryPdfOptions = {
  sales: Sale[];
  filters: SalesHistoryPdfFilters;
};

const formatCurrency = (amount: number) => `¥${amount.toLocaleString("ja-JP")}`;

const formatDateTime = (timestamp: Date | string) =>
  new Date(timestamp).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const truncateText = (
  font: PDFFont,
  text: string,
  maxWidth: number,
  size: number
) => {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;

  const ellipsis = "…";
  let result = "";

  for (const character of Array.from(text)) {
    const next = result + character;
    if (font.widthOfTextAtSize(next + ellipsis, size) > maxWidth) break;
    result = next;
  }

  return `${result}${ellipsis}`;
};

const drawRightAlignedText = (
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  width: number,
  size: number,
  font: PDFFont,
  color = TEXT_COLOR
) => {
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: x + width - textWidth, y, size, font, color });
};

const buildFilterSummary = (filters: SalesHistoryPdfFilters) => {
  const conditions: string[] = [];

  if (filters.dateFrom || filters.dateTo) {
    conditions.push(
      `期間: ${filters.dateFrom || "開始指定なし"} 〜 ${filters.dateTo || "終了指定なし"}`
    );
  } else {
    conditions.push("期間: 全期間");
  }

  if (filters.searchQuery) conditions.push(`商品名: ${filters.searchQuery}`);
  if (filters.paymentMethod !== "all") {
    conditions.push(
      `決済方法: ${filters.paymentMethod === "cash" ? "現金" : "QR"}`
    );
  }

  return conditions.join(" / ");
};

export async function createSalesHistoryPdf({
  sales,
  filters,
}: SalesHistoryPdfOptions) {
  const fontResponse = await fetch(notoSansJapaneseUrl);
  if (!fontResponse.ok) throw new Error("PDF用フォントを読み込めませんでした。");

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(await fontResponse.arrayBuffer(), {
    subset: true,
  });

  const completedSales = sales.filter((sale) => !sale.isCancelled);
  const itemCount = completedSales.reduce(
    (total, sale) =>
      total + sale.items.reduce((count, item) => count + item.quantity, 0),
    0
  );
  const totalRevenue = completedSales.reduce((total, sale) => total + sale.total, 0);
  const filterSummary = buildFilterSummary(filters);
  const outputDate = formatDateTime(new Date());
  const columns = [
    { key: "date", label: "日時", width: 94 },
    { key: "name", label: "商品名", width: 208 },
    { key: "quantity", label: "数量", width: 38 },
    { key: "payment", label: "決済方法", width: 70 },
    { key: "amount", label: "金額", width: 101 },
  ] as const;

  let page: PDFPage;
  let cursorY = 0;

  const drawTableHeader = () => {
    const tableTop = cursorY;
    let x = PAGE_MARGIN;

    page.drawRectangle({
      x,
      y: tableTop - TABLE_HEADER_HEIGHT,
      width: A4_WIDTH - PAGE_MARGIN * 2,
      height: TABLE_HEADER_HEIGHT,
      color: HEADER_FILL,
      borderColor: BORDER_COLOR,
      borderWidth: 0.5,
    });

    columns.forEach((column) => {
      page.drawText(column.label, {
        x: x + 4,
        y: tableTop - 14,
        size: 8,
        font,
        color: TEXT_COLOR,
      });
      x += column.width;
    });

    cursorY -= TABLE_HEADER_HEIGHT;
  };

  const addPage = (includeSummary: boolean) => {
    page = pdf.addPage([A4_WIDTH, A4_HEIGHT]);
    cursorY = A4_HEIGHT - PAGE_MARGIN;

    page.drawText("Liveppon 販売履歴", {
      x: PAGE_MARGIN,
      y: cursorY - 2,
      size: includeSummary ? 18 : 12,
      font,
      color: TEXT_COLOR,
    });

    if (includeSummary) {
      cursorY -= 30;
      page.drawText(`出力日時: ${outputDate}`, {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 8,
        font,
        color: MUTED_TEXT_COLOR,
      });
      cursorY -= 14;
      page.drawText(truncateText(font, filterSummary, 500, 8), {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 8,
        font,
        color: MUTED_TEXT_COLOR,
      });
      cursorY -= 24;
      page.drawText(
        `取引件数: ${sales.length}件    販売点数: ${itemCount}点    売上合計: ${formatCurrency(totalRevenue)}`,
        {
          x: PAGE_MARGIN,
          y: cursorY,
          size: 10,
          font,
          color: TEXT_COLOR,
        }
      );
      cursorY -= 20;
    } else {
      cursorY -= 22;
      page.drawText(`出力日時: ${outputDate}`, {
        x: PAGE_MARGIN,
        y: cursorY,
        size: 8,
        font,
        color: MUTED_TEXT_COLOR,
      });
      cursorY -= 18;
    }

    drawTableHeader();
  };

  const ensureRowSpace = (requiredHeight: number) => {
    if (cursorY - requiredHeight >= PAGE_MARGIN) return;
    addPage(false);
  };

  const drawDetailRow = ({
    date,
    name,
    quantity,
    payment,
    amount,
    muted = false,
  }: {
    date: string;
    name: string;
    quantity: string;
    payment: string;
    amount: string;
    muted?: boolean;
  }) => {
    ensureRowSpace(ROW_HEIGHT);
    const rowBottom = cursorY - ROW_HEIGHT;
    const color = muted ? MUTED_TEXT_COLOR : TEXT_COLOR;
    const values = [date, name, quantity, payment, amount];
    let x = PAGE_MARGIN;

    page.drawRectangle({
      x,
      y: rowBottom,
      width: A4_WIDTH - PAGE_MARGIN * 2,
      height: ROW_HEIGHT,
      borderColor: BORDER_COLOR,
      borderWidth: 0.35,
    });

    values.forEach((value, index) => {
      const column = columns[index];
      const text = truncateText(font, value, column.width - 8, 8);
      if (column.key === "quantity" || column.key === "amount") {
        drawRightAlignedText(page, text, x + 4, rowBottom + 5, column.width - 8, 8, font, color);
      } else {
        page.drawText(text, {
          x: x + 4,
          y: rowBottom + 5,
          size: 8,
          font,
          color,
        });
      }
      x += column.width;
    });

    cursorY = rowBottom;
  };

  addPage(true);

  sales.forEach((sale) => {
    sale.items.forEach((item, index) => {
      const isFirstItem = index === 0;
      const paymentLabel = sale.paymentMethod === "cash" ? "現金" : "QR";
      drawDetailRow({
        date: isFirstItem ? formatDateTime(sale.timestamp) : "",
        name: item.name,
        quantity: String(item.quantity),
        payment: isFirstItem
          ? sale.isCancelled
            ? `${paymentLabel}（キャンセル）`
            : paymentLabel
          : "",
        amount: formatCurrency(item.price * item.quantity),
        muted: Boolean(sale.isCancelled),
      });
    });

    drawDetailRow({
      date: "",
      name: sale.isCancelled ? "キャンセル済み取引" : "取引合計",
      quantity: "",
      payment: "",
      amount: formatCurrency(sale.total),
      muted: Boolean(sale.isCancelled),
    });
  });

  const pages = pdf.getPages();
  pages.forEach((pdfPage, index) => {
    const label = `${index + 1} / ${pages.length}`;
    drawRightAlignedText(
      pdfPage,
      label,
      PAGE_MARGIN,
      22,
      A4_WIDTH - PAGE_MARGIN * 2,
      8,
      font,
      MUTED_TEXT_COLOR
    );
  });

  return pdf.save();
}
