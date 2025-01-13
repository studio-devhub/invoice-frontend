import { jsPDF } from "jspdf";
import { useState } from "react";
// import { Invoice, Item } from "./types";
import {
  Box,
  createTheme,
  CssBaseline,
  styled,
  ThemeProvider,
} from "@mui/material";
import "./App.css";
import InvoiceBuilder, { Btn } from "./components/InvoiceBuilder";
import DayIcon from "./components/svg-component/DayIcon";
import DownloadIcon from "./components/svg-component/DownloadIcon";
import NightIcon from "./components/svg-component/NightIcon";
import { numberToCurrency } from "./utils/helper";
import { Invoice } from "./utils/types";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    from: "",
    to: "",
    items: [
      {
        id: "1",
        description: "Development",
        quantity: 40,
        price: 20,
        total: 800.0,
      },
    ],
    vat: 0,
    paymentDetails: "",
    additionalNotes: "",
  });

  const [hitBtn, setHitBtn] = useState(false);

  const validateForm = () => {
    const requiredFields = [
      "invoiceNumber",
      "issueDate",
      "dueDate",
      "from",
      "to",
    ];
    const hasErrors = requiredFields.some(
      (field) => !invoice[field as keyof typeof invoice]
    );
    const hasItemErrors = invoice.items.some((item) => !item.description);

    return !hasErrors && !hasItemErrors;
  };

  const createPDF = (): void => {
    setHitBtn(true);
    if (!validateForm()) return;

    const doc = new jsPDF();

    // Add title
    // doc.setFontSize(18);
    // doc.text("Invoice", 20, 20);

    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 15, 15);
    doc.text(`Issue Date: ${invoice.issueDate}`, 90, 15);
    doc.text(`Due Date: ${invoice.dueDate}`, 155, 15);

    // From and To sections
    doc.setFontSize(13);
    doc.text("From:", 15, 40);
    doc.text("To:", 120, 40);

    doc.setFontSize(12);
    doc.text(`${invoice.from}`, 15, 47);
    doc.text(`${invoice.to}`, 120, 47);

    // Add item table headers
    doc.setFontSize(13);
    doc.text("Description", 15, 100);
    doc.text("Quantity", 120, 100);
    doc.text("Price", 150, 100);
    doc.text("Total", 180, 100);

    doc.setFontSize(12);
    let y = 110;
    invoice.items.forEach((item) => {
      doc.text(item.description, 15, y);
      doc.text(`${item.quantity}`, 122, y);
      doc.text(`${item.price}`, 152, y);
      doc.text(`${item.total}`, 182, y);
      y += 8;
    });

    // Add VAT
    const totalBeforeVAT = invoice.items.reduce(
      (acc, item) => acc + item.total,
      0
    );

    y += 15;
    doc.setFontSize(13);
    doc.text(`VAT:`, 140, y);
    doc.text(`${invoice.vat}`, 172, y);

    // Add total With VAT
    y += 10;
    doc.setFontSize(15);
    doc.text(`Total:`, 140, y);
    doc.text(
      `${numberToCurrency(totalBeforeVAT + parseFloat(`${invoice.vat}`), "$")}`,
      172,
      y
    );

    // Payment details and additional notes
    y += 30;
    doc.setFontSize(13);
    doc.text(`Payment Details:`, 15, y);
    doc.text(`Additional Notes:`, 120, y);

    y += 8;
    doc.setFontSize(12);
    doc.text(invoice.paymentDetails, 15, y);
    doc.text(invoice.additionalNotes, 120, y);

    // Open PDF in a new tab
    // const pdfUrl = doc.output("bloburl");
    // window.open(pdfUrl, "_blank");
    doc.save("invoice.pdf");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BodyWraper>
        <AppWrapper>
          <Activities>
            <Btn
              disableRipple
              onClick={createPDF}
              className={isDarkMode ? "light" : "dark"}
            >
              <DownloadIcon />
            </Btn>
            <Btn
              disableRipple
              onClick={toggleDarkMode}
              className={isDarkMode ? "dark" : "light"}
            >
              {isDarkMode ? <NightIcon /> : <DayIcon />}
            </Btn>
          </Activities>

          <InvoiceBuilder
            invoice={invoice}
            setInvoice={setInvoice}
            hitBtn={hitBtn}
          />
          <footer>
            <p>&copy; 2025 Invoice Builder</p>
          </footer>
        </AppWrapper>
      </BodyWraper>
    </ThemeProvider>
  );
}

export default App;

const BodyWraper = styled(Box)(() => ({
  display: "flex",
  padding: "2rem",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 400,
}));
const AppWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "700px",
}));
const Activities = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  position: "fixed",
  transform: "translate(-100%)",
  paddingRight: "1.25rem",
}));
