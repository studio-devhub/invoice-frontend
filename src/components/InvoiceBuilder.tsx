import { Box, IconButton, styled, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import SlotCounter from "react-slot-counter";
import { numberToCurrency } from "../utils/helper";
import { Invoice } from "../utils/types";
import ItemList from "./ItemList";

interface InvoiceBuilderProps {
  invoice: Invoice;
  setInvoice: any;
  hitBtn: boolean;
}

const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({
  invoice,
  setInvoice,
  hitBtn,
}) => {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInvoice((prev: Invoice) => ({ ...prev, [name]: value }));
  };

  const getTotal = () => {
    const totalBeforeVAT = invoice.items.reduce(
      (acc: any, item: any) => acc + item.total,
      0
    );
    return totalBeforeVAT + parseFloat(`${invoice.vat}`);
  };

  return (
    <AppContainer>
      <FieldInliner>
        <FieldWrapper>
          <label>Invoice no:</label>
          <input
            type="text"
            name="invoiceNumber"
            placeholder="0001"
            value={invoice.invoiceNumber}
            onChange={handleInputChange}
            className={`input-field ${
              !hitBtn && !invoice.dueDate ? "" : "required"
            }`}
          />
        </FieldWrapper>
        <FieldWrapper>
          <label>Issue date:</label>
          <input
            type="date"
            name="issueDate"
            value={invoice.issueDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            className={`input-field ${
              !hitBtn && !invoice.issueDate ? "" : "required"
            }`}
          />
        </FieldWrapper>
        <FieldWrapper>
          <label>Due date:</label>
          <input
            type="date"
            name="dueDate"
            value={invoice.dueDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            className={`input-field ${
              !hitBtn && !invoice.dueDate ? "" : "required"
            }`}
          />
        </FieldWrapper>
      </FieldInliner>

      <FieldInliner className="boldLabel">
        <FieldWrapper sx={{ flexDirection: "column", gap: "10px" }}>
          <label>From</label>
          <textarea
            name="from"
            placeholder="Acme Inc.
List Island AB
Email: info@email.com
Phone: +1 (123) 456 7890
Address: 123 Main St, Anytown, USA"
            rows={5}
            value={invoice.from}
            onChange={handleInputChange}
            className={`input-field ${
              !hitBtn && !invoice.from ? "" : "required"
            }`}
          />
        </FieldWrapper>
        <FieldWrapper sx={{ flexDirection: "column", gap: "12px" }}>
          <label>To</label>
          <textarea
            name="to"
            placeholder="Acme Inc.
List Island AB
Email: info@email.com
Phone: +1 (123) 456 7890
Address: 123 Main St, Anytown, USA"
            rows={5}
            value={invoice.to}
            onChange={handleInputChange}
            className={`input-field ${
              !hitBtn && !invoice.from ? "" : "required"
            }`}
          />
        </FieldWrapper>
      </FieldInliner>

      <ItemList invoice={invoice} setInvoice={setInvoice} hitBtn={hitBtn} />
      <SummarySection>
        <VatSection>
          <label>VAT</label>
          <input
            type="number"
            name="vat"
            value={invoice.vat}
            onChange={handleInputChange}
            className="input-field"
          />
        </VatSection>
        <Summary>
          <label>Total</label>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography
              variant="body1"
              fontWeight={500}
              fontSize={"1.23rem"}
              mr={"2px"}
              mt={"1px"}
            >
              US $
            </Typography>
            <Typography variant="body1" fontWeight={500} fontSize={"1.25rem"}>
              <SlotCounter
                value={numberToCurrency(getTotal())}
                autoAnimationStart={false}
              />
            </Typography>
          </Box>
        </Summary>
      </SummarySection>
      <FieldInliner>
        <FieldWrapper
          sx={{ flexDirection: "column", gap: "10px", width: "50%" }}
        >
          <label>Payment details</label>
          <textarea
            name="paymentDetails"
            placeholder="SEB Bank
IBAN: 123 123 123 123"
            rows={5}
            value={invoice.paymentDetails}
            onChange={handleInputChange}
            className="textarea"
          />
        </FieldWrapper>
        <FieldWrapper
          sx={{ flexDirection: "column", gap: "12px", width: "50%" }}
        >
          <label>Additional notes</label>
          <textarea
            name="additionalNotes"
            placeholder="Thank you for your business"
            value={invoice.additionalNotes}
            onChange={handleInputChange}
            className="textarea"
          />
        </FieldWrapper>
      </FieldInliner>
    </AppContainer>
  );
};

export default InvoiceBuilder;

const AppContainer = styled(Box)(({ theme }) => [
  {
    display: "flex",
    flexDirection: "column",
    gap: "5rem",
    padding: "2.5rem 2rem",
    borderRadius: "7px",
    backgroundColor: "#f4f4f566",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    "& input, & textarea": {
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      fontSize: "12px",
      fontWeight: 400,
    },
  },
  theme.applyStyles("dark", {
    backgroundColor: "#27272a66",
    borderColor: "#27272a",
    "& input, & textarea": {
      color: "#fafafa",
    },
  }),
]);
const FieldInliner = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  "&.boldLabel label": {
    fontWeight: 600,
  },
}));
const FieldWrapper = styled(Box)(() => ({
  display: "flex",
  gap: "3px",
  "& label": {
    display: "flex",
    fontWeight: 500,
  },
  "& input": {
    width: "95px",
  },
  "& textarea": {
    width: "250px",
    lineHeight: "1.25rem",
    resize: "none",
    padding: 0,
  },
}));
const SummarySection = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  "& > *": {
    width: "50%",
  },
  "& label": {
    fontWeight: 600,
  },
}));
const VatSection = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ccc",
  height: "25px",

  "& > input": {
    width: "80px",
    textAlign: "right",
  },
}));
const Summary = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
export const Btn = styled(IconButton)(() => ({
  display: "flex",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#e5e7eb",
  borderRadius: "7px",
  padding: "9px",
  "& svg": {
    width: "1rem",
    height: "1rem",
  },
  "&.dark": {
    backgroundColor: "#000",
    color: "#fff",
    borderColor: "#27272a",
  },
  "&.light": {
    backgroundColor: "#fff",
    color: "#000",
    borderColor: "#e5e7eb",
  },
}));
