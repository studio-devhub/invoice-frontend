import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

// Define the props for PDFGenerator
interface PDFGeneratorProps {
  formData: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    from: string;
    to: string;
    paymentDetails: string;
    additionalNotes: string;
    vat: number;
    items: {
      description: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
  };
}

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 40, display: "flex", flexDirection: "column", gap: "60px" },
  InfoAlongside: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: "12px",
    lineHeight: "16px",
  },
  firstHalf: {
    display: "flex",
    width: "50%",
    paddingRight: "10px",
    flexWrap: "wrap",
  },
  secondHalf: {
    display: "flex",
    width: "50%",
    paddingLeft: "10px",
    flexWrap: "wrap",
  },
  oneThird: {
    display: "flex",
    width: "33.333333%",
    flexWrap: "wrap",
  },
  InfoTitle: {
    fontSize: "13px",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  tableWrap: { marginBottom: 0 },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 5,
    borderBottom: "1px solid black",
    marginBottom: 5,
    fontSize: 11,
  },
  tableRow: { flexDirection: "row", marginBottom: 5, fontSize: 10 },
  tableCell: { flex: 1, fontSize: 10 },
  firstChild: { width: "49%", textAlign: "left" },
  otherChild: { width: "17%", textAlign: "right" },
  summarySection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    fontSize: "12px",
    lineHeight: "16px",
  },
  vatSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    fontSize: "12px",
    lineHeight: "16px",
    paddingBottom: 5,
    borderBottom: "1px solid black",
  },
  summary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    fontSize: "16px",
    lineHeight: "16px",
    marginTop: 5,
    fontWeight: "bold",
  },
});

export const formatCurrency = (
  amount: number,
  currency: string,
  showSymbol?: boolean,
  showDeci?: boolean
): string => {
  return new Intl.NumberFormat(currency === "BDT" ? "en-BD" : "en-US", {
    style: showSymbol ? "currency" : "decimal",
    currency: currency,
    minimumFractionDigits: showDeci ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ formData }) => {
  const calculateTotal = () =>
    formData.items.reduce((total, item) => total + item.subtotal, 0) +
    formData.vat;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.InfoAlongside}>
          <Text style={styles.oneThird}>
            Invoice Number: {formData.invoiceNumber}
          </Text>
          <Text>Issue Date: {formData.issueDate}</Text>
          <Text>Due Date: {formData.dueDate}</Text>
        </View>

        <View style={styles.InfoAlongside}>
          <View style={styles.firstHalf}>
            <Text style={styles.InfoTitle}>From:</Text>
            <Text>{formData.from}</Text>
          </View>
          <View style={styles.secondHalf}>
            <Text style={styles.InfoTitle}>To:</Text>
            <Text>{formData.to}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.tableWrap}>
          <View style={styles.tableHeader}>
            <Text style={styles.firstChild}>Description</Text>
            <Text style={styles.otherChild}>Quantity</Text>
            <Text style={styles.otherChild}>Price</Text>
            <Text style={styles.otherChild}>Total</Text>
          </View>
          {formData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.otherChild}>{item.quantity}</Text>
              <Text style={styles.otherChild}>
                {formatCurrency(item.price, "USD", true, false)}
              </Text>
              <Text style={styles.otherChild}>
                {formatCurrency(item.subtotal, "USD", true, false)}
              </Text>
            </View>
          ))}
        </View>

        {/* VAT and Total */}
        <View style={styles.summarySection}>
          {/* <View style={styles.firstHalf}></View> */}
          <View style={styles.secondHalf}>
            <View style={styles.vatSection}>
              <Text>VAT:</Text>
              <Text>{formatCurrency(formData.vat, "USD", true, false)}</Text>
            </View>
            <View style={styles.summary}>
              <Text>Total: </Text>
              <Text>{formatCurrency(calculateTotal(), "USD", true, true)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.InfoAlongside}>
          <View style={styles.firstHalf}>
            <Text style={styles.InfoTitle}>Payment Details:</Text>
            <Text>{formData.paymentDetails}</Text>
          </View>
          <View style={styles.secondHalf}>
            <Text style={styles.InfoTitle}>Additional Notes:</Text>
            <Text>{formData.additionalNotes}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFGenerator;
