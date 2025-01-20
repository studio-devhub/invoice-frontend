import { Box, IconButton, Typography, styled } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import SlotCounter from "react-slot-counter";
import * as Yup from "yup";
import ActivitySection from "./ActivitySection";
import ItemList from "./ItemList";
import { formatCurrency } from "./PDFGenerator";

const validationSchema = Yup.object({
  invoiceNumber: Yup.string().required("Invoice Number is required"),
  issueDate: Yup.string().required("Issue Date is required"),
  dueDate: Yup.string().required("Due Date is required"),
  from: Yup.string().required("This field is mandatory"),
  to: Yup.string().required("This field is mandatory"),
  items: Yup.array().of(
    Yup.object({
      description: Yup.string().required("This field is mandatory"),
      quantity: Yup.number()
        // .positive("Quantity must be positive")
        .required("Quantity is required"),
      price: Yup.number()
        // .positive("Price must be positive")
        .required("Price is required"),
    })
  ),
});

interface InvoiceProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const InvoiceForm: React.FC<InvoiceProps> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  const initialValues = {
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    from: "",
    to: "",
    paymentDetails: "",
    additionalNotes: "",
    vat: 0,
    items: [
      { description: "Sample Item", quantity: 40, price: 20, subtotal: 800 },
    ],
  };

  const calculateTotal = (items: any[], vat: number) =>
    items.reduce((total, item) => total + item.subtotal, 0) + vat;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      {(formik) => (
        <Form>
          <ActivitySection
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            formik={formik}
          />
          <AppContainer>
            {/* Invoice Number, Issue Date, Due Date */}
            <FieldAlongside minHeight={"35px"}>
              <FieldWrapper>
                <InlineField>
                  <label>Invoice no:</label>
                  <Field
                    name="invoiceNumber"
                    placeholder="0001"
                    className={
                      formik.errors.invoiceNumber &&
                      formik.touched.invoiceNumber
                        ? "required"
                        : ""
                    }
                  />
                </InlineField>
                <ErrorMessage
                  name="invoiceNumber"
                  component="div"
                  className="errorMsg"
                />
              </FieldWrapper>
              <FieldWrapper>
                <InlineField>
                  <label>Issue date:</label>
                  <Field
                    name="issueDate"
                    type="date"
                    className={
                      formik.errors.issueDate && formik.touched.issueDate
                        ? "required"
                        : ""
                    }
                  />
                </InlineField>
                <ErrorMessage
                  name="issueDate"
                  component="div"
                  className="errorMsg"
                />
              </FieldWrapper>
              <FieldWrapper>
                <InlineField>
                  <label>Due date:</label>
                  <Field
                    name="dueDate"
                    type="date"
                    className={
                      formik.errors.dueDate && formik.touched.dueDate
                        ? "required"
                        : ""
                    }
                  />
                </InlineField>
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="errorMsg"
                />
              </FieldWrapper>
            </FieldAlongside>

            {/* From and To */}
            <FieldAlongside minHeight={"155px"}>
              <FieldWrapper gap={"12px"}>
                <label>From</label>
                <Field
                  name="from"
                  as="textarea"
                  rows={5}
                  value={formik.values.from}
                  placeholder="Acme Inc.
List Island AB
Email: info@email.com
Phone: +1 (123) 456 7890
Address: 123 Main St, Anytown, USA"
                  className={
                    formik.errors.from && formik.touched.from ? "required" : ""
                  }
                />
                <ErrorMessage
                  name="from"
                  component="div"
                  className="errorMsg bdt"
                />
              </FieldWrapper>
              <FieldWrapper gap={"12px"}>
                <label>To</label>
                <Field
                  name="to"
                  as="textarea"
                  rows={5}
                  value={formik.values.to}
                  placeholder="Acme Inc.
List Island AB
Email: info@email.com
Phone: +1 (123) 456 7890
Address: 123 Main St, Anytown, USA"
                  className={
                    formik.errors.from && formik.touched.to ? "required" : ""
                  }
                />
                <ErrorMessage
                  name="to"
                  component="div"
                  className="errorMsg bdt"
                />
              </FieldWrapper>
            </FieldAlongside>

            {/* Item List */}
            <ItemList
              formik={formik}
              items={formik.values.items}
              setFieldValue={formik.setFieldValue}
            />

            <SummarySection>
              <VatSection>
                <label>VAT</label>
                <CurrencyInput
                  id="vat"
                  name="vat"
                  placeholder="VAT"
                  defaultValue={formik.values.vat}
                  decimalsLimit={2}
                  prefix="$"
                  onValueChange={(value) =>
                    formik.setFieldValue("vat", parseFloat(value || "0"))
                  }
                />
              </VatSection>
              <Summary>
                <label>Total</label>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={"1.25rem"}
                    mr={"2px"}
                    mt={"1px"}
                  >
                    $
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    fontSize={"1.25rem"}
                  >
                    <SlotCounter
                      value={formatCurrency(
                        calculateTotal(formik.values.items, formik.values.vat),
                        "USD",
                        false,
                        true
                      )}
                      autoAnimationStart={false}
                    />
                  </Typography>
                </Box>
              </Summary>
            </SummarySection>

            {/* Payment Details and Additional Notes */}
            <FieldAlongside mb={"30px"}>
              <FieldWrapper width={"50%"} gap={"12px"}>
                <label>Payment Details</label>
                <Field
                  name="paymentDetails"
                  as="textarea"
                  rows={5}
                  value={formik.values.paymentDetails}
                  placeholder="SEB Bank
IBAN: 123 123 123 123"
                />
              </FieldWrapper>
              <FieldWrapper width={"50%"} gap={"12px"}>
                <label>Additional Notes</label>
                <Field
                  name="additionalNotes"
                  as="textarea"
                  rows={5}
                  value={formik.values.additionalNotes}
                  placeholder="Thank you for your business"
                />
              </FieldWrapper>
            </FieldAlongside>
          </AppContainer>
        </Form>
      )}
    </Formik>
  );
};

export default InvoiceForm;

const AppContainer = styled(Box)(({ theme }) => [
  {
    display: "flex",
    flexDirection: "column",
    gap: "4.2rem",
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
    "& .errorMsg": {
      color: "#ef4444",
      fontSize: "11px",
      "&.bdt": {
        paddingTop: "3px",
        marginTop: "-8px",
        borderTop: "1px solid #f0cdcd",
      },
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
const FieldAlongside = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  "&.boldLabel label": {
    fontWeight: 600,
  },
}));
const FieldWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
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
const InlineField = styled(Box)(() => ({
  display: "flex",
  gap: "3px",
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
